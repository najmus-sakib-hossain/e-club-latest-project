<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class HomeStat extends Model
{
    protected $fillable = [
        'count',
        'label',
        'is_active',
        'sort_order',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'sort_order' => 'integer',
    ];

    /**
     * Scope to get only active stats
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
     * Get all active stats
     */
    public static function getAllActive()
    {
        return static::active()->ordered()->get();
    }
}
