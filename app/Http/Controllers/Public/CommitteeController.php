<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\CommitteeMember;
use Inertia\Inertia;

class CommitteeController extends Controller
{
    public function advisors()
    {
        $members = CommitteeMember::active()->ofType('advisors')->ordered()->get();
        return Inertia::render('committee/advisors', [
            'members' => $members,
        ]);
    }

    public function governingBody()
    {
        $members = CommitteeMember::active()->ofType('governing_body')->ordered()->get();
        return Inertia::render('committee/governing-body', [
            'members' => $members,
        ]);
    }

    public function executiveBody()
    {
        $members = CommitteeMember::active()->ofType('executive_body')->ordered()->get();
        return Inertia::render('committee/executive-body', [
            'members' => $members,
        ]);
    }

    public function founders()
    {
        $members = CommitteeMember::active()->ofType('founders')->ordered()->get();
        return Inertia::render('committee/founders', [
            'members' => $members,
        ]);
    }

    public function alumni()
    {
        $members = CommitteeMember::active()->ofType('alumni')->ordered()->get();
        $years = $members->pluck('year')->unique()->sort()->reverse()->values();
        return Inertia::render('committee/alumni', [
            'members' => $members,
            'years' => $years,
        ]);
    }

    public function forums()
    {
        $forums = CommitteeMember::active()->ofType('forums')->ordered()->get();
        return Inertia::render('committee/forums', [
            'forums' => $forums,
        ]);
    }

    public function standingCommittee()
    {
        $committees = CommitteeMember::active()->ofType('standing_committee')->ordered()->get();
        return Inertia::render('committee/standing-committee', [
            'committees' => $committees,
        ]);
    }

    public function projectDirectors()
    {
        $directors = CommitteeMember::active()->ofType('project_directors')->ordered()->get();
        return Inertia::render('committee/project-directors', [
            'directors' => $directors,
        ]);
    }

    public function administrativeTeam()
    {
        $team = CommitteeMember::active()->ofType('administrative_team')->ordered()->get();
        return Inertia::render('committee/administrative-team', [
            'team' => $team,
        ]);
    }
}
