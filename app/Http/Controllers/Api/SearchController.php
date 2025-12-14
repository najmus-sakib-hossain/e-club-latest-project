<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SearchController extends Controller
{
    /**
     * Search products and categories
     */
    public function search(Request $request): JsonResponse
    {
        $query = $request->input('q', '');
        $limit = min($request->input('limit', 10), 20);

        // Search products
        $productsQuery = Product::with('category')
            ->where('is_active', true);

        if ($query) {
            $productsQuery->where(function ($q) use ($query) {
                $q->where('name', 'like', "%{$query}%")
                    ->orWhere('description', 'like', "%{$query}%")
                    ->orWhere('sku', 'like', "%{$query}%");
            });
        }

        $products = $productsQuery
            ->orderBy('is_featured', 'desc')
            ->orderBy('name')
            ->limit($limit)
            ->get();

        // Search categories
        $categoriesQuery = Category::where('is_active', true);

        if ($query) {
            $categoriesQuery->where(function ($q) use ($query) {
                $q->where('name', 'like', "%{$query}%")
                    ->orWhere('description', 'like', "%{$query}%");
            });
        }

        $categories = $categoriesQuery
            ->orderBy('order')
            ->orderBy('name')
            ->limit(5)
            ->get();

        return response()->json([
            'products' => $products,
            'categories' => $categories,
        ]);
    }
}
