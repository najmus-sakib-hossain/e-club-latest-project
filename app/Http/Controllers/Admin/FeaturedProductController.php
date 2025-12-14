<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\FeaturedProduct;
use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class FeaturedProductController extends Controller
{
    /**
     * Display a listing of featured products
     */
    public function index(): Response
    {
        return Inertia::render('admin/featured-products/index', [
            'featuredProducts' => FeaturedProduct::with('product')->latest()->get(),
            'products' => Product::active()->get(['id', 'name', 'slug', 'price', 'images']),
        ]);
    }

    /**
     * Get all featured products as JSON (for API)
     */
    public function list(): JsonResponse
    {
        return response()->json(FeaturedProduct::with('product')->latest()->get());
    }

    /**
     * Store a new featured product
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'product_id' => 'required|exists:products,id',
            'title' => 'required|string|max:255',
            'subtitle' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'badge_text' => 'nullable|string|max:100',
            'button_text' => 'nullable|string|max:100',
            'button_link' => 'nullable|string|max:255',
            'image' => 'nullable|image|max:5120',
            'is_active' => 'boolean',
        ]);

        if ($request->hasFile('image')) {
            $validated['image'] = $request->file('image')->store('featured-products', 'public');
        }

        FeaturedProduct::create($validated);

        return redirect()->back()->with('success', 'Featured product created successfully');
    }

    /**
     * Update a featured product
     */
    public function update(Request $request, FeaturedProduct $featuredProduct): RedirectResponse
    {
        $validated = $request->validate([
            'product_id' => 'required|exists:products,id',
            'title' => 'required|string|max:255',
            'subtitle' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'badge_text' => 'nullable|string|max:100',
            'button_text' => 'nullable|string|max:100',
            'button_link' => 'nullable|string|max:255',
            'image' => 'nullable|image|max:5120',
            'is_active' => 'boolean',
        ]);

        if ($request->hasFile('image')) {
            // Delete old image
            if ($featuredProduct->image && !str_starts_with($featuredProduct->image, 'http')) {
                Storage::disk('public')->delete($featuredProduct->image);
            }
            $validated['image'] = $request->file('image')->store('featured-products', 'public');
        }

        $featuredProduct->update($validated);

        return redirect()->back()->with('success', 'Featured product updated successfully');
    }

    /**
     * Delete a featured product
     */
    public function destroy(FeaturedProduct $featuredProduct): RedirectResponse
    {
        if ($featuredProduct->image && !str_starts_with($featuredProduct->image, 'http')) {
            Storage::disk('public')->delete($featuredProduct->image);
        }

        $featuredProduct->delete();

        return redirect()->back()->with('success', 'Featured product deleted successfully');
    }
}
