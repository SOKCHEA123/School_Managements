<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Teacher extends Model
{
    protected $fillable = [
        'user_id',
        'teacher_code',
        'full_name_km',
        'full_name_en',
        'gender',
        'phone',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function homeroomClassroom(): HasOne
    {
        return $this->hasOne(Classroom::class, 'homeroom_teacher_id');
    }
}