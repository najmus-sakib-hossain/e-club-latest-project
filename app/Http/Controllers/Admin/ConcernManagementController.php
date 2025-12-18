<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Concern;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class ConcernManagementController extends Controller
{
    public function index(): Response
    {
        $concerns = Concern::ordered()->get();
        
        return Inertia::render('admin/concerns/index', [
            'concerns' => $concerns,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'slug' => 'nullable|string|max:255|unique:concerns,slug',
            'short_description' => 'nullable|string',
            'description' => 'required|string',
            'icon' => 'nullable|string',
            'category' => 'nullable|string',
            'status' => 'required|in:active,resolved,ongoing',
            'priority' => 'required|in:low,medium,high,critical',
            'raised_date' => 'nullable|date',
            'contact_person' => 'nullable|string',
            'contact_email' => 'nullable|email',
            'proposed_solution' => 'nullable|string',
            'current_status_update' => 'nullable|string',
            'is_featured' => 'boolean',
            'is_active' => 'boolean',
            'sort_order' => 'nullable|integer',
        ]);

        if (empty($validated['slug'])) {
            $validated['slug'] = Str::slug($validated['title']);
        }

        Concern::create($validated);

        return redirect()->back()->with('success', 'Concern created successfully');
    }

    public function update(Request $request, Concern $concern)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'slug' => 'nullable|string|max:255|unique:concerns,slug,' . $concern->id,
            'short_description' => 'nullable|string',
            'description' => 'required|string',
            'icon' => 'nullable|string',
            'category' => 'nullable|string',
            'status' => 'required|in:active,resolved,ongoing',
            'priority' => 'required|in:low,medium,high,critical',
            'raised_date' => 'nullable|date',
            'contact_person' => 'nullable|string',
            'contact_email' => 'nullable|email',
            'proposed_solution' => 'nullable|string',
            'current_status_update' => 'nullable|string',
            'is_featured' => 'boolean',
            'is_active' => 'boolean',
            'sort_order' => 'nullable|integer',
        ]);

        if (empty($validated['slug'])) {
            $validated['slug'] = Str::slug($validated['title']);
        }

        $concern->update($validated);

        return redirect()->back()->with('success', 'Concern updated successfully');
    }

    public function destroy(Concern $concern)
    {
        $concern->delete();
        
        return redirect()->back()->with('success', 'Concern deleted successfully');
    }
}
