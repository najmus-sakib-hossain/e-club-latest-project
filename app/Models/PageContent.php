<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PageContent extends Model
{
    use HasFactory;

    protected $fillable = [
        'page_slug',
        'section_key',
        'title',
        'subtitle',
        'content',
        'image',
        'items',
        'is_active',
        'sort_order',
    ];

    protected $casts = [
        'items' => 'array',
        'is_active' => 'boolean',
    ];

    /**
     * Get content for a specific page
     */
    public static function getPageContent(string $pageSlug): array
    {
        $contents = static::where('page_slug', $pageSlug)
            ->where('is_active', true)
            ->orderBy('sort_order')
            ->get();

        $result = [];
        foreach ($contents as $content) {
            $result[$content->section_key] = [
                'id' => $content->id,
                'title' => $content->title,
                'subtitle' => $content->subtitle,
                'content' => $content->content,
                'image' => $content->image,
                'items' => $content->items,
            ];
        }

        return $result;
    }

    /**
     * Get a specific section of a page
     */
    public static function getSection(string $pageSlug, string $sectionKey): ?array
    {
        $content = static::where('page_slug', $pageSlug)
            ->where('section_key', $sectionKey)
            ->where('is_active', true)
            ->first();

        if (! $content) {
            return null;
        }

        return [
            'id' => $content->id,
            'title' => $content->title,
            'subtitle' => $content->subtitle,
            'content' => $content->content,
            'image' => $content->image,
            'items' => $content->items,
        ];
    }

    /**
     * Set or update a page section
     */
    public static function setSection(string $pageSlug, string $sectionKey, array $data): self
    {
        return static::updateOrCreate(
            [
                'page_slug' => $pageSlug,
                'section_key' => $sectionKey,
            ],
            $data
        );
    }
}
