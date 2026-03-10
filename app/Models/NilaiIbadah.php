<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class NilaiIbadah extends Model
{
    use HasFactory;

    protected $fillable = [
        'muridId',
        'mentorId',
        'tanggal',
        'sholat',
        'adab',
        'kedisiplinan',
        'keaktifan',
        'catatan',
    ];
}
