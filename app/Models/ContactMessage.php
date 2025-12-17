<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ContactMessage extends Model
{
    use HasFactory;

    public const STATUS_PENDING = 'pending';

    public const STATUS_IN_PROGRESS = 'in_progress';

    public const STATUS_RESOLVED = 'resolved';

    protected $fillable = [
        'name',
        'email',
        'phone',
        'subject',
        'message',
        'status',
        'read_at',
        'replied_at',
        'reply_content',
        'replied_by',
    ];

    protected $casts = [
        'read_at' => 'datetime',
        'replied_at' => 'datetime',
    ];

    /**
     * Scope for pending messages
     */
    public function scopePending($query)
    {
        return $query->where('status', self::STATUS_PENDING);
    }

    /**
     * Scope for unread messages
     */
    public function scopeUnread($query)
    {
        return $query->whereNull('read_at');
    }

    /**
     * Scope for in-progress messages
     */
    public function scopeInProgress($query)
    {
        return $query->where('status', self::STATUS_IN_PROGRESS);
    }

    public function scopeResolved($query)
    {
        return $query->where('status', self::STATUS_RESOLVED);
    }

    /**
     * Mark as read
     */
    public function markAsRead()
    {
        if (! $this->read_at) {
            $this->update([
                'read_at' => now(),
            ]);
        }
    }

    /**
     * Send reply
     */
    public function sendReply($replyContent, $repliedBy = null)
    {
        $this->update([
            'status' => self::STATUS_RESOLVED,
            'replied_at' => now(),
            'reply_content' => $replyContent,
            'replied_by' => $repliedBy,
        ]);
    }

    /**
     * Mark as resolved
     */
    public function markAsResolved()
    {
        $this->update([
            'status' => self::STATUS_RESOLVED,
        ]);
    }

    /**
     * Check if message is new
     */
    public function isNew()
    {
        return $this->status === self::STATUS_PENDING;
    }

    /**
     * Check if message has been replied to
     */
    public function hasReply()
    {
        return ! empty($this->reply_content);
    }
}
