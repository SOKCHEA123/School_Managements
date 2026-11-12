import React, { useState } from 'react';
import { X, UserPlus, AlertCircle } from 'lucide-react';
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs font-khmer animate-fade-in">
      <div className="bg-white dark:bg-[#1e293b] rounded-2xl w-full max-w-lg shadow-2xl border border-slate-200 dark:border-slate-800 max-h-[90vh] overflow-y-auto p-6 transition-all">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">បញ្ចូលសិស្សថ្មី</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">បំពេញព័ត៌មានលម្អិតដើម្បីចុះឈ្មោះសិស្ស</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="mt-4 p-3.5 bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800/60 rounded-xl text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              អត្តលេខសិស្ស *
            </label>
            <input
              type="text"
              required
              value={formData.student_code}
              onChange={(e) => setFormData({ ...formData, student_code: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-mono text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                ឈ្មោះខ្មែរ *
              </label>
              <input
                type="text"
                required
                placeholder="ឧ. សុខ ដារ៉ា"
                value={formData.full_name_km}
                onChange={(e) => setFormData({ ...formData, full_name_km: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                ឈ្មោះឡាតាំង
              </label>
              <input
                type="text"
                placeholder="Sok Dara"
                value={formData.full_name_en}
                onChange={(e) => setFormData({ ...formData, full_name_en: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                ភេទ *
              </label>
              <select
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 cursor-pointer"
              >
                <option value="M">ប្រុស (Male)</option>
                <option value="F">ស្រី (Female)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                ថ្នាក់រៀន *
              </label>
              <select
                value={formData.classroom_id}
                onChange={(e) => setFormData({ ...formData, classroom_id: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 cursor-pointer"
              >
                <option value="">-- ជ្រើសរើសថ្នាក់ --</option>
                {activeClassrooms.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                ផ្នែកសិក្សា
              </label>
              <select
                value={formData.stream}
                onChange={(e) => setFormData({ ...formData, stream: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 cursor-pointer"
              >
                <option value="science">វិទ្យាសាស្ត្រ (Science)</option>
                <option value="social">សង្គម (Social)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                ថ្ងៃខែឆ្នាំកំណើត
              </label>
              <input
                type="date"
                value={formData.dob}
                onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              ទូរស័ព្ទអាណាព្យាបាល
            </label>
            <input
              type="text"
              placeholder="012 345 678"
              value={formData.parent_phone}
              onChange={(e) => setFormData({ ...formData, parent_phone: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-sm font-medium transition-all cursor-pointer"
            >
              បោះបង់
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold transition-all shadow-sm active:scale-95 cursor-pointer disabled:opacity-50"
            >
              {loading ? 'កំពុងរក្សាទុក...' : 'រក្សាទុកសិស្ស'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InputStudent;
