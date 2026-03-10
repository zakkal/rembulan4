<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('murids', function (Blueprint $table) {
            $table->string('id')->primary(); // Using string ID like s1, s2
            $table->string('nama');
            $table->enum('jenisKelamin', ['L', 'P']);
            $table->integer('umur');
            $table->string('namaOrangTua');
            $table->string('whatsappOrangTua');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('murids');
    }
};
