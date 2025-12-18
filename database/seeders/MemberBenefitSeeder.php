<?php

namespace Database\Seeders;

use App\Models\MemberBenefit;
use Illuminate\Database\Seeder;

class MemberBenefitSeeder extends Seeder
{
    public function run(): void
    {
        $benefits = [
            [
                'title' => 'Exclusive Networking Events',
                'description' => 'Access to monthly networking sessions, workshops, and seminars with industry leaders and fellow entrepreneurs.',
                'icon' => 'users',
                'category' => 'networking',
                'order' => 1,
            ],
            [
                'title' => 'Mentorship Programs',
                'description' => 'Connect with experienced mentors who can guide you through your entrepreneurial journey.',
                'icon' => 'user-check',
                'category' => 'mentorship',
                'order' => 2,
            ],
            [
                'title' => 'Business Resources Library',
                'description' => 'Access to comprehensive business resources, templates, guides, and industry reports.',
                'icon' => 'book-open',
                'category' => 'resources',
                'order' => 3,
            ],
            [
                'title' => 'Coworking Space Access',
                'description' => 'Complimentary access to E-Club coworking spaces with high-speed internet and meeting rooms.',
                'icon' => 'building',
                'category' => 'workspace',
                'order' => 4,
            ],
            [
                'title' => 'Funding Opportunities',
                'description' => 'Priority access to pitch competitions, investor networking, and E-Club startup fund.',
                'icon' => 'dollar-sign',
                'category' => 'funding',
                'order' => 5,
            ],
            [
                'title' => 'Educational Workshops',
                'description' => 'Regular workshops on business development, marketing, finance, and technology.',
                'icon' => 'graduation-cap',
                'category' => 'education',
                'order' => 6,
            ],
            [
                'title' => 'Partner Discounts',
                'description' => 'Exclusive discounts from our partner companies on business services and tools.',
                'icon' => 'tag',
                'category' => 'discounts',
                'order' => 7,
            ],
            [
                'title' => 'Online Community Platform',
                'description' => 'Access to our private online community for discussions, collaborations, and support.',
                'icon' => 'message-circle',
                'category' => 'community',
                'order' => 8,
            ],
            [
                'title' => 'Media & PR Support',
                'description' => 'Opportunities for media exposure through E-Club\'s press releases and social media channels.',
                'icon' => 'tv',
                'category' => 'marketing',
                'order' => 9,
            ],
            [
                'title' => 'International Connections',
                'description' => 'Network with entrepreneurs globally through our international partnership programs.',
                'icon' => 'globe',
                'category' => 'networking',
                'order' => 10,
            ],
        ];

        foreach ($benefits as $benefit) {
            MemberBenefit::create($benefit);
        }
    }
}
