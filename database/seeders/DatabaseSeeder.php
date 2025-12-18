<?php

namespace Database\Seeders;

use App\Models\CustomerReview;
use App\Models\FeatureCard;
use App\Models\HeroSlide;
use App\Models\SiteSetting;
use App\Models\TrustedCompany;
use App\Models\User;
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
            ['email' => 'e-club@gmail.com'],
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

        // Seed E-Club specific data
        $this->call([
            NavigationMenuSeeder::class,
            FooterSeeder::class,
            HomePageSeeder::class,
            MembershipSeeder::class,
            CommitteeSeeder::class,
            EventsSeeder::class,
            MediaSeeder::class,
            MemberBenefitSeeder::class,
        ]);

        // Seed Hero Slides for E-Club
        $heroSlides = [
            [
                'title' => 'Empowering Entrepreneurs',
                'subtitle' => 'Join Bangladesh\'s leading entrepreneurship community',
                'button_text' => 'JOIN NOW',
                'button_link' => '/join',
                'image' => 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=1920&q=80',
                'background_color' => '#0e5843',
                'text_color' => '#ffffff',
                'sort_order' => 1,
            ],
            [
                'title' => 'Connect & Grow Together',
                'subtitle' => 'Network with successful business leaders and innovators',
                'button_text' => 'LEARN MORE',
                'button_link' => '/about',
                'image' => 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=1920&q=80',
                'background_color' => '#e63946',
                'text_color' => '#ffffff',
                'sort_order' => 2,
            ],
        ];

        foreach ($heroSlides as $slide) {
            HeroSlide::updateOrCreate(
                ['title' => $slide['title']],
                array_merge($slide, ['is_active' => true])
            );
        }

        // Seed Customer Reviews
        $customerReviews = [
            [
                'name' => 'Rafiq Ahmed',
                'role' => 'Young Entrepreneur',
                'review' => 'Joining E-Club was the best decision for my startup journey! The networking opportunities and mentorship programs helped me scale my business rapidly.',
                'rating' => 5,
                'image' => 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80',
                'order' => 1,
            ],
            [
                'name' => 'Nusrat Jahan',
                'role' => 'Business Owner',
                'review' => 'The community support and business workshops at E-Club have been invaluable. I\'ve grown my network and learned so much about entrepreneurship.',
                'rating' => 5,
                'image' => 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&q=80',
                'order' => 2,
            ],
            [
                'name' => 'Imran Khan',
                'role' => 'Startup Founder',
                'review' => 'E-Club events are fantastic! Met amazing co-founders, investors, and mentors who believed in my vision. Highly recommend to any aspiring entrepreneur.',
                'rating' => 5,
                'image' => 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&q=80',
                'order' => 3,
            ],
            [
                'name' => 'Ayesha Rahman',
                'role' => 'Tech Entrepreneur',
                'review' => 'The resources and guidance from E-Club helped me turn my idea into a successful tech company. The community is incredibly supportive!',
                'rating' => 5,
                'image' => 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&q=80',
                'order' => 4,
            ],
            [
                'name' => 'Fahim Hassan',
                'role' => 'Social Entrepreneur',
                'review' => 'E-Club provides an incredible platform for entrepreneurs to connect, learn, and grow together. The workshops and networking sessions are top-notch.',
                'rating' => 5,
                'image' => 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80',
                'order' => 5,
            ],
            [
                'name' => 'Sabrina Akter',
                'role' => 'E-commerce Founder',
                'review' => 'From pitch competitions to mentorship programs, E-Club has everything an entrepreneur needs. My business has grown 3x since joining!',
                'rating' => 5,
                'image' => 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80',
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
                'title' => 'Networking Events',
                'description' => 'Connect with fellow entrepreneurs and business leaders',
                'icon' => 'users',
                'order' => 1,
            ],
            [
                'title' => 'Expert Mentorship',
                'description' => 'Get guidance from successful entrepreneurs and industry experts',
                'icon' => 'user-check',
                'order' => 2,
            ],
            [
                'title' => 'Business Workshops',
                'description' => 'Learn through hands-on workshops and training sessions',
                'icon' => 'book-open',
                'order' => 3,
            ],
            [
                'title' => 'Community Support',
                'description' => 'Join a supportive community of like-minded entrepreneurs',
                'icon' => 'heart',
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
            ['key' => 'site_name', 'value' => 'E-Club', 'group' => 'general'],
            ['key' => 'site_tagline', 'value' => 'Empowering Entrepreneurs, Building Communities', 'group' => 'general'],
            ['key' => 'site_description', 'value' => 'E-Club is a vibrant community platform for entrepreneurs to connect, learn, and grow together. Join us to access networking events, mentorship programs, and business workshops.', 'group' => 'general'],
            ['key' => 'email', 'value' => 'contact@e-club.com', 'group' => 'contact'],
            ['key' => 'phone', 'value' => '+880 1234 567890', 'group' => 'contact'],
            ['key' => 'address', 'value' => '123 Entrepreneurship Hub, Dhaka, Bangladesh', 'group' => 'contact'],
            ['key' => 'facebook', 'value' => 'https://facebook.com/e-club', 'group' => 'social'],
            ['key' => 'instagram', 'value' => 'https://instagram.com/e-club', 'group' => 'social'],
            ['key' => 'twitter', 'value' => 'https://twitter.com/e-club', 'group' => 'social'],
            ['key' => 'youtube', 'value' => 'https://youtube.com/e-club', 'group' => 'social'],
            // Header settings
            ['key' => 'header_announcement', 'value' => '🎉 Join our next networking event - Register Now!', 'group' => 'header'],
            ['key' => 'header_announcement_enabled', 'value' => '1', 'group' => 'header'],
            ['key' => 'header_phone', 'value' => '+880 1234 567890', 'group' => 'header'],
            ['key' => 'header_email', 'value' => 'info@e-club.com', 'group' => 'header'],
            // Homepage settings
            ['key' => 'upcoming_events_title', 'value' => 'Upcoming Events', 'group' => 'homepage'],
            ['key' => 'upcoming_events_subtitle', 'value' => 'Join our latest networking events and workshops', 'group' => 'homepage'],
            ['key' => 'membership_types_title', 'value' => 'Membership Plans', 'group' => 'homepage'],
            ['key' => 'membership_types_subtitle', 'value' => 'Choose the membership that fits your needs', 'group' => 'homepage'],
            ['key' => 'customer_reviews_title', 'value' => 'Member Success Stories', 'group' => 'homepage'],
            ['key' => 'customer_reviews_description', 'value' => 'Real testimonials from our community members who have grown their businesses with E-Club.', 'group' => 'homepage'],
            ['key' => 'trusted_companies_title', 'value' => 'Our Partners & Sponsors', 'group' => 'homepage'],
            ['key' => 'customer_reviews_subtitle', 'value' => 'Hear from our successful members', 'group' => 'homepage'],
            // Footer settings
            ['key' => 'text', 'value' => 'E-Club is your trusted community for entrepreneurship and business growth. We connect, empower, and support entrepreneurs at every stage of their journey.', 'group' => 'footer'],
            ['key' => 'follow_us_title', 'value' => 'Follow Us', 'group' => 'footer'],
            ['key' => 'quick_links_title', 'value' => 'Quick Links', 'group' => 'footer'],
            ['key' => 'community_title', 'value' => 'Community', 'group' => 'footer'],
            ['key' => 'information_title', 'value' => 'Information', 'group' => 'footer'],
            // Footer quick links
            ['key' => 'link_home', 'value' => 'Home', 'group' => 'footer'],
            ['key' => 'link_about', 'value' => 'About Us', 'group' => 'footer'],
            ['key' => 'link_events', 'value' => 'Events', 'group' => 'footer'],
            ['key' => 'link_membership', 'value' => 'Membership', 'group' => 'footer'],
            ['key' => 'link_contact', 'value' => 'Contact Us', 'group' => 'footer'],
            // Footer community links
            ['key' => 'link_join', 'value' => 'Join E-Club', 'group' => 'footer'],
            ['key' => 'link_meetings', 'value' => 'Book a Meeting', 'group' => 'footer'],
            ['key' => 'link_success_stories', 'value' => 'Success Stories', 'group' => 'footer'],
            ['key' => 'link_partners', 'value' => 'Our Partners', 'group' => 'footer'],
            ['key' => 'link_faqs', 'value' => 'FAQs', 'group' => 'footer'],
            // Footer information links
            ['key' => 'link_privacy', 'value' => 'Privacy Policy', 'group' => 'footer'],
            ['key' => 'link_terms', 'value' => 'Terms & Conditions', 'group' => 'footer'],
            ['key' => 'copyright_text', 'value' => '', 'group' => 'footer'],
            // About page settings
            ['key' => 'about_hero_title', 'value' => 'Empowering Entrepreneurs Since 2014', 'group' => 'about'],
            ['key' => 'about_hero_description', 'value' => 'E-Club is Bangladesh\'s leading entrepreneurship community, dedicated to connecting, supporting, and empowering entrepreneurs. Our journey began with a simple mission: to create a thriving ecosystem where entrepreneurs can learn, grow, and succeed together.', 'group' => 'about'],
            ['key' => 'about_story_title', 'value' => 'Our Story', 'group' => 'about'],
            ['key' => 'about_values_title', 'value' => 'Our Values', 'group' => 'about'],
            ['key' => 'about_values_subtitle', 'value' => 'These core values guide everything we do and help us build a strong entrepreneurial community.', 'group' => 'about'],
            ['key' => 'about_team_title', 'value' => 'Meet Our Team', 'group' => 'about'],
            ['key' => 'about_team_subtitle', 'value' => 'The passionate people behind our community.', 'group' => 'about'],
            ['key' => 'about_stats_years', 'value' => '10+', 'group' => 'about'],
            ['key' => 'about_stats_members', 'value' => '5,000+', 'group' => 'about'],
            ['key' => 'about_stats_events', 'value' => '500+', 'group' => 'about'],
            ['key' => 'about_stats_partners', 'value' => '100+', 'group' => 'about'],
            // Contact page settings
            ['key' => 'contact_page_title', 'value' => 'Get in Touch', 'group' => 'contact'],
            ['key' => 'contact_page_subtitle', 'value' => 'Have questions about E-Club? Want to learn more about membership? We\'re here to help! Reach out to us through any of the channels below.', 'group' => 'contact'],
            ['key' => 'contact_form_title', 'value' => 'Send us a Message', 'group' => 'contact'],
            ['key' => 'contact_form_subtitle', 'value' => 'Fill out the form below and we\'ll get back to you as soon as possible.', 'group' => 'contact'],
            ['key' => 'contact_hours_weekday', 'value' => 'Saturday - Thursday: 10AM - 6PM', 'group' => 'contact'],
            ['key' => 'contact_hours_weekend', 'value' => 'Friday: Closed', 'group' => 'contact'],
        ];

        foreach ($settings as $setting) {
            SiteSetting::firstOrCreate(
                ['key' => $setting['key']],
                array_merge($setting, ['type' => 'text'])
            );
        }

        // Seed FAQ categories and FAQs
        $faqCategories = [
            [
                'name' => 'Membership',
                'icon' => 'Users',
                'page_slug' => 'faqs',
                'is_active' => true,
                'sort_order' => 1,
                'faqs' => [
                    ['question' => 'How do I become a member?', 'answer' => 'You can apply for membership through our Join page. Fill out the application form and our team will review it within 2-3 business days.', 'sort_order' => 1],
                    ['question' => 'What are the membership benefits?', 'answer' => 'Members get access to exclusive networking events, business workshops, mentorship programs, coworking spaces, and our online community platform.', 'sort_order' => 2],
                    ['question' => 'How much does membership cost?', 'answer' => 'We offer different membership tiers starting from student memberships to corporate packages. Visit our Membership page for detailed pricing.', 'sort_order' => 3],
                ],
            ],
            [
                'name' => 'Events & Meetings',
                'icon' => 'Calendar',
                'page_slug' => 'faqs',
                'is_active' => true,
                'sort_order' => 2,
                'faqs' => [
                    ['question' => 'How can I attend events?', 'answer' => 'Members can book events through their dashboard. Some events are open to non-members with prior registration.', 'sort_order' => 1],
                    ['question' => 'Can I book a meeting with a mentor?', 'answer' => 'Yes! Members can book one-on-one mentorship sessions through our meeting booking system. Select your preferred mentor and available time slot.', 'sort_order' => 2],
                    ['question' => 'Are events held online or offline?', 'answer' => 'We host both online and offline events. Event details will specify the format when you register.', 'sort_order' => 3],
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

        // Seed Pages and Page Content
        $this->call([
            PageSeeder::class,
            PageContentSeeder::class,
        ]);
    }
}
