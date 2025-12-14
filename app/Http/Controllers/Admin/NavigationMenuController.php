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
        if (!isset($validated['sort_order'])) {
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
    private function seedDefaultNavigation(): void
    {
        $sortOrder = 0;

        // Tables & Desks
        $tablesDesks = NavigationMenu::create([
            'name' => 'Tables & Desks',
            'slug' => 'tables-desks',
            'type' => 'main',
            'location' => 'primary',
            'is_active' => true,
            'sort_order' => $sortOrder++,
        ]);

        $familyTables = NavigationMenu::create([
            'parent_id' => $tablesDesks->id,
            'name' => 'Family Tables & Desks',
            'slug' => 'family-tables-desks',
            'type' => 'category',
            'location' => 'primary',
            'is_active' => true,
            'sort_order' => 0,
        ]);

        foreach (['Study Tables', 'Dining Tables', 'Computer Tables', 'Console Tables'] as $index => $name) {
            NavigationMenu::create([
                'parent_id' => $familyTables->id,
                'name' => $name,
                'slug' => Str::slug($name),
                'url' => '/products?category=' . Str::slug($name),
                'type' => 'item',
                'location' => 'primary',
                'is_active' => true,
                'sort_order' => $index,
            ]);
        }

        $officeTables = NavigationMenu::create([
            'parent_id' => $tablesDesks->id,
            'name' => 'Office Tables & Desks',
            'slug' => 'office-tables-desks',
            'type' => 'category',
            'location' => 'primary',
            'is_active' => true,
            'sort_order' => 1,
        ]);

        foreach (['Executive Desks', 'Conference Tables', 'Workstations', 'Standing Desks'] as $index => $name) {
            NavigationMenu::create([
                'parent_id' => $officeTables->id,
                'name' => $name,
                'slug' => Str::slug($name),
                'url' => '/products?category=' . Str::slug($name),
                'type' => 'item',
                'location' => 'primary',
                'is_active' => true,
                'sort_order' => $index,
            ]);
        }

        // Chairs
        $chairs = NavigationMenu::create([
            'name' => 'Chairs',
            'slug' => 'chairs',
            'type' => 'main',
            'location' => 'primary',
            'is_active' => true,
            'sort_order' => $sortOrder++,
        ]);

        $familyChairs = NavigationMenu::create([
            'parent_id' => $chairs->id,
            'name' => 'Family Chairs',
            'slug' => 'family-chairs',
            'type' => 'category',
            'location' => 'primary',
            'is_active' => true,
            'sort_order' => 0,
        ]);

        foreach (['Dining Chairs', 'Accent Chairs', 'Lounge Chairs', 'Rocking Chairs'] as $index => $name) {
            NavigationMenu::create([
                'parent_id' => $familyChairs->id,
                'name' => $name,
                'slug' => Str::slug($name),
                'url' => '/products?category=' . Str::slug($name),
                'type' => 'item',
                'location' => 'primary',
                'is_active' => true,
                'sort_order' => $index,
            ]);
        }

        $officeChairs = NavigationMenu::create([
            'parent_id' => $chairs->id,
            'name' => 'Office Chairs',
            'slug' => 'office-chairs',
            'type' => 'category',
            'location' => 'primary',
            'is_active' => true,
            'sort_order' => 1,
        ]);

        foreach (['Ergonomic Chairs', 'Executive Chairs', 'Task Chairs', 'Gaming Chairs'] as $index => $name) {
            NavigationMenu::create([
                'parent_id' => $officeChairs->id,
                'name' => $name,
                'slug' => Str::slug($name),
                'url' => '/products?category=' . Str::slug($name),
                'type' => 'item',
                'location' => 'primary',
                'is_active' => true,
                'sort_order' => $index,
            ]);
        }

        // Storage
        $storage = NavigationMenu::create([
            'name' => 'Storage',
            'slug' => 'storage',
            'type' => 'main',
            'location' => 'primary',
            'is_active' => true,
            'sort_order' => $sortOrder++,
        ]);

        $homeStorage = NavigationMenu::create([
            'parent_id' => $storage->id,
            'name' => 'Home Storage',
            'slug' => 'home-storage',
            'type' => 'category',
            'location' => 'primary',
            'is_active' => true,
            'sort_order' => 0,
        ]);

        foreach (['Bookcases', 'Cabinets', 'Shelving Units', 'TV Stands'] as $index => $name) {
            NavigationMenu::create([
                'parent_id' => $homeStorage->id,
                'name' => $name,
                'slug' => Str::slug($name),
                'url' => '/products?category=' . Str::slug($name),
                'type' => 'item',
                'location' => 'primary',
                'is_active' => true,
                'sort_order' => $index,
            ]);
        }

        $officeStorage = NavigationMenu::create([
            'parent_id' => $storage->id,
            'name' => 'Office Storage',
            'slug' => 'office-storage',
            'type' => 'category',
            'location' => 'primary',
            'is_active' => true,
            'sort_order' => 1,
        ]);

        foreach (['File Cabinets', 'Storage Cabinets', 'Credenzas', 'Lockers'] as $index => $name) {
            NavigationMenu::create([
                'parent_id' => $officeStorage->id,
                'name' => $name,
                'slug' => Str::slug($name),
                'url' => '/products?category=' . Str::slug($name),
                'type' => 'item',
                'location' => 'primary',
                'is_active' => true,
                'sort_order' => $index,
            ]);
        }

        // Sofas & Seating
        $sofas = NavigationMenu::create([
            'name' => 'Sofas & Seating',
            'slug' => 'sofas-seating',
            'type' => 'main',
            'location' => 'primary',
            'is_active' => true,
            'sort_order' => $sortOrder++,
        ]);

        $livingRoom = NavigationMenu::create([
            'parent_id' => $sofas->id,
            'name' => 'Living Room',
            'slug' => 'living-room',
            'type' => 'category',
            'location' => 'primary',
            'is_active' => true,
            'sort_order' => 0,
        ]);

        foreach (['Sofas', 'Sectionals', 'Loveseats', 'Recliners'] as $index => $name) {
            NavigationMenu::create([
                'parent_id' => $livingRoom->id,
                'name' => $name,
                'slug' => Str::slug($name),
                'url' => '/products?category=' . Str::slug($name),
                'type' => 'item',
                'location' => 'primary',
                'is_active' => true,
                'sort_order' => $index,
            ]);
        }

        $officeSeating = NavigationMenu::create([
            'parent_id' => $sofas->id,
            'name' => 'Office Seating',
            'slug' => 'office-seating',
            'type' => 'category',
            'location' => 'primary',
            'is_active' => true,
            'sort_order' => 1,
        ]);

        foreach (['Reception Seating', 'Lounge E-Club', 'Benches', 'Ottomans'] as $index => $name) {
            NavigationMenu::create([
                'parent_id' => $officeSeating->id,
                'name' => $name,
                'slug' => Str::slug($name),
                'url' => '/products?category=' . Str::slug($name),
                'type' => 'item',
                'location' => 'primary',
                'is_active' => true,
                'sort_order' => $index,
            ]);
        }

        // Bedroom
        $bedroom = NavigationMenu::create([
            'name' => 'Bedroom',
            'slug' => 'bedroom',
            'type' => 'main',
            'location' => 'primary',
            'is_active' => true,
            'sort_order' => $sortOrder++,
        ]);

        $beds = NavigationMenu::create([
            'parent_id' => $bedroom->id,
            'name' => 'Beds & Frames',
            'slug' => 'beds-frames',
            'type' => 'category',
            'location' => 'primary',
            'is_active' => true,
            'sort_order' => 0,
        ]);

        foreach (['Platform Beds', 'Storage Beds', 'Bed Frames', 'Headboards'] as $index => $name) {
            NavigationMenu::create([
                'parent_id' => $beds->id,
                'name' => $name,
                'slug' => Str::slug($name),
                'url' => '/products?category=' . Str::slug($name),
                'type' => 'item',
                'location' => 'primary',
                'is_active' => true,
                'sort_order' => $index,
            ]);
        }

        $bedroomStorage = NavigationMenu::create([
            'parent_id' => $bedroom->id,
            'name' => 'Bedroom Storage',
            'slug' => 'bedroom-storage',
            'type' => 'category',
            'location' => 'primary',
            'is_active' => true,
            'sort_order' => 1,
        ]);

        foreach (['Dressers', 'Nightstands', 'Wardrobes', 'Chests'] as $index => $name) {
            NavigationMenu::create([
                'parent_id' => $bedroomStorage->id,
                'name' => $name,
                'slug' => Str::slug($name),
                'url' => '/products?category=' . Str::slug($name),
                'type' => 'item',
                'location' => 'primary',
                'is_active' => true,
                'sort_order' => $index,
            ]);
        }
    }

    /**
     * Toggle active status
     */
    public function toggleActive(NavigationMenu $navigationMenu): JsonResponse
    {
        $navigationMenu->update([
            'is_active' => !$navigationMenu->is_active,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Navigation item ' . ($navigationMenu->is_active ? 'activated' : 'deactivated'),
            'item' => $navigationMenu,
        ]);
    }
}
