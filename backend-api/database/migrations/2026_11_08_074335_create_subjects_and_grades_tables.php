<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('subjects', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('code')->unique();
            $table->unsignedTinyInteger('grade_level');
            $table->unsignedTinyInteger('coefficient')->default(1);
            $table->timestamps();
        });

        Schema::create('grades', function (Blueprint $table) {
            $table->id();
            $table->foreignId('student_id')->constrained('students')->cascadeOnDelete();
            $table->foreignId('subject_id')->constrained('subjects')->cascadeOnDelete();
            $table->foreignId('classroom_id')->constrained('classrooms')->cascadeOnDelete();
            $table->foreignId('academic_year_id')->constrained('academic_years')->cascadeOnDelete();
            $table->unsignedTinyInteger('month'); // 1 to 12
            $table->enum('semester', ['semester_1', 'semester_2']);
            $table->decimal('score', 5, 2);
            $table->boolean('is_locked')->default(false);
            $table->timestamps();

            $table->unique(['student_id', 'subject_id', 'month', 'academic_year_id'], 'unique_student_subject_month_grade');
        });

        Schema::create('attendances', function (Blueprint $table) {
            $table->id();
            $table->foreignId('student_id')->constrained('students')->cascadeOnDelete();
            $table->foreignId('classroom_id')->constrained('classrooms')->cascadeOnDelete();
            $table->foreignId('recorded_by_teacher_id')->constrained('teachers')->cascadeOnDelete();
            $table->date('date');
            $table->enum('session', ['morning', 'afternoon']);
            $table->enum('status', ['present', 'absent', 'permission', 'late']);
            $table->timestamps();

            $table->unique(['student_id', 'date', 'session'], 'unique_student_daily_attendance');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('attendances');
        Schema::dropIfExists('grades');
        Schema::dropIfExists('subjects');
    }
};