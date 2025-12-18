<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\MemberBenefit;
use App\Models\MembershipApplication;
use App\Models\MembershipType;
use Inertia\Inertia;

class MembershipController extends Controller
{
    public function benefits()
    {
        $benefits = MemberBenefit::active()->ordered()->get();
        $categories = $benefits->pluck('category')->unique()->values();
        return Inertia::render('membership/benefits', [
            'benefits' => $benefits,
            'categories' => $categories,
        ]);
    }

    public function renew()
    {
        $membershipTypes = MembershipType::active()->ordered()->get();
        return Inertia::render('membership/renew', [
            'membershipTypes' => $membershipTypes,
        ]);
    }

    public function directory()
    {
        $members = MembershipApplication::where('status', 'approved')
            ->orderBy('name')
            ->get()
            ->map(function ($member) {
                return [
                    'name' => $member->name,
                    'company' => $member->company,
                    'designation' => $member->designation,
                    'membership_type' => $member->membershipType->name ?? 'N/A',
                ];
            });
        
        return Inertia::render('membership/directory', [
            'members' => $members,
        ]);
    }
}
