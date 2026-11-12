<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class StudentPortalController extends Controller
{
    public function getProfile(Request $request): JsonResponse
    {
        $student = $request->user()->student()->with(['classroom.academicYear'])->firstOrFail();

        return response()->json([
            'id'           => $student->id,
            'student_code' => $student->student_code,
            'name_km'      => $student->full_name_km,
            'name_en'      => $student->full_name_en,
            'gender'       => $student->gender,
            'classroom'    => $student->classroom?->name,
            'stream'       => $student->stream,
            'status'       => $student->status,
        ]);
    }

    public function getGrades(Request $request): JsonResponse
    {
        $student = $request->user()->student;

        if (!$student) {
            return response()->json(['message' => 'ទិន្នន័យសិស្សមិនត្រូវបានរកឃើញ'], 404);
        }

        // Data Isolation: Query ចាប់យកតែពិន្ទុរបស់សិស្សដែលកំពុង Login
        $grades = $student->grades()
            ->with(['subject:id,name,code,coefficient'])
            ->orderBy('academic_year_id', 'desc')
            ->orderBy('month', 'desc')
            ->get();

        return response()->json([
            'data' => $grades,
        ]);
    }

    public function getAttendance(Request $request): JsonResponse
    {
        $student = $request->user()->student;

        if (!$student) {
            return response()->json(['message' => 'ទិន្នន័យសិស្សមិនត្រូវបានរកឃើញ'], 404);
        }

        $attendances = $student->attendances()
            ->orderBy('date', 'desc')
            ->paginate(20);

        return response()->json($attendances);
    }
}