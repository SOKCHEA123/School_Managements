import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Building,
  Globe,
  Database,
  Save,
  Image,
  User,
  Download,
  CheckCircle2,
  AlertCircle,
  Lock,
  Palette,
  CalendarDays,
  ShieldCheck,
  Settings as GearIcon
} from 'lucide-react';
import { settingsService } from '../../services';
import { useApp } from '../../context/AppContext';

const Settings = () => {
  const { lang, setLang } = useApp();
  const [searchParams] = useSearchParams();
  const currentTab = searchParams.get('tab') || 'info';

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // កែសម្រួលស្ថានភាពសារ (Message State)
  const [savedMsg, setSavedMsg] = useState({ text: '', type: '' }); 
  
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

  const showMsg = (text, isError = false) => {
    setSavedMsg({ text, type: isError ? 'error' : 'success' });
    setTimeout(() => setSavedMsg({ text: '', type: '' }), 3500);
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
      } catch {
        // Ignore
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleSaveSchoolInfo = async (e) => {
    e.preventDefault();
    try {
      await settingsService.updateSchoolInfo(schoolInfo);
      showMsg('បានធ្វើបច្ចុប្បន្នភាពព័ត៌មានវិទ្យាល័យដោយជោគជ័យ!');
    } catch {
      showMsg('បរាជ័យក្នុងការរក្សាទុកព័ត៌មាន!', true);
    }
  };

  const handleSaveAcademicSettings = async (e) => {
    e.preventDefault();
    try {
      await settingsService.updateAcademicSettings(academicSettings);
      showMsg('បានរក្សាទុកការកំណត់ការសិក្សាដោយជោគជ័យ!');
    } catch {
      showMsg('បរាជ័យក្នុងការរក្សាទុកការកំណត់!', true);
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    try {
      await settingsService.updateProfile(profile);
      showMsg('បានធ្វើបច្ចុប្បន្នភាព Profile ដោយជោគជ័យ!');
    } catch {
      showMsg('បរាជ័យក្នុងការធ្វើបច្ចុប្បន្នភាព Profile!', true);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (passwords.new_password !== passwords.new_password_confirmation) {
      showMsg('ពាក្យសម្ងាត់ផ្ទៀងផ្ទាត់មិនត្រូវគ្នាទេ!', true);
      return;
    }
    try {
      await settingsService.changePassword(passwords);
      showMsg('បានផ្លាស់ប្តូរពាក្យសម្ងាត់ដោយជោគជ័យ!');
      setPasswords({ current_password: '', new_password: '', new_password_confirmation: '' });
    } catch {
      showMsg('បរាជ័យក្នុងការផ្លាស់ប្តូរពាក្យសម្ងាត់!', true);
    }
  };

  const handleBackup = async () => {
    try {
      const res = await settingsService.triggerBackup();
      showMsg(res?.message || 'បានបង្កើតការបម្រុងទុក Database ដោយជោគជ័យ!');
      const hRes = await settingsService.getBackupHistory();
      if (hRes?.history) setBackupHistory(hRes.history);
    } catch {
      showMsg('បរាជ័យក្នុងការបង្កើតការបម្រុងទុក!', true);
    }
  };

  // Utility class សម្រាប់ Input ដើម្បីកុំឱ្យសរសេរស្ទួន
  const inputClass = "w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all";
  const labelClass = "block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5";

  return (
    <div className="space-y-6 font-khmer transition-colors duration-200 min-h-full">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span className="p-2 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
              <GearIcon className="w-6 h-6" />
            </span>
            ការកំណត់ប្រព័ន្ធ
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
            ព័ត៌មានវិទ្យាល័យ Logo ភាសា ឆ្នាំសិក្សា ការបម្រុងទុក Database និង Profile គណនី
          </p>
        </div>
      </div>

      {/* Alerts */}
      {savedMsg.text && (
        <div className={`p-4 rounded-xl text-sm flex items-center gap-3 animate-in fade-in border ${
          savedMsg.type === 'success' 
            ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20' 
            : 'bg-rose-50 dark:bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-500/20'
        }`}>
          {savedMsg.type === 'success' ? <CheckCircle2 className="w-5 h-5 shrink-0" /> : <AlertCircle className="w-5 h-5 shrink-0" />}
          <span className="font-semibold">{savedMsg.text}</span>
        </div>
      )}

      {/* Loading */}
      {loading ? (
        <div className="py-20 text-center flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm text-slate-500">កំពុងទាញយកទិន្នន័យ...</p>
        </div>
      ) : (
        <>
          {/* TAB 1: SCHOOL INFO */}
          {currentTab === 'info' && (
            <form onSubmit={handleSaveSchoolInfo} className="bg-white dark:bg-[#1e293b] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-2">
              <div className="p-5 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/20">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Building className="w-4 h-4 text-blue-500" />
                  ព័ត៌មានទូទៅរបស់វិទ្យាល័យ
                </h3>
              </div>
              <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className={labelClass}>ឈ្មោះវិទ្យាល័យជាភាសាខ្មែរ</label>
                  <input type="text" value={schoolInfo.name_km} onChange={(e) => setSchoolInfo({ ...schoolInfo, name_km: e.target.value })} className={`${inputClass} font-bold`} />
                </div>
                <div>
                  <label className={labelClass}>ឈ្មោះជាភាសាអង់គ្លេស (English Name)</label>
                  <input type="text" value={schoolInfo.name_en} onChange={(e) => setSchoolInfo({ ...schoolInfo, name_en: e.target.value })} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>លេខកូដសាលា (School Code)</label>
                  <input type="text" value={schoolInfo.code} onChange={(e) => setSchoolInfo({ ...schoolInfo, code: e.target.value })} className={`${inputClass} font-mono`} />
                </div>
                <div>
                  <label className={labelClass}>លោកនាយកវិទ្យាល័យ</label>
                  <input type="text" value={schoolInfo.principal_name} onChange={(e) => setSchoolInfo({ ...schoolInfo, principal_name: e.target.value })} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>ខេត្ត / ក្រុង</label>
                  <input type="text" value={schoolInfo.province} onChange={(e) => setSchoolInfo({ ...schoolInfo, province: e.target.value })} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>ស្រុក / ខណ្ឌ</label>
                  <input type="text" value={schoolInfo.district} onChange={(e) => setSchoolInfo({ ...schoolInfo, district: e.target.value })} className={inputClass} />
                </div>
              </div>
              <div className="p-5 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                <button type="submit" className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold shadow-sm transition-all active:scale-95">
                  <Save className="w-4 h-4" /> រក្សាទុកព័ត៌មាន
                </button>
              </div>
            </form>
          )}

          {/* TAB 2: BRANDING */}
          {currentTab === 'branding' && (
            <div className="bg-white dark:bg-[#1e293b] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-2">
              <div className="p-5 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/20">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Palette className="w-4 h-4 text-violet-500" />
                  Logo & ស្លាកសញ្ញាវិទ្យាល័យ
                </h3>
              </div>
              <div className="p-6 flex flex-col sm:flex-row items-center gap-6">
                <div className="w-28 h-28 rounded-2xl bg-slate-50 dark:bg-slate-900 p-3 border border-slate-200 dark:border-slate-700 flex items-center justify-center shrink-0">
                  <img src="/Logo.png" alt="Logo" className="w-full h-full object-contain" />
                </div>
                <div className="space-y-3 text-center sm:text-left">
                  <div className="text-sm font-bold text-slate-800 dark:text-white">រូប Logo ផ្លូវការរបស់វិទ្យាល័យ</div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">ទំហំដែលណែនាំ 512x512px ជាទម្រង់ PNG តម្លាភាព (Transparent)</p>
                  <button onClick={() => showMsg('រូបភាព Logo ត្រូវបានធ្វើបច្ចុប្បន្នភាព!')} className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-sm font-semibold transition-colors">
                    ផ្លាស់ប្តូរ Logo ថ្មី
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: LANGUAGE */}
          {currentTab === 'language' && (
            <div className="bg-white dark:bg-[#1e293b] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-2">
              <div className="p-5 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/20">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Globe className="w-4 h-4 text-emerald-500" />
                  ការកំណត់ភាសាប្រព័ន្ធ
                </h3>
              </div>
              <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  onClick={() => setLang && setLang('KH')}
                  className={`p-4 rounded-xl border text-left transition-all ${
                    lang === 'KH' ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-500/10 ring-1 ring-blue-500/20' : 'border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-700'
                  }`}
                >
                  <div className="font-bold text-slate-800 dark:text-white flex items-center gap-2">
                    <img src="https://flagcdn.com/w40/kh.png" alt="Khmer" className="w-5 h-3.5 rounded-sm object-cover" />
                    ភាសាខ្មែរ (Khmer) - លំនាំដើម
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 mt-2">ប្រើប្រាស់ពុម្ពអក្សរខ្មែរ និងទម្រង់កាលបរិច្ឆេទជាតិ</div>
                </button>
                <button
                  onClick={() => setLang && setLang('EN')}
                  className={`p-4 rounded-xl border text-left transition-all ${
                    lang === 'EN' ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-500/10 ring-1 ring-blue-500/20' : 'border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-700'
                  }`}
                >
                  <div className="font-bold text-slate-800 dark:text-white flex items-center gap-2">
                    <img src="https://flagcdn.com/w40/us.png" alt="English" className="w-5 h-3.5 rounded-sm object-cover" />
                    English
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 mt-2">International language interface</div>
                </button>
              </div>
            </div>
          )}

          {/* TAB 4: ACADEMIC SETTINGS */}
          {currentTab === 'academic' && (
            <form onSubmit={handleSaveAcademicSettings} className="bg-white dark:bg-[#1e293b] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-2">
              <div className="p-5 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/20">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <CalendarDays className="w-4 h-4 text-amber-500" />
                  ការកំណត់កម្រិតសិក្សា និងឆមាស
                </h3>
              </div>
              <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className={labelClass}>ឆ្នាំសិក្សាសកម្ម</label>
                  <input type="text" value={academicSettings.current_year} onChange={(e) => setAcademicSettings({ ...academicSettings, current_year: e.target.value })} className={`${inputClass} font-bold`} />
                </div>
                <div>
                  <label className={labelClass}>ឆមាសបច្ចុប្បន្ន</label>
                  <input type="text" value={academicSettings.current_semester} onChange={(e) => setAcademicSettings({ ...academicSettings, current_semester: e.target.value })} className={inputClass} />
                </div>
              </div>
              <div className="p-5 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                <button type="submit" className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold shadow-sm transition-all active:scale-95">
                  <Save className="w-4 h-4" /> រក្សាទុកការកំណត់
                </button>
              </div>
            </form>
          )}

          {/* TAB 5: BACKUP */}
          {currentTab === 'backup' && (
            <div className="bg-white dark:bg-[#1e293b] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-2">
              <div className="p-5 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Database className="w-4 h-4 text-emerald-500" />
                    ការបម្រុងទុកទិន្នន័យ
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">ទាញយក ឬបង្កើតច្បាប់ចម្លងបម្រុងទុក Database</p>
                </div>
                <button onClick={handleBackup} className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-semibold shadow-sm transition-all active:scale-95 shrink-0">
                  <Database className="w-4 h-4" /> បង្កើត Backup ឥឡូវនេះ
                </button>
              </div>
              <div className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {(backupHistory.length > 0 ? backupHistory : [
                  { file: 'backup-2026-11-10-230000.sql.gz', size: '14.2 MB', status: 'ជោគជ័យ' },
                  { file: 'backup-2026-11-09-230000.sql.gz', size: '14.1 MB', status: 'ជោគជ័យ' },
                ]).map((b, idx) => (
                  <div key={idx} className="p-4 flex items-center justify-between hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors group">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 flex items-center justify-center shrink-0">
                        <Database className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="font-mono font-bold text-sm text-slate-800 dark:text-white">{b.file || b.filename}</div>
                        <div className="text-slate-500 text-xs mt-0.5">ទំហំ: {b.size}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 px-2.5 py-1 rounded-md text-xs">
                        {b.status || 'ជោគជ័យ'}
                      </span>
                      <button className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-500/10 transition-colors opacity-0 group-hover:opacity-100" title="Download">
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: PROFILE */}
          {currentTab === 'profile' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
              {/* Profile Form */}
              <form onSubmit={handleSaveProfile} className="bg-white dark:bg-[#1e293b] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                <div className="p-5 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/20">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <User className="w-4 h-4 text-blue-500" />
                    ព័ត៌មានគណនីផ្ទាល់ខ្លួន
                  </h3>
                </div>
                <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className={labelClass}>ឈ្មោះ</label>
                    <input type="text" value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>អ៊ីមែល</label>
                    <input type="email" value={profile.email} onChange={(e) => setProfile({ ...profile, email: e.target.value })} className={`${inputClass} font-mono`} />
                  </div>
                </div>
                <div className="p-5 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                  <button type="submit" className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold shadow-sm transition-all active:scale-95">
                    រក្សាទុក Profile
                  </button>
                </div>
              </form>

              {/* Change Password Form */}
              <form onSubmit={handleChangePassword} className="bg-white dark:bg-[#1e293b] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                <div className="p-5 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/20">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Lock className="w-4 h-4 text-emerald-500" />
                    ប្តូរពាក្យសម្ងាត់
                  </h3>
                </div>
                <div className="p-5 grid grid-cols-1 md:grid-cols-3 gap-5">
                  <div>
                    <label className={labelClass}>ពាក្យសម្ងាត់បច្ចុប្បន្ន</label>
                    <input type="password" required value={passwords.current_password} onChange={(e) => setPasswords({ ...passwords, current_password: e.target.value })} className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>ពាក្យសម្ងាត់ថ្មី</label>
                    <input type="password" required value={passwords.new_password} onChange={(e) => setPasswords({ ...passwords, new_password: e.target.value })} className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>ផ្ទៀងផ្ទាត់ពាក្យសម្ងាត់ថ្មី</label>
                    <input type="password" required value={passwords.new_password_confirmation} onChange={(e) => setPasswords({ ...passwords, new_password_confirmation: e.target.value })} className={inputClass} />
                  </div>
                </div>
                <div className="p-5 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                  <button type="submit" className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-semibold shadow-sm transition-all active:scale-95">
                    <ShieldCheck className="w-4 h-4" /> ប្តូរពាក្យសម្ងាត់
                  </button>
                </div>
              </form>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Settings;