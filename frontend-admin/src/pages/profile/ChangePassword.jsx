import React, { useState, useEffect } from 'react';
import {
  KeyRound,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  RefreshCw,
  Lock,
  Check,
  X
} from 'lucide-react';
import ProfileHeader from './ProfileHeader';
import { settingsService } from '../../services';

const ChangePassword = () => {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  const [profile, setProfile] = useState({
    name: 'Admin',
    email: 'admin@example.com',
    role: 'Administrator',
  });

  const [passwords, setPasswords] = useState({
    current_password: '',
    new_password: '',
    new_password_confirmation: '',
  });

  const showAlert = (text, type = 'success') => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: '', type: '' }), 4000);
  };

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

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (passwords.new_password !== passwords.new_password_confirmation) {
      showAlert('ពាក្យសម្ងាត់ផ្ទៀងផ្ទាត់មិនត្រូវគ្នាទេ!', 'error');
      return;
    }
    if (passwords.new_password.length < 6) {
      showAlert('ពាក្យសម្ងាត់ថ្មីត្រូវមានយ៉ាងហោចណាស់ ៦ តួអក្សរ!', 'error');
      return;
    }

    setSaving(true);
    try {
      await settingsService.changePassword(passwords);
      showAlert('បានផ្លាស់ប្តូរពាក្យសម្ងាត់ដោយជោគជ័យ!', 'success');
      setPasswords({
        current_password: '',
        new_password: '',
        new_password_confirmation: '',
      });
    } catch (err) {
      const errMsg = err?.response?.data?.message || 'បរាជ័យក្នុងការផ្លាស់ប្តូរពាក្យសម្ងាត់!';
      showAlert(errMsg, 'error');
    } finally {
      setSaving(false);
    }
  };

  const isMinLength = passwords.new_password.length >= 6;
  const isMatched =
    passwords.new_password &&
    passwords.new_password === passwords.new_password_confirmation;

  const inputClass =
    'w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all';
  const labelClass = 'block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5';

  return (
    <div className="space-y-6 font-khmer transition-colors duration-200 min-h-full pb-10">
      <ProfileHeader profile={profile} />

      {/* Alert Notification */}
      {message.text && (
        <div
          className={`p-4 rounded-2xl text-sm flex items-center gap-3 animate-in fade-in border ${
            message.type === 'success'
              ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20'
              : 'bg-rose-50 dark:bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-500/20'
          }`}
        >
          {message.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 shrink-0" />
          )}
          <span className="font-semibold">{message.text}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Password Form */}
        <div className="lg:col-span-2">
          <form
            onSubmit={handleChangePassword}
            className="bg-white dark:bg-[#1a1e4a] rounded-2xl border border-slate-200 dark:border-[#2a3163] shadow-sm overflow-hidden animate-in fade-in"
          >
            <div className="p-5 border-b border-slate-200 dark:border-[#2a3163] bg-slate-50/50 dark:bg-slate-900/30 flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <KeyRound className="w-4 h-4 text-amber-500" />
                ផ្លាស់ប្តូរពាក្យសម្ងាត់គណនី
              </h3>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                សុវត្ថិភាពគណនី
              </span>
            </div>

            <div className="p-6 space-y-4">
              {/* Current Password */}
              <div>
                <label className={labelClass}>ពាក្យសម្ងាត់បច្ចុប្បន្ន (Current Password)</label>
                <div className="relative">
                  <input
                    type={showCurrentPass ? 'text' : 'password'}
                    required
                    value={passwords.current_password}
                    onChange={(e) =>
                      setPasswords({ ...passwords, current_password: e.target.value })
                    }
                    className={`${inputClass} pr-10`}
                    placeholder="បញ្ចូលពាក្យសម្ងាត់បច្ចុប្បន្នរបស់អ្នក"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPass(!showCurrentPass)}
                    className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  >
                    {showCurrentPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* New Password */}
              <div>
                <label className={labelClass}>ពាក្យសម្ងាត់ថ្មី (New Password)</label>
                <div className="relative">
                  <input
                    type={showNewPass ? 'text' : 'password'}
                    required
                    value={passwords.new_password}
                    onChange={(e) =>
                      setPasswords({ ...passwords, new_password: e.target.value })
                    }
                    className={`${inputClass} pr-10`}
                    placeholder="យ៉ាងហោចណាស់ ៦ តួអក្សរ"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPass(!showNewPass)}
                    className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  >
                    {showNewPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Confirm New Password */}
              <div>
                <label className={labelClass}>ផ្ទៀងផ្ទាត់ពាក្យសម្ងាត់ថ្មី (Confirm New Password)</label>
                <div className="relative">
                  <input
                    type={showConfirmPass ? 'text' : 'password'}
                    required
                    value={passwords.new_password_confirmation}
                    onChange={(e) =>
                      setPasswords({ ...passwords, new_password_confirmation: e.target.value })
                    }
                    className={`${inputClass} pr-10`}
                    placeholder="វាយពាក្យសម្ងាត់ថ្មីម្តងទៀតដើម្បីផ្ទៀងផ្ទាត់"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPass(!showConfirmPass)}
                    className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  >
                    {showConfirmPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>

            <div className="p-5 border-t border-slate-100 dark:border-[#2a3163] bg-slate-50/30 dark:bg-slate-900/10 flex items-center justify-between">
              <p className="text-xs text-slate-500 dark:text-slate-400">
                សូមកុំចែករំលែកពាក្យសម្ងាត់របស់អ្នកទៅកាន់អ្នកដទៃ
              </p>
              <button
                type="submit"
                disabled={saving}
                className="flex items-center gap-2 px-6 py-2.5 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-sm font-semibold shadow-md shadow-amber-600/20 transition-all active:scale-95 disabled:opacity-50"
              >
                {saving ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <ShieldCheck className="w-4 h-4" />
                )}
                <span>ប្តូរពាក្យសម្ងាត់</span>
              </button>
            </div>
          </form>
        </div>

        {/* Requirements & Tips Card */}
        <div>
          <div className="bg-white dark:bg-[#1a1e4a] rounded-2xl border border-slate-200 dark:border-[#2a3163] p-5 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Lock className="w-4 h-4 text-amber-500" />
              លក្ខខណ្ឌពាក្យសម្ងាត់
            </h3>

            <div className="space-y-2.5 text-xs">
              <div className="flex items-center gap-2">
                {isMinLength ? (
                  <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                ) : (
                  <X className="w-4 h-4 text-slate-400 shrink-0" />
                )}
                <span className={isMinLength ? 'text-emerald-600 dark:text-emerald-400 font-medium' : 'text-slate-500'}>
                  យ៉ាងហោចណាស់ ៦ តួអក្សរ
                </span>
              </div>

              <div className="flex items-center gap-2">
                {isMatched ? (
                  <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                ) : (
                  <X className="w-4 h-4 text-slate-400 shrink-0" />
                )}
                <span className={isMatched ? 'text-emerald-600 dark:text-emerald-400 font-medium' : 'text-slate-500'}>
                  ពាក្យសម្ងាត់ផ្ទៀងផ្ទាត់ត្រូវគ្នា
                </span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 text-xs text-amber-800 dark:text-amber-300 space-y-1">
              <p className="font-semibold">ការណែនាំពីសុវត្ថិភាព៖</p>
              <p className="text-[11px] leading-relaxed">
                ប្រើប្រាស់បន្សំនៃអក្សរធំ អក្សរតូច លេខ និងនិមិត្តសញ្ញាពិសេសដើម្បីបង្កើនកម្រិតសុវត្ថិភាព។
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;
