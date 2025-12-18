<?php

namespace Database\Seeders;

use App\Models\Event;
use Illuminate\Database\Seeder;

class EventsSeeder extends Seeder
{
    public function run(): void
    {
        $events = [
            // Upcoming Events
            [
                'title' => 'Startup Pitch Competition 2026',
                'slug' => 'startup-pitch-competition-2026',
                'description' => 'Join or suggest! Shape E-Club events together.',
                'content' => 'Discover inspiring workshops, networking events, and more. Our annual startup pitch competition where aspiring entrepreneurs present their business ideas to a panel of investors and industry experts. Winners receive funding and mentorship opportunities.',
                'event_type' => 'upcoming',
                'event_date' => '2026-03-15 14:00:00',
                'location' => 'Dhaka',
                'venue' => 'E-Club Innovation Hub, Gulshan',
                'image' => 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800&q=80',
                'registration_link' => '/events/register/startup-pitch-2026',
                'is_featured' => true,
                'order' => 1,
            ],
            [
                'title' => 'Digital Marketing Masterclass',
                'slug' => 'digital-marketing-masterclass',
                'description' => 'Discover inspiring workshops, networking events, and more.',
                'content' => 'Learn the latest digital marketing strategies from industry experts. Topics include SEO, social media marketing, content creation, and analytics.',
                'event_type' => 'upcoming',
                'event_date' => '2026-02-20 10:00:00',
                'location' => 'Dhaka',
                'venue' => 'E-Club Conference Room, Banani',
                'image' => 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80',
                'registration_link' => '/events/register/digital-marketing',
                'is_featured' => false,
                'order' => 2,
            ],
            [
                'title' => 'Networking Night: Connect & Grow',
                'slug' => 'networking-night-jan-2026',
                'description' => 'Monthly networking event for entrepreneurs and business professionals.',
                'content' => 'Join fellow entrepreneurs for an evening of networking, knowledge sharing, and collaboration. Includes speed networking sessions and panel discussions.',
                'event_type' => 'upcoming',
                'event_date' => '2026-01-30 18:00:00',
                'location' => 'Dhaka',
                'venue' => 'Radisson Blu, Dhaka Water Garden',
                'image' => 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&q=80',
                'registration_link' => '/events/register/networking-jan',
                'is_featured' => false,
                'order' => 3,
            ],
            [
                'title' => 'Tech Startup Bootcamp',
                'slug' => 'tech-startup-bootcamp',
                'description' => 'Intensive 3-day bootcamp for tech entrepreneurs.',
                'content' => 'Learn how to build, launch, and scale your tech startup. Covers product development, fundraising, team building, and go-to-market strategies.',
                'event_type' => 'upcoming',
                'event_date' => '2026-04-10 09:00:00',
                'location' => 'Dhaka',
                'venue' => 'BRAC Centre Inn, Mohakhali',
                'image' => 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&q=80',
                'registration_link' => '/events/register/tech-bootcamp',
                'is_featured' => true,
                'order' => 4,
            ],

            // Past Events
            [
                'title' => 'E-Club Annual Summit 2024',
                'slug' => 'eclub-annual-summit-2024',
                'description' => 'Relive the highlights and access past event resources.',
                'content' => 'Our flagship annual event brought together 500+ entrepreneurs, investors, and business leaders. Featured keynote speeches, panel discussions, and networking opportunities.',
                'event_type' => 'past',
                'event_date' => '2024-11-15 09:00:00',
                'location' => 'Dhaka',
                'venue' => 'Bangabandhu International Conference Center',
                'image' => 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80',
                'gallery' => [
                    'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&q=80',
                    'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=400&q=80',
                    'https://images.unsplash.com/photo-1511578314322-379afb476865?w=400&q=80',
                    'https://images.unsplash.com/photo-1591115765373-5207764f72e7?w=400&q=80',
                ],
                'is_featured' => true,
                'order' => 1,
            ],
            [
                'title' => 'Women in Business Workshop',
                'slug' => 'women-in-business-2024',
                'description' => 'Empowering women entrepreneurs through knowledge and networking.',
                'content' => 'A full-day workshop focused on challenges and opportunities for women entrepreneurs. Featured successful women business leaders sharing their experiences.',
                'event_type' => 'past',
                'event_date' => '2024-08-20 10:00:00',
                'location' => 'Dhaka',
                'venue' => 'Pan Pacific Sonargaon Hotel',
                'image' => 'https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?w=800&q=80',
                'gallery' => [
                    'https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?w=400&q=80',
                    'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400&q=80',
                ],
                'is_featured' => false,
                'order' => 2,
            ],
            [
                'title' => 'Funding & Investment Seminar',
                'slug' => 'funding-investment-seminar-2024',
                'description' => 'Learn how to raise capital for your startup.',
                'content' => 'Expert investors and successful entrepreneurs shared insights on fundraising strategies, pitch preparation, and investor relations.',
                'event_type' => 'past',
                'event_date' => '2024-06-10 14:00:00',
                'location' => 'Dhaka',
                'venue' => 'The Westin Dhaka',
                'image' => 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=800&q=80',
                'gallery' => [
                    'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&q=80',
                    'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=400&q=80',
                ],
                'is_featured' => false,
                'order' => 3,
            ],
        ];

        foreach ($events as $event) {
            Event::create($event);
        }
    }
}
