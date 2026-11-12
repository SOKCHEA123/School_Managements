<?php

namespace App\Services;

use App\Models\Grade;
use Illuminate\Support\Facades\DB;
use Symfony\Component\HttpKernel\Exception\HttpException;

class GradeService
{
    public function saveBatchGrades(array $data): int
    {
        return DB::transaction(function () use ($data) {
            $savedCount = 0;

            foreach ($data['grades'] as $item) {
                // ពិនិត្យមើលថាតើទិន្នន័យត្រូវបានចាក់សោ (Locked) រួចរាល់ហើយឬនៅ
                $existing = Grade::where([
                    'student_id'       => $item['student_id'],
                    'subject_id'       => $data['subject_id'],
                    'academic_year_id' => $data['academic_year_id'],
                    'month'            => $data['month'],
                ])->first();

                if ($existing && $existing->is_locked) {
                    throw new HttpException(422, "ពិន្ទុសម្រាប់សិស្ស ID {$item['student_id']} ត្រូវបានចាក់សោរួចហើយ មិនអាចកែប្រែបានទេ។");
                }

                Grade::updateOrCreate(
                    [
                        'student_id'       => $item['student_id'],
                        'subject_id'       => $data['subject_id'],
                        'classroom_id'     => $data['classroom_id'],
                        'academic_year_id' => $data['academic_year_id'],
                        'month'            => $data['month'],
                    ],
                    [
                        'semester' => $data['semester'],
                        'score'    => $item['score'],
                    ]
                );

                $savedCount++;
            }

            return $savedCount;
        });
    }
}