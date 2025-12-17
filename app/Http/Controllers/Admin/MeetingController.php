<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\CallbackRequest;
use App\Models\Meeting;
use App\Models\MeetingSlot;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MeetingController extends Controller
{
    /**
     * Display a listing of the meetings.
     */
    public function index(Request $request)
    {
        $query = Meeting::query()->latest();

        // Filter by status
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        // Filter by meeting type
        if ($request->filled('type')) {
            $query->where('meeting_type', $request->type);
        }

        // Filter by date range
        if ($request->filled('from_date')) {
            $query->whereDate('date', '>=', $request->from_date);
        }
        if ($request->filled('to_date')) {
            $query->whereDate('date', '<=', $request->to_date);
        }

        // Search by name or email
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%")
                    ->orWhere('phone', 'like', "%{$search}%");
            });
        }

        $meetings = $query->get();
        $callbacks = CallbackRequest::latest()->get();

        // Stats
        $stats = [
            'total_meetings' => Meeting::count(),
            'pending_meetings' => Meeting::pending()->count(),
            'confirmed_meetings' => Meeting::confirmed()->count(),
            'today_meetings' => Meeting::today()->count(),
            'total_callbacks' => CallbackRequest::count(),
            'pending_callbacks' => CallbackRequest::pending()->count(),
        ];

        return Inertia::render('admin/meetings/index', [
            'meetings' => $meetings,
            'callbacks' => $callbacks,
            'stats' => $stats,
            'filters' => $request->only(['status', 'type', 'from_date', 'to_date', 'search']),
        ]);
    }

    /**
     * Display the specified meeting.
     */
    public function show(Meeting $meeting)
    {
        return Inertia::render('admin/meetings/show', [
            'meeting' => $meeting,
        ]);
    }

    /**
     * Update the specified meeting.
     */
    public function update(Request $request, Meeting $meeting)
    {
        $validated = $request->validate([
            'status' => 'required|in:pending,confirmed,completed,cancelled',
            'admin_notes' => 'nullable|string|max:1000',
        ]);

        // Handle status changes
        $oldStatus = $meeting->status;
        $newStatus = $validated['status'];

        if ($oldStatus !== $newStatus) {
            switch ($newStatus) {
                case 'confirmed':
                    $meeting->confirm();
                    break;
                case 'completed':
                    $meeting->complete();
                    break;
                case 'cancelled':
                    $meeting->cancel();
                    break;
                default:
                    $meeting->update(['status' => $newStatus]);
            }
        }

        if (isset($validated['admin_notes'])) {
            $meeting->update(['admin_notes' => $validated['admin_notes']]);
        }

        return back()->with('success', 'Meeting updated successfully');
    }

    /**
     * Remove the specified meeting.
     */
    public function destroy(Meeting $meeting)
    {
        $meeting->delete();

        return back()->with('success', 'Meeting deleted successfully');
    }

    /**
     * Display meeting settings/availability.
     */
    public function settings()
    {
        $slots = MeetingSlot::orderBy('day_of_week')->orderBy('start_time')->get();

        return Inertia::render('admin/meetings/settings', [
            'slots' => $slots,
        ]);
    }

    /**
     * Store a new meeting slot.
     */
    public function storeSlot(Request $request)
    {
        $validated = $request->validate([
            'day_of_week' => 'required|integer|between:0,6',
            'start_time' => 'required|date_format:H:i',
            'end_time' => 'required|date_format:H:i|after:start_time',
            'is_active' => 'boolean',
        ]);

        MeetingSlot::create($validated);

        return back()->with('success', 'Meeting slot added successfully');
    }

    /**
     * Update a meeting slot.
     */
    public function updateSlot(Request $request, MeetingSlot $slot)
    {
        $validated = $request->validate([
            'day_of_week' => 'required|integer|between:0,6',
            'start_time' => 'required|date_format:H:i',
            'end_time' => 'required|date_format:H:i|after:start_time',
            'is_active' => 'boolean',
        ]);

        $slot->update($validated);

        return back()->with('success', 'Meeting slot updated successfully');
    }

    /**
     * Delete a meeting slot.
     */
    public function destroySlot(MeetingSlot $slot)
    {
        $slot->delete();

        return back()->with('success', 'Meeting slot deleted successfully');
    }

    /**
     * Get meetings for calendar (API endpoint).
     */
    public function calendarEvents(Request $request)
    {
        $query = Meeting::query();

        if ($request->filled('start')) {
            $query->whereDate('date', '>=', $request->start);
        }
        if ($request->filled('end')) {
            $query->whereDate('date', '<=', $request->end);
        }

        $meetings = $query->get()->map(function ($meeting) {
            return [
                'id' => $meeting->id,
                'title' => $meeting->name.' - '.ucfirst($meeting->meeting_type),
                'start' => $meeting->date->format('Y-m-d').'T'.date('H:i:s', strtotime($meeting->time)),
                'end' => $meeting->date->format('Y-m-d').'T'.date('H:i:s', strtotime($meeting->time.' +1 hour')),
                'backgroundColor' => $this->getStatusColor($meeting->status),
                'borderColor' => $this->getStatusColor($meeting->status),
                'extendedProps' => [
                    'email' => $meeting->email,
                    'phone' => $meeting->phone,
                    'status' => $meeting->status,
                    'meeting_type' => $meeting->meeting_type,
                    'purpose' => $meeting->purpose,
                ],
            ];
        });

        return response()->json($meetings);
    }

    /**
     * Get color based on status.
     */
    private function getStatusColor($status)
    {
        return match ($status) {
            'pending' => '#f59e0b',
            'confirmed' => '#3b82f6',
            'completed' => '#10b981',
            'cancelled' => '#ef4444',
            default => '#6b7280',
        };
    }
}
