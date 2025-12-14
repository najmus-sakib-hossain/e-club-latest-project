<?php

namespace Database\Seeders;

use App\Models\Page;
use Illuminate\Database\Seeder;

class PageSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $pages = [
            [
                'title' => 'Shipping Policy',
                'slug' => 'shipping',
                'content' => '<p>We deliver to all 64 districts of Bangladesh. Standard delivery takes 5-7 business days, while express delivery is available for 2-3 business days.</p><h2>Delivery Zones</h2><ul><li>Dhaka City: 3-5 days (৳300)</li><li>Dhaka Division: 5-7 days (৳500)</li><li>Other Divisions: 7-10 days (৳800)</li></ul><h2>Free Shipping</h2><p>Enjoy free standard shipping on all orders above ৳10,000.</p>',
                'meta_title' => 'Shipping Policy | Free Delivery on Orders Above ৳10,000',
                'meta_description' => 'Learn about our shipping options, delivery times, and policies. We deliver to all 64 districts of Bangladesh with free shipping on orders above ৳10,000.',
                'is_active' => true,
                'sort_order' => 1,
            ],
            [
                'title' => 'Returns & Exchanges',
                'slug' => 'returns',
                'content' => '<p>We want you to be completely satisfied with your purchase. If you\'re not happy, we offer hassle-free returns and exchanges.</p><h2>Return Policy</h2><ul><li>7-day return window for items in original condition</li><li>Manufacturing defects reported within 30 days qualify for full refund</li><li>Free pickup for defective or damaged items</li></ul><h2>Non-Returnable Items</h2><ul><li>Custom-made or personalized furniture</li><li>Items with signs of use or damage</li><li>Clearance or final sale items</li></ul>',
                'meta_title' => 'Returns & Exchanges Policy | 7-Day Easy Returns',
                'meta_description' => 'Our hassle-free return policy offers 7-day returns for items in original condition. Free pickup available for defective items.',
                'is_active' => true,
                'sort_order' => 2,
            ],
            [
                'title' => 'FAQs',
                'slug' => 'faqs',
                'content' => '<p>Find answers to frequently asked questions about our products, services, and policies.</p>',
                'meta_title' => 'Frequently Asked Questions | Furniture Store Help',
                'meta_description' => 'Get answers to common questions about orders, shipping, returns, warranty, and more.',
                'is_active' => true,
                'sort_order' => 3,
            ],
            [
                'title' => 'Privacy Policy',
                'slug' => 'privacy',
                'content' => '<p>Your privacy is important to us. This policy explains how we collect, use, and protect your personal information.</p><h2>Information We Collect</h2><p>We collect information you provide during checkout, account creation, and when contacting us.</p><h2>How We Use Your Information</h2><p>Your information is used to process orders, provide customer service, and improve our services.</p>',
                'meta_title' => 'Privacy Policy | Your Data Protection',
                'meta_description' => 'Learn how we collect, use, and protect your personal information. Your privacy is our priority.',
                'is_active' => true,
                'sort_order' => 4,
            ],
            [
                'title' => 'Terms & Conditions',
                'slug' => 'terms',
                'content' => '<p>By using our website and services, you agree to these terms and conditions.</p><h2>Orders</h2><p>All orders are subject to acceptance and availability. We reserve the right to refuse or cancel orders.</p><h2>Pricing</h2><p>All prices are in Bangladeshi Taka (BDT) and include VAT.</p>',
                'meta_title' => 'Terms & Conditions | Website Usage Agreement',
                'meta_description' => 'Read our terms and conditions for using our website and purchasing products.',
                'is_active' => true,
                'sort_order' => 5,
            ],
            [
                'title' => 'Warranty Information',
                'slug' => 'warranty',
                'content' => '<p>All our furniture comes with comprehensive warranty coverage.</p><h2>Standard Warranty</h2><p>2-year warranty on all furniture covering manufacturing defects.</p><h2>Premium Warranty</h2><p>5-year extended warranty on premium collections.</p><h2>What\'s Covered</h2><ul><li>Manufacturing defects</li><li>Structural failures</li><li>Hardware malfunctions</li></ul>',
                'meta_title' => 'Warranty Information | 2-Year Coverage',
                'meta_description' => 'All furniture includes 2-year warranty against manufacturing defects. Premium collections have 5-year extended warranty.',
                'is_active' => true,
                'sort_order' => 6,
            ],
            [
                'title' => 'Care & Maintenance',
                'slug' => 'care',
                'content' => '<p>Proper care extends the life and beauty of your furniture.</p><h2>Wood Furniture</h2><ul><li>Dust regularly with soft cloth</li><li>Avoid direct sunlight</li><li>Use coasters for drinks</li></ul><h2>Upholstery</h2><ul><li>Vacuum regularly</li><li>Rotate cushions monthly</li><li>Clean spills immediately</li></ul>',
                'meta_title' => 'Furniture Care & Maintenance Guide',
                'meta_description' => 'Expert tips to keep your furniture looking its best. Learn how to care for wood, upholstery, and leather.',
                'is_active' => true,
                'sort_order' => 7,
            ],
            [
                'title' => 'Store Locator',
                'slug' => 'stores',
                'content' => '<p>Visit one of our showrooms to experience our furniture in person.</p><h2>Dhaka Showrooms</h2><p>Dhanmondi, Gulshan, Uttara, Mirpur</p><h2>Regional Showrooms</h2><p>Chittagong, Sylhet</p>',
                'meta_title' => 'Store Locator | Find a Showroom Near You',
                'meta_description' => 'Find our furniture showrooms across Bangladesh. Visit us in Dhaka, Chittagong, Sylhet, and more.',
                'is_active' => true,
                'sort_order' => 8,
            ],
        ];

        foreach ($pages as $page) {
            Page::updateOrCreate(
                ['slug' => $page['slug']],
                $page
            );
        }
    }
}
