<?php

namespace App\Providers;

use Illuminate\Support\Facades\Gate;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        try {
            if (\Illuminate\Support\Facades\Schema::hasTable('users')) {
                \Illuminate\Support\Facades\DB::statement("ALTER TABLE users ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE");
                \Illuminate\Support\Facades\DB::statement("ALTER TABLE users ADD COLUMN IF NOT EXISTS user_type VARCHAR(50) DEFAULT 'admin'");
                \Illuminate\Support\Facades\DB::statement("ALTER TABLE users ADD COLUMN IF NOT EXISTS student_id VARCHAR(255) NULL");
                \Illuminate\Support\Facades\DB::statement("ALTER TABLE users ADD COLUMN IF NOT EXISTS username VARCHAR(255) NULL");
            }
            if (\Illuminate\Support\Facades\Schema::hasTable('academic_years')) {
                \Illuminate\Support\Facades\DB::statement("ALTER TABLE academic_years ADD COLUMN IF NOT EXISTS name VARCHAR(255) NULL DEFAULT '2025-2026'");
                \Illuminate\Support\Facades\DB::statement("ALTER TABLE academic_years ADD COLUMN IF NOT EXISTS start_date DATE NULL");
                \Illuminate\Support\Facades\DB::statement("ALTER TABLE academic_years ADD COLUMN IF NOT EXISTS end_date DATE NULL");
                \Illuminate\Support\Facades\DB::statement("ALTER TABLE academic_years ADD COLUMN IF NOT EXISTS is_current BOOLEAN DEFAULT FALSE");
            }
            if (\Illuminate\Support\Facades\Schema::hasTable('classrooms')) {
                \Illuminate\Support\Facades\DB::statement("ALTER TABLE classrooms ADD COLUMN IF NOT EXISTS academic_year_id BIGINT NULL");
                \Illuminate\Support\Facades\DB::statement("ALTER TABLE classrooms ADD COLUMN IF NOT EXISTS room_number VARCHAR(50) NULL DEFAULT '101'");
            }
        } catch (\Throwable $e) {}

        // Implicitly grant 'admin' or 'principal' or any staff user role full access
        Gate::before(function ($user, $ability) {
            if ($user && ($user->user_type === 'admin' || $user->hasRole('admin') || $user->hasRole('principal') || empty($user->user_type))) {
                return true;
            }
            return null;
        });
    }
}
