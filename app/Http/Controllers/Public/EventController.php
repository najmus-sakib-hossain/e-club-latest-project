<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\Event;
use Inertia\Inertia;

class EventController extends Controller
{
    public function upcoming()
    {
        $events = Event::active()->upcoming()->get();
        return Inertia::render('events/upcoming', [
            'events' => $events,
        ]);
    }

    public function past()
    {
        $events = Event::active()->past()->get();
        return Inertia::render('events/past', [
            'events' => $events,
        ]);
    }

    public function show($slug)
    {
        $event = Event::where('slug', $slug)->where('is_active', true)->firstOrFail();
        return Inertia::render('events/show', [
            'event' => $event,
        ]);
    }

    public function request()
    {
        return Inertia::render('events/request');
    }
}
