<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('nilai_tahsins', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->string('muridId');
            $table->string('mentorId');
            $table->date('tanggal');
            $table->integer('makharijulHuruf');
            $table->integer('tajwid');
            $table->integer('kelancaran');
            $table->integer('adabMembaca');
            $table->text('catatan')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('nilai_tahsins');
    }
};
