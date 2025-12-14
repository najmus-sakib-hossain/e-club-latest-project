<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Mail\ContactReplyMail;
use App\Models\ContactMessage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;

class ContactMessageController extends Controller
{
    /**
     * Display a listing of contact messages.
     */
    public function index(Request $request)
    {
        $query = ContactMessage::query()->latest();

        // Filter by status
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        // Search by name, email, or subject
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%")
                  ->orWhere('subject', 'like', "%{$search}%");
            });
        }

        $messages = $query->get();

        // Stats
        $stats = [
            'total' => ContactMessage::count(),
            'pending' => ContactMessage::pending()->count(),
            'in_progress' => ContactMessage::inProgress()->count(),
            'resolved' => ContactMessage::resolved()->count(),
        ];

        return Inertia::render('admin/contact-messages/index', [
            'messages' => $messages,
            'stats' => $stats,
            'filters' => $request->only(['status', 'search']),
        ]);
    }

    /**
     * Display the specified contact message.
     */
    public function show(ContactMessage $message)
    {
        // Mark as read when viewing
        $message->markAsRead();

        return Inertia::render('admin/contact-messages/show', [
            'message' => $message,
        ]);
    }

    /**
     * Update the specified contact message.
     */
    public function update(Request $request, ContactMessage $message)
    {
        $validated = $request->validate([
            'status' => 'required|in:pending,in_progress,resolved',
        ]);

        $message->update($validated);

        return back()->with('success', 'Message status updated successfully');
    }

    /**
     * Send a reply to the contact message.
     */
    public function reply(Request $request, ContactMessage $message)
    {
        $validated = $request->validate([
            'reply_content' => 'required|string|min:10|max:5000',
        ]);

        // Get the admin user name
        $repliedBy = auth()->user()->name ?? 'Admin';

        // Send the reply email
        try {
            Mail::to($message->email)->send(new ContactReplyMail(
                $message,
                $validated['reply_content'],
                $repliedBy
            ));

            // Update the message status
            $message->sendReply($validated['reply_content'], $repliedBy);

            return back()->with('success', 'Reply sent successfully');
        } catch (\Exception $e) {
            return back()->with('error', 'Failed to send reply: ' . $e->getMessage());
        }
    }

    /**
     * Remove the specified contact message.
     */
    public function destroy(ContactMessage $message)
    {
        $message->delete();
        return back()->with('success', 'Message deleted successfully');
    }

    /**
     * Mark message as resolved.
     */
    public function resolve(ContactMessage $message)
    {
        $message->markAsResolved();
        return back()->with('success', 'Message marked as resolved');
    }
}
