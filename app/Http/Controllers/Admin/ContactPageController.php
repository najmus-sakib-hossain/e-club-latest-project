<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\PageContent;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ContactPageController extends Controller
{
    /**
     * Display the Contact page settings
     */
    public function index(): Response
    {
        $content = PageContent::where('page_slug', 'contact')->get()->keyBy('section_key');

        return Inertia::render('admin/content-pages/contact', [
            'content' => $content,
        ]);
    }

    /**
     * Update Contact page content
     */
    public function update(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'page_title' => 'nullable|string|max:255',
            'page_subtitle' => 'nullable|string',
            'form_title' => 'nullable|string|max:255',
            'form_subtitle' => 'nullable|string',
            'hours_weekday' => 'nullable|string|max:255',
            'hours_weekend' => 'nullable|string|max:255',
            'map_embed' => 'nullable|string', // Google Maps embed URL
            'contact_cards' => 'nullable|array',
            'contact_cards.*.icon' => 'nullable|string',
            'contact_cards.*.title' => 'nullable|string|max:255',
            'contact_cards.*.details' => 'nullable|array',
            // CTA block
            'cta_title' => 'nullable|string|max:255',
            'cta_subtitle' => 'nullable|string',
            'cta_call_label' => 'nullable|string|max:255',
            'cta_email_label' => 'nullable|string|max:255',
            'cta_phone' => 'nullable|string|max:255',
            'cta_email' => 'nullable|string|max:255',
        ]);

        // Handle hero section
        PageContent::setSection('contact', 'hero', [
            'title' => $validated['page_title'] ?? null,
            'subtitle' => $validated['page_subtitle'] ?? null,
        ]);

        // Handle form section
        PageContent::setSection('contact', 'form', [
            'title' => $validated['form_title'] ?? null,
            'subtitle' => $validated['form_subtitle'] ?? null,
        ]);

        // Handle hours section
        PageContent::setSection('contact', 'hours', [
            'content' => json_encode([
                'weekday' => $validated['hours_weekday'] ?? null,
                'weekend' => $validated['hours_weekend'] ?? null,
            ]),
        ]);

        // Handle map section
        if (isset($validated['map_embed'])) {
            PageContent::setSection('contact', 'map', [
                'content' => $validated['map_embed'],
            ]);
        }

        // Handle contact cards
        if (isset($validated['contact_cards'])) {
            PageContent::setSection('contact', 'cards', [
                'items' => $validated['contact_cards'],
            ]);
        }

        // Handle CTA block
        PageContent::setSection('contact', 'cta', [
            'title' => $validated['cta_title'] ?? null,
            'subtitle' => $validated['cta_subtitle'] ?? null,
            'content' => json_encode([
                'call_label' => $validated['cta_call_label'] ?? null,
                'email_label' => $validated['cta_email_label'] ?? null,
                'phone' => $validated['cta_phone'] ?? null,
                'email' => $validated['cta_email'] ?? null,
            ]),
        ]);

        return redirect()->back()->with('success', 'Contact page content updated successfully');
    }
}
