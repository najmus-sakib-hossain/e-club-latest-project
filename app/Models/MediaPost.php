<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class MediaPost extends Model
{
    protected $fillable = [
        'title',
        'slug',
        'excerpt',
        'content',
        'media_type',
        'image',
        'gallery',
        'pdf_file',
        'author',
        'published_date',
        'is_featured',
        'order',
        'is_active',
    ];

    protected $casts = [
        'gallery' => 'array',
        'published_date' => 'date',
        'is_featured' => 'boolean',
        'is_active' => 'boolean',
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($post) {
            if (empty($post->slug)) {
                $post->slug = Str::slug($post->title);
            }
        });
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeOrdered($query)
    {
        return $query->orderBy('published_date', 'desc')->orderBy('order');
    }

    public function scopeOfType($query, $type)
    {
        return $query->where('media_type', $type);
    }

    public function scopeFeatured($query)
    {
        return $query->where('is_featured', true);
    }
}
