import React, { useState } from 'react';
import { X, UserPlus, AlertCircle, KeyRound, Mail, Lock, Eye, EyeOff, ShieldCheck } from 'lucide-react';
import API from '../../services/api';

const fallbackClassrooms = [
  { id: 1, name: '12A' },
  { id: 2, name: '12B' },
  { id: 3, name: '11A' },
  { id: 4, name: '11B' },
  { id: 5, name: '10A' },
  { id: 6, name: '10B' },
];

const InputStudent = ({ classrooms, onClose, onSuccess }) => {
  const activeClassrooms = classrooms && classrooms.length > 0 ? classrooms : fallbackClassrooms;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    student_code: `STU${Date.now().toString().slice(-4)}`,
    full_name_km: '',
    full_name_en: '',
    gender: 'M',
    dob: '',
    classroom_id: activeClassrooms[0]?.id || 1,
    stream: 'science',
    parent_phone: '',
    status: 'active',
    email: '',
    password: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await API.post('/admin/students', formData);
      onSuccess('បានបញ្ចូលសិស្សថ្មីដោយជោគជ័យ!');
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'បរាជ័យក្នុងការរក្សាទុកទិន្នន័យសិស្ស');
    } finally {
      setLoading(false);
    }
  };

  // Style រួមសម្រាប់ Input និង Select
  const inputClass = "w-full px-3.5 py-2.5 bg-slate-50 dark:bg-[#0f1330] border border-slate-300 dark:border-[#2a3163] rounded-lg text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all";
  const labelClass = "block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm font-khmer animate-fade-in">
      <div className="bg-white dark:bg-[#1a1e4a] rounded-2xl w-full max-w-xl shadow-xl border border-slate-200 dark:border-[#2a3163] max-h-[90vh] overflow-y-auto custom-scrollbar transition-all">
        
        {/* Header */}
        <div className="sticky top-0 z-10 bg-white/95 dark:bg-[#1a1e4a]/95 backdrop-blur-md flex items-center justify-between p-5 border-b border-slate-100 dark:border-[#2a3163]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">បញ្ចូលសិស្សថ្មី</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">បំពេញព័ត៌មានលម្អិតដើម្បីចុះឈ្មោះសិស្ស</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 sm:p-6">
          {error && (
            <div className="mb-5 p-3.5 bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-500/20 rounded-xl text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            
            {/* Basic Info Row 1 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>អត្តលេខសិស្ស <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  required
                  value={formData.student_code}
                  onChange={(e) => setFormData({ ...formData, student_code: e.target.value })}
                  className={`${inputClass} font-mono`}
                />
              </div>
              <div>
                <label className={labelClass}>ភេទ <span className="text-red-500">*</span></label>
                <select
                  value={formData.gender}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                  className={`${inputClass} cursor-pointer`}
                >
                  <option value="M">ប្រុស (Male)</option>
                  <option value="F">ស្រី (Female)</option>
                </select>
              </div>
            </div>

            {/* Basic Info Row 2 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>ឈ្មោះខ្មែរ <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  required
                  placeholder="ឧ. សុខ ដារ៉ា"
                  value={formData.full_name_km}
                  onChange={(e) => setFormData({ ...formData, full_name_km: e.target.value })}
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>ឈ្មោះឡាតាំង</label>
                <input
                  type="text"
                  placeholder="Sok Dara"
                  value={formData.full_name_en}
                  onChange={(e) => setFormData({ ...formData, full_name_en: e.target.value })}
                  className={inputClass}
                />
              </div>
            </div>

            {/* Academic Info */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className={labelClass}>ថ្នាក់រៀន <span className="text-red-500">*</span></label>
                <select
                  value={formData.classroom_id}
                  onChange={(e) => setFormData({ ...formData, classroom_id: e.target.value })}
                  className={`${inputClass} cursor-pointer`}
                >
                  <option value="">-- ជ្រើសរើស --</option>
                  {activeClassrooms.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelClass}>ផ្នែកសិក្សា</label>
                <select
                  value={formData.stream}
                  onChange={(e) => setFormData({ ...formData, stream: e.target.value })}
                  className={`${inputClass} cursor-pointer`}
                >
                  <option value="science">វិទ្យាសាស្ត្រ</option>
                  <option value="social">សង្គម</option>
                </select>
              </div>
              <div>
                <label className={labelClass}>ថ្ងៃខែឆ្នាំកំណើត</label>
                <input
                  type="date"
                  value={formData.dob}
                  onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                  className={inputClass}
                />
              </div>
            </div>

            {/* Contact Info */}
            <div>
              <label className={labelClass}>ទូរស័ព្ទអាណាព្យាបាល</label>
              <input
                type="text"
                placeholder="012 345 678"
                value={formData.parent_phone}
                onChange={(e) => setFormData({ ...formData, parent_phone: e.target.value })}
                className={inputClass}
              />
            </div>

            {/* Student Portal Credentials */}
            <div className="p-4 bg-slate-50 dark:bg-[#0f1330] border border-slate-200 dark:border-[#2a3163] rounded-xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-[#2a3163] pb-3">
                <div className="flex items-center gap-2">
                  <KeyRound className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                    គណនីចូលប្រើសម្រាប់សិស្ស
                  </h3>
                </div>
                <span className="inline-flex items-center gap-1 text-[10px] bg-indigo-100 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 font-semibold px-2 py-0.5 rounded-md">
                  <ShieldCheck className="w-3 h-3" /> Portal
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Login Email */}
                <div>
                  <label className={labelClass}>អ៊ីមែល (Email)</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      placeholder="student@school.edu"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className={`${inputClass} pl-9`}
                    />
                  </div>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1.5">
                    ទុកទទេ ប្រព័ន្ធនឹងបង្កើតជូនដោយស្វ័យប្រវត្តិ
                  </p>
                </div>

                {/* Login Password */}
                <div>
                  <label className={labelClass}>ពាក្យសម្ងាត់ (Password)</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="12345678"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className={`${inputClass} pl-9 pr-9 font-mono`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1.5">
                    លំនាំដើម៖ <code className="text-indigo-600 dark:text-indigo-400 font-mono font-semibold">12345678</code>
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 mt-2 pt-5 border-t border-slate-100 dark:border-[#2a3163]">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-lg text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
              >
                បោះបង់
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-semibold transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                    </svg>
                    កំពុងរក្សាទុក...
                  </>
                ) : (
                  'រក្សាទុកសិស្ស'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default InputStudent;