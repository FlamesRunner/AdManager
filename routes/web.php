<?php

use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\SectionsController;

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

Route::get('/sections/create', function () {
    return Inertia::render('SectionsCreate');
})->middleware(['auth', 'verified'])->name('createSectionPage');
Route::post('/sections/new', [SectionsController::class, 'create'])->middleware(['auth', 'verified'])->name('createSection');

Route::post('/sections/delete', [SectionsController::class, 'destroy'])->middleware(['auth', 'verified'])->name('deleteSection');

Route::post('/sections/update', [SectionsController::class, 'update'])->middleware(['auth', 'verified'])->name('updateSection');


require __DIR__.'/auth.php';
