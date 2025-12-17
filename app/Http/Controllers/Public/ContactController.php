<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\ContactMessage;
use App\Models\PageContent;
use App\Models\SiteSetting;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ContactController extends Controller
{
    /**
     * Show the contact page.
     */
    public function index()
    {
        $categories = Category::where('is_active', true)->orderBy('name')->get();
        $settings = SiteSetting::getAllGrouped();
        $pageContent = PageContent::getPageContent('contact');

        return Inertia::render('contact', [
            'categories' => $categories,
            'settings' => $settings,
            'pageContent' => $pageContent,
        ]);
    }

    /**
     * Store request from contact form.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email',
            'phone' => 'nullable|string|max:20',
            'subject' => 'required|string|max:100',
            'message' => 'required|string|max:1000',
        ]);

        ContactMessage::create([
            ...$validated,
            'status' => ContactMessage::STATUS_PENDING,
        ]);

        return back()->with('success', 'Thank you for your message. We will get back to you soon!');
    }
}
