<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('nilai_doas', function (Blueprint $table) {
            $table->id();
            $table->string('muridId');
            $table->string('mentorId');
            $table->date('tanggal');
            $table->integer('hafalan');
            $table->integer('kelancaran');
            $table->integer('pemahaman');
            $table->text('catatan')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('nilai_doas');
    }
};
