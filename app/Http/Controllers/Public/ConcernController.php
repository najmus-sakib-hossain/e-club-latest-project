<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\Concern;
use App\Models\FooterAddress;
use App\Models\FooterLink;
use App\Models\FooterSection;
use App\Models\NavigationMenu;
use App\Models\SocialLink;
use Inertia\Inertia;
use Inertia\Response;

class ConcernController extends Controller
{
    public function index(): Response
    {
        $concerns = Concern::active()->ordered()->get();

        return Inertia::render('concerns', [
            'concerns' => $concerns,
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
        $concern = Concern::where('slug', $slug)->where('is_active', true)->firstOrFail();
        $relatedConcerns = Concern::active()
            ->where('id', '!=', $concern->id)
            ->where('category', $concern->category)
            ->limit(3)
            ->get();

        return Inertia::render('concerns/detail', [
            'concern' => $concern,
            'relatedConcerns' => $relatedConcerns,
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
