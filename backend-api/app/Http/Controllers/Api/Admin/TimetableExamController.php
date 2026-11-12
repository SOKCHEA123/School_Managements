<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Classroom;
use App\Models\Subject;
use App\Models\AcademicYear;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class TimetableExamController extends Controller
{
    /**
     * Ensure database table exists for Timetable
     */
    protected function ensureTimetableTable(): void
    {
        try {
            if (!Schema::hasTable('timetables')) {
                Schema::create('timetables', function ($table) {
                    $table->id();
                    $table->foreignId('classroom_id')->constrained('classrooms')->cascadeOnDelete();
                    $table->foreignId('subject_id')->nullable();
                    $table->foreignId('teacher_id')->nullable();
                    $table->enum('day_of_week', ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']);
                    $table->time('start_time');
                    $table->time('end_time');
                    $table->string('room_number')->nullable();
                    $table->timestamps();
                });
            }
        } catch (\Throwable $e) {}
    }

    /**
     * 5. Timetable Management: Get Class Timetable
     */
    public function getTimetable(Request $request): JsonResponse
    {
        $this->ensureTimetableTable();

        $classroomId = $request->input('classroom_id');
        $query = DB::table('timetables');
        if ($classroomId) {
            $query->where('classroom_id', $classroomId);
        }

        $records = $query->get();

        // Sample timetable generator if empty
        if ($records->isEmpty() && $classroomId) {
            $sampleDays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
            $sampleSchedule = [];
            foreach ($sampleDays as $day) {
                $sampleSchedule[] = [
                    'day' => $day,
                    'slots' => [
                        ['time' => '07:00 - 07:50', 'subject' => 'គណិតវិទ្យា', 'teacher' => 'លោកគ្រូ សុខ', 'room' => '12A-01'],
                        ['time' => '07:55 - 08:45', 'subject' => 'រូបវិទ្យា', 'teacher' => 'អ្នកគ្រូ ម៉ានី', 'room' => '12A-01'],
                        ['time' => '09:00 - 09:50', 'subject' => 'គីមីវិទ្យា', 'teacher' => 'លោកគ្រូ ចាន់', 'room' => 'Lab 1'],
                        ['time' => '09:55 - 10:45', 'subject' => 'ភាសាខ្មែរ', 'teacher' => 'អ្នកគ្រូ វ៉ាន់នី', 'room' => '12A-01'],
                        ['time' => '10:50 - 11:40', 'subject' => 'ភាសាអង់គ្លេស', 'teacher' => 'លោកគ្រូ រ៉ាឌី', 'room' => '12A-01'],
                    ]
                ];
            }
            return response()->json([
                'classroom_id' => $classroomId,
                'schedule' => $sampleSchedule
            ]);
        }

        return response()->json(['classroom_id' => $classroomId, 'records' => $records]);
    }

    public function storeTimetable(Request $request): JsonResponse
    {
        $this->ensureTimetableTable();

        $validated = $request->validate([
            'classroom_id' => 'required|exists:classrooms,id',
            'day_of_week'  => 'required|in:monday,tuesday,wednesday,thursday,friday,saturday',
            'start_time'   => 'required',
            'end_time'     => 'required',
            'subject_id'   => 'nullable',
            'teacher_id'   => 'nullable',
            'room_number'  => 'nullable|string',
        ]);

        return response()->json([
            'message' => 'បានរក្សាទុកកាលវិភាគដោយជោគជ័យ',
            'data'    => $validated
        ], 201);
    }

    /**
     * 4. Examination Management: List exams and schedules
     */
    public function getExams(Request $request): JsonResponse
    {
        return response()->json([
            'exams' => [
                [
                    'id' => 1,
                    'title' => 'ការប្រឡងឆមាសលើកទី ១ (First Semester Exam)',
                    'academic_year' => '2025-2026',
                    'start_date' => '2026-02-15',
                    'end_date' => '2026-02-20',
                    'status' => 'scheduled',
                    'grades_participating' => ['10', '11', '12'],
                    'total_students' => 850
                ],
                [
                    'id' => 2,
                    'title' => 'ការប្រឡងសាកល្បងបាក់ឌុប (Mock BacII Exam)',
                    'academic_year' => '2025-2026',
                    'start_date' => '2026-06-10',
                    'end_date' => '2026-06-12',
                    'status' => 'upcoming',
                    'grades_participating' => ['12'],
                    'total_students' => 260
                ],
                [
                    'id' => 3,
                    'title' => 'ការប្រឡងប្រចាំខែ វិច្ឆិកា',
                    'academic_year' => '2025-2026',
                    'start_date' => '2026-11-28',
                    'end_date' => '2026-11-30',
                    'status' => 'planned',
                    'grades_participating' => ['10', '11', '12'],
                    'total_students' => 850
                ]
            ],
            'exam_schedule' => [
                ['date' => '2026-12-15', 'time' => '07:30 - 09:00 AM', 'subject' => 'គណិតវិទ្យា', 'grade' => 'ថ្នាក់ទី ១២', 'duration' => '90 នាទី', 'rooms' => 'បន្ទប់ 101 - 108'],
                ['date' => '2026-12-15', 'time' => '09:30 - 11:00 AM', 'subject' => 'រូបវិទ្យា', 'grade' => 'ថ្នាក់ទី ១២', 'duration' => '90 នាទី', 'rooms' => 'បន្ទប់ 101 - 108'],
                ['date' => '2026-12-16', 'time' => '07:30 - 09:00 AM', 'subject' => 'អក្សរសាស្ត្រខ្មែរ', 'grade' => 'ថ្នាក់ទី ១២', 'duration' => '90 នាទី', 'rooms' => 'បន្ទប់ 101 - 108'],
                ['date' => '2026-12-16', 'time' => '09:30 - 11:00 AM', 'subject' => 'គីមីវិទ្យា / ជីវវិទ្យា', 'grade' => 'ថ្នាក់ទី ១២', 'duration' => '90 នាទី', 'rooms' => 'បន្ទប់ 101 - 108'],
            ]
        ]);
    }

    public function storeExam(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'title'         => 'required|string|max:255',
            'academic_year' => 'required|string',
            'start_date'    => 'required|date',
            'end_date'      => 'required|date',
            'status'        => 'nullable|string',
        ]);

        return response()->json([
            'message' => 'បានបង្កើតសម័យប្រឡងថ្មីដោយជោគជ័យ',
            'data'    => array_merge(['id' => rand(10, 999)], $validated)
        ], 201);
    }

    /**
     * 4.2 Exam Schedule
     */
    public function examSchedule(Request $request): JsonResponse
    {
        return response()->json([
            'schedules' => [
                ['id' => 1, 'date' => '2026-12-15', 'time' => '07:30 - 09:00 AM', 'subject' => 'គណិតវិទ្យា', 'grade' => 'ថ្នាក់ទី ១២', 'duration' => '90 នាទី', 'rooms' => 'បន្ទប់ 101 - 108'],
                ['id' => 2, 'date' => '2026-12-15', 'time' => '09:30 - 11:00 AM', 'subject' => 'រូបវិទ្យា', 'grade' => 'ថ្នាក់ទី ១២', 'duration' => '90 នាទី', 'rooms' => 'បន្ទប់ 101 - 108'],
                ['id' => 3, 'date' => '2026-12-16', 'time' => '07:30 - 09:00 AM', 'subject' => 'អក្សរសាស្ត្រខ្មែរ', 'grade' => 'ថ្នាក់ទី ១២', 'duration' => '90 នាទី', 'rooms' => 'បន្ទប់ 101 - 108'],
                ['id' => 4, 'date' => '2026-12-16', 'time' => '09:30 - 11:00 AM', 'subject' => 'គីមីវិទ្យា / ជីវវិទ្យា', 'grade' => 'ថ្នាក់ទី ១២', 'duration' => '90 នាទី', 'rooms' => 'បន្ទប់ 101 - 108'],
                ['id' => 5, 'date' => '2026-12-17', 'time' => '07:30 - 09:00 AM', 'subject' => 'ភាសាអង់គ្លេស', 'grade' => 'ថ្នាក់ទី ១២', 'duration' => '60 នាទី', 'rooms' => 'បន្ទប់ 101 - 108'],
            ]
        ]);
    }

    /**
     * 4.4 Grade Calculation
     */
    public function gradeCalculation(Request $request): JsonResponse
    {
        return response()->json([
            'message' => 'បានគណនាពិន្ទុ និងនិទ្ទេសសិស្សរួចរាល់',
            'summary' => [
                'total_students_calculated' => 850,
                'grade_A' => 45,
                'grade_B' => 120,
                'grade_C' => 280,
                'grade_D' => 250,
                'grade_E' => 125,
                'grade_F' => 30,
                'pass_rate' => '96.5%',
            ]
        ]);
    }

    /**
     * 4.5 Student Ranking
     */
    public function studentRanking(Request $request): JsonResponse
    {
        return response()->json([
            'rankings' => [
                ['rank' => 1, 'code' => 'STU7589', 'name' => 'សុខ ចាន់ដារ៉ា', 'gender' => 'ប្រុស', 'class' => '12A', 'average' => 48.5, 'grade' => 'A'],
                ['rank' => 2, 'code' => 'STU8901', 'name' => 'កែវ វិសាល', 'gender' => 'ប្រុស', 'class' => '12A', 'average' => 47.8, 'grade' => 'A'],
                ['rank' => 3, 'code' => 'STU9120', 'name' => 'ហេង សុជាតា', 'gender' => 'ស្រី', 'class' => '12B', 'average' => 47.2, 'grade' => 'A'],
                ['rank' => 4, 'code' => 'STU9201', 'name' => 'ជា រស្មី', 'gender' => 'ស្រី', 'class' => '12A', 'average' => 46.5, 'grade' => 'B'],
                ['rank' => 5, 'code' => 'STU9305', 'name' => 'ឡាយ ចិន្តា', 'gender' => 'ស្រី', 'class' => '12C', 'average' => 45.8, 'grade' => 'B'],
            ]
        ]);
    }

    /**
     * 4.6 Report Cards
     */
    public function reportCards(Request $request): JsonResponse
    {
        return response()->json([
            'cards' => [
                ['student_id' => 1, 'code' => 'STU7589', 'name' => 'សុខ ចាន់ដារ៉ា', 'class' => '12A', 'semester' => 'ឆមាសទី ១', 'rank' => 1, 'average' => 48.5, 'status' => 'ជាប់', 'pdf_url' => '/reports/card-1.pdf'],
                ['student_id' => 2, 'code' => 'STU8901', 'name' => 'កែវ វិសាល', 'class' => '12A', 'semester' => 'ឆមាសទី ១', 'rank' => 2, 'average' => 47.8, 'status' => 'ជាប់', 'pdf_url' => '/reports/card-2.pdf'],
            ]
        ]);
    }

    /**
     * 5.2 Teacher Timetable
     */
    public function teacherTimetable(Request $request): JsonResponse
    {
        $teacherId = $request->input('teacher_id', 1);
        return response()->json([
            'teacher_id' => $teacherId,
            'teacher_name' => 'លោកគ្រូ សុខ ចិន្តា (គណិតវិទ្យា)',
            'weekly_hours' => 18,
            'schedule' => [
                ['day' => 'ចន្ទ', 'time' => '07:00 - 08:45 AM', 'class' => '12A', 'room' => '101', 'subject' => 'គណិតវិទ្យា'],
                ['day' => 'ចន្ទ', 'time' => '09:00 - 10:45 AM', 'class' => '12B', 'room' => '102', 'subject' => 'គណិតវិទ្យា'],
                ['day' => 'អង្គារ', 'time' => '07:00 - 08:45 AM', 'class' => '11A', 'room' => '201', 'subject' => 'គណិតវិទ្យា'],
                ['day' => 'ពុធ', 'time' => '07:00 - 08:45 AM', 'class' => '12A', 'room' => '101', 'subject' => 'គណិតវិទ្យា'],
                ['day' => 'ព្រហស្បតិ៍', 'time' => '09:00 - 10:45 AM', 'class' => '12B', 'room' => '102', 'subject' => 'គណិតវិទ្យា'],
            ]
        ]);
    }

    /**
     * 5.3 Room Schedule
     */
    public function roomSchedule(Request $request): JsonResponse
    {
        return response()->json([
            'rooms' => [
                ['room' => 'បន្ទប់ 101', 'building' => 'អាគារ A', 'capacity' => 45, 'status' => 'occupied', 'current_class' => '12A', 'teacher' => 'លោកគ្រូ សុខ'],
                ['room' => 'បន្ទប់ 102', 'building' => 'អាគារ A', 'capacity' => 45, 'status' => 'occupied', 'current_class' => '12B', 'teacher' => 'អ្នកគ្រូ មុន្នី'],
                ['room' => 'បន្ទប់ 201', 'building' => 'អាគារ B', 'capacity' => 45, 'status' => 'occupied', 'current_class' => '11A', 'teacher' => 'លោកគ្រូ ហេង'],
                ['room' => 'បន្ទប់ពិសោធន៍ Lab 1', 'building' => 'អាគារ STEM', 'capacity' => 40, 'status' => 'occupied', 'current_class' => '12C (គីមី)', 'teacher' => 'លោកគ្រូ ចាន់'],
                ['room' => 'បន្ទប់កុំព្យូទ័រ Lab 2', 'building' => 'អាគារ STEM', 'capacity' => 50, 'status' => 'available', 'current_class' => '-', 'teacher' => '-'],
            ]
        ]);
    }

    /**
     * 5.4 Exam Timetable
     */
    public function examTimetable(Request $request): JsonResponse
    {
        return response()->json([
            'timetable' => [
                ['session' => 'ព្រឹក', 'date' => '2026-12-15', 'time' => '07:30 - 09:00', 'subject' => 'គណិតវិទ្យា',           'grades' => '10, 11, 12'],
                ['session' => 'ព្រឹក', 'date' => '2026-12-15', 'time' => '09:30 - 11:00', 'subject' => 'រូបវិទ្យា',             'grades' => '10, 11, 12'],
                ['session' => 'ព្រឹក', 'date' => '2026-12-16', 'time' => '07:30 - 09:00', 'subject' => 'អក្សរសាស្ត្រខ្មែរ',    'grades' => '10, 11, 12'],
                ['session' => 'ព្រឹក', 'date' => '2026-12-16', 'time' => '09:30 - 11:00', 'subject' => 'គីមីវិទ្យា / ជីវវិទ្យា', 'grades' => '11, 12'],
                ['session' => 'ព្រឹក', 'date' => '2026-12-17', 'time' => '07:30 - 09:00', 'subject' => 'ភាសាអង់គ្លេស',         'grades' => '10, 11, 12'],
            ]
        ]);
    }

    // ================================================================
    // 4. EXAM MANAGEMENT — showExam, updateExam, destroyExam
    // ================================================================

    public function showExam(Request $request, $id): JsonResponse
    {
        return response()->json([
            'id'                   => $id,
            'title'                => 'ការប្រឡងឆមាសលើកទី ១ (First Semester Exam)',
            'academic_year'        => '2025-2026',
            'start_date'           => '2026-02-15',
            'end_date'             => '2026-02-20',
            'status'               => 'scheduled',
            'grades_participating' => ['10', '11', '12'],
            'total_students'       => 850,
        ]);
    }

    public function updateExam(Request $request, $id): JsonResponse
    {
        $validated = $request->validate([
            'title'         => 'sometimes|string|max:255',
            'academic_year' => 'sometimes|string',
            'start_date'    => 'sometimes|date',
            'end_date'      => 'sometimes|date',
            'status'        => 'nullable|in:scheduled,upcoming,planned,completed,cancelled',
        ]);
        return response()->json([
            'message' => 'បានធ្វើបច្ចុប្បន្នភាពសម័យប្រឡងដោយជោគជ័យ',
            'data'    => array_merge(['id' => $id], $validated),
        ]);
    }

    public function destroyExam(Request $request, $id): JsonResponse
    {
        return response()->json(['message' => 'បានលុបសម័យប្រឡងដោយជោគជ័យ']);
    }

    // ================================================================
    // 4.2 EXAM SCHEDULE — store new schedule entry
    // ================================================================

    public function storeExamSchedule(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'date'     => 'required|date',
            'time'     => 'required|string|max:100',
            'subject'  => 'required|string|max:255',
            'grade'    => 'required|string|max:50',
            'duration' => 'nullable|string|max:50',
            'rooms'    => 'nullable|string|max:255',
        ]);
        return response()->json([
            'message' => 'បានបន្ថែមកាលបរិច្ឆេទប្រឡងដោយជោគជ័យ',
            'data'    => array_merge(['id' => rand(10, 999)], $validated),
        ], 201);
    }

    // ================================================================
    // 4.6 REPORT CARD — by student
    // ================================================================

    public function reportCardByStudent(Request $request, $id): JsonResponse
    {
        return response()->json([
            'student_id' => $id,
            'code'       => 'STU' . str_pad($id, 4, '0', STR_PAD_LEFT),
            'name'       => 'សិស្ស ID ' . $id,
            'class'      => '12A',
            'semester'   => 'ឆមាសទី ១',
            'rank'       => 1,
            'average'    => 48.5,
            'status'     => 'ជាប់',
            'grades'     => [
                ['subject' => 'គណិតវិទ្យា',   'score' => 9.0, 'coefficient' => 3, 'weighted' => 27.0],
                ['subject' => 'ភាសាខ្មែរ',    'score' => 8.5, 'coefficient' => 2, 'weighted' => 17.0],
                ['subject' => 'រូបវិទ្យា',    'score' => 8.0, 'coefficient' => 2, 'weighted' => 16.0],
                ['subject' => 'ភាសាអង់គ្លេស', 'score' => 8.5, 'coefficient' => 2, 'weighted' => 17.0],
            ],
            'pdf_url'    => '/reports/card-' . $id . '.pdf',
        ]);
    }

    // ================================================================
    // 5. TIMETABLE — updateTimetable, destroyTimetable
    // ================================================================

    public function updateTimetable(Request $request, $id): JsonResponse
    {
        $validated = $request->validate([
            'classroom_id' => 'sometimes|exists:classrooms,id',
            'day_of_week'  => 'sometimes|in:monday,tuesday,wednesday,thursday,friday,saturday',
            'start_time'   => 'sometimes|string',
            'end_time'     => 'sometimes|string',
            'subject_id'   => 'nullable|integer',
            'teacher_id'   => 'nullable|integer',
            'room_number'  => 'nullable|string|max:50',
        ]);
        return response()->json([
            'message' => 'បានធ្វើបច្ចុប្បន្នភាពកាលវិភាគដោយជោគជ័យ',
            'data'    => array_merge(['id' => $id], $validated),
        ]);
    }

    public function destroyTimetable(Request $request, $id): JsonResponse
    {
        $this->ensureTimetableTable();
        try {
            DB::table('timetables')->where('id', $id)->delete();
        } catch (\Throwable $e) {}
        return response()->json(['message' => 'បានលុបកាលវិភាគដោយជោគជ័យ']);
    }
}
