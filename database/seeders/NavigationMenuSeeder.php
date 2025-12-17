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
        // Don't re-seed if we have main items
        if (NavigationMenu::where('type', 'main')->exists()) {
            return;
        }

        $sortOrder = 0;

        // Tables & Desks
        $tablesDesks = NavigationMenu::create([
            'name' => 'Tables & Desks',
            'slug' => 'tables-desks',
            'type' => 'main',
            'location' => 'primary',
            'is_active' => true,
            'sort_order' => $sortOrder++,
        ]);

        $familyTables = NavigationMenu::create([
            'parent_id' => $tablesDesks->id,
            'name' => 'Family Tables & Desks',
            'slug' => 'family-tables-desks',
            'type' => 'category',
            'location' => 'primary',
            'is_active' => true,
            'sort_order' => 0,
        ]);

        foreach (['Study Tables', 'Dining Tables', 'Computer Tables', 'Console Tables'] as $index => $name) {
            NavigationMenu::create([
                'parent_id' => $familyTables->id,
                'name' => $name,
                'slug' => Str::slug($name),
                'url' => '/products?category='.Str::slug($name),
                'type' => 'item',
                'location' => 'primary',
                'is_active' => true,
                'sort_order' => $index,
            ]);
        }

        $officeTables = NavigationMenu::create([
            'parent_id' => $tablesDesks->id,
            'name' => 'Office Tables & Desks',
            'slug' => 'office-tables-desks',
            'type' => 'category',
            'location' => 'primary',
            'is_active' => true,
            'sort_order' => 1,
        ]);

        foreach (['Executive Desks', 'Conference Tables', 'Workstations', 'Standing Desks'] as $index => $name) {
            NavigationMenu::create([
                'parent_id' => $officeTables->id,
                'name' => $name,
                'slug' => Str::slug($name),
                'url' => '/products?category='.Str::slug($name),
                'type' => 'item',
                'location' => 'primary',
                'is_active' => true,
                'sort_order' => $index,
            ]);
        }

        // Chairs
        $chairs = NavigationMenu::create([
            'name' => 'Chairs',
            'slug' => 'chairs',
            'type' => 'main',
            'location' => 'primary',
            'is_active' => true,
            'sort_order' => $sortOrder++,
        ]);

        $familyChairs = NavigationMenu::create([
            'parent_id' => $chairs->id,
            'name' => 'Family Chairs',
            'slug' => 'family-chairs',
            'type' => 'category',
            'location' => 'primary',
            'is_active' => true,
            'sort_order' => 0,
        ]);

        foreach (['Dining Chairs', 'Accent Chairs', 'Lounge Chairs', 'Rocking Chairs'] as $index => $name) {
            NavigationMenu::create([
                'parent_id' => $familyChairs->id,
                'name' => $name,
                'slug' => Str::slug($name),
                'url' => '/products?category='.Str::slug($name),
                'type' => 'item',
                'location' => 'primary',
                'is_active' => true,
                'sort_order' => $index,
            ]);
        }

        $officeChairs = NavigationMenu::create([
            'parent_id' => $chairs->id,
            'name' => 'Office Chairs',
            'slug' => 'office-chairs',
            'type' => 'category',
            'location' => 'primary',
            'is_active' => true,
            'sort_order' => 1,
        ]);

        foreach (['Ergonomic Chairs', 'Executive Chairs', 'Task Chairs', 'Gaming Chairs'] as $index => $name) {
            NavigationMenu::create([
                'parent_id' => $officeChairs->id,
                'name' => $name,
                'slug' => Str::slug($name),
                'url' => '/products?category='.Str::slug($name),
                'type' => 'item',
                'location' => 'primary',
                'is_active' => true,
                'sort_order' => $index,
            ]);
        }

        // Storage
        $storage = NavigationMenu::create([
            'name' => 'Storage',
            'slug' => 'storage',
            'type' => 'main',
            'location' => 'primary',
            'is_active' => true,
            'sort_order' => $sortOrder++,
        ]);

        $homeStorage = NavigationMenu::create([
            'parent_id' => $storage->id,
            'name' => 'Home Storage',
            'slug' => 'home-storage',
            'type' => 'category',
            'location' => 'primary',
            'is_active' => true,
            'sort_order' => 0,
        ]);

        foreach (['Bookcases', 'Cabinets', 'Shelving Units', 'TV Stands'] as $index => $name) {
            NavigationMenu::create([
                'parent_id' => $homeStorage->id,
                'name' => $name,
                'slug' => Str::slug($name),
                'url' => '/products?category='.Str::slug($name),
                'type' => 'item',
                'location' => 'primary',
                'is_active' => true,
                'sort_order' => $index,
            ]);
        }

        $officeStorage = NavigationMenu::create([
            'parent_id' => $storage->id,
            'name' => 'Office Storage',
            'slug' => 'office-storage',
            'type' => 'category',
            'location' => 'primary',
            'is_active' => true,
            'sort_order' => 1,
        ]);

        foreach (['File Cabinets', 'Storage Cabinets', 'Credenzas', 'Lockers'] as $index => $name) {
            NavigationMenu::create([
                'parent_id' => $officeStorage->id,
                'name' => $name,
                'slug' => Str::slug($name),
                'url' => '/products?category='.Str::slug($name),
                'type' => 'item',
                'location' => 'primary',
                'is_active' => true,
                'sort_order' => $index,
            ]);
        }

        // Sofas & Seating
        $sofas = NavigationMenu::create([
            'name' => 'Sofas & Seating',
            'slug' => 'sofas-seating',
            'type' => 'main',
            'location' => 'primary',
            'is_active' => true,
            'sort_order' => $sortOrder++,
        ]);

        $livingRoom = NavigationMenu::create([
            'parent_id' => $sofas->id,
            'name' => 'Living Room',
            'slug' => 'living-room',
            'type' => 'category',
            'location' => 'primary',
            'is_active' => true,
            'sort_order' => 0,
        ]);

        foreach (['Sofas', 'Sectionals', 'Loveseats', 'Recliners'] as $index => $name) {
            NavigationMenu::create([
                'parent_id' => $livingRoom->id,
                'name' => $name,
                'slug' => Str::slug($name),
                'url' => '/products?category='.Str::slug($name),
                'type' => 'item',
                'location' => 'primary',
                'is_active' => true,
                'sort_order' => $index,
            ]);
        }

        $officeSeating = NavigationMenu::create([
            'parent_id' => $sofas->id,
            'name' => 'Office Seating',
            'slug' => 'office-seating',
            'type' => 'category',
            'location' => 'primary',
            'is_active' => true,
            'sort_order' => 1,
        ]);

        foreach (['Reception Seating', 'Lounge E-Club', 'Benches', 'Ottomans'] as $index => $name) {
            NavigationMenu::create([
                'parent_id' => $officeSeating->id,
                'name' => $name,
                'slug' => Str::slug($name),
                'url' => '/products?category='.Str::slug($name),
                'type' => 'item',
                'location' => 'primary',
                'is_active' => true,
                'sort_order' => $index,
            ]);
        }

        // Bedroom
        $bedroom = NavigationMenu::create([
            'name' => 'Bedroom',
            'slug' => 'bedroom',
            'type' => 'main',
            'location' => 'primary',
            'is_active' => true,
            'sort_order' => $sortOrder++,
        ]);

        $beds = NavigationMenu::create([
            'parent_id' => $bedroom->id,
            'name' => 'Beds & Frames',
            'slug' => 'beds-frames',
            'type' => 'category',
            'location' => 'primary',
            'is_active' => true,
            'sort_order' => 0,
        ]);

        foreach (['Platform Beds', 'Storage Beds', 'Bed Frames', 'Headboards'] as $index => $name) {
            NavigationMenu::create([
                'parent_id' => $beds->id,
                'name' => $name,
                'slug' => Str::slug($name),
                'url' => '/products?category='.Str::slug($name),
                'type' => 'item',
                'location' => 'primary',
                'is_active' => true,
                'sort_order' => $index,
            ]);
        }

        $bedroomStorage = NavigationMenu::create([
            'parent_id' => $bedroom->id,
            'name' => 'Bedroom Storage',
            'slug' => 'bedroom-storage',
            'type' => 'category',
            'location' => 'primary',
            'is_active' => true,
            'sort_order' => 1,
        ]);

        foreach (['Dressers', 'Nightstands', 'Wardrobes', 'Chests'] as $index => $name) {
            NavigationMenu::create([
                'parent_id' => $bedroomStorage->id,
                'name' => $name,
                'slug' => Str::slug($name),
                'url' => '/products?category='.Str::slug($name),
                'type' => 'item',
                'location' => 'primary',
                'is_active' => true,
                'sort_order' => $index,
            ]);
        }
    }
}
