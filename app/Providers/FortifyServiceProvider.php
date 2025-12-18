<?php

namespace App\Providers;

use App\Models\SiteSetting;
use App\Models\User;
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Laravel\Fortify\Fortify;

class FortifyServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        $this->configureViews();
        $this->configureRateLimiting();
        $this->configureAuthentication();
    }

    /**
     * Configure Fortify views.
     */
    private function configureViews(): void
    {
        // Normal user login view with site layout
        Fortify::loginView(function (Request $request) {
            $categories = Category::where('is_active', true)->orderBy('name')->get();
            $settings = SiteSetting::getAllGrouped();

            return Inertia::render('auth/login', [
                'status' => $request->session()->get('status'),
                'canResetPassword' => true,
                'canRegister' => true,
                'categories' => $categories,
                'settings' => $settings,
            ]);
        });

        // Normal user registration view with site layout
        Fortify::registerView(function (Request $request) {
            $categories = Category::where('is_active', true)->orderBy('name')->get();
            $settings = SiteSetting::getAllGrouped();

            return Inertia::render('auth/register', [
                'categories' => $categories,
                'settings' => $settings,
            ]);
        });
    }

    /**
     * Configure custom authentication logic.
     * This prevents admin users from logging in via the regular /login page.
     */
    private function configureAuthentication(): void
    {
        Fortify::authenticateUsing(function (Request $request) {
            $user = User::where('email', $request->email)->first();

            // If no user found or password doesn't match, return null (let Fortify handle error)
            if (! $user || ! Hash::check($request->password, $user->password)) {
                return null;
            }

            // If user is an admin, don't allow login via regular /login page
            // Admin users must use /admin-login instead
            if ($user->isAdmin()) {
                return null;
            }

            return $user;
        });
    }

    /**
     * Configure rate limiting.
     */
    private function configureRateLimiting(): void
    {
        RateLimiter::for('login', function (Request $request) {
            $throttleKey = Str::transliterate(Str::lower($request->input(Fortify::username())).'|'.$request->ip());

            return Limit::perMinute(5)->by($throttleKey);
        });
    }
}
