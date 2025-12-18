<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Partnership;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class PartnershipManagementController extends Controller
{
    public function index(): Response
    {
        $partnerships = Partnership::ordered()->get();
        
        return Inertia::render('admin/partnerships/index', [
            'partnerships' => $partnerships,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'partner_name' => 'required|string|max:255',
            'slug' => 'nullable|string|max:255|unique:partnerships,slug',
            'short_description' => 'nullable|string',
            'description' => 'required|string',
            'logo' => 'nullable|image|max:2048',
            'type' => 'nullable|string',
            'industry' => 'nullable|string',
            'website_url' => 'nullable|url',
            'contact_person' => 'nullable|string',
            'contact_email' => 'nullable|email',
            'contact_phone' => 'nullable|string',
            'partnership_start_date' => 'nullable|date',
            'partnership_end_date' => 'nullable|date',
            'status' => 'required|in:active,inactive,expired',
            'partnership_details' => 'nullable|string',
            'is_featured' => 'boolean',
            'is_active' => 'boolean',
            'sort_order' => 'nullable|integer',
        ]);

        if (empty($validated['slug'])) {
            $validated['slug'] = Str::slug($validated['partner_name']);
        }

        if ($request->hasFile('logo')) {
            $validated['logo'] = $request->file('logo')->store('partnerships', 'public');
        }

        Partnership::create($validated);

        return redirect()->back()->with('success', 'Partnership created successfully');
    }

    public function update(Request $request, Partnership $partnership)
    {
        $validated = $request->validate([
            'partner_name' => 'required|string|max:255',
            'slug' => 'nullable|string|max:255|unique:partnerships,slug,' . $partnership->id,
            'short_description' => 'nullable|string',
            'description' => 'required|string',
            'logo' => 'nullable|image|max:2048',
            'type' => 'nullable|string',
            'industry' => 'nullable|string',
            'website_url' => 'nullable|url',
            'contact_person' => 'nullable|string',
            'contact_email' => 'nullable|email',
            'contact_phone' => 'nullable|string',
            'partnership_start_date' => 'nullable|date',
            'partnership_end_date' => 'nullable|date',
            'status' => 'required|in:active,inactive,expired',
            'partnership_details' => 'nullable|string',
            'is_featured' => 'boolean',
            'is_active' => 'boolean',
            'sort_order' => 'nullable|integer',
        ]);

        if (empty($validated['slug'])) {
            $validated['slug'] = Str::slug($validated['partner_name']);
        }

        if ($request->hasFile('logo')) {
            $validated['logo'] = $request->file('logo')->store('partnerships', 'public');
        }

        $partnership->update($validated);

        return redirect()->back()->with('success', 'Partnership updated successfully');
    }

    public function destroy(Partnership $partnership)
    {
        $partnership->delete();
        
        return redirect()->back()->with('success', 'Partnership deleted successfully');
    }
}
