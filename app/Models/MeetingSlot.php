<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MeetingSlot extends Model
{
    use HasFactory;

    protected $fillable = [
        'day_of_week',
        'start_time',
        'end_time',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    /**
     * Days of the week mapping
     */
    public static $days = [
        0 => 'Sunday',
        1 => 'Monday',
        2 => 'Tuesday',
        3 => 'Wednesday',
        4 => 'Thursday',
        5 => 'Friday',
        6 => 'Saturday',
    ];

    /**
     * Get the day name
     */
    public function getDayNameAttribute()
    {
        return self::$days[$this->day_of_week] ?? 'Unknown';
    }

    /**
     * Scope for active slots
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Scope for specific day
     */
    public function scopeForDay($query, $dayOfWeek)
    {
        return $query->where('day_of_week', $dayOfWeek);
    }

    /**
     * Get time slots for a specific date
     */
    public static function getTimeSlotsForDate($date)
    {
        $dayOfWeek = $date->dayOfWeek;
        $slots = self::active()->forDay($dayOfWeek)->orderBy('start_time')->get();

        $timeSlots = [];
        foreach ($slots as $slot) {
            $start = \Carbon\Carbon::parse($slot->start_time);
            $end = \Carbon\Carbon::parse($slot->end_time);

            while ($start < $end) {
                $timeSlots[] = $start->format('h:i A');
                $start->addMinutes(30);
            }
        }

        return $timeSlots;
    }

    /**
     * Get the weekly schedule
     */
    public static function getWeeklySchedule()
    {
        $schedule = [];
        $slots = self::active()->orderBy('day_of_week')->orderBy('start_time')->get();

        foreach ($slots as $slot) {
            $dayName = $slot->day_name;
            if (! isset($schedule[$dayName])) {
                $schedule[$dayName] = [];
            }
            $schedule[$dayName][] = [
                'start' => \Carbon\Carbon::parse($slot->start_time)->format('h:i A'),
                'end' => \Carbon\Carbon::parse($slot->end_time)->format('h:i A'),
            ];
        }

        return $schedule;
    }
}
