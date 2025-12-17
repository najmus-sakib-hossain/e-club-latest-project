<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class ProductController extends Controller
{
    /**
     * Display a listing of products
     */
    public function index(): Response
    {
        return Inertia::render('admin/products/index', [
            'products' => Product::with('category')->latest()->get(),
            'categories' => Category::active()->ordered()->get(),
        ]);
    }

    /**
     * Get all products as JSON (for API)
     */
    public function list(): JsonResponse
    {
        return response()->json(Product::with('category')->latest()->get());
    }

    /**
     * Store a new product
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'slug' => 'nullable|string|max:255|unique:products',
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'sale_price' => 'nullable|numeric|min:0',
            'images' => 'nullable|array',
            'images.*' => 'image|max:5120',
            'category_id' => 'nullable|exists:categories,id',
            'is_featured' => 'boolean',
            'is_new_arrival' => 'boolean',
            'is_best_seller' => 'boolean',
            'is_active' => 'boolean',
            'specifications' => 'nullable|array',
            'sku' => 'nullable|string|max:100',
            'stock_quantity' => 'integer|min:0',
        ]);

        // Generate slug if not provided
        if (empty($validated['slug'])) {
            $validated['slug'] = Str::slug($validated['name']);
        }

        // Handle image uploads
        if ($request->hasFile('images')) {
            $imagePaths = [];
            foreach ($request->file('images') as $image) {
                $imagePaths[] = $image->store('products', 'public');
            }
            $validated['images'] = $imagePaths;
        }

        Product::create($validated);

        return redirect()->back()->with('success', 'Product created successfully');
    }

    /**
     * Update a product
     */
    public function update(Request $request, Product $product): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'slug' => 'nullable|string|max:255|unique:products,slug,'.$product->id,
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'sale_price' => 'nullable|numeric|min:0',
            'images' => 'nullable|array',
            'images.*' => 'image|max:5120',
            'existing_images' => 'nullable|array',
            'category_id' => 'nullable|exists:categories,id',
            'is_featured' => 'boolean',
            'is_new_arrival' => 'boolean',
            'is_best_seller' => 'boolean',
            'is_active' => 'boolean',
            'specifications' => 'nullable|array',
            'sku' => 'nullable|string|max:100',
            'stock_quantity' => 'integer|min:0',
        ]);

        // Handle existing images
        $existingImages = $request->input('existing_images', []);

        // Delete removed images
        if ($product->images) {
            foreach ($product->images as $oldImage) {
                if (! in_array($oldImage, $existingImages) && ! str_starts_with($oldImage, 'http')) {
                    Storage::disk('public')->delete($oldImage);
                }
            }
        }

        // Handle new image uploads
        $newImages = [];
        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $image) {
                $newImages[] = $image->store('products', 'public');
            }
        }

        $validated['images'] = array_merge($existingImages, $newImages);

        $product->update($validated);

        return redirect()->back()->with('success', 'Product updated successfully');
    }

    /**
     * Delete a product
     */
    public function destroy(Product $product): RedirectResponse
    {
        // Delete all images
        if ($product->images) {
            foreach ($product->images as $image) {
                if (! str_starts_with($image, 'http')) {
                    Storage::disk('public')->delete($image);
                }
            }
        }

        $product->delete();

        return redirect()->back()->with('success', 'Product deleted successfully');
    }
}
