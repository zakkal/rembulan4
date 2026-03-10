<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class NilaiTahsin extends Model
{
    use HasFactory;

    protected $fillable = [
        'muridId',
        'mentorId',
        'tanggal',
        'makharijulHuruf',
        'tajwid',
        'kelancaran',
        'adabMembaca',
        'catatan',
    ];
}
