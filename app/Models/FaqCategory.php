<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;

class FaqCategory extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'icon',
        'page_slug',
        'is_active',
        'sort_order',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    /**
     * Get FAQs for this category
     */
    public function faqs(): HasMany
    {
        return $this->hasMany(Faq::class)->orderBy('sort_order');
    }

    /**
     * Get active FAQs for this category
     */
    public function activeFaqs(): HasMany
    {
        return $this->hasMany(Faq::class)->where('is_active', true)->orderBy('sort_order');
    }

    /**
     * Get all FAQ categories with their FAQs for a specific page
     */
    public static function getWithFaqs(string $pageSlug = 'faqs')
    {
        return static::where('page_slug', $pageSlug)
            ->where('is_active', true)
            ->with('activeFaqs')
            ->orderBy('sort_order')
            ->get();
    }
}
