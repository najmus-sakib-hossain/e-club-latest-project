<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\CustomerReview;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class CustomerReviewController extends Controller
{
    /**
     * Display a listing of customer reviews
     */
    public function index(): Response
    {
        return Inertia::render('admin/customer-reviews/index', [
            'reviews' => CustomerReview::ordered()->get(),
        ]);
    }

    /**
     * Get all reviews as JSON (for API)
     */
    public function list(): JsonResponse
    {
        return response()->json(CustomerReview::ordered()->get());
    }

    /**
     * Store a new customer review
     */
    public function store(Request $request): RedirectResponse|JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'role' => 'nullable|string|max:255',
            'review' => 'required|string',
            'rating' => 'required|integer|min:1|max:5',
            'image' => 'nullable|image|max:2048',
            'is_active' => 'boolean',
            'order' => 'integer|min:0',
        ]);

        // Handle image upload
        if ($request->hasFile('image')) {
            $validated['image'] = $request->file('image')->store('reviews', 'public');
        }

        $review = CustomerReview::create($validated);

        if ($request->wantsJson()) {
            return response()->json([
                'message' => 'Review created successfully',
                'review' => $review,
            ]);
        }

        return redirect()->back()->with('success', 'Review created successfully');
    }

    /**
     * Update a customer review
     */
    public function update(Request $request, CustomerReview $customerReview): RedirectResponse|JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'role' => 'nullable|string|max:255',
            'review' => 'required|string',
            'rating' => 'required|integer|min:1|max:5',
            'image' => 'nullable|image|max:2048',
            'is_active' => 'boolean',
            'order' => 'integer|min:0',
        ]);

        // Handle image upload
        if ($request->hasFile('image')) {
            // Delete old image if exists
            if ($customerReview->image && Storage::disk('public')->exists($customerReview->image)) {
                Storage::disk('public')->delete($customerReview->image);
            }
            $validated['image'] = $request->file('image')->store('reviews', 'public');
        }

        $customerReview->update($validated);

        if ($request->wantsJson()) {
            return response()->json([
                'message' => 'Review updated successfully',
                'review' => $customerReview->fresh(),
            ]);
        }

        return redirect()->back()->with('success', 'Review updated successfully');
    }

    /**
     * Delete a customer review
     */
    public function destroy(CustomerReview $customerReview): RedirectResponse|JsonResponse
    {
        // Delete image if exists
        if ($customerReview->image && Storage::disk('public')->exists($customerReview->image)) {
            Storage::disk('public')->delete($customerReview->image);
        }

        $customerReview->delete();

        if (request()->wantsJson()) {
            return response()->json(['message' => 'Review deleted successfully']);
        }

        return redirect()->back()->with('success', 'Review deleted successfully');
    }

    /**
     * Update the order of reviews
     */
    public function updateOrder(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'reviews' => 'required|array',
            'reviews.*.id' => 'required|exists:customer_reviews,id',
            'reviews.*.order' => 'required|integer|min:0',
        ]);

        foreach ($validated['reviews'] as $reviewData) {
            CustomerReview::where('id', $reviewData['id'])->update(['order' => $reviewData['order']]);
        }

        return response()->json(['message' => 'Order updated successfully']);
    }
}
