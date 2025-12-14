<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\PageContent;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class PageContentController extends Controller
{
    /**
     * Display the generic page content editor
     */
    public function edit(string $pageSlug): Response
    {
        $content = PageContent::where('page_slug', $pageSlug)->get()->keyBy('section_key');

        if ($pageSlug === 'help') {
            return Inertia::render('admin/content-pages/help', [
                'content' => $content,
            ]);
        }

        $pageConfig = $this->getPageConfig($pageSlug);

        return Inertia::render('admin/content-pages/generic', [
            'pageSlug' => $pageSlug,
            'pageConfig' => $pageConfig,
            'content' => $content,
        ]);
    }

    /**
     * Update generic page content
     */
    public function update(Request $request, string $pageSlug): RedirectResponse
    {
        $sections = $request->input('sections', []);
        
        foreach ($sections as $sectionKey => $sectionData) {
            $data = [
                'title' => $sectionData['title'] ?? null,
                'subtitle' => $sectionData['subtitle'] ?? null,
                'content' => $sectionData['content'] ?? null,
                'is_active' => $sectionData['is_active'] ?? true,
                'sort_order' => $sectionData['sort_order'] ?? 0,
            ];

            // Handle items array (for lists, features, etc.)
            if (isset($sectionData['items'])) {
                $data['items'] = $sectionData['items'];
            }

            // Handle image upload
            if ($request->hasFile("sections.{$sectionKey}.image")) {
                $file = $request->file("sections.{$sectionKey}.image");
                $path = $file->store("pages/{$pageSlug}", 'public');
                $data['image'] = $path;
            }

            PageContent::setSection($pageSlug, $sectionKey, $data);
        }

        return redirect()->back()->with('success', ucfirst($pageSlug) . ' page content updated successfully');
    }

    /**
     * Get page configuration for the editor
     */
    private function getPageConfig(string $pageSlug): array
    {
        $configs = [
            'help' => [
                'title' => 'Help Center',
                'description' => 'Manage help center content and support information',
                'sections' => [
                    'hero' => [
                        'label' => 'Hero Section',
                        'fields' => ['title', 'subtitle'],
                    ],
                    'search' => [
                        'label' => 'Search Section',
                        'fields' => ['title', 'subtitle'],
                    ],
                    'quick_links' => [
                        'label' => 'Quick Links Cards',
                        'fields' => ['items'],
                        'itemFields' => ['icon', 'title', 'description', 'button_text'],
                    ],
                    'faq_section' => [
                        'label' => 'FAQ Section',
                        'fields' => ['title', 'subtitle'],
                    ],
                    'cta' => [
                        'label' => 'CTA Section (Still Need Help?)',
                        'fields' => ['title', 'subtitle', 'content'],
                    ],
                ],
            ],
            'faqs' => [
                'title' => 'FAQs Page',
                'description' => 'Manage FAQs page header and CTA sections',
                'sections' => [
                    'hero' => [
                        'label' => 'Hero Section',
                        'fields' => ['title', 'subtitle'],
                    ],
                    'cta' => [
                        'label' => 'CTA Section (Still Have Questions?)',
                        'fields' => ['title', 'subtitle', 'content'],
                    ],
                ],
            ],
            'stores' => [
                'title' => 'Store Locations Page',
                'description' => 'Manage store locations page header, services, and CTA sections',
                'sections' => [
                    'hero' => [
                        'label' => 'Hero Section',
                        'fields' => ['title', 'subtitle'],
                    ],
                    'locations_section' => [
                        'label' => 'Locations Section',
                        'fields' => ['title'],
                    ],
                    'store_services' => [
                        'label' => 'Store Services',
                        'fields' => ['title', 'items'],
                        'itemFields' => ['icon', 'title', 'description'],
                    ],
                    'cta' => [
                        'label' => 'CTA Section (Need Help Finding?)',
                        'fields' => ['title', 'subtitle', 'content'],
                    ],
                ],
            ],
            'about' => [
                'title' => 'About Page',
                'description' => 'Manage additional about page sections',
                'sections' => [
                    'features' => [
                        'label' => 'Feature Cards (Own Manufacturing, etc.)',
                        'fields' => ['items'],
                        'itemFields' => ['icon', 'title', 'description'],
                    ],
                    'cta' => [
                        'label' => 'CTA Section',
                        'fields' => ['title', 'subtitle', 'content'],
                    ],
                ],
            ],
            'shipping' => [
                'title' => 'Shipping Policy',
                'description' => 'Manage shipping policy content',
                'sections' => [
                    'hero' => [
                        'label' => 'Hero Section',
                        'fields' => ['title', 'subtitle'],
                    ],
                    'shipping_methods' => [
                        'label' => 'Shipping Methods',
                        'fields' => ['items'],
                        'itemFields' => ['name', 'icon', 'price', 'time', 'description'],
                    ],
                    'zones' => [
                        'label' => 'Shipping Zones',
                        'fields' => ['items'],
                        'itemFields' => ['zone', 'areas', 'standard', 'express'],
                    ],
                    'features' => [
                        'label' => 'Shipping Features',
                        'fields' => ['items'],
                        'itemFields' => ['icon', 'title', 'description'],
                    ],
                    'faqs' => [
                        'label' => 'Shipping FAQs',
                        'fields' => ['items'],
                        'itemFields' => ['question', 'answer'],
                    ],
                ],
            ],
            'returns' => [
                'title' => 'Returns & Exchanges',
                'description' => 'Manage returns and exchanges policy',
                'sections' => [
                    'hero' => [
                        'label' => 'Hero Section',
                        'fields' => ['title', 'subtitle'],
                    ],
                    'return_steps' => [
                        'label' => 'Return Process Steps',
                        'fields' => ['items'],
                        'itemFields' => ['step', 'title', 'description', 'icon'],
                    ],
                    'eligible' => [
                        'label' => 'Eligible Items',
                        'fields' => ['items'],
                        'itemFields' => ['text'],
                    ],
                    'not_eligible' => [
                        'label' => 'Not Eligible Items',
                        'fields' => ['items'],
                        'itemFields' => ['text'],
                    ],
                    'faqs' => [
                        'label' => 'Returns FAQs',
                        'fields' => ['items'],
                        'itemFields' => ['question', 'answer'],
                    ],
                ],
            ],
            'warranty' => [
                'title' => 'Warranty Information',
                'description' => 'Manage warranty information content',
                'sections' => [
                    'hero' => [
                        'label' => 'Hero Section',
                        'fields' => ['title', 'subtitle'],
                    ],
                    'warranty_tiers' => [
                        'label' => 'Warranty Tiers',
                        'fields' => ['items'],
                        'itemFields' => ['name', 'duration', 'description', 'icon', 'color', 'features'],
                    ],
                    'covered' => [
                        'label' => 'What\'s Covered',
                        'fields' => ['items'],
                        'itemFields' => ['text'],
                    ],
                    'not_covered' => [
                        'label' => 'What\'s Not Covered',
                        'fields' => ['items'],
                        'itemFields' => ['text'],
                    ],
                    'claim_steps' => [
                        'label' => 'Claim Process Steps',
                        'fields' => ['items'],
                        'itemFields' => ['step', 'title', 'description'],
                    ],
                    'faqs' => [
                        'label' => 'Warranty FAQs',
                        'fields' => ['items'],
                        'itemFields' => ['question', 'answer'],
                    ],
                ],
            ],
            'care' => [
                'title' => 'Care & Maintenance',
                'description' => 'Manage care and maintenance guides',
                'sections' => [
                    'hero' => [
                        'label' => 'Hero Section',
                        'fields' => ['title', 'subtitle'],
                    ],
                    'general_tips' => [
                        'label' => 'General Care Tips',
                        'fields' => ['items'],
                        'itemFields' => ['icon', 'title', 'description'],
                    ],
                    'care_categories' => [
                        'label' => 'Care by Material',
                        'fields' => ['items'],
                        'itemFields' => ['id', 'title', 'icon', 'tips'],
                    ],
                    'dos' => [
                        'label' => 'Do\'s',
                        'fields' => ['items'],
                        'itemFields' => ['text'],
                    ],
                    'donts' => [
                        'label' => 'Don\'ts',
                        'fields' => ['items'],
                        'itemFields' => ['text'],
                    ],
                ],
            ],
            'privacy' => [
                'title' => 'Privacy Policy',
                'description' => 'Manage privacy policy content',
                'sections' => [
                    'hero' => [
                        'label' => 'Hero Section',
                        'fields' => ['title', 'subtitle'],
                    ],
                    'content' => [
                        'label' => 'Main Content',
                        'fields' => ['content'],
                        'richText' => true,
                    ],
                ],
            ],
            'terms' => [
                'title' => 'Terms & Conditions',
                'description' => 'Manage terms and conditions content',
                'sections' => [
                    'hero' => [
                        'label' => 'Hero Section',
                        'fields' => ['title', 'subtitle'],
                    ],
                    'content' => [
                        'label' => 'Main Content',
                        'fields' => ['content'],
                        'richText' => true,
                    ],
                ],
            ],
        ];

        return $configs[$pageSlug] ?? [
            'title' => ucfirst($pageSlug),
            'description' => 'Manage page content',
            'sections' => [
                'hero' => [
                    'label' => 'Hero Section',
                    'fields' => ['title', 'subtitle'],
                ],
                'content' => [
                    'label' => 'Main Content',
                    'fields' => ['content'],
                    'richText' => true,
                ],
            ],
        ];
    }
}
