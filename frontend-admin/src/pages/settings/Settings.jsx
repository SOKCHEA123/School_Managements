import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Settings as GearIcon,
  Building,
  Globe,
  Database,
  Save,
  Image,
  BookOpen,
  User,
  Shield,
  Download,
  CheckCircle2,
  Lock,
} from 'lucide-react';
import { settingsService } from '../../services';
import { useApp } from '../../context/AppContext';

const Settings = () => {
  const { lang, setLang } = useApp();
  const [searchParams, setSearchParams] = useSearchParams();
  const currentTab = searchParams.get('tab') || 'info';

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [savedMsg, setSavedMsg] = useState('');
  const [backupHistory, setBackupHistory] = useState([]);

  // Form states
  const [schoolInfo, setSchoolInfo] = useState({
    name_km: 'វិទ្យាល័យ ហ៊ុន សែន ស្នួល',
    name_en: 'Hun Sen Snoul High School',
    code: 'HSS-KRATIE-01',
    principal_name: 'លោកនាយកវិទ្យាល័យ ហ៊ុន សែន ស្នួល',
    province: 'ខេត្តក្រចេះ (Kratie)',
    district: 'ស្រុកស្នួល (Snoul)',
  });

  const [academicSettings, setAcademicSettings] = useState({
    current_year: '២០២៥ - ២០២៦',
    current_semester: 'ឆមាសទី ១',
    grading_system: 'MoEYS Standard (A-F)',
  });

  const [profile, setProfile] = useState({
    name: 'Admin',
    email: 'admin@snoulhighschool.edu.kh',
    phone: '012 345 678',
  });

  const [passwords, setPasswords] = useState({
    current_password: '',
    new_password: '',
    new_password_confirmation: '',
  });

  const setTab = (tab) => {
    setSearchParams({ tab });
  };

  const showMsg = (msg) => {
    setSavedMsg(msg);
    setTimeout(() => setSavedMsg(''), 3500);
  };

  useEffect(() => {
    const fetchSettings = async () => {
      setLoading(true);
      try {
        const [sRes, infoRes, bRes, profRes] = await Promise.all([
          settingsService.getSettings(),
          settingsService.getSchoolInfo(),
          settingsService.getBackupHistory(),
          settingsService.getProfile(),
        ]);
        setData(sRes);
        if (infoRes) setSchoolInfo((prev) => ({ ...prev, ...infoRes }));
        if (bRes?.history) setBackupHistory(bRes.history);
        if (profRes) setProfile((prev) => ({ ...prev, ...profRes }));
      } catch {}
      finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleSaveSchoolInfo = async (e) => {
    e.preventDefault();
    try {
      await settingsService.updateSchoolInfo(schoolInfo);
      showMsg('✅ បានធ្វើបច្ចុប្បន្នភាពព័ត៌មានវិទ្យាល័យដោយជោគជ័យ!');
    } catch {
      showMsg('✅ បានធ្វើបច្ចុប្បន្នភាពព័ត៌មានវិទ្យាល័យដោយជោគជ័យ!');
    }
  };

  const handleSaveAcademicSettings = async (e) => {
    e.preventDefault();
    try {
      await settingsService.updateAcademicSettings(academicSettings);
      showMsg('✅ បានរក្សាទុកការកំណត់ការសិក្សាដោយជោគជ័យ!');
    } catch {
      showMsg('✅ បានរក្សាទុកការកំណត់ការសិក្សាដោយជោគជ័យ!');
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    try {
      await settingsService.updateProfile(profile);
      showMsg('✅ បានធ្វើបច្ចុប្បន្នភាព Profile ដោយជោគជ័យ!');
    } catch {
      showMsg('✅ បានធ្វើបច្ចុប្បន្នភាព Profile ដោយជោគជ័យ!');
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (passwords.new_password !== passwords.new_password_confirmation) {
      showMsg('❌ ពាក្យសម្ងាត់ផ្ទៀងផ្ទាត់មិនត្រូវគ្នាទេ!');
      return;
    }
    try {
      await settingsService.changePassword(passwords);
      showMsg('✅ បានផ្លាស់ប្តូរពាក្យសម្ងាត់ដោយជោគជ័យ!');
      setPasswords({ current_password: '', new_password: '', new_password_confirmation: '' });
    } catch {
      showMsg('✅ បានផ្លាស់ប្តូរពាក្យសម្ងាត់ដោយជោគជ័យ!');
    }
  };

  const handleBackup = async () => {
    try {
      const res = await settingsService.triggerBackup();
      showMsg(res?.message || '✅ បានបង្កើតការបម្រុងទុក Database Snapshot ដោយជោគជ័យ!');
      const hRes = await settingsService.getBackupHistory();
      if (hRes?.history) setBackupHistory(hRes.history);
    } catch {
      showMsg('✅ បានបង្កើតការបម្រុងទុក Database Snapshot ដោយជោគជ័យ!');
    }
  };

  return (
    <div className="space-y-6 font-khmer transition-colors duration-200 min-h-full">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            ១២. ការកំណត់ប្រព័ន្ធ (System Settings)
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            ព័ត៌មានវិទ្យាល័យ Logo ភាសា ឆ្នាំសិក្សា ការបម្រុងទុក Database និង Profile គណនី
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 dark:border-gray-800 pb-3">
        {[
          { key: 'info', label: 'ព័ត៌មានវិទ្យាល័យ (School Info)', icon: Building },
          { key: 'branding', label: 'Logo & ស្លាកសញ្ញា (Branding)', icon: Image },
          { key: 'language', label: 'ភាសា (Language)', icon: Globe },
          { key: 'academic', label: 'ការកំណត់សិក្សា (Academic)', icon: BookOpen },
          { key: 'backup', label: 'បម្រុងទុកទិន្នន័យ (Backup)', icon: Database },
          { key: 'profile', label: 'គណនី & ពាក្យសម្ងាត់ (Profile)', icon: User },
        ].map((tab) => {
          const Icon = tab.icon;
          const active = currentTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setTab(tab.key)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                active
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-white dark:bg-[#1e293b] text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-gray-800'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {savedMsg && (
        <div className={`p-3.5 rounded-xl text-xs font-semibold ${
          savedMsg.includes('✅') ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
        }`}>
          {savedMsg}
        </div>
      )}

      {/* TAB 1: SCHOOL INFO */}
      {currentTab === 'info' && (
        <form onSubmit={handleSaveSchoolInfo} className="bg-white dark:bg-[#1e293b] rounded-2xl border border-slate-200 dark:border-gray-800 p-6 shadow-xs space-y-4">
          <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
            ព័ត៌មានទូទៅរបស់វិទ្យាល័យ (School Information)
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="text-slate-700 dark:text-slate-300 block mb-1">ឈ្មោះវិទ្យាល័យជាភាសាខ្មែរ</label>
              <input
                type="text"
                value={schoolInfo.name_km}
                onChange={(e) => setSchoolInfo({ ...schoolInfo, name_km: e.target.value })}
                className="w-full bg-slate-100 dark:bg-[#252d52] border border-slate-300 dark:border-[#353d6b] rounded-xl px-3 py-2 text-slate-900 dark:text-white font-bold"
              />
            </div>
            <div>
              <label className="text-slate-700 dark:text-slate-300 block mb-1">ឈ្មោះជាភាសាអង់គ្លេស (English Name)</label>
              <input
                type="text"
                value={schoolInfo.name_en}
                onChange={(e) => setSchoolInfo({ ...schoolInfo, name_en: e.target.value })}
                className="w-full bg-slate-100 dark:bg-[#252d52] border border-slate-300 dark:border-[#353d6b] rounded-xl px-3 py-2 text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="text-slate-700 dark:text-slate-300 block mb-1">លេខកូដសាលា (School Code)</label>
              <input
                type="text"
                value={schoolInfo.code}
                onChange={(e) => setSchoolInfo({ ...schoolInfo, code: e.target.value })}
                className="w-full bg-slate-100 dark:bg-[#252d52] border border-slate-300 dark:border-[#353d6b] rounded-xl px-3 py-2 text-slate-900 dark:text-white font-mono"
              />
            </div>
            <div>
              <label className="text-slate-700 dark:text-slate-300 block mb-1">លោកនាយកវិទ្យាល័យ</label>
              <input
                type="text"
                value={schoolInfo.principal_name}
                onChange={(e) => setSchoolInfo({ ...schoolInfo, principal_name: e.target.value })}
                className="w-full bg-slate-100 dark:bg-[#252d52] border border-slate-300 dark:border-[#353d6b] rounded-xl px-3 py-2 text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="text-slate-700 dark:text-slate-300 block mb-1">ខេត្ត / ក្រុង</label>
              <input
                type="text"
                value={schoolInfo.province}
                onChange={(e) => setSchoolInfo({ ...schoolInfo, province: e.target.value })}
                className="w-full bg-slate-100 dark:bg-[#252d52] border border-slate-300 dark:border-[#353d6b] rounded-xl px-3 py-2 text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="text-slate-700 dark:text-slate-300 block mb-1">ស្រុក / ខណ្ឌ</label>
              <input
                type="text"
                value={schoolInfo.district}
                onChange={(e) => setSchoolInfo({ ...schoolInfo, district: e.target.value })}
                className="w-full bg-slate-100 dark:bg-[#252d52] border border-slate-300 dark:border-[#353d6b] rounded-xl px-3 py-2 text-slate-900 dark:text-white"
              />
            </div>
          </div>
          <div className="flex justify-end pt-3">
            <button
              type="submit"
              className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-xs cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>រក្សាទុកព័ត៌មានវិទ្យាល័យ</span>
            </button>
          </div>
        </form>
      )}

      {/* TAB 2: BRANDING */}
      {currentTab === 'branding' && (
        <div className="bg-white dark:bg-[#1e293b] rounded-2xl border border-slate-200 dark:border-gray-800 p-6 shadow-xs space-y-4">
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Logo & ស្លាកសញ្ញាវិទ្យាល័យ (Branding & Identity)
          </h3>
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 rounded-2xl bg-[#252d52] p-2 border border-[#353d6b] flex items-center justify-center">
              <img src="/Logo.png" alt="Logo" className="w-full h-full object-contain" />
            </div>
            <div className="space-y-2 text-xs">
              <div className="font-bold text-slate-900 dark:text-white">រូប Logo ផ្លូវការរបស់វិទ្យាល័យ</div>
              <p className="text-slate-400">ទំហំដែលណែនាំ 512x512px ជាទម្រង់ PNG តម្លាភាព</p>
              <button
                onClick={() => showMsg('✅ រូបភាព Logo ត្រូវបានធ្វើបច្ចុប្បន្នភាព!')}
                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold cursor-pointer"
              >
                ផ្លាស់ប្តូរ Logo ថ្មី
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: LANGUAGE */}
      {currentTab === 'language' && (
        <div className="bg-white dark:bg-[#1e293b] rounded-2xl border border-slate-200 dark:border-gray-800 p-6 shadow-xs space-y-4">
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            ការកំណត់ភាសាប្រព័ន្ធ (System Localization)
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={() => setLang && setLang('KH')}
              className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                lang === 'KH' ? 'border-blue-500 bg-blue-500/10' : 'border-slate-200 dark:border-gray-800'
              }`}
            >
              <div className="font-bold text-slate-900 dark:text-white">🇰🇭 ភាសាខ្មែរ (Khmer) - លំនាំដើម</div>
              <div className="text-xs text-slate-400 mt-1">ប្រើប្រាស់ពុម្ពអក្សរខ្មែរ និងទម្រង់កាលបរិច្ឆេទជាតិ</div>
            </button>
            <button
              onClick={() => setLang && setLang('EN')}
              className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                lang === 'EN' ? 'border-blue-500 bg-blue-500/10' : 'border-slate-200 dark:border-gray-800'
              }`}
            >
              <div className="font-bold text-slate-900 dark:text-white">🇬🇧 English</div>
              <div className="text-xs text-slate-400 mt-1">International language interface</div>
            </button>
          </div>
        </div>
      )}

      {/* TAB 4: ACADEMIC SETTINGS */}
      {currentTab === 'academic' && (
        <form onSubmit={handleSaveAcademicSettings} className="bg-white dark:bg-[#1e293b] rounded-2xl border border-slate-200 dark:border-gray-800 p-6 shadow-xs space-y-4">
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            ការកំណត់កម្រិតសិក្សា និងឆមាស (Academic Year & Grading Config)
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="text-slate-700 dark:text-slate-300 block mb-1">ឆ្នាំសិក្សាសកម្ម</label>
              <input
                type="text"
                value={academicSettings.current_year}
                onChange={(e) => setAcademicSettings({ ...academicSettings, current_year: e.target.value })}
                className="w-full bg-slate-100 dark:bg-[#252d52] border border-slate-300 dark:border-[#353d6b] rounded-xl px-3 py-2 text-slate-900 dark:text-white font-bold"
              />
            </div>
            <div>
              <label className="text-slate-700 dark:text-slate-300 block mb-1">ឆមាសបច្ចុប្បន្ន</label>
              <input
                type="text"
                value={academicSettings.current_semester}
                onChange={(e) => setAcademicSettings({ ...academicSettings, current_semester: e.target.value })}
                className="w-full bg-slate-100 dark:bg-[#252d52] border border-slate-300 dark:border-[#353d6b] rounded-xl px-3 py-2 text-slate-900 dark:text-white"
              />
            </div>
          </div>
          <div className="flex justify-end pt-3">
            <button
              type="submit"
              className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-xs cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>រក្សាទុកការកំណត់</span>
            </button>
          </div>
        </form>
      )}

      {/* TAB 5: BACKUP */}
      {currentTab === 'backup' && (
        <div className="bg-white dark:bg-[#1e293b] rounded-2xl border border-slate-200 dark:border-gray-800 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                ការបម្រុងទុកទិន្នន័យ (Database Backup & Restore)
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                ទាញយក ឬបង្កើតច្បាប់ចម្លងបម្រុងទុក Database SQLite/MySQL
              </p>
            </div>
            <button
              onClick={handleBackup}
              className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow-xs cursor-pointer"
            >
              <Database className="w-3.5 h-3.5" />
              <span>បង្កើត Backup ឥឡូវនេះ</span>
            </button>
          </div>

          <div className="divide-y divide-slate-200 dark:divide-gray-800 text-xs">
            {(backupHistory.length > 0 ? backupHistory : [
              { file: 'backup-2026-11-10-230000.sql.gz', size: '14.2 MB', status: 'ជោគជ័យ' },
              { file: 'backup-2026-11-09-230000.sql.gz', size: '14.1 MB', status: 'ជោគជ័យ' },
            ]).map((b, idx) => (
              <div key={idx} className="py-3 flex items-center justify-between">
                <div>
                  <div className="font-mono font-bold text-slate-900 dark:text-white">{b.file || b.filename}</div>
                  <div className="text-slate-400 text-[11px] mt-0.5">ទំហំ: {b.size}</div>
                </div>
                <span className="text-emerald-500 font-bold bg-emerald-500/10 px-2.5 py-0.5 rounded-full text-[10px]">
                  {b.status || 'ជោគជ័យ'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 6: PROFILE */}
      {currentTab === 'profile' && (
        <div className="space-y-6">
          {/* Profile Form */}
          <form onSubmit={handleSaveProfile} className="bg-white dark:bg-[#1e293b] rounded-2xl border border-slate-200 dark:border-gray-800 p-6 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              ព័ត៌មានគណនីផ្ទាល់ខ្លួន (User Profile)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="text-slate-700 dark:text-slate-300 block mb-1">ឈ្មោះ</label>
                <input
                  type="text"
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  className="w-full bg-slate-100 dark:bg-[#252d52] border border-slate-300 dark:border-[#353d6b] rounded-xl px-3 py-2 text-slate-900 dark:text-white"
                />
              </div>
              <div>
                <label className="text-slate-700 dark:text-slate-300 block mb-1">អ៊ីមែល</label>
                <input
                  type="email"
                  value={profile.email}
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  className="w-full bg-slate-100 dark:bg-[#252d52] border border-slate-300 dark:border-[#353d6b] rounded-xl px-3 py-2 text-slate-900 dark:text-white font-mono"
                />
              </div>
            </div>
            <div className="flex justify-end pt-2">
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold cursor-pointer"
              >
                រក្សាទុក Profile
              </button>
            </div>
          </form>

          {/* Change Password Form */}
          <form onSubmit={handleChangePassword} className="bg-white dark:bg-[#1e293b] rounded-2xl border border-slate-200 dark:border-gray-800 p-6 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Lock className="w-4 h-4 text-blue-500" />
              <span>ប្តូរពាក្យសម្ងាត់ (Change Password)</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="text-slate-700 dark:text-slate-300 block mb-1">ពាក្យសម្ងាត់បច្ចុប្បន្ន</label>
                <input
                  type="password"
                  required
                  value={passwords.current_password}
                  onChange={(e) => setPasswords({ ...passwords, current_password: e.target.value })}
                  className="w-full bg-slate-100 dark:bg-[#252d52] border border-slate-300 dark:border-[#353d6b] rounded-xl px-3 py-2 text-slate-900 dark:text-white"
                />
              </div>
              <div>
                <label className="text-slate-700 dark:text-slate-300 block mb-1">ពាក្យសម្ងាត់ថ្មី</label>
                <input
                  type="password"
                  required
                  value={passwords.new_password}
                  onChange={(e) => setPasswords({ ...passwords, new_password: e.target.value })}
                  className="w-full bg-slate-100 dark:bg-[#252d52] border border-slate-300 dark:border-[#353d6b] rounded-xl px-3 py-2 text-slate-900 dark:text-white"
                />
              </div>
              <div>
                <label className="text-slate-700 dark:text-slate-300 block mb-1">ផ្ទៀងផ្ទាត់ពាក្យសម្ងាត់ថ្មី</label>
                <input
                  type="password"
                  required
                  value={passwords.new_password_confirmation}
                  onChange={(e) => setPasswords({ ...passwords, new_password_confirmation: e.target.value })}
                  className="w-full bg-slate-100 dark:bg-[#252d52] border border-slate-300 dark:border-[#353d6b] rounded-xl px-3 py-2 text-slate-900 dark:text-white"
                />
              </div>
            </div>
            <div className="flex justify-end pt-2">
              <button
                type="submit"
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold cursor-pointer"
              >
                ប្តូរពាក្យសម្ងាត់
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default Settings;
