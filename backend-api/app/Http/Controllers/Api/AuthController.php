<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\Validator;

class AuthController extends Controller
{
    /**
     * Handle user registration.
     */
    public function register(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'name'     => 'required|string|max:255',
            'email'    => 'required|string|email|max:255|unique:users,email',
            'password' => 'required|string|min:6',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'ទិន្នន័យចុះឈ្មោះមិនត្រឹមត្រូវ',
                'detail'  => $validator->errors()->first(),
                'errors'  => $validator->errors(),
            ], 422);
        }

        $userData = [
            'name'     => $request->name,
            'email'    => strtolower(trim($request->email)),
            'password' => Hash::make($request->password),
        ];

        // បំពេញ Field បន្ថែមប្រសិនបើមានពិតប្រាកដក្នុង Table users
        try {
            $cols = Schema::getColumnListing('users');
            if (in_array('username', $cols)) {
                $userData['username'] = $request->input('username', strstr($request->email, '@', true));
            }
            if (in_array('user_type', $cols)) {
                $userData['user_type'] = $request->input('user_type', 'admin');
            }
            if (in_array('is_active', $cols)) {
                $userData['is_active'] = true;
            }
        } catch (\Throwable $e) {
            // សុវត្ថិភាព មិនឱ្យ Error ឡើយ
        }

        $user = User::create($userData);

        if (method_exists($user, 'assignRole')) {
            try {
                $user->assignRole('admin');
            } catch (\Throwable $e) {
                // Role might not exist in roles table yet, safe to ignore
            }
        }

        // បង្កើត Token ភ្លាមៗដើម្បីឱ្យអាច Login ដោយស្វ័យប្រវត្តិ
        $token = $user->createToken('auth-token')->plainTextToken;

        $roles = method_exists($user, 'getRoleNames') ? $user->getRoleNames() : [];
        $permissions = method_exists($user, 'getAllPermissions') ? $user->getAllPermissions()->pluck('name') : [];

        return response()->json([
            'message'      => 'ចុះឈ្មោះគណនីបានជោគជ័យ',
            'access_token' => $token,
            'token_type'   => 'Bearer',
            'user'         => [
                'id'          => $user->id,
                'name'        => $user->name,
                'username'    => $user->username ?? $user->name,
                'email'       => $user->email,
                'user_type'   => $user->user_type ?? 'admin',
                'roles'       => $roles,
                'permissions' => $permissions,
            ],
        ], 201);
    }

    /**
     * Handle user login and issue API token.
     */
    public function login(Request $request): JsonResponse
    {
        $loginInput = trim($request->input('email') ?? $request->input('username') ?? '');

        $validator = Validator::make($request->all(), [
            'password' => 'required|string',
        ]);

        if (!$loginInput || $validator->fails()) {
            return response()->json([
                'message' => 'សូមបញ្ចូល Email/Username និង Password ឱ្យបានត្រឹមត្រូវ',
                'detail'  => 'Email/username and password are required',
                'errors'  => $validator->errors(),
            ], 422);
        }

        // ស្វែងរក User ដោយសុវត្ថិភាព មិនឱ្យមាន Error column username does not exist
        $user = null;
        if (filter_var($loginInput, FILTER_VALIDATE_EMAIL) || str_contains($loginInput, '@')) {
            $user = User::where('email', $loginInput)->first();
        } else {
            $user = User::where('name', $loginInput)->orWhere('email', $loginInput)->first();
            if (!$user) {
                try {
                    $user = User::where('username', $loginInput)->first();
                } catch (\Throwable $e) {
                    // បើគ្មាន Column username ក្នុង PostgreSQL មិនឱ្យ Crash ឡើយ
                }
            }
        }

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json([
                'message' => 'Email ឬ Password មិនត្រឹមត្រូវឡើយ',
                'detail'  => 'Invalid email or password',
            ], 401);
        }

        // ពិនិត្យមើលស្ថានភាព Active របស់គណនី (ប្រសិនបើមាន field is_active)
        if (isset($user->is_active) && !$user->is_active) {
            return response()->json([
                'message' => 'គណនីរបស់អ្នកត្រូវបានផ្អាកដំណើរការជាបណ្តោះអាសន្ន',
                'detail'  => 'Your account is currently disabled',
            ], 403);
        }

        // បង្កើត Sanctum Token
        $token = $user->createToken('auth-token')->plainTextToken;

        // ទាញយក Roles និង Permissions (ប្រសិនបើប្រើ Spatie)
        $roles = method_exists($user, 'getRoleNames') ? $user->getRoleNames() : [];
        $permissions = method_exists($user, 'getAllPermissions') ? $user->getAllPermissions()->pluck('name') : [];

        return response()->json([
            'message'      => 'ចូលប្រព័ន្ធបានជោគជ័យ',
            'access_token' => $token,
            'token_type'   => 'Bearer',
            'user'         => [
                'id'          => $user->id,
                'name'        => $user->name ?? $user->username ?? '',
                'username'    => $user->username ?? $user->name ?? '',
                'email'       => $user->email,
                'user_type'   => $user->user_type ?? 'admin',
                'roles'       => $roles,
                'permissions' => $permissions,
            ],
        ], 200);
    }

    /**
     * Handle user logout and revoke current token.
     */
    public function logout(Request $request): JsonResponse
    {
        if ($request->user() && $request->user()->currentAccessToken()) {
            $request->user()->currentAccessToken()->delete();
        }

        return response()->json([
            'message' => 'បានចាកចេញពីប្រព័ន្ធដោយជោគជ័យ',
        ], 200);
    }

    /**
     * Get current authenticated user details.
     */
    public function me(Request $request): JsonResponse
    {
        $user = $request->user();

        $roles = method_exists($user, 'getRoleNames') ? $user->getRoleNames() : [];
        $permissions = method_exists($user, 'getAllPermissions') ? $user->getAllPermissions()->pluck('name') : [];

        return response()->json([
            'user' => [
                'id'          => $user->id,
                'name'        => $user->name ?? $user->username ?? '',
                'username'    => $user->username ?? $user->name ?? '',
                'email'       => $user->email,
                'user_type'   => $user->user_type ?? '',
                'roles'       => $roles,
                'permissions' => $permissions,
            ],
        ], 200);
    }
}
