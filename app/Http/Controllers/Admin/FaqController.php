<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Faq;
use App\Models\FaqCategory;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class FaqController extends Controller
{
    /**
     * Display a listing of FAQ categories and their FAQs
     */
    public function index(): Response
    {
        return Inertia::render('admin/content-pages/faqs', [
            'categories' => FaqCategory::with('faqs')->orderBy('sort_order')->get(),
        ]);
    }

    /**
     * Store a new FAQ category
     */
    public function storeCategory(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'icon' => 'nullable|string|max:100',
            'page_slug' => 'nullable|string|max:100',
            'is_active' => 'boolean',
            'sort_order' => 'integer',
        ]);

        FaqCategory::create($validated);

        return redirect()->back()->with('success', 'FAQ category created successfully');
    }

    /**
     * Update an FAQ category
     */
    public function updateCategory(Request $request, FaqCategory $faqCategory): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'icon' => 'nullable|string|max:100',
            'page_slug' => 'nullable|string|max:100',
            'is_active' => 'boolean',
            'sort_order' => 'integer',
        ]);

        $faqCategory->update($validated);

        return redirect()->back()->with('success', 'FAQ category updated successfully');
    }

    /**
     * Delete an FAQ category
     */
    public function destroyCategory(FaqCategory $faqCategory): RedirectResponse
    {
        $faqCategory->delete(); // Will cascade delete FAQs

        return redirect()->back()->with('success', 'FAQ category deleted successfully');
    }

    /**
     * Store a new FAQ
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'faq_category_id' => 'required|exists:faq_categories,id',
            'question' => 'required|string|max:500',
            'answer' => 'required|string',
            'is_active' => 'boolean',
            'sort_order' => 'integer',
        ]);

        Faq::create($validated);

        return redirect()->back()->with('success', 'FAQ created successfully');
    }

    /**
     * Update an FAQ
     */
    public function update(Request $request, Faq $faq): RedirectResponse
    {
        $validated = $request->validate([
            'faq_category_id' => 'required|exists:faq_categories,id',
            'question' => 'required|string|max:500',
            'answer' => 'required|string',
            'is_active' => 'boolean',
            'sort_order' => 'integer',
        ]);

        $faq->update($validated);

        return redirect()->back()->with('success', 'FAQ updated successfully');
    }

    /**
     * Delete an FAQ
     */
    public function destroy(Faq $faq): RedirectResponse
    {
        $faq->delete();

        return redirect()->back()->with('success', 'FAQ deleted successfully');
    }
}
