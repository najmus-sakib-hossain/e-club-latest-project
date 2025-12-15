<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\FooterSection;
use App\Models\FooterAddress;
use App\Models\FooterLink;
use App\Models\SocialLink;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class FooterController extends Controller
{
    /**
     * Display footer management page
     */
    public function index(): Response
    {
        return Inertia::render('admin/footer/index', [
            'sections' => FooterSection::ordered()->get(),
            'addresses' => FooterAddress::ordered()->get(),
            'links' => FooterLink::ordered()->get(),
            'socialLinks' => SocialLink::ordered()->get(),
        ]);
    }

    /**
     * Update footer section
     */
    public function updateSection(Request $request, FooterSection $section): RedirectResponse
    {
        $validated = $request->validate([
            'title' => 'nullable|string|max:255',
            'content' => 'nullable|string',
            'data' => 'nullable|array',
            'is_active' => 'boolean',
            'sort_order' => 'integer',
        ]);

        $section->update($validated);

        return redirect()->back()->with('success', 'Footer section updated successfully');
    }

    /**
     * Store footer address
     */
    public function storeAddress(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'type' => 'required|in:bangladesh,international',
            'title' => 'required|string|max:255',
            'address' => 'required|string',
            'phone' => 'nullable|string|max:50',
            'email' => 'nullable|email|max:255',
            'country' => 'nullable|string|max:100',
            'is_active' => 'boolean',
            'sort_order' => 'integer',
        ]);

        FooterAddress::create($validated);

        return redirect()->back()->with('success', 'Address added successfully');
    }

    /**
     * Update footer address
     */
    public function updateAddress(Request $request, FooterAddress $address): RedirectResponse
    {
        $validated = $request->validate([
            'type' => 'required|in:bangladesh,international',
            'title' => 'required|string|max:255',
            'address' => 'required|string',
            'phone' => 'nullable|string|max:50',
            'email' => 'nullable|email|max:255',
            'country' => 'nullable|string|max:100',
            'is_active' => 'boolean',
            'sort_order' => 'integer',
        ]);

        $address->update($validated);

        return redirect()->back()->with('success', 'Address updated successfully');
    }

    /**
     * Delete footer address
     */
    public function deleteAddress(FooterAddress $address): RedirectResponse
    {
        $address->delete();

        return redirect()->back()->with('success', 'Address deleted successfully');
    }

    /**
     * Store footer link
     */
    public function storeLink(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'category' => 'required|string|max:100',
            'title' => 'required|string|max:255',
            'url' => 'required|string|max:255',
            'is_active' => 'boolean',
            'sort_order' => 'integer',
        ]);

        FooterLink::create($validated);

        return redirect()->back()->with('success', 'Link added successfully');
    }

    /**
     * Update footer link
     */
    public function updateLink(Request $request, FooterLink $link): RedirectResponse
    {
        $validated = $request->validate([
            'category' => 'required|string|max:100',
            'title' => 'required|string|max:255',
            'url' => 'required|string|max:255',
            'is_active' => 'boolean',
            'sort_order' => 'integer',
        ]);

        $link->update($validated);

        return redirect()->back()->with('success', 'Link updated successfully');
    }

    /**
     * Delete footer link
     */
    public function deleteLink(FooterLink $link): RedirectResponse
    {
        $link->delete();

        return redirect()->back()->with('success', 'Link deleted successfully');
    }

    /**
     * Store social link
     */
    public function storeSocial(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'platform' => 'required|string|max:100',
            'url' => 'required|url|max:255',
            'icon' => 'nullable|string|max:100',
            'is_active' => 'boolean',
            'sort_order' => 'integer',
        ]);

        SocialLink::create($validated);

        return redirect()->back()->with('success', 'Social link added successfully');
    }

    /**
     * Update social link
     */
    public function updateSocial(Request $request, SocialLink $social): RedirectResponse
    {
        $validated = $request->validate([
            'platform' => 'required|string|max:100',
            'url' => 'required|url|max:255',
            'icon' => 'nullable|string|max:100',
            'is_active' => 'boolean',
            'sort_order' => 'integer',
        ]);

        $social->update($validated);

        return redirect()->back()->with('success', 'Social link updated successfully');
    }

    /**
     * Delete social link
     */
    public function deleteSocial(SocialLink $social): RedirectResponse
    {
        $social->delete();

        return redirect()->back()->with('success', 'Social link deleted successfully');
    }
}
