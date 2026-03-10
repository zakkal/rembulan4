<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    public function register(Request $request) {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:6',
            'whatsapp' => 'required|string',
            'role' => 'required|string|in:mentor,wali',
            'muridId' => 'nullable|string'
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'whatsapp' => $request->whatsapp,
            'role' => $request->role,
            'murid_id' => $request->muridId
        ]);

        return response()->json([
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'whatsapp' => $user->whatsapp,
            'role' => $user->role,
            'muridId' => $user->murid_id,
        ], 201);
    }

    public function login(Request $request) {
        $credentials = $request->validate([
            'email' => 'required|email',
            'password' => 'required',
            'role' => 'required|string'
        ]);

        if (Auth::attempt(['email' => $credentials['email'], 'password' => $credentials['password']])) {
            $user = Auth::user();
            if ($user->role !== $credentials['role']) {
                Auth::logout();
                return response()->json(['message' => 'Role tidak sesuai'], 403);
            }

            return response()->json([
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'whatsapp' => $user->whatsapp,
                'role' => $user->role,
                'muridId' => $user->murid_id,
            ]);
        }

        return response()->json(['message' => 'Invalid credentials'], 401);
    }
}
