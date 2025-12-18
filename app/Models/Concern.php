<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Concern extends Model
{
    protected $fillable = [
        'title',
        'slug',
        'short_description',
        'description',
        'icon',
        'category',
        'status',
        'priority',
        'raised_date',
        'contact_person',
        'contact_email',
        'related_links',
        'affected_sectors',
        'proposed_solution',
        'current_status_update',
        'is_featured',
        'is_active',
        'sort_order',
    ];

    protected $casts = [
        'related_links' => 'array',
        'affected_sectors' => 'array',
        'is_featured' => 'boolean',
        'is_active' => 'boolean',
        'sort_order' => 'integer',
        'raised_date' => 'date',
    ];

    /**
     * Boot the model
     */
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($concern) {
            if (empty($concern->slug)) {
                $concern->slug = Str::slug($concern->title);
            }
        });

        static::updating(function ($concern) {
            if ($concern->isDirty('title') && empty($concern->slug)) {
                $concern->slug = Str::slug($concern->title);
            }
        });
    }

    /**
     * Scope to get only active concerns
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Scope to get featured concerns
     */
    public function scopeFeatured($query)
    {
        return $query->where('is_featured', true);
    }

    /**
     * Scope to order by sort_order and priority
     */
    public function scopeOrdered($query)
    {
        return $query->orderByRaw("FIELD(priority, 'critical', 'high', 'medium', 'low')")
                     ->orderBy('sort_order')
                     ->orderBy('created_at', 'desc');
    }

    /**
     * Scope to filter by status
     */
    public function scopeStatus($query, $status)
    {
        return $query->where('status', $status);
    }

    /**
     * Scope to filter by priority
     */
    public function scopePriority($query, $priority)
    {
        return $query->where('priority', $priority);
    }

    /**
     * Scope to filter by category
     */
    public function scopeCategory($query, $category)
    {
        return $query->where('category', $category);
    }

    /**
     * Get all active concerns
     */
    public static function getAllActive()
    {
        return static::active()->ordered()->get();
    }

    /**
     * Find a concern by slug
     */
    public static function findBySlug($slug)
    {
        return static::where('slug', $slug)->firstOrFail();
    }
}
