<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\MediaPost;
use Inertia\Inertia;

class MediaController extends Controller
{
    public function notices()
    {
        $posts = MediaPost::active()->ofType('notice')->ordered()->get();
        return Inertia::render('media/notices', [
            'posts' => $posts,
        ]);
    }

    public function pressReleases()
    {
        $posts = MediaPost::active()->ofType('press_release')->ordered()->get();
        return Inertia::render('media/press-releases', [
            'posts' => $posts,
        ]);
    }

    public function albums()
    {
        $albums = MediaPost::active()->ofType('album')->ordered()->get();
        return Inertia::render('media/albums', [
            'albums' => $albums,
        ]);
    }

    public function newsletters()
    {
        $newsletters = MediaPost::active()->ofType('newsletter')->ordered()->get();
        return Inertia::render('media/newsletters', [
            'newsletters' => $newsletters,
        ]);
    }

    public function blog()
    {
        $posts = MediaPost::active()->ofType('blog')->ordered()->get();
        return Inertia::render('media/blog', [
            'posts' => $posts,
        ]);
    }

    public function show($slug)
    {
        $post = MediaPost::where('slug', $slug)->where('is_active', true)->firstOrFail();
        return Inertia::render('media/show', [
            'post' => $post,
        ]);
    }
}
