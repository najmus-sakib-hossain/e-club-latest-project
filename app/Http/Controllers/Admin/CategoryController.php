<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class CategoryController extends Controller
{
    /**
     * Display a listing of categories
     */
    public function index(Request $request): Response
    {
        $query = Category::withCount('products')->ordered();

        // Apply search filter
        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where('name', 'like', "%{$search}%");
        }

        // Apply status filter
        if ($request->filled('status') && $request->input('status') !== 'all') {
            $query->where('is_active', $request->input('status') === 'active');
        }

        return Inertia::render('admin/categories/index', [
            'categories' => $query->paginate(10)->withQueryString(),
            'filters' => [
                'search' => $request->input('search', ''),
                'status' => $request->input('status', 'all'),
            ],
        ]);
    }

    /**
     * Get all categories as JSON
     */
    public function list(): JsonResponse
    {
        return response()->json(Category::with('parent')->ordered()->get());
    }

    /**
     * Store a new category
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'slug' => 'nullable|string|max:255|unique:categories',
            'image' => 'nullable|image|max:5120',
            'description' => 'nullable|string',
            'parent_id' => 'nullable|exists:categories,id',
            'is_active' => 'boolean',
            'order' => 'integer',
            'sort_order' => 'integer',
            'collection_type' => 'nullable|string|in:business,family,seating',
        ]);

        // Generate slug if not provided
        if (empty($validated['slug'])) {
            $validated['slug'] = Str::slug($validated['name']);
        }

        // Handle sort_order alias for order
        if (isset($validated['sort_order']) && !isset($validated['order'])) {
            $validated['order'] = $validated['sort_order'];
        }
        unset($validated['sort_order']);

        if ($request->hasFile('image')) {
            $validated['image'] = $request->file('image')->store('categories', 'public');
        }

        Category::create($validated);

        return redirect()->back();
    }

    /**
     * Update a category
     */
    public function update(Request $request, Category $category): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'slug' => 'nullable|string|max:255|unique:categories,slug,' . $category->id,
            'image' => 'nullable|image|max:5120',
            'description' => 'nullable|string',
            'parent_id' => 'nullable|exists:categories,id',
            'is_active' => 'boolean',
            'order' => 'integer',
            'sort_order' => 'integer',
            'collection_type' => 'nullable|string|in:business,family,seating',
        ]);

        // Handle sort_order alias for order
        if (isset($validated['sort_order']) && !isset($validated['order'])) {
            $validated['order'] = $validated['sort_order'];
        }
        unset($validated['sort_order']);

        // Prevent category from being its own parent
        if (isset($validated['parent_id']) && $validated['parent_id'] == $category->id) {
            return redirect()->back()->withErrors(['parent_id' => 'Category cannot be its own parent']);
        }

        if ($request->hasFile('image')) {
            if ($category->image) {
                Storage::disk('public')->delete($category->image);
            }
            $validated['image'] = $request->file('image')->store('categories', 'public');
        }

        $category->update($validated);

        return redirect()->back();
    }

    /**
     * Delete a category
     */
    public function destroy(Category $category): RedirectResponse
    {
        if ($category->image) {
            Storage::disk('public')->delete($category->image);
        }

        $category->delete();

        return redirect()->back();
    }

    /**
     * Update order of categories
     */
    public function updateOrder(Request $request): RedirectResponse
    {
        $request->validate([
            'categories' => 'required|array',
            'categories.*.id' => 'required|exists:categories,id',
            'categories.*.order' => 'required|integer',
        ]);

        foreach ($request->categories as $categoryData) {
            Category::where('id', $categoryData['id'])->update(['order' => $categoryData['order']]);
        }

        return redirect()->back();
    }
}
