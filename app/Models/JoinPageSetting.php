<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class JoinPageSetting extends Model
{
    protected $fillable = [
        'setting_key',
        'setting_value',
        'setting_type',
    ];

    /**
     * Get a setting value by key
     */
    public static function get(string $key, $default = null)
    {
        $setting = static::where('setting_key', $key)->first();
        
        if (!$setting) {
            return $default;
        }
        
        return match ($setting->setting_type) {
            'json' => json_decode($setting->setting_value, true),
            'boolean' => (bool) $setting->setting_value,
            'number' => (float) $setting->setting_value,
            default => $setting->setting_value,
        };
    }

    /**
     * Set a setting value
     */
    public static function set(string $key, $value, string $type = 'text')
    {
        $settingValue = match ($type) {
            'json' => json_encode($value),
            'boolean' => (int) $value,
            default => (string) $value,
        };
        
        return static::updateOrCreate(
            ['setting_key' => $key],
            [
                'setting_value' => $settingValue,
                'setting_type' => $type,
            ]
        );
    }

    /**
     * Get all settings as key-value pairs
     */
    public static function getAll()
    {
        return static::all()->mapWithKeys(function ($setting) {
            $value = match ($setting->setting_type) {
                'json' => json_decode($setting->setting_value, true),
                'boolean' => (bool) $setting->setting_value,
                'number' => (float) $setting->setting_value,
                default => $setting->setting_value,
            };
            
            return [$setting->setting_key => $value];
        });
    }
}
