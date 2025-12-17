<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\FooterAddress;
use App\Models\FooterLink;
use App\Models\FooterSection;
use App\Models\HomeActivity;
use App\Models\HomeCoreValue;
use App\Models\HomePartner;
use App\Models\HomeProject;
use App\Models\HomeSection;
use App\Models\HomeStat;
use App\Models\NavigationMenu;
use App\Models\SocialLink;
use Inertia\Inertia;
use Inertia\Response;

class HomeController extends Controller
{
    /**
     * Display the home page.
     */
    public function index(): Response
    {
        return Inertia::render('home', [
            // Navigation via HandleInertiaRequests middleware is likely cleaner,
            // but keeping specific header structure for now if it differs.
            'navigationMenus' => NavigationMenu::getHeaderStructure(),
            'footerData' => [
                'sections' => FooterSection::getAllActive(),
                'bangladeshAddresses' => FooterAddress::getBangladeshAddresses(),
                'internationalAddresses' => FooterAddress::getInternationalAddresses(),
                'links' => FooterLink::getAllGrouped(),
                'socialLinks' => SocialLink::getAllActive(),
            ],
            'homeSections' => HomeSection::getAllActive(),
            'stats' => HomeStat::getAllActive(),
            'activities' => HomeActivity::getAllActive(),
            'projects' => HomeProject::getAllActive(),
            'partners' => HomePartner::getAllActive(),
            'coreValues' => HomeCoreValue::getAllActive(),
        ]);
    }
}
