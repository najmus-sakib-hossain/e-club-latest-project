<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\FeatureCard;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class FeatureCardController extends Controller
{
    /**
     * Display a listing of feature cards
     */
    public function index(): Response
    {
        return Inertia::render('admin/features/index', [
            'features' => FeatureCard::ordered()->get(),
        ]);
    }

    /**
     * Get all feature cards as JSON (for API)
     */
    public function list(): JsonResponse
    {
        return response()->json(FeatureCard::ordered()->get());
    }

    /**
     * Store a new feature card
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'icon' => 'required|string|max:100',
            'order' => 'integer',
            'sort_order' => 'integer',
            'is_active' => 'boolean',
        ]);

        // Handle sort_order alias for order
        if (isset($validated['sort_order']) && !isset($validated['order'])) {
            $validated['order'] = $validated['sort_order'];
        }
        unset($validated['sort_order']);

        FeatureCard::create($validated);

        return redirect()->back()->with('success', 'Feature card created successfully');
    }

    /**
     * Update a feature card
     */
    public function update(Request $request, FeatureCard $featureCard): RedirectResponse
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'icon' => 'required|string|max:100',
            'order' => 'integer',
            'sort_order' => 'integer',
            'is_active' => 'boolean',
        ]);

        // Handle sort_order alias for order
        if (isset($validated['sort_order']) && !isset($validated['order'])) {
            $validated['order'] = $validated['sort_order'];
        }
        unset($validated['sort_order']);

        $featureCard->update($validated);

        return redirect()->back()->with('success', 'Feature card updated successfully');
    }

    /**
     * Delete a feature card
     */
    public function destroy(FeatureCard $featureCard): RedirectResponse
    {
        $featureCard->delete();

        return redirect()->back()->with('success', 'Feature card deleted successfully');
    }

    /**
     * Update order of feature cards
     */
    public function updateOrder(Request $request): RedirectResponse
    {
        $request->validate([
            'cards' => 'required|array',
            'cards.*.id' => 'required|exists:feature_cards,id',
            'cards.*.order' => 'required|integer',
        ]);

        foreach ($request->cards as $cardData) {
            FeatureCard::where('id', $cardData['id'])->update(['order' => $cardData['order']]);
        }

        return redirect()->back()->with('success', 'Order updated successfully');
    }
}
