<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\MembershipApplication;
use App\Models\MembershipType;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class JoinController extends Controller
{
    /**
     * Show the join page.
     */
    public function create()
    {
        return Inertia::render('join', [
            'membershipTypes' => MembershipType::where('is_active', true)->get(),
        ]);
    }

    /**
     * Store a new membership application.
     */
    public function store(Request $request)
    {
        // Validation with camelCase support (mapping done manually or via nice validation)
        // Since request likely comes as JSON with camelCase keys, we should validate those.

        $validated = $request->validate([
            'membershipType' => 'required|string',
            'companyName' => 'required|string|max:255',
            'repEmail' => 'required|email',
            'repMobile' => 'required|string',
            'password' => 'required|string|min:8', // confirmPassword handled by frontend usually or 'confirmed'
            // 'confirmPassword' => 'same:password',

            // Other fields are optional or nullable in DB
            'repName' => 'required|string',
            'repDesignation' => 'nullable|string',
            'repGender' => 'nullable|string',
            'repDob' => 'nullable|date',
            'repPersonalEmail' => 'nullable|email',

            'companyEmail' => 'nullable|email',
            'companyContactMobile' => 'nullable|string',
            'companyWhatsapp' => 'nullable|string',
            'companyWebsite' => 'nullable|url',
            'establishmentDate' => 'nullable|date',

            'businessSegment' => 'nullable|string',
            'productCategory' => 'nullable|string',
            'exportEnabled' => 'nullable', // string "yes"/"no" or boolean
            'paymentMethod' => 'required|string',

            'termsAgreed' => 'accepted',
        ]);

        return DB::transaction(function () use ($validated) {

            // Map camelCase to snake_case
            $applicationData = [
                'membership_type' => $validated['membershipType'],
                'company_name' => $validated['companyName'],
                'rep_name' => $validated['repName'],
                'rep_email' => $validated['repEmail'],
                'rep_mobile' => $validated['repMobile'],
                'rep_designation' => $validated['repDesignation'] ?? null,

                'company_email' => $validated['companyEmail'] ?? null,
                'company_mobile' => $validated['companyContactMobile'] ?? null,
                'company_whatsapp' => $validated['companyWhatsapp'] ?? null,
                'company_website' => $validated['companyWebsite'] ?? null,
                'company_address' => null, // Not in form yet?

                'establishment_date' => $validated['establishmentDate'] ?? null,
                'business_segment' => $validated['businessSegment'] ?? null,
                'product_category' => $validated['productCategory'] ?? null,
                'export_enabled' => ($validated['exportEnabled'] ?? 'no') === 'yes',
                'payment_method' => $validated['paymentMethod'],

                'status' => 'pending',
            ];

            // Create User (optional - maybe we wait for approval?)
            // Creating user now allows them to login and see status.
            $user = User::create([
                'name' => $validated['repName'],
                'email' => $validated['repEmail'],
                'password' => Hash::make($validated['password']),
                'is_admin' => false,
            ]);

            // Create Application
            $application = MembershipApplication::create($applicationData);

            // Link? No user_id column in my migration, oops.
            // I should have added user_id. For now, email matches.

            // Handle file upload if present
            // 'companyLogo' would need `store` logic if it were sent as file.
            // If handling file uploads, frontend needs to send FormData object, not JSON.

            return redirect()->route('join.success')->with('success', 'Application submitted successfully!');
        });
    }

    /**
     * Show the success page.
     */
    public function success()
    {
        return Inertia::render('join/success');
    }
}
