<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Media;
use App\Models\Ad;

class MediaController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $media = Media::orderBy('name', 'ASC')->get();
        return response()->json(['status' => 200, 'media' => $media]);
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
            'image' => 'required|image|mimes:jpeg,png,jpg,gif|max:10240',
        ]);

        $imageName = pathinfo($request->image->getClientOriginalName(), PATHINFO_FILENAME) . '-' . bin2hex(openssl_random_pseudo_bytes(4)) .  '.' . pathinfo($request->image->getClientOriginalName(), PATHINFO_EXTENSION);

        $path = $request->image->move(base_path() . "/" . env('IMAGE_DIR'), $imageName);

        $newImage = Media::create([
            'name' => $imageName,
            'size' => $path->getSize() / 1024
        ]);

        if ($newImage) {
            return response()->json(['status' => 200, 'uploaded' => true]);
        } else {
            return response()->json(['status' => 200, 'uploaded' => false]);
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
        $media = Media::find($id);
        if (!$media) return response('Not found', 404);
        return response()->file(base_path() . "/" . env("IMAGE_DIR", "images") . "/" . $media->name);
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
            return response()->json(['status' => 200, 'results' => Media::where('name', 'like', '%' . $request->name . '%')->orderBy('name')->take(5)->get()]);
        }

        return response()->json(['status' => 200, 'results' => []]);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \Illuminate\Http\Request $request
     * @return \Illuminate\Http\Response
     */
    public function destroy(Request $request)
    {
        $image = Media::find($request->id);
        $adCount = Ad::where('usingMediaId', '=', $request->id)->count();
        if ($adCount > 0) {
            return response()->json(["status" => 200, "msg" => "One or more ads still use this image."]);
        }
        if ($image->delete()) {
            unlink(base_path() . "/" . env("IMAGE_DIR", "images") . "/" . $image->name);
            return response()->json(["status" => 200]);
        }
    }
}
