<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreGradeRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // ការពារតាម Policy ក្នុង Controller
    }

    public function rules(): array
    {
        return [
            'classroom_id'      => 'required|exists:classrooms,id',
            'subject_id'        => 'required|exists:subjects,id',
            'academic_year_id'  => 'required|exists:academic_years,id',
            'month'             => 'required|integer|between:1,12',
            'semester'          => 'required|in:semester_1,semester_2',
            'grades'            => 'required|array|min:1',
            'grades.*.student_id' => 'required|exists:students,id',
            'grades.*.score'      => 'required|numeric|between:0,100',
        ];
    }
}