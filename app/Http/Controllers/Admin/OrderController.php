<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Mail\OrderConfirmationMail;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class OrderController extends Controller
{
    /**
     * Display a listing of orders
     */
    public function index(Request $request): Response
    {
        $query = Order::with('items.product')->latest();

        // Apply search filter
        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('order_number', 'like', "%{$search}%")
                    ->orWhere('customer_name', 'like', "%{$search}%")
                    ->orWhere('customer_email', 'like', "%{$search}%");
            });
        }

        // Apply status filter
        if ($request->filled('status') && $request->input('status') !== 'all') {
            $query->where('status', $request->input('status'));
        }

        // Apply payment status filter
        if ($request->filled('payment_status') && $request->input('payment_status') !== 'all') {
            $query->where('payment_status', $request->input('payment_status'));
        }

        // Calculate stats
        $stats = [
            'total_orders' => Order::count(),
            'pending_orders' => Order::where('status', 'pending')->count(),
            'total_revenue' => Order::where('payment_status', 'paid')->sum('total_amount'),
            'avg_order_value' => Order::where('payment_status', 'paid')->avg('total_amount') ?? 0,
        ];

        return Inertia::render('admin/orders/index', [
            'orders' => $query->paginate(10)->withQueryString(),
            'filters' => [
                'search' => $request->input('search', ''),
                'status' => $request->input('status', 'all'),
                'payment_status' => $request->input('payment_status', 'all'),
            ],
            'stats' => $stats,
        ]);
    }

    /**
     * Get all orders as JSON
     */
    public function list(): JsonResponse
    {
        return response()->json(Order::with('items.product')->latest()->get());
    }

    /**
     * Store a new order (guest checkout)
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'customer_name' => 'required|string|max:255',
            'customer_email' => 'required|email|max:255',
            'customer_phone' => 'required|string|max:20',
            'shipping_address' => 'required|string|max:500',
            'payment_method' => 'required|string|in:bkash,nagad,rocket,card,cod',
            'transaction_id' => 'nullable|string|max:100',
            'notes' => 'nullable|string|max:500',
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1',
            'items.*.price' => 'required|numeric|min:0',
            'subtotal' => 'required|numeric|min:0',
            'shipping_amount' => 'nullable|numeric|min:0',
            'total_amount' => 'required|numeric|min:0',
        ]);

        // Generate unique order number
        $orderNumber = 'ORD-'.strtoupper(Str::random(8));
        while (Order::where('order_number', $orderNumber)->exists()) {
            $orderNumber = 'ORD-'.strtoupper(Str::random(8));
        }

        // Determine payment status based on payment method
        $paymentStatus = 'pending';
        if (in_array($validated['payment_method'], ['bkash', 'nagad', 'rocket', 'card']) && ! empty($validated['transaction_id'])) {
            $paymentStatus = 'paid'; // Payment was processed successfully
        }

        // Create order
        $order = Order::create([
            'order_number' => $orderNumber,
            'customer_name' => $validated['customer_name'],
            'customer_email' => $validated['customer_email'],
            'customer_phone' => $validated['customer_phone'],
            'shipping_address' => $validated['shipping_address'],
            'payment_method' => $validated['payment_method'],
            'payment_status' => $paymentStatus,
            'transaction_id' => $validated['transaction_id'] ?? null,
            'status' => 'pending',
            'notes' => $validated['notes'] ?? null,
            'subtotal' => $validated['subtotal'],
            'discount_amount' => 0,
            'shipping_amount' => $validated['shipping_amount'] ?? 0,
            'total_amount' => $validated['total_amount'],
        ]);

        // Create order items
        foreach ($validated['items'] as $item) {
            $product = Product::find($item['product_id']);

            OrderItem::create([
                'order_id' => $order->id,
                'product_id' => $item['product_id'],
                'name' => $product->name,
                'price' => $item['price'],
                'quantity' => $item['quantity'],
                'image' => $product->images[0] ?? null,
            ]);
        }

        // Send order confirmation email
        try {
            Mail::to($order->customer_email)->send(new OrderConfirmationMail($order->load('items')));
        } catch (\Exception $e) {
            // Log the error but don't fail the order
            \Log::error('Failed to send order confirmation email: '.$e->getMessage());
        }

        return response()->json([
            'message' => 'Order created successfully',
            'order_number' => $order->order_number,
            'order' => $order->load('items'),
        ], 201);
    }

    /**
     * Show a single order
     */
    public function show(Order $order): Response
    {
        return Inertia::render('admin/orders/show', [
            'order' => $order->load('items.product'),
        ]);
    }

    /**
     * Update order (including status)
     */
    public function update(Request $request, Order $order): RedirectResponse
    {
        $validated = $request->validate([
            'status' => 'nullable|string|in:pending,processing,shipped,delivered,cancelled',
            'payment_status' => 'nullable|string|in:pending,paid,failed,refunded',
        ]);

        $order->update(array_filter($validated));

        return redirect()->back();
    }

    /**
     * Update order status
     */
    public function updateStatus(Request $request, Order $order): RedirectResponse
    {
        $validated = $request->validate([
            'status' => 'required|string|in:pending,processing,shipped,delivered,cancelled',
        ]);

        $order->update($validated);

        return redirect()->back();
    }

    /**
     * Update payment status
     */
    public function updatePaymentStatus(Request $request, Order $order): RedirectResponse
    {
        $validated = $request->validate([
            'payment_status' => 'required|string|in:pending,paid,failed,refunded',
        ]);

        $order->update($validated);

        return redirect()->back();
    }

    /**
     * Update order via API (both status and payment_status)
     */
    public function apiUpdate(Request $request, Order $order): JsonResponse
    {
        $validated = $request->validate([
            'status' => 'nullable|string|in:pending,processing,shipped,delivered,cancelled',
            'payment_status' => 'nullable|string|in:pending,paid,failed,refunded',
        ]);

        $order->update(array_filter($validated));

        return response()->json($order);
    }
}
