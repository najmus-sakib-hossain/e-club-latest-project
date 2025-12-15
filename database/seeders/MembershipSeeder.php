<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\MembershipType;
use App\Models\JoinPageSetting;

class MembershipSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Membership Types
        MembershipType::create([
            'name' => 'General Member',
            'description' => 'Perfect for individual entrepreneurs starting their journey',
            'price' => 5000.00,
            'duration' => '1 year',
            'benefits' => [
                'Access to networking events',
                'Monthly newsletters',
                'Member directory access',
                'Discounted workshop fees',
            ],
            'is_active' => true,
            'sort_order' => 1,
        ]);

        MembershipType::create([
            'name' => 'Corporate Member',
            'description' => 'Ideal for established businesses and organizations',
            'price' => 25000.00,
            'duration' => '1 year',
            'benefits' => [
                'All General Member benefits',
                'Priority event registration',
                'Featured in member directory',
                'Quarterly business consultation',
                'Networking lounge access',
                'Speaking opportunities',
            ],
            'is_active' => true,
            'sort_order' => 2,
        ]);

        MembershipType::create([
            'name' => 'Lifetime Member',
            'description' => 'One-time investment for lifetime access',
            'price' => 100000.00,
            'duration' => 'Lifetime',
            'benefits' => [
                'All Corporate Member benefits',
                'Lifetime access to all events',
                'Exclusive mentorship program',
                'Annual business awards eligibility',
                'Board nomination eligibility',
                'VIP lounge access',
            ],
            'is_active' => true,
            'sort_order' => 3,
        ]);

        // Join Page Settings
        JoinPageSetting::set('page_title', 'Join the E-Club Community', 'text');
        JoinPageSetting::set('page_subtitle', 'Become part of Bangladesh\'s leading entrepreneur network', 'text');
        JoinPageSetting::set('welcome_message', 'Want to be a member of ECLUB?', 'text');
        JoinPageSetting::set('welcome_subtitle', 'Select a membership plan that suits your business needs', 'text');
        
        // Payment methods
        JoinPageSetting::set('payment_methods', [
            'card' => ['name' => 'Credit/Debit Card', 'enabled' => true],
            'bank' => ['name' => 'Bank Transfer', 'enabled' => true],
            'mfs' => ['name' => 'Mobile Financial Service', 'enabled' => true],
            'cash' => ['name' => 'Cash Payment', 'enabled' => true],
        ], 'json');

        // Form configuration
        JoinPageSetting::set('require_company_logo', true, 'boolean');
        JoinPageSetting::set('require_verification_otp', true, 'boolean');
        JoinPageSetting::set('terms_and_conditions_url', '/terms', 'text');
        JoinPageSetting::set('privacy_policy_url', '/privacy', 'text');
    }
}
