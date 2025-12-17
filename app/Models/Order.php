<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Order extends Model
{
    use HasFactory;

    protected $fillable = [
        'order_number',
        'customer_name',
        'customer_email',
        'customer_phone',
        'shipping_address',
        'notes',
        'subtotal',
        'discount_amount',
        'shipping_amount',
        'total_amount',
        'payment_method',
        'payment_status',
        'transaction_id',
        'status',
    ];

    protected $casts = [
        'subtotal' => 'decimal:2',
        'discount_amount' => 'decimal:2',
        'shipping_amount' => 'decimal:2',
        'total_amount' => 'decimal:2',
    ];

    /**
     * Get the order items
     */
    public function items(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }

    /**
     * Get status badge color
     */
    public function getStatusColorAttribute(): string
    {
        return match ($this->status) {
            'pending' => 'yellow',
            'processing' => 'blue',
            'shipped' => 'purple',
            'delivered' => 'green',
            'cancelled' => 'red',
            default => 'gray',
        };
    }

    /**
     * Get payment status badge color
     */
    public function getPaymentStatusColorAttribute(): string
    {
        return match ($this->payment_status) {
            'pending' => 'yellow',
            'paid' => 'green',
            'failed' => 'red',
            'refunded' => 'gray',
            default => 'gray',
        };
    }

    /**
     * Scope by status
     */
    public function scopeStatus($query, string $status)
    {
        return $query->where('status', $status);
    }

    /**
     * Scope by payment status
     */
    public function scopePaymentStatus($query, string $status)
    {
        return $query->where('payment_status', $status);
    }
}
