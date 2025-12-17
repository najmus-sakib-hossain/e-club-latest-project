<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TeamMember extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'role',
        'image',
        'bio',
        'social_links',
        'is_active',
        'sort_order',
    ];

    protected $casts = [
        'social_links' => 'array',
        'is_active' => 'boolean',
    ];

    /**
     * Get all active team members
     */
    public static function getActiveMembers()
    {
        return static::where('is_active', true)
            ->orderBy('sort_order')
            ->get();
    }
}
