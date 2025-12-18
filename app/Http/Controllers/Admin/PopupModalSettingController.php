<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\PopupModalSetting;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PopupModalSettingController extends Controller
{
    public function index()
    {
        $setting = PopupModalSetting::first() ?? new PopupModalSetting([
            'title' => 'Become a Founder Member',
            'description' => "Join our exclusive club and unlock a world of opportunities! Get personalized support, access to exclusive resources, and connect with like-minded professionals. Become a Founder Member today!",
            'button_text' => 'Join Now',
            'button_link' => '/join',
            'is_active' => true,
        ]);

        return Inertia::render('admin/settings/popup-modal', [
            'setting' => $setting,
        ]);
    }

    public function update(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'button_text' => 'required|string|max:100',
            'button_link' => 'required|string|max:255',
            'image_url' => 'nullable|string|max:500',
            'is_active' => 'boolean',
        ]);

        $setting = PopupModalSetting::first();

        if ($setting) {
            $setting->update($validated);
        } else {
            PopupModalSetting::create($validated);
        }

        return redirect()->back()->with('success', 'Popup modal settings updated successfully!');
    }

    public function uploadImage(Request $request)
    {
        $request->validate([
            'image' => 'required|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
        ]);

        if ($request->hasFile('image')) {
            $image = $request->file('image');
            $imageName = time() . '_' . $image->getClientOriginalName();
            $image->move(public_path('images/popup'), $imageName);

            return response()->json([
                'success' => true,
                'image_url' => '/images/popup/' . $imageName,
            ]);
        }

        return response()->json([
            'success' => false,
            'message' => 'No image uploaded',
        ], 400);
    }
}
