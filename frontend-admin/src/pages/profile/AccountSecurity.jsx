import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  UserCheck,
  Clock,
  KeyRound,
  CheckCircle2,
  Smartphone,
  Lock,
  Globe
} from 'lucide-react';
import ProfileHeader from './ProfileHeader';
import { settingsService } from '../../services';

const AccountSecurity = () => {
  const [profile, setProfile] = useState({
    name: 'Admin',
    email: 'admin@example.com',
    role: 'Administrator',
    last_login: '2026-11-17 08:30:00',
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const stored = localStorage.getItem('user');
        if (stored) {
          const u = JSON.parse(stored);
          setProfile((prev) => ({ ...prev, ...u }));
        }
        const apiData = await settingsService.getProfile();
        if (apiData) {
          setProfile((prev) => ({ ...prev, ...apiData }));
        }
      } catch {
        // ignore
      }
    };
    fetchUser();
  }, []);

  return (
    <div className="space-y-6 font-khmer transition-colors duration-200 min-h-full pb-10">
      <ProfileHeader profile={profile} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Security Overview */}
          <div className="bg-white dark:bg-[#1a1e4a] rounded-2xl border border-slate-200 dark:border-[#2a3163] p-6 shadow-sm space-y-5 animate-in fade-in">
            <div className="border-b border-slate-200 dark:border-[#2a3163] pb-4 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-500" />
                  សុវត្ថិភាពគណនី និងការការពារ
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  គ្រប់គ្រងសុវត្ថិភាពនៃគណនីរបស់អ្នក និងកំណត់ត្រាចូលប្រើប្រាស់
                </p>
              </div>
              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                កម្រិតសុវត្ថិភាព៖ ល្អ
              </span>
            </div>

            <div className="space-y-4">
              {/* Item 1 */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 flex items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-500 shrink-0">
                    <UserCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-slate-800 dark:text-slate-100">
                      Laravel Sanctum Authentication
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      Bearer Token សុវត្ថិភាពត្រូវបានប្រើប្រាស់សម្រាប់រាល់ការហៅ API
                    </div>
                  </div>
                </div>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 shrink-0">
                  បានការពារ
                </span>
              </div>

              {/* Item 2 */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 flex items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-500 shrink-0">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-slate-800 dark:text-slate-100">
                      ការចូលប្រើប្រាស់ចុងក្រោយ (Last Session)
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      {profile.last_login || 'ពេលថ្មីៗនេះ'} • IP: 127.0.0.1
                    </div>
                  </div>
                </div>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-blue-500/10 text-blue-500 border border-blue-500/20 shrink-0">
                  សកម្ម
                </span>
              </div>

              {/* Item 3 */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 flex items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-violet-500/10 text-violet-500 shrink-0">
                    <Smartphone className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-slate-800 dark:text-slate-100">
                      ការផ្ទៀងផ្ទាត់ ២ ជំហាន (2FA Authentication)
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      បង្កើនសុវត្ថិភាពទ្វេដងជាមួយ Google Authenticator ឬ OTP
                    </div>
                  </div>
                </div>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 shrink-0">
                  មិនទាន់បើក
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Security Tips */}
        <div>
          <div className="bg-white dark:bg-[#1a1e4a] rounded-2xl border border-slate-200 dark:border-[#2a3163] p-5 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Lock className="w-4 h-4 text-emerald-500" />
              គន្លឹះសុវត្ថិភាព
            </h3>

            <div className="space-y-3 text-xs text-slate-600 dark:text-slate-300">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>ផ្លាស់ប្តូរពាក្យសម្ងាត់ជាប្រចាំរៀងរាល់ ៩០ ថ្ងៃម្តង</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>ចាកចេញពីគណនី (Logout) រាល់ពេលប្រើប្រាស់លើឧបករណ៍សាធារណៈ</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>កុំចែករំលែក Password ឬ Token ទៅកាន់អ្នកដទៃជាដាច់ខាត</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountSecurity;
