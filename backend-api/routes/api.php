<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\StudentPortalController;
use App\Http\Controllers\Api\Admin\GradeController;
use App\Http\Controllers\Api\Admin\StudentController;
use App\Http\Controllers\Api\Admin\ClassroomController;
use App\Http\Controllers\Api\Admin\TeacherController;
use App\Http\Controllers\Api\Admin\AttendanceController;
use App\Http\Controllers\Api\Admin\ComprehensiveDashboardController;
use App\Http\Controllers\Api\Admin\TimetableExamController;
use App\Http\Controllers\Api\Admin\OperationsController;
use App\Http\Controllers\Api\Admin\SystemSecurityController;

// ============================================================
// Auth Routes (Public)
// ============================================================
Route::post('/v1/auth/register', [AuthController::class, 'register']);
Route::post('/v1/auth/login',    [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/v1/auth/logout', [AuthController::class, 'logout']);
    Route::get('/v1/auth/me',      [AuthController::class, 'me']);

    // ============================================================
    // 1. FRONTEND-USER (Student Portal)
    // ============================================================
    Route::group(['prefix' => 'v1/portal', 'middleware' => ['role:student']], function () {
        Route::get('/my-profile',    [StudentPortalController::class, 'getProfile']);
        Route::get('/my-grades',     [StudentPortalController::class, 'getGrades']);
        Route::get('/my-attendance', [StudentPortalController::class, 'getAttendance']);
    });

    // ============================================================
    // 2. ADMIN & STAFF PORTAL — Full 12 Modules
    // ============================================================
    Route::group(['prefix' => 'v1/admin'], function () {

        // ================================================================
        // 1. DASHBOARD
        // Dashboard Overview | Student Statistics | Teacher Statistics
        // Attendance Statistics | Recent Activities
        // ================================================================
        Route::get('/dashboard/overview',              [ComprehensiveDashboardController::class, 'overview']);
        Route::get('/dashboard/student-statistics',    [ComprehensiveDashboardController::class, 'studentStatistics']);
        Route::get('/dashboard/teacher-statistics',    [ComprehensiveDashboardController::class, 'teacherStatistics']);
        Route::get('/dashboard/attendance-statistics', [ComprehensiveDashboardController::class, 'attendanceStatistics']);
        Route::get('/dashboard/recent-activities',     [ComprehensiveDashboardController::class, 'recentActivities']);
        // NOTE: /dashboard-stats removed (ស្ទួននឹង /dashboard/overview) [Gap #10]

        // ================================================================
        // 2. ACADEMIC MANAGEMENT
        // Students | Teachers | Parents | Classrooms | Grades
        // Subjects | Academic Years | Class Sections
        // ================================================================

        // --- Students (full CRUD) ---
        Route::get('/students',           [StudentController::class, 'index'])->middleware('permission:manage_students');
        Route::post('/students',          [StudentController::class, 'store'])->middleware('permission:manage_students');
        Route::get('/students/{id}',      [StudentController::class, 'show'])->middleware('permission:manage_students');
        Route::put('/students/{id}',      [StudentController::class, 'update'])->middleware('permission:manage_students');
        Route::patch('/students/{id}',    [StudentController::class, 'update'])->middleware('permission:manage_students');
        Route::delete('/students/{id}',   [StudentController::class, 'destroy'])->middleware('permission:manage_students');

        // --- Teachers (full CRUD) ---
        Route::get('/teachers',           [TeacherController::class, 'index']);
        Route::post('/teachers',          [TeacherController::class, 'store']);
        Route::get('/teachers/{id}',      [TeacherController::class, 'show']);
        Route::put('/teachers/{id}',      [TeacherController::class, 'update']);
        Route::patch('/teachers/{id}',    [TeacherController::class, 'update']);
        Route::delete('/teachers/{id}',   [TeacherController::class, 'destroy']);
        Route::post('/teachers/{id}/assign-homeroom', [TeacherController::class, 'assignHomeroom']);

        // --- Parents (full CRUD) ---
        Route::get('/parents',            [OperationsController::class, 'parents']);
        Route::post('/parents',           [OperationsController::class, 'storeParent']);
        Route::get('/parents/{id}',       [OperationsController::class, 'showParent']);
        Route::put('/parents/{id}',       [OperationsController::class, 'updateParent']);
        Route::delete('/parents/{id}',    [OperationsController::class, 'destroyParent']);

        // --- Classrooms (full CRUD) ---
        Route::get('/classrooms',         [ClassroomController::class, 'index']);
        Route::post('/classrooms',        [ClassroomController::class, 'store']);
        Route::get('/classrooms/{id}',    [ClassroomController::class, 'show']);
        Route::put('/classrooms/{id}',    [ClassroomController::class, 'update']);
        Route::delete('/classrooms/{id}', [ClassroomController::class, 'destroy']);

        // --- Grades / Level (grade 10,11,12) ---
        Route::get('/grade-levels',       [ClassroomController::class, 'gradeLevels']);

        // --- Subjects (full CRUD) ---
        Route::get('/subjects',           [ClassroomController::class, 'subjects']);
        Route::post('/subjects',          [ClassroomController::class, 'storeSubject']);
        Route::get('/subjects/{id}',      [ClassroomController::class, 'showSubject']);
        Route::put('/subjects/{id}',      [ClassroomController::class, 'updateSubject']);
        Route::delete('/subjects/{id}',   [ClassroomController::class, 'destroySubject']);

        // --- Academic Years (full CRUD) ---
        Route::get('/academic-years',     [ClassroomController::class, 'academicYears']);
        Route::post('/academic-years',    [ClassroomController::class, 'storeAcademicYear']);
        Route::get('/academic-years/{id}',[ClassroomController::class, 'showAcademicYear']);
        Route::put('/academic-years/{id}',[ClassroomController::class, 'updateAcademicYear']);
        Route::delete('/academic-years/{id}',[ClassroomController::class, 'destroyAcademicYear']);

        // --- Class Sections / Shifts (Full CRUD) ---  [Gap #1]
        Route::get('/sections',           [ClassroomController::class, 'sections']);
        Route::post('/sections',          [ClassroomController::class, 'storeSection']);
        Route::put('/sections/{id}',      [ClassroomController::class, 'updateSection']);
        Route::delete('/sections/{id}',   [ClassroomController::class, 'destroySection']);

        // ================================================================
        // 3. ATTENDANCE MANAGEMENT
        // Student Attendance | Teacher Attendance | Daily | Monthly
        // Absent / Late / Permission
        // ================================================================
        Route::get('/attendances',              [AttendanceController::class, 'index']);
        Route::post('/attendances/batch',       [AttendanceController::class, 'storeBatch']);
        Route::get('/attendances/summary',      [AttendanceController::class, 'summary']);
        Route::get('/attendances/teachers',     [AttendanceController::class, 'teachersAttendance']);
        Route::post('/attendances/teachers',    [AttendanceController::class, 'storeTeacherAttendance']);
        Route::put('/attendances/teachers/{id}',[AttendanceController::class, 'updateTeacherAttendance']);
        Route::get('/attendances/daily',        [AttendanceController::class, 'daily']);
        Route::get('/attendances/monthly',      [AttendanceController::class, 'monthly']);
        Route::get('/attendances/absent-late',  [AttendanceController::class, 'absentLateList']);
        // Attendance Permissions (Absent/Late/Permission) CRUD  [Gap #2]
        Route::get('/attendances/permissions',       [AttendanceController::class, 'permissionList']);
        Route::post('/attendances/permissions',      [AttendanceController::class, 'storePermission']);
        Route::put('/attendances/permissions/{id}',  [AttendanceController::class, 'updatePermission']);
        Route::delete('/attendances/permissions/{id}',[AttendanceController::class, 'destroyPermission']);
        Route::get('/attendances/{id}',         [AttendanceController::class, 'show']);
        Route::put('/attendances/{id}',         [AttendanceController::class, 'update']);
        Route::delete('/attendances/{id}',      [AttendanceController::class, 'destroy']);

        // ================================================================
        // 4. EXAMINATION & RESULTS
        // Exam Management | Exam Schedule | Enter Student Scores
        // Grade Calculation | Student Ranking | Report Cards
        // ================================================================
        Route::get('/exams',                    [TimetableExamController::class, 'getExams']);
        Route::post('/exams',                   [TimetableExamController::class, 'storeExam']);
        Route::get('/exams/{id}',               [TimetableExamController::class, 'showExam']);
        Route::put('/exams/{id}',               [TimetableExamController::class, 'updateExam']);
        Route::delete('/exams/{id}',            [TimetableExamController::class, 'destroyExam']);
        Route::get('/exams/schedule',           [TimetableExamController::class, 'examSchedule']);
        Route::post('/exams/schedule',          [TimetableExamController::class, 'storeExamSchedule']);

        // Enter Student Scores (Grades)
        Route::get('/grades',                   [GradeController::class, 'index']);
        Route::post('/grades/batch',            [GradeController::class, 'storeBatch'])->middleware('permission:input_class_grades');
        Route::post('/grades/lock',             [GradeController::class, 'lockGrades'])->middleware('permission:lock_grades');
        Route::get('/grades/{id}',              [GradeController::class, 'show']);
        Route::put('/grades/{id}',              [GradeController::class, 'update'])->middleware('permission:input_class_grades');
        Route::delete('/grades/{id}',           [GradeController::class, 'destroy'])->middleware('permission:lock_grades');
        Route::get('/grades/rankings',          [GradeController::class, 'rankings']);

        Route::post('/exams/calculation',       [TimetableExamController::class, 'gradeCalculation']);
        Route::get('/exams/rankings',           [TimetableExamController::class, 'studentRanking']);
        Route::get('/exams/report-cards',       [TimetableExamController::class, 'reportCards']);
        Route::get('/exams/report-cards/{id}',  [TimetableExamController::class, 'reportCardByStudent']);

        // ================================================================
        // 5. TIMETABLE MANAGEMENT
        // Class Timetable | Teacher Timetable | Room Schedule | Exam Timetable
        // ================================================================
        Route::get('/timetables',               [TimetableExamController::class, 'getTimetable']);
        Route::post('/timetables',              [TimetableExamController::class, 'storeTimetable']);
        Route::put('/timetables/{id}',          [TimetableExamController::class, 'updateTimetable']);
        Route::delete('/timetables/{id}',       [TimetableExamController::class, 'destroyTimetable']);
        Route::get('/timetable/class',          [TimetableExamController::class, 'getTimetable']);
        Route::get('/timetable/teacher',        [TimetableExamController::class, 'teacherTimetable']);
        Route::get('/timetable/rooms',          [TimetableExamController::class, 'roomSchedule']);
        Route::get('/timetable/exams',          [TimetableExamController::class, 'examTimetable']);

        // ================================================================
        // 6. STUDENT SERVICES
        // Student Promotion | Transfer | Discipline | Certificates | Documents
        // ================================================================
        Route::get('/student-services',                     [OperationsController::class, 'studentServices']);
        Route::post('/student-services/promotion',          [OperationsController::class, 'promoteStudents']);
        Route::post('/student-services/transfer',           [OperationsController::class, 'storeTransfer']);
        Route::get('/student-services/transfers',           [OperationsController::class, 'transfers']);
        Route::put('/student-services/transfers/{id}',      [OperationsController::class, 'updateTransfer']);
        Route::delete('/student-services/transfers/{id}',   [OperationsController::class, 'destroyTransfer']);
        Route::get('/student-services/disciplines',         [OperationsController::class, 'disciplines']);
        Route::post('/student-services/discipline',         [OperationsController::class, 'storeDiscipline']);
        Route::put('/student-services/discipline/{id}',     [OperationsController::class, 'updateDiscipline']);
        Route::delete('/student-services/discipline/{id}',  [OperationsController::class, 'destroyDiscipline']);
        Route::get('/student-services/certificates',        [OperationsController::class, 'certificates']);
        Route::post('/student-services/certificates',       [OperationsController::class, 'storeCertificate']);
        Route::put('/student-services/certificates/{id}',   [OperationsController::class, 'updateCertificate']);
        Route::delete('/student-services/certificates/{id}',[OperationsController::class, 'destroyCertificate']); // [Gap #3]
        Route::get('/student-services/documents',           [OperationsController::class, 'documents']);
        Route::post('/student-services/documents',          [OperationsController::class, 'storeDocument']);
        Route::delete('/student-services/documents/{id}',   [OperationsController::class, 'destroyDocument']);

        // ================================================================
        // 7. FINANCE MANAGEMENT
        // Student Fees | Payment Records | Expenses | Income | Financial Reports
        // ================================================================
        Route::get('/finance',                  [OperationsController::class, 'finance']);
        Route::get('/finance/fees',             [OperationsController::class, 'fees']);
        Route::post('/finance/fees',            [OperationsController::class, 'storeFee']);
        Route::put('/finance/fees/{id}',        [OperationsController::class, 'updateFee']);
        Route::delete('/finance/fees/{id}',     [OperationsController::class, 'destroyFee']);
        Route::get('/finance/payments',         [OperationsController::class, 'payments']);
        Route::post('/finance/payments',        [OperationsController::class, 'storePayment']);
        Route::put('/finance/payments/{id}',    [OperationsController::class, 'updatePayment']);    // [Gap #4]
        Route::delete('/finance/payments/{id}', [OperationsController::class, 'destroyPayment']);   // [Gap #4]
        Route::get('/finance/expenses',         [OperationsController::class, 'expenses']);
        Route::post('/finance/expenses',        [OperationsController::class, 'storeExpense']);
        Route::put('/finance/expenses/{id}',    [OperationsController::class, 'updateExpense']);
        Route::delete('/finance/expenses/{id}', [OperationsController::class, 'destroyExpense']);
        Route::get('/finance/income',           [OperationsController::class, 'income']);
        Route::post('/finance/income',          [OperationsController::class, 'storeIncome']);
        Route::put('/finance/income/{id}',      [OperationsController::class, 'updateIncome']);    // [Gap #5]
        Route::delete('/finance/income/{id}',   [OperationsController::class, 'destroyIncome']);   // [Gap #5]
        Route::get('/finance/reports',          [OperationsController::class, 'financeReports']);
        Route::post('/finance/transactions',    [OperationsController::class, 'storeTransaction']);

        // ================================================================
        // 8. LIBRARY MANAGEMENT
        // Books Management | Borrow Books | Return Books | Overdue Books
        // ================================================================
        Route::get('/library',                  [OperationsController::class, 'library']);
        Route::get('/library/books',            [OperationsController::class, 'books']);
        Route::post('/library/books',           [OperationsController::class, 'storeBook']);
        Route::get('/library/books/{id}',       [OperationsController::class, 'showBook']);
        Route::put('/library/books/{id}',       [OperationsController::class, 'updateBook']);
        Route::delete('/library/books/{id}',    [OperationsController::class, 'destroyBook']);
        Route::get('/library/borrows',          [OperationsController::class, 'borrows']);
        Route::post('/library/borrow',          [OperationsController::class, 'borrowBook']);
        Route::post('/library/return',          [OperationsController::class, 'returnBook']);
        Route::get('/library/overdue',          [OperationsController::class, 'overdueBooks']);

        // ================================================================
        // 9. COMMUNICATION
        // Announcements | Notifications | School Events | Calendar
        // ================================================================
        Route::get('/communication',                            [OperationsController::class, 'communication']);
        Route::get('/communication/announcements',              [OperationsController::class, 'announcements']);
        Route::post('/communication/announcements',             [OperationsController::class, 'storeAnnouncement']);
        Route::get('/communication/announcements/{id}',         [OperationsController::class, 'showAnnouncement']);
        Route::put('/communication/announcements/{id}',         [OperationsController::class, 'updateAnnouncement']);
        Route::delete('/communication/announcements/{id}',      [OperationsController::class, 'destroyAnnouncement']);
        Route::get('/communication/notifications',              [OperationsController::class, 'notifications']);
        Route::post('/communication/notifications',             [OperationsController::class, 'storeNotification']);
        Route::put('/communication/notifications/{id}/read',    [OperationsController::class, 'markNotificationRead']);
        Route::get('/communication/events',                     [OperationsController::class, 'schoolEvents']);
        Route::post('/communication/events',                    [OperationsController::class, 'storeEvent']);
        Route::put('/communication/events/{id}',                [OperationsController::class, 'updateEvent']);
        Route::delete('/communication/events/{id}',             [OperationsController::class, 'destroyEvent']);
        Route::get('/communication/calendar',                   [OperationsController::class, 'academicCalendar']);
        Route::post('/communication/calendar',                  [OperationsController::class, 'storeCalendarEvent']);
        Route::put('/communication/calendar/{id}',              [OperationsController::class, 'updateCalendarEvent']);   // [Gap #6]
        Route::delete('/communication/calendar/{id}',           [OperationsController::class, 'destroyCalendarEvent']); // [Gap #6]
        // Announcements mark-read  [Gap #9]
        Route::put('/communication/announcements/{id}/read',    [OperationsController::class, 'markAnnouncementRead']);

        // ================================================================
        // 10. REPORTS & ANALYTICS
        // Student | Teacher | Attendance | Exam | Financial Reports
        // Export PDF / Excel
        // ================================================================
        Route::get('/reports',                  [OperationsController::class, 'reports']);
        Route::get('/reports/students',         [OperationsController::class, 'studentReports']);
        Route::get('/reports/teachers',         [OperationsController::class, 'teacherReports']);
        Route::get('/reports/attendance',       [OperationsController::class, 'attendanceReports']);
        Route::get('/reports/exams',            [OperationsController::class, 'examReports']);
        Route::get('/reports/finance',          [OperationsController::class, 'finance']);
        // Export with specific format  [Gap #8]
        Route::get('/reports/export',           [OperationsController::class, 'exportReport']);
        Route::post('/reports/export',          [OperationsController::class, 'exportReport']);
        Route::get('/reports/export/{format}',  [OperationsController::class, 'exportByFormat']); // pdf | excel

        // ================================================================
        // 11. USER & SECURITY
        // User Management | Roles | Permissions | Login History | Activity Logs
        // ================================================================
        Route::get('/users',                    [SystemSecurityController::class, 'users']);
        Route::post('/users',                   [SystemSecurityController::class, 'storeUser']);
        Route::get('/users/{id}',               [SystemSecurityController::class, 'showUser']);
        Route::put('/users/{id}',               [SystemSecurityController::class, 'updateUser']);
        Route::patch('/users/{id}',             [SystemSecurityController::class, 'updateUser']);
        Route::delete('/users/{id}',            [SystemSecurityController::class, 'destroyUser']);
        Route::patch('/users/{id}/toggle',      [SystemSecurityController::class, 'toggleUserStatus']);
        Route::get('/users-security',           [SystemSecurityController::class, 'users']);
        Route::post('/users-security/users',    [SystemSecurityController::class, 'storeUser']);
        Route::get('/roles',                    [SystemSecurityController::class, 'roles']);
        Route::post('/roles',                   [SystemSecurityController::class, 'storeRole']);
        Route::put('/roles/{id}',               [SystemSecurityController::class, 'updateRole']);
        Route::delete('/roles/{id}',            [SystemSecurityController::class, 'destroyRole']);
        Route::get('/permissions',              [SystemSecurityController::class, 'permissions']);
        Route::post('/permissions',             [SystemSecurityController::class, 'storePermission']);
        Route::put('/permissions/{id}',         [SystemSecurityController::class, 'updatePermission']);  // [Gap #7]
        Route::delete('/permissions/{id}',      [SystemSecurityController::class, 'destroyPermission']); // [Gap #7]
        Route::get('/security/login-history',   [SystemSecurityController::class, 'loginHistory']);
        Route::delete('/security/login-history',[SystemSecurityController::class, 'clearLoginHistory']);
        Route::get('/security/activity-logs',   [SystemSecurityController::class, 'activityLogs']);

        // ================================================================
        // 12. SYSTEM SETTINGS
        // School Information | Logo & Branding | Khmer/English
        // Academic Settings | Database Backup | Profile Settings
        // ================================================================
        Route::get('/settings',                 [SystemSecurityController::class, 'settings']);
        Route::post('/settings',                [SystemSecurityController::class, 'updateSettings']);
        Route::get('/settings/school-info',     [SystemSecurityController::class, 'schoolInfo']);
        Route::put('/settings/school-info',     [SystemSecurityController::class, 'updateSchoolInfo']);
        Route::get('/settings/branding',        [SystemSecurityController::class, 'branding']);
        Route::put('/settings/branding',        [SystemSecurityController::class, 'updateBranding']);
        Route::get('/settings/language',        [SystemSecurityController::class, 'language']);
        Route::put('/settings/language',        [SystemSecurityController::class, 'updateLanguage']);
        Route::get('/settings/academic',        [SystemSecurityController::class, 'academicSettings']);
        Route::put('/settings/academic',        [SystemSecurityController::class, 'updateAcademicSettings']);
        Route::post('/settings/backup',         [SystemSecurityController::class, 'triggerBackup']);
        Route::get('/settings/backup/history',  [SystemSecurityController::class, 'backupHistory']);
        Route::get('/settings/profile',         [SystemSecurityController::class, 'profileSettings']);
        Route::put('/settings/profile',         [SystemSecurityController::class, 'updateProfile']);
        Route::put('/settings/password',        [SystemSecurityController::class, 'changePassword']);
        Route::get('/school-profile',           [ClassroomController::class, 'schoolProfile']);
    });
});
