import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  User,
  Mail,
  Phone,
  Save,
  CheckCircle2,
  AlertCircle,
  Calendar,
  Clock,
  UserCheck,
  RefreshCw
} from 'lucide-react';
import ProfileHeader from './ProfileHeader';
import { settingsService } from '../../services';

const PersonalInfo = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  const [profile, setProfile] = useState({
    id: 1,
    name: 'Mao Sokchea',
    email: 'mrrsokchea0@gmail.com',
    phone: '012 345 678',
    role: 'Administrator',
    user_type: 'admin',
    avatar: '',
    joined_date: '2025-10-01',
    last_login: '2026-11-17 08:30:00',
    school_name: 'វិទ្យាល័យ ហ៊ុន សែន ស្នួល',
  });

  const showAlert = (text, type = 'success') => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: '', type: '' }), 4000);
  };

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        let localUser = null;
        try {
          const stored = localStorage.getItem('user');
          if (stored) localUser = JSON.parse(stored);
        } catch {
          // ignore
        }

        const apiData = await settingsService.getProfile();
        if (apiData) {
          setProfile((prev) => ({
            ...prev,
            ...apiData,
            name: apiData.name || localUser?.name || prev.name,
            email: apiData.email || localUser?.email || prev.email,
            role: apiData.role || localUser?.role || prev.role,
          }));
        } else if (localUser) {
          setProfile((prev) => ({
            ...prev,
            ...localUser,
          }));
        }
      } catch (err) {
        console.error('Failed to load profile:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await settingsService.updateProfile({
        name: profile.name,
        email: profile.email,
        phone: profile.phone,
      });

      try {
        const stored = localStorage.getItem('user');
        const currentUser = stored ? JSON.parse(stored) : {};
        const updatedUser = {
          ...currentUser,
          name: profile.name,
          email: profile.email,
          phone: profile.phone,
        };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        window.dispatchEvent(new Event('storage'));
      } catch {
        // ignore
      }

      showAlert('បានធ្វើបច្ចុប្បន្នភាពព័ត៌មានផ្ទាល់ខ្លួនដោយជោគជ័យ!', 'success');
    } catch (err) {
      const errMsg = err?.response?.data?.message || 'បរាជ័យក្នុងការធ្វើបច្ចុប្បន្នភាពព័ត៌មាន!';
      showAlert(errMsg, 'error');
    } finally {
      setSaving(false);
    }
  };

  const inputClass =
    'w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 transition-all';
  const labelClass = 'block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5';

  return (
    <div className="space-y-6 font-khmer transition-colors duration-200 min-h-full pb-10">
      {/* Reusable Profile Header */}
      <ProfileHeader
        profile={profile}
        onAvatarClick={() => showAlert('មុខងារ Upload រូបភាពនឹងរួចរាល់ឆាប់ៗនេះ!', 'info')}
      />

      {/* Alert Notification */}
      {message.text && (
        <div
          className={`p-4 rounded-2xl text-sm flex items-center gap-3 animate-in fade-in border ${
            message.type === 'success'
              ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20'
              : message.type === 'info'
              ? 'bg-cyan-50 dark:bg-cyan-500/10 text-cyan-700 dark:text-cyan-400 border-cyan-200 dark:border-cyan-500/20'
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

      {/* Main Content */}
      {loading ? (
        <div className="py-20 text-center flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-3 border-cyan-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-slate-500 dark:text-slate-400">កំពុងទាញយកព័ត៌មាន...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Form */}
          <div className="lg:col-span-2">
            <form
              onSubmit={handleSaveProfile}
              className="bg-white dark:bg-[#1a1e4a] rounded-2xl border border-slate-200 dark:border-[#2a3163] shadow-sm overflow-hidden animate-in fade-in"
            >
              <div className="p-5 border-b border-slate-200 dark:border-[#2a3163] bg-slate-50/50 dark:bg-slate-900/30 flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <User className="w-4 h-4 text-cyan-500" />
                  កែសម្រួលព័ត៌មានផ្ទាល់ខ្លួន
                </h3>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  ID: #{profile.id || 1}
                </span>
              </div>

              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="md:col-span-2">
                  <label className={labelClass}>ឈ្មោះពេញ (Full Name)</label>
                  <input
                    type="text"
                    required
                    value={profile.name}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                    className={`${inputClass} font-semibold`}
                    placeholder="បញ្ចូលឈ្មោះរបស់អ្នក"
                  />
                </div>

                <div>
                  <label className={labelClass}>អាសយដ្ឋានអ៊ីមែល (Email)</label>
                  <div className="relative">
                    <input
                      type="email"
                      required
                      value={profile.email}
                      onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                      className={`${inputClass} pl-10 font-mono`}
                      placeholder="yourname@domain.com"
                    />
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  </div>
                </div>

                <div>
                  <label className={labelClass}>លេខទូរស័ព្ទ (Phone Number)</label>
                  <div className="relative">
                    <input
                      type="tel"
                      value={profile.phone || ''}
                      onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                      className={`${inputClass} pl-10`}
                      placeholder="012 345 678"
                    />
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  </div>
                </div>

                <div>
                  <label className={labelClass}>តួនាទីក្នុងប្រព័ន្ធ (Role)</label>
                  <input
                    type="text"
                    disabled
                    value={profile.role || 'Administrator'}
                    className={`${inputClass} bg-slate-100 dark:bg-slate-800/60 text-slate-500 cursor-not-allowed`}
                  />
                </div>

                <div>
                  <label className={labelClass}>ប្រភេទគណនី (Account Type)</label>
                  <input
                    type="text"
                    disabled
                    value={profile.user_type === 'admin' ? 'អ្នកគ្រប់គ្រង (Admin)' : profile.user_type}
                    className={`${inputClass} bg-slate-100 dark:bg-slate-800/60 text-slate-500 cursor-not-allowed`}
                  />
                </div>
              </div>

              <div className="p-5 border-t border-slate-100 dark:border-[#2a3163] bg-slate-50/30 dark:bg-slate-900/10 flex items-center justify-between">
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  ព័ត៌មាននេះនឹងត្រូវបានបង្ហាញនៅក្នុងប្រព័ន្ធ Admin
                </p>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center gap-2 px-6 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-sm font-semibold shadow-md shadow-cyan-600/20 transition-all active:scale-95 disabled:opacity-50"
                >
                  {saving ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  <span>រក្សាទុកព័ត៌មាន</span>
                </button>
              </div>
            </form>
          </div>

          {/* Right: Quick Summary Card */}
          <div>
            <div className="bg-white dark:bg-[#1a1e4a] rounded-2xl border border-slate-200 dark:border-[#2a3163] p-5 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-cyan-500" />
                សេចក្តីសង្ខេបគណនី
              </h3>

              <div className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                <div className="py-2.5 flex items-center justify-between">
                  <span className="text-slate-500 dark:text-slate-400">កាលបរិច្ឆេទចូលរួម:</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    {profile.joined_date || '2025-10-01'}
                  </span>
                </div>
                <div className="py-2.5 flex items-center justify-between">
                  <span className="text-slate-500 dark:text-slate-400">តួនាទី:</span>
                  <span className="font-semibold text-cyan-600 dark:text-cyan-400">
                    {profile.role || 'Administrator'}
                  </span>
                </div>
                <div className="py-2.5 flex items-center justify-between">
                  <span className="text-slate-500 dark:text-slate-400">ស្ថានភាពគណនី:</span>
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                    សកម្ម (Active)
                  </span>
                </div>
                <div className="py-2.5 flex items-center justify-between">
                  <span className="text-slate-500 dark:text-slate-400">ចូលចុងក្រោយ:</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    {profile.last_login ? profile.last_login.split(' ')[0] : 'ថ្ងៃនេះ'}
                  </span>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => navigate('/settings')}
                  className="w-full py-2.5 px-3 rounded-xl bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold transition-colors text-center block"
                >
                  ទៅកាន់ការកំណត់ប្រព័ន្ធទូទៅ
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PersonalInfo;
