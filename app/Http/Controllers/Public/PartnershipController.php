<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\FooterAddress;
use App\Models\FooterLink;
use App\Models\FooterSection;
use App\Models\NavigationMenu;
use App\Models\Partnership;
use App\Models\SocialLink;
use Inertia\Inertia;
use Inertia\Response;

class PartnershipController extends Controller
{
    public function index(): Response
    {
        $partnerships = Partnership::active()->ordered()->get();

        return Inertia::render('partnerships', [
            'partnerships' => $partnerships,
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
        $partnership = Partnership::where('slug', $slug)->where('is_active', true)->firstOrFail();
        $relatedPartnerships = Partnership::active()
            ->where('id', '!=', $partnership->id)
            ->where('type', $partnership->type)
            ->limit(3)
            ->get();

        return Inertia::render('partnerships/detail', [
            'partnership' => $partnership,
            'relatedPartnerships' => $relatedPartnerships,
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
