<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Ad;

class AdsController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $ads = Ad::orderBy('name', 'ASC')->get();
        return response()->json(['status' => 200, 'ads' => $ads]);
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
