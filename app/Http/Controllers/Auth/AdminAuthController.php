<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

class AdminAuthController extends Controller
{
    /**
     * Show the admin login form.
     */
    public function showLoginForm(Request $request)
    {
        // If user is already logged in as admin, redirect to admin dashboard
        if (Auth::check() && Auth::user()->isAdmin()) {
            return redirect('/admin');
        }

        // If user is logged in but not admin, log them out first so they can login as admin
        if (Auth::check() && ! Auth::user()->isAdmin()) {
            Auth::logout();
            $request->session()->invalidate();
            $request->session()->regenerateToken();
        }

        return Inertia::render('auth/admin-login', [
            'status' => $request->session()->get('status'),
        ]);
    }

    /**
     * Handle admin login request.
     */
    public function login(Request $request)
    {
        $request->validate([
            'email' => ['required', 'string', 'email'],
            'password' => ['required', 'string'],
        ]);

        $user = User::where('email', $request->email)->first();

        // Check if user exists and password is correct
        if (! $user || ! Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['The provided credentials are incorrect.'],
            ]);
        }

        // Check if user is an admin
        if (! $user->isAdmin()) {
            throw ValidationException::withMessages([
                'email' => ['This account does not have admin access.'],
            ]);
        }

        // Log the user in
        Auth::login($user, $request->boolean('remember'));

        $request->session()->regenerate();

        return redirect()->intended('/admin');
    }

    /**
     * Handle admin logout request.
     */
    public function logout(Request $request)
    {
        Auth::logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect()->route('admin.login');
    }
}
