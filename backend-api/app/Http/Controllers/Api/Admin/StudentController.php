<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Student;
use App\Models\User;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Schema;

class StudentController extends Controller
{
    /**
     * Ensure all necessary columns exist on the students table in PostgreSQL.
     */
    protected function ensureStudentColumnsExist(): void
    {
        try {
            if (!Schema::hasTable('students')) {
                Schema::create('students', function (Blueprint $table) {
                    $table->id();
                    $table->foreignId('user_id')->nullable();
                    $table->string('student_code')->nullable()->unique();
                    $table->string('full_name_km')->nullable();
                    $table->string('full_name_en')->nullable();
                    $table->string('gender')->default('male');
                    $table->date('dob')->nullable();
                    $table->foreignId('classroom_id')->nullable();
                    $table->string('stream')->default('science');
                    $table->string('parent_phone')->nullable();
                    $table->string('status')->default('active');
                    $table->timestamps();
                });
            } else {
                \Illuminate\Support\Facades\DB::statement("ALTER TABLE students ADD COLUMN IF NOT EXISTS user_id BIGINT NULL");
                \Illuminate\Support\Facades\DB::statement("ALTER TABLE students ADD COLUMN IF NOT EXISTS student_code VARCHAR(255) NULL");
                \Illuminate\Support\Facades\DB::statement("ALTER TABLE students ADD COLUMN IF NOT EXISTS full_name_km VARCHAR(255) NULL");
                \Illuminate\Support\Facades\DB::statement("ALTER TABLE students ADD COLUMN IF NOT EXISTS full_name_en VARCHAR(255) NULL");
                \Illuminate\Support\Facades\DB::statement("ALTER TABLE students ADD COLUMN IF NOT EXISTS name VARCHAR(255) NULL");
                \Illuminate\Support\Facades\DB::statement("ALTER TABLE students ADD COLUMN IF NOT EXISTS gender VARCHAR(50) DEFAULT 'male'");
                \Illuminate\Support\Facades\DB::statement("ALTER TABLE students ADD COLUMN IF NOT EXISTS dob DATE NULL");
                \Illuminate\Support\Facades\DB::statement("ALTER TABLE students ADD COLUMN IF NOT EXISTS classroom_id BIGINT NULL");
                \Illuminate\Support\Facades\DB::statement("ALTER TABLE students ADD COLUMN IF NOT EXISTS stream VARCHAR(50) DEFAULT 'science'");
                \Illuminate\Support\Facades\DB::statement("ALTER TABLE students ADD COLUMN IF NOT EXISTS parent_phone VARCHAR(50) NULL");
                \Illuminate\Support\Facades\DB::statement("ALTER TABLE students ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'active'");
            }
        } catch (\Throwable $e) {
            // Safe fallback if column cannot be added
        }
    }

