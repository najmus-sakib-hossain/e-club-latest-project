<?php

use App\Http\Controllers\Admin\AboutPageController;
use App\Http\Controllers\Admin\CallbackRequestController;
use App\Http\Controllers\Admin\CategoryController;
use App\Http\Controllers\Admin\ContactMessageController;
use App\Http\Controllers\Admin\ContactPageController;
use App\Http\Controllers\Admin\CustomerController;
use App\Http\Controllers\Admin\CustomerReviewController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\FaqController;
use App\Http\Controllers\Admin\FeatureCardController;
use App\Http\Controllers\Admin\FeaturedProductController;
use App\Http\Controllers\Admin\FooterController;
use App\Http\Controllers\Admin\HeroSlideController;
use App\Http\Controllers\Admin\HomePageController;
use App\Http\Controllers\Admin\JoinPageController;
use App\Http\Controllers\Admin\MeetingController;
use App\Http\Controllers\Admin\OrderController;
use App\Http\Controllers\Admin\PageContentController;
use App\Http\Controllers\Admin\PageController;
use App\Http\Controllers\Admin\PopupModalSettingController;
use App\Http\Controllers\Admin\ProductController;
use App\Http\Controllers\Admin\SiteSettingController;
use App\Http\Controllers\Admin\StoreLocationController;
use App\Http\Controllers\Admin\TrustedCompanyController;
use App\Http\Controllers\Auth\AdminAuthController;
use App\Http\Controllers\ProfileController;
use App\Models\Category;
use App\Models\FaqCategory;
use App\Models\Page;
use App\Models\PageContent;
use App\Models\SiteSetting;
use App\Models\StoreLocation;
use App\Models\TeamMember;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Public Frontend Routes
Route::get('/', [\App\Http\Controllers\Public\HomeController::class, 'index'])->name('home');

// Join as Member Page
// Join as Member Page
Route::get('/join', [\App\Http\Controllers\Public\JoinController::class, 'create'])->name('join');
Route::post('/join', [\App\Http\Controllers\Public\JoinController::class, 'store'])->name('join.store');
Route::get('/join/success', [\App\Http\Controllers\Public\JoinController::class, 'success'])->name('join.success');

// Admin Authentication Routes (separate from normal user auth)
// No guest middleware - allow anyone to access admin login page
Route::get('/admin/login', [AdminAuthController::class, 'showLoginForm'])->name('admin.login');
Route::post('/admin/login', [AdminAuthController::class, 'login']);
Route::post('/admin-logout', [AdminAuthController::class, 'logout'])->name('admin.logout')->middleware('auth');

// Dashboard route (redirect after login)
Route::get('/dashboard', function () {
    // Redirect admins to admin dashboard, regular users to account page
    if (auth()->user()->isAdmin()) {
        return redirect('/admin');
    }

    return redirect('/account');
})->middleware(['auth'])->name('dashboard');

Route::get('/cart', function () {
    $settings = SiteSetting::getAllGrouped();
    $categories = Category::where('is_active', true)->orderBy('order')->get();

    return Inertia::render('cart', [
        'settings' => $settings,
        'categories' => $categories,
    ]);
})->name('cart');

Route::get('/checkout', function () {
    $settings = SiteSetting::getAllGrouped();
    $categories = Category::where('is_active', true)->orderBy('order')->get();

    return Inertia::render('checkout', [
        'settings' => $settings,
        'categories' => $categories,
    ]);
})->name('checkout');

Route::get('/order-confirmation/{orderNumber}', function ($orderNumber) {
    $order = \App\Models\Order::where('order_number', $orderNumber)->with('items.product')->firstOrFail();

    return Inertia::render('order-confirmation', [
        'order' => $order,
    ]);
})->name('order-confirmation');

// Products Routes
Route::get('/products', [\App\Http\Controllers\Public\ProductController::class, 'index'])->name('products.index');

Route::get('/products/{slug}', [\App\Http\Controllers\Public\ProductController::class, 'show'])->name('products.show');

// Static Pages
// Static Pages
Route::get('/contact', [\App\Http\Controllers\Public\ContactController::class, 'index'])->name('contact');
Route::post('/contact', [\App\Http\Controllers\Public\ContactController::class, 'store'])->name('contact.store');

