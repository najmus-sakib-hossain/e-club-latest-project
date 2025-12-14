<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\PageContent;
use App\Models\TeamMember;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class AboutPageController extends Controller
{
    /**
     * Display the About page settings
     */
    public function index(): Response
    {
        $content = PageContent::where('page_slug', 'about')->get()->keyBy('section_key');
        $teamMembers = TeamMember::orderBy('sort_order')->get();

        return Inertia::render('admin/content-pages/about', [
            'content' => $content,
            'teamMembers' => $teamMembers,
        ]);
    }

    /**
     * Update About page content
     */
    public function update(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'hero_title' => 'nullable|string|max:255',
            'hero_description' => 'nullable|string',
            'story_title' => 'nullable|string|max:255',
            'story_content' => 'nullable|string',
            'story_image' => 'nullable|image|max:2048',
            'values_title' => 'nullable|string|max:255',
            'values_subtitle' => 'nullable|string',
            'values' => 'nullable|array',
            'values.*.icon' => 'nullable|string',
            'values.*.title' => 'nullable|string|max:255',
            'values.*.description' => 'nullable|string',
            'stats' => 'nullable|array',
            'stats.*.label' => 'nullable|string|max:255',
            'stats.*.value' => 'nullable|string|max:50',
            'features' => 'nullable|array',
            'features.*.icon' => 'nullable|string',
            'features.*.title' => 'nullable|string|max:255',
            'features.*.description' => 'nullable|string',
            'team_title' => 'nullable|string|max:255',
            'team_subtitle' => 'nullable|string',
        ]);

        // Handle hero section
        $heroData = [
            'title' => $validated['hero_title'] ?? null,
            'content' => $validated['hero_description'] ?? null,
        ];
        PageContent::setSection('about', 'hero', $heroData);

        // Handle story section
        $storyData = [
            'title' => $validated['story_title'] ?? null,
            'content' => $validated['story_content'] ?? null,
        ];
        if ($request->hasFile('story_image')) {
            $path = $request->file('story_image')->store('pages/about', 'public');
            $storyData['image'] = $path;
        }
        PageContent::setSection('about', 'story', $storyData);

        // Handle stats section
        if (isset($validated['stats'])) {
            PageContent::setSection('about', 'stats', [
                'items' => $validated['stats'],
            ]);
        }

        // Handle values section
        $valuesData = [
            'title' => $validated['values_title'] ?? null,
            'subtitle' => $validated['values_subtitle'] ?? null,
        ];
        if (isset($validated['values'])) {
            $valuesData['items'] = $validated['values'];
        }
        PageContent::setSection('about', 'values', $valuesData);

        // Handle features section
        if (isset($validated['features'])) {
            PageContent::setSection('about', 'features', [
                'items' => $validated['features'],
            ]);
        }

        // Handle team section titles
        PageContent::setSection('about', 'team', [
            'title' => $validated['team_title'] ?? null,
            'subtitle' => $validated['team_subtitle'] ?? null,
        ]);

        return redirect()->back()->with('success', 'About page content updated successfully');
    }

    /**
     * Store a new team member
     */
    public function storeTeamMember(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'role' => 'required|string|max:255',
            'bio' => 'nullable|string',
            'image' => 'nullable|image|max:2048',
            'social_links' => 'nullable|array',
            'is_active' => 'boolean',
            'sort_order' => 'integer',
        ]);

        if ($request->hasFile('image')) {
            $validated['image'] = $request->file('image')->store('team', 'public');
        }

        TeamMember::create($validated);

        return redirect()->back()->with('success', 'Team member added successfully');
    }

    /**
     * Update a team member
     */
    public function updateTeamMember(Request $request, TeamMember $teamMember): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'role' => 'required|string|max:255',
            'bio' => 'nullable|string',
            'image' => 'nullable|image|max:2048',
            'social_links' => 'nullable|array',
            'is_active' => 'boolean',
            'sort_order' => 'integer',
        ]);

        if ($request->hasFile('image')) {
            // Delete old image if exists
            if ($teamMember->image) {
                Storage::disk('public')->delete($teamMember->image);
            }
            $validated['image'] = $request->file('image')->store('team', 'public');
        }

        $teamMember->update($validated);

        return redirect()->back()->with('success', 'Team member updated successfully');
    }

    /**
     * Delete a team member
     */
    public function destroyTeamMember(TeamMember $teamMember): RedirectResponse
    {
        if ($teamMember->image) {
            Storage::disk('public')->delete($teamMember->image);
        }
        
        $teamMember->delete();

        return redirect()->back()->with('success', 'Team member deleted successfully');
    }
}
