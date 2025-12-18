<?php

namespace Database\Seeders;

use App\Models\CommitteeMember;
use Illuminate\Database\Seeder;

class CommitteeSeeder extends Seeder
{
    public function run(): void
    {
        $members = [
            // Advisors
            [
                'name' => 'Dr. Ahmed Rahman',
                'role' => 'Chief Advisor',
                'designation' => 'Former CEO, Tech Ventures Ltd',
                'committee_type' => 'advisors',
                'description' => 'Industry veterans offering strategic guidance to the E-Club.',
                'image' => 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80',
                'email' => 'ahmed.rahman@example.com',
                'linkedin' => 'https://linkedin.com/in/ahmedrahman',
                'order' => 1,
            ],
            [
                'name' => 'Ms. Fatima Khan',
                'role' => 'Business Advisor',
                'designation' => 'Serial Entrepreneur',
                'committee_type' => 'advisors',
                'description' => 'Industry veterans offering strategic guidance to the E-Club.',
                'image' => 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80',
                'email' => 'fatima.khan@example.com',
                'linkedin' => 'https://linkedin.com/in/fatimakhan',
                'order' => 2,
            ],
            [
                'name' => 'Mr. Kamal Hossain',
                'role' => 'Financial Advisor',
                'designation' => 'Investment Banker',
                'committee_type' => 'advisors',
                'description' => 'Industry veterans offering strategic guidance to the E-Club.',
                'image' => 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80',
                'email' => 'kamal.hossain@example.com',
                'linkedin' => 'https://linkedin.com/in/kamalhossain',
                'order' => 3,
            ],

            // Governing Body
            [
                'name' => 'Mr. Imran Chowdhury',
                'role' => 'Chairman',
                'designation' => 'Board of Directors',
                'committee_type' => 'governing_body',
                'description' => 'The leadership team setting the direction for the E-Club.',
                'image' => 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80',
                'email' => 'imran.chowdhury@example.com',
                'linkedin' => 'https://linkedin.com/in/imranchowdhury',
                'order' => 1,
            ],
            [
                'name' => 'Ms. Nusrat Ahmed',
                'role' => 'Vice Chairman',
                'designation' => 'Board of Directors',
                'committee_type' => 'governing_body',
                'description' => 'The leadership team setting the direction for the E-Club.',
                'image' => 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&q=80',
                'email' => 'nusrat.ahmed@example.com',
                'linkedin' => 'https://linkedin.com/in/nusratahmed',
                'order' => 2,
            ],
            [
                'name' => 'Dr. Rashid Ali',
                'role' => 'Secretary',
                'designation' => 'Board of Directors',
                'committee_type' => 'governing_body',
                'description' => 'The leadership team setting the direction for the E-Club.',
                'image' => 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&q=80',
                'email' => 'rashid.ali@example.com',
                'linkedin' => 'https://linkedin.com/in/rashidali',
                'order' => 3,
            ],

            // Executive Body
            [
                'name' => 'Ms. Sabrina Karim',
                'role' => 'President',
                'designation' => 'Executive Committee',
                'committee_type' => 'executive_body',
                'description' => 'Overseeing the day-to-day operations of the E-Club.',
                'image' => 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80',
                'email' => 'sabrina.karim@example.com',
                'linkedin' => 'https://linkedin.com/in/sabrinakarim',
                'order' => 1,
            ],
            [
                'name' => 'Mr. Fahim Hassan',
                'role' => 'Vice President',
                'designation' => 'Executive Committee',
                'committee_type' => 'executive_body',
                'description' => 'Overseeing the day-to-day operations of the E-Club.',
                'image' => 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=400&q=80',
                'email' => 'fahim.hassan@example.com',
                'linkedin' => 'https://linkedin.com/in/fahimhassan',
                'order' => 2,
            ],
            [
                'name' => 'Ms. Ayesha Rahman',
                'role' => 'Treasurer',
                'designation' => 'Executive Committee',
                'committee_type' => 'executive_body',
                'description' => 'Overseeing the day-to-day operations of the E-Club.',
                'image' => 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80',
                'email' => 'ayesha.rahman@example.com',
                'linkedin' => 'https://linkedin.com/in/ayesharahman',
                'order' => 3,
            ],

            // Founders
            [
                'name' => 'Mr. Rafiqul Islam',
                'role' => 'Co-Founder',
                'designation' => 'Founding Member',
                'committee_type' => 'founders',
                'description' => 'The individuals who established the E-Club.',
                'image' => 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&q=80',
                'email' => 'rafiq.islam@example.com',
                'linkedin' => 'https://linkedin.com/in/rafiqislam',
                'order' => 1,
            ],
            [
                'name' => 'Ms. Taslima Begum',
                'role' => 'Co-Founder',
                'designation' => 'Founding Member',
                'committee_type' => 'founders',
                'description' => 'The individuals who established the E-Club.',
                'image' => 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&q=80',
                'email' => 'taslima.begum@example.com',
                'linkedin' => 'https://linkedin.com/in/taslimabegum',
                'order' => 2,
            ],

            // EC Alumni
            [
                'name' => 'Mr. Shakib Khan',
                'role' => 'President',
                'designation' => 'Alumni',
                'committee_type' => 'alumni',
                'year' => 'EC 2023-24',
                'description' => 'Former members of the E-Club\'s governing body.',
                'image' => 'https://images.unsplash.com/photo-1463453091185-61582044d556?w=400&q=80',
                'email' => 'shakib.khan@example.com',
                'linkedin' => 'https://linkedin.com/in/shakibkhan',
                'order' => 1,
            ],
            [
                'name' => 'Ms. Mim Akter',
                'role' => 'Vice President',
                'designation' => 'Alumni',
                'committee_type' => 'alumni',
                'year' => 'EC 2022-23',
                'description' => 'Former members of the E-Club\'s governing body.',
                'image' => 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400&q=80',
                'email' => 'mim.akter@example.com',
                'linkedin' => 'https://linkedin.com/in/mimakter',
                'order' => 2,
            ],

            // Forums
            [
                'name' => 'Tech Entrepreneurs Forum',
                'role' => 'Forum Lead',
                'designation' => 'Technology Sector',
                'committee_type' => 'forums',
                'description' => 'Platforms for members to connect and discuss various topics.',
                'image' => 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=400&q=80',
                'email' => 'tech@eclub-forums.com',
                'order' => 1,
            ],
            [
                'name' => 'Women Entrepreneurs Forum',
                'role' => 'Forum Lead',
                'designation' => 'Women Leadership',
                'committee_type' => 'forums',
                'description' => 'Platforms for members to connect and discuss various topics.',
                'image' => 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80',
                'email' => 'women@eclub-forums.com',
                'order' => 2,
            ],

            // Standing Committee
            [
                'name' => 'Finance Committee',
                'role' => 'Committee Head',
                'designation' => 'Financial Affairs',
                'committee_type' => 'standing_committee',
                'description' => 'A permanent committee with ongoing responsibilities.',
                'image' => 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=400&q=80',
                'email' => 'finance@eclub-committees.com',
                'order' => 1,
            ],
            [
                'name' => 'Events Committee',
                'role' => 'Committee Head',
                'designation' => 'Event Management',
                'committee_type' => 'standing_committee',
                'description' => 'A permanent committee with ongoing responsibilities.',
                'image' => 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400&q=80',
                'email' => 'events@eclub-committees.com',
                'order' => 2,
            ],

            // Project Directors
            [
                'name' => 'Mr. Tariq Ahmed',
                'role' => 'Project Director',
                'designation' => 'Startup Incubator Program',
                'committee_type' => 'project_directors',
                'description' => 'Members leading specific E-Club projects.',
                'image' => 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=400&q=80',
                'email' => 'tariq.ahmed@example.com',
                'linkedin' => 'https://linkedin.com/in/tariqahmed',
                'order' => 1,
            ],
            [
                'name' => 'Ms. Rima Das',
                'role' => 'Project Director',
                'designation' => 'Mentorship Program',
                'committee_type' => 'project_directors',
                'description' => 'Members leading specific E-Club projects.',
                'image' => 'https://images.unsplash.com/photo-1554151228-14d9def656e4?w=400&q=80',
                'email' => 'rima.das@example.com',
                'linkedin' => 'https://linkedin.com/in/rimadas',
                'order' => 2,
            ],

            // Administrative Team
            [
                'name' => 'Ms. Shirin Akhter',
                'role' => 'Operations Manager',
                'designation' => 'Administrative Staff',
                'committee_type' => 'administrative_team',
                'description' => 'The team managing daily tasks to ensure smooth operations.',
                'image' => 'https://images.unsplash.com/photo-1573496799652-408c2ac9fe98?w=400&q=80',
                'email' => 'shirin.akhter@example.com',
                'order' => 1,
            ],
            [
                'name' => 'Mr. Jahid Hasan',
                'role' => 'IT Coordinator',
                'designation' => 'Administrative Staff',
                'committee_type' => 'administrative_team',
                'description' => 'The team managing daily tasks to ensure smooth operations.',
                'image' => 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&q=80',
                'email' => 'jahid.hasan@example.com',
                'order' => 2,
            ],
        ];

        foreach ($members as $member) {
            CommitteeMember::create($member);
        }
    }
}
