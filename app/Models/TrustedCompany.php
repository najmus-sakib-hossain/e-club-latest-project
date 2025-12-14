<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class TrustedCompany extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'logo',
        'logo_url',
        'website',
        'order',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'order' => 'integer',
    ];

    protected $appends = ['sort_order'];

    /**
     * Get sort_order attribute (alias for order)
     */
    public function getSortOrderAttribute(): int
    {
        return $this->order ?? 0;
    }

    /**
     * Scope to get only active companies
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Scope to order by position
     */
    public function scopeOrdered($query)
    {
        return $query->orderBy('order');
    }
}
