<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class HomeSection extends Model
{
    protected $fillable = [
        'section_key',
        'title',
        'subtitle',
        'content',
        'image',
        'data',
        'is_active',
        'sort_order',
    ];

    protected $casts = [
        'data' => 'array',
        'is_active' => 'boolean',
        'sort_order' => 'integer',
    ];

    /**
     * Scope to get only active sections
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
     * Get section by key
     */
    public static function getByKey(string $key)
    {
        return static::where('section_key', $key)->first();
    }

    /**
     * Get all active sections
     */
    public static function getAllActive()
    {
        return static::active()->ordered()->get();
    }
}
