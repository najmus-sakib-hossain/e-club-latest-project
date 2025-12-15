<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\HomeSection;
use App\Models\HomeStat;
use App\Models\HomeActivity;
use App\Models\HomeProject;
use App\Models\HomePartner;
use App\Models\HomeCoreValue;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class HomePageController extends Controller
{
    /**
     * Display home page management
     */
    public function index(): Response
    {
        return Inertia::render('admin/homepage/index', [
            'sections' => HomeSection::ordered()->get(),
            'stats' => HomeStat::ordered()->get(),
            'activities' => HomeActivity::ordered()->get(),
            'projects' => HomeProject::ordered()->get(),
            'partners' => HomePartner::ordered()->get(),
            'coreValues' => HomeCoreValue::ordered()->get(),
        ]);
    }

    // ===== HOME SECTIONS =====
    
    /**
     * Update home section
     */
    public function updateSection(Request $request, HomeSection $section): RedirectResponse
    {
        $validated = $request->validate([
            'title' => 'nullable|string|max:255',
            'subtitle' => 'nullable|string',
            'content' => 'nullable|string',
            'image' => 'nullable|image|max:5120',
            'data' => 'nullable|array',
            'is_active' => 'boolean',
            'sort_order' => 'integer',
        ]);

        if ($request->hasFile('image')) {
            if ($section->image && !str_starts_with($section->image, 'http')) {
                Storage::disk('public')->delete($section->image);
            }
            $validated['image'] = $request->file('image')->store('home-sections', 'public');
        }

        $section->update($validated);

        return redirect()->back()->with('success', 'Section updated successfully');
    }

    // ===== STATS =====
    
    /**
     * Store stat
     */
    public function storeStat(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'count' => 'required|string|max:50',
            'label' => 'required|string|max:255',
            'is_active' => 'boolean',
            'sort_order' => 'integer',
        ]);

        HomeStat::create($validated);

        return redirect()->back()->with('success', 'Stat added successfully');
    }

    /**
     * Update stat
     */
    public function updateStat(Request $request, HomeStat $stat): RedirectResponse
    {
        $validated = $request->validate([
            'count' => 'required|string|max:50',
            'label' => 'required|string|max:255',
            'is_active' => 'boolean',
            'sort_order' => 'integer',
        ]);

        $stat->update($validated);

        return redirect()->back()->with('success', 'Stat updated successfully');
    }

    /**
     * Delete stat
     */
    public function deleteStat(HomeStat $stat): RedirectResponse
    {
        $stat->delete();

        return redirect()->back()->with('success', 'Stat deleted successfully');
    }

    // ===== ACTIVITIES =====
    
    /**
     * Store activity
     */
    public function storeActivity(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'image' => 'nullable|image|max:5120',
            'icon' => 'nullable|string|max:100',
            'is_active' => 'boolean',
            'sort_order' => 'integer',
        ]);

        if ($request->hasFile('image')) {
            $validated['image'] = $request->file('image')->store('activities', 'public');
        }

        HomeActivity::create($validated);

        return redirect()->back()->with('success', 'Activity added successfully');
    }

    /**
     * Update activity
     */
    public function updateActivity(Request $request, HomeActivity $activity): RedirectResponse
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'image' => 'nullable|image|max:5120',
            'icon' => 'nullable|string|max:100',
            'is_active' => 'boolean',
            'sort_order' => 'integer',
        ]);

        if ($request->hasFile('image')) {
            if ($activity->image && !str_starts_with($activity->image, 'http')) {
                Storage::disk('public')->delete($activity->image);
            }
            $validated['image'] = $request->file('image')->store('activities', 'public');
        }

        $activity->update($validated);

        return redirect()->back()->with('success', 'Activity updated successfully');
    }

    /**
     * Delete activity
     */
    public function deleteActivity(HomeActivity $activity): RedirectResponse
    {
        if ($activity->image && !str_starts_with($activity->image, 'http')) {
            Storage::disk('public')->delete($activity->image);
        }
        
        $activity->delete();

        return redirect()->back()->with('success', 'Activity deleted successfully');
    }

    // ===== PROJECTS =====
    
    /**
     * Store project
     */
    public function storeProject(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'image' => 'required|image|max:5120',
            'url' => 'nullable|url|max:255',
            'is_active' => 'boolean',
            'sort_order' => 'integer',
        ]);

        if ($request->hasFile('image')) {
            $validated['image'] = $request->file('image')->store('projects', 'public');
        }

        HomeProject::create($validated);

        return redirect()->back()->with('success', 'Project added successfully');
    }

    /**
     * Update project
     */
    public function updateProject(Request $request, HomeProject $project): RedirectResponse
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'image' => 'nullable|image|max:5120',
            'url' => 'nullable|url|max:255',
            'is_active' => 'boolean',
            'sort_order' => 'integer',
        ]);

        if ($request->hasFile('image')) {
            if ($project->image && !str_starts_with($project->image, 'http')) {
                Storage::disk('public')->delete($project->image);
            }
            $validated['image'] = $request->file('image')->store('projects', 'public');
        }

        $project->update($validated);

        return redirect()->back()->with('success', 'Project updated successfully');
    }

    /**
     * Delete project
     */
    public function deleteProject(HomeProject $project): RedirectResponse
    {
        if ($project->image && !str_starts_with($project->image, 'http')) {
            Storage::disk('public')->delete($project->image);
        }
        
        $project->delete();

        return redirect()->back()->with('success', 'Project deleted successfully');
    }

    // ===== PARTNERS =====
    
    /**
     * Store partner
     */
    public function storePartner(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'logo' => 'required|image|max:5120',
            'url' => 'nullable|url|max:255',
            'is_active' => 'boolean',
            'sort_order' => 'integer',
        ]);

        if ($request->hasFile('logo')) {
            $validated['logo'] = $request->file('logo')->store('partners', 'public');
        }

        HomePartner::create($validated);

        return redirect()->back()->with('success', 'Partner added successfully');
    }

    /**
     * Update partner
     */
    public function updatePartner(Request $request, HomePartner $partner): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'logo' => 'nullable|image|max:5120',
            'url' => 'nullable|url|max:255',
            'is_active' => 'boolean',
            'sort_order' => 'integer',
        ]);

        if ($request->hasFile('logo')) {
            if ($partner->logo && !str_starts_with($partner->logo, 'http')) {
                Storage::disk('public')->delete($partner->logo);
            }
            $validated['logo'] = $request->file('logo')->store('partners', 'public');
        }

        $partner->update($validated);

        return redirect()->back()->with('success', 'Partner updated successfully');
    }

    /**
     * Delete partner
     */
    public function deletePartner(HomePartner $partner): RedirectResponse
    {
        if ($partner->logo && !str_starts_with($partner->logo, 'http')) {
            Storage::disk('public')->delete($partner->logo);
        }
        
        $partner->delete();

        return redirect()->back()->with('success', 'Partner deleted successfully');
    }

    // ===== CORE VALUES =====
    
    /**
     * Store core value
     */
    public function storeCoreValue(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'icon' => 'nullable|string|max:100',
            'is_active' => 'boolean',
            'sort_order' => 'integer',
        ]);

        HomeCoreValue::create($validated);

        return redirect()->back()->with('success', 'Core value added successfully');
    }

    /**
     * Update core value
     */
    public function updateCoreValue(Request $request, HomeCoreValue $coreValue): RedirectResponse
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'icon' => 'nullable|string|max:100',
            'is_active' => 'boolean',
            'sort_order' => 'integer',
        ]);

        $coreValue->update($validated);

        return redirect()->back()->with('success', 'Core value updated successfully');
    }

    /**
     * Delete core value
     */
    public function deleteCoreValue(HomeCoreValue $coreValue): RedirectResponse
    {
        $coreValue->delete();

        return redirect()->back()->with('success', 'Core value deleted successfully');
    }
}
