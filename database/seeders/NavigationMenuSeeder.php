<?php

namespace Database\Seeders;

use App\Models\NavigationMenu;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class NavigationMenuSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Clear existing navigation
        NavigationMenu::truncate();

        // Home
        NavigationMenu::create([
            'name' => 'Home',
            'slug' => 'home',
            'url' => '/',
            'type' => 'single',
            'location' => 'header',
            'is_active' => true,
            'sort_order' => 1,
        ]);

        // Committee (with dropdown)
        $committee = NavigationMenu::create([
            'name' => 'Committee',
            'slug' => 'committee',
            'url' => '#',
            'type' => 'mega',
            'location' => 'header',
            'is_active' => true,
            'sort_order' => 2,
        ]);

        $committeeItems = [
            ['name' => 'Advisors', 'url' => '/committee/advisors', 'description' => 'Industry veterans offering strategic guidance to the E-Club.'],
            ['name' => 'Governing Body', 'url' => '/committee/governing', 'description' => 'The leadership team setting the direction for the E-Club.'],
            ['name' => 'Executive Body', 'url' => '/committee/executive', 'description' => 'Overseeing the day-to-day operations of the E-Club.'],
            ['name' => 'Founders', 'url' => '/committee/founders', 'description' => 'The individuals who established the E-Club.'],
            ['name' => 'Forums', 'url' => '/committee/forums', 'description' => 'Platforms for members to connect and discuss various topics.'],
            ['name' => 'Standing Committee', 'url' => '/committee/standing', 'description' => 'A permanent committee with ongoing responsibilities.'],
            ['name' => 'Project Directors', 'url' => '/committee/directors', 'description' => 'Members leading specific E-Club projects.'],
            ['name' => 'Administrative Team', 'url' => '/committee/admin', 'description' => 'The Team managing daily tasks to ensure smooth operations.'],
        ];

        foreach ($committeeItems as $index => $item) {
            NavigationMenu::create([
                'parent_id' => $committee->id,
                'name' => $item['name'],
                'slug' => str_replace('/', '-', str_replace('/committee/', '', $item['url'])),
                'url' => $item['url'],
                'description' => $item['description'] ?? '',
                'type' => 'link',
                'location' => 'header',
                'is_active' => true,
                'sort_order' => $index + 1,
            ]);
        }

        // Membership
        $membership = NavigationMenu::create([
            'name' => 'Membership',
            'slug' => 'membership',
            'url' => '#',
            'type' => 'dropdown',
            'location' => 'header',
            'is_active' => true,
            'sort_order' => 3,
        ]);

        $membershipItems = [
            ['name' => 'Benefits of Membership', 'url' => '/membership/benefits', 'description' => 'Discover the exclusive advantages of being an E-Club member.'],
            ['name' => 'Renew Membership', 'url' => '/membership/renew', 'description' => 'Continue your E-Club journey and access ongoing benefits.'],
            ['name' => 'Member Directory', 'url' => '/membership/directory', 'description' => 'Connect and collaborate with fellow E-Club members.'],
        ];

        foreach ($membershipItems as $index => $item) {
            NavigationMenu::create([
                'parent_id' => $membership->id,
                'name' => $item['name'],
                'slug' => str_replace('/', '-', str_replace('/membership/', '', $item['url'])),
                'url' => $item['url'],
                'description' => $item['description'] ?? '',
                'type' => 'link',
                'location' => 'header',
                'is_active' => true,
                'sort_order' => $index + 1,
            ]);
        }

        // Events
        $events = NavigationMenu::create([
            'name' => 'Events',
            'slug' => 'events',
            'url' => '#',
            'type' => 'dropdown',
            'location' => 'header',
            'is_active' => true,
            'sort_order' => 4,
        ]);

        $eventItems = [
            ['name' => 'Upcoming Events', 'url' => '/events/upcoming', 'description' => 'Discover inspiring workshops, networking events, and more.'],
            ['name' => 'Past Events', 'url' => '/events/past', 'description' => 'Relive the highlights and access past event resources.'],
            ['name' => 'Request for Event', 'url' => '/events/request', 'description' => 'Join or suggest! Shape E-Club events together.'],
        ];

        foreach ($eventItems as $index => $item) {
            NavigationMenu::create([
                'parent_id' => $events->id,
                'name' => $item['name'],
                'slug' => str_replace('/', '-', str_replace('/events/', '', $item['url'])),
                'url' => $item['url'],
                'description' => $item['description'] ?? '',
                'type' => 'link',
                'location' => 'header',
                'is_active' => true,
                'sort_order' => $index + 1,
            ]);
        }

        // Single menu items
        $singleItems = [
            ['name' => 'Projects', 'url' => '/projects', 'order' => 5],
            ['name' => 'Concerns', 'url' => '/concerns', 'order' => 6],
            ['name' => 'Partnerships', 'url' => '/partnerships', 'order' => 7],
        ];

        foreach ($singleItems as $item) {
            NavigationMenu::create([
                'name' => $item['name'],
                'slug' => strtolower($item['name']),
                'url' => $item['url'],
                'type' => 'single',
                'location' => 'header',
                'is_active' => true,
                'sort_order' => $item['order'],
            ]);
        }

        // Media
        $media = NavigationMenu::create([
            'name' => 'Media',
            'slug' => 'media',
            'url' => '#',
            'type' => 'dropdown',
            'location' => 'header',
            'is_active' => true,
            'sort_order' => 8,
        ]);

        $mediaItems = [
            ['name' => 'Notice and Updates', 'url' => '/media/notices', 'description' => 'Stay informed on E-Club happenings and industry news.'],
            ['name' => 'Press Releases', 'url' => '/media/press', 'description' => 'Official announcements and media coverage of the E-Club.'],
            ['name' => 'Album', 'url' => '/media/album', 'description' => 'Immerse yourself in E-Club events and activities album'],
            ['name' => 'Newsletter Archive', 'url' => '/media/newsletter', 'description' => 'Catch up on past E-Club news and insights.'],
            ['name' => 'Blog', 'url' => '/media/blog', 'description' => 'Catch up on past E-Club news and insights.'],
        ];

        foreach ($mediaItems as $index => $item) {
            NavigationMenu::create([
                'parent_id' => $media->id,
                'name' => $item['name'],
                'slug' => str_replace('/', '-', str_replace('/media/', '', $item['url'])),
                'url' => $item['url'],
                'description' => $item['description'] ?? '',
                'type' => 'link',
                'location' => 'header',
                'is_active' => true,
                'sort_order' => $index + 1,
            ]);
        }

        // Shop & Contact
        NavigationMenu::create([
            'name' => 'Shop',
            'slug' => 'shop',
            'url' => '/shop',
            'type' => 'single',
            'location' => 'header',
            'is_active' => true,
            'sort_order' => 9,
        ]);

        NavigationMenu::create([
            'name' => 'Contact Us',
            'slug' => 'contact',
            'url' => '/contact',
            'type' => 'single',
            'location' => 'header',
            'is_active' => true,
            'sort_order' => 10,
        ]);

        return; // Exit early - rest of old furniture data below can remain but won't execute

        $navigationStructure = [
            'Tables & Desks' => [
                'Family Tables & Desks' => [
                    'Study Tables',
                    'Dining Tables',
                    'Dressing Tables',
                    'Computer Tables',
                    'Gaming Tables',
                    "Kid's Tables",
                ],
                'Business Tables & Desks' => [
                    'Executive Desks',
                    'Workstations',
                    'Conference Tables',
                    'Reception Desks',
                    'Speech Podium (Lectern)',
                    'Class Room Tables',
                    'Restaurant Tables',
                ],
                'Multipurpose Tables' => [
                    'Height Adjustable Tables',
                    'Side Tables',
                    'Center Tables',
                    'Round Tables',
                    'Portable Tables',
                    'Standing Tables',
                    'Overbed Tables',
                    'L-Shape Tables',
                    'Space Saving Tables',
                ],
                'Accessories & Components' => [
                    'Footrests',
                    'Power Managements',
                    'Monitor Arm',
                    'Keyboard Trays',
                    'CPU Stands',
                    'Table Tops',
                ],
            ],
            'Beds & Mattresses' => [
                'Beds' => [
                    'King Size Beds',
                    'Queen Size Beds',
                    'Single Beds',
                    'Bunk Beds',
                    'Sofa Cum Beds',
                ],
                'Mattresses' => [
                    'Memory Foam',
                    'Spring Mattress',
                    'Orthopedic Mattress',
                ],
                'Bedroom E-Club' => [
                    'Wardrobes',
                    'Nightstands',
                    'Dressers',
                ],
            ],
            'Chairs' => [
                'Office Chairs' => [
                    'Executive Chairs',
                    'Ergonomic Chairs',
                    'Mesh Chairs',
                    'Task Chairs',
                    'Gaming Chairs',
                ],
                'Home Chairs' => [
                    'Dining Chairs',
                    'Lounge Chairs',
                    'Accent Chairs',
                    'Rocking Chairs',
                ],
                'Seating' => [
                    'Bar Stools',
                    'Counter Stools',
                    'Ottomans',
                    'Benches',
                ],
            ],
            'Sofas' => [
                'Living Room Sofas' => [
                    'Sectional Sofas',
                    'L-Shaped Sofas',
                    'Recliners',
                    'Loveseats',
                    'Sleeper Sofas',
                ],
                'Materials' => [
                    'Leather Sofas',
                    'Fabric Sofas',
                    'Velvet Sofas',
                ],
            ],
            'Storage' => [
                'Living Room Storage' => [
                    'TV Units',
                    'Bookshelves',
                    'Display Cabinets',
                    'Shoe Racks',
                ],
                'Office Storage' => [
                    'Filing Cabinets',
                    'Office Shelves',
                    'Lockers',
                ],
                'Bedroom Storage' => [
                    'Wardrobes',
                    'Chest of Drawers',
                    'Closet Organizers',
                ],
            ],
            'Series' => [
                'Popular Series' => [
                    'Modern Collection',
                    'Classic Collection',
                    'Minimalist Series',
                    'Industrial Series',
                ],
            ],
            'Others' => [
                'Accessories' => [
                    'Mirrors',
                    'Rugs',
                    'Lighting',
                    'Decor',
                ],
                'Outdoor' => [
                    'Garden E-Club',
                    'Patio Sets',
                    'Outdoor Chairs',
                ],
            ],
        ];

        $mainSortOrder = 0;
        foreach ($navigationStructure as $mainMenuName => $categories) {
            // Create main menu item
            $mainMenu = NavigationMenu::create([
                'name' => $mainMenuName,
                'slug' => Str::slug($mainMenuName),
                'type' => 'main',
                'location' => 'primary',
                'is_active' => true,
                'sort_order' => $mainSortOrder++,
            ]);

            $categorySortOrder = 0;
            foreach ($categories as $categoryName => $items) {
                // Create category
                $category = NavigationMenu::create([
                    'parent_id' => $mainMenu->id,
                    'name' => $categoryName,
                    'slug' => Str::slug($categoryName),
                    'type' => 'category',
                    'location' => 'primary',
                    'is_active' => true,
                    'sort_order' => $categorySortOrder++,
                ]);

                $itemSortOrder = 0;
                foreach ($items as $itemName) {
                    // Create item
                    $itemSlug = Str::slug($itemName);
                    NavigationMenu::create([
                        'parent_id' => $category->id,
                        'name' => $itemName,
                        'slug' => $itemSlug,
                        'url' => "/products?category={$itemSlug}",
                        'type' => 'item',
                        'location' => 'primary',
                        'is_active' => true,
                        'sort_order' => $itemSortOrder++,
                    ]);
                }
            }
        }

        $this->command->info('Navigation menu seeded successfully with ' . NavigationMenu::count() . ' items.');
    }
}
