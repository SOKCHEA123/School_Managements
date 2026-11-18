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
            'name'       => 'required|string|max:255',
            'email'      => 'required|string|email|max:255|unique:users,email',
            'student_id' => 'nullable|string|unique:users,student_id', // បន្ថែម student_id បើចង់
            'password'   => 'required|string|min:6',
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

        // បន្ថែម student_id ប្រសិនបើមានបញ្ជូនមក
        if ($request->has('student_id')) {
            $userData['student_id'] = $request->student_id;
        }

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
                'student_id'  => $user->student_id ?? null, // បង្ហាញ student_id
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
        // ១. ទទួលយក student_id ជាអាទិភាព (ឬ email/username បើមានប្រើដដែល)
        $loginInput = trim(
            $request->input('student_id') ?? 
            $request->input('email') ?? 
            $request->input('username') ?? 
            ''
        );

        $validator = Validator::make($request->all(), [
            'password' => 'required|string',
        ]);

        if (!$loginInput || $validator->fails()) {
            return response()->json([
                'message' => 'សូមបញ្ចូល លេខសម្គាល់សិស្ស (Student ID) និង Password ឱ្យបានត្រឹមត្រូវ',
                'detail'  => 'Student ID/Email and password are required',
                'errors'  => $validator->errors(),
            ], 422);
        }

        // ២. ស្វែងរក User ដោយផ្តល់អាទិភាពទៅ student_id មុនគេ
        $user = null;
        try {
            if (Schema::hasColumn('users', 'student_id')) {
                $user = User::where('student_id', $loginInput)->first();
            }
        } catch (\Throwable $e) {}

        // ស្វែងរកតាមតារាង students (student_code)
        if (!$user) {
            try {
                $student = \App\Models\Student::where('student_code', $loginInput)->first();
                if ($student && $student->user_id) {
                    $user = User::find($student->user_id);
                }
            } catch (\Throwable $e) {}
        }

        // ៣. បើរកមិនឃើញតាម student_id ទេ សូមរកតាម email ឬ username វិញ (សម្រាប់ Admin)
        if (!$user) {
            if (filter_var($loginInput, FILTER_VALIDATE_EMAIL) || str_contains($loginInput, '@')) {
                $user = User::where('email', $loginInput)->first();
            } else {
                $user = User::where('name', $loginInput)->orWhere('email', $loginInput)->first();
                if (!$user) {
                    try {
                        $user = User::where('username', $loginInput)->first();
                    } catch (\Throwable $e) {
                        // បើគ្មាន Column username ក្នុង Database មិនឱ្យ Crash ឡើយ
                    }
                }
            }
        }

        // ៤. ផ្ទៀងផ្ទាត់ Password
        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json([
                'message' => 'លេខសម្គាល់សិស្ស ឬ Password មិនត្រឹមត្រូវឡើយ',
                'detail'  => 'Invalid credentials',
            ], 401);
        }

        // ៥. ពិនិត្យមើលស្ថានភាព Active
        if (isset($user->is_active) && !$user->is_active) {
            return response()->json([
                'message' => 'គណនីរបស់អ្នកត្រូវបានផ្អាកដំណើរការជាបណ្តោះអាសន្ន',
                'detail'  => 'Your account is currently disabled',
            ], 403);
        }

        // ៦. បង្កើត Sanctum Token
        $token = $user->createToken('auth-token')->plainTextToken;

        $roles = method_exists($user, 'getRoleNames') ? $user->getRoleNames() : [];
        $permissions = method_exists($user, 'getAllPermissions') ? $user->getAllPermissions()->pluck('name') : [];

        $studentModel = null;
        try {
            $studentModel = $user->student ? $user->student : \App\Models\Student::where('user_id', $user->id)->orWhere('student_code', $user->student_id)->first();
            if ($studentModel && $studentModel->classroom_id) {
                $studentModel->loadMissing('classroom');
            }
        } catch (\Throwable $e) {}

        return response()->json([
            'message'      => 'ចូលប្រព័ន្ធបានជោគជ័យ',
            'access_token' => $token,
            'token_type'   => 'Bearer',
            'user'         => [
                'id'          => $studentModel ? $studentModel->id : $user->id,
                'user_id'     => $user->id,
                'name'        => $user->name ?? $user->username ?? '',
                'nameKh'      => $studentModel ? ($studentModel->full_name_km ?? $user->name) : $user->name,
                'nameEn'      => $studentModel ? ($studentModel->full_name_en ?? $user->name) : $user->name,
                'student_id'  => $studentModel ? ($studentModel->student_code ?? $user->student_id) : ($user->student_id ?? 'STU001'),
                'username'    => $user->username ?? $user->name ?? '',
                'email'       => $user->email,
                'gender'      => $studentModel ? $studentModel->gender : 'male',
                'dob'         => $studentModel ? $studentModel->dob : null,
                'grade'       => $studentModel && $studentModel->classroom ? $studentModel->classroom->name : '12A',
                'classroom'   => $studentModel ? $studentModel->classroom : null,
                'phone'       => $studentModel ? $studentModel->parent_phone : '',
                'user_type'   => $user->user_type ?? ($studentModel ? 'student' : 'admin'),
                'roles'       => $roles,
                'permissions' => $permissions,
                'student'     => $studentModel,
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

        $studentModel = null;
        try {
            $studentModel = $user->student ? $user->student : \App\Models\Student::where('user_id', $user->id)->orWhere('student_code', $user->student_id)->first();
            if ($studentModel && $studentModel->classroom_id) {
                $studentModel->loadMissing('classroom');
            }
        } catch (\Throwable $e) {}

        return response()->json([
            'user' => [
                'id'          => $studentModel ? $studentModel->id : $user->id,
                'user_id'     => $user->id,
                'name'        => $user->name ?? $user->username ?? '',
                'nameKh'      => $studentModel ? ($studentModel->full_name_km ?? $user->name) : $user->name,
                'nameEn'      => $studentModel ? ($studentModel->full_name_en ?? $user->name) : $user->name,
                'student_id'  => $studentModel ? ($studentModel->student_code ?? $user->student_id) : ($user->student_id ?? 'STU001'),
                'username'    => $user->username ?? $user->name ?? '',
                'email'       => $user->email,
                'gender'      => $studentModel ? $studentModel->gender : 'male',
                'dob'         => $studentModel ? $studentModel->dob : null,
                'grade'       => $studentModel && $studentModel->classroom ? $studentModel->classroom->name : '12A',
                'classroom'   => $studentModel ? $studentModel->classroom : null,
                'phone'       => $studentModel ? $studentModel->parent_phone : '',
                'user_type'   => $user->user_type ?? ($studentModel ? 'student' : ''),
                'roles'       => $roles,
                'permissions' => $permissions,
                'student'     => $studentModel,
            ],
        ], 200);
    }
}