<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CommitteeMember extends Model
{
    protected $fillable = [
        'name',
        'role',
        'designation',
        'committee_type',
        'year',
        'description',
        'image',
        'email',
        'phone',
        'linkedin',
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
        return $query->orderBy('order')->orderBy('name');
    }

    public function scopeOfType($query, $type)
    {
        return $query->where('committee_type', $type);
    }

    public function scopeOfYear($query, $year)
    {
        return $query->where('year', $year);
    }
}
