<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Classroom;
use App\Models\Teacher;
use App\Models\User;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Schema;

class TeacherController extends Controller
{
    /**
     * Ensure all necessary columns exist on the teachers (and classrooms) table in PostgreSQL.
     */
    protected function ensureTeacherColumnsExist(): void
    {
        try {
            if (!Schema::hasTable('teachers')) {
                Schema::create('teachers', function (Blueprint $table) {
                    $table->id();
                    $table->foreignId('user_id')->nullable();
                    $table->string('teacher_code')->nullable()->unique();
                    $table->string('full_name_km')->nullable();
                    $table->string('full_name_en')->nullable();
                    $table->string('name')->nullable();
                    $table->string('gender')->default('male');
                    $table->string('phone')->nullable();
                    $table->timestamps();
                });
            } else {
                DB::statement("ALTER TABLE teachers ADD COLUMN IF NOT EXISTS user_id BIGINT NULL");
                DB::statement("ALTER TABLE teachers ADD COLUMN IF NOT EXISTS teacher_code VARCHAR(255) NULL");
                DB::statement("ALTER TABLE teachers ADD COLUMN IF NOT EXISTS full_name_km VARCHAR(255) NULL");
                DB::statement("ALTER TABLE teachers ADD COLUMN IF NOT EXISTS full_name_en VARCHAR(255) NULL");
                DB::statement("ALTER TABLE teachers ADD COLUMN IF NOT EXISTS name VARCHAR(255) NULL");
                DB::statement("ALTER TABLE teachers ADD COLUMN IF NOT EXISTS gender VARCHAR(50) DEFAULT 'male'");
                DB::statement("ALTER TABLE teachers ADD COLUMN IF NOT EXISTS phone VARCHAR(50) NULL");
            }

            if (Schema::hasTable('classrooms')) {
                DB::statement("ALTER TABLE classrooms ADD COLUMN IF NOT EXISTS homeroom_teacher_id BIGINT NULL");
            }
        } catch (\Throwable $e) {
            // Safe fallback if column cannot be added
        }
    }

