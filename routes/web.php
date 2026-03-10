<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/

Route::get('/debug-db', function() {
    return response()->json([
        'connection' => config('database.default'),
        'database' => config('database.connections.mysql.database'),
        'host' => config('database.connections.mysql.host'),
        'user' => config('database.connections.mysql.username'),
        'murid_count' => \App\Models\Murid::count(),
        'first_murid' => \App\Models\Murid::first(),
    ]);
});

Route::get('/{any}', function () {
    return view('welcome');
})->where('any', '.*');
