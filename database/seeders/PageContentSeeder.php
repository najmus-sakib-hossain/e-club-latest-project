<?php

namespace Database\Seeders;

use App\Models\PageContent;
use Illuminate\Database\Seeder;

class PageContentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Shipping Page Content
        $this->seedShippingContent();
        
        // Returns Page Content
        $this->seedReturnsContent();
        
        // Warranty Page Content
        $this->seedWarrantyContent();
        
        // Care Page Content
        $this->seedCareContent();
        
        // Terms Page Content
        $this->seedTermsContent();
        
        // Privacy Page Content
        $this->seedPrivacyContent();
    }

    private function seedShippingContent(): void
    {
        PageContent::updateOrCreate(
            ['page_slug' => 'shipping', 'section_key' => 'hero'],
            [
                'title' => 'Shipping & Delivery',
                'subtitle' => 'We deliver to all 64 districts of Bangladesh. Learn about our shipping options, delivery times, and policies.',
                'is_active' => true,
                'sort_order' => 1,
            ]
        );

        PageContent::updateOrCreate(
            ['page_slug' => 'shipping', 'section_key' => 'shipping_methods'],
            [
                'title' => 'Shipping Methods',
                'items' => [
                    ['icon' => 'truck', 'title' => 'Standard Delivery', 'description' => 'Free for orders over ৳10,000', 'time' => '5-7 business days', 'price' => '৳500'],
                    ['icon' => 'clock', 'title' => 'Express Delivery', 'description' => 'Priority handling and delivery', 'time' => '2-3 business days', 'price' => '৳1,000'],
                    ['icon' => 'map-pin', 'title' => 'Showroom Pickup', 'description' => 'Pick up from our showroom', 'time' => 'Same day', 'price' => 'Free'],
                ],
                'is_active' => true,
                'sort_order' => 2,
            ]
        );

        PageContent::updateOrCreate(
            ['page_slug' => 'shipping', 'section_key' => 'zones'],
            [
                'title' => 'Delivery Zones & Times',
                'items' => [
                    ['zone' => 'Dhaka City', 'standard' => '3-5 days', 'express' => '1-2 days', 'price' => '৳300'],
                    ['zone' => 'Dhaka Division', 'standard' => '5-7 days', 'express' => '2-3 days', 'price' => '৳500'],
                    ['zone' => 'Chittagong Division', 'standard' => '5-7 days', 'express' => '3-4 days', 'price' => '৳700'],
                    ['zone' => 'Other Divisions', 'standard' => '7-10 days', 'express' => '4-5 days', 'price' => '৳800'],
                ],
                'is_active' => true,
                'sort_order' => 3,
            ]
        );

        PageContent::updateOrCreate(
            ['page_slug' => 'shipping', 'section_key' => 'faqs'],
            [
                'title' => 'Frequently Asked Questions',
                'items' => [
                    ['question' => 'How do I track my order?', 'answer' => 'Once your order is shipped, you will receive an email with a tracking number. You can use this number on our website or contact our customer service to track your delivery.'],
                    ['question' => 'Do you deliver to all areas of Bangladesh?', 'answer' => 'Yes, we deliver to all 64 districts of Bangladesh. Delivery times and charges may vary based on your location.'],
                    ['question' => 'What if I am not home during delivery?', 'answer' => 'Our delivery team will contact you before delivery. If you are not available, we can reschedule the delivery at no additional cost.'],
                    ['question' => 'Is assembly included with delivery?', 'answer' => 'Yes, free assembly is included with all e-club deliveries. Our trained technicians will assemble your e-club at your location.'],
                    ['question' => 'What happens if my e-club is damaged during delivery?', 'answer' => 'All deliveries are inspected before handover. If any damage is found, we will replace the item free of charge. Please report any issues within 24 hours of delivery.'],
                ],
                'is_active' => true,
                'sort_order' => 4,
            ]
        );
    }

    private function seedReturnsContent(): void
    {
        PageContent::updateOrCreate(
            ['page_slug' => 'returns', 'section_key' => 'hero'],
            [
                'title' => 'Returns & Exchanges',
                'subtitle' => "We want you to be completely satisfied with your purchase. If you're not happy, we offer hassle-free returns and exchanges.",
                'is_active' => true,
                'sort_order' => 1,
            ]
        );

        PageContent::updateOrCreate(
            ['page_slug' => 'returns', 'section_key' => 'return_steps'],
            [
                'title' => 'How to Return an Item',
                'items' => [
                    ['step' => 1, 'title' => 'Initiate Return', 'description' => 'Contact our customer service or log into your account to initiate a return request.'],
                    ['step' => 2, 'title' => 'Get Approval', 'description' => 'Our team will review your request and approve it within 24 hours.'],
                    ['step' => 3, 'title' => 'Schedule Pickup', 'description' => 'Once approved, we will schedule a pickup from your location.'],
                    ['step' => 4, 'title' => 'Quality Check', 'description' => 'Item will be inspected at our facility to ensure it meets return criteria.'],
                    ['step' => 5, 'title' => 'Refund/Exchange', 'description' => 'Refund processed within 7 business days or exchange shipped immediately.'],
                ],
                'is_active' => true,
                'sort_order' => 2,
            ]
        );

        PageContent::updateOrCreate(
            ['page_slug' => 'returns', 'section_key' => 'eligible'],
            [
                'title' => 'Eligible for Return',
                'items' => [
                    ['text' => 'Items in original, unused condition'],
                    ['text' => 'Items with all original tags and packaging'],
                    ['text' => 'Items returned within 7 days of delivery'],
                    ['text' => 'Manufacturing defects found within 30 days'],
                    ['text' => 'Damaged items reported within 24 hours of delivery'],
                ],
                'is_active' => true,
                'sort_order' => 3,
            ]
        );

        PageContent::updateOrCreate(
            ['page_slug' => 'returns', 'section_key' => 'not_eligible'],
            [
                'title' => 'Not Eligible',
                'items' => [
                    ['text' => 'Custom-made or personalized e-club'],
                    ['text' => 'Items with signs of use, damage, or wear'],
                    ['text' => 'Items without original packaging or tags'],
                    ['text' => 'Items returned after 7 days without valid reason'],
                    ['text' => 'Clearance or final sale items'],
                    ['text' => 'Items damaged by customer misuse'],
                ],
                'is_active' => true,
                'sort_order' => 4,
            ]
        );

        PageContent::updateOrCreate(
            ['page_slug' => 'returns', 'section_key' => 'faqs'],
            [
                'title' => 'Frequently Asked Questions',
                'items' => [
                    ['question' => 'How long do I have to return an item?', 'answer' => 'You have 7 days from the date of delivery to initiate a return request. For manufacturing defects, you have 30 days.'],
                    ['question' => 'Is return shipping free?', 'answer' => 'Yes, return shipping is free for defective items or items damaged during delivery. For change-of-mind returns, a pickup fee of ৳500 applies.'],
                    ['question' => 'How will I receive my refund?', 'answer' => 'Refunds are processed to your original payment method within 7 business days after the returned item passes quality inspection.'],
                    ['question' => 'Can I exchange for a different product?', 'answer' => 'Yes, you can exchange for a different product of equal or greater value. If the new product costs more, you can pay the difference.'],
                    ['question' => 'What if I received a damaged item?', 'answer' => 'Please report any damage within 24 hours of delivery with photos. We will arrange a free pickup and send a replacement immediately.'],
                    ['question' => 'Can I return items bought on sale?', 'answer' => 'Items purchased on regular sale can be returned. However, clearance items marked as "Final Sale" cannot be returned.'],
                ],
                'is_active' => true,
                'sort_order' => 5,
            ]
        );
    }

    private function seedWarrantyContent(): void
    {
        PageContent::updateOrCreate(
            ['page_slug' => 'warranty', 'section_key' => 'hero'],
            [
                'title' => 'Warranty Information',
                'subtitle' => 'We stand behind the quality of our e-club. Learn about our comprehensive warranty coverage and how to make a claim.',
                'is_active' => true,
                'sort_order' => 1,
            ]
        );

        PageContent::updateOrCreate(
            ['page_slug' => 'warranty', 'section_key' => 'warranty_tiers'],
            [
                'title' => 'Our Warranty Coverage',
                'items' => [
                    ['title' => 'Standard Warranty', 'duration' => '2 Years', 'description' => 'Included with all e-club purchases', 'color' => 'bg-blue-50 border-blue-200', 'iconColor' => 'text-blue-600'],
                    ['title' => 'Premium Warranty', 'duration' => '5 Years', 'description' => 'For premium and signature collections', 'color' => 'bg-purple-50 border-purple-200', 'iconColor' => 'text-purple-600'],
                    ['title' => 'Lifetime Frame Warranty', 'duration' => 'Lifetime', 'description' => 'On solid wood frames for select sofas', 'color' => 'bg-green-50 border-green-200', 'iconColor' => 'text-green-600'],
                ],
                'is_active' => true,
                'sort_order' => 2,
            ]
        );

        PageContent::updateOrCreate(
            ['page_slug' => 'warranty', 'section_key' => 'covered'],
            [
                'title' => 'Covered by Warranty',
                'items' => [
                    ['text' => 'Manufacturing defects in materials or workmanship'],
                    ['text' => 'Structural failures under normal use'],
                    ['text' => 'Hardware malfunctions (hinges, handles, locks)'],
                    ['text' => 'Frame breakage or warping'],
                    ['text' => 'Drawer mechanism failures'],
                    ['text' => 'Reclining mechanism defects'],
                    ['text' => 'Spring failures in mattresses and cushions'],
                    ['text' => 'Peeling or bubbling of laminate surfaces'],
                ],
                'is_active' => true,
                'sort_order' => 3,
            ]
        );

        PageContent::updateOrCreate(
            ['page_slug' => 'warranty', 'section_key' => 'not_covered'],
            [
                'title' => 'Not Covered',
                'items' => [
                    ['text' => 'Normal wear and tear'],
                    ['text' => 'Damage caused by misuse, abuse, or accidents'],
                    ['text' => 'Damage from exposure to extreme temperatures or humidity'],
                    ['text' => 'Stains, scratches, or cosmetic damage'],
                    ['text' => 'Fading due to sunlight exposure'],
                    ['text' => 'Damage from improper cleaning or chemicals'],
                    ['text' => 'Damage during customer-arranged transportation'],
                    ['text' => 'Products modified or repaired by unauthorized parties'],
                    ['text' => 'Commercial or rental use of residential products'],
                ],
                'is_active' => true,
                'sort_order' => 4,
            ]
        );

        PageContent::updateOrCreate(
            ['page_slug' => 'warranty', 'section_key' => 'claim_process'],
            [
                'title' => 'How to Make a Warranty Claim',
                'items' => [
                    ['step' => 1, 'title' => 'Gather Information', 'description' => 'Collect your order number, purchase date, and photos of the defect.'],
                    ['step' => 2, 'title' => 'Contact Us', 'description' => 'Reach out via phone, email, or through your online account.'],
                    ['step' => 3, 'title' => 'Submit Claim', 'description' => 'Provide details and photos for our warranty team to review.'],
                    ['step' => 4, 'title' => 'Assessment', 'description' => 'Our team will review your claim within 3-5 business days.'],
                    ['step' => 5, 'title' => 'Resolution', 'description' => 'We will repair, replace, or refund based on the assessment.'],
                ],
                'is_active' => true,
                'sort_order' => 5,
            ]
        );

        PageContent::updateOrCreate(
            ['page_slug' => 'warranty', 'section_key' => 'faqs'],
            [
                'title' => 'Frequently Asked Questions',
                'items' => [
                    ['question' => 'When does my warranty start?', 'answer' => 'Your warranty begins on the date of delivery to your address, not the date of purchase.'],
                    ['question' => 'Is the warranty transferable?', 'answer' => 'No, our warranty is valid only for the original purchaser and is not transferable to subsequent owners.'],
                    ['question' => 'Do I need to register my product for warranty?', 'answer' => 'Registration is not required but recommended. Registered products receive faster warranty service and exclusive offers.'],
                    ['question' => 'What proof do I need for a warranty claim?', 'answer' => 'You will need your order confirmation email or receipt showing the purchase date and product details.'],
                    ['question' => 'Will I get a replacement or repair?', 'answer' => 'We will first attempt to repair the product. If repair is not possible, we will provide a replacement or refund at our discretion.'],
                    ['question' => 'Is there any cost for warranty service?', 'answer' => 'Warranty repairs and replacements are free. However, if the issue is not covered by warranty, service charges may apply.'],
                ],
                'is_active' => true,
                'sort_order' => 6,
            ]
        );
    }

    private function seedCareContent(): void
    {
        PageContent::updateOrCreate(
            ['page_slug' => 'care', 'section_key' => 'hero'],
            [
                'title' => 'Care & Maintenance Guide',
                'subtitle' => 'Proper care extends the life and beauty of your e-club. Follow our expert tips to keep your e-club looking its best for years to come.',
                'is_active' => true,
                'sort_order' => 1,
            ]
        );

        PageContent::updateOrCreate(
            ['page_slug' => 'care', 'section_key' => 'general_tips'],
            [
                'title' => 'General Care Tips',
                'items' => [
                    ['icon' => 'sun', 'title' => 'Sunlight', 'tip' => 'Keep e-club away from direct sunlight to prevent fading and drying.'],
                    ['icon' => 'droplets', 'title' => 'Moisture', 'tip' => 'Wipe up spills immediately and avoid placing wet items on e-club.'],
                    ['icon' => 'wind', 'title' => 'Air Circulation', 'tip' => 'Ensure good air circulation to prevent mold and musty odors.'],
                    ['icon' => 'sparkles', 'title' => 'Regular Cleaning', 'tip' => 'Establish a regular cleaning routine to prevent buildup of dirt and dust.'],
                ],
                'is_active' => true,
                'sort_order' => 2,
            ]
        );

        PageContent::updateOrCreate(
            ['page_slug' => 'care', 'section_key' => 'care_categories'],
            [
                'title' => 'Care by E-Club Type',
                'items' => [
                    [
                        'id' => 'wood',
                        'icon' => 'tree-pine',
                        'title' => 'Wood E-Club',
                        'description' => 'Care tips for wooden tables, chairs, cabinets, and more',
                        'tips' => [
                            ['title' => 'Regular Dusting', 'description' => 'Dust weekly with a soft, lint-free cloth.'],
                            ['title' => 'Cleaning', 'description' => 'Use a slightly damp cloth with mild soap. Wipe dry immediately.'],
                            ['title' => 'Polishing', 'description' => 'Apply e-club polish or wax every 3-6 months.'],
                            ['title' => 'Avoid Direct Sunlight', 'description' => 'Position away from windows or use curtains.'],
                        ],
                    ],
                    [
                        'id' => 'upholstery',
                        'icon' => 'sofa',
                        'title' => 'Upholstered E-Club',
                        'description' => 'Maintain sofas, chairs, and fabric-covered pieces',
                        'tips' => [
                            ['title' => 'Vacuum Regularly', 'description' => 'Vacuum weekly using upholstery attachment.'],
                            ['title' => 'Rotate Cushions', 'description' => 'Flip and rotate cushions monthly for even wear.'],
                            ['title' => 'Spot Cleaning', 'description' => 'Blot spills immediately with clean cloth.'],
                            ['title' => 'Professional Cleaning', 'description' => 'Have professionally cleaned every 12-18 months.'],
                        ],
                    ],
                    [
                        'id' => 'leather',
                        'icon' => 'armchair',
                        'title' => 'Leather E-Club',
                        'description' => 'Special care for leather sofas and chairs',
                        'tips' => [
                            ['title' => 'Dust Regularly', 'description' => 'Wipe with dry microfiber cloth weekly.'],
                            ['title' => 'Condition Leather', 'description' => 'Apply leather conditioner every 6-12 months.'],
                            ['title' => 'Clean Spills Quickly', 'description' => 'Blot spills immediately with absorbent cloth.'],
                            ['title' => 'No Direct Sunlight', 'description' => 'Leather can fade and dry out in sunlight.'],
                        ],
                    ],
                ],
                'is_active' => true,
                'sort_order' => 3,
            ]
        );

        PageContent::updateOrCreate(
            ['page_slug' => 'care', 'section_key' => 'dos'],
            [
                'title' => 'Do\'s',
                'items' => [
                    ['text' => 'Dust e-club regularly with a soft cloth'],
                    ['text' => 'Use coasters under drinks and hot dishes'],
                    ['text' => 'Clean spills immediately'],
                    ['text' => 'Use e-club pads under lamps and decorations'],
                    ['text' => 'Maintain proper humidity levels in your home'],
                    ['text' => 'Rotate cushions regularly for even wear'],
                ],
                'is_active' => true,
                'sort_order' => 4,
            ]
        );

        PageContent::updateOrCreate(
            ['page_slug' => 'care', 'section_key' => 'donts'],
            [
                'title' => 'Don\'ts',
                'items' => [
                    ['text' => 'Place e-club in direct sunlight'],
                    ['text' => 'Use harsh chemicals or abrasive cleaners'],
                    ['text' => 'Drag e-club across floors'],
                    ['text' => 'Place hot items directly on surfaces'],
                    ['text' => 'Sit on e-club arms or backs'],
                    ['text' => 'Allow pets with sharp claws on upholstery'],
                ],
                'is_active' => true,
                'sort_order' => 5,
            ]
        );
    }

    private function seedTermsContent(): void
    {
        PageContent::updateOrCreate(
            ['page_slug' => 'terms', 'section_key' => 'hero'],
            [
                'title' => 'Terms & Conditions',
                'subtitle' => 'December 1, 2025',
                'is_active' => true,
                'sort_order' => 1,
            ]
        );

        PageContent::updateOrCreate(
            ['page_slug' => 'terms', 'section_key' => 'content'],
            [
                'title' => 'Terms Content',
                'content' => null, // Use default hardcoded content
                'is_active' => true,
                'sort_order' => 2,
            ]
        );
    }

    private function seedPrivacyContent(): void
    {
        PageContent::updateOrCreate(
            ['page_slug' => 'privacy', 'section_key' => 'hero'],
            [
                'title' => 'Privacy Policy',
                'subtitle' => 'December 1, 2025',
                'is_active' => true,
                'sort_order' => 1,
            ]
        );

        PageContent::updateOrCreate(
            ['page_slug' => 'privacy', 'section_key' => 'content'],
            [
                'title' => 'Privacy Content',
                'content' => null, // Use default hardcoded content
                'is_active' => true,
                'sort_order' => 2,
            ]
        );
    }
}