Route::get('/help', function () {
    $categories = Category::where('is_active', true)->orderBy('name')->get();
    $settings = SiteSetting::getAllGrouped();
    $faqCategories = FaqCategory::getWithFaqs('help');
    $pageContent = PageContent::getPageContent('help');

    return Inertia::render('help', [
        'categories' => $categories,
        'settings' => $settings,
        'faqCategories' => $faqCategories,
        'pageContent' => $pageContent,
    ]);
})->name('help');

Route::get('/about', function () {
    $categories = Category::where('is_active', true)->orderBy('name')->get();
    $settings = SiteSetting::getAllGrouped();
    $teamMembers = TeamMember::getActiveMembers();
    $pageContent = PageContent::getPageContent('about');

    return Inertia::render('about', [
        'categories' => $categories,
        'settings' => $settings,
        'teamMembers' => $teamMembers,
        'pageContent' => $pageContent,
    ]);
})->name('about');

// Categories Page
Route::get('/categories', function () {
    $categories = Category::where('is_active', true)->orderBy('name')->get();
    $settings = SiteSetting::getAllGrouped();
    $allCategories = Category::where('is_active', true)->orderBy('sort_order')->orderBy('name')->get();

    return Inertia::render('categories', [
        'categories' => $categories,
        'settings' => $settings,
        'allCategories' => $allCategories,
    ]);
})->name('categories');

// Shipping Policy Page
Route::get('/shipping', function () {
    $categories = Category::where('is_active', true)->orderBy('name')->get();
    $settings = SiteSetting::getAllGrouped();
    $page = Page::findBySlug('shipping');
    $content = PageContent::getPageContent('shipping');

    return Inertia::render('shipping', [
        'categories' => $categories,
        'settings' => $settings,
        'page' => $page,
        'content' => $content,
    ]);
})->name('shipping');

// Returns & Exchanges Page
Route::get('/returns', function () {
    $categories = Category::where('is_active', true)->orderBy('name')->get();
    $settings = SiteSetting::getAllGrouped();
    $page = Page::findBySlug('returns');
    $content = PageContent::getPageContent('returns');

    return Inertia::render('returns', [
        'categories' => $categories,
        'settings' => $settings,
        'page' => $page,
        'content' => $content,
    ]);
})->name('returns');

// FAQs Page
Route::get('/faqs', function () {
    $categories = Category::where('is_active', true)->orderBy('name')->get();
    $settings = SiteSetting::getAllGrouped();
    $page = Page::findBySlug('faqs');
    $faqCategories = FaqCategory::getWithFaqs('faqs');
    $pageContent = PageContent::getPageContent('faqs');

    return Inertia::render('faqs', [
        'categories' => $categories,
        'settings' => $settings,
        'page' => $page,
        'faqCategories' => $faqCategories,
        'pageContent' => $pageContent,
    ]);
})->name('faqs');

// Privacy Policy Page
Route::get('/privacy', function () {
    $categories = Category::where('is_active', true)->orderBy('name')->get();
    $settings = SiteSetting::getAllGrouped();
    $page = Page::findBySlug('privacy');
    $content = PageContent::getPageContent('privacy');

    return Inertia::render('privacy', [
        'categories' => $categories,
        'settings' => $settings,
        'page' => $page,
        'content' => $content,
    ]);
})->name('privacy');

// Terms & Conditions Page
Route::get('/terms', function () {
    $categories = Category::where('is_active', true)->orderBy('name')->get();
    $settings = SiteSetting::getAllGrouped();
    $page = Page::findBySlug('terms');
    $content = PageContent::getPageContent('terms');

    return Inertia::render('terms', [
        'categories' => $categories,
        'settings' => $settings,
        'page' => $page,
        'content' => $content,
    ]);
})->name('terms');

// Warranty Information Page
Route::get('/warranty', function () {
    $categories = Category::where('is_active', true)->orderBy('name')->get();
    $settings = SiteSetting::getAllGrouped();
    $page = Page::findBySlug('warranty');
    $content = PageContent::getPageContent('warranty');

    return Inertia::render('warranty', [
        'categories' => $categories,
        'settings' => $settings,
        'page' => $page,
        'content' => $content,
    ]);
})->name('warranty');

// Care & Maintenance Page
Route::get('/care', function () {
    $categories = Category::where('is_active', true)->orderBy('name')->get();
    $settings = SiteSetting::getAllGrouped();
    $page = Page::findBySlug('care');
    $content = PageContent::getPageContent('care');

    return Inertia::render('care', [
        'categories' => $categories,
        'settings' => $settings,
        'page' => $page,
        'content' => $content,
    ]);
})->name('care');

