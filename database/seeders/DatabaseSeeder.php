<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1. Create Demo Mentors
        \App\Models\User::create([
            'id' => 1,
            'name' => 'Ahmad',
            'email' => 'ahmad@mail.com',
            'whatsapp' => '08123456789',
            'role' => 'mentor',
            'password' => \Illuminate\Support\Facades\Hash::make('123456'),
        ]);

        \App\Models\User::create([
            'id' => 2,
            'name' => 'Yusuf',
            'email' => 'yusuf@mail.com',
            'whatsapp' => '08234567890',
            'role' => 'mentor',
            'password' => \Illuminate\Support\Facades\Hash::make('123456'),
        ]);

        // 2. Create Demo Wali Murid
        \App\Models\User::create([
            'id' => 3,
            'name' => 'Budi (Wali)',
            'email' => 'budi@mail.com',
            'whatsapp' => '08345678901',
            'role' => 'wali',
            'murid_id' => 's1',
            'password' => \Illuminate\Support\Facades\Hash::make('123456'),
        ]);

        // 3. Create Demo Murid
        \App\Models\Murid::insert([
            ['id' => 's1', 'nama' => 'Ali bin Ahmad', 'jenisKelamin' => 'L', 'umur' => 10, 'namaOrangTua' => 'Budi', 'whatsappOrangTua' => '08345678901', 'mentorId' => '1'],
            ['id' => 's2', 'nama' => 'Fatimah binti Zahra', 'jenisKelamin' => 'P', 'umur' => 9, 'namaOrangTua' => 'Siti', 'whatsappOrangTua' => '08456789012', 'mentorId' => '1'],
            ['id' => 's3', 'nama' => 'Umar bin Khattab', 'jenisKelamin' => 'L', 'umur' => 11, 'namaOrangTua' => 'Hasan', 'whatsappOrangTua' => '08567890123', 'mentorId' => '1'],
            ['id' => 's4', 'nama' => 'Khadijah binti Hasan', 'jenisKelamin' => 'P', 'umur' => 10, 'namaOrangTua' => 'Ridwan', 'whatsappOrangTua' => '08678901234', 'mentorId' => '2'],
            ['id' => 's5', 'nama' => 'Bilal bin Rabah', 'jenisKelamin' => 'L', 'umur' => 12, 'namaOrangTua' => 'Daud', 'whatsappOrangTua' => '08789012345', 'mentorId' => '2'],
        ]);

        // 4. Create Demo Nilai Ibadah
        \App\Models\NilaiIbadah::insert([
            ['muridId' => 's1', 'mentorId' => '1', 'tanggal' => '2026-03-01', 'sholat' => 85, 'adab' => 90, 'kedisiplinan' => 80, 'keaktifan' => 88, 'catatan' => 'Baik, perlu tingkatkan kedisiplinan'],
            ['muridId' => 's1', 'mentorId' => '1', 'tanggal' => '2026-03-08', 'sholat' => 88, 'adab' => 92, 'kedisiplinan' => 85, 'keaktifan' => 90, 'catatan' => 'Ada peningkatan'],
            ['muridId' => 's2', 'mentorId' => '1', 'tanggal' => '2026-03-01', 'sholat' => 90, 'adab' => 88, 'kedisiplinan' => 92, 'keaktifan' => 85, 'catatan' => 'Sangat baik'],
        ]);

        // 5. Create Demo Nilai Tahsin
        \App\Models\NilaiTahsin::insert([
            ['muridId' => 's1', 'mentorId' => '1', 'tanggal' => '2026-03-01', 'makharijulHuruf' => 80, 'tajwid' => 75, 'kelancaran' => 82, 'adabMembaca' => 90, 'catatan' => 'Perlu latihan makharijul huruf'],
            ['muridId' => 's4', 'mentorId' => '2', 'tanggal' => '2026-03-01', 'makharijulHuruf' => 90, 'tajwid' => 88, 'kelancaran' => 92, 'adabMembaca' => 95, 'catatan' => 'Luar biasa'],
        ]);

        // 6. Create Demo Nilai Doa
        \App\Models\NilaiDoa::insert([
            ['muridId' => 's1', 'mentorId' => '1', 'tanggal' => '2026-03-01', 'hafalan' => 85, 'kelancaran' => 80, 'pemahaman' => 78, 'catatan' => 'Perlu tingkatkan pemahaman'],
            ['muridId' => 's2', 'mentorId' => '1', 'tanggal' => '2026-03-01', 'hafalan' => 92, 'kelancaran' => 90, 'pemahaman' => 88, 'catatan' => 'Sangat baik'],
        ]);
    }
}
