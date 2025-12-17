<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\CustomerReview;
use App\Models\FeatureCard;
use App\Models\FeaturedProduct;
use App\Models\HeroSlide;
use App\Models\Product;
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
            'businessCollections' => Category::active()->collection('business')->ordered()->get(),
            'familyCollections' => Category::active()->collection('family')->ordered()->get(),
            'seatingCollections' => Category::active()->collection('seating')->ordered()->get(),
            'newArrivals' => Product::active()->newArrivals()->with('category')->latest()->limit(20)->get(),
            'featuredProducts' => Product::active()->featured()->with('category')->latest()->limit(20)->get(),
            'bestSellers' => Product::active()->bestSellers()->with('category')->latest()->limit(20)->get(),
            'featuredProduct' => FeaturedProduct::active()->with('product')->first(),
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
     * Get categories by collection type
     */
    public function categories(?string $type = null): JsonResponse
    {
        $query = Category::active()->ordered();

        if ($type) {
            $query->collection($type);
        }

        return response()->json($query->get());
    }

    /**
     * Get new arrival products
     */
    public function newArrivals(): JsonResponse
    {
        return response()->json(
            Product::active()->newArrivals()->with('category')->latest()->limit(20)->get()
        );
    }

    /**
     * Get featured products (multiple)
     */
    public function featuredProducts(): JsonResponse
    {
        return response()->json(
            Product::active()->featured()->with('category')->latest()->limit(20)->get()
        );
    }

    /**
     * Get featured product (single highlight)
     */
    public function featuredProduct(): JsonResponse
    {
        return response()->json(
            FeaturedProduct::active()->with('product')->first()
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
     * Get best seller products
     */
    public function bestSellers(): JsonResponse
    {
        return response()->json(
            Product::active()->bestSellers()->with('category')->latest()->limit(20)->get()
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
