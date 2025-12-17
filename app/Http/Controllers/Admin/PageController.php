<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Page;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class PageController extends Controller
{
    /**
     * Display a listing of pages
     */
    public function index(): Response
    {
        return Inertia::render('admin/pages/index', [
            'pages' => Page::orderBy('sort_order')->orderBy('title')->get(),
        ]);
    }

    /**
     * Store a new page
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'slug' => 'required|string|max:255|unique:pages,slug',
            'content' => 'required|string',
            'meta_title' => 'nullable|string|max:255',
            'meta_description' => 'nullable|string|max:500',
            'is_active' => 'boolean',
            'sort_order' => 'integer',
        ]);

        // Generate slug if not provided
        if (empty($validated['slug'])) {
            $validated['slug'] = Str::slug($validated['title']);
        }

        Page::create($validated);

        return redirect()->back()->with('success', 'Page created successfully');
    }

    /**
     * Update a page
     */
    public function update(Request $request, Page $page): RedirectResponse
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'slug' => 'required|string|max:255|unique:pages,slug,'.$page->id,
            'content' => 'required|string',
            'meta_title' => 'nullable|string|max:255',
            'meta_description' => 'nullable|string|max:500',
            'is_active' => 'boolean',
            'sort_order' => 'integer',
        ]);

        $page->update($validated);

        return redirect()->back()->with('success', 'Page updated successfully');
    }

    /**
     * Delete a page
     */
    public function destroy(Page $page): RedirectResponse
    {
        $page->delete();

        return redirect()->back()->with('success', 'Page deleted successfully');
    }
}
