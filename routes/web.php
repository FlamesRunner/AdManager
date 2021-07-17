<?php

use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\SectionsController;
use App\Http\Controllers\MediaController;
use App\Http\Controllers\AdsController;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

// Dashboard routes
// TODO: Move routes into dedicated files

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::get('/manage/ads', function () {
    return Inertia::render('AdsDashboard');
})->middleware(['auth', 'verified'])->name('adsDashboard');

Route::get('/manage/sections', function () {
    return Inertia::render('SectionsDashboard');
})->middleware(['auth', 'verified'])->name('sectionsDashboard');

Route::get('/manage/media', function () {
    return Inertia::render('MediaDashboard');
})->middleware(['auth', 'verified'])->name('mediaDashboard');

// Section routes

Route::get('/sections/list', [SectionsController::class, 'index'])->middleware(['auth', 'verified'])->name('listSections');

Route::get('/sections/search', [SectionsController::class, 'search'])->middleware(['auth', 'verified'])->name('searchSections');

Route::get('/sections/create', function () {
    return Inertia::render('SectionsCreate');
})->middleware(['auth', 'verified'])->name('createSectionPage');
Route::post('/sections/new', [SectionsController::class, 'create'])->middleware(['auth', 'verified'])->name('createSection');

Route::post('/sections/delete', [SectionsController::class, 'destroy'])->middleware(['auth', 'verified'])->name('deleteSection');

Route::post('/sections/update', [SectionsController::class, 'update'])->middleware(['auth', 'verified'])->name('updateSection');

// Media routes

Route::get('/media/list', [MediaController::class, 'index'])->middleware(['auth', 'verified'])->name('listMedia');

Route::get('/media/get/{id}', [MediaController::class, 'show'])->middleware(['auth', 'verified'])->name('getMedia');

Route::get('/media/search', [MediaController::class, 'search'])->middleware(['auth', 'verified'])->name('searchMedia');

Route::post('/media/store', [MediaController::class, 'create'])->middleware(['auth', 'verified'])->name('storeMedia');

Route::post('/media/delete', [MediaController::class, 'destroy'])->middleware(['auth', 'verified'])->name('deleteMedia');

// Ad routes

Route::get('/ads/list', [AdsController::class, 'index'])->middleware(['auth', 'verified'])->name('listAds');

Route::get('/ads/create', function () {
    return Inertia::render('AdsCreate');
})->middleware(['auth', 'verified'])->name('createAdPage');

Route::post('/ads/new', [AdsController::class, 'create'])->middleware(['auth', 'verified'])->name('createAd');

Route::post('/ads/delete', [AdsController::class, 'destroy'])->middleware(['auth', 'verified'])->name('deleteAd');

Route::get('/ads/edit/{id}', [AdsController::class, 'edit'])->middleware(['auth', 'verified'])->name('editAd');

Route::post('/ads/update', [AdsController::class, 'update'])->middleware(['auth', 'verified'])->name('updateAd');

require __DIR__.'/auth.php';
