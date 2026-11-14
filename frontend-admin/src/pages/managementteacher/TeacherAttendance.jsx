import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, Clock, Plus, X, Search, AlertCircle, Save, 
  User, BookOpen, Calendar, FileText, XCircle 
} from 'lucide-react';
import { attendanceService, teacherService } from '../../services';

const TeacherAttendance = () => {
  const [teachers, setTeachers] = useState([]);
  const [teacherRecords, setTeacherRecords] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newAtt, setNewAtt] = useState({
    name: '',
    subject: 'គណិតវិទ្យា',
    shift: 'ព្រឹក',
    status: 'present',
    time: '07:00 AM',
  });

  const showMsg = (msg) => {
    setMessage(msg);
    setTimeout(() => setMessage(''), 3500);
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const [tRes, attRes] = await Promise.all([
        teacherService.getTeachers(),
        attendanceService.getTeacherAttendance(selectedDate),
      ]);
      setTeachers(tRes?.data || (Array.isArray(tRes) ? tRes : []));
      const records = attRes?.data || attRes?.records || [];
      if (records && records.length > 0) {
        setTeacherRecords(records);
      } else {
        // Fallback default mock
        setTeacherRecords([
          { id: 1, name: 'លោកគ្រូ សុខ ចាន់ដារ៉ា', subject: 'គណិតវិទ្យា', shift: 'ព្រឹក', time: '06:50 AM', status: 'present' },
          { id: 2, name: 'អ្នកគ្រូ កែវ វិសាល', subject: 'រូបវិទ្យា', shift: 'ព្រឹក', time: '07:10 AM', status: 'late' },
          { id: 3, name: 'លោកគ្រូ ហេង សម្បត្តិ', subject: 'គីមីវិទ្យា', shift: 'រសៀល', time: '01:00 PM', status: 'present' },
          { id: 4, name: 'អ្នកគ្រូ ចាន់ ស្រីនាង', subject: 'អក្សរសាស្ត្រខ្មែរ', shift: 'ព្រឹក', time: '--:--', status: 'permission' },
        ]);
      }
    } catch {
      setTeacherRecords([
        { id: 1, name: 'លោកគ្រូ សុខ ចាន់ដារ៉ា', subject: 'គណិតវិទ្យា', shift: 'ព្រឹក', time: '06:50 AM', status: 'present' },
        { id: 2, name: 'អ្នកគ្រូ កែវ វិសាល', subject: 'រូបវិទ្យា', shift: 'ព្រឹក', time: '07:10 AM', status: 'late' },
        { id: 3, name: 'លោកគ្រូ ហេង សម្បត្តិ', subject: 'គីមីវិទ្យា', shift: 'រសៀល', time: '01:00 PM', status: 'present' },
        { id: 4, name: 'អ្នកគ្រូ ចាន់ ស្រីនាង', subject: 'អក្សរសាស្ត្រខ្មែរ', shift: 'ព្រឹក', time: '--:--', status: 'permission' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [selectedDate]);

  const handleCreate = (e) => {
    e.preventDefault();
    setTeacherRecords([
      ...teacherRecords,
      { id: Date.now(), ...newAtt },
    ]);
    setIsModalOpen(false);
    showMsg('✅ បានកត់ត្រាវត្តមានគ្រូបង្រៀនដោយជោគជ័យ!');
    setNewAtt({ name: '', subject: 'គណិតវិទ្យា', shift: 'ព្រឹក', status: 'present', time: '07:00 AM' });
  };

  const filtered = teacherRecords.filter((t) =>
    (t.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (t.subject || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 font-khmer transition-colors duration-200">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <span className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="w-6 h-6" strokeWidth={1.8} />
            </span>
            <h1 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white">
              វត្តមានគ្រូបង្រៀន (Teacher Attendance)
            </h1>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
            កត់ត្រាម៉ោងមកដល់ និងការបង្រៀនប្រចាំថ្ងៃរបស់លោកគ្រូ-អ្នកគ្រូ
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="pl-9 pr-3 py-2.5 text-sm bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all cursor-pointer"
            />
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-semibold shadow-sm shadow-emerald-500/20 active:scale-95 flex items-center gap-2 cursor-pointer transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>កត់ត្រាវត្តមាន</span>
          </button>
        </div>
      </div>

      {message && (
        <div className="p-4 rounded-xl text-sm font-medium bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20 flex items-center gap-2 animate-in fade-in duration-200">
          <CheckCircle2 className="w-5 h-5" />
          {message}
        </div>
      )}

      {/* Metrics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-[#1e293b] p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">មកទាន់ពេល</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
            {teacherRecords.filter((t) => t.status === 'present').length} <span className="text-sm font-medium text-slate-400">នាក់</span>
          </div>
        </div>

        <div className="bg-white dark:bg-[#1e293b] p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">មកយឺត</span>
            <Clock className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-2xl font-black text-blue-600 dark:text-blue-400">
            {teacherRecords.filter((t) => t.status === 'late').length} <span className="text-sm font-medium text-slate-400">នាក់</span>
          </div>
        </div>

        <div className="bg-white dark:bg-[#1e293b] p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">សុំច្បាប់</span>
            <FileText className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-black text-amber-600 dark:text-amber-400">
            {teacherRecords.filter((t) => t.status === 'permission').length} <span className="text-sm font-medium text-slate-400">នាក់</span>
          </div>
        </div>

        <div className="bg-white dark:bg-[#1e293b] p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">អវត្តមាន</span>
            <XCircle className="w-4 h-4 text-rose-500" />
          </div>
          <div className="text-2xl font-black text-rose-600 dark:text-rose-400">
            {teacherRecords.filter((t) => t.status === 'absent').length} <span className="text-sm font-medium text-slate-400">នាក់</span>
          </div>
        </div>
      </div>

      {/* Table Card */}
      <div className="bg-white dark:bg-[#1e293b] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        {/* Table Header Controls */}
        <div className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800">
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <User className="w-5 h-5 text-emerald-500" />
            កំណត់ត្រាវត្តមានគ្រូបង្រៀន
          </h3>
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <input
              type="text"
              placeholder="ស្វែងរកតាមឈ្មោះ, មុខវិជ្ជា..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50/75 dark:bg-slate-900/50 text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="px-6 py-4">ឈ្មោះគ្រូបង្រៀន</th>
                <th className="px-6 py-4">មុខវិជ្ជាឯកទេស</th>
                <th className="px-6 py-4">វេនបង្រៀន</th>
                <th className="px-6 py-4">ម៉ោងមកដល់</th>
                <th className="px-6 py-4 text-center">ស្ថានភាព</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {loading ? (
                <tr>
                  <td colSpan="5" className="text-center py-10 text-slate-500">កំពុងទាញយកទិន្នន័យ...</td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-10 text-slate-500">មិនមានទិន្នន័យវត្តមានទេ</td>
                </tr>
              ) : (
                filtered.map((t, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="px-6 py-4 font-bold text-slate-800 dark:text-white">
                      {t.name}
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                        <BookOpen className="w-3.5 h-3.5 text-slate-400" />
                        {t.subject || 'ទូទៅ'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2.5 py-0.5 rounded-md text-xs font-medium ${
                        t.shift === 'ព្រឹក' ? 'bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400' : 'bg-indigo-100 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-400'
                      }`}>
                        {t.shift || 'ព្រឹក'}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-mono text-xs text-slate-500 dark:text-slate-400">
                      {t.time || '07:00 AM'}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span
                        className={`inline-flex items-center justify-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${
                          t.status === 'present'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20'
                            : t.status === 'late'
                            ? 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20'
                            : t.status === 'permission'
                            ? 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20'
                            : 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/20'
                        }`}
                      >
                        {t.status === 'present' && <CheckCircle2 className="w-3.5 h-3.5" />}
                        {t.status === 'late' && <Clock className="w-3.5 h-3.5" />}
                        {t.status === 'permission' && <FileText className="w-3.5 h-3.5" />}
                        {t.status === 'absent' && <XCircle className="w-3.5 h-3.5" />}
                        {t.status === 'present' ? 'មកទាន់ពេល' : t.status === 'late' ? 'មកយឺត' : t.status === 'permission' ? 'សុំច្បាប់' : 'អវត្តមាន'}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal (Add New Attendance) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm font-khmer animate-in fade-in duration-200">
          <div className="bg-white dark:bg-[#1e293b] rounded-2xl w-full max-w-md border border-slate-200 dark:border-slate-800 shadow-2xl animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex justify-between items-center px-6 py-4 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <User className="w-5 h-5 text-emerald-500" />
                កត់ត្រាវត្តមានគ្រូបង្រៀន
              </h3>
              <button 
                onClick={() => setIsModalOpen(false)} 
                className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {/* Modal Body */}
            <form onSubmit={handleCreate} className="p-6 space-y-4 text-sm">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">ឈ្មោះគ្រូបង្រៀន *</label>
                <input
                  type="text"
                  required
                  placeholder="លោកគ្រូ សុខ ចាន់ដារ៉ា"
                  value={newAtt.name}
                  onChange={(e) => setNewAtt({ ...newAtt, name: e.target.value })}
                  className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">មុខវិជ្ជា</label>
                  <input
                    type="text"
                    value={newAtt.subject}
                    onChange={(e) => setNewAtt({ ...newAtt, subject: e.target.value })}
                    className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">វេនបង្រៀន</label>
                  <select
                    value={newAtt.shift}
                    onChange={(e) => setNewAtt({ ...newAtt, shift: e.target.value })}
                    className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                  >
                    <option value="ព្រឹក">ព្រឹក</option>
                    <option value="រសៀល">រសៀល</option>
                  </select>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">ស្ថានភាព</label>
                  <select
                    value={newAtt.status}
                    onChange={(e) => setNewAtt({ ...newAtt, status: e.target.value })}
                    className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                  >
                    <option value="present">មកទាន់ពេល</option>
                    <option value="late">មកយឺត</option>
                    <option value="permission">សុំច្បាប់</option>
                    <option value="absent">អវត្តមាន</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">ម៉ោងមកដល់</label>
                  <input
                    type="text"
                    value={newAtt.time}
                    onChange={(e) => setNewAtt({ ...newAtt, time: e.target.value })}
                    className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                  />
                </div>
              </div>
              
              {/* Modal Footer */}
              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800 mt-6">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl font-semibold transition-colors"
                >
                  បោះបង់
                </button>
                <button 
                  type="submit" 
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold flex items-center gap-2 shadow-sm shadow-emerald-500/20 transition-all active:scale-95"
                >
                  <Save className="w-4 h-4" />
                  រក្សាទុក
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherAttendance;