<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
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
        ]);
        $newAd = Ad::create([
            'name' => $request->name,
            'priority' => $request->priority,
            'usingMediaId' => $request->usingMediaId,
            'sectionId' => $request->sectionId,
            'startingOn' => strtotime($request->startingOn),
            'endingOn' => strtotime($request->endingOn)
        ]);
        if ($newAd) {
            return redirect(route('adsDashboard'), 302);
        }
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
            return response()->json(["status" => 200, "imageData" => ""]);
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
                return response()->json(["status" => 200, "imageData" => $image]);
            }
            $current_priority += $ad->priority;
        }
        return response()->json(["status" => 200, "imageData" => ""]);
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
