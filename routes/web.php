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

Route::get('/test-db-save', function() {
    try {
        $m = \App\Models\Murid::create([
            'id' => 'test_' . time(),
            'nama' => 'Test ' . date('H:i:s'),
            'jenisKelamin' => 'L',
            'umur' => 10,
            'namaOrangTua' => 'Parent',
            'whatsappOrangTua' => '0812'
        ]);
        return response()->json(['success' => true, 'murid' => $m]);
    } catch (\Exception $e) {
        return response()->json(['success' => false, 'error' => $e->getMessage()]);
    }
});

Route::get('/{any}', function () {
    return view('welcome');
})->where('any', '.*');
