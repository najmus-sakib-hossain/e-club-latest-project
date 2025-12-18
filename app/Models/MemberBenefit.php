<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MemberBenefit extends Model
{
    protected $fillable = [
        'title',
        'description',
        'icon',
        'category',
        'order',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeOrdered($query)
    {
        return $query->orderBy('order')->orderBy('title');
    }

    public function scopeOfCategory($query, $category)
    {
        return $query->where('category', $category);
    }
}
