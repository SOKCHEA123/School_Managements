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
        // Implicitly grant 'admin' or 'principal' or any staff user role full access
        Gate::before(function ($user, $ability) {
            if ($user && ($user->user_type === 'admin' || $user->hasRole('admin') || $user->hasRole('principal') || empty($user->user_type))) {
                return true;
            }
            return null;
        });
    }
}
