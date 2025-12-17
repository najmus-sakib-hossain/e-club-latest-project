<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Product;
use App\Models\SiteSetting;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ProductController extends Controller
{
    /**
     * Display a listing of the products.
     */
    public function index(Request $request): Response
    {
        $query = Product::with('category')->where('is_active', true);

        // Apply filters
        if ($request->has('category')) {
            $category = Category::where('slug', $request->category)->first();
            if ($category) {
                $query->where('category_id', $category->id);
            }
        }

        if ($request->has('search')) {
            $query->where('name', 'like', '%'.$request->search.'%');
        }

        if ($request->has('minPrice')) {
            $query->where('price', '>=', $request->minPrice);
        }

        if ($request->has('maxPrice')) {
            $query->where('price', '<=', $request->maxPrice);
        }

        // Apply sorting
        switch ($request->get('sort')) {
            case 'price-low':
                $query->orderBy('price', 'asc');
                break;
            case 'price-high':
                $query->orderBy('price', 'desc');
                break;
            case 'name':
                $query->orderBy('name', 'asc');
                break;
            default:
                $query->latest();
        }

        $products = $query->get();
        $categories = Category::where('is_active', true)->orderBy('name')->get();
        // SiteSetting is global via HandleInertiaRequests, we might remove this later but keeping for safety
        $settings = SiteSetting::getAllGrouped();

        return Inertia::render('products/index', [
            'products' => $products,
            'categories' => $categories,
            'settings' => $settings,
            'filters' => [
                'category' => $request->category,
                'search' => $request->search,
                'minPrice' => $request->minPrice,
                'maxPrice' => $request->maxPrice,
                'sort' => $request->sort ?? 'newest',
            ],
        ]);
    }

    /**
     * Display the specified product.
     */
    public function show(string $slug): Response
    {
        $product = Product::with('category')->where('slug', $slug)->where('is_active', true)->firstOrFail();

        $relatedProducts = Product::where('category_id', $product->category_id)
            ->where('id', '!=', $product->id)
            ->where('is_active', true)
            ->limit(4)
            ->get();

        $categories = Category::where('is_active', true)->orderBy('name')->get();
        $settings = SiteSetting::getAllGrouped();

        return Inertia::render('products/show', [
            'product' => $product,
            'relatedProducts' => $relatedProducts,
            'categories' => $categories,
            'settings' => $settings,
        ]);
    }
}
