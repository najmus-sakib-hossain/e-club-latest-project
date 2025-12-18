<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\CustomerReview;
use App\Models\FeatureCard;
use App\Models\HeroSlide;
use App\Models\SiteSetting;
use App\Models\TrustedCompany;
use Illuminate\Http\JsonResponse;

class HomeContentController extends Controller
{
    /**
     * Get all content for the home page
     */
    public function index(): JsonResponse
    {
        return response()->json([
            'heroSlides' => HeroSlide::active()->ordered()->get(),
            'featureCards' => FeatureCard::active()->ordered()->get(),
            'trustedCompanies' => TrustedCompany::active()->ordered()->get(),
            'customerReviews' => CustomerReview::active()->ordered()->get(),
            'siteSettings' => SiteSetting::getAllGrouped(),
        ]);
    }

    /**
     * Get hero slides
     */
    public function heroSlides(): JsonResponse
    {
        return response()->json(
            HeroSlide::active()->ordered()->get()
        );
    }

    /**
     * Get feature cards
     */
    public function featureCards(): JsonResponse
    {
        return response()->json(
            FeatureCard::active()->ordered()->get()
        );
    }

    /**
     * Get trusted companies
     */
    public function trustedCompanies(): JsonResponse
    {
        return response()->json(
            TrustedCompany::active()->ordered()->get()
        );
    }

    /**
     * Get customer reviews
     */
    public function customerReviews(): JsonResponse
    {
        return response()->json(
            CustomerReview::active()->ordered()->get()
        );
    }

    /**
     * Get site settings
     */
    public function siteSettings(): JsonResponse
    {
        return response()->json(
            SiteSetting::getAllGrouped()
        );
    }
}
