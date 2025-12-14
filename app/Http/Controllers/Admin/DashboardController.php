<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\FeatureCard;
use App\Models\HeroSlide;
use App\Models\Order;
use App\Models\Product;
use App\Models\TrustedCompany;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        // Basic stats
        $stats = [
            'heroSlides' => HeroSlide::count(),
            'categories' => Category::count(),
            'products' => Product::count(),
            'orders' => Order::count(),
            'featureCards' => FeatureCard::count(),
            'trustedCompanies' => TrustedCompany::count(),
            'totalRevenue' => Order::where('status', '!=', 'cancelled')->sum('total_amount'),
            'pendingOrders' => Order::where('status', 'pending')->count(),
        ];

        // Sales data for the last 7 days
        $salesData = [];
        for ($i = 6; $i >= 0; $i--) {
            $date = Carbon::now()->subDays($i);
            $salesData[] = [
                'date' => $date->format('M d'),
                'sales' => Order::whereDate('created_at', $date)->sum('total_amount'),
                'orders' => Order::whereDate('created_at', $date)->count(),
            ];
        }

        // Monthly sales for the last 6 months
        $monthlySales = [];
        for ($i = 5; $i >= 0; $i--) {
            $date = Carbon::now()->subMonths($i);
            $monthlySales[] = [
                'month' => $date->format('M Y'),
                'revenue' => Order::whereMonth('created_at', $date->month)
                    ->whereYear('created_at', $date->year)
                    ->where('status', '!=', 'cancelled')
                    ->sum('total_amount'),
                'orders' => Order::whereMonth('created_at', $date->month)
                    ->whereYear('created_at', $date->year)
                    ->count(),
            ];
        }

        // Order status distribution
        $ordersByStatus = [
            ['status' => 'Pending', 'count' => Order::where('status', 'pending')->count(), 'fill' => 'hsl(var(--chart-1))'],
            ['status' => 'Processing', 'count' => Order::where('status', 'processing')->count(), 'fill' => 'hsl(var(--chart-2))'],
            ['status' => 'Shipped', 'count' => Order::where('status', 'shipped')->count(), 'fill' => 'hsl(var(--chart-3))'],
            ['status' => 'Delivered', 'count' => Order::where('status', 'delivered')->count(), 'fill' => 'hsl(var(--chart-4))'],
            ['status' => 'Cancelled', 'count' => Order::where('status', 'cancelled')->count(), 'fill' => 'hsl(var(--chart-5))'],
        ];

        // Products by category
        $productsByCategory = Category::withCount('products')
            ->orderByDesc('products_count')
            ->limit(5)
            ->get()
            ->map(function ($category, $index) {
                return [
                    'category' => $category->name,
                    'products' => $category->products_count,
                    'fill' => 'hsl(var(--chart-' . ($index + 1) . '))',
                ];
            });

        // Recent orders
        $recentOrders = Order::with('items')
            ->latest()
            ->limit(10)
            ->get()
            ->map(function ($order) {
                return [
                    'id' => $order->id,
                    'order_number' => $order->order_number,
                    'customer_name' => $order->customer_name,
                    'customer_email' => $order->customer_email,
                    'total_amount' => $order->total_amount,
                    'status' => $order->status,
                    'payment_status' => $order->payment_status,
                    'items_count' => $order->items->count(),
                    'created_at' => $order->created_at->format('M d, Y H:i'),
                    'created_at_diff' => $order->created_at->diffForHumans(),
                ];
            });

        // Recent activities (combine various model changes)
        $activities = collect();

        // Add recent orders as activities
        Order::latest()->limit(5)->get()->each(function ($order) use ($activities) {
            $activities->push([
                'id' => 'order-' . $order->id,
                'type' => 'order',
                'title' => 'New order placed',
                'description' => "Order #{$order->order_number} by {$order->customer_name}",
                'amount' => $order->total_amount,
                'status' => $order->status,
                'created_at' => $order->created_at,
                'time_ago' => $order->created_at->diffForHumans(),
            ]);
        });

        // Add recent products
        Product::latest()->limit(3)->get()->each(function ($product) use ($activities) {
            $activities->push([
                'id' => 'product-' . $product->id,
                'type' => 'product',
                'title' => 'Product added',
                'description' => $product->name,
                'amount' => $product->price,
                'status' => $product->is_active ? 'active' : 'inactive',
                'created_at' => $product->created_at,
                'time_ago' => $product->created_at->diffForHumans(),
            ]);
        });

        // Sort by date and limit
        $recentActivities = $activities->sortByDesc('created_at')->take(10)->values();

        // Top selling products
        $topProducts = Product::withCount(['orderItems as total_sold' => function ($query) {
            $query->selectRaw('COALESCE(SUM(quantity), 0)');
        }])
            ->orderByDesc('total_sold')
            ->limit(5)
            ->get()
            ->map(function ($product) {
                return [
                    'id' => $product->id,
                    'name' => $product->name,
                    'image' => $product->images[0] ?? null,
                    'price' => $product->price,
                    'sold' => $product->total_sold ?? 0,
                    'stock' => $product->stock_quantity,
                ];
            });

        // Low stock products
        $lowStockProducts = Product::where('stock_quantity', '<', 10)
            ->where('stock_quantity', '>', 0)
            ->orderBy('stock_quantity')
            ->limit(5)
            ->get()
            ->map(function ($product) {
                return [
                    'id' => $product->id,
                    'name' => $product->name,
                    'stock' => $product->stock_quantity,
                    'image' => $product->images[0] ?? null,
                ];
            });

        return Inertia::render('admin/dashboard', [
            'stats' => $stats,
            'salesData' => $salesData,
            'monthlySales' => $monthlySales,
            'ordersByStatus' => $ordersByStatus,
            'productsByCategory' => $productsByCategory,
            'recentOrders' => $recentOrders,
            'recentActivities' => $recentActivities,
            'topProducts' => $topProducts,
            'lowStockProducts' => $lowStockProducts,
        ]);
    }
}
