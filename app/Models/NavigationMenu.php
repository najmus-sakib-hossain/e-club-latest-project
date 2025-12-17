<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Collection;

class NavigationMenu extends Model
{
    protected $fillable = [
        'parent_id',
        'name',
        'slug',
        'url',
        'icon',
        'type',
        'location',
        'is_active',
        'open_in_new_tab',
        'sort_order',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'open_in_new_tab' => 'boolean',
        'sort_order' => 'integer',
    ];

    /**
     * Get the parent menu item
     */
    public function parent(): BelongsTo
    {
        return $this->belongsTo(NavigationMenu::class, 'parent_id');
    }

    /**
     * Get child menu items
     */
    public function children(): HasMany
    {
        return $this->hasMany(NavigationMenu::class, 'parent_id')
            ->orderBy('sort_order');
    }

    /**
     * Get active children
     */
    public function activeChildren(): HasMany
    {
        return $this->hasMany(NavigationMenu::class, 'parent_id')
            ->where('is_active', true)
            ->orderBy('sort_order');
    }

    /**
     * Scope to get only active items
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Scope to order by position
     */
    public function scopeOrdered($query)
    {
        return $query->orderBy('sort_order');
    }

    /**
     * Scope to get root items (no parent)
     */
    public function scopeRoot($query)
    {
        return $query->whereNull('parent_id');
    }

    /**
     * Scope to filter by location
     */
    public function scopeLocation($query, string $location)
    {
        return $query->where('location', $location);
    }

    /**
     * Scope to filter by type
     */
    public function scopeType($query, string $type)
    {
        return $query->where('type', $type);
    }

    /**
     * Get the primary navigation structure for the header
     * Returns nested array structure matching the frontend format
     */
    public static function getPrimaryNavigation(): array
    {
        $items = self::with(['children' => function ($query) {
            $query->active()->ordered()->with(['children' => function ($q) {
                $q->active()->ordered();
            }]);
        }])
            ->active()
            ->root()
            ->location('primary')
            ->type('main')
            ->ordered()
            ->get();

        $navigation = [];

        foreach ($items as $mainItem) {
            $categories = [];
            foreach ($mainItem->children as $category) {
                $subItems = [];
                foreach ($category->children as $subItem) {
                    $subItems[] = [
                        'id' => $subItem->id,
                        'name' => $subItem->name,
                        'slug' => $subItem->slug,
                        'url' => $subItem->url ?? "/products?category={$subItem->slug}",
                    ];
                }
                $categories[$category->name] = $subItems;
            }
            $navigation[$mainItem->name] = $categories;
        }

        return $navigation;
    }

    /**
     * Get navigation items for admin management
     */
    public static function getAdminNavigation(): Collection
    {
        return self::with(['children' => function ($query) {
            $query->ordered()->with(['children' => function ($q) {
                $q->ordered();
            }]);
        }])
            ->root()
            ->location('primary')
            ->ordered()
            ->get();
    }

    /**
     * Get flat list of all navigation items with depth indicator
     */
    public static function getFlatList(): Collection
    {
        $items = self::ordered()->get();
        $result = collect();

        $buildTree = function ($parentId = null, $depth = 0) use (&$buildTree, $items, &$result) {
            $children = $items->where('parent_id', $parentId);
            foreach ($children as $item) {
                $item->depth = $depth;
                $result->push($item);
                $buildTree($item->id, $depth + 1);
            }
        };

        $buildTree();

        return $result;
    }

    /**
     * Get navigation tree for a specific location (used in frontend header)
     */
    public static function getNavigationTree(string $location = 'primary'): Collection
    {
        return self::with(['children' => function ($query) {
            $query->active()->ordered()->with(['children' => function ($q) {
                $q->active()->ordered();
            }]);
        }])
            ->active()
            ->root()
            ->location($location)
            ->ordered()
            ->get();
    }

    /**
     * Get header structure for the new E-Club header
     */
    public static function getHeaderStructure(): array
    {
        $items = self::getNavigationTree('header');

        return $items->map(function ($item) {
            return [
                'id' => $item->id,
                'name' => $item->name,
                'slug' => $item->slug,
                'url' => $item->url,
                'type' => $item->type, // 'single', 'dropdown', 'mega'
                'children' => $item->children->map(function ($child) {
                    return [
                        'id' => $child->id,
                        'name' => $child->name,
                        'slug' => $child->slug,
                        'url' => $child->url,
                        'description' => $child->description ?? '',
                        'children' => $child->children->map(function ($subChild) {
                            return [
                                'id' => $subChild->id,
                                'name' => $subChild->name,
                                'slug' => $subChild->slug,
                                'url' => $subChild->url,
                            ];
                        })->toArray(),
                    ];
                })->toArray(),
            ];
        })->toArray();
    }
}
