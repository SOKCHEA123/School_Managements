import React, { useState } from 'react';
import { Trash2, AlertTriangle } from 'lucide-react';
import API from '../../services/api';

const DeleteStudent = ({ student, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    try {
      await API.delete(`/admin/students/${student.id}`);
      onSuccess('បានលុបទិន្នន័យសិស្សដោយជោគជ័យ!');
      onClose();
    } catch (err) {
      alert(err.response?.data?.message || 'បរាជ័យក្នុងការលុបទិន្នន័យ');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs font-khmer animate-fade-in">
      <div className="bg-white dark:bg-[#1e293b] rounded-2xl w-full max-w-sm shadow-2xl border border-slate-200 dark:border-slate-800 p-6 text-center transition-all">
        <div className="w-14 h-14 rounded-2xl bg-red-500/10 text-red-600 dark:text-red-400 flex items-center justify-center mx-auto mb-4 border border-red-500/20">
          <Trash2 className="w-7 h-7" />
        </div>
        
        <h2 className="text-base font-bold text-slate-900 dark:text-white mb-2">
          បញ្ជាក់ការលុបទិន្នន័យសិស្ស
        </h2>
        
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-6 leading-relaxed">
          តើអ្នកពិតជាចង់លុបទិន្នន័យសិស្ស <strong className="text-slate-900 dark:text-white font-semibold">"{student.full_name_km}"</strong> (អត្តលេខ: {student.student_code}) មែនទេ? សកម្មភាពនេះមិនអាចត្រឡប់ក្រោយវិញបានឡើយ។
        </p>

        <div className="flex justify-center gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-medium transition-all cursor-pointer"
          >
            បោះបង់
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={loading}
            className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-semibold transition-all shadow-sm active:scale-95 cursor-pointer disabled:opacity-50 flex items-center justify-center gap-1.5"
          >
            <Trash2 className="w-3.5 h-3.5" />
            {loading ? 'កំពុងលុប...' : 'យល់ព្រមលុប'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteStudent;
