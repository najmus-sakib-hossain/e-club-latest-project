<?php

namespace Database\Seeders;

use App\Models\FooterAddress;
use App\Models\FooterLink;
use App\Models\FooterSection;
use App\Models\SocialLink;
use Illuminate\Database\Seeder;

class FooterSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Footer Sections
        FooterSection::create([
            'section_key' => 'brand_info',
            'title' => 'Entrepreneurs Club',
            'content' => 'The Entrepreneurs Club of Bangladesh is a non-profit organization based in Bangladesh that focuses on supporting and promoting entrepreneurship in the country. The club provides resources, networking opportunities, and support to entrepreneurs.',
            'data' => [
                'office_time' => 'Sunday – Thursday 11am–5pm',
                'email' => 'query.eclub@gmail.com',
            ],
            'is_active' => true,
            'sort_order' => 1,
        ]);

        FooterSection::create([
            'section_key' => 'contact',
            'title' => 'Contact Us',
            'content' => 'Visit Time: 11am to 6pm. Please call respective branch number before visiting offices.',
            'data' => [
                'phones' => [
                    '+880 1792 111 113',
                    '+880 1819 800 006',
                    '+880 1740 443 638',
                ],
            ],
            'is_active' => true,
            'sort_order' => 2,
        ]);

        // Footer Links - Community
        $communityLinks = [
            ['title' => 'Online Forums', 'url' => '/community/forums'],
            ['title' => 'Networking Groups', 'url' => '/community/networking'],
            ['title' => 'Volunteer Opportunities', 'url' => '/community/volunteer'],
        ];

        foreach ($communityLinks as $index => $link) {
            FooterLink::create([
                'category' => 'community',
                'title' => $link['title'],
                'url' => $link['url'],
                'is_active' => true,
                'sort_order' => $index + 1,
            ]);
        }

        // Footer Links - Blog
        $blogLinks = [
            ['title' => 'Read Blogs', 'url' => '/blog'],
            ['title' => 'Latest Blogs', 'url' => '/blog/latest'],
            ['title' => 'Guest Articles', 'url' => '/blog/guest'],
            ['title' => 'Entrepreneurial Insights', 'url' => '/blog/insights'],
            ['title' => 'Industry Trends', 'url' => '/blog/trends'],
        ];

        foreach ($blogLinks as $index => $link) {
            FooterLink::create([
                'category' => 'blog',
                'title' => $link['title'],
                'url' => $link['url'],
                'is_active' => true,
                'sort_order' => $index + 1,
            ]);
        }

        // Bangladesh Addresses
        $bangladeshAddresses = [
            [
                'title' => 'Branch Office in Gulshan/Banani',
                'address' => 'House-108, Road-12, Floor-3rd, Block-E, Gulshan, Banani, (Beside Prescription Point), Dhaka, Bangladesh',
                'phone' => '+880707-929811',
            ],
            [
                'title' => 'Branch Office in Panthapath/Banglamotor',
                'address' => '50, Lake Circus, 5th Floor, Kalabagan, Dhaka, Dhaka Division, Bangladesh',
                'phone' => '+8801819-800006',
            ],
            [
                'title' => 'Branch Office in Dhanmondi/Lalmatia',
                'address' => '275/D, Suite # C11, Lift Level-11, Rd 27, Dhaka 1207',
                'phone' => '+8801711-661665',
            ],
            [
                'title' => 'Branch Office in Niketon/Badda',
                'address' => 'H# 87-89, R# 4, Bl# B, 1st Floor, Niketon, Gulshan, Dhaka 1212, Bangladesh',
                'phone' => '+8801331-546622',
            ],
            [
                'title' => 'Branch Office in Motijheel/Paltan',
                'address' => 'Suite# F-11, Level# 11, TROPICANA TOWER, 45 Purana Paltan, Dhaka 1000',
                'phone' => '+8801988-121212',
            ],
        ];

        foreach ($bangladeshAddresses as $index => $address) {
            FooterAddress::create([
                'type' => 'bangladesh',
                'title' => $address['title'],
                'address' => $address['address'],
                'phone' => $address['phone'],
                'is_active' => true,
                'sort_order' => $index + 1,
            ]);
        }

        // International Addresses
        $countries = ['Dubai', 'Malaysia', 'Canada', 'USA', 'Singapore', 'Thailand'];
        foreach ($countries as $index => $country) {
            FooterAddress::create([
                'type' => 'international',
                'title' => $country,
                'address' => "Collaboration Office in {$country}. Contact us for specific location details and appointments.",
                'phone' => '+880707-929811',
                'country' => $country,
                'is_active' => true,
                'sort_order' => $index + 1,
            ]);
        }

        // Social Links
        $socialLinks = [
            ['platform' => 'Facebook', 'url' => 'https://facebook.com/eclub', 'icon' => 'facebook'],
            ['platform' => 'LinkedIn', 'url' => 'https://linkedin.com/company/eclub', 'icon' => 'linkedin'],
            ['platform' => 'YouTube', 'url' => 'https://youtube.com/@eclub', 'icon' => 'youtube'],
        ];

        foreach ($socialLinks as $index => $link) {
            SocialLink::create([
                'platform' => $link['platform'],
                'url' => $link['url'],
                'icon' => $link['icon'],
                'is_active' => true,
                'sort_order' => $index + 1,
            ]);
        }
    }
}
