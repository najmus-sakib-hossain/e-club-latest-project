<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\SiteSetting;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class SiteSettingController extends Controller
{
    /**
     * Display site settings
     */
    public function index(): Response
    {
        return Inertia::render('admin/settings/index', [
            'settings' => SiteSetting::getAllFlat(),
        ]);
    }

    /**
     * Display header settings
     */
    public function header(): Response
    {
        return Inertia::render('admin/settings/header', [
            'settings' => SiteSetting::getAllFlat(),
        ]);
    }

    /**
     * Display footer settings
     */
    public function footer(): Response
    {
        return Inertia::render('admin/settings/footer', [
            'settings' => SiteSetting::getAllFlat(),
        ]);
    }

    /**
     * Get all settings as JSON (for API)
     */
    public function list(): JsonResponse
    {
        return response()->json(SiteSetting::getAllFlat());
    }

    /**
     * Update settings (bulk update)
     */
    public function update(Request $request): RedirectResponse
    {
        $data = $request->all();
        
        // Define setting groups
        $settingGroups = [
            // General settings
            'site_name' => 'general',
            'site_tagline' => 'general',
            'site_description' => 'general',
            'site_logo' => 'general',
            'site_favicon' => 'general',
            // Contact settings
            'contact_email' => 'contact',
            'contact_phone' => 'contact',
            'contact_address' => 'contact',
            'contact_address_line2' => 'contact',
            'contact_phone_support' => 'contact',
            'contact_email_support' => 'contact',
            'contact_hours' => 'contact',
            'contact_page_title' => 'contact',
            'contact_page_subtitle' => 'contact',
            'contact_form_title' => 'contact',
            'contact_form_subtitle' => 'contact',
            'contact_hours_weekday' => 'contact',
            'contact_hours_weekend' => 'contact',
            // Social settings
            'social_facebook' => 'social',
            'social_instagram' => 'social',
            'social_twitter' => 'social',
            'social_linkedin' => 'social',
            'social_youtube' => 'social',
            // Footer settings - base
            'footer_text' => 'footer',
            'footer_copyright' => 'footer',
            'footer_about' => 'footer',
            // Footer settings - section titles
            'footer_follow_us_title' => 'footer',
            'footer_quick_links_title' => 'footer',
            'footer_customer_service_title' => 'footer',
            'footer_information_title' => 'footer',
            'footer_payment_title' => 'footer',
            'footer_payment_methods' => 'footer',
            // Footer settings - Quick Links labels
            'footer_link_home' => 'footer',
            'footer_link_products' => 'footer',
            'footer_link_categories' => 'footer',
            'footer_link_about' => 'footer',
            'footer_link_contact' => 'footer',
            'footer_link_help' => 'footer',
            // Footer settings - Customer Service labels
            'footer_link_account' => 'footer',
            'footer_link_order_tracking' => 'footer',
            'footer_link_wishlist' => 'footer',
            'footer_link_shipping' => 'footer',
            'footer_link_returns' => 'footer',
            'footer_link_faqs' => 'footer',
            // Footer settings - Information labels
            'footer_link_privacy' => 'footer',
            'footer_link_terms' => 'footer',
            'footer_link_warranty' => 'footer',
            'footer_link_care' => 'footer',
            'footer_link_stores' => 'footer',
            // Footer settings - Quick Links URLs
            'footer_link_home_url' => 'footer',
            'footer_link_products_url' => 'footer',
            'footer_link_categories_url' => 'footer',
            'footer_link_about_url' => 'footer',
            'footer_link_contact_url' => 'footer',
            'footer_link_help_url' => 'footer',
            // Footer settings - Customer Service URLs
            'footer_link_account_url' => 'footer',
            'footer_link_order_tracking_url' => 'footer',
            'footer_link_wishlist_url' => 'footer',
            'footer_link_shipping_url' => 'footer',
            'footer_link_returns_url' => 'footer',
            'footer_link_faqs_url' => 'footer',
            // Footer settings - Information URLs
            'footer_link_privacy_url' => 'footer',
            'footer_link_terms_url' => 'footer',
            'footer_link_warranty_url' => 'footer',
            'footer_link_care_url' => 'footer',
            'footer_link_stores_url' => 'footer',
            // Footer settings - Visibility toggles
            'footer_show_quick_links' => 'footer',
            'footer_show_customer_service' => 'footer',
            'footer_show_information' => 'footer',
            'footer_show_payment_methods' => 'footer',
            'footer_show_social_links' => 'footer',
            // Header settings - announcement
            'header_announcement' => 'header',
            'header_announcement_enabled' => 'header',
            'header_phone' => 'header',
            'header_email' => 'header',
            // Header settings - main links
            'header_about_visible' => 'header',
            'header_about_text' => 'header',
            'header_about_url' => 'header',
            'header_contact_visible' => 'header',
            'header_contact_text' => 'header',
            'header_contact_url' => 'header',
            'header_help_visible' => 'header',
            'header_help_text' => 'header',
            'header_help_url' => 'header',
            // Header settings - meeting request
            'header_meeting_visible' => 'header',
            'header_meeting_text' => 'header',
            'header_meeting_schedule_text' => 'header',
            'header_meeting_schedule_url' => 'header',
            'header_meeting_callback_text' => 'header',
            'header_meeting_callback_url' => 'header',
            'header_meeting_availability_text' => 'header',
            'header_meeting_availability_url' => 'header',
            // Header settings - feature toggles
            'header_wishlist_visible' => 'header',
            'header_cart_visible' => 'header',
            // Homepage settings
            'hero_title' => 'homepage',
            'hero_subtitle' => 'homepage',
            'new_arrivals_title' => 'homepage',
            'new_arrivals_subtitle' => 'homepage',
            'featured_title' => 'homepage',
            'featured_subtitle' => 'homepage',
            'collection_title' => 'homepage',
            'collection_subtitle' => 'homepage',
            // Store settings
            'currency' => 'store',
            'currency_symbol' => 'store',
            'tax_rate' => 'store',
            'free_shipping_threshold' => 'store',
            'shipping_cost' => 'store',
            // Feature flags
            'show_newsletter' => 'features',
            'show_reviews' => 'features',
            'maintenance_mode' => 'features',
        ];

        // Handle file uploads
        $fileFields = ['site_logo', 'site_favicon'];
        foreach ($fileFields as $field) {
            if ($request->hasFile($field)) {
                $file = $request->file($field);
                $path = $file->store('settings', 'public');
                SiteSetting::set($field, $path, 'image', 'general');
            }
        }

        // Handle payment method logos (dynamic)
        $paymentFiles = collect($request->allFiles())
            ->filter(fn ($_, $key) => str_starts_with($key, 'footer_payment_methods_file_'));

        // Save JSON first to know indexes
        $paymentMethods = null;
        if ($request->has('footer_payment_methods')) {
            $decoded = json_decode($request->input('footer_payment_methods'), true);
            if (is_array($decoded)) {
                $paymentMethods = $decoded;
            }
        }

        if (is_array($paymentMethods)) {
            foreach ($paymentMethods as $index => &$method) {
                $fileKey = "footer_payment_methods_file_{$index}";
                if ($paymentFiles->has($fileKey)) {
                    $file = $paymentFiles->get($fileKey);
                    $path = $file->store('settings', 'public');
                    $method['logo'] = $path;
                }
            }
            SiteSetting::set('footer_payment_methods', $paymentMethods, 'json', 'footer');
        }

        foreach ($data as $key => $value) {
            // Skip file fields as they're handled above
            if (in_array($key, $fileFields)) {
                continue;
            }
            if ($key === 'footer_payment_methods') {
                continue; // already handled as JSON above
            }
            if (array_key_exists($key, $settingGroups)) {
                SiteSetting::set($key, $value ?? '', 'text', $settingGroups[$key]);
            }
        }

        return redirect()->back()->with('success', 'Settings updated successfully');
    }
}
