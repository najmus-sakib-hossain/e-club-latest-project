<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Partnership extends Model
{
    protected $fillable = [
        'partner_name',
        'slug',
        'short_description',
        'description',
        'logo',
        'type',
        'industry',
        'website_url',
        'contact_person',
        'contact_email',
        'contact_phone',
        'partnership_start_date',
        'partnership_end_date',
        'status',
        'benefits',
        'joint_projects',
        'partnership_details',
        'mou_document',
        'is_featured',
        'is_active',
        'sort_order',
    ];

    protected $casts = [
        'benefits' => 'array',
        'joint_projects' => 'array',
        'is_featured' => 'boolean',
        'is_active' => 'boolean',
        'sort_order' => 'integer',
        'partnership_start_date' => 'date',
        'partnership_end_date' => 'date',
    ];

    /**
     * Boot the model
     */
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($partnership) {
            if (empty($partnership->slug)) {
                $partnership->slug = Str::slug($partnership->partner_name);
            }
        });

        static::updating(function ($partnership) {
            if ($partnership->isDirty('partner_name') && empty($partnership->slug)) {
                $partnership->slug = Str::slug($partnership->partner_name);
            }
        });
    }

    /**
     * Scope to get only active partnerships
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Scope to get featured partnerships
     */
    public function scopeFeatured($query)
    {
        return $query->where('is_featured', true);
    }

    /**
     * Scope to order by sort_order
     */
    public function scopeOrdered($query)
    {
        return $query->orderBy('sort_order')->orderBy('created_at', 'desc');
    }

    /**
     * Scope to filter by status
     */
    public function scopeStatus($query, $status)
    {
        return $query->where('status', $status);
    }

    /**
     * Scope to filter by type
     */
    public function scopeType($query, $type)
    {
        return $query->where('type', $type);
    }

    /**
     * Get all active partnerships
     */
    public static function getAllActive()
    {
        return static::active()->ordered()->get();
    }

    /**
     * Find a partnership by slug
     */
    public static function findBySlug($slug)
    {
        return static::where('slug', $slug)->firstOrFail();
    }
}
