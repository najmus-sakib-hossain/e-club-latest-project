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
                'Bedroom Furniture' => [
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
                    'Garden Furniture',
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
