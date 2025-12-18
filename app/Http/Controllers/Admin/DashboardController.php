<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ContactMessage;
use App\Models\FeatureCard;
use App\Models\HeroSlide;
use App\Models\MembershipApplication;
use App\Models\Meeting;
use App\Models\TrustedCompany;
use Carbon\Carbon;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        // Basic stats
        $stats = [
            'heroSlides' => HeroSlide::count(),
            'featureCards' => FeatureCard::count(),
            'trustedCompanies' => TrustedCompany::count(),
            'membershipApplications' => MembershipApplication::count(),
            'totalMeetings' => Meeting::count(),
            'pendingApplications' => MembershipApplication::where('status', 'pending')->count(),
            'approvedMembers' => MembershipApplication::where('status', 'approved')->count(),
            'upcomingMeetings' => Meeting::where('status', 'scheduled')
                ->where('date', '>=', now())
                ->count(),
        ];

        // Membership applications for the last 7 days
        $applicationsData = [];
        for ($i = 6; $i >= 0; $i--) {
            $date = Carbon::now()->subDays($i);
            $applicationsData[] = [
                'date' => $date->format('M d'),
                'applications' => MembershipApplication::whereDate('created_at', $date)->count(),
                'approved' => MembershipApplication::whereDate('created_at', $date)
                    ->where('status', 'approved')
                    ->count(),
            ];
        }

        // Monthly applications for the last 6 months
        $monthlyApplications = [];
        for ($i = 5; $i >= 0; $i--) {
            $date = Carbon::now()->subMonths($i);
            $monthlyApplications[] = [
                'month' => $date->format('M Y'),
                'applications' => MembershipApplication::whereMonth('created_at', $date->month)
                    ->whereYear('created_at', $date->year)
                    ->count(),
                'approved' => MembershipApplication::whereMonth('created_at', $date->month)
                    ->whereYear('created_at', $date->year)
                    ->where('status', 'approved')
                    ->count(),
            ];
        }

        // Application status distribution
        $applicationsByStatus = [
            ['status' => 'Pending', 'count' => MembershipApplication::where('status', 'pending')->count(), 'fill' => 'hsl(var(--chart-1))'],
            ['status' => 'Approved', 'count' => MembershipApplication::where('status', 'approved')->count(), 'fill' => 'hsl(var(--chart-2))'],
            ['status' => 'Rejected', 'count' => MembershipApplication::where('status', 'rejected')->count(), 'fill' => 'hsl(var(--chart-3))'],
        ];

        // Recent membership applications
        $recentApplications = MembershipApplication::with('membershipType')
            ->latest()
            ->limit(10)
            ->get()
            ->map(function ($application) {
                return [
                    'id' => $application->id,
                    'name' => $application->name,
                    'email' => $application->email,
                    'membership_type' => $application->membershipType->name ?? 'N/A',
                    'status' => $application->status,
                    'created_at' => $application->created_at->format('M d, Y H:i'),
                    'created_at_diff' => $application->created_at->diffForHumans(),
                ];
            });

        // Recent activities (combine various model changes)
        $activities = collect();

        // Add recent membership applications as activities
        MembershipApplication::latest()->limit(5)->get()->each(function ($application) use ($activities) {
            $activities->push([
                'id' => 'application-'.$application->id,
                'type' => 'application',
                'title' => 'New membership application',
                'description' => "Application from {$application->name}",
                'status' => $application->status,
                'created_at' => $application->created_at,
                'time_ago' => $application->created_at->diffForHumans(),
            ]);
        });

        // Add recent meetings
        Meeting::latest()->limit(3)->get()->each(function ($meeting) use ($activities) {
            $activities->push([
                'id' => 'meeting-'.$meeting->id,
                'type' => 'meeting',
                'title' => 'Meeting scheduled',
                'description' => $meeting->meeting_type,
                'status' => $meeting->status,
                'created_at' => $meeting->created_at,
                'time_ago' => $meeting->created_at->diffForHumans(),
            ]);
        });

        // Add recent contact messages
        ContactMessage::latest()->limit(2)->get()->each(function ($message) use ($activities) {
            $activities->push([
                'id' => 'message-'.$message->id,
                'type' => 'message',
                'title' => 'New contact message',
                'description' => "Message from {$message->name}",
                'status' => $message->status,
                'created_at' => $message->created_at,
                'time_ago' => $message->created_at->diffForHumans(),
            ]);
        });

        // Sort by date and limit
        $recentActivities = $activities->sortByDesc('created_at')->take(10)->values();

        // Upcoming meetings
        $upcomingMeetings = Meeting::where('status', 'scheduled')
            ->where('date', '>=', now())
            ->orderBy('date')
            ->limit(5)
            ->get()
            ->map(function ($meeting) {
                return [
                    'id' => $meeting->id,
                    'meeting_type' => $meeting->meeting_type,
                    'date' => $meeting->date,
                    'time_slot' => $meeting->time_slot,
                    'attendee_name' => $meeting->name,
                    'attendee_email' => $meeting->email,
                ];
            });

        return Inertia::render('admin/dashboard', [
            'stats' => $stats,
            'applicationsData' => $applicationsData,
            'monthlyApplications' => $monthlyApplications,
            'applicationsByStatus' => $applicationsByStatus,
            'recentApplications' => $recentApplications,
            'recentActivities' => $recentActivities,
            'upcomingMeetings' => $upcomingMeetings,
        ]);
    }
}
