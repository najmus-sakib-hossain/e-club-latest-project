<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\FooterAddress;
use App\Models\FooterLink;
use App\Models\FooterSection;
use App\Models\NavigationMenu;
use App\Models\Project;
use App\Models\SocialLink;
use Inertia\Inertia;
use Inertia\Response;

class ProjectController extends Controller
{
    public function index(): Response
    {
        $projects = Project::active()->ordered()->get();

        return Inertia::render('projects', [
            'projects' => $projects,
            'navigationMenus' => NavigationMenu::getHeaderStructure(),
            'footerData' => [
                'sections' => FooterSection::getAllActive(),
                'bangladeshAddresses' => FooterAddress::getBangladeshAddresses(),
                'internationalAddresses' => FooterAddress::getInternationalAddresses(),
                'links' => FooterLink::getAllGrouped(),
                'socialLinks' => SocialLink::getAllActive(),
            ],
        ]);
    }

    public function show(string $slug): Response
    {
        $project = Project::where('slug', $slug)->where('is_active', true)->firstOrFail();
        $relatedProjects = Project::active()
            ->where('id', '!=', $project->id)
            ->where('category', $project->category)
            ->limit(3)
            ->get();

        return Inertia::render('projects/detail', [
            'project' => $project,
            'relatedProjects' => $relatedProjects,
            'navigationMenus' => NavigationMenu::getHeaderStructure(),
            'footerData' => [
                'sections' => FooterSection::getAllActive(),
                'bangladeshAddresses' => FooterAddress::getBangladeshAddresses(),
                'internationalAddresses' => FooterAddress::getInternationalAddresses(),
                'links' => FooterLink::getAllGrouped(),
                'socialLinks' => SocialLink::getAllActive(),
            ],
        ]);
    }
}
