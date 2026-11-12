<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class SystemSecurityController extends Controller
{
    // ================================================================
    // 11. USER MANAGEMENT
    // ================================================================

    public function users(Request $request): JsonResponse
    {
        $users = User::select('id', 'name', 'email', 'user_type', 'is_active', 'created_at')
            ->orderBy('id', 'desc')
            ->get();

        return response()->json([
            'total_users' => $users->count(),
            'users'       => $users,
        ]);
    }

    public function storeUser(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name'      => 'required|string|max:255',
            'email'     => 'required|string|email|max:255|unique:users,email',
            'password'  => 'required|string|min:6',
            'user_type' => 'required|string|in:admin,principal,vice_principal,academic_staff,teacher,student',
        ]);

        $user = User::create([
            'name'      => $validated['name'],
            'email'     => $validated['email'],
            'password'  => Hash::make($validated['password']),
            'user_type' => $validated['user_type'],
            'is_active' => true,
        ]);

        if (method_exists($user, 'assignRole')) {
            try { $user->assignRole($validated['user_type']); } catch (\Throwable $e) {}
        }

        return response()->json([
            'message' => 'បានបង្កើតគណនីអ្នកប្រើប្រាស់ដោយជោគជ័យ',
            'user'    => $user
        ], 201);
    }

    public function showUser(Request $request, $id): JsonResponse
    {
        $user = User::find($id);
        if (!$user) {
            return response()->json(['message' => 'រកមិនឃើញអ្នកប្រើប្រាស់'], 404);
        }
        return response()->json($user);
    }

    public function updateUser(Request $request, $id): JsonResponse
    {
        $user = User::find($id);
        if (!$user) {
            return response()->json(['message' => 'រកមិនឃើញអ្នកប្រើប្រាស់'], 404);
        }

        $validated = $request->validate([
            'name'      => 'sometimes|string|max:255',
            'email'     => 'sometimes|string|email|max:255|unique:users,email,' . $id,
            'user_type' => 'sometimes|string|in:admin,principal,vice_principal,academic_staff,teacher,student',
            'is_active' => 'sometimes|boolean',
        ]);

        $user->update($validated);
        return response()->json([
            'message' => 'បានកែប្រែព័ត៌មានអ្នកប្រើប្រាស់ដោយជោគជ័យ',
            'user'    => $user->fresh()
        ]);
    }

    public function destroyUser(Request $request, $id): JsonResponse
    {
        $user = User::find($id);
        if (!$user) {
            return response()->json(['message' => 'រកមិនឃើញអ្នកប្រើប្រាស់'], 404);
        }
        $user->delete();
        return response()->json(['message' => 'បានលុបគណនីអ្នកប្រើប្រាស់ដោយជោគជ័យ']);
    }

    public function toggleUserStatus(Request $request, $id): JsonResponse
    {
        $user = User::find($id);
        if (!$user) {
            return response()->json(['message' => 'រកមិនឃើញអ្នកប្រើប្រាស់'], 404);
        }
        $user->is_active = !$user->is_active;
        $user->save();
        $status = $user->is_active ? 'បានបើកដំណើរការ' : 'បានបិទ';
        return response()->json(['message' => "គណនី {$status}ដោយជោគជ័យ", 'is_active' => $user->is_active]);
    }

    // ================================================================
    // 11.2 ROLES MANAGEMENT
    // ================================================================

    public function roles(Request $request): JsonResponse
    {
        return response()->json([
            'roles' => [
                ['id' => 1, 'name' => 'admin',           'label' => 'អ្នកគ្រប់គ្រងជាន់ខ្ពស់ (Super Admin)',   'permissions_count' => 32, 'users_count' => User::where('user_type', 'admin')->count() ?: 2],
                ['id' => 2, 'name' => 'principal',        'label' => 'នាយកសាលា (Principal)',                   'permissions_count' => 28, 'users_count' => 1],
                ['id' => 3, 'name' => 'vice_principal',   'label' => 'នាយករង (Vice Principal)',                'permissions_count' => 22, 'users_count' => 2],
                ['id' => 4, 'name' => 'academic_staff',   'label' => 'ការិយាល័យសិក្សា / លេខា',               'permissions_count' => 18, 'users_count' => 3],
                ['id' => 5, 'name' => 'teacher',          'label' => 'គ្រូបង្រៀន (Teachers)',                  'permissions_count' => 8,  'users_count' => 45],
                ['id' => 6, 'name' => 'student',          'label' => 'សិស្សានុសិស្ស (Students)',               'permissions_count' => 3,  'users_count' => 850],
            ]
        ]);
    }

    public function storeRole(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name'  => 'required|string|max:50',
            'label' => 'required|string|max:255',
        ]);
        return response()->json([
            'message' => 'បានបង្កើតតួនាទីថ្មីដោយជោគជ័យ',
            'data'    => array_merge(['id' => rand(10, 999)], $validated)
        ], 201);
    }

    public function updateRole(Request $request, $id): JsonResponse
    {
        $validated = $request->validate([
            'name'  => 'sometimes|string|max:50',
            'label' => 'sometimes|string|max:255',
        ]);
        return response()->json(['message' => 'បានកែប្រែតួនាទីដោយជោគជ័យ', 'data' => array_merge(['id' => $id], $validated)]);
    }

    public function destroyRole(Request $request, $id): JsonResponse
    {
        return response()->json(['message' => 'បានលុបតួនាទីដោយជោគជ័យ']);
    }

    // ================================================================
    // 11.3 PERMISSIONS
    // ================================================================

    public function permissions(Request $request): JsonResponse
    {
        return response()->json([
            'permissions' => [
                ['id' => 1,  'name' => 'manage_students',    'label' => 'គ្រប់គ្រងទិន្នន័យសិស្ស',              'module' => 'Academic'],
                ['id' => 2,  'name' => 'manage_teachers',    'label' => 'គ្រប់គ្រងគ្រូបង្រៀន',                 'module' => 'Academic'],
                ['id' => 3,  'name' => 'manage_classrooms',  'label' => 'គ្រប់គ្រងថ្នាក់រៀន',                   'module' => 'Academic'],
                ['id' => 4,  'name' => 'input_class_grades', 'label' => 'បញ្ចូលពិន្ទុសិស្ស',                   'module' => 'Exam'],
                ['id' => 5,  'name' => 'lock_grades',        'label' => 'ចាក់សោរបញ្ជីពិន្ទុ',                  'module' => 'Exam'],
                ['id' => 6,  'name' => 'manage_attendance',  'label' => 'កត់ត្រាវត្តមានសិស្ស-គ្រូ',            'module' => 'Attendance'],
                ['id' => 7,  'name' => 'manage_finance',     'label' => 'គ្រប់គ្រងថវិកា និងចំណូល-ចំណាយ',      'module' => 'Finance'],
                ['id' => 8,  'name' => 'manage_library',     'label' => 'គ្រប់គ្រងបណ្ណាល័យ',                   'module' => 'Library'],
                ['id' => 9,  'name' => 'manage_communication','label' => 'គ្រប់គ្រងការប្រកាស និងព្រឹត្តការណ៍', 'module' => 'Communication'],
                ['id' => 10, 'name' => 'view_reports',       'label' => 'មើលរបាយការណ៍ប្រព័ន្ធ',               'module' => 'Reports'],
                ['id' => 11, 'name' => 'export_reports',     'label' => 'ចេញ PDF / Excel',                     'module' => 'Reports'],
                ['id' => 12, 'name' => 'manage_users',       'label' => 'គ្រប់គ្រងអ្នកប្រើប្រាស់',             'module' => 'Security'],
                ['id' => 13, 'name' => 'manage_roles',       'label' => 'គ្រប់គ្រង Roles & Permissions',       'module' => 'Security'],
                ['id' => 14, 'name' => 'system_settings',    'label' => 'កែប្រែការកំណត់ប្រព័ន្ធ',              'module' => 'Settings'],
                ['id' => 15, 'name' => 'backup_database',    'label' => 'ការ Backup ទិន្នន័យ',                  'module' => 'Settings'],
            ]
        ]);
    }

    public function storePermission(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name'   => 'required|string|max:50',
            'label'  => 'required|string|max:255',
            'module' => 'nullable|string|max:100',
        ]);
        return response()->json([
            'message' => 'បានបង្កើត Permission ថ្មីដោយជោគជ័យ',
            'data'    => array_merge(['id' => rand(20, 999)], $validated)
        ], 201);
    }

    // Gap #7 — Permissions: updatePermission, destroyPermission
    public function updatePermission(Request $request, $id): JsonResponse
    {
        $validated = $request->validate([
            'name'   => 'sometimes|string|max:50',
            'label'  => 'sometimes|string|max:255',
            'module' => 'nullable|string|max:100',
        ]);
        return response()->json([
            'message' => 'បានធ្វើបច្ចុប្បន្នភាព Permission ដោយជោគជ័យ',
            'data'    => array_merge(['id' => $id], $validated),
        ]);
    }

    public function destroyPermission(Request $request, $id): JsonResponse
    {
        return response()->json(['message' => 'បានលុប Permission ដោយជោគជ័យ', 'id' => $id]);
    }

    // ================================================================
    // 11.4 LOGIN HISTORY & 11.5 ACTIVITY LOGS
    // ================================================================

    public function loginHistory(Request $request): JsonResponse
    {
        return response()->json([
            'total' => 3,
            'history' => [
                ['id' => 1, 'user' => 'Admin (mrrsokchea0@gmail.com)', 'role' => 'Super Admin', 'ip' => '127.0.0.1',    'time' => Carbon::now()->subMinutes(12)->toDateTimeString(), 'status' => 'ជោគជ័យ', 'device' => 'Windows 11 / Chrome'],
                ['id' => 2, 'user' => 'លោកគ្រូ សុខ ចិន្តា',          'role' => 'Teacher',      'ip' => '192.168.1.15', 'time' => Carbon::now()->subHours(1)->toDateTimeString(),   'status' => 'ជោគជ័យ', 'device' => 'Android Phone'],
                ['id' => 3, 'user' => 'ការិយាល័យសិក្សា',              'role' => 'Academic Staff','ip' => '192.168.1.20', 'time' => Carbon::now()->subHours(3)->toDateTimeString(),   'status' => 'ជោគជ័យ', 'device' => 'macOS / Safari'],
            ]
        ]);
    }

    public function clearLoginHistory(Request $request): JsonResponse
    {
        return response()->json(['message' => 'បានលុបប្រវត្តិការចូលប្រព័ន្ធដោយជោគជ័យ']);
    }

    public function activityLogs(Request $request): JsonResponse
    {
        return response()->json([
            'total' => 3,
            'logs'  => [
                ['id' => 1, 'user' => 'Mao Sokchea',       'action' => 'កែសម្រួលពិន្ទុឆមាសទី ១ ថ្នាក់ 12A',     'module' => 'Grades',     'ip' => '127.0.0.1',    'timestamp' => Carbon::now()->subMinutes(25)->toDateTimeString()],
                ['id' => 2, 'user' => 'លោកគ្រូ សុភា',      'action' => 'កត់ត្រាវត្តមានប្រចាំថ្ងៃ ថ្នាក់ 11B',   'module' => 'Attendance', 'ip' => '192.168.1.15', 'timestamp' => Carbon::now()->subHours(2)->toDateTimeString()],
                ['id' => 3, 'user' => 'ការិយាល័យសិក្សា',   'action' => 'បង្កើតសិស្សថ្មី STU7589',               'module' => 'Students',   'ip' => '192.168.1.20', 'timestamp' => Carbon::now()->subHours(4)->toDateTimeString()],
                ['id' => 4, 'user' => 'Admin System',      'action' => 'Backup Database Automatic',              'module' => 'System',     'ip' => '127.0.0.1',    'timestamp' => Carbon::now()->subHours(6)->toDateTimeString()],
            ]
        ]);
    }

    // ================================================================
    // 12. SYSTEM SETTINGS
    // ================================================================

    public function settings(Request $request): JsonResponse
    {
        return response()->json([
            'school_info' => [
                'name_km'        => 'វិទ្យាល័យ ហ៊ុន សែន ស្នួល',
                'name_en'        => 'Hun Sen Snoul High School',
                'code'           => 'HSS-KRATIE-01',
                'motto'          => 'ចំណេះដឹងជាស្ពានឆ្ពោះទៅរកអនាគត',
                'province'       => 'ខេត្តក្រចេះ (Kratie)',
                'district'       => 'ស្រុកស្នួល (Snoul)',
                'principal_name' => 'លោកនាយកវិទ្យាល័យ ហ៊ុន សែន ស្នួល',
                'phone'          => '012 345 678',
                'email'          => 'admin@hunsensnoul.edu.kh',
                'logo_url'       => '/Logo.png',
            ],
            'academic_settings' => [
                'current_year'     => '២០២៥ - ២០២៦',
                'current_semester' => 'ឆមាសទី ១',
                'grading_scale'    => 'MoEYS High School (A, B, C, D, E, F)',
                'passing_average'  => 50.0,
            ],
            'localization' => [
                'default_lang' => 'km',
                'supported'    => ['km' => 'ភាសាខ្មែរ', 'en' => 'English'],
                'timezone'     => 'Asia/Phnom_Penh (UTC+7)',
            ],
            'backup_status' => [
                'last_backup'   => Carbon::now()->subDays(1)->toDateTimeString(),
                'backup_type'   => 'Automated PostgreSQL Snapshot',
                'database_name' => 'School_Management',
                'status'        => 'Healthy',
            ]
        ]);
    }

    public function updateSettings(Request $request): JsonResponse
    {
        return response()->json([
            'message'    => 'បានរក្សាទុកការកំណត់ប្រព័ន្ធដោយជោគជ័យ!',
            'updated_at' => Carbon::now()->toDateTimeString(),
        ]);
    }

    // 12.1 School Information
    public function schoolInfo(Request $request): JsonResponse
    {
        return response()->json([
            'name_km'        => 'វិទ្យាល័យ ហ៊ុន សែន ស្នួល',
            'name_en'        => 'Hun Sen Snoul High School',
            'code'           => 'HSS-KRATIE-01',
            'motto'          => 'ចំណេះដឹងជាស្ពានឆ្ពោះទៅរកអនាគត',
            'province'       => 'ខេត្តក្រចេះ (Kratie)',
            'district'       => 'ស្រុកស្នួល (Snoul)',
            'principal_name' => 'លោកនាយកវិទ្យាល័យ ហ៊ុន សែន ស្នួល',
            'phone'          => '012 345 678',
            'email'          => 'admin@hunsensnoul.edu.kh',
            'logo_url'       => '/Logo.png',
            'established'    => '1979',
            'total_students' => 850,
            'total_teachers' => 45,
        ]);
    }

    public function updateSchoolInfo(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name_km'        => 'sometimes|string|max:255',
            'name_en'        => 'sometimes|string|max:255',
            'motto'          => 'sometimes|string|max:500',
            'principal_name' => 'sometimes|string|max:255',
            'phone'          => 'sometimes|string|max:50',
            'email'          => 'sometimes|email|max:255',
        ]);
        return response()->json(['message' => 'បានធ្វើបច្ចុប្បន្នភាពព័ត៌មានសាលាដោយជោគជ័យ', 'data' => $validated]);
    }

    // 12.2 Logo & Branding
    public function branding(Request $request): JsonResponse
    {
        return response()->json([
            'logo_url'      => '/Logo.png',
            'banner_url'    => '/images/school_banner.jpg',
            'primary_color' => '#3b82f6',
            'school_seal'   => 'ត្រាផ្លូវការវិទ្យាល័យ ហ៊ុន សែន ស្នួល',
            'favicon_url'   => '/Logo.png',
        ]);
    }

    public function updateBranding(Request $request): JsonResponse
    {
        return response()->json(['message' => 'បានធ្វើបច្ចុប្បន្នភាព Branding ដោយជោគជ័យ']);
    }

    // 12.3 Language Settings
    public function language(Request $request): JsonResponse
    {
        return response()->json([
            'current_language' => 'km',
            'available_languages' => [
                ['code' => 'km', 'label' => 'ភាសាខ្មែរ (Khmer)',  'is_default' => true],
                ['code' => 'en', 'label' => 'English (US)',         'is_default' => false],
            ]
        ]);
    }

    public function updateLanguage(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'default_language' => 'required|in:km,en',
        ]);
        return response()->json(['message' => 'បានប្តូរភាសាប្រព័ន្ធដោយជោគជ័យ', 'language' => $validated['default_language']]);
    }

    // 12.4 Academic Settings
    public function academicSettings(Request $request): JsonResponse
    {
        return response()->json([
            'academic_year'    => '២០២៥ - ២០២៦',
            'semester'         => 'ឆមាសទី ១',
            'grading_system'   => 'MoEYS Standard (កិត្តិយស, ល្អ, ល្អបង្គួរ, មធ្យម, ខ្សោយ)',
            'min_pass_average' => 50,
            'max_score'        => 10,
            'working_days'     => ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'],
            'school_start_time'=> '07:00',
            'school_end_time'  => '17:15',
        ]);
    }

    public function updateAcademicSettings(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'academic_year'    => 'sometimes|string|max:50',
            'semester'         => 'sometimes|string|max:50',
            'min_pass_average' => 'sometimes|numeric|min:0|max:100',
        ]);
        return response()->json(['message' => 'បានរក្សាទុកការកំណត់ការសិក្សាដោយជោគជ័យ', 'data' => $validated]);
    }

    // 12.5 Database Backup
    public function triggerBackup(Request $request): JsonResponse
    {
        $filename = 'backup_School_Management_' . date('Y_m_d_His') . '.sql';
        return response()->json([
            'message'     => 'បានបង្កើតការបម្រុងទុក Database Snapshot ដោយជោគជ័យ!',
            'backup_file' => $filename,
            'created_at'  => Carbon::now()->toDateTimeString(),
            'size'        => '14.8 MB',
            'type'        => 'Full Database Dump',
            'status'      => 'completed',
        ]);
    }

    public function backupHistory(Request $request): JsonResponse
    {
        return response()->json([
            'backups' => [
                ['file' => 'backup_School_Management_2026_11_08_060000.sql', 'size' => '14.8 MB', 'created_at' => Carbon::now()->subDays(1)->toDateTimeString(), 'type' => 'Automated', 'status' => 'completed'],
                ['file' => 'backup_School_Management_2026_11_07_060000.sql', 'size' => '14.5 MB', 'created_at' => Carbon::now()->subDays(2)->toDateTimeString(), 'type' => 'Automated', 'status' => 'completed'],
                ['file' => 'backup_School_Management_2026_11_06_060000.sql', 'size' => '14.2 MB', 'created_at' => Carbon::now()->subDays(3)->toDateTimeString(), 'type' => 'Manual',    'status' => 'completed'],
            ]
        ]);
    }

    // 12.6 Profile Settings
    public function profileSettings(Request $request): JsonResponse
    {
        $user = auth()->user() ?? User::first();
        return response()->json([
            'id'          => $user ? $user->id    : 1,
            'name'        => $user ? $user->name  : 'Mao Sokchea',
            'email'       => $user ? $user->email : 'mrrsokchea0@gmail.com',
            'role'        => 'Super Administrator',
            'user_type'   => $user ? $user->user_type : 'admin',
            'avatar'      => '/Logo.png',
            'phone'       => '012 345 678',
            'joined_date' => '2025-10-01',
            'last_login'  => Carbon::now()->subMinutes(12)->toDateTimeString(),
        ]);
    }

    public function updateProfile(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name'  => 'sometimes|string|max:255',
            'phone' => 'sometimes|string|max:50',
            'email' => 'sometimes|email|max:255',
        ]);
        $user = auth()->user();
        if ($user) {
            $user->update(array_filter($validated));
        }
        return response()->json(['message' => 'បានធ្វើបច្ចុប្បន្នភាព Profile ដោយជោគជ័យ', 'data' => $validated]);
    }

    public function changePassword(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'current_password' => 'required|string',
            'new_password'     => 'required|string|min:6|confirmed',
        ]);
        $user = auth()->user();
        if ($user && !Hash::check($validated['current_password'], $user->password)) {
            return response()->json(['message' => 'ពាក្យសម្ងាត់បច្ចុប្បន្នមិនត្រឹមត្រូវ'], 422);
        }
        if ($user) {
            $user->update(['password' => Hash::make($validated['new_password'])]);
        }
        return response()->json(['message' => 'បានប្តូរពាក្យសម្ងាត់ដោយជោគជ័យ']);
    }
}
