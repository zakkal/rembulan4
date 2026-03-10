<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\DataController;

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
