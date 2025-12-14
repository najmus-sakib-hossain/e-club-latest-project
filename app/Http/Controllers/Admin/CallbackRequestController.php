<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\CallbackRequest;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CallbackRequestController extends Controller
{
    /**
     * Display a listing of callback requests.
     */
    public function index(Request $request)
    {
        $query = CallbackRequest::query()->latest();

        // Filter by status
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        // Search by name or phone
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('phone', 'like', "%{$search}%");
            });
        }

        $callbacks = $query->get();

        // Stats
        $stats = [
            'total' => CallbackRequest::count(),
            'pending' => CallbackRequest::pending()->count(),
            'today' => CallbackRequest::today()->count(),
        ];

        return Inertia::render('admin/callbacks/index', [
            'callbacks' => $callbacks,
            'stats' => $stats,
            'filters' => $request->only(['status', 'search']),
        ]);
    }

    /**
     * Display the specified callback request.
     */
    public function show(CallbackRequest $callback)
    {
        return Inertia::render('admin/callbacks/show', [
            'callback' => $callback,
        ]);
    }

    /**
     * Update the specified callback request.
     */
    public function update(Request $request, CallbackRequest $callback)
    {
        $validated = $request->validate([
            'status' => 'required|in:pending,called,no_answer,completed,cancelled',
            'admin_notes' => 'nullable|string|max:1000',
        ]);

        // Handle status changes
        $oldStatus = $callback->status;
        $newStatus = $validated['status'];

        if ($oldStatus !== $newStatus) {
            switch ($newStatus) {
                case 'called':
                    $callback->markAsCalled();
                    break;
                case 'no_answer':
                    $callback->markAsNoAnswer();
                    break;
                case 'completed':
                    $callback->complete();
                    break;
                case 'cancelled':
                    $callback->cancel();
                    break;
                default:
                    $callback->update(['status' => $newStatus]);
            }
        }

        if (isset($validated['admin_notes'])) {
            $callback->update(['admin_notes' => $validated['admin_notes']]);
        }

        return back()->with('success', 'Callback request updated successfully');
    }

    /**
     * Remove the specified callback request.
     */
    public function destroy(CallbackRequest $callback)
    {
        $callback->delete();
        return back()->with('success', 'Callback request deleted successfully');
    }
}
