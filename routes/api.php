<?php

use App\Http\Controllers\Admin\CustomerController;
use App\Http\Controllers\Admin\CustomerReviewController;
use App\Http\Controllers\Admin\FeatureCardController;
use App\Http\Controllers\Admin\HeroSlideController;
use App\Http\Controllers\Admin\OrderController;
use App\Http\Controllers\Admin\ProductController;
use App\Http\Controllers\Admin\SiteSettingController;
use App\Http\Controllers\Admin\TrustedCompanyController;
use App\Http\Controllers\Api\HomeContentController;
use App\Http\Controllers\Api\SearchController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// Public API routes for frontend content
Route::get('/home-content', [HomeContentController::class, 'index']);
Route::get('/hero-slides', [HomeContentController::class, 'heroSlides']);
Route::get('/feature-cards', [HomeContentController::class, 'featureCards']);
Route::get('/categories/{type?}', [HomeContentController::class, 'categories']);
Route::get('/new-arrivals', [HomeContentController::class, 'newArrivals']);
Route::get('/featured-products', [HomeContentController::class, 'featuredProducts']);
Route::get('/featured-product', [HomeContentController::class, 'featuredProduct']);
Route::get('/trusted-companies', [HomeContentController::class, 'trustedCompanies']);
Route::get('/best-sellers', [HomeContentController::class, 'bestSellers']);
Route::get('/customer-reviews', [HomeContentController::class, 'customerReviews']);
// Site Settings
Route::get('/site-settings', [HomeContentController::class, 'siteSettings']);

// Navigation Menu (public)
Route::get('/navigation', [\App\Http\Controllers\Admin\NavigationMenuController::class, 'list']);

// Search endpoint
Route::get('/search', [SearchController::class, 'search'])->name('api.search');

// Guest checkout order creation
Route::post('/orders', [OrderController::class, 'store'])->name('api.orders.store');

// Admin API routes (protected by auth middleware)
Route::middleware(['auth'])->prefix('admin')->name('api.admin.')->group(function () {
    // Hero Slides
    Route::get('/hero-slides', [HeroSlideController::class, 'list'])->name('hero-slides.list');
    Route::post('/hero-slides', [HeroSlideController::class, 'store'])->name('hero-slides.store');
    Route::put('/hero-slides/{heroSlide}', [HeroSlideController::class, 'update'])->name('hero-slides.update');
    Route::delete('/hero-slides/{heroSlide}', [HeroSlideController::class, 'destroy'])->name('hero-slides.destroy');
    Route::post('/hero-slides/order', [HeroSlideController::class, 'updateOrder'])->name('hero-slides.order');

    // Products
    Route::get('/products', [ProductController::class, 'list'])->name('products.list');
    Route::post('/products', [ProductController::class, 'store'])->name('products.store');
    Route::put('/products/{product}', [ProductController::class, 'update'])->name('products.update');
    Route::delete('/products/{product}', [ProductController::class, 'destroy'])->name('products.destroy');

    // Feature Cards
    Route::get('/feature-cards', [FeatureCardController::class, 'list'])->name('feature-cards.list');
    Route::post('/feature-cards', [FeatureCardController::class, 'store'])->name('feature-cards.store');
    Route::put('/feature-cards/{featureCard}', [FeatureCardController::class, 'update'])->name('feature-cards.update');
    Route::delete('/feature-cards/{featureCard}', [FeatureCardController::class, 'destroy'])->name('feature-cards.destroy');
    Route::post('/feature-cards/order', [FeatureCardController::class, 'updateOrder'])->name('feature-cards.order');

    // Trusted Companies
    Route::get('/trusted-companies', [TrustedCompanyController::class, 'list'])->name('trusted-companies.list');
    Route::post('/trusted-companies', [TrustedCompanyController::class, 'store'])->name('trusted-companies.store');
    Route::put('/trusted-companies/{trustedCompany}', [TrustedCompanyController::class, 'update'])->name('trusted-companies.update');
    Route::delete('/trusted-companies/{trustedCompany}', [TrustedCompanyController::class, 'destroy'])->name('trusted-companies.destroy');
    Route::post('/trusted-companies/order', [TrustedCompanyController::class, 'updateOrder'])->name('trusted-companies.order');

    // Site Settings
    Route::get('/settings', [SiteSettingController::class, 'list'])->name('settings.list');
    Route::post('/settings', [SiteSettingController::class, 'update'])->name('settings.update');
    Route::post('/settings/batch', [SiteSettingController::class, 'updateBatch'])->name('settings.batch');

    // Orders
    Route::get('/orders', [OrderController::class, 'list'])->name('orders.list');
    Route::put('/orders/{order}', [OrderController::class, 'apiUpdate'])->name('orders.update');
    Route::put('/orders/{order}/status', [OrderController::class, 'updateStatus'])->name('orders.status');
    Route::put('/orders/{order}/payment-status', [OrderController::class, 'updatePaymentStatus'])->name('orders.payment-status');

    // Customers
    Route::get('/customers', [CustomerController::class, 'list'])->name('customers.list');
    Route::delete('/customers/{customer}', [CustomerController::class, 'destroy'])->name('customers.destroy');

    // Customer Reviews
    Route::get('/customer-reviews', [CustomerReviewController::class, 'list'])->name('customer-reviews.list');
    Route::post('/customer-reviews', [CustomerReviewController::class, 'store'])->name('customer-reviews.store');
    Route::put('/customer-reviews/{customerReview}', [CustomerReviewController::class, 'update'])->name('customer-reviews.update');
    Route::delete('/customer-reviews/{customerReview}', [CustomerReviewController::class, 'destroy'])->name('customer-reviews.destroy');
    Route::post('/customer-reviews/order', [CustomerReviewController::class, 'updateOrder'])->name('customer-reviews.order');
});
