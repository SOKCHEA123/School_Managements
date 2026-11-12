<?php

namespace App\Policies;

use App\Models\User;
use App\Models\Classroom;
use App\Models\Grade;

class GradePolicy
{
    public function input(User $user, Classroom $classroom): bool
    {
        // Admin / Principal / Academic Staff អាចបញ្ចូលបានគ្រប់ថ្នាក់
        if ($user->hasAnyRole(['admin', 'principal', 'vice_principal', 'academic_staff']) || in_array($user->user_type, ['admin', 'principal', 'vice_principal', 'academic_staff'])) {
            return true;
        }

        // Homeroom Teacher បញ្ចូលបានតែថ្នាក់ដែលខ្លួនទទួលបន្ទុក
        if ($user->hasRole('homeroom_teacher') || $user->hasRole('teacher')) {
            $teacher = $user->teacher;
            return $teacher && $classroom->homeroom_teacher_id === $teacher->id;
        }

        return false;
    }

    public function lock(User $user): bool
    {
        // Admin / Principal អាចបិទ/ចាក់សោពិន្ទុ
        return $user->hasAnyRole(['admin', 'principal']) || in_array($user->user_type, ['admin', 'principal']);
    }
}