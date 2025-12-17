<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CustomerController extends Controller
{
    /**
     * Display a listing of customers (registered users)
     * Note: Orders are matched by email since the orders table doesn't have user_id
     */
    public function index(Request $request): Response
    {
        $query = User::select('users.*')
            ->selectSub(function ($q) {
                $q->from('orders')
                    ->selectRaw('count(*)')
                    ->whereColumn('orders.customer_email', 'users.email');
            }, 'orders_count')
            ->selectSub(function ($q) {
                $q->from('orders')
                    ->selectRaw('coalesce(sum(total_amount), 0)')
                    ->whereColumn('orders.customer_email', 'users.email');
            }, 'orders_sum_total_amount')
            ->latest();

        // Apply search filter
        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%");
            });
        }

        // Calculate stats
        $stats = [
            'total_customers' => User::count(),
            'new_this_month' => User::where('created_at', '>=', now()->startOfMonth())->count(),
            'total_orders' => Order::count(),
            'avg_orders_per_customer' => User::count() > 0
                ? round(Order::count() / User::count(), 1)
                : 0,
        ];

        return Inertia::render('admin/customers/index', [
            'customers' => $query->paginate(10)->withQueryString(),
            'filters' => [
                'search' => $request->input('search', ''),
            ],
            'stats' => $stats,
        ]);
    }

    /**
     * Get customer details
     * Note: Orders are matched by email since the orders table doesn't have user_id
     */
    public function show(User $customer): Response
    {
        // Get orders for this customer by email
        $orders = Order::where('customer_email', $customer->email)
            ->with('items.product')
            ->latest()
            ->limit(10)
            ->get();

        $ordersCount = Order::where('customer_email', $customer->email)->count();
        $ordersTotal = Order::where('customer_email', $customer->email)->sum('total_amount');

        // Add computed attributes to customer
        $customer->orders_count = $ordersCount;
        $customer->orders_sum_total_amount = $ordersTotal;
        $customer->setRelation('orders', $orders);

        return Inertia::render('admin/customers/show', [
            'customer' => $customer,
        ]);
    }

    /**
     * Get all customers as JSON
     * Note: Orders are matched by email since the orders table doesn't have user_id
     */
    public function list(): JsonResponse
    {
        $customers = User::select('users.*')
            ->selectSub(function ($q) {
                $q->from('orders')
                    ->selectRaw('count(*)')
                    ->whereColumn('orders.customer_email', 'users.email');
            }, 'orders_count')
            ->selectSub(function ($q) {
                $q->from('orders')
                    ->selectRaw('coalesce(sum(total_amount), 0)')
                    ->whereColumn('orders.customer_email', 'users.email');
            }, 'orders_sum_total_amount')
            ->latest()
            ->get();

        return response()->json($customers);
    }

    /**
     * Delete a customer
     */
    public function destroy(User $customer): RedirectResponse
    {
        // Don't allow deleting users with orders
        if ($customer->orders()->exists()) {
            return redirect()->back()->withErrors(['error' => 'Cannot delete customer with existing orders.']);
        }

        $customer->delete();

        return redirect()->back();
    }
}
