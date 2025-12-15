<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\JoinPageSetting;
use App\Models\MembershipType;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class JoinPageController extends Controller
{
    /**
     * Display join page management
     */
    public function index(): Response
    {
        return Inertia::render('admin/joinpage/index', [
            'settings' => JoinPageSetting::getAll(),
            'membershipTypes' => MembershipType::ordered()->get(),
        ]);
    }

    /**
     * Update join page settings
     */
    public function updateSettings(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'settings' => 'required|array',
            'settings.*.key' => 'required|string',
            'settings.*.value' => 'nullable',
            'settings.*.type' => 'required|in:text,number,json,boolean',
        ]);

        foreach ($validated['settings'] as $setting) {
            JoinPageSetting::set($setting['key'], $setting['value'], $setting['type']);
        }

        return redirect()->back()->with('success', 'Settings updated successfully');
    }

    /**
     * Store membership type
     */
    public function storeMembership(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'duration' => 'nullable|string|max:100',
            'benefits' => 'nullable|array',
            'is_active' => 'boolean',
            'sort_order' => 'integer',
        ]);

        MembershipType::create($validated);

        return redirect()->back()->with('success', 'Membership type added successfully');
    }

    /**
     * Update membership type
     */
    public function updateMembership(Request $request, MembershipType $membership): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'duration' => 'nullable|string|max:100',
            'benefits' => 'nullable|array',
            'is_active' => 'boolean',
            'sort_order' => 'integer',
        ]);

        $membership->update($validated);

        return redirect()->back()->with('success', 'Membership type updated successfully');
    }

    /**
     * Delete membership type
     */
    public function deleteMembership(MembershipType $membership): RedirectResponse
    {
        $membership->delete();

        return redirect()->back()->with('success', 'Membership type deleted successfully');
    }
}
