<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\TrustedCompany;
use App\Models\FeatureCard;
use App\Models\SiteSetting;
use App\Models\HeroSlide;
use App\Models\Category;
use App\Models\Product;
use App\Models\FeaturedProduct;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\CustomerReview;
use App\Models\FaqCategory;
use App\Models\Faq;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Create admin user with hardcoded credentials
        User::firstOrCreate(
            ['email' => 'furniture@gmail.com'],
            [
                'name' => 'Admin',
                'password' => 'password',
                'email_verified_at' => now(),
                'is_admin' => true,
            ]
        );

        // Create test user for development (regular user, not admin)
        User::firstOrCreate(
            ['email' => 'test@example.com'],
            [
                'name' => 'Test User',
                'password' => 'password',
                'email_verified_at' => now(),
                'is_admin' => false,
            ]
        );

        // Seed Hero Slides with Unsplash images - Furniture style
        $heroSlides = [
            [
                'title' => 'L-Shaped Executive Desk',
                'subtitle' => 'Enjoy your working days with an L-shaped executive desk.',
                'button_text' => 'ORDER NOW',
                'button_link' => '/products?category=executive-desks',
                'image' => 'https://images.unsplash.com/photo-1593062096033-9a26b09da705?w=1920&q=80',
                'background_color' => '#f5f5f5',
                'text_color' => '#ffffff',
                'order' => 1,
            ],
            [
                'title' => 'Premium Leather Sofa',
                'subtitle' => 'Experience luxury comfort with our handcrafted leather collection.',
                'button_text' => 'SHOP NOW',
                'button_link' => '/products?category=sofas',
                'image' => 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1920&q=80',
                'background_color' => '#2c3e50',
                'text_color' => '#ffffff',
                'order' => 2,
            ],
            [
                'title' => 'Modern Bedroom Collection',
                'subtitle' => 'Transform your bedroom into a peaceful sanctuary.',
                'button_text' => 'EXPLORE',
                'button_link' => '/products?category=beds',
                'image' => 'https://images.unsplash.com/photo-1505693314120-0d443867891c?w=1920&q=80',
                'background_color' => '#e8d5c4',
                'text_color' => '#ffffff',
                'order' => 3,
            ],
        ];

        foreach ($heroSlides as $slide) {
            HeroSlide::updateOrCreate(
                ['title' => $slide['title']],
                array_merge($slide, ['is_active' => true])
            );
        }

        // Seed Categories with Unsplash images
        $categories = [
            // Business Collections
            ['name' => 'Office Desks', 'slug' => 'office-desks', 'collection_type' => 'business', 'description' => 'Professional desks for your workspace', 'image' => 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=800&q=80', 'order' => 1],
            ['name' => 'Conference Tables', 'slug' => 'conference-tables', 'collection_type' => 'business', 'description' => 'Meeting and conference room furniture', 'image' => 'https://images.unsplash.com/photo-1431540015161-0bf868a2d407?w=800&q=80', 'order' => 2],
            ['name' => 'Office Chairs', 'slug' => 'office-chairs', 'collection_type' => 'business', 'description' => 'Ergonomic chairs for comfort', 'image' => 'https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=800&q=80', 'order' => 3],
            
            // Family Collections
            ['name' => 'Dining Tables', 'slug' => 'dining-tables', 'collection_type' => 'family', 'description' => 'Beautiful dining sets for family meals', 'image' => 'https://images.unsplash.com/photo-1617806118233-18e1de247200?w=800&q=80', 'order' => 1],
            ['name' => 'Sofas', 'slug' => 'sofas', 'collection_type' => 'family', 'description' => 'Comfortable sofas for living rooms', 'image' => 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80', 'order' => 2],
            ['name' => 'Beds', 'slug' => 'beds', 'collection_type' => 'family', 'description' => 'Quality beds for restful sleep', 'image' => 'https://images.unsplash.com/photo-1505693314120-0d443867891c?w=800&q=80', 'order' => 3],
            ['name' => 'Storage', 'slug' => 'storage', 'collection_type' => 'family', 'description' => 'Wardrobes and storage solutions', 'image' => 'https://images.unsplash.com/photo-1558997519-83ea9252edf8?w=800&q=80', 'order' => 4],
            
            // Seating Collections
            ['name' => 'Executive Chairs', 'slug' => 'executive-chairs', 'collection_type' => 'seating', 'description' => 'Premium executive seating', 'image' => 'https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=800&q=80', 'order' => 1],
            ['name' => 'Lounge Chairs', 'slug' => 'lounge-chairs', 'collection_type' => 'seating', 'description' => 'Relaxing lounge seating', 'image' => 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=800&q=80', 'order' => 2],
            ['name' => 'Dining Chairs', 'slug' => 'dining-chairs', 'collection_type' => 'seating', 'description' => 'Stylish dining chairs', 'image' => 'https://images.unsplash.com/photo-1503602642458-232111445657?w=800&q=80', 'order' => 3],
            ['name' => 'Bar Stools', 'slug' => 'bar-stools', 'collection_type' => 'seating', 'description' => 'Modern bar and counter stools', 'image' => 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=800&q=80', 'order' => 4],
        ];

        foreach ($categories as $category) {
            Category::updateOrCreate(
                ['slug' => $category['slug']],
                array_merge($category, ['is_active' => true])
            );
        }

        // Seed Products with Unsplash images
        $products = [
            ['name' => 'Modern Executive Desk', 'slug' => 'modern-executive-desk', 'price' => 25000, 'category_slug' => 'office-desks', 'description' => 'Sleek modern desk with cable management', 'is_new_arrival' => true, 'is_featured' => true, 'is_best_seller' => false, 'images' => ['https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=800&q=80']],
            ['name' => 'Ergonomic Mesh Chair', 'slug' => 'ergonomic-mesh-chair', 'price' => 15000, 'category_slug' => 'office-chairs', 'description' => 'Breathable mesh back with lumbar support', 'is_new_arrival' => true, 'is_featured' => false, 'is_best_seller' => true, 'images' => ['https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=800&q=80']],
            ['name' => 'L-Shaped Corner Desk', 'slug' => 'l-shaped-corner-desk', 'price' => 32000, 'category_slug' => 'office-desks', 'description' => 'Spacious corner desk for maximum productivity', 'is_new_arrival' => true, 'is_featured' => true, 'is_best_seller' => true, 'images' => ['https://images.unsplash.com/photo-1593062096033-9a26b09da705?w=800&q=80']],
            ['name' => 'Premium Leather Sofa', 'slug' => 'premium-leather-sofa', 'price' => 85000, 'category_slug' => 'sofas', 'description' => 'Genuine leather 3-seater sofa', 'is_new_arrival' => true, 'is_featured' => true, 'is_best_seller' => true, 'images' => ['https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80']],
            ['name' => 'King Size Platform Bed', 'slug' => 'king-size-platform-bed', 'price' => 45000, 'category_slug' => 'beds', 'description' => 'Modern platform bed with storage', 'is_new_arrival' => true, 'is_featured' => false, 'is_best_seller' => true, 'images' => ['https://images.unsplash.com/photo-1505693314120-0d443867891c?w=800&q=80']],
            ['name' => 'Extendable Dining Table', 'slug' => 'extendable-dining-table', 'price' => 38000, 'category_slug' => 'dining-tables', 'description' => '6-8 seater extendable dining table', 'is_new_arrival' => true, 'is_featured' => true, 'is_best_seller' => false, 'images' => ['https://images.unsplash.com/photo-1617806118233-18e1de247200?w=800&q=80']],
            ['name' => 'Executive Leather Chair', 'slug' => 'executive-leather-chair', 'price' => 28000, 'category_slug' => 'executive-chairs', 'description' => 'High-back executive chair with premium leather', 'is_new_arrival' => true, 'is_featured' => false, 'is_best_seller' => true, 'images' => ['https://images.unsplash.com/photo-1541558869434-2840d308329a?w=800&q=80']],
            ['name' => 'Velvet Lounge Chair', 'slug' => 'velvet-lounge-chair', 'price' => 22000, 'category_slug' => 'lounge-chairs', 'description' => 'Luxurious velvet accent chair', 'is_new_arrival' => true, 'is_featured' => true, 'is_best_seller' => false, 'images' => ['https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=800&q=80']],
            ['name' => 'Modern Bar Stool Set', 'slug' => 'modern-bar-stool-set', 'price' => 18000, 'category_slug' => 'bar-stools', 'description' => 'Set of 2 adjustable bar stools', 'is_new_arrival' => false, 'is_featured' => false, 'is_best_seller' => true, 'images' => ['https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=800&q=80']],
            ['name' => 'Wooden Wardrobe', 'slug' => 'wooden-wardrobe', 'price' => 55000, 'category_slug' => 'storage', 'description' => 'Solid wood 3-door wardrobe', 'is_new_arrival' => false, 'is_featured' => true, 'is_best_seller' => false, 'images' => ['https://images.unsplash.com/photo-1558997519-83ea9252edf8?w=800&q=80']],
            ['name' => 'Conference Table 10-Seater', 'slug' => 'conference-table-10-seater', 'price' => 75000, 'category_slug' => 'conference-tables', 'description' => 'Large conference table for meetings', 'is_new_arrival' => false, 'is_featured' => false, 'is_best_seller' => true, 'images' => ['https://images.unsplash.com/photo-1431540015161-0bf868a2d407?w=800&q=80']],
            ['name' => 'Upholstered Dining Chair', 'slug' => 'upholstered-dining-chair', 'price' => 8500, 'category_slug' => 'dining-chairs', 'description' => 'Comfortable padded dining chair', 'is_new_arrival' => true, 'is_featured' => true, 'is_best_seller' => false, 'images' => ['https://images.unsplash.com/photo-1503602642458-232111445657?w=800&q=80']],
        ];

        foreach ($products as $productData) {
            $category = Category::where('slug', $productData['category_slug'])->first();
            if ($category) {
                Product::updateOrCreate(
                    ['slug' => $productData['slug']],
                    [
                        'name' => $productData['name'],
                        'slug' => $productData['slug'],
                        'description' => $productData['description'],
                        'price' => $productData['price'],
                        'category_id' => $category->id,
                        'images' => $productData['images'] ?? [],
                        'is_new_arrival' => $productData['is_new_arrival'],
                        'is_featured' => $productData['is_featured'] ?? false,
                        'is_best_seller' => $productData['is_best_seller'] ?? false,
                        'is_active' => true,
                        'stock_quantity' => rand(10, 100),
                    ]
                );
            }
        }

        // Seed Featured Product with Unsplash image
        $featuredProduct = Product::where('slug', 'premium-leather-sofa')->first();
        if ($featuredProduct) {
            FeaturedProduct::updateOrCreate(
                ['product_id' => $featuredProduct->id],
                [
                    'title' => 'Featured This Week',
                    'subtitle' => 'Premium Leather Collection',
                    'description' => 'Experience luxury with our handcrafted premium leather sofa. Made with genuine Italian leather and solid wood frame for lasting comfort.',
                    'badge_text' => 'Best Seller',
                    'button_text' => 'Shop Now',
                    'button_link' => '/products/premium-leather-sofa',
                    'image' => 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1200&q=80',
                    'is_active' => true,
                ]
            );
        }

        // Seed Customer Reviews
        $customerReviews = [
            [
                'name' => 'Sarah Johnson',
                'role' => 'Interior Designer',
                'review' => 'Absolutely love the quality of furniture from this store! The executive desk I purchased is sturdy, elegant, and perfect for my home office. Customer service was exceptional.',
                'rating' => 5,
                'image' => 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80',
                'order' => 1,
            ],
            [
                'name' => 'Michael Chen',
                'role' => 'Business Owner',
                'review' => 'We furnished our entire office with products from here. The conference table and ergonomic chairs are top-notch. Our team loves the new setup!',
                'rating' => 5,
                'image' => 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80',
                'order' => 2,
            ],
            [
                'name' => 'Emily Williams',
                'role' => 'Homeowner',
                'review' => 'The leather sofa exceeded my expectations. It\'s comfortable, looks premium, and was delivered right on time. Highly recommend!',
                'rating' => 5,
                'image' => 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&q=80',
                'order' => 3,
            ],
            [
                'name' => 'David Rahman',
                'role' => 'Architect',
                'review' => 'Great selection of modern furniture. The dining table set we bought is exactly what we were looking for. Quality craftsmanship!',
                'rating' => 4,
                'image' => 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80',
                'order' => 4,
            ],
            [
                'name' => 'Fatima Ahmed',
                'role' => 'CEO, Tech Startup',
                'review' => 'Furnished our new office space completely from this store. The team was helpful in selecting the right pieces. Everything arrived in perfect condition.',
                'rating' => 5,
                'image' => 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&q=80',
                'order' => 5,
            ],
            [
                'name' => 'James Thompson',
                'role' => 'Real Estate Developer',
                'review' => 'Premium quality at reasonable prices. The bedroom furniture collection is stunning. Will definitely be a returning customer.',
                'rating' => 5,
                'image' => 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&q=80',
                'order' => 6,
            ],
        ];

        foreach ($customerReviews as $reviewData) {
            CustomerReview::updateOrCreate(
                ['name' => $reviewData['name'], 'review' => $reviewData['review']],
                array_merge($reviewData, ['is_active' => true])
            );
        }

        // Seed trusted companies with local images (downloaded from Clearbit)
        // All logos are stored locally in public/company folder
        $companies = [
            // Row 1 - Local images
            ['name' => 'Prothom Alo', 'logo_url' => '/company/prothomalo.png', 'website' => 'https://prothomalo.com', 'order' => 1],
            ['name' => 'City Bank', 'logo_url' => '/company/citybank.png', 'website' => 'https://thecitybank.com', 'order' => 2],
            ['name' => 'Pizza Hut', 'logo_url' => '/company/pizzahut.png', 'website' => 'https://pizzahut.com', 'order' => 3],
            ['name' => 'SSG', 'logo_url' => '/company/ssg.png', 'website' => 'https://ssg.com.bd', 'order' => 4],
            ['name' => 'bKash', 'logo_url' => '/company/bkash.png', 'website' => 'https://bkash.com', 'order' => 5],
            ['name' => 'Grameenphone', 'logo_url' => '/company/grameenphone.png', 'website' => 'https://grameenphone.com', 'order' => 6],
            ['name' => 'KFC', 'logo_url' => '/company/kfc.png', 'website' => 'https://kfc.com', 'order' => 7],
            ['name' => 'Herfy', 'logo_url' => '/company/herfy.png', 'website' => 'https://herfy.com', 'order' => 8],
            // Row 2
            ['name' => 'BUET', 'logo_url' => '/company/buet.png', 'website' => 'https://buet.ac.bd', 'order' => 9],
            ['name' => 'Robi', 'logo_url' => '/company/robi.png', 'website' => 'https://robi.com.bd', 'order' => 10],
            ['name' => 'Banglalink', 'logo_url' => '/company/banglalink.png', 'website' => 'https://banglalink.net', 'order' => 11],
            ['name' => 'Nagad', 'logo_url' => '/company/nagad.png', 'website' => 'https://nagad.com.bd', 'order' => 12],
            ['name' => 'Pathao', 'logo_url' => '/company/pathao.png', 'website' => 'https://pathao.com', 'order' => 13],
            ['name' => 'Ansar VDP', 'logo_url' => '/company/ansar.png', 'website' => 'https://ansarvdp.gov.bd', 'order' => 14],
            ['name' => 'Truck Lagbe', 'logo_url' => '/company/trucklagbe.png', 'website' => 'https://trucklagbe.com', 'order' => 15],
            ['name' => 'Adfinix', 'logo_url' => '/company/adfinix.png', 'website' => 'https://adfinix.com', 'order' => 16],
            // Row 3
            ['name' => 'Precision', 'logo_url' => '/company/precision.png', 'website' => 'https://precision.com.bd', 'order' => 17],
            ['name' => 'Excel', 'logo_url' => '/company/excel.png', 'website' => 'https://excelbd.com', 'order' => 18],
            ['name' => 'Link3', 'logo_url' => '/company/link3.png', 'website' => 'https://link3.net', 'order' => 19],
            ['name' => 'Gadget & Gear', 'logo_url' => '/company/gadgetgear.png', 'website' => 'https://gadgetandgear.com', 'order' => 20],
            ['name' => 'DBBL', 'logo_url' => '/company/dbbl.png', 'website' => 'https://dutchbanglabank.com', 'order' => 21],
            ['name' => 'Arrow', 'logo_url' => '/company/arrow.png', 'website' => 'https://arrow.com', 'order' => 22],
            ['name' => 'Uber', 'logo_url' => '/company/uber.png', 'website' => 'https://uber.com', 'order' => 23],
            ['name' => 'Shombhob', 'logo_url' => '/company/shombhob.png', 'website' => 'https://shombhob.com', 'order' => 24],
            // Row 4
            ['name' => 'Daraz', 'logo_url' => '/company/daraz.png', 'website' => 'https://daraz.com.bd', 'order' => 25],
            ['name' => 'Foodpanda', 'logo_url' => '/company/foodpanda.png', 'website' => 'https://foodpanda.com.bd', 'order' => 26],
            ['name' => 'Decathlon', 'logo_url' => '/company/decathlon.png', 'website' => 'https://decathlon.com', 'order' => 27],
            ['name' => 'Divine IT', 'logo_url' => '/company/divineit.png', 'website' => 'https://divineit.com', 'order' => 28],
            ['name' => 'Tecno', 'logo_url' => '/company/tecno.png', 'website' => 'https://tecno-mobile.com', 'order' => 29],
            ['name' => 'Shohoz', 'logo_url' => '/company/shohoz.png', 'website' => 'https://shohoz.com', 'order' => 30],
            ['name' => 'Banoful', 'logo_url' => '/company/banoful.png', 'website' => 'https://banoful.com', 'order' => 31],
            ['name' => 'Square', 'logo_url' => '/company/square.png', 'website' => 'https://squaregroup.com', 'order' => 32],
        ];

        foreach ($companies as $company) {
            TrustedCompany::updateOrCreate(
                ['name' => $company['name']],
                array_merge($company, ['is_active' => true])
            );
        }

        // Seed feature cards
        $features = [
            [
                'title' => 'Free Shipping',
                'description' => 'Free shipping on all orders over ৳5,000',
                'icon' => 'truck',
                'order' => 1,
            ],
            [
                'title' => 'Quality Products',
                'description' => 'Premium quality furniture with warranty',
                'icon' => 'shield-check',
                'order' => 2,
            ],
            [
                'title' => 'Easy Returns',
                'description' => '30-day hassle-free return policy',
                'icon' => 'refresh-cw',
                'order' => 3,
            ],
            [
                'title' => '24/7 Support',
                'description' => 'Round the clock customer support',
                'icon' => 'headphones',
                'order' => 4,
            ],
        ];

        foreach ($features as $feature) {
            FeatureCard::firstOrCreate(
                ['title' => $feature['title']],
                array_merge($feature, ['is_active' => true])
            );
        }

        // Seed site settings
        $settings = [
            ['key' => 'site_name', 'value' => 'Furniture', 'group' => 'general'],
            ['key' => 'site_tagline', 'value' => 'Quality Furniture for Modern Living', 'group' => 'general'],
            ['key' => 'site_description', 'value' => 'Premium quality furniture for your home and office. We bring comfort and style to your living spaces.', 'group' => 'general'],
            ['key' => 'email', 'value' => 'contact@furniture.com', 'group' => 'contact'],
            ['key' => 'phone', 'value' => '+880 1234 567890', 'group' => 'contact'],
            ['key' => 'address', 'value' => '123 Furniture Street, Dhaka, Bangladesh', 'group' => 'contact'],
            ['key' => 'facebook', 'value' => 'https://facebook.com/furniture', 'group' => 'social'],
            ['key' => 'instagram', 'value' => 'https://instagram.com/furniture', 'group' => 'social'],
            ['key' => 'twitter', 'value' => 'https://twitter.com/furniture', 'group' => 'social'],
            ['key' => 'youtube', 'value' => 'https://youtube.com/furniture', 'group' => 'social'],
            // Header settings
            ['key' => 'header_announcement', 'value' => '🎉 Free shipping on orders over ৳5,000! Shop Now', 'group' => 'header'],
            ['key' => 'header_announcement_enabled', 'value' => '1', 'group' => 'header'],
            ['key' => 'header_phone', 'value' => '+880 1234 567890', 'group' => 'header'],
            ['key' => 'header_email', 'value' => 'info@furniture.com', 'group' => 'header'],
            // Homepage settings
            ['key' => 'new_arrivals_title', 'value' => 'New Arrivals', 'group' => 'homepage'],
            ['key' => 'new_arrivals_subtitle', 'value' => 'Check out our latest furniture collection', 'group' => 'homepage'],
            ['key' => 'collection_title', 'value' => 'Our Collections', 'group' => 'homepage'],
            ['key' => 'collection_subtitle', 'value' => 'Browse furniture by category', 'group' => 'homepage'],
            ['key' => 'best_sellers_title', 'value' => 'Best Sellers', 'group' => 'homepage'],
            ['key' => 'best_sellers_subtitle', 'value' => 'Our most popular products loved by customers', 'group' => 'homepage'],
            ['key' => 'featured_products_title', 'value' => 'Featured Products', 'group' => 'homepage'],
            ['key' => 'featured_products_subtitle', 'value' => 'Handpicked furniture for your home', 'group' => 'homepage'],
            ['key' => 'customer_reviews_title', 'value' => 'Customer Reviews', 'group' => 'homepage'],
            ['key' => 'customer_reviews_description', 'value' => 'Real feedback from our valued customers who have experienced our products and services.', 'group' => 'homepage'],
            ['key' => 'trusted_companies_title', 'value' => 'Trusted by Leading Companies', 'group' => 'homepage'],
            // Footer settings - section titles
            ['key' => 'text', 'value' => 'Your trusted source for quality furniture. We offer a wide range of modern and classic furniture for every room in your home.', 'group' => 'footer'],
            ['key' => 'follow_us_title', 'value' => 'Follow Us', 'group' => 'footer'],
            ['key' => 'quick_links_title', 'value' => 'Quick Links', 'group' => 'footer'],
            ['key' => 'customer_service_title', 'value' => 'Customer Service', 'group' => 'footer'],
            ['key' => 'information_title', 'value' => 'Information', 'group' => 'footer'],
            ['key' => 'payment_title', 'value' => 'Secure Payment Methods', 'group' => 'footer'],
            // Footer quick links
            ['key' => 'link_home', 'value' => 'Home', 'group' => 'footer'],
            ['key' => 'link_products', 'value' => 'All Products', 'group' => 'footer'],
            ['key' => 'link_categories', 'value' => 'Categories', 'group' => 'footer'],
            ['key' => 'link_about', 'value' => 'About Us', 'group' => 'footer'],
            ['key' => 'link_contact', 'value' => 'Contact Us', 'group' => 'footer'],
            // Footer customer service links
            ['key' => 'link_account', 'value' => 'My Account', 'group' => 'footer'],
            ['key' => 'link_order_tracking', 'value' => 'Order Tracking', 'group' => 'footer'],
            ['key' => 'link_wishlist', 'value' => 'Wishlist', 'group' => 'footer'],
            ['key' => 'link_shipping', 'value' => 'Shipping Policy', 'group' => 'footer'],
            ['key' => 'link_returns', 'value' => 'Returns & Exchanges', 'group' => 'footer'],
            ['key' => 'link_faqs', 'value' => 'FAQs', 'group' => 'footer'],
            // Footer information links
            ['key' => 'link_privacy', 'value' => 'Privacy Policy', 'group' => 'footer'],
            ['key' => 'link_terms', 'value' => 'Terms & Conditions', 'group' => 'footer'],
            ['key' => 'link_warranty', 'value' => 'Warranty Information', 'group' => 'footer'],
            ['key' => 'link_care', 'value' => 'Care & Maintenance', 'group' => 'footer'],
            ['key' => 'link_stores', 'value' => 'Store Locator', 'group' => 'footer'],
            ['key' => 'copyright_text', 'value' => '', 'group' => 'footer'],
            // Labels for products
            ['key' => 'badge_new', 'value' => 'New', 'group' => 'labels'],
            ['key' => 'badge_sale', 'value' => 'Sale', 'group' => 'labels'],
            ['key' => 'badge_best_seller', 'value' => 'Best Seller', 'group' => 'labels'],
            ['key' => 'badge_featured', 'value' => 'Featured', 'group' => 'labels'],
            ['key' => 'quick_add_button', 'value' => 'Quick Add', 'group' => 'labels'],
            ['key' => 'add_to_cart_button', 'value' => 'Add to Cart', 'group' => 'labels'],
            ['key' => 'view_details_button', 'value' => 'View Details', 'group' => 'labels'],
            ['key' => 'shop_now_button', 'value' => 'Shop Now', 'group' => 'labels'],
            ['key' => 'no_image_placeholder', 'value' => 'No Image', 'group' => 'labels'],
            ['key' => 'dimensions_label', 'value' => 'Dimensions', 'group' => 'labels'],
            // About page settings
            ['key' => 'about_hero_title', 'value' => 'Crafting Quality Furniture Since 2014', 'group' => 'about'],
            ['key' => 'about_hero_description', 'value' => 'Furniture is Bangladesh\'s leading furniture brand, dedicated to creating beautiful, functional, and affordable furniture for homes and offices. Our journey began with a simple mission: to bring world-class furniture design to every Bangladeshi home.', 'group' => 'about'],
            ['key' => 'about_story_title', 'value' => 'Our Story', 'group' => 'about'],
            ['key' => 'about_values_title', 'value' => 'Our Values', 'group' => 'about'],
            ['key' => 'about_values_subtitle', 'value' => 'These core values guide everything we do and help us deliver the best to our customers.', 'group' => 'about'],
            ['key' => 'about_team_title', 'value' => 'Meet Our Team', 'group' => 'about'],
            ['key' => 'about_team_subtitle', 'value' => 'The passionate people behind our success.', 'group' => 'about'],
            ['key' => 'about_stats_years', 'value' => '10+', 'group' => 'about'],
            ['key' => 'about_stats_customers', 'value' => '50,000+', 'group' => 'about'],
            ['key' => 'about_stats_products', 'value' => '100,000+', 'group' => 'about'],
            ['key' => 'about_stats_cities', 'value' => '64', 'group' => 'about'],
            // Contact page settings
            ['key' => 'contact_page_title', 'value' => 'Get in Touch', 'group' => 'contact'],
            ['key' => 'contact_page_subtitle', 'value' => 'Have questions about our furniture? Need help with your order? We\'re here to help! Reach out to us through any of the channels below.', 'group' => 'contact'],
            ['key' => 'contact_form_title', 'value' => 'Send us a Message', 'group' => 'contact'],
            ['key' => 'contact_form_subtitle', 'value' => 'Fill out the form below and we\'ll get back to you as soon as possible.', 'group' => 'contact'],
            ['key' => 'contact_hours_weekday', 'value' => 'Saturday - Thursday: 10AM - 8PM', 'group' => 'contact'],
            ['key' => 'contact_hours_weekend', 'value' => 'Friday: Closed', 'group' => 'contact'],
            // Cart page settings
            ['key' => 'cart_page_title', 'value' => 'Shopping Cart', 'group' => 'cart'],
            ['key' => 'cart_empty_title', 'value' => 'Your cart is empty', 'group' => 'cart'],
            ['key' => 'cart_empty_message', 'value' => 'Start shopping and add some products to your cart!', 'group' => 'cart'],
            ['key' => 'cart_summary_title', 'value' => 'Order Summary', 'group' => 'cart'],
            ['key' => 'cart_checkout_button', 'value' => 'Proceed to Checkout', 'group' => 'cart'],
            ['key' => 'cart_continue_shopping', 'value' => 'Continue Shopping', 'group' => 'cart'],
            // Checkout page settings
            ['key' => 'checkout_page_title', 'value' => 'Checkout', 'group' => 'checkout'],
            ['key' => 'checkout_shipping_title', 'value' => 'Shipping Information', 'group' => 'checkout'],
            ['key' => 'checkout_payment_title', 'value' => 'Payment Method', 'group' => 'checkout'],
            ['key' => 'checkout_order_summary_title', 'value' => 'Order Summary', 'group' => 'checkout'],
            ['key' => 'checkout_place_order_button', 'value' => 'Place Order', 'group' => 'checkout'],
            // Customer reviews subtitle
            ['key' => 'customer_reviews_subtitle', 'value' => 'Real feedback from our valued customers', 'group' => 'homepage'],
        ];

        foreach ($settings as $setting) {
            SiteSetting::firstOrCreate(
                ['key' => $setting['key']],
                array_merge($setting, ['type' => 'text'])
            );
        }

        // Seed FAQ categories and FAQs (admin-editable, page_slug aware)
        $faqCategories = [
            [
                'name' => 'Orders & Shipping',
                'icon' => 'Truck',
                'page_slug' => 'faqs',
                'is_active' => true,
                'sort_order' => 1,
                'faqs' => [
                    ['question' => 'How long does shipping take?', 'answer' => 'Standard delivery takes 3-5 business days nationwide. Dhaka metro deliveries are often next-day.', 'sort_order' => 1],
                    ['question' => 'Do you offer cash on delivery?', 'answer' => 'Yes, we offer COD in most major cities. Online prepayment is required for custom items.', 'sort_order' => 2],
                    ['question' => 'Can I schedule delivery?', 'answer' => 'Yes. After checkout our team will contact you to confirm a preferred delivery window.', 'sort_order' => 3],
                ],
            ],
            [
                'name' => 'Returns & Warranty',
                'icon' => 'RefreshCw',
                'page_slug' => 'faqs',
                'is_active' => true,
                'sort_order' => 2,
                'faqs' => [
                    ['question' => 'What is your return policy?', 'answer' => 'We accept returns within 7 days for unused items in original packaging. Custom-made items are non-returnable.', 'sort_order' => 1],
                    ['question' => 'How do I request a warranty claim?', 'answer' => 'Email support with your order ID and photos. We cover manufacturing defects for 2 years.', 'sort_order' => 2],
                    ['question' => 'Is assembly covered?', 'answer' => 'Assembly is included in Dhaka metro. For other areas, we provide instructions and remote support.', 'sort_order' => 3],
                ],
            ],
        ];

        foreach ($faqCategories as $catData) {
            $faqs = $catData['faqs'];
            unset($catData['faqs']);

            $category = FaqCategory::updateOrCreate(
                ['name' => $catData['name'], 'page_slug' => $catData['page_slug']],
                $catData
            );

            foreach ($faqs as $faq) {
                Faq::updateOrCreate(
                    ['faq_category_id' => $category->id, 'question' => $faq['question']],
                    [
                        'faq_category_id' => $category->id,
                        'question' => $faq['question'],
                        'answer' => $faq['answer'],
                        'is_active' => true,
                        'sort_order' => $faq['sort_order'],
                    ]
                );
            }
        }

        // Seed sample orders with realistic Bangladesh data
        $this->seedOrders();
    }

    /**
     * Seed sample orders with realistic data
     */
    private function seedOrders(): void
    {
        // Only seed if no orders exist
        if (Order::count() > 0) {
            return;
        }

        $customers = [
            ['name' => 'Rafiqul Islam', 'email' => 'rafiq.islam@gmail.com', 'phone' => '+880 1712-345678', 'address' => 'House 45, Road 12, Dhanmondi, Dhaka 1209'],
            ['name' => 'Fatema Begum', 'email' => 'fatema.b@yahoo.com', 'phone' => '+880 1819-234567', 'address' => 'Apartment 8B, Green Valley, Gulshan 2, Dhaka 1212'],
            ['name' => 'Mohammad Hasan', 'email' => 'mhasan@outlook.com', 'phone' => '+880 1677-890123', 'address' => '78/A Mirpur Road, Lalmatia, Dhaka 1207'],
            ['name' => 'Nusrat Jahan', 'email' => 'nusrat.jahan@gmail.com', 'phone' => '+880 1912-456789', 'address' => 'Flat 4C, Tower 3, Bashundhara R/A, Dhaka 1229'],
            ['name' => 'Kamal Uddin', 'email' => 'kamal.uddin@gmail.com', 'phone' => '+880 1521-567890', 'address' => '23 Station Road, Uttara Sector 7, Dhaka 1230'],
            ['name' => 'Ayesha Rahman', 'email' => 'ayesha.r@hotmail.com', 'phone' => '+880 1865-678901', 'address' => 'House 12, Block F, Banani DOHS, Dhaka 1206'],
            ['name' => 'Tariqul Islam', 'email' => 'tariq.islam@gmail.com', 'phone' => '+880 1734-789012', 'address' => '56/2 Elephant Road, Dhaka 1205'],
            ['name' => 'Sumaiya Akter', 'email' => 'sumaiya.a@gmail.com', 'phone' => '+880 1945-890123', 'address' => 'Apartment 2A, Rose Garden, Mohammadpur, Dhaka 1207'],
            ['name' => 'Imran Ahmed', 'email' => 'imran.ahmed@yahoo.com', 'phone' => '+880 1612-901234', 'address' => '89 New Market Road, Azimpur, Dhaka 1205'],
            ['name' => 'Shamima Nasrin', 'email' => 'shamima.n@gmail.com', 'phone' => '+880 1778-012345', 'address' => 'House 34, Sector 11, Uttara, Dhaka 1230'],
            ['name' => 'Jahangir Alam', 'email' => 'jahangir@gmail.com', 'phone' => '+880 1856-123456', 'address' => 'Flat 6D, Navana Tower, Gulshan 1, Dhaka 1212'],
            ['name' => 'Rashida Khatun', 'email' => 'rashida.k@outlook.com', 'phone' => '+880 1923-234567', 'address' => '45/B Tejgaon Industrial Area, Dhaka 1208'],
            ['name' => 'Shafiqul Haque', 'email' => 'shafiq.haque@gmail.com', 'phone' => '+880 1567-345678', 'address' => 'House 78, Road 8, Banani, Dhaka 1213'],
            ['name' => 'Nazma Begum', 'email' => 'nazma.begum@yahoo.com', 'phone' => '+880 1889-456789', 'address' => 'Apartment 5A, Lake City, Khilkhet, Dhaka 1229'],
            ['name' => 'Abdul Karim', 'email' => 'abdul.karim@gmail.com', 'phone' => '+880 1745-567890', 'address' => '12/3 Mirpur 10, Dhaka 1216'],
        ];

        $statuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
        $paymentStatuses = ['pending', 'paid', 'failed'];
        $paymentMethods = ['bkash', 'nagad', 'rocket', 'cod'];

        // Get all products
        $products = Product::all();

        if ($products->isEmpty()) {
            return;
        }

        foreach ($customers as $index => $customer) {
            // Select random products for order (1-4 items)
            $orderProducts = $products->random(rand(1, min(4, $products->count())));
            
            $subtotal = 0;
            $orderItems = [];
            
            foreach ($orderProducts as $product) {
                $quantity = rand(1, 3);
                $price = $product->price;
                $subtotal += $price * $quantity;
                
                $orderItems[] = [
                    'product_id' => $product->id,
                    'name' => $product->name,
                    'price' => $price,
                    'quantity' => $quantity,
                    'image' => $product->images[0] ?? null,
                ];
            }

            $shippingAmount = $subtotal > 50000 ? 0 : 500; // Free shipping over 50,000 BDT
            $discountAmount = $subtotal > 100000 ? round($subtotal * 0.05) : 0; // 5% discount over 100,000 BDT
            $totalAmount = $subtotal - $discountAmount + $shippingAmount;

            // Determine realistic statuses
            $paymentMethod = $paymentMethods[array_rand($paymentMethods)];
            $status = $statuses[array_rand($statuses)];
            
            // COD orders can be pending payment even if delivered
            if ($paymentMethod === 'cod') {
                $paymentStatus = $status === 'delivered' ? 'paid' : 'pending';
            } else {
                // Digital payments - most should be paid
                $paymentStatus = in_array($status, ['cancelled']) ? 'failed' : ($status === 'pending' ? $paymentStatuses[array_rand(['pending', 'paid'])] : 'paid');
            }

            // Create order
            $order = Order::create([
                'order_number' => sprintf('ORD-%06d', $index + 1),
                'customer_name' => $customer['name'],
                'customer_email' => $customer['email'],
                'customer_phone' => $customer['phone'],
                'shipping_address' => $customer['address'],
                'subtotal' => $subtotal,
                'discount_amount' => $discountAmount,
                'shipping_amount' => $shippingAmount,
                'total_amount' => $totalAmount,
                'payment_method' => $paymentMethod,
                'payment_status' => $paymentStatus,
                'status' => $status,
                'notes' => rand(0, 1) ? 'Please call before delivery.' : null,
                'created_at' => now()->subDays(rand(0, 30)),
                'updated_at' => now()->subDays(rand(0, 10)),
            ]);

            // Create order items
            foreach ($orderItems as $item) {
                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $item['product_id'],
                    'name' => $item['name'],
                    'price' => $item['price'],
                    'quantity' => $item['quantity'],
                    'image' => $item['image'],
                ]);
            }
        }

        // Seed Pages and Page Content
        $this->call([
            PageSeeder::class,
            PageContentSeeder::class,
        ]);
    }
}
