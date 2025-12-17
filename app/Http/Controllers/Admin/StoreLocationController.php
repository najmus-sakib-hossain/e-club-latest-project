<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\PageContent;
use App\Models\StoreLocation;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class StoreLocationController extends Controller
{
    /**
     * Display a listing of store locations
     */
    public function index(): Response
    {
        return Inertia::render('admin/content-pages/stores', [
            'stores' => StoreLocation::orderBy('sort_order')->orderBy('name')->get(),
            'content' => PageContent::getPageContent('stores'),
        ]);
    }

    /**
     * Store a newly created store location
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'type' => 'required|string|max:100',
            'address' => 'required|string',
            'phone' => 'nullable|string|max:50',
            'email' => 'nullable|email|max:255',
            'hours' => 'nullable|string|max:255',
            'features' => 'nullable|array',
            'is_open' => 'boolean',
            'rating' => 'nullable|numeric|min:0|max:5',
            'map_url' => 'nullable|url|max:500',
            'city' => 'required|string|max:100',
            'is_active' => 'boolean',
            'sort_order' => 'integer',
        ]);

        StoreLocation::create($validated);

        return redirect()->back()->with('success', 'Store location added successfully');
    }

    /**
     * Update the specified store location
     */
    public function update(Request $request, StoreLocation $storeLocation): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'type' => 'required|string|max:100',
            'address' => 'required|string',
            'phone' => 'nullable|string|max:50',
            'email' => 'nullable|email|max:255',
            'hours' => 'nullable|string|max:255',
            'features' => 'nullable|array',
            'is_open' => 'boolean',
            'rating' => 'nullable|numeric|min:0|max:5',
            'map_url' => 'nullable|url|max:500',
            'city' => 'required|string|max:100',
            'is_active' => 'boolean',
            'sort_order' => 'integer',
        ]);

        $storeLocation->update($validated);

        return redirect()->back()->with('success', 'Store location updated successfully');
    }

    /**
     * Remove the specified store location
     */
    public function destroy(StoreLocation $storeLocation): RedirectResponse
    {
        $storeLocation->delete();

        return redirect()->back()->with('success', 'Store location deleted successfully');
    }

    /**
     * Update store locator page content (hero, services, CTA)
     */
    public function updateContent(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'hero_title' => 'nullable|string|max:255',
            'hero_subtitle' => 'nullable|string',
            'locations_section_title' => 'nullable|string|max:255',
            'cta_title' => 'nullable|string|max:255',
            'cta_subtitle' => 'nullable|string',
            'store_services' => 'nullable|array',
            'store_services.*.icon' => 'nullable|string|max:50',
            'store_services.*.title' => 'nullable|string|max:255',
            'store_services.*.description' => 'nullable|string',
        ]);

        PageContent::setSection('stores', 'hero', [
            'title' => $validated['hero_title'] ?? null,
            'subtitle' => $validated['hero_subtitle'] ?? null,
        ]);

        PageContent::setSection('stores', 'locations_section', [
            'title' => $validated['locations_section_title'] ?? null,
        ]);

        if (isset($validated['store_services'])) {
            PageContent::setSection('stores', 'store_services', [
                'items' => $validated['store_services'],
            ]);
        }

        PageContent::setSection('stores', 'cta', [
            'title' => $validated['cta_title'] ?? null,
            'subtitle' => $validated['cta_subtitle'] ?? null,
        ]);

        return redirect()->back()->with('success', 'Store page content updated successfully');
    }
}
