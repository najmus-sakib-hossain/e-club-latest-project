<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PopupModalSetting extends Model
{
    protected $fillable = [
        'title',
        'description',
        'button_text',
        'button_link',
        'image_url',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];
}
