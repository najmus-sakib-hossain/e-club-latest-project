<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Event extends Model
{
    protected $fillable = [
        'title',
        'slug',
        'description',
        'content',
        'event_type',
        'event_date',
        'location',
        'venue',
        'image',
        'gallery',
        'registration_link',
        'is_featured',
        'order',
        'is_active',
    ];

    protected $casts = [
        'event_date' => 'datetime',
        'gallery' => 'array',
        'is_featured' => 'boolean',
        'is_active' => 'boolean',
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($event) {
            if (empty($event->slug)) {
                $event->slug = Str::slug($event->title);
            }
        });
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeOrdered($query)
    {
        return $query->orderBy('order')->orderBy('event_date', 'desc');
    }

    public function scopeUpcoming($query)
    {
        return $query->where('event_type', 'upcoming')
            ->where('event_date', '>=', now())
            ->orderBy('event_date');
    }

    public function scopePast($query)
    {
        return $query->where('event_type', 'past')
            ->orderBy('event_date', 'desc');
    }

    public function scopeFeatured($query)
    {
        return $query->where('is_featured', true);
    }
}
