<?php

namespace Database\Seeders;

use App\Models\MediaPost;
use Illuminate\Database\Seeder;

class MediaSeeder extends Seeder
{
    public function run(): void
    {
        $posts = [
            // Notices
            [
                'title' => 'New Membership Applications Open for 2026',
                'slug' => 'new-membership-applications-2026',
                'excerpt' => 'Stay informed on E-Club happenings and industry news.',
                'content' => 'We are excited to announce that membership applications for 2026 are now open. Join our vibrant community of entrepreneurs and take your business to the next level. Applications close on January 31, 2026.',
                'media_type' => 'notice',
                'image' => 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&q=80',
                'author' => 'E-Club Admin',
                'published_date' => '2025-12-15',
                'is_featured' => true,
                'order' => 1,
            ],
            [
                'title' => 'Annual General Meeting Scheduled',
                'slug' => 'agm-2026-notice',
                'excerpt' => 'Important updates and announcements.',
                'content' => 'The Annual General Meeting of E-Club will be held on March 1, 2026, at 3:00 PM at the E-Club Conference Hall. All members are requested to attend.',
                'media_type' => 'notice',
                'image' => 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80',
                'author' => 'E-Club Admin',
                'published_date' => '2025-12-10',
                'is_featured' => false,
                'order' => 2,
            ],

            // Press Releases
            [
                'title' => 'E-Club Partners with Leading Universities',
                'slug' => 'university-partnership-2025',
                'excerpt' => 'Official announcements and media coverage of the E-Club.',
                'content' => 'E-Club is proud to announce strategic partnerships with five leading universities in Bangladesh to promote entrepreneurship education and startup incubation programs.',
                'media_type' => 'press_release',
                'image' => 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&q=80',
                'author' => 'E-Club PR Team',
                'published_date' => '2025-11-20',
                'is_featured' => true,
                'order' => 1,
            ],
            [
                'title' => 'E-Club Launches $1M Startup Fund',
                'slug' => 'startup-fund-launch-2025',
                'excerpt' => 'Major announcement from E-Club leadership.',
                'content' => 'In a landmark initiative, E-Club has launched a $1 million startup fund to support early-stage entrepreneurs. The fund will provide seed funding, mentorship, and resources to promising startups.',
                'media_type' => 'press_release',
                'image' => 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=800&q=80',
                'author' => 'E-Club PR Team',
                'published_date' => '2025-10-15',
                'is_featured' => true,
                'order' => 2,
            ],

            // Albums
            [
                'title' => 'Startup Pitch Competition 2024 - Photo Gallery',
                'slug' => 'startup-pitch-2024-gallery',
                'excerpt' => 'Immerse yourself in E-Club events and activities album.',
                'content' => 'Highlights from our annual startup pitch competition featuring 50+ startups competing for funding and mentorship opportunities.',
                'media_type' => 'album',
                'image' => 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800&q=80',
                'gallery' => [
                    'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=400&q=80',
                    'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&q=80',
                    'https://images.unsplash.com/photo-1511578314322-379afb476865?w=400&q=80',
                    'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&q=80',
                    'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=400&q=80',
                    'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=400&q=80',
                ],
                'author' => 'E-Club Media Team',
                'published_date' => '2024-11-25',
                'is_featured' => true,
                'order' => 1,
            ],
            [
                'title' => 'Networking Night November 2024',
                'slug' => 'networking-night-nov-2024',
                'excerpt' => 'Photos from our monthly networking event.',
                'content' => 'A successful evening of networking, knowledge sharing, and collaboration among entrepreneurs and business professionals.',
                'media_type' => 'album',
                'image' => 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&q=80',
                'gallery' => [
                    'https://images.unsplash.com/photo-1511578314322-379afb476865?w=400&q=80',
                    'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=400&q=80',
                    'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=400&q=80',
                    'https://images.unsplash.com/photo-1591115765373-5207764f72e7?w=400&q=80',
                ],
                'author' => 'E-Club Media Team',
                'published_date' => '2024-11-05',
                'is_featured' => false,
                'order' => 2,
            ],

            // Newsletters
            [
                'title' => 'E-Club Monthly Newsletter - December 2025',
                'slug' => 'newsletter-dec-2025',
                'excerpt' => 'Catch up on past E-Club news and insights.',
                'content' => 'This month\'s newsletter features success stories from our members, upcoming events, new partnerships, and insights from industry experts.',
                'media_type' => 'newsletter',
                'image' => 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=800&q=80',
                'pdf_file' => '/newsletters/december-2025.pdf',
                'author' => 'E-Club Editorial Team',
                'published_date' => '2025-12-01',
                'is_featured' => true,
                'order' => 1,
            ],
            [
                'title' => 'E-Club Quarterly Review - Q3 2025',
                'slug' => 'quarterly-review-q3-2025',
                'excerpt' => 'Comprehensive review of Q3 activities and achievements.',
                'content' => 'A detailed look at our third quarter activities, member achievements, financial performance, and strategic initiatives.',
                'media_type' => 'newsletter',
                'image' => 'https://images.unsplash.com/photo-1586281380117-5a60ae2050cc?w=800&q=80',
                'pdf_file' => '/newsletters/q3-2025-review.pdf',
                'author' => 'E-Club Editorial Team',
                'published_date' => '2025-10-01',
                'is_featured' => false,
                'order' => 2,
            ],

            // Blog Posts
            [
                'title' => '10 Tips for First-Time Entrepreneurs',
                'slug' => '10-tips-first-time-entrepreneurs',
                'excerpt' => 'Catch up on past E-Club news and insights.',
                'content' => 'Starting your first business can be daunting. Here are 10 essential tips from successful entrepreneurs to help you navigate the journey: 1. Start with a solid business plan, 2. Understand your market, 3. Build a strong network, 4. Focus on cash flow, 5. Hire the right team...',
                'media_type' => 'blog',
                'image' => 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80',
                'author' => 'Ahmed Rahman',
                'published_date' => '2025-11-15',
                'is_featured' => true,
                'order' => 1,
            ],
            [
                'title' => 'The Future of E-Commerce in Bangladesh',
                'slug' => 'future-ecommerce-bangladesh',
                'excerpt' => 'Analysis of e-commerce trends and opportunities.',
                'content' => 'The e-commerce sector in Bangladesh is experiencing rapid growth. This article explores emerging trends, challenges, and opportunities for entrepreneurs looking to enter the digital marketplace.',
                'media_type' => 'blog',
                'image' => 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&q=80',
                'author' => 'Fatima Khan',
                'published_date' => '2025-11-01',
                'is_featured' => true,
                'order' => 2,
            ],
            [
                'title' => 'How to Pitch Your Startup to Investors',
                'slug' => 'pitch-startup-investors',
                'excerpt' => 'Expert advice on creating winning pitch decks.',
                'content' => 'Learn the art of pitching from investors themselves. Discover what makes a pitch memorable, common mistakes to avoid, and how to structure your presentation for maximum impact.',
                'media_type' => 'blog',
                'image' => 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=800&q=80',
                'author' => 'Kamal Hossain',
                'published_date' => '2025-10-20',
                'is_featured' => false,
                'order' => 3,
            ],
        ];

        foreach ($posts as $post) {
            MediaPost::create($post);
        }
    }
}
