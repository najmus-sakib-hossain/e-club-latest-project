<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class StoreLocation extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'type',
        'address',
        'phone',
        'email',
        'hours',
        'features',
        'is_open',
        'rating',
        'map_url',
        'city',
        'is_active',
        'sort_order',
    ];

    protected $casts = [
        'features' => 'array',
        'is_open' => 'boolean',
        'is_active' => 'boolean',
        'rating' => 'decimal:1',
    ];

    /**
     * Get all active store locations
     */
    public static function getActiveStores()
    {
        return static::where('is_active', true)
            ->orderBy('sort_order')
            ->orderBy('name')
            ->get();
    }

    /**
     * Get unique cities
     */
    public static function getCities(): array
    {
        return static::where('is_active', true)
            ->distinct()
            ->pluck('city')
            ->toArray();
    }
}
