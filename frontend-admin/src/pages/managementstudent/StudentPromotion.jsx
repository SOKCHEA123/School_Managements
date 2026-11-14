import React, { useState, useEffect } from 'react';
import { Award, TrendingUp, CheckCircle2, AlertTriangle, XCircle, RefreshCw, Users } from 'lucide-react';
import { studentServicesService } from '../../services';

/**
 * Option 2: ការឡើងថ្នាក់ (Student Promotion)
 */
const StudentPromotion = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [promoting, setPromoting] = useState(false);
  const [message, setMessage] = useState('');

  const showMsg = (msg) => {
    setMessage(msg);
    setTimeout(() => setMessage(''), 4000);
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await studentServicesService.getOverview();
      setData(res);
    } catch (err) {
      console.warn('Failed to fetch promotion overview', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handlePromoteStudents = async () => {
    if (!window.confirm('តើអ្នកពិតជាចង់ដំណើរការឡើងថ្នាក់ស្វ័យប្រវត្តិមែនទេ?')) return;
    setPromoting(true);
    try {
      await studentServicesService.promoteStudents();
      showMsg('✅ បានដំណើរការឡើងថ្នាក់សិស្សដោយជោគជ័យ!');
      loadData();
    } catch {
      showMsg('❌ បរាជ័យក្នុងការដំណើរការឡើងថ្នាក់');
    } finally {
      setPromoting(false);
    }
  };

  return (
    <div className="space-y-6 font-khmer">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
              <TrendingUp className="w-5 h-5" />
            </span>
            <h1 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white">
              ការឡើងថ្នាក់សិស្ស (Student Promotion)
            </h1>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            ដំណើរការឡើងថ្នាក់ស្វ័យប្រវត្តិតាមលក្ខខណ្ឌមធ្យមភាគពិន្ទុ និងវត្តមានសម្រាប់ឆ្នាំសិក្សាថ្មី
          </p>
        </div>

        <button
          onClick={handlePromoteStudents}
          disabled={promoting}
          className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-xl text-xs font-semibold shadow-xs flex items-center justify-center gap-2 cursor-pointer transition-all"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${promoting ? 'animate-spin' : ''}`} />
          <span>{promoting ? 'កំពុងដំណើរការ...' : 'ដំណើរការឡើងថ្នាក់រួម'}</span>
        </button>
      </div>

      {message && (
        <div
          className={`p-4 rounded-xl text-xs font-semibold ${
            message.includes('✅')
              ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
              : 'bg-rose-500/10 text-rose-500 border border-rose-500/20'
          }`}
        >
          {message}
        </div>
      )}

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-gray-800 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 dark:text-slate-400">សិស្សគ្រប់លក្ខខណ្ឌឡើងថ្នាក់</span>
            <span className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-500">
              <CheckCircle2 className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl font-bold text-emerald-500 mt-2">
            {data?.promotions_eligible ?? 820} / 850 នាក់
          </div>
          <div className="text-xs text-emerald-500/80 mt-1 font-medium">96.5% នៃសិស្សទាំងអស់</div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-gray-800 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 dark:text-slate-400">សិស្សត្រូវប្រឡងសង (Re-exam)</span>
            <span className="p-1.5 rounded-lg bg-amber-500/10 text-amber-500">
              <AlertTriangle className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl font-bold text-amber-500 mt-2">
            {data?.re_exam_students ?? 22} នាក់
          </div>
          <div className="text-xs text-slate-400 mt-1">ពិន្ទុមធ្យមភាគ 45 - 49.9</div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-gray-800 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 dark:text-slate-400">សិស្សត្រួតថ្នាក់ (Retain)</span>
            <span className="p-1.5 rounded-lg bg-rose-500/10 text-rose-500">
              <XCircle className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl font-bold text-rose-500 mt-2">
            {data?.retained_students ?? 8} នាក់
          </div>
          <div className="text-xs text-slate-400 mt-1">អវត្តមានលើសកម្រិតកំណត់</div>
        </div>
      </div>

      {/* Rules Criteria Card */}
      <div className="bg-white dark:bg-[#1e293b] p-6 rounded-2xl border border-slate-200 dark:border-gray-800 space-y-4">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Award className="w-4 h-4 text-emerald-500" />
          <span>លក្ខខណ្ឌនៃការឡើងថ្នាក់ (Promotion Criteria)</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#252d52] border border-slate-200 dark:border-[#333d6d]">
            <span className="font-bold text-slate-800 dark:text-slate-200">១. លក្ខខណ្ឌពិន្ទុមធ្យមភាគប្រចាំឆ្នាំ</span>
            <p className="text-slate-500 dark:text-slate-400 mt-1">
              សិស្សត្រូវទទួលបានពិន្ទុមធ្យមភាគចាប់ពី <strong>50.0</strong> ឡើងទៅ ទើបមានសិទ្ធិឡើងទៅថ្នាក់បន្ទាប់។
            </p>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#252d52] border border-slate-200 dark:border-[#333d6d]">
            <span className="font-bold text-slate-800 dark:text-slate-200">២. លក្ខខណ្ឌវត្តមានប្រចាំឆ្នាំ</span>
            <p className="text-slate-500 dark:text-slate-400 mt-1">
              អវត្តមានគ្មានច្បាប់មិនត្រូវលើសពី <strong>15%</strong> នៃម៉ោងសិក្សាសរុបនៃឆ្នាំសិក្សា។
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentPromotion;