    /**
     * Display a listing of students with optional search and classroom filter.
     */
    public function index(Request $request): JsonResponse
    {
        $this->ensureStudentColumnsExist();

        $cols = Schema::getColumnListing('students');
        $query = Student::query();

        if (in_array('classroom_id', $cols)) {
            $query->with('classroom');
        }

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search, $cols) {
                if (in_array('student_code', $cols)) {
                    $q->orWhere('student_code', 'like', "%{$search}%");
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
            });
        }

        if ($request->filled('classroom_id') && in_array('classroom_id', $cols)) {
            $query->where('classroom_id', $request->classroom_id);
        }

        $students = $query->orderBy('id', 'desc')->get();

        return response()->json([
            'total' => $students->count(),
            'data'  => $students,
        ]);
    }

    /**
     * Store a newly created student.
     */
    public function store(Request $request): JsonResponse
    {
        $this->ensureStudentColumnsExist();

        $rules = [
            'full_name_km' => 'required|string|max:255',
            'full_name_en' => 'nullable|string|max:255',
            'gender'       => 'required|string',
            'dob'          => 'nullable',
            'classroom_id' => 'nullable',
            'stream'       => 'nullable|string',
            'parent_phone' => 'nullable|string',
            'status'       => 'nullable|string',
        ];

        // ត្រួតពិនិត្យ និងបង្កើត student_code ប្រសិនបើអត់ទាន់មាន
        $studentCode = $request->input('student_code');
        if (!$studentCode) {
            $studentCode = 'STU' . strtoupper(substr(uniqid(), -5));
        }

        $cols = Schema::getColumnListing('students');
        $validated = $request->validate($rules);
        $validated['student_code'] = $studentCode;

        // Check uniqueness safely without DB exception
        if (in_array('student_code', $cols)) {
            try {
                if (Student::where('student_code', $studentCode)->exists()) {
                    return response()->json([
                        'message' => 'អត្តលេខសិស្សនេះមានរួចហើយ (Student code already exists)',
                        'errors' => ['student_code' => ['អត្តលេខសិស្សនេះមានរួចហើយ']]
                    ], 422);
                }
            } catch (\Throwable $e) {}
        }

        // កែសម្រួលភេទឱ្យត្រូវនឹងទម្រង់
        $rawGender = strtoupper($validated['gender'] ?? 'M');
        $validated['gender'] = in_array($rawGender, ['M', 'MALE', 'ប្រុស']) ? 'male' : 'female';

        // បង្កើត User account ស្វ័យប្រវត្តិសម្រាប់សិស្ស Login
        $email = strtolower($studentCode) . '@student.hunsensnoul.edu.kh';
        $user = User::where('email', $email)->first();
        if (!$user) {
            $user = User::create([
                'name'     => $validated['full_name_km'] ?? $studentCode,
                'email'    => $email,
                'password' => Hash::make('12345678'),
            ]);
            if (method_exists($user, 'assignRole')) {
                try { $user->assignRole('student'); } catch (\Throwable $e) {}
            }
        }

        $validated['user_id'] = $user->id;

        // Clean up empty strings for foreign keys and dates
        if (empty($validated['classroom_id'])) {
            $validated['classroom_id'] = null;
        } else {
            try {
                if (!\App\Models\Classroom::where('id', $validated['classroom_id'])->exists()) {
                    $firstClass = \App\Models\Classroom::first();
                    $validated['classroom_id'] = $firstClass ? $firstClass->id : null;
                }
            } catch (\Throwable $e) {
                $validated['classroom_id'] = null;
            }
        }
        if (empty($validated['dob'])) {
            $validated['dob'] = null;
        }

        // បញ្ចូលតែ Field ណាដែលមានពិតប្រាកដក្នុង Table students
        $insertData = array_intersect_key($validated, array_flip($cols));
        if (in_array('name', $cols) && !in_array('full_name_km', $cols)) {
            $insertData['name'] = $validated['full_name_km'];
        }

        $student = Student::create($insertData);

        try {
            if ($student->classroom_id) {
                $student->loadMissing('classroom');
            }
        } catch (\Throwable $e) {}

        return response()->json([
            'message' => 'បានបង្កើតទិន្នន័យសិស្សដោយជោគជ័យ',
            'data'    => $student,
        ], 201);
    }

    /**
     * Display the specified student.
     */
    public function show(string $id): JsonResponse
    {
        $this->ensureStudentColumnsExist();
        $student = Student::with(['classroom', 'grades.subject', 'attendances'])->findOrFail($id);

        return response()->json($student);
    }

    /**
     * Update the specified student.
     */
    public function update(Request $request, string $id): JsonResponse
    {
        $this->ensureStudentColumnsExist();
        $student = Student::findOrFail($id);
        $cols = Schema::getColumnListing('students');

        $rules = [
            'full_name_km' => 'required|string|max:255',
            'full_name_en' => 'nullable|string|max:255',
            'gender'       => 'required|string',
            'dob'          => 'nullable',
            'classroom_id' => 'nullable',
            'stream'       => 'nullable|string',
            'parent_phone' => 'nullable|string',
            'status'       => 'nullable|string',
        ];

        if (in_array('student_code', $cols)) {
            $rules['student_code'] = "required|string|unique:students,student_code,{$student->id}";
        }

        $validated = $request->validate($rules);

        $rawGender = strtoupper($validated['gender'] ?? 'M');
        $validated['gender'] = in_array($rawGender, ['M', 'MALE', 'ប្រុស']) ? 'male' : 'female';

        if (empty($validated['classroom_id'])) {
            $validated['classroom_id'] = null;
        } else {
            try {
                if (!\App\Models\Classroom::where('id', $validated['classroom_id'])->exists()) {
                    $firstClass = \App\Models\Classroom::first();
                    $validated['classroom_id'] = $firstClass ? $firstClass->id : null;
                }
            } catch (\Throwable $e) {
                $validated['classroom_id'] = null;
            }
        }
        if (empty($validated['dob'])) {
            $validated['dob'] = null;
        }

        $updateData = array_intersect_key($validated, array_flip($cols));
        if (in_array('name', $cols) && !in_array('full_name_km', $cols)) {
            $updateData['name'] = $validated['full_name_km'];
        }

        $student->update($updateData);

        return response()->json([
            'message' => 'បានកែប្រែទិន្នន័យសិស្សដោយជោគជ័យ',
            'data'    => $student->load('classroom'),
        ]);
    }

    /**
     * Remove the specified student.
     */
    public function destroy(string $id): JsonResponse
    {
        $this->ensureStudentColumnsExist();
        $student = Student::findOrFail($id);
        $student->delete();

        return response()->json([
            'message' => 'បានលុបទិន្នន័យសិស្សដោយជោគជ័យ',
        ]);
    }
}
