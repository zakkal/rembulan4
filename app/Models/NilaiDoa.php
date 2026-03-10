<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class NilaiDoa extends Model
{
    use HasFactory;

    protected $fillable = [
        'muridId',
        'mentorId',
        'tanggal',
        'hafalan',
        'kelancaran',
        'pemahaman',
        'catatan',
    ];
}
