<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CallbackRequest extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'phone',
        'preferred_time',
        'reason',
        'notes',
        'status',
        'admin_notes',
        'called_at',
        'completed_at',
    ];

    protected $casts = [
        'called_at' => 'datetime',
        'completed_at' => 'datetime',
    ];

    /**
     * Scope for pending callbacks
     */
    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }

    /**
     * Scope for today's callbacks
     */
    public function scopeToday($query)
    {
        return $query->whereDate('created_at', now()->toDateString());
    }

    /**
     * Mark as called
     */
    public function markAsCalled()
    {
        $this->update([
            'status' => 'called',
            'called_at' => now(),
        ]);
    }

    /**
     * Mark as no answer
     */
    public function markAsNoAnswer()
    {
        $this->update([
            'status' => 'no_answer',
            'called_at' => now(),
        ]);
    }

    /**
     * Mark as completed
     */
    public function complete()
    {
        $this->update([
            'status' => 'completed',
            'completed_at' => now(),
        ]);
    }

    /**
     * Cancel the callback
     */
    public function cancel()
    {
        $this->update([
            'status' => 'cancelled',
        ]);
    }
}
