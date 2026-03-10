<?php

namespace App\Http\Controllers;

use App\Models\Murid;
use App\Models\NilaiIbadah;
use App\Models\NilaiTahsin;
use App\Models\NilaiDoa;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class DataController extends Controller
{
    public function getMurids() {
        Log::info('API: Fetching all murids');
        return response()->json(Murid::all());
    }

    public function saveMurids(Request $request) {
        $items = $request->all();
        \Log::info('API: Received Sync Request', ['count' => count($items)]);
        
        foreach ($items as $item) {
            $murid = Murid::firstOrNew(['id' => $item['id']]);
            $murid->fill($item);
            $murid->save();
        }
        return response()->json(['success' => true]);
    }

    public function getNilaiIbadah() {
        return response()->json(NilaiIbadah::all());
    }

    public function getNilaiTahsin() {
        return response()->json(NilaiTahsin::all());
    }

    public function getNilaiDoa() {
        return response()->json(NilaiDoa::all());
    }

    public function saveNilaiIbadah(Request $request) {
        $items = $request->all();
        Log::info('API: Saving Nilai Ibadah', ['count' => count($items)]);
        foreach ($items as $item) {
            NilaiIbadah::updateOrCreate(['id' => $item['id']], $item);
        }
        return response()->json(['success' => true]);
    }

    public function saveNilaiTahsin(Request $request) {
        $items = $request->all();
        Log::info('API: Saving Nilai Tahsin', ['count' => count($items)]);
        foreach ($items as $item) {
            NilaiTahsin::updateOrCreate(['id' => $item['id']], $item);
        }
        return response()->json(['success' => true]);
    }

    public function saveNilaiDoa(Request $request) {
        $items = $request->all();
        Log::info('API: Saving Nilai Doa', ['count' => count($items)]);
        foreach ($items as $item) {
            NilaiDoa::updateOrCreate(['id' => $item['id']], $item);
        }
        return response()->json(['success' => true]);
    }
}
