<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Project;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class ProjectManagementController extends Controller
{
    public function index(): Response
    {
        $projects = Project::orderBy('sort_order')->orderBy('created_at', 'desc')->get();
        
        return Inertia::render('admin/projects/index', [
            'projects' => $projects,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'slug' => 'nullable|string|max:255|unique:projects,slug',
            'short_description' => 'nullable|string',
            'description' => 'required|string',
            'image' => 'nullable|image|max:2048',
            'category' => 'nullable|string',
            'status' => 'required|in:ongoing,completed,planned',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date',
            'location' => 'nullable|string',
            'project_lead' => 'nullable|string',
            'contact_email' => 'nullable|email',
            'website_url' => 'nullable|url',
            'is_featured' => 'boolean',
            'is_active' => 'boolean',
            'sort_order' => 'nullable|integer',
        ]);

        if (empty($validated['slug'])) {
            $validated['slug'] = Str::slug($validated['title']);
        }

        if ($request->hasFile('image')) {
            $validated['image'] = $request->file('image')->store('projects', 'public');
        }

        Project::create($validated);

        return redirect()->back()->with('success', 'Project created successfully');
    }

    public function update(Request $request, Project $project)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'slug' => 'nullable|string|max:255|unique:projects,slug,' . $project->id,
            'short_description' => 'nullable|string',
            'description' => 'required|string',
            'image' => 'nullable|image|max:2048',
            'category' => 'nullable|string',
            'status' => 'required|in:ongoing,completed,planned',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date',
            'location' => 'nullable|string',
            'project_lead' => 'nullable|string',
            'contact_email' => 'nullable|email',
            'website_url' => 'nullable|url',
            'is_featured' => 'boolean',
            'is_active' => 'boolean',
            'sort_order' => 'nullable|integer',
        ]);

        if (empty($validated['slug'])) {
            $validated['slug'] = Str::slug($validated['title']);
        }

        if ($request->hasFile('image')) {
            $validated['image'] = $request->file('image')->store('projects', 'public');
        }

        $project->update($validated);

        return redirect()->back()->with('success', 'Project updated successfully');
    }

    public function destroy(Project $project)
    {
        $project->delete();
        
        return redirect()->back()->with('success', 'Project deleted successfully');
    }
}
