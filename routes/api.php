<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\DataController;
use Illuminate\Http\Request;

\Log::info('API: Request Entry', ['method' => request()->method(), 'path' => request()->path()]);

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::get('/murids', [DataController::class, 'getMurids']);
Route::post('/murids', [DataController::class, 'saveMurids']);
Route::get('/nilai-ibadah', [DataController::class, 'getNilaiIbadah']);
Route::get('/nilai-tahsin', [DataController::class, 'getNilaiTahsin']);
Route::get('/nilai-doa', [DataController::class, 'getNilaiDoa']);

Route::post('/nilai-ibadah', [DataController::class, 'saveNilaiIbadah']);
Route::post('/nilai-tahsin', [DataController::class, 'saveNilaiTahsin']);
Route::post('/nilai-doa', [DataController::class, 'saveNilaiDoa']);

Route::any('{any}', function (Request $request) {
    \Log::info('API UNMATCHED: ' . $request->method() . ' ' . $request->fullUrl());
    return response()->json(['error' => 'API route not found'], 404);
})->where('any', '.*');
