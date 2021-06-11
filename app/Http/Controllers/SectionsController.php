<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Section;

class SectionsController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $sections = Section::orderBy('name', 'ASC')->get();
        return response()->json(['status' => 200, 'sections' => $sections]);
    }

    /**
     * Create a new section in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function create(Request $request)
    {
        $request->validate([
            'name' => 'required|unique:sections|max:255',
        ]);
        $newSection = Section::create([
            'name' => $request->name,
        ]);
        if ($newSection) {
            return redirect(route('sectionsDashboard'), 302);
        }
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $sections = Section::find($id);
        return response()->json(['status' => 200, 'sections' => $sections]);
    }

    /**
     * Display the specified resource.
     *
     * @param   \Illuminate\Http\Request    $request
     * @return  \Illuminate\Http\Response
     */
    public function search(Request $request)
    {
        if ($request->has('name')) {
            return response()->json(['status' => 200, 'results' => Section::where('name', 'like', '%' . $request->name . '%')->orderBy('name')->take(5)->get()]);
        }

        return response()->json(['status' => 200, 'results' => []]);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request)
    {
        $section = Section::find($request->id);
        $section->name = $request->name;
        if ($section->save()) {
            return response()->json(["status" => 200]);
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
        $section = Section::find($request->id);
        if ($section->delete()) {
            return response()->json(["status" => 200]);
        }
    }
}
