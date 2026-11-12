<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Student;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class OperationsController extends Controller
{
    // ================================================================
    // 2. PARENTS MANAGEMENT (Full CRUD)
    // ================================================================

    public function parents(Request $request): JsonResponse
    {
        $sampleParents = [
            ['id' => 1, 'name_km' => 'សុខ សម្បត្តិ',      'name_en' => 'Sok Sambath',      'phone' => '012 345 678', 'occupation' => 'កសិករ',         'student_name' => 'សុខ ចាន់ដារ៉ា', 'classroom' => '12A', 'address' => 'ភូមិស្នួល ស្រុកស្នួល'],
            ['id' => 2, 'name_km' => 'កែវ សុគន្ធា',        'name_en' => 'Keo Sokunthea',    'phone' => '097 888 9999', 'occupation' => 'អាជីវករ',       'student_name' => 'កែវ វិសាល',     'classroom' => '11B', 'address' => 'ផ្សារស្នួល ក្រចេះ'],
            ['id' => 3, 'name_km' => 'ម៉ៅ វីរៈ',            'name_en' => 'Mao Virak',        'phone' => '088 123 4567', 'occupation' => 'មន្ត្រីរាជការ', 'student_name' => 'ម៉ៅ វណ្ណដា',    'classroom' => '12B', 'address' => 'ស្នួល ក្រចេះ'],
            ['id' => 4, 'name_km' => 'ហេង ចំរើន',           'name_en' => 'Heng Chamroeun',   'phone' => '011 223 344',  'occupation' => 'គ្រូបង្រៀន',    'student_name' => 'ហេង សុជាតា',    'classroom' => '10C', 'address' => 'ឃុំស្នួល ស្រុកស្នួល'],
            ['id' => 5, 'name_km' => 'ចាន់ ឌីណា',           'name_en' => 'Chan Dina',        'phone' => '016 556 677',  'occupation' => 'ពាណិជ្ជករ',     'student_name' => 'ចាន់ ស្រីនាង',  'classroom' => '10B', 'address' => 'ស្រុកស្នួល ក្រចេះ'],
        ];
        return response()->json(['total' => count($sampleParents), 'data' => $sampleParents]);
    }

    public function storeParent(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name_km'      => 'required|string|max:255',
            'name_en'      => 'nullable|string|max:255',
            'phone'        => 'required|string|max:50',
            'occupation'   => 'nullable|string|max:255',
            'student_name' => 'nullable|string|max:255',
            'classroom'    => 'nullable|string|max:50',
            'address'      => 'nullable|string|max:255',
        ]);
        return response()->json([
            'message' => 'បានរក្សាទុកព័ត៌មានអាណាព្យាបាលដោយជោគជ័យ',
            'data'    => array_merge(['id' => rand(10, 999)], $validated)
        ], 201);
    }

    public function showParent(Request $request, $id): JsonResponse
    {
        return response()->json([
            'id' => $id, 'name_km' => 'សុខ សម្បត្តិ', 'name_en' => 'Sok Sambath',
            'phone' => '012 345 678', 'occupation' => 'កសិករ',
            'student_name' => 'សុខ ចាន់ដារ៉ា', 'classroom' => '12A', 'address' => 'ភូមិស្នួល',
        ]);
    }

    public function updateParent(Request $request, $id): JsonResponse
    {
        $validated = $request->validate([
            'name_km'      => 'sometimes|string|max:255',
            'name_en'      => 'nullable|string|max:255',
            'phone'        => 'sometimes|string|max:50',
            'occupation'   => 'nullable|string|max:255',
            'address'      => 'nullable|string|max:255',
        ]);
        return response()->json(['message' => 'បានធ្វើបច្ចុប្បន្នភាពអាណាព្យាបាលដោយជោគជ័យ', 'data' => array_merge(['id' => $id], $validated)]);
    }

    public function destroyParent(Request $request, $id): JsonResponse
    {
        return response()->json(['message' => 'បានលុបព័ត៌មានអាណាព្យាបាលដោយជោគជ័យ']);
    }

    // ================================================================
    // 6. STUDENT SERVICES
    // ================================================================

    public function studentServices(Request $request): JsonResponse
    {
        return response()->json([
            'promotions_eligible' => 820,
            're_exam_students'    => 22,
            'retained_students'   => 8,
            'transfers_in'        => 14,
            'transfers_out'       => 5,
            'active_disciplines'  => 3,
            'certificates_issued' => 12,
        ]);
    }

    // --- Disciplines ---
    public function disciplines(Request $request): JsonResponse
    {
        return response()->json([
            'total' => 3,
            'data'  => [
                ['id' => 1, 'student_name' => 'សុខ ចាន់ដារ៉ា', 'code' => 'STU7589', 'classroom' => '12A', 'infraction' => 'គេចសាលាម៉ោងទី ៣',          'date' => '2026-11-05', 'severity' => 'ស្រាល', 'status' => 'warned'],
                ['id' => 2, 'student_name' => 'កែវ វិសាល',     'code' => 'STU8901', 'classroom' => '11B', 'infraction' => 'មិនពាក់ឯកសណ្ឋានសាលា',        'date' => '2026-11-06', 'severity' => 'ស្រាល', 'status' => 'resolved'],
                ['id' => 3, 'student_name' => 'ជា រស្មី',      'code' => 'STU9122', 'classroom' => '10A', 'infraction' => 'ប្រើទូរស័ព្ទក្នុងម៉ោងរៀន',  'date' => '2026-11-07', 'severity' => 'ស្រាល', 'status' => 'warned'],
            ]
        ]);
    }

    public function storeDiscipline(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'student_name' => 'required|string',
            'classroom'    => 'required|string',
            'infraction'   => 'required|string',
            'severity'     => 'required|in:ស្រាល,មធ្យម,ធ្ងន់',
            'date'         => 'required|date',
            'status'       => 'nullable|string',
        ]);
        return response()->json([
            'message' => 'បានកត់ត្រាវិន័យសិស្សជោគជ័យ',
            'data'    => array_merge(['id' => rand(10, 999)], $validated)
        ], 201);
    }

    public function updateDiscipline(Request $request, $id): JsonResponse
    {
        $validated = $request->validate([
            'status'    => 'sometimes|string',
            'infraction'=> 'sometimes|string',
            'severity'  => 'sometimes|string',
        ]);
        return response()->json(['message' => 'បានធ្វើបច្ចុប្បន្នភាពកំណត់ត្រាវិន័យដោយជោគជ័យ', 'data' => array_merge(['id' => $id], $validated)]);
    }

    public function destroyDiscipline(Request $request, $id): JsonResponse
    {
        return response()->json(['message' => 'បានលុបកំណត់ត្រាវិន័យដោយជោគជ័យ']);
    }

    // --- Transfers ---
    public function transfers(Request $request): JsonResponse
    {
        return response()->json([
            'total' => 2,
            'data'  => [
                ['id' => 1, 'code' => 'STU7590', 'name' => 'ម៉ៅ វណ្ណដេត',  'type' => 'transfer_in',  'school' => 'វិទ្យាល័យ ព្រះមហាក្សត្រីយានី (ក្រចេះ)',        'class' => '11A', 'date' => '2026-11-01'],
                ['id' => 2, 'code' => 'STU6820', 'name' => 'ចាន់ ស្រីនាង', 'type' => 'transfer_out', 'school' => 'វិទ្យាល័យ ហ៊ុន សែន មិត្តភាព (ភ្នំពេញ)', 'class' => '10B', 'date' => '2026-10-25'],
            ]
        ]);
    }

    public function storeTransfer(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name'   => 'required|string',
            'type'   => 'required|in:transfer_in,transfer_out',
            'school' => 'required|string',
            'class'  => 'required|string',
            'date'   => 'required|date',
        ]);
        return response()->json([
            'message' => 'បានកត់ត្រាការផ្ទេរការសិក្សាជោគជ័យ',
            'data'    => array_merge(['id' => rand(10, 999), 'code' => 'STU' . rand(1000, 9999)], $validated)
        ], 201);
    }

    public function updateTransfer(Request $request, $id): JsonResponse
    {
        $validated = $request->validate([
            'type'   => 'sometimes|in:transfer_in,transfer_out',
            'school' => 'sometimes|string',
            'date'   => 'sometimes|date',
        ]);
        return response()->json(['message' => 'បានធ្វើបច្ចុប្បន្នភាពការផ្ទេរដោយជោគជ័យ', 'data' => array_merge(['id' => $id], $validated)]);
    }

    public function destroyTransfer(Request $request, $id): JsonResponse
    {
        return response()->json(['message' => 'បានលុបកំណត់ត្រាផ្ទេរដោយជោគជ័យ']);
    }

    public function promoteStudents(Request $request): JsonResponse
    {
        return response()->json([
            'message'        => 'ដំណើរការឡើងថ្នាក់សិស្សជោគជ័យ (សរុប ៨២០ នាក់ឡើងថ្នាក់)',
            'promoted_count' => 820,
            'retained_count' => 8,
            'details'        => [
                ['from_class' => 'ថ្នាក់ទី ១០', 'to_class' => 'ថ្នាក់ទី ១១', 'promoted' => 305, 'retained' => 5],
                ['from_class' => 'ថ្នាក់ទី ១១', 'to_class' => 'ថ្នាក់ទី ១២', 'promoted' => 275, 'retained' => 3],
                ['from_class' => 'ថ្នាក់ទី ១២', 'to_class' => 'បញ្ចប់ការសិក្សា', 'promoted' => 240, 'retained' => 0],
            ]
        ]);
    }

    // --- Certificates ---
    public function certificates(Request $request): JsonResponse
    {
        return response()->json([
            'total' => 3,
            'data'  => [
                ['id' => 1, 'code' => 'CERT-2026-001', 'student_name' => 'សុខ ចាន់ដារ៉ា', 'class' => '12A', 'type' => 'លិខិតបញ្ជាក់ការសិក្សា',  'issue_date' => '2026-11-01', 'status' => 'approved'],
                ['id' => 2, 'code' => 'CERT-2026-002', 'student_name' => 'កែវ វិសាល',     'class' => '11B', 'type' => 'លិខិតបញ្ជាក់សិស្សពូកែ', 'issue_date' => '2026-11-05', 'status' => 'approved'],
                ['id' => 3, 'code' => 'CERT-2026-003', 'student_name' => 'ហេង សុជាតា',    'class' => '10C', 'type' => 'លិខិតបញ្ជាក់ការសិក្សា',  'issue_date' => '2026-11-07', 'status' => 'pending'],
            ]
        ]);
    }

    public function storeCertificate(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'student_name' => 'required|string',
            'class'        => 'required|string',
            'type'         => 'required|string',
            'issue_date'   => 'required|date',
        ]);
        return response()->json([
            'message' => 'បានចេញវិញ្ញាបនបត្រដោយជោគជ័យ',
            'data'    => array_merge(['id' => rand(10, 999), 'code' => 'CERT-2026-' . rand(100, 999), 'status' => 'pending'], $validated)
        ], 201);
    }

    public function updateCertificate(Request $request, $id): JsonResponse
    {
        $validated = $request->validate([
            'status' => 'sometimes|in:approved,pending,rejected',
        ]);
        return response()->json(['message' => 'បានធ្វើបច្ចុប្បន្នភាពស្ថានភាពវិញ្ញាបនបត្រដោយជោគជ័យ', 'data' => array_merge(['id' => $id], $validated)]);
    }

    // --- Documents ---
    public function documents(Request $request): JsonResponse
    {
        return response()->json([
            'total' => 3,
            'data'  => [
                ['id' => 1, 'student_name' => 'សុខ ចាន់ដារ៉ា', 'code' => 'STU7589', 'document_type' => 'សំបុត្រកំណើត',               'file_name' => 'birth_certificate_stu7589.pdf', 'upload_date' => '2025-10-15'],
                ['id' => 2, 'student_name' => 'សុខ ចាន់ដារ៉ា', 'code' => 'STU7589', 'document_type' => 'សញ្ញាបត្របឋមភូមិ (ឌីប្លូម)', 'file_name' => 'diploma_stu7589.pdf',          'upload_date' => '2025-10-15'],
                ['id' => 3, 'student_name' => 'កែវ វិសាល',     'code' => 'STU8901', 'document_type' => 'សំបុត្រកំណើត',               'file_name' => 'birth_cert_8901.pdf',          'upload_date' => '2025-10-18'],
            ]
        ]);
    }

    public function storeDocument(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'student_name'  => 'required|string',
            'code'          => 'required|string',
            'document_type' => 'required|string',
        ]);
        return response()->json([
            'message' => 'បានបញ្ចូលឯកសារដោយជោគជ័យ',
            'data'    => array_merge(['id' => rand(10, 999), 'upload_date' => Carbon::today()->toDateString()], $validated)
        ], 201);
    }

    public function destroyDocument(Request $request, $id): JsonResponse
    {
        return response()->json(['message' => 'បានលុបឯកសារដោយជោគជ័យ']);
    }

    // ================================================================
    // 7. FINANCE MANAGEMENT (Full CRUD)
    // ================================================================

    public function finance(Request $request): JsonResponse
    {
        return response()->json([
            'summary' => [
                'total_income'   => 12500,
                'total_expenses' => 4300,
                'net_balance'    => 8200,
                'currency'       => 'USD / KHR',
            ],
            'fee_categories' => [
                ['id' => 1, 'name' => 'វិភាគទានសមាគមមាតាបិតា (PTA Fund)',  'amount' => '20,000 KHR / ឆ្នាំ', 'collected' => '85%'],
                ['id' => 2, 'name' => 'សៀវភៅតាមដាន & កាតសិស្ស',           'amount' => '10,000 KHR',          'collected' => '98%'],
                ['id' => 3, 'name' => 'ឯកសណ្ឋានកីឡាប្រចាំវិទ្យាល័យ',      'amount' => '25,000 KHR',          'collected' => '90%'],
            ],
            'recent_transactions' => [
                ['id' => 101, 'type' => 'income',  'title' => 'បង់វិភាគទានសមាគម 12A (30 នាក់)',                   'amount' => '+600,000 KHR', 'date' => '2026-11-07'],
                ['id' => 102, 'type' => 'expense', 'title' => 'ទិញសម្ភារៈពិសោធន៍វិទ្យាសាស្ត្រ (គីមី & រូបវិទ្យា)', 'amount' => '-$250.00',    'date' => '2026-11-06'],
                ['id' => 103, 'type' => 'expense', 'title' => 'ជួសជុលកង្ហារ និងភ្លើងបន្ទប់រៀន 11B & 10C',          'amount' => '-80,000 KHR', 'date' => '2026-11-05'],
                ['id' => 104, 'type' => 'income',  'title' => 'ជំនួយឧបត្ថម្ភសប្បុរសធម៌ (Library)',                  'amount' => '+$500.00',    'date' => '2026-11-04'],
            ]
        ]);
    }

    public function fees(Request $request): JsonResponse
    {
        return response()->json([
            'total' => 3,
            'data'  => [
                ['id' => 1, 'name' => 'វិភាគទានសមាគមមាតាបិតា (PTA Fund)', 'amount' => '20,000 KHR', 'type' => 'annual',    'collected' => '85%', 'due_date' => '2025-12-31'],
                ['id' => 2, 'name' => 'សៀវភៅតាមដាន & កាតសិស្ស',          'amount' => '10,000 KHR', 'type' => 'one_time',  'collected' => '98%', 'due_date' => '2025-11-30'],
                ['id' => 3, 'name' => 'ឯកសណ្ឋានកីឡាប្រចាំវិទ្យាល័យ',     'amount' => '25,000 KHR', 'type' => 'optional',  'collected' => '90%', 'due_date' => '2025-12-15'],
            ]
        ]);
    }

    public function storeFee(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name'     => 'required|string|max:255',
            'amount'   => 'required|string|max:50',
            'type'     => 'required|in:annual,one_time,optional',
            'due_date' => 'nullable|date',
        ]);
        return response()->json(['message' => 'បានបង្កើតប្រភេទថ្លៃថ្មីដោយជោគជ័យ', 'data' => array_merge(['id' => rand(10, 999), 'collected' => '0%'], $validated)], 201);
    }

    public function updateFee(Request $request, $id): JsonResponse
    {
        $validated = $request->validate([
            'name'   => 'sometimes|string|max:255',
            'amount' => 'sometimes|string|max:50',
        ]);
        return response()->json(['message' => 'បានធ្វើបច្ចុប្បន្នភាពថ្លៃដោយជោគជ័យ', 'data' => array_merge(['id' => $id], $validated)]);
    }

    public function destroyFee(Request $request, $id): JsonResponse
    {
        return response()->json(['message' => 'បានលុបប្រភេទថ្លៃដោយជោគជ័យ']);
    }

    public function payments(Request $request): JsonResponse
    {
        return response()->json([
            'total' => 3,
            'data'  => [
                ['id' => 'REC-001', 'student' => 'សុខ ចាន់ដារ៉ា', 'class' => '12A', 'item' => 'មូលនិធិសមាគម',               'amount' => '20,000 KHR', 'date' => '2026-11-01', 'status' => 'paid'],
                ['id' => 'REC-002', 'student' => 'កែវ វិសាល',     'class' => '11B', 'item' => 'កាតសិស្ស & សៀវភៅតាមដាន',    'amount' => '10,000 KHR', 'date' => '2026-11-02', 'status' => 'paid'],
                ['id' => 'REC-003', 'student' => 'ជា រស្មី',      'class' => '10A', 'item' => 'ឯកសណ្ឋានកីឡា',               'amount' => '25,000 KHR', 'date' => '2026-11-05', 'status' => 'paid'],
            ]
        ]);
    }

    public function storePayment(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'student'  => 'required|string',
            'class'    => 'required|string',
            'item'     => 'required|string',
            'amount'   => 'required|string',
            'date'     => 'required|date',
        ]);
        return response()->json([
            'message' => 'បានកត់ត្រាការទូទាត់ដោយជោគជ័យ',
            'data'    => array_merge(['id' => 'REC-' . rand(100, 999), 'status' => 'paid'], $validated)
        ], 201);
    }

    public function expenses(Request $request): JsonResponse
    {
        return response()->json([
            'total' => 3,
            'data'  => [
                ['id' => 1, 'desc' => 'ទិញសម្ភារការិយាល័យ & ក្រដាសប្រឡង A4', 'amount' => 450, 'date' => '2026-11-03', 'category' => 'សម្ភារៈ'],
                ['id' => 2, 'desc' => 'ថ្លៃថែទាំបណ្តាញទឹក-ភ្លើងសាលា',         'amount' => 180, 'date' => '2026-11-04', 'category' => 'ថែទាំ'],
                ['id' => 3, 'desc' => 'ចំណាយលើកម្មវិធីប្រកួតកីឡា',            'amount' => 600, 'date' => '2026-11-06', 'category' => 'សកម្មភាព'],
            ]
        ]);
    }

    public function storeExpense(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'desc'     => 'required|string|max:255',
            'amount'   => 'required|numeric|min:0',
            'date'     => 'required|date',
            'category' => 'nullable|string|max:100',
        ]);
        return response()->json(['message' => 'បានកត់ត្រាចំណាយថ្មីដោយជោគជ័យ', 'data' => array_merge(['id' => rand(10, 999)], $validated)], 201);
    }

    public function updateExpense(Request $request, $id): JsonResponse
    {
        $validated = $request->validate([
            'desc'     => 'sometimes|string|max:255',
            'amount'   => 'sometimes|numeric|min:0',
            'category' => 'nullable|string|max:100',
        ]);
        return response()->json(['message' => 'បានធ្វើបច្ចុប្បន្នភាពចំណាយដោយជោគជ័យ', 'data' => array_merge(['id' => $id], $validated)]);
    }

    public function destroyExpense(Request $request, $id): JsonResponse
    {
        return response()->json(['message' => 'បានលុបកំណត់ត្រាចំណាយដោយជោគជ័យ']);
    }

    public function income(Request $request): JsonResponse
    {
        return response()->json([
            'total' => 3,
            'data'  => [
                ['id' => 1, 'source' => 'ថវិកាឧបត្ថម្ភពីរដ្ឋ (PB Grant)',   'amount' => 8500, 'date' => '2026-10-01', 'status' => 'received'],
                ['id' => 2, 'source' => 'មូលនិធិសមាគមមាតាបិតា',             'amount' => 3200, 'date' => '2026-11-01', 'status' => 'received'],
                ['id' => 3, 'source' => 'សប្បុរសជន និងអតីតសិស្ស',            'amount' => 800,  'date' => '2026-11-05', 'status' => 'received'],
            ]
        ]);
    }

    public function storeIncome(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'source' => 'required|string|max:255',
            'amount' => 'required|numeric|min:0',
            'date'   => 'required|date',
        ]);
        return response()->json(['message' => 'បានកត់ត្រាចំណូលថ្មីដោយជោគជ័យ', 'data' => array_merge(['id' => rand(10, 999), 'status' => 'received'], $validated)], 201);
    }

    public function financeReports(Request $request): JsonResponse
    {
        return response()->json([
            'title'          => 'របាយការណ៍ហិរញ្ញវត្ថុប្រចាំឆ្នាំ',
            'total_income'   => 12500,
            'total_expenses' => 4300,
            'net_balance'    => 8200,
            'currency'       => 'USD',
            'by_month'       => [
                ['month' => 'តុលា',   'income' => 9500, 'expense' => 2000, 'balance' => 7500],
                ['month' => 'វិច្ឆិកា','income' => 3000, 'expense' => 2300, 'balance' => 700],
            ]
        ]);
    }

    public function storeTransaction(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'type'   => 'required|in:income,expense',
            'title'  => 'required|string|max:255',
            'amount' => 'required|string|max:50',
            'date'   => 'required|date',
            'payer'  => 'nullable|string|max:255',
        ]);
        return response()->json([
            'message' => 'បានកត់ត្រាប្រតិបត្តិការហិរញ្ញវត្ថុជោគជ័យ',
            'data'    => array_merge(['id' => rand(105, 999)], $validated)
        ], 201);
    }

    // ================================================================
    // 8. LIBRARY MANAGEMENT (Full CRUD)
    // ================================================================

    public function library(Request $request): JsonResponse
    {
        return response()->json([
            'stats' => [
                'total_books'    => 3450,
                'borrowed_books' => 142,
                'returned_today' => 18,
                'overdue_books'  => 7,
            ],
            'categories' => [
                ['name' => 'សៀវភៅពុម្ពក្រសួង (MoEYS Textbooks)', 'count' => 2200],
                ['name' => 'វិទ្យាសាស្ត្រ និងបច្ចេកវិទ្យា',         'count' => 450],
                ['name' => 'អក្សរសិល្ប៍ និងប្រវត្តិវិទ្យា',         'count' => 500],
                ['name' => 'វចនានុក្រម និងឯកសារយោង',               'count' => 300],
            ],
        ]);
    }

    public function books(Request $request): JsonResponse
    {
        return response()->json([
            'total' => 4,
            'data'  => [
                ['id' => 1, 'isbn' => '978-99950-01', 'title' => 'គណិតវិទ្យា ថ្នាក់ទី ១២ (កម្រិតខ្ពស់)', 'author' => 'ក្រសួងអប់រំ',       'category' => 'សៀវភៅពុម្ព',  'copies' => 150, 'available' => 120],
                ['id' => 2, 'isbn' => '978-99950-02', 'title' => 'រូបវិទ្យា ថ្នាក់ទី ១២',                 'author' => 'ក្រសួងអប់រំ',       'category' => 'សៀវភៅពុម្ព',  'copies' => 140, 'available' => 110],
                ['id' => 3, 'isbn' => '978-99950-03', 'title' => 'ប្រលោមលោក រឿង គូលីកំណែន',              'author' => 'អ៊ឹម ថុក',           'category' => 'អក្សរសិល្ប៍', 'copies' => 25,  'available' => 18],
                ['id' => 4, 'isbn' => '978-99950-04', 'title' => 'កម្រងរូបមន្តវិទ្យាសាស្ត្រ',              'author' => 'សាស្ត្រាចារ្យ ហេង', 'category' => 'ឯកសារជំនួយ', 'copies' => 60,  'available' => 45],
            ]
        ]);
    }

    public function storeBook(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'isbn'     => 'nullable|string|max:50',
            'title'    => 'required|string|max:255',
            'author'   => 'required|string|max:255',
            'category' => 'nullable|string|max:100',
            'copies'   => 'required|integer|min:1',
        ]);
        return response()->json(['message' => 'បានចុះឈ្មោះសៀវភៅថ្មីដោយជោគជ័យ', 'data' => array_merge(['id' => rand(10, 999), 'available' => $validated['copies']], $validated)], 201);
    }

    public function showBook(Request $request, $id): JsonResponse
    {
        return response()->json(['id' => $id, 'isbn' => '978-99950-0' . $id, 'title' => 'គណិតវិទ្យា ថ្នាក់ទី ១២', 'author' => 'ក្រសួងអប់រំ', 'category' => 'សៀវភៅពុម្ព', 'copies' => 150, 'available' => 120]);
    }

    public function updateBook(Request $request, $id): JsonResponse
    {
        $validated = $request->validate([
            'title'    => 'sometimes|string|max:255',
            'author'   => 'sometimes|string|max:255',
            'copies'   => 'sometimes|integer|min:1',
            'category' => 'sometimes|string|max:100',
        ]);
        return response()->json(['message' => 'បានធ្វើបច្ចុប្បន្នភាពសៀវភៅដោយជោគជ័យ', 'data' => array_merge(['id' => $id], $validated)]);
    }

    public function destroyBook(Request $request, $id): JsonResponse
    {
        return response()->json(['message' => 'បានលុបសៀវភៅដោយជោគជ័យ']);
    }

    public function borrows(Request $request): JsonResponse
    {
        return response()->json([
            'total' => 2,
            'data'  => [
                ['id' => 1, 'student' => 'សុខ ចាន់ដារ៉ា', 'classroom' => '12A', 'book' => 'គណិតវិទ្យា ថ្នាក់ទី១២ (ភាគ២)', 'borrow_date' => '2026-11-01', 'due_date' => '2026-11-15', 'status' => 'borrowed'],
                ['id' => 2, 'student' => 'ម៉ៅ វណ្ណដា',    'classroom' => '12B', 'book' => 'ជីវវិទ្យា ថ្នាក់ទី១២',          'borrow_date' => '2026-10-25', 'due_date' => '2026-11-08', 'status' => 'due_today'],
            ]
        ]);
    }

    public function borrowBook(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'student_name' => 'required|string',
            'classroom'    => 'required|string',
            'book_title'   => 'required|string',
            'borrow_date'  => 'required|date',
            'due_date'     => 'required|date',
        ]);
        return response()->json(['message' => 'បានកត់ត្រាការខ្ចីសៀវភៅជោគជ័យ', 'data' => array_merge(['id' => rand(10, 999), 'status' => 'borrowed'], $validated)], 201);
    }

    public function returnBook(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'book_code'  => 'nullable|string',
            'student_id' => 'nullable|string',
        ]);
        return response()->json(['message' => 'បានកត់ត្រាការសងសៀវភៅចូលឃ្លាំងវិញជោគជ័យ', 'returned_at' => Carbon::now()->toDateTimeString()]);
    }

    public function overdueBooks(Request $request): JsonResponse
    {
        return response()->json([
            'total' => 2,
            'data'  => [
                ['id' => 1, 'book' => 'រូបវិទ្យា ថ្នាក់ទី ១២',       'student' => 'សុខ ចាន់ដារ៉ា', 'class' => '12A', 'due_date' => '2026-11-01', 'days_overdue' => 7, 'phone' => '012 334 455'],
                ['id' => 2, 'book' => 'គណិតវិទ្យា ថ្នាក់ទី ១១',     'student' => 'កែវ វិសាល',     'class' => '11B', 'due_date' => '2026-11-03', 'days_overdue' => 5, 'phone' => '098 776 655'],
            ]
        ]);
    }

    // ================================================================
    // 9. COMMUNICATION (Full CRUD)
    // ================================================================

    public function communication(Request $request): JsonResponse
    {
        return response()->json([
            'total_announcements' => 2,
            'total_events'        => 3,
            'unread_notifications'=> 2,
        ]);
    }

    public function announcements(Request $request): JsonResponse
    {
        return response()->json([
            'total' => 2,
            'data'  => [
                ['id' => 1, 'title' => 'កាលវិភាគប្រឡងឆមាសលើកទី ១', 'content' => 'ការប្រឡងឆមាសនឹងចាប់ផ្តើមពីថ្ងៃទី ១៥ ខែកុម្ភៈ...', 'date' => '2026-11-05', 'author' => 'ការិយាល័យសិក្សា', 'priority' => 'high'],
                ['id' => 2, 'title' => 'ការរៀបចំទិវាបរិស្ថាន',       'content' => 'វិទ្យាល័យ ហ៊ុន សែន ស្នួល នឹងប្រារព្ធ...',          'date' => '2026-11-02', 'author' => 'យុវជនកាកបាទ',    'priority' => 'normal'],
            ]
        ]);
    }

    public function storeAnnouncement(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'title'    => 'required|string|max:255',
            'content'  => 'required|string',
            'priority' => 'required|in:high,normal,low',
        ]);
        return response()->json([
            'message' => 'បានផ្សាយដំណឹងជោគជ័យ',
            'data'    => array_merge(['id' => rand(10, 999), 'date' => Carbon::today()->toDateString(), 'author' => 'Admin'], $validated)
        ], 201);
    }

    public function showAnnouncement(Request $request, $id): JsonResponse
    {
        return response()->json(['id' => $id, 'title' => 'ការប្រកាសទូទៅ', 'content' => 'ខ្លឹមសារ...', 'date' => Carbon::today()->toDateString(), 'author' => 'Admin', 'priority' => 'normal']);
    }

    public function updateAnnouncement(Request $request, $id): JsonResponse
    {
        $validated = $request->validate([
            'title'    => 'sometimes|string|max:255',
            'content'  => 'sometimes|string',
            'priority' => 'sometimes|in:high,normal,low',
        ]);
        return response()->json(['message' => 'បានធ្វើបច្ចុប្បន្នភាពការប្រកាសដោយជោគជ័យ', 'data' => array_merge(['id' => $id], $validated)]);
    }

    public function destroyAnnouncement(Request $request, $id): JsonResponse
    {
        return response()->json(['message' => 'បានលុបការប្រកាសដោយជោគជ័យ']);
    }

    public function notifications(Request $request): JsonResponse
    {
        return response()->json([
            'total'  => 2,
            'unread' => 1,
            'data'   => [
                ['id' => 1, 'title' => 'ការប្រជុំគណៈគ្រប់គ្រងសាលា',     'message' => 'សូមអញ្ជើញចូលរួមប្រជុំ...', 'time' => '1 ម៉ោងមុន', 'is_read' => false, 'type' => 'meeting'],
                ['id' => 2, 'title' => 'រំលឹកការបញ្ចូលពិន្ទុខែវិច្ឆិកា', 'message' => 'សូមបញ្ចូលពិន្ទុឱ្យបានមុន...', 'time' => '1 ថ្ងៃមុន',  'is_read' => true,  'type' => 'reminder'],
            ]
        ]);
    }

    public function storeNotification(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'title'   => 'required|string|max:255',
            'message' => 'required|string',
            'type'    => 'nullable|string|max:50',
        ]);
        return response()->json(['message' => 'បានផ្ញើការជូនដំណឹងជោគជ័យ', 'data' => array_merge(['id' => rand(10, 999), 'is_read' => false, 'time' => 'ឥឡូវ'], $validated)], 201);
    }

    public function markNotificationRead(Request $request, $id): JsonResponse
    {
        return response()->json(['message' => 'បានសម្គាល់ការជូនដំណឹងថាបានអាន', 'id' => $id, 'is_read' => true]);
    }

    public function schoolEvents(Request $request): JsonResponse
    {
        return response()->json([
            'total' => 3,
            'data'  => [
                ['id' => 1, 'title' => "ទិវាគ្រូបង្រៀន (Teachers' Day)", 'date' => '2026-10-05', 'location' => 'ទីធ្លាវិទ្យាល័យ',   'status' => 'completed'],
                ['id' => 2, 'title' => 'បុណ្យឯករាជ្យជាតិ',               'date' => '2026-11-09', 'location' => 'សាលប្រជុំធំ',       'status' => 'upcoming'],
                ['id' => 3, 'title' => 'ការប្រកួតកីឡាប្រចាំវិទ្យាល័យ', 'date' => '2026-12-20', 'location' => 'តារាងបាល់ទាត់',    'status' => 'planned'],
            ]
        ]);
    }

    public function storeEvent(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'title'    => 'required|string|max:255',
            'date'     => 'required|date',
            'location' => 'nullable|string|max:255',
        ]);
        return response()->json(['message' => 'បានបង្កើតព្រឹត្តការណ៍ថ្មីដោយជោគជ័យ', 'data' => array_merge(['id' => rand(10, 999), 'status' => 'planned'], $validated)], 201);
    }

    public function updateEvent(Request $request, $id): JsonResponse
    {
        $validated = $request->validate([
            'title'    => 'sometimes|string|max:255',
            'date'     => 'sometimes|date',
            'location' => 'nullable|string|max:255',
            'status'   => 'sometimes|in:planned,upcoming,completed,cancelled',
        ]);
        return response()->json(['message' => 'បានធ្វើបច្ចុប្បន្នភាពព្រឹត្តការណ៍ដោយជោគជ័យ', 'data' => array_merge(['id' => $id], $validated)]);
    }

    public function destroyEvent(Request $request, $id): JsonResponse
    {
        return response()->json(['message' => 'បានលុបព្រឹត្តការណ៍ដោយជោគជ័យ']);
    }

    public function academicCalendar(Request $request): JsonResponse
    {
        return response()->json([
            'academic_year' => '2025-2026',
            'calendar'      => [
                ['date' => '០១ វិច្ឆិកា ២០២៥',     'title' => 'បើកបវេសនកាលឆ្នាំសិក្សាថ្មី ២០២៥-២០២៦'],
                ['date' => '១៥ ដល់ ១៨ ធ្នូ ២០២៦',   'title' => 'សម័យប្រឡងឆមាសលើកទី ១'],
                ['date' => '០១-០៧ មេសា ២០២៦',       'title' => 'វិស្សមកាលតូច + បុណ្យចូលឆ្នាំប្រពៃណីជាតិ'],
                ['date' => '១០ សីហា ២០២៦',           'title' => 'ការប្រឡងបាក់ឌុប (Grade 12 National Exam)'],
            ]
        ]);
    }

    public function storeCalendarEvent(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'date'  => 'required|string|max:100',
        ]);
        return response()->json(['message' => 'បានបន្ថែមមួយធាតុក្នុងប្រតិទិនសិក្សាដោយជោគជ័យ', 'data' => $validated], 201);
    }

    // ================================================================
    // 10. REPORTS & ANALYTICS
    // ================================================================

    public function reports(Request $request): JsonResponse
    {
        return response()->json([
            'available_reports' => [
                ['id' => 'students_roster',   'title' => 'បញ្ជីឈ្មោះសិស្សតាមថ្នាក់ (Class Roster)',           'format' => ['PDF', 'Excel']],
                ['id' => 'monthly_rankings',  'title' => 'តារាងចំណាត់ថ្នាក់ប្រចាំខែ (Monthly Rankings)',     'format' => ['PDF', 'Excel']],
                ['id' => 'attendance_summary','title' => 'របាយការណ៍អវត្តមានសិស្ស (Attendance Summary)',      'format' => ['PDF']],
                ['id' => 'report_card',       'title' => 'សៀវភៅតាមដានការសិក្សា (Student Report Card)',       'format' => ['PDF']],
                ['id' => 'finance_audit',     'title' => 'របាយការណ៍សវនកម្មហិរញ្ញវត្ថុ (Financial Audit)',   'format' => ['PDF', 'Excel']],
                ['id' => 'teacher_summary',   'title' => 'របាយការណ៍គ្រូបង្រៀន (Teacher Summary)',           'format' => ['PDF', 'Excel']],
            ],
            'generated_at' => Carbon::now()->toDateTimeString(),
        ]);
    }

    public function studentReports(Request $request): JsonResponse
    {
        return response()->json([
            'title'          => 'របាយការណ៍សិស្សទូទាំងវិទ្យាល័យ',
            'total_students' => 850,
            'female_count'   => 415,
            'male_count'     => 435,
            'by_grade'       => [
                ['grade' => 'ថ្នាក់ទី ១០', 'total' => 310, 'female' => 155, 'male' => 155, 'science' => 0,   'social' => 0],
                ['grade' => 'ថ្នាក់ទី ១១', 'total' => 280, 'female' => 140, 'male' => 140, 'science' => 170, 'social' => 110],
                ['grade' => 'ថ្នាក់ទី ១២', 'total' => 260, 'female' => 120, 'male' => 140, 'science' => 160, 'social' => 100],
            ],
        ]);
    }

    public function teacherReports(Request $request): JsonResponse
    {
        return response()->json([
            'title'                 => 'របាយការណ៍គ្រូបង្រៀន និងបន្ទុកម៉ោង',
            'total_teachers'        => 45,
            'female_teachers'       => 19,
            'male_teachers'         => 26,
            'average_hours_per_week'=> 18,
            'homeroom_teachers'     => 24,
            'by_subject'            => [
                ['subject' => 'គណិតវិទ្យា',   'count' => 8],
                ['subject' => 'ភាសាខ្មែរ',    'count' => 7],
                ['subject' => 'ភាសាអង់គ្លេស', 'count' => 6],
                ['subject' => 'រូបវិទ្យា',    'count' => 6],
                ['subject' => 'ជីវវិទ្យា',    'count' => 5],
                ['subject' => 'គីមីវិទ្យា',   'count' => 5],
                ['subject' => 'ព័ត៌មានវិទ្យា','count' => 4],
                ['subject' => 'ប្រវត្តិវិទ្យា','count' => 4],
            ],
        ]);
    }

    public function attendanceReports(Request $request): JsonResponse
    {
        return response()->json([
            'title'          => 'របាយការណ៍វត្តមានប្រចាំខែ',
            'overall_rate'   => '98.2%',
            'total_absences' => 42,
            'total_permissions' => 35,
            'total_lates'    => 18,
            'monthly_trend'  => [
                ['month' => 'វិច្ឆិកា', 'rate' => 98.2, 'absent' => 42, 'permission' => 35],
                ['month' => 'តុលា',     'rate' => 97.8, 'absent' => 55, 'permission' => 40],
            ],
        ]);
    }

    public function examReports(Request $request): JsonResponse
    {
        return response()->json([
            'title'           => 'របាយការណ៍លទ្ធផលប្រឡងប្រចាំឆ្នាំ',
            'pass_rate'       => '96.5%',
            'top_grades_A_B'  => 165,
            'failed_students' => 30,
            'by_grade'        => [
                ['grade' => 'ថ្នាក់ទី ១០', 'pass_rate' => '97.1%', 'avg_score' => 42.5],
                ['grade' => 'ថ្នាក់ទី ១១', 'pass_rate' => '96.4%', 'avg_score' => 41.8],
                ['grade' => 'ថ្នាក់ទី ១២', 'pass_rate' => '95.8%', 'avg_score' => 43.2],
            ],
        ]);
    }

    public function exportReport(Request $request): JsonResponse
    {
        $type   = $request->input('type', 'general');
        $format = $request->input('format', 'excel');
        return response()->json([
            'message'      => "បានបង្កើតឯកសាររបាយការណ៍ជាទម្រង់ {$format} ដោយជោគជ័យ",
            'download_url' => "/downloads/reports/{$type}.{$format}",
            'filename'     => "Report_{$type}_" . Carbon::now()->format('Ymd_His') . ".{$format}",
            'expires_at'   => Carbon::now()->addHours(2)->toDateTimeString(),
        ]);
    }

    // ================================================================
    // Gap #3 — Certificates: destroyCertificate
    // ================================================================

    public function destroyCertificate(Request $request, $id): JsonResponse
    {
        return response()->json(['message' => 'បានលុបវិញ្ញាបនបត្រដោយជោគជ័យ', 'id' => $id]);
    }

    // ================================================================
    // Gap #4 — Finance Payments: updatePayment, destroyPayment
    // ================================================================

    public function updatePayment(Request $request, $id): JsonResponse
    {
        $validated = $request->validate([
            'student'  => 'sometimes|string',
            'class'    => 'sometimes|string',
            'item'     => 'sometimes|string',
            'amount'   => 'sometimes|string',
            'date'     => 'sometimes|date',
            'status'   => 'sometimes|in:paid,pending,cancelled',
        ]);
        return response()->json([
            'message' => 'បានធ្វើបច្ចុប្បន្នភាពការទូទាត់ដោយជោគជ័យ',
            'data'    => array_merge(['id' => $id], $validated),
        ]);
    }

    public function destroyPayment(Request $request, $id): JsonResponse
    {
        return response()->json(['message' => 'បានលុបកំណត់ត្រាការទូទាត់ដោយជោគជ័យ', 'id' => $id]);
    }

    // ================================================================
    // Gap #5 — Finance Income: updateIncome, destroyIncome
    // ================================================================

    public function updateIncome(Request $request, $id): JsonResponse
    {
        $validated = $request->validate([
            'source' => 'sometimes|string|max:255',
            'amount' => 'sometimes|numeric|min:0',
            'date'   => 'sometimes|date',
            'status' => 'sometimes|in:received,pending,cancelled',
        ]);
        return response()->json([
            'message' => 'បានធ្វើបច្ចុប្បន្នភាពចំណូលដោយជោគជ័យ',
            'data'    => array_merge(['id' => $id], $validated),
        ]);
    }

    public function destroyIncome(Request $request, $id): JsonResponse
    {
        return response()->json(['message' => 'បានលុបកំណត់ត្រាចំណូលដោយជោគជ័យ', 'id' => $id]);
    }

    // ================================================================
    // Gap #6 — Calendar: updateCalendarEvent, destroyCalendarEvent
    // ================================================================

    public function updateCalendarEvent(Request $request, $id): JsonResponse
    {
        $validated = $request->validate([
            'title' => 'sometimes|string|max:255',
            'date'  => 'sometimes|string|max:100',
            'type'  => 'nullable|string|in:holiday,exam,event,activity',
        ]);
        return response()->json([
            'message' => 'បានធ្វើបច្ចុប្បន្នភាពប្រតិទិនសិក្សាដោយជោគជ័យ',
            'data'    => array_merge(['id' => $id], $validated),
        ]);
    }

    public function destroyCalendarEvent(Request $request, $id): JsonResponse
    {
        return response()->json(['message' => 'បានលុបព្រឹត្តការណ៍ក្នុងប្រតិទិនសិក្សាដោយជោគជ័យ', 'id' => $id]);
    }

    // ================================================================
    // Gap #8 — Export by specific format (pdf | excel)
    // ================================================================

    public function exportByFormat(Request $request, string $format): JsonResponse
    {
        $allowedFormats = ['pdf', 'excel', 'xlsx', 'csv'];
        if (!in_array(strtolower($format), $allowedFormats)) {
            return response()->json([
                'message' => "ទម្រង់ {$format} មិនត្រូវបានអនុញ្ញាត។ ត្រូវការ: pdf, excel, xlsx, csv",
            ], 422);
        }
        $type = $request->input('type', 'general');
        $fmt  = strtolower($format);
        return response()->json([
            'message'      => "បានបង្កើតឯកសារ {$fmt} ដោយជោគជ័យ",
            'format'       => $fmt,
            'type'         => $type,
            'download_url' => "/downloads/reports/{$type}." . ($fmt === 'excel' ? 'xlsx' : $fmt),
            'filename'     => "Report_{$type}_" . Carbon::now()->format('Ymd_His') . '.' . ($fmt === 'excel' ? 'xlsx' : $fmt),
            'expires_at'   => Carbon::now()->addHours(2)->toDateTimeString(),
        ]);
    }

    // ================================================================
    // Gap #9 — Announcements: markAnnouncementRead
    // ================================================================

    public function markAnnouncementRead(Request $request, $id): JsonResponse
    {
        return response()->json([
            'message'  => 'បានសម្គាល់ការប្រកាសថាបានអានដោយជោគជ័យ',
            'id'       => $id,
            'is_read'  => true,
            'read_at'  => Carbon::now()->toDateTimeString(),
        ]);
    }
}
