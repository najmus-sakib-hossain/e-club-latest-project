<?php

namespace Database\Seeders;

use App\Models\HomeActivity;
use App\Models\HomeCoreValue;
use App\Models\HomePartner;
use App\Models\HomeProject;
use App\Models\HomeSection;
use App\Models\HomeStat;
use Illuminate\Database\Seeder;

class HomePageSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Home Sections
        HomeSection::create([
            'section_key' => 'hero',
            'title' => 'To make a better future get Membership Certificate.',
            'subtitle' => 'The Entrepreneurs Club of Bangladesh (E-Club) is a community of business owners, entrepreneurs, and professionals in Bangladesh focused on growth, networking, and success.',
            'content' => null,
            'image' => 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2070&auto=format&fit=crop',
            'data' => null,
            'is_active' => true,
            'sort_order' => 1,
        ]);

        HomeSection::create([
            'section_key' => 'about',
            'title' => 'About Us',
            'subtitle' => null,
            'content' => null,
            'data' => [
                'sections' => [
                    [
                        'title' => 'Entrepreneurs Club of Bangladesh',
                        'content' => 'Founded in 2018 and registered with RJSC, the Entrepreneurs Club of Bangladesh is a non-profit organization dedicated to empowering entrepreneurs across the country. Through resource provision, networking opportunities, and ongoing support, the club helps aspiring and established entrepreneurs build and grow thriving businesses.',
                    ],
                    [
                        'title' => 'Our Mission',
                        'content' => 'The Entrepreneurs Club of Bangladesh supports entrepreneurs by providing a network for collaboration and growth, fostering new ventures and member connections.',
                    ],
                    [
                        'title' => 'Our Vision',
                        'content' => 'The Entrepreneurs Club of Bangladesh envisions a thriving ecosystem empowering entrepreneurs and fostering economic development.',
                    ],
                ],
            ],
            'is_active' => true,
            'sort_order' => 2,
        ]);

        HomeSection::create([
            'section_key' => 'sdg',
            'title' => 'Our SDG Goal',
            'subtitle' => null,
            'content' => null,
            'data' => [
                'goals' => [
                    ['number' => 8, 'title' => 'Decent Work and Economic Growth'],
                    ['number' => 9, 'title' => 'Industry, Innovation and Infrastructure'],
                    ['number' => 17, 'title' => 'Partnerships for the Goals'],
                ],
            ],
            'is_active' => true,
            'sort_order' => 3,
        ]);

        HomeSection::create([
            'section_key' => 'founder_message',
            'title' => "Founder's Message",
            'subtitle' => null,
            'content' => "Welcome to the Entrepreneurs Club of Bangladesh! Since our founding in 2018, we have been committed to empowering entrepreneurs and fostering a thriving business ecosystem in Bangladesh.\n\nOur club was born from a simple belief: that when entrepreneurs come together, share knowledge, and support one another, extraordinary things happen. We've seen startups grow into successful enterprises, witnessed innovative ideas transform into reality, and watched our members achieve their dreams through collaboration and determination.\n\nAt E-Club, we believe in the power of community. We provide more than just networking opportunities—we offer mentorship, resources, workshops, and a supportive environment where entrepreneurs can learn, grow, and succeed together.\n\nWhether you're a seasoned business owner or just starting your entrepreneurial journey, you'll find a home here. Join us in building a stronger, more vibrant business community in Bangladesh.\n\nLet's grow together!",
            'image' => 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1974&auto=format&fit=crop',
            'data' => [
                'founder_name' => 'Mohammad Rahman',
                'founder_title' => 'Founder & President',
                'founder_company' => 'Entrepreneurs Club of Bangladesh',
            ],
            'is_active' => true,
            'sort_order' => 4,
        ]);

        // Stats
        $stats = [
            ['count' => '04', 'label' => 'Advisors'],
            ['count' => '05', 'label' => 'Governing Body'],
            ['count' => '20', 'label' => 'Founders'],
            ['count' => '15', 'label' => 'EC Members'],
            ['count' => '520', 'label' => 'General Members'],
            ['count' => '81', 'label' => 'Women Entrepreneur'],
            ['count' => '80', 'label' => 'Standing Committee'],
            ['count' => '05', 'label' => 'Projects'],
            ['count' => '10', 'label' => 'District'],
        ];

        foreach ($stats as $index => $stat) {
            HomeStat::create([
                'count' => $stat['count'],
                'label' => $stat['label'],
                'is_active' => true,
                'sort_order' => $index + 1,
            ]);
        }

        // Activities
        $activities = [
            [
                'title' => 'Workshops & Training',
                'description' => 'Learn from industry experts through comprehensive workshops and training sessions.',
                'icon' => 'GraduationCap',
            ],
            [
                'title' => 'Networking Events',
                'description' => 'Connect with fellow entrepreneurs and build valuable business relationships.',
                'icon' => 'Users',
            ],
            [
                'title' => 'Mentorship Programs',
                'description' => 'Get guidance from experienced mentors to accelerate your business growth.',
                'icon' => 'UserCheck',
            ],
            [
                'title' => 'Business Resources',
                'description' => 'Access tools, templates, and resources to help your business succeed.',
                'icon' => 'Briefcase',
            ],
        ];

        foreach ($activities as $index => $activity) {
            HomeActivity::create([
                'title' => $activity['title'],
                'description' => $activity['description'],
                'image' => null,
                'icon' => $activity['icon'],
                'is_active' => true,
                'sort_order' => $index + 1,
            ]);
        }

        // Projects
        $projects = [
            ['title' => 'Startup Incubator', 'image' => 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?q=80&w=2070'],
            ['title' => 'Export Facilitation', 'image' => 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?q=80&w=2070'],
            ['title' => 'Women Entrepreneurship', 'image' => 'https://images.unsplash.com/photo-1573164713988-8665fc963095?q=80&w=2069'],
            ['title' => 'Digital Marketing Hub', 'image' => 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2015'],
        ];

        foreach ($projects as $index => $project) {
            HomeProject::create([
                'title' => $project['title'],
                'description' => null,
                'image' => $project['image'],
                'url' => '/projects',
                'is_active' => true,
                'sort_order' => $index + 1,
            ]);
        }

        // Partners (placeholder logos)
        $partners = [
            'BIDA', 'BASIS', 'FBCCI', 'DCCI', 'SME Foundation', 'Bangladesh Bank',
        ];

        foreach ($partners as $index => $partner) {
            HomePartner::create([
                'name' => $partner,
                'logo' => 'https://via.placeholder.com/200x80?text='.urlencode($partner),
                'url' => '#',
                'is_active' => true,
                'sort_order' => $index + 1,
            ]);
        }

        // Core Values
        $coreValues = [
            [
                'title' => 'Integrity',
                'description' => 'We operate with honesty and transparency in all our dealings.',
                'icon' => 'Shield',
            ],
            [
                'title' => 'Collaboration',
                'description' => 'We believe in the power of working together to achieve common goals.',
                'icon' => 'Users',
            ],
            [
                'title' => 'Innovation',
                'description' => 'We encourage creative thinking and embrace new ideas.',
                'icon' => 'Lightbulb',
            ],
            [
                'title' => 'Excellence',
                'description' => 'We strive for the highest standards in everything we do.',
                'icon' => 'Award',
            ],
            [
                'title' => 'Growth',
                'description' => 'We are committed to continuous learning and development.',
                'icon' => 'TrendingUp',
            ],
        ];

        foreach ($coreValues as $index => $value) {
            HomeCoreValue::create([
                'title' => $value['title'],
                'description' => $value['description'],
                'icon' => $value['icon'],
                'is_active' => true,
                'sort_order' => $index + 1,
            ]);
        }
    }
}
