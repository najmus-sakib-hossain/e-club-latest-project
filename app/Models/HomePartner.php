<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class HomePartner extends Model
{
    protected $fillable = [
        'name',
        'logo',
        'url',
        'is_active',
        'sort_order',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'sort_order' => 'integer',
    ];

    /**
     * Scope to get only active partners
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
     * Get all active partners
     */
    public static function getAllActive()
    {
        return static::active()->ordered()->get();
    }
}
