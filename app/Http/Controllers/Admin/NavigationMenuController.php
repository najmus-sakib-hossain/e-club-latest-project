<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\NavigationMenu;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class NavigationMenuController extends Controller
{
    /**
     * Display navigation menu management
     */
    public function index(): Response
    {
        $navigation = NavigationMenu::with(['children' => function ($query) {
            $query->ordered()->with(['children' => function ($q) {
                $q->ordered();
            }]);
        }])
            ->root()
            ->location('primary')
            ->ordered()
            ->get();

        return Inertia::render('admin/settings/navigation', [
            'navigation' => $navigation,
        ]);
    }

    /**
     * Get all navigation items as JSON (for API)
     */
    public function list(): JsonResponse
    {
        $navigation = NavigationMenu::with(['children' => function ($query) {
            $query->ordered()->with(['children' => function ($q) {
                $q->ordered();
            }]);
        }])
            ->root()
            ->location('primary')
            ->ordered()
            ->get();

        return response()->json($navigation);
    }

    /**
     * Store a new navigation item
     */
    public function store(Request $request): JsonResponse|RedirectResponse
    {
        $validated = $request->validate([
            'parent_id' => 'nullable|exists:navigation_menus,id',
            'name' => 'required|string|max:255',
            'slug' => 'nullable|string|max:255',
            'url' => 'nullable|string|max:255',
            'icon' => 'nullable|string|max:100',
            'type' => 'required|in:main,category,subcategory,item',
            'location' => 'required|in:primary,secondary,footer,mobile',
            'is_active' => 'boolean',
            'open_in_new_tab' => 'boolean',
            'sort_order' => 'integer',
        ]);

        // Auto-generate slug if not provided
        if (empty($validated['slug'])) {
            $validated['slug'] = Str::slug($validated['name']);
        }

        // Set default sort order if not provided
        if (! isset($validated['sort_order'])) {
            $maxOrder = NavigationMenu::where('parent_id', $validated['parent_id'] ?? null)
                ->where('location', $validated['location'])
                ->max('sort_order') ?? 0;
            $validated['sort_order'] = $maxOrder + 1;
        }

        $item = NavigationMenu::create($validated);

        if ($request->wantsJson()) {
            return response()->json([
                'success' => true,
                'message' => 'Navigation item created successfully',
                'item' => $item->load('children'),
            ]);
        }

        return redirect()->back()->with('success', 'Navigation item created successfully');
    }

    /**
     * Update a navigation item
     */
    public function update(Request $request, NavigationMenu $navigationMenu): JsonResponse|RedirectResponse
    {
        $validated = $request->validate([
            'parent_id' => 'nullable|exists:navigation_menus,id',
            'name' => 'required|string|max:255',
            'slug' => 'nullable|string|max:255',
            'url' => 'nullable|string|max:255',
            'icon' => 'nullable|string|max:100',
            'type' => 'sometimes|in:main,category,subcategory,item',
            'location' => 'sometimes|in:primary,secondary,footer,mobile',
            'is_active' => 'boolean',
            'open_in_new_tab' => 'boolean',
            'sort_order' => 'integer',
        ]);

        // Auto-generate slug if name changed and slug not provided
        if (isset($validated['name']) && empty($validated['slug'])) {
            $validated['slug'] = Str::slug($validated['name']);
        }

        $navigationMenu->update($validated);

        if ($request->wantsJson()) {
            return response()->json([
                'success' => true,
                'message' => 'Navigation item updated successfully',
                'item' => $navigationMenu->load('children'),
            ]);
        }

        return redirect()->back()->with('success', 'Navigation item updated successfully');
    }

    /**
     * Delete a navigation item
     */
    public function destroy(NavigationMenu $navigationMenu): JsonResponse|RedirectResponse
    {
        // This will cascade delete all children due to foreign key constraint
        $navigationMenu->delete();

        if (request()->wantsJson()) {
            return response()->json([
                'success' => true,
                'message' => 'Navigation item deleted successfully',
            ]);
        }

        return redirect()->back()->with('success', 'Navigation item deleted successfully');
    }

    /**
     * Update sort order for multiple items
     */
    public function updateOrder(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'items' => 'required|array',
            'items.*.id' => 'required|exists:navigation_menus,id',
            'items.*.sort_order' => 'required|integer',
            'items.*.parent_id' => 'nullable|exists:navigation_menus,id',
        ]);

        foreach ($validated['items'] as $itemData) {
            NavigationMenu::where('id', $itemData['id'])->update([
                'sort_order' => $itemData['sort_order'],
                'parent_id' => $itemData['parent_id'] ?? null,
            ]);
        }

        return response()->json([
            'success' => true,
            'message' => 'Navigation order updated successfully',
        ]);
    }

    /**
     * Bulk create items (for seeding from frontend)
     */
    public function bulkStore(Request $request): JsonResponse|RedirectResponse
    {
        // Seed default navigation structure
        $this->seedDefaultNavigation();

        if ($request->wantsJson()) {
            return response()->json([
                'success' => true,
                'message' => 'Default navigation seeded successfully',
            ]);
        }

        return redirect()->back()->with('success', 'Default navigation seeded successfully');
    }

    /**
     * Seed default navigation structure
     */
    /**
     * Seed default navigation structure
     */
    private function seedDefaultNavigation(): void
    {
        $seeder = new \Database\Seeders\NavigationMenuSeeder;
        $seeder->run();
    }

    /**
     * Toggle active status
     */
    public function toggleActive(NavigationMenu $navigationMenu): JsonResponse
    {
        $navigationMenu->update([
            'is_active' => ! $navigationMenu->is_active,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Navigation item '.($navigationMenu->is_active ? 'activated' : 'deactivated'),
            'item' => $navigationMenu,
        ]);
    }
}