    /**
     * Display a listing of teachers with optional search and homeroom class.
     */
    public function index(Request $request): JsonResponse
    {
        $this->ensureTeacherColumnsExist();

        $cols = Schema::getColumnListing('teachers');
        $query = Teacher::query();

        if (in_array('user_id', $cols)) {
            $query->with(['homeroomClassroom', 'user:id,name,email']);
        } else {
            $query->with(['homeroomClassroom']);
        }

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search, $cols) {
                if (in_array('teacher_code', $cols)) {
                    $q->orWhere('teacher_code', 'like', "%{$search}%");
                }
                if (in_array('full_name_km', $cols)) {
                    $q->orWhere('full_name_km', 'like', "%{$search}%");
                }
                if (in_array('full_name_en', $cols)) {
                    $q->orWhere('full_name_en', 'like', "%{$search}%");
                }
                if (in_array('name', $cols)) {
                    $q->orWhere('name', 'like', "%{$search}%");
                }
                if (in_array('phone', $cols)) {
                    $q->orWhere('phone', 'like', "%{$search}%");
                }
            });
        }

        $teachers = $query->orderBy('id', 'desc')->get();

        return response()->json([
            'total' => $teachers->count(),
            'data'  => $teachers,
        ]);
    }

    /**
     * Store a newly created teacher.
     */
    public function store(Request $request): JsonResponse
    {
        $this->ensureTeacherColumnsExist();

        $validated = $request->validate([
            'teacher_code' => 'nullable|string|max:50',
            'full_name_km' => 'required|string|max:255',
            'full_name_en' => 'nullable|string|max:255',
            'gender'       => 'required|string',
            'phone'        => 'nullable|string|max:30',
            'email'        => 'nullable|email',
            'password'     => 'nullable|string|min:6',
            'classroom_id' => 'nullable',
        ]);

        $teacherCode = $validated['teacher_code'] ?? ('TCH' . strtoupper(substr(uniqid(), -5)));
        $cols = Schema::getColumnListing('teachers');

        if (in_array('teacher_code', $cols)) {
            try {
                if (Teacher::where('teacher_code', $teacherCode)->exists()) {
                    return response()->json([
                        'message' => 'អត្តលេខគ្រូនេះមានរួចហើយ (Teacher code already exists)',
                        'errors'  => ['teacher_code' => ['អត្តលេខគ្រូនេះមានរួចហើយ']],
                    ], 422);
                }
            } catch (\Throwable $e) {}
        }

        $rawGender = strtoupper(trim($validated['gender'] ?? 'M'));
        $gender = in_array($rawGender, ['M', 'MALE', 'ប្រុស']) ? 'male' : 'female';

        return DB::transaction(function () use ($validated, $teacherCode, $gender, $cols, $request) {
            // បង្កើត User account ប្រសិនបើមានបញ្ចូល Email ឬប្រើអត្តលេខគ្រូ
            $email = !empty($validated['email'])
                ? $validated['email']
                : strtolower($teacherCode) . '@hunsensnoul.edu.kh';

            $user = User::where('email', $email)->first();

            if (!$user) {
                $user = User::create([
                    'name'     => $validated['full_name_km'],
                    'email'    => $email,
                    'password' => Hash::make($request->input('password', '12345678')),
                ]);
                if (method_exists($user, 'assignRole')) {
                    try { $user->assignRole('teacher'); } catch (\Throwable $e) {}
                }
            }

            $teacherData = [
                'user_id'      => $user->id,
                'teacher_code' => $teacherCode,
                'full_name_km' => $validated['full_name_km'],
                'full_name_en' => $validated['full_name_en'] ?? null,
                'name'         => $validated['full_name_km'],
                'gender'       => $gender,
                'phone'        => $validated['phone'] ?? null,
            ];

            $insertData = array_intersect_key($teacherData, array_flip($cols));
            $teacher = Teacher::create($insertData);

            // ចាត់តាំងជាគ្រូបន្ទុកថ្នាក់ ប្រសិនបើមានជ្រើសរើសថ្នាក់
            if (!empty($validated['classroom_id'])) {
                try {
                    Classroom::where('id', $validated['classroom_id'])
                        ->update(['homeroom_teacher_id' => $teacher->id]);
                } catch (\Throwable $e) {}
            }

            try {
                $teacher->loadMissing('homeroomClassroom');
            } catch (\Throwable $e) {}

            return response()->json([
                'message' => 'បានបន្ថែមគ្រូបង្រៀនដោយជោគជ័យ',
                'data'    => $teacher,
            ], 201);
        });
    }

    /**
     * Display the specified teacher.
     */
    public function show(int $id): JsonResponse
    {
        $this->ensureTeacherColumnsExist();
        $teacher = Teacher::with(['homeroomClassroom', 'user'])->findOrFail($id);

        return response()->json($teacher);
    }

    /**
     * Update the specified teacher.
     */
    public function update(Request $request, int $id): JsonResponse
    {
        $this->ensureTeacherColumnsExist();
        $teacher = Teacher::findOrFail($id);
        $cols = Schema::getColumnListing('teachers');

        $validated = $request->validate([
            'teacher_code' => 'nullable|string|max:50',
            'full_name_km' => 'required|string|max:255',
            'full_name_en' => 'nullable|string|max:255',
            'gender'       => 'required|string',
            'phone'        => 'nullable|string|max:30',
            'classroom_id' => 'nullable',
        ]);

        if (!empty($validated['teacher_code']) && in_array('teacher_code', $cols)) {
            try {
                if (Teacher::where('teacher_code', $validated['teacher_code'])->where('id', '!=', $teacher->id)->exists()) {
                    return response()->json([
                        'message' => 'អត្តលេខគ្រូនេះមានរួចហើយ (Teacher code already exists)',
                        'errors'  => ['teacher_code' => ['អត្តលេខគ្រូនេះមានរួចហើយ']],
                    ], 422);
                }
            } catch (\Throwable $e) {}
        }

        $rawGender = strtoupper(trim($validated['gender'] ?? 'M'));
        $gender = in_array($rawGender, ['M', 'MALE', 'ប្រុស']) ? 'male' : 'female';

        $updateData = array_intersect_key([
            'teacher_code' => $validated['teacher_code'] ?? $teacher->teacher_code,
            'full_name_km' => $validated['full_name_km'],
            'full_name_en' => $validated['full_name_en'] ?? null,
            'name'         => $validated['full_name_km'],
            'gender'       => $gender,
            'phone'        => $validated['phone'] ?? null,
        ], array_flip($cols));

        $teacher->update($updateData);

        // កែសម្រួលគ្រូបន្ទុកថ្នាក់
        if (array_key_exists('classroom_id', $validated)) {
            try {
                Classroom::where('homeroom_teacher_id', $teacher->id)->update(['homeroom_teacher_id' => null]);

                if (!empty($validated['classroom_id'])) {
                    Classroom::where('id', $validated['classroom_id'])
                        ->update(['homeroom_teacher_id' => $teacher->id]);
                }
            } catch (\Throwable $e) {}
        }

        return response()->json([
            'message' => 'បានកែប្រែព័ត៌មានគ្រូបង្រៀនដោយជោគជ័យ',
            'data'    => $teacher->fresh(['homeroomClassroom', 'user']),
        ]);
    }

    /**
     * Remove the specified teacher.
     */
    public function destroy(int $id): JsonResponse
    {
        $this->ensureTeacherColumnsExist();
        $teacher = Teacher::findOrFail($id);

        try {
            Classroom::where('homeroom_teacher_id', $teacher->id)->update(['homeroom_teacher_id' => null]);
        } catch (\Throwable $e) {}

        $teacher->delete();

        return response()->json([
            'message' => 'បានលុបទិន្នន័យគ្រូបង្រៀនដោយជោគជ័យ',
        ]);
    }

    /**
     * Assign teacher as homeroom teacher to a classroom.
     */
    public function assignHomeroom(Request $request, int $id): JsonResponse
    {
        $this->ensureTeacherColumnsExist();
        $teacher = Teacher::findOrFail($id);

        $request->validate([
            'classroom_id' => 'required|exists:classrooms,id',
        ]);

        Classroom::where('homeroom_teacher_id', $teacher->id)->update(['homeroom_teacher_id' => null]);

        $classroom = Classroom::findOrFail($request->classroom_id);
        $classroom->update(['homeroom_teacher_id' => $teacher->id]);

        return response()->json([
            'message' => "បានចាត់តាំងលោកគ្រូ/អ្នកគ្រូ {$teacher->full_name_km} ជាគ្រូបន្ទុកថ្នាក់ {$classroom->name} ដោយជោគជ័យ",
            'data'    => $classroom->fresh('homeroomTeacher'),
        ]);
    }
}
