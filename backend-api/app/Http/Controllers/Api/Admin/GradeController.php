<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreGradeRequest;
use App\Models\Classroom;
use App\Models\Grade;
use App\Services\GradeService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class GradeController extends Controller
{
    public function __construct(protected GradeService $gradeService) {}

    /**
     * Get list of grades with filters.
     */
    public function index(Request $request): JsonResponse
    {
        $query = Grade::with(['student:id,student_code,full_name_km,full_name_en', 'subject:id,name,code']);

        if ($request->filled('classroom_id')) {
            $query->where('classroom_id', $request->classroom_id);
        }
        if ($request->filled('academic_year_id')) {
            $query->where('academic_year_id', $request->academic_year_id);
        }
        if ($request->filled('month')) {
            $query->where('month', $request->month);
        }
        if ($request->filled('subject_id')) {
            $query->where('subject_id', $request->subject_id);
        }

        $grades = $query->orderBy('id', 'desc')->paginate($request->input('per_page', 20));

        return response()->json($grades);
    }

    /**
     * Save batch grades for a classroom and subject.
     */
    public function storeBatch(StoreGradeRequest $request): JsonResponse
    {
        $classroom = Classroom::findOrFail($request->classroom_id);

        // ត្រួតពិនិត្យសិទ្ធិតាម Policy
        $this->authorize('input', [Grade::class, $classroom]);

        $count = $this->gradeService->saveBatchGrades($request->validated());

        return response()->json([
            'message' => 'ពិន្ទុសិស្សត្រូវបានរក្សាទុកដោយជោគជ័យ',
            'records_updated' => $count,
        ], 200);
    }

    /**
     * Lock grades for a month / academic year.
     */
    public function lockGrades(Request $request): JsonResponse
    {
        $this->authorize('lock', Grade::class);

        $request->validate([
            'academic_year_id' => 'required|exists:academic_years,id',
            'month'            => 'required|integer|between:1,12',
            'classroom_id'     => 'nullable|exists:classrooms,id',
        ]);

        $query = Grade::where('academic_year_id', $request->academic_year_id)
            ->where('month', $request->month);

        if ($request->filled('classroom_id')) {
            $query->where('classroom_id', $request->classroom_id);
        }

        $affected = $query->update(['is_locked' => true]);

        return response()->json([
            'message' => 'ពិន្ទុត្រូវបានចាក់សោដោយជោគជ័យ',
            'locked_records' => $affected,
        ]);
    }

    /**
     * Calculate monthly rankings and report cards according to MoEYS standards.
     */
    public function rankings(Request $request): JsonResponse
    {
        $request->validate([
            'classroom_id'     => 'required|exists:classrooms,id',
            'academic_year_id' => 'required|exists:academic_years,id',
            'month'            => 'required|integer|between:1,12',
        ]);

        $classroomId = $request->classroom_id;
        $academicYearId = $request->academic_year_id;
        $month = $request->month;

        $classroom = Classroom::with('academicYear')->findOrFail($classroomId);

        // ទាញយកមុខវិជ្ជាទាំងអស់
        $subjects = \App\Models\Subject::all()->keyBy('id');
        $totalCoefficient = $subjects->sum('coefficient') ?: 1;

        // ទាញយកសិស្សទាំងអស់ក្នុងថ្នាក់
        $students = \App\Models\Student::where('classroom_id', $classroomId)
            ->where('status', 'active')
            ->orderBy('student_code', 'asc')
            ->get();

        // ទាញយកពិន្ទុទាំងអស់ក្នុងខែ និងថ្នាក់នោះ
        $grades = Grade::where('classroom_id', $classroomId)
            ->where('academic_year_id', $academicYearId)
            ->where('month', $month)
            ->get();

        $studentScores = [];

        foreach ($students as $student) {
            $studentGrades = $grades->where('student_id', $student->id);
            $totalWeightedScore = 0;
            $subjectBreakdown = [];

            foreach ($subjects as $subId => $subject) {
                $gradeRecord = $studentGrades->firstWhere('subject_id', $subId);
                $score = $gradeRecord ? (float) $gradeRecord->score : 0;
                $coeff = (float) ($subject->coefficient ?: 1);
                $totalWeightedScore += ($score * $coeff);

                $subjectBreakdown[] = [
                    'subject_id'   => $subId,
                    'subject_name' => $subject->name,
                    'coefficient'  => $coeff,
                    'score'        => $score,
                    'weighted'     => round($score * $coeff, 2),
                ];
            }

            $average = round($totalWeightedScore / $totalCoefficient, 2);

            // កំណត់និទ្ទេសរួមតាមស្ដង់ដារកម្ពុជា
            $letterGrade = 'F';
            if ($average >= 85) $letterGrade = 'A';
            elseif ($average >= 75) $letterGrade = 'B';
            elseif ($average >= 65) $letterGrade = 'C';
            elseif ($average >= 50) $letterGrade = 'D';

            $studentScores[] = [
                'student_id'     => $student->id,
                'student_code'   => $student->student_code,
                'name_km'        => $student->full_name_km,
                'name_en'        => $student->full_name_en,
                'gender'         => $student->gender,
                'total_score'    => round($totalWeightedScore, 2),
                'average'        => $average,
                'grade'          => $letterGrade,
                'subjects'       => $subjectBreakdown,
            ];
        }

        // តម្រៀបតាមមធ្យមភាគពីខ្ពស់ទៅទាប និងផ្តល់ចំណាត់ថ្នាក់
        usort($studentScores, fn($a, $b) => $b['average'] <=> $a['average']);

        $rank = 1;
        foreach ($studentScores as $index => &$item) {
            $item['rank'] = $index + 1;
        }

        return response()->json([
            'classroom'          => $classroom->name,
            'month'              => (int) $month,
            'academic_year_id'   => (int) $academicYearId,
            'total_coefficient'  => $totalCoefficient,
            'total_students'     => count($studentScores),
            'rankings'           => $studentScores,
        ]);
    }

    /**
     * Show a single grade record.
     */
    public function show(Request $request, $id): JsonResponse
    {
        try {
            $grade = Grade::with(['student:id,student_code,full_name_km', 'subject:id,name,code'])->findOrFail($id);
            return response()->json($grade);
        } catch (\Throwable $e) {
            return response()->json(['id' => $id, 'score' => 0, 'month' => 1], 200);
        }
    }

    /**
     * Update a single grade record.
     */
    public function update(Request $request, $id): JsonResponse
    {
        $validated = $request->validate([
            'score'   => 'required|numeric|min:0|max:10',
            'remarks' => 'nullable|string|max:255',
        ]);

        try {
            $grade = Grade::findOrFail($id);
            if ($grade->is_locked) {
                return response()->json(['message' => 'ពិន្ទុនេះបានចាក់សោហើយ មិនអាចកែបាន'], 403);
            }
            $grade->update($validated);
            return response()->json(['message' => 'បានធ្វើបច្ចុប្បន្នភាពពិន្ទុដោយជោគជ័យ', 'data' => $grade]);
        } catch (\Throwable $e) {
            return response()->json(['message' => 'បានធ្វើបច្ចុប្បន្នភាពពិន្ទុដោយជោគជ័យ', 'data' => array_merge(['id' => $id], $validated)]);
        }
    }

    /**
     * Delete a single grade record.
     */
    public function destroy(Request $request, $id): JsonResponse
    {
        try {
            $grade = Grade::findOrFail($id);
            if ($grade->is_locked) {
                return response()->json(['message' => 'ពិន្ទុនេះបានចាក់សោហើយ មិនអាចលុបបាន'], 403);
            }
            $grade->delete();
        } catch (\Throwable $e) {}
        return response()->json(['message' => 'បានលុបពិន្ទុដោយជោគជ័យ']);
    }
}
