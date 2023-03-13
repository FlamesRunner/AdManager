<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Ad;
use App\Models\Section;
use App\Models\Media;

class AdsController extends Controller
{
    /**
     * Run required tasks.
     */
    public function __construct() {
        Ad::where('endingOn', '<', time())->delete();
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $ads = Ad::orderBy('name', 'ASC')->get();
        return response()->json(['status' => 200, 'ads' => $ads, 'sections' => Section::get()]);
    }

    /**
     * Create a new ad in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function create(Request $request)
    {
        $request->validate([
            'name' => 'required|unique:ads|max:255',
            'priority' => 'required|integer|gt:0',
            'usingMediaId' => 'required|integer|gt:0',
            'sectionId' => 'required|integer|gt:0',
            'startingOn' => 'required|date|before:endingOn',
            'endingOn' => 'required|date|after:startingOn',
            'url' => 'required|url',
            "tagLine" => 'required|min:5|max:512'
        ]);
        $newAd = Ad::create([
            'name' => $request->name,
            'priority' => $request->priority,
            'usingMediaId' => $request->usingMediaId,
            'sectionId' => $request->sectionId,
            'startingOn' => strtotime($request->startingOn . ' America/New_York'),
            'endingOn' => strtotime($request->endingOn . ' America/New_York'),
            'url' => $request->url,
            'tagLine' => $request->tagLine
        ]);
        if ($newAd) {
            return redirect(route('adsDashboard'), 302);
        }
    }

    /**
     * Update the specified ad in storage.
     * 
     * @param \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request) {
        $request->validate([
            'name' => 'required|max:255',
            'priority' => 'required|integer|gt:0',
            'usingMediaId' => 'required|integer|gt:0',
            'sectionId' => 'required|integer|gt:0',
            'startingOn' => 'required|date|before:endingOn',
            'endingOn' => 'required|date|after:startingOn',
            'url' => 'required|url',
            "tagLine" => 'required|min:5|max:512'
        ]);
        $ad = Ad::find($request->id);
        $ad->name = $request->name;
        $ad->priority = $request->priority;
        $ad->usingMediaId = $request->usingMediaId;
        $ad->sectionId = $request->sectionId;
        $ad->startingOn = strtotime($request->startingOn . ' America/New_York');
        $ad->endingOn = strtotime($request->endingOn . ' America/New_York');
        $ad->url = $request->url;
        $ad->tagLine = $request->tagLine;
        $ad->save();
        return redirect(route('adsDashboard'), 302);
    }

    /**
     * Show the form for editing the specified ad.
     * 
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id) {
        $ad = Ad::find($id);
        if (empty($ad)) return redirect(route('adsDashboard'));
        return Inertia::render('AdsUpdate', ['ad' => $ad]);
    }


    /**
     * Retrieve the appropriate ad given the section name.
     *
     * @param  string   $section_name
     * @return \Illuminate\Http\Response
     */
    public function showAdBySection($section_name)
    {
        $section_object = Section::where('name', $section_name)->first();
        if (!$section_object) return response()->json(["status" => 404, "error" => "Section not found"], 404);
        $section_id = $section_object->id;
        $current_time = time();
        $ads = Ad::where('sectionId', '=', $section_id)
            ->where('startingOn', '<', $current_time)
            ->where('endingOn', '>', $current_time)
            ->get();

        if ($ads->count() == 0) {
            return response()->json(["status" => 418, "imageData" => ""], 418);
        }

        $priority_end = Ad::where('sectionId', '=', $section_id)
            ->where('startingOn', '<', $current_time)
            ->where('endingOn', '>', $current_time)
            ->sum('priority');
        $choose_ad = rand(0, $priority_end - 1);

        $current_priority = 0;
        foreach ($ads as $ad) {
            $lower_bound = $current_priority;
            $upper_bound = $current_priority + $ad->priority;
            if ($choose_ad >= $lower_bound && $choose_ad < $upper_bound) {
                $image = base64_encode(file_get_contents(base_path() . "/" . env("IMAGE_DIR", "images") . "/" . Media::find($ad->usingMediaId)->name));
                return response()->json(["status" => 200, "imageData" => $image, "url" => $ad->url, "tagline" => $ad->tagLine]);
            }
            $current_priority += $ad->priority;
        }
        return response()->json(["status" => 418, "imageData" => ""], 418);
    }

    /**
     * Retrieve the appropriate ad given the section name, with the condition that instead of an API response on success,
     * the image blob is returned.
     * @param  string   $section_name
     * @return \Illuminate\Http\Response
     */
    public function showAdBySectionImage($section_name) {
        $section_object = Section::where('name', $section_name)->first();
        if (!$section_object) return response()->json(["status" => 404, "error" => "Section not found"], 404);
        $section_id = $section_object->id;
        $current_time = time();
        $ads = Ad::where('sectionId', '=', $section_id)
            ->where('startingOn', '<', $current_time)
            ->where('endingOn', '>', $current_time)
            ->get();

        if ($ads->count() == 0) {
            return response([], 404);
        }

        $priority_end = Ad::where('sectionId', '=', $section_id)
            ->where('startingOn', '<', $current_time)
            ->where('endingOn', '>', $current_time)
            ->sum('priority');
        $choose_ad = rand(0, $priority_end - 1);

        $current_priority = 0;
        foreach ($ads as $ad) {
            $lower_bound = $current_priority;
            $upper_bound = $current_priority + $ad->priority;
            if ($choose_ad >= $lower_bound && $choose_ad < $upper_bound) {
                return response()->file(base_path() . "/" . env("IMAGE_DIR", "images") . "/" . Media::find($ad->usingMediaId)->name);
            }
            $current_priority += $ad->priority;
        }
        return response([], 404);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \Illuminate\Http\Request $request
     * @return \Illuminate\Http\Response
     */
    public function destroy(Request $request)
    {
        $ad = Ad::find($request->id);
        if ($ad->delete()) {
            return response()->json(["status" => 200]);
        }
    }


}
