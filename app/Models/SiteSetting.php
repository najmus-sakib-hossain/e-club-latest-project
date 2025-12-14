<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class SiteSetting extends Model
{
    use HasFactory;

    protected $fillable = [
        'key',
        'value',
        'type',
        'group',
    ];

    /**
     * Get a setting by key
     */
    public static function get(string $key, $default = null)
    {
        $setting = static::where('key', $key)->first();
        
        if (!$setting) {
            return $default;
        }

        // Parse JSON values
        if ($setting->type === 'json') {
            return json_decode($setting->value, true) ?? $default;
        }

        return $setting->value ?? $default;
    }

    /**
     * Set a setting value
     */
    public static function set(string $key, $value, string $type = 'text', string $group = 'general'): void
    {
        // Convert arrays to JSON
        if (is_array($value)) {
            $value = json_encode($value);
            $type = 'json';
        }

        static::updateOrCreate(
            ['key' => $key],
            [
                'value' => $value,
                'type' => $type,
                'group' => $group,
            ]
        );
    }

    /**
     * Get all settings grouped
     */
    public static function getAllGrouped(): array
    {
        $settings = static::all()->groupBy('group');
        
        $result = [];
        foreach ($settings as $group => $items) {
            foreach ($items as $item) {
                $value = $item->value;
                if ($item->type === 'json') {
                    $value = json_decode($value, true);
                }
                $result[$group][$item->key] = $value;
            }
        }
        
        return $result;
    }

    /**
     * Get settings by group
     */
    public static function getByGroup(string $group): array
    {
        $settings = static::where('group', $group)->get();
        
        $result = [];
        foreach ($settings as $item) {
            $value = $item->value;
            if ($item->type === 'json') {
                $value = json_decode($value, true);
            }
            $result[$item->key] = $value;
        }
        
        return $result;
    }

    /**
     * Get all settings as a flat key-value object
     */
    public static function getAllFlat(): object
    {
        $settings = static::all();
        
        $result = [];
        foreach ($settings as $item) {
            $value = $item->value;
            if ($item->type === 'json') {
                $value = json_decode($value, true);
            }
            $result[$item->key] = $value;
        }
        
        return (object) $result;
    }
}