// Store Locator Page
Route::get('/stores', function () {
    $categories = Category::where('is_active', true)->orderBy('name')->get();
    $settings = SiteSetting::getAllGrouped();
    $page = Page::findBySlug('stores');
    $storeLocations = StoreLocation::where('is_active', true)->orderBy('sort_order')->get();
    $pageContent = PageContent::getPageContent('stores');

    return Inertia::render('stores', [
        'categories' => $categories,
        'settings' => $settings,
        'page' => $page,
        'storeLocations' => $storeLocations,
        'pageContent' => $pageContent,
    ]);
})->name('stores');

Route::get('/account', function () {
    $categories = Category::where('is_active', true)->orderBy('name')->get();
    $settings = SiteSetting::getAllGrouped();

    return Inertia::render('account', [
        'categories' => $categories,
        'settings' => $settings,
    ]);
})->name('account');

// Account Routes (User's personal pages)
Route::prefix('account')->name('account.')->group(function () {
    // Profile (requires auth)
    Route::middleware(['auth'])->group(function () {
        Route::get('/profile', [ProfileController::class, 'index'])->name('profile');
        Route::put('/profile', [ProfileController::class, 'update'])->name('profile.update');
        Route::put('/profile/password', [ProfileController::class, 'updatePassword'])->name('profile.password');
    });

    // Orders
    Route::get('/orders', function () {
        $categories = Category::where('is_active', true)->orderBy('name')->get();
        $settings = SiteSetting::getAllGrouped();

        // Get orders for logged-in user or by email for guest orders
        $orders = [];
        if (auth()->check()) {
            $orders = \App\Models\Order::where('customer_email', auth()->user()->email)
                ->with('items.product')
                ->orderBy('created_at', 'desc')
                ->get();
        }

        return Inertia::render('account/orders/index', [
            'categories' => $categories,
            'settings' => $settings,
            'orders' => $orders,
        ]);
    })->name('orders.index');

    Route::get('/orders/{order}', function (\App\Models\Order $order) {
        $categories = Category::where('is_active', true)->orderBy('name')->get();
        $settings = SiteSetting::getAllGrouped();

        // Check if user owns this order
        if (auth()->check() && auth()->user()->email !== $order->customer_email) {
            abort(403);
        }

        $order->load('items.product');

        return Inertia::render('account/orders/show', [
            'categories' => $categories,
            'settings' => $settings,
            'order' => $order,
        ]);
    })->name('orders.show');

    // Wishlist
    Route::get('/wishlist', function () {
        $categories = Category::where('is_active', true)->orderBy('name')->get();
        $settings = SiteSetting::getAllGrouped();

        return Inertia::render('account/wishlist', [
            'categories' => $categories,
            'settings' => $settings,
        ]);
    })->name('wishlist');

    // Addresses
    Route::get('/addresses', function () {
        $categories = Category::where('is_active', true)->orderBy('name')->get();
        $settings = SiteSetting::getAllGrouped();

        return Inertia::render('account/addresses', [
            'categories' => $categories,
            'settings' => $settings,
        ]);
    })->name('addresses');
});

// Meeting Routes
Route::prefix('meeting')->name('meeting.')->group(function () {
    Route::get('/schedule', function () {
        $categories = Category::where('is_active', true)->orderBy('name')->get();
        $settings = SiteSetting::getAllGrouped();
        $meetingSlots = \App\Models\MeetingSlot::active()->orderBy('day_of_week')->orderBy('start_time')->get();

        return Inertia::render('meeting/schedule', [
            'categories' => $categories,
            'settings' => $settings,
            'meetingSlots' => $meetingSlots,
        ]);
    })->name('schedule');

    Route::post('/schedule', function () {
        $validated = request()->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email',
            'phone' => 'required|string|max:20',
            'meeting_type' => 'required|in:showroom,video',
            'purpose' => 'required|string',
            'notes' => 'nullable|string|max:1000',
            'date' => 'required|date',
            'time' => 'required|string',
        ]);

        // Store the meeting
        \App\Models\Meeting::create($validated);

        return back()->with('success', 'Meeting scheduled successfully! We will send you a confirmation email shortly.');
    })->name('schedule.store');

    Route::get('/callback', function () {
        $categories = Category::where('is_active', true)->orderBy('name')->get();
        $settings = SiteSetting::getAllGrouped();

        return Inertia::render('meeting/callback', [
            'categories' => $categories,
            'settings' => $settings,
        ]);
    })->name('callback');

    Route::post('/callback', function () {
        $validated = request()->validate([
            'name' => 'required|string|max:255',
            'phone' => 'required|string|max:20',
            'preferred_time' => 'required|string',
            'reason' => 'required|string',
            'notes' => 'nullable|string|max:1000',
        ]);

        // Store the callback request
        \App\Models\CallbackRequest::create($validated);

        return back()->with('success', 'Callback request submitted! Our team will call you soon.');
    })->name('callback.store');

    Route::get('/availability', function () {
        $categories = Category::where('is_active', true)->orderBy('name')->get();
        $settings = SiteSetting::getAllGrouped();
        $schedule = \App\Models\MeetingSlot::getWeeklySchedule();

        return Inertia::render('meeting/availability', [
            'categories' => $categories,
            'settings' => $settings,
            'schedule' => $schedule,
        ]);
    })->name('availability');
});

