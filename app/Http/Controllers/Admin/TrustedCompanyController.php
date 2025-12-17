<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\TrustedCompany;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class TrustedCompanyController extends Controller
{
    /**
     * Display a listing of trusted companies
     */
    public function index(): Response
    {
        return Inertia::render('admin/trusted-companies/index', [
            'companies' => TrustedCompany::ordered()->get(),
        ]);
    }

    /**
     * Get all trusted companies as JSON (for API)
     */
    public function list(): JsonResponse
    {
        return response()->json(TrustedCompany::ordered()->get());
    }

    /**
     * Store a new trusted company
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'logo' => 'nullable|image|max:2048',
            'logo_url' => 'nullable|url|max:500',
            'website' => 'nullable|url|max:255',
            'order' => 'integer',
            'sort_order' => 'integer',
            'is_active' => 'boolean',
        ]);

        // Handle sort_order alias for order
        if (isset($validated['sort_order']) && ! isset($validated['order'])) {
            $validated['order'] = $validated['sort_order'];
        }
        unset($validated['sort_order']);

        // Handle logo - either file upload or URL
        if ($request->hasFile('logo')) {
            $validated['logo'] = $request->file('logo')->store('trusted-companies', 'public');
        } elseif ($request->filled('logo_url')) {
            $validated['logo'] = $validated['logo_url'];
        }
        unset($validated['logo_url']);

        TrustedCompany::create($validated);

        return redirect()->back()->with('success', 'Trusted company created successfully');
    }

    /**
     * Update a trusted company
     */
    public function update(Request $request, TrustedCompany $trustedCompany): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'logo' => 'nullable|image|max:2048',
            'logo_url' => 'nullable|url|max:500',
            'website' => 'nullable|url|max:255',
            'order' => 'integer',
            'sort_order' => 'integer',
            'is_active' => 'boolean',
        ]);

        // Handle sort_order alias for order
        if (isset($validated['sort_order']) && ! isset($validated['order'])) {
            $validated['order'] = $validated['sort_order'];
        }
        unset($validated['sort_order']);

        // Handle logo - either file upload or URL
        if ($request->hasFile('logo')) {
            // Delete old file if it was a stored file (not URL)
            if ($trustedCompany->logo && ! str_starts_with($trustedCompany->logo, 'http')) {
                Storage::disk('public')->delete($trustedCompany->logo);
            }
            $validated['logo'] = $request->file('logo')->store('trusted-companies', 'public');
        } elseif ($request->filled('logo_url')) {
            // Delete old file if it was a stored file
            if ($trustedCompany->logo && ! str_starts_with($trustedCompany->logo, 'http')) {
                Storage::disk('public')->delete($trustedCompany->logo);
            }
            $validated['logo'] = $validated['logo_url'];
        }
        unset($validated['logo_url']);

        $trustedCompany->update($validated);

        return redirect()->back()->with('success', 'Trusted company updated successfully');
    }

    /**
     * Delete a trusted company
     */
    public function destroy(TrustedCompany $trustedCompany): RedirectResponse
    {
        if ($trustedCompany->logo && ! str_starts_with($trustedCompany->logo, 'http')) {
            Storage::disk('public')->delete($trustedCompany->logo);
        }

        $trustedCompany->delete();

        return redirect()->back()->with('success', 'Trusted company deleted successfully');
    }

    /**
     * Update order of trusted companies
     */
    public function updateOrder(Request $request): RedirectResponse
    {
        $request->validate([
            'companies' => 'required|array',
            'companies.*.id' => 'required|exists:trusted_companies,id',
            'companies.*.order' => 'required|integer',
        ]);

        foreach ($request->companies as $companyData) {
            TrustedCompany::where('id', $companyData['id'])->update(['order' => $companyData['order']]);
        }

        return redirect()->back()->with('success', 'Order updated successfully');
    }
}
