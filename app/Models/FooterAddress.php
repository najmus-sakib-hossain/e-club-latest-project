<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class FooterAddress extends Model
{
    protected $fillable = [
        'type',
        'title',
        'address',
        'phone',
        'email',
        'country',
        'is_active',
        'sort_order',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'sort_order' => 'integer',
    ];

    /**
     * Scope to get only active addresses
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Scope to order by sort_order
     */
    public function scopeOrdered($query)
    {
        return $query->orderBy('sort_order');
    }

    /**
     * Scope to filter by type
     */
    public function scopeType($query, string $type)
    {
        return $query->where('type', $type);
    }

    /**
     * Get Bangladesh addresses
     */
    public static function getBangladeshAddresses()
    {
        return static::active()->type('bangladesh')->ordered()->get();
    }

    /**
     * Get international addresses
     */
    public static function getInternationalAddresses()
    {
        return static::active()->type('international')->ordered()->get();
    }
}
