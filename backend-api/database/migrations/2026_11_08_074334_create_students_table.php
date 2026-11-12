<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('students', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->string('student_code')->unique();
            $table->string('full_name_km');
            $table->string('full_name_en')->nullable();
            $table->enum('gender', ['male', 'female']);
            $table->date('dob');
            $table->foreignId('classroom_id')->nullable()->constrained('classrooms')->nullOnDelete();
            $table->enum('stream', ['none', 'science', 'social_science'])->default('none');
            $table->string('parent_phone')->nullable();
            $table->enum('status', ['active', 'suspended', 'graduated', 'dropped'])->default('active');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('students');
    }
};