// Admin Dashboard Routes (protected by auth and admin middleware)
Route::middleware(['auth', 'admin'])->prefix('admin')->name('admin.')->group(function () {
    // Dashboard - now using the new shadcn admin page with real data
    Route::get('/', [DashboardController::class, 'index'])->name('dashboard');

    // Hero Slides Management
    Route::resource('hero-slides', HeroSlideController::class);

    // Categories Management
    Route::resource('categories', CategoryController::class);

    // Products Management
    Route::resource('products', ProductController::class);

    // Feature Cards Management
    Route::resource('features', FeatureCardController::class);

    // Featured Products Management
    Route::resource('featured-products', FeaturedProductController::class);

    // Trusted Companies Management
    Route::resource('trusted-companies', TrustedCompanyController::class);

    // Customer Reviews Management
    Route::resource('customer-reviews', CustomerReviewController::class);

    // Site Settings
    Route::get('/settings', [SiteSettingController::class, 'index'])->name('settings.index');
    Route::get('/settings/header', [SiteSettingController::class, 'header'])->name('settings.header');
    Route::get('/settings/footer', [SiteSettingController::class, 'footer'])->name('settings.footer');
    Route::get('/settings/navigation', [\App\Http\Controllers\Admin\NavigationMenuController::class, 'index'])->name('settings.navigation');
    Route::post('/settings', [SiteSettingController::class, 'update'])->name('settings.update');

    // Popup Modal Settings
    Route::get('/settings/popup-modal', [\App\Http\Controllers\Admin\PopupModalSettingController::class, 'index'])->name('settings.popup-modal');
    Route::post('/settings/popup-modal', [\App\Http\Controllers\Admin\PopupModalSettingController::class, 'update'])->name('settings.popup-modal.update');
    Route::post('/settings/popup-modal/upload', [\App\Http\Controllers\Admin\PopupModalSettingController::class, 'uploadImage'])->name('settings.popup-modal.upload');

    // Navigation Menu Management
    Route::prefix('navigation')->name('navigation.')->group(function () {
        Route::post('/', [\App\Http\Controllers\Admin\NavigationMenuController::class, 'store'])->name('store');
        Route::put('/{navigationMenu}', [\App\Http\Controllers\Admin\NavigationMenuController::class, 'update'])->name('update');
        Route::delete('/{navigationMenu}', [\App\Http\Controllers\Admin\NavigationMenuController::class, 'destroy'])->name('destroy');
        Route::post('/order', [\App\Http\Controllers\Admin\NavigationMenuController::class, 'updateOrder'])->name('order');
        Route::post('/bulk', [\App\Http\Controllers\Admin\NavigationMenuController::class, 'bulkStore'])->name('bulk');
        Route::post('/{navigationMenu}/toggle', [\App\Http\Controllers\Admin\NavigationMenuController::class, 'toggleActive'])->name('toggle');
    });

    // Pages Management (Content Pages)
    Route::resource('pages', PageController::class)->except(['create', 'show', 'edit']);

    // Content Page Management (About, Contact, etc.)
    Route::prefix('content-pages')->name('content-pages.')->group(function () {
        // About Page
        Route::get('/about', [AboutPageController::class, 'index'])->name('about.index');
        Route::post('/about', [AboutPageController::class, 'update'])->name('about.update');
        Route::post('/about/team', [AboutPageController::class, 'storeTeamMember'])->name('about.team.store');
        Route::put('/about/team/{teamMember}', [AboutPageController::class, 'updateTeamMember'])->name('about.team.update');
        Route::delete('/about/team/{teamMember}', [AboutPageController::class, 'destroyTeamMember'])->name('about.team.destroy');

        // Contact Page
        Route::get('/contact', [ContactPageController::class, 'index'])->name('contact.index');
        Route::post('/contact', [ContactPageController::class, 'update'])->name('contact.update');

        // Store Locations
        Route::resource('stores', StoreLocationController::class);
        Route::post('/stores/content', [StoreLocationController::class, 'updateContent'])->name('stores.content');

        // FAQs
        Route::get('/faqs', [FaqController::class, 'index'])->name('faqs.index');
        Route::post('/faqs/categories', [FaqController::class, 'storeCategory'])->name('faqs.categories.store');
        Route::put('/faqs/categories/{faqCategory}', [FaqController::class, 'updateCategory'])->name('faqs.categories.update');
        Route::delete('/faqs/categories/{faqCategory}', [FaqController::class, 'destroyCategory'])->name('faqs.categories.destroy');
        Route::post('/faqs', [FaqController::class, 'store'])->name('faqs.store');
        Route::put('/faqs/{faq}', [FaqController::class, 'update'])->name('faqs.update');
        Route::delete('/faqs/{faq}', [FaqController::class, 'destroy'])->name('faqs.destroy');

        // Generic Page Content (Shipping, Returns, Warranty, Care, Privacy, Terms, Help)
        Route::get('/{pageSlug}', [PageContentController::class, 'edit'])->name('generic.edit');
        Route::post('/{pageSlug}', [PageContentController::class, 'update'])->name('generic.update');
    });

    // Orders Management
    Route::resource('orders', OrderController::class)->only(['index', 'show', 'update', 'destroy']);
    Route::put('/orders/{order}/status', [OrderController::class, 'updateStatus'])->name('orders.status');
    Route::put('/orders/{order}/payment-status', [OrderController::class, 'updatePaymentStatus'])->name('orders.payment-status');

    // Customers Management
    Route::resource('customers', CustomerController::class)->only(['index', 'show', 'destroy']);

    // Meetings Management
    Route::prefix('meetings')->name('meetings.')->group(function () {
        Route::get('/', [MeetingController::class, 'index'])->name('index');
        Route::get('/calendar-events', [MeetingController::class, 'calendarEvents'])->name('calendar-events');
        Route::get('/settings', [MeetingController::class, 'settings'])->name('settings');
        Route::post('/slots', [MeetingController::class, 'storeSlot'])->name('slots.store');
        Route::put('/slots/{slot}', [MeetingController::class, 'updateSlot'])->name('slots.update');
        Route::delete('/slots/{slot}', [MeetingController::class, 'destroySlot'])->name('slots.destroy');
        Route::get('/{meeting}', [MeetingController::class, 'show'])->name('show');
        Route::put('/{meeting}', [MeetingController::class, 'update'])->name('update');
        Route::delete('/{meeting}', [MeetingController::class, 'destroy'])->name('destroy');
    });

    // Callback Requests Management
    Route::prefix('callbacks')->name('callbacks.')->group(function () {
        Route::get('/', [CallbackRequestController::class, 'index'])->name('index');
        Route::get('/{callback}', [CallbackRequestController::class, 'show'])->name('show');
        Route::put('/{callback}', [CallbackRequestController::class, 'update'])->name('update');
        Route::delete('/{callback}', [CallbackRequestController::class, 'destroy'])->name('destroy');
    });

    // Contact Messages Management
    Route::prefix('contact-messages')->name('contact-messages.')->group(function () {
        Route::get('/', [ContactMessageController::class, 'index'])->name('index');
        Route::get('/{message}', [ContactMessageController::class, 'show'])->name('show');
        Route::put('/{message}', [ContactMessageController::class, 'update'])->name('update');
        Route::post('/{message}/reply', [ContactMessageController::class, 'reply'])->name('reply');
        Route::post('/{message}/resolve', [ContactMessageController::class, 'resolve'])->name('resolve');
        Route::delete('/{message}', [ContactMessageController::class, 'destroy'])->name('destroy');
    });

    // Footer Management
    Route::prefix('footer')->name('footer.')->group(function () {
        Route::get('/', [FooterController::class, 'index'])->name('index');
        Route::put('/sections/{section}', [FooterController::class, 'updateSection'])->name('sections.update');
        Route::post('/addresses', [FooterController::class, 'storeAddress'])->name('addresses.store');
        Route::put('/addresses/{address}', [FooterController::class, 'updateAddress'])->name('addresses.update');
        Route::delete('/addresses/{address}', [FooterController::class, 'deleteAddress'])->name('addresses.destroy');
        Route::post('/links', [FooterController::class, 'storeLink'])->name('links.store');
        Route::put('/links/{link}', [FooterController::class, 'updateLink'])->name('links.update');
        Route::delete('/links/{link}', [FooterController::class, 'deleteLink'])->name('links.destroy');
        Route::post('/social', [FooterController::class, 'storeSocial'])->name('social.store');
        Route::put('/social/{social}', [FooterController::class, 'updateSocial'])->name('social.update');
        Route::delete('/social/{social}', [FooterController::class, 'deleteSocial'])->name('social.destroy');
    });

    // Home Page Management
    Route::prefix('homepage')->name('homepage.')->group(function () {
        Route::get('/', [HomePageController::class, 'index'])->name('index');
        Route::put('/sections/{section}', [HomePageController::class, 'updateSection'])->name('sections.update');
        Route::post('/stats', [HomePageController::class, 'storeStat'])->name('stats.store');
        Route::put('/stats/{stat}', [HomePageController::class, 'updateStat'])->name('stats.update');
        Route::delete('/stats/{stat}', [HomePageController::class, 'deleteStat'])->name('stats.destroy');
        Route::post('/activities', [HomePageController::class, 'storeActivity'])->name('activities.store');
        Route::put('/activities/{activity}', [HomePageController::class, 'updateActivity'])->name('activities.update');
        Route::delete('/activities/{activity}', [HomePageController::class, 'deleteActivity'])->name('activities.destroy');
        Route::post('/projects', [HomePageController::class, 'storeProject'])->name('projects.store');
        Route::put('/projects/{project}', [HomePageController::class, 'updateProject'])->name('projects.update');
        Route::delete('/projects/{project}', [HomePageController::class, 'deleteProject'])->name('projects.destroy');
        Route::post('/partners', [HomePageController::class, 'storePartner'])->name('partners.store');
        Route::put('/partners/{partner}', [HomePageController::class, 'updatePartner'])->name('partners.update');
        Route::delete('/partners/{partner}', [HomePageController::class, 'deletePartner'])->name('partners.destroy');
        Route::post('/core-values', [HomePageController::class, 'storeCoreValue'])->name('core-values.store');
        Route::put('/core-values/{coreValue}', [HomePageController::class, 'updateCoreValue'])->name('core-values.update');
        Route::delete('/core-values/{coreValue}', [HomePageController::class, 'deleteCoreValue'])->name('core-values.destroy');
    });

    // Join Page Management
    Route::prefix('joinpage')->name('joinpage.')->group(function () {
        Route::get('/', [JoinPageController::class, 'index'])->name('index');
        Route::post('/settings', [JoinPageController::class, 'updateSettings'])->name('settings.update');
        Route::post('/memberships', [JoinPageController::class, 'storeMembership'])->name('memberships.store');
        Route::put('/memberships/{membership}', [JoinPageController::class, 'updateMembership'])->name('memberships.update');
        Route::delete('/memberships/{membership}', [JoinPageController::class, 'deleteMembership'])->name('memberships.destroy');
    });

    // Admin Profile Pages
    Route::get('/profile/account', function () {
        return Inertia::render('admin/profile/account');
    })->name('profile.account');

    Route::get('/profile/billing', function () {
        return Inertia::render('admin/profile/billing');
    })->name('profile.billing');

    Route::get('/profile/notifications', function () {
        return Inertia::render('admin/profile/notifications');
    })->name('profile.notifications');

    // Profile updates (optional - can be implemented later)
    Route::patch('/profile', function () {
        // Update profile logic here
        return back()->with('success', 'Profile updated successfully');
    })->name('profile.update');

    Route::put('/profile/password', function () {
        // Update password logic here
        return back()->with('success', 'Password updated successfully');
    })->name('profile.password');

    Route::post('/profile/notifications', function () {
        // Update notification preferences logic here
        return back()->with('success', 'Notification preferences updated');
    })->name('profile.notifications.update');
});

require __DIR__.'/settings.php';
