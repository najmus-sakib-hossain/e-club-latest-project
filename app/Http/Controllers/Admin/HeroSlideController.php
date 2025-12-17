<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\HeroSlide;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class HeroSlideController extends Controller
{
    /**
     * Display a listing of hero slides
     */
    public function index(): Response
    {
        return Inertia::render('admin/hero-slides/index', [
            'slides' => HeroSlide::ordered()->get(),
        ]);
    }

    /**
     * Get all hero slides as JSON (for API)
     */
    public function list(): JsonResponse
    {
        return response()->json(HeroSlide::ordered()->get());
    }

    /**
     * Store a new hero slide
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'subtitle' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'button_text' => 'nullable|string|max:100',
            'button_link' => 'nullable|string|max:255',
            'image' => 'required|image|max:5120', // 5MB max
            'is_active' => 'boolean',
            'order' => 'integer',
            'sort_order' => 'integer',
        ]);

        // Handle sort_order alias for order
        if (isset($validated['sort_order']) && ! isset($validated['order'])) {
            $validated['order'] = $validated['sort_order'];
        }
        unset($validated['sort_order']);

        if ($request->hasFile('image')) {
            $validated['image'] = $request->file('image')->store('hero-slides', 'public');
        }

        HeroSlide::create($validated);

        return redirect()->back()->with('success', 'Hero slide created successfully');
    }

    /**
     * Update a hero slide
     */
    public function update(Request $request, HeroSlide $heroSlide): RedirectResponse
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'subtitle' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'button_text' => 'nullable|string|max:100',
            'button_link' => 'nullable|string|max:255',
            'image' => 'nullable|image|max:5120',
            'is_active' => 'boolean',
            'order' => 'integer',
            'sort_order' => 'integer',
        ]);

        // Handle sort_order alias for order
        if (isset($validated['sort_order']) && ! isset($validated['order'])) {
            $validated['order'] = $validated['sort_order'];
        }
        unset($validated['sort_order']);

        if ($request->hasFile('image')) {
            // Delete old image
            if ($heroSlide->image && ! str_starts_with($heroSlide->image, 'http')) {
                Storage::disk('public')->delete($heroSlide->image);
            }
            $validated['image'] = $request->file('image')->store('hero-slides', 'public');
        }

        $heroSlide->update($validated);

        return redirect()->back()->with('success', 'Hero slide updated successfully');
    }

    /**
     * Delete a hero slide
     */
    public function destroy(HeroSlide $heroSlide): RedirectResponse
    {
        if ($heroSlide->image && ! str_starts_with($heroSlide->image, 'http')) {
            Storage::disk('public')->delete($heroSlide->image);
        }

        $heroSlide->delete();

        return redirect()->back()->with('success', 'Hero slide deleted successfully');
    }

    /**
     * Update order of hero slides
     */
    public function updateOrder(Request $request): RedirectResponse
    {
        $request->validate([
            'slides' => 'required|array',
            'slides.*.id' => 'required|exists:hero_slides,id',
            'slides.*.order' => 'required|integer',
        ]);

        foreach ($request->slides as $slideData) {
            HeroSlide::where('id', $slideData['id'])->update(['order' => $slideData['order']]);
        }

        return redirect()->back()->with('success', 'Order updated successfully');
    }
}
