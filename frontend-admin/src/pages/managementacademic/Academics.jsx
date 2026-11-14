import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  School,
  BookOpen,
  Calendar,
  Layers,
  Plus,
  Trash2,
  X,
  CheckCircle2,
  AlertCircle,
  Save
} from 'lucide-react';
import { academicService } from '../../services';
import { useApp } from '../../context/AppContext';

const Academics = () => {
  const { lang } = useApp();
  const [searchParams, setSearchParams] = useSearchParams();
  const currentTab = searchParams.get('tab') || 'classrooms';

  const [classrooms, setClassrooms] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [academicYears, setAcademicYears] = useState([]);
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  // Modals
  const [isClassModalOpen, setIsClassModalOpen] = useState(false);
  const [newClass, setNewClass] = useState({ name: '', grade_level: 12, stream: 'science', room_number: '101' });

  const [isSubjectModalOpen, setIsSubjectModalOpen] = useState(false);
  const [newSubject, setNewSubject] = useState({ name: '', code: '', coefficient: 2, grade_level: 12 });

  const [isYearModalOpen, setIsYearModalOpen] = useState(false);
  const [newYear, setNewYear] = useState({ name: '2026-2027', start_date: '2026-10-01', end_date: '2027-07-31', is_current: false });

  const showMsg = (msg, isErr = false) => {
    if (isErr) {
      setError(msg);
      setTimeout(() => setError(''), 3500);
    } else {
      setSuccess(msg);
      setTimeout(() => setSuccess(''), 3500);
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const [cRes, sRes, yRes, secRes] = await Promise.all([
        academicService.getClassrooms(),
        academicService.getSubjects(),
        academicService.getAcademicYears(),
        academicService.getSections(),
      ]);
      setClassrooms(cRes?.data || (Array.isArray(cRes) ? cRes : []));
      setSubjects(sRes?.data || (Array.isArray(sRes) ? sRes : []));
      setAcademicYears(yRes?.data || (Array.isArray(yRes) ? yRes : []));
      setSections(secRes?.shifts || secRes?.data || []);
    } catch (err) {
      console.error('Error fetching academic data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateClassroom = async (e) => {
    e.preventDefault();
    try {
      await academicService.createClassroom(newClass);
      showMsg('បានបង្កើតថ្នាក់រៀនថ្មីដោយជោគជ័យ!');
      setIsClassModalOpen(false);
      setNewClass({ name: '', grade_level: 12, stream: 'science', room_number: '101' });
      fetchData();
    } catch (err) {
      showMsg(err.response?.data?.message || 'បរាជ័យក្នុងការបង្កើតថ្នាក់រៀន', true);
    }
  };

  const handleDeleteClassroom = async (id) => {
    if (!window.confirm('តើអ្នកពិតជាចង់លុបថ្នាក់នេះមែនទេ?')) return;
    try {
      await academicService.deleteClassroom(id);
      showMsg('បានលុបថ្នាក់រៀនរួចរាល់');
      fetchData();
    } catch (err) {
      showMsg('បរាជ័យក្នុងការលុប', true);
    }
  };

  const handleCreateSubject = async (e) => {
    e.preventDefault();
    try {
      await academicService.createSubject(newSubject);
      showMsg('បានបង្កើតមុខវិជ្ជាថ្មីដោយជោគជ័យ!');
      setIsSubjectModalOpen(false);
      setNewSubject({ name: '', code: '', coefficient: 2, grade_level: 12 });
      fetchData();
    } catch (err) {
      showMsg(err.response?.data?.message || 'បរាជ័យក្នុងការបង្កើតមុខវិជ្ជា', true);
    }
  };

  const handleDeleteSubject = async (id) => {
    if (!window.confirm('តើអ្នកពិតជាចង់លុបមុខវិជ្ជានេះមែនទេ?')) return;
    try {
      await academicService.deleteSubject(id);
      showMsg('បានលុបមុខវិជ្ជារួចរាល់');
      fetchData();
    } catch (err) {
      showMsg('បរាជ័យក្នុងការលុប', true);
    }
  };

  const handleCreateYear = async (e) => {
    e.preventDefault();
    try {
      await academicService.createAcademicYear(newYear);
      showMsg('បានបង្កើតឆ្នាំសិក្សាថ្មីដោយជោគជ័យ!');
      setIsYearModalOpen(false);
      fetchData();
    } catch (err) {
      showMsg(err.response?.data?.message || 'បរាជ័យក្នុងការបង្កើតឆ្នាំសិក្សា', true);
    }
  };

  const handleDeleteYear = async (id) => {
    if (!window.confirm('តើអ្នកពិតជាចង់លុបឆ្នាំសិក្សានេះមែនទេ?')) return;
    try {
      await academicService.deleteAcademicYear(id);
      showMsg('បានលុបឆ្នាំសិក្សារួចរាល់');
      fetchData();
    } catch (err) {
      showMsg('បរាជ័យក្នុងការលុប', true);
    }
  };

  return (
    <div className="space-y-6 font-khmer transition-colors duration-200 min-h-full">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span className="p-2 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
              <School className="w-6 h-6" />
            </span>
            ការគ្រប់គ្រងការសិក្សា
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
            គ្រប់គ្រងបន្ទប់រៀន មុខវិជ្ជា ឆ្នាំសិក្សា និងវេនសិក្សា
          </p>
        </div>
      </div>

      {/* Alerts */}
      {success && (
        <div className="p-4 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20 rounded-xl text-sm flex items-center gap-3 animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span className="font-medium">{success}</span>
        </div>
      )}
      {error && (
        <div className="p-4 bg-rose-50 dark:bg-rose-500/10 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-500/20 rounded-xl text-sm flex items-center gap-3 animate-in fade-in">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span className="font-medium">{error}</span>
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
          {/* TAB: CLASSROOMS */}
          {currentTab === 'classrooms' && (
            <div className="bg-white dark:bg-[#1e293b] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-2">
              <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/20">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <School className="w-4 h-4 text-blue-500" />
                  បញ្ជីថ្នាក់រៀនសរុប ({classrooms.length} ថ្នាក់)
                </h3>
                <button
                  onClick={() => setIsClassModalOpen(true)}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all active:scale-95"
                >
                  <Plus className="w-4 h-4" />
                  បង្កើតថ្នាក់ថ្មី
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-5">
                {classrooms.map((c) => (
                  <div key={c.id} className="p-4 rounded-xl bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 hover:shadow-md hover:border-blue-300 dark:hover:border-blue-700 transition-all flex flex-col justify-between group">
                    <div>
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400 border border-blue-100 dark:border-blue-500/20">
                          កម្រិតទី {c.grade_level || '12'}
                        </span>
                        <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                          {c.stream === 'science' ? 'វិទ្យាសាស្ត្រ' : c.stream === 'social_science' ? 'សង្គម' : 'ទូទៅ'}
                        </span>
                      </div>
                      <h4 className="text-lg font-bold text-slate-800 dark:text-white mt-1">
                        {c.name || `ថ្នាក់ ${c.grade_level}`}
                      </h4>
                      <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        បន្ទប់: <span className="font-mono font-semibold">{c.room_number || '101'}</span>
                      </div>
                    </div>
                    <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700/50 flex justify-between items-center">
                      <span className="text-[11px] font-medium text-slate-400">សិស្ស: ៣៥ នាក់</span>
                      <button
                        onClick={() => handleDeleteClassroom(c.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors opacity-0 group-hover:opacity-100"
                        title="លុបថ្នាក់"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: SUBJECTS */}
          {currentTab === 'subjects' && (
            <div className="bg-white dark:bg-[#1e293b] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-2">
              <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/20">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-emerald-500" />
                  មុខវិជ្ជាបង្រៀន ({subjects.length} មុខវិជ្ជា)
                </h3>
                <button
                  onClick={() => setIsSubjectModalOpen(true)}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all active:scale-95"
                >
                  <Plus className="w-4 h-4" />
                  បន្ថែមមុខវិជ្ជា
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 dark:bg-slate-900/50 text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase border-b border-slate-200 dark:border-slate-800">
                    <tr>
                      <th className="px-5 py-3">កូដមុខវិជ្ជា</th>
                      <th className="px-5 py-3">ឈ្មោះមុខវិជ្ជា</th>
                      <th className="px-5 py-3 text-center">មេគុណ</th>
                      <th className="px-5 py-3">កម្រិតថ្នាក់</th>
                      <th className="px-5 py-3 text-right">សកម្មភាព</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                    {subjects.map((s) => (
                      <tr key={s.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 group transition-colors">
                        <td className="px-5 py-3 font-mono font-bold text-xs text-blue-600 dark:text-blue-400">
                          {s.code || `SUB-${s.id}`}
                        </td>
                        <td className="px-5 py-3 font-semibold text-slate-800 dark:text-white">
                          {s.name_km || s.name}
                        </td>
                        <td className="px-5 py-3 text-center">
                          <span className="inline-flex px-2 py-0.5 rounded-md text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20">
                            x{s.coefficient || 2}
                          </span>
                        </td>
                        <td className="px-5 py-3 text-slate-600 dark:text-slate-400">
                          ថ្នាក់ទី {s.grade_level || 12}
                        </td>
                        <td className="px-5 py-3 text-right">
                          <button
                            onClick={() => handleDeleteSubject(s.id)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors opacity-0 group-hover:opacity-100"
                            title="លុបមុខវិជ្ជា"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB: ACADEMIC YEARS */}
          {currentTab === 'academic-years' && (
            <div className="bg-white dark:bg-[#1e293b] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-2">
              <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/20">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-violet-500" />
                  បញ្ជីឆ្នាំសិក្សា
                </h3>
                <button
                  onClick={() => setIsYearModalOpen(true)}
                  className="px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all active:scale-95"
                >
                  <Plus className="w-4 h-4" />
                  បង្កើតឆ្នាំថ្មី
                </button>
              </div>
              <div className="p-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {academicYears.map((y) => (
                  <div key={y.id} className="p-4 rounded-xl bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 flex flex-col justify-between group hover:shadow-md transition-all">
                    <div>
                      <div className="flex justify-between items-start">
                        <span className="text-base font-bold text-slate-800 dark:text-white">{y.name || y.year}</span>
                        {y.is_current ? (
                          <span className="text-[10px] bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-md font-bold border border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20">
                            កំពុងដំណើរការ
                          </span>
                        ) : (
                          <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-md border border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700">
                            បញ្ចប់
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-slate-500 mt-2 flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5" />
                        {y.start_date || '01-11-2025'} ដល់ {y.end_date || '31-08-2026'}
                      </div>
                    </div>
                    <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700/50 flex justify-end">
                      <button
                        onClick={() => handleDeleteYear(y.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors opacity-0 group-hover:opacity-100"
                        title="លុបឆ្នាំសិក្សា"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: SECTIONS */}
          {currentTab === 'sections' && (
            <div className="bg-white dark:bg-[#1e293b] rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm animate-in fade-in slide-in-from-bottom-2">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <Layers className="w-4 h-4 text-orange-500" />
                វេនសិក្សា និងបន្ទប់រៀន
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                  <div className="text-sm font-bold text-blue-600 dark:text-blue-400 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                    វេនពេលព្រឹក (Morning Shift)
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 mt-2">ម៉ោង 07:00 AM - 11:15 AM • ថ្នាក់ទី ១១ និង ១២</div>
                  <div className="text-xs font-semibold text-slate-700 dark:text-slate-300 mt-3 bg-white dark:bg-slate-900 p-2 rounded-lg border border-slate-200 dark:border-slate-700 inline-block">
                    សរុប ១៦ ថ្នាក់ (11A-H, 12A-H)
                  </div>
                </div>
                <div className="p-5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                  <div className="text-sm font-bold text-amber-600 dark:text-amber-400 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                    វេនពេលរសៀល (Afternoon Shift)
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 mt-2">ម៉ោង 01:00 PM - 05:15 PM • ថ្នាក់ទី ១០</div>
                  <div className="text-xs font-semibold text-slate-700 dark:text-slate-300 mt-3 bg-white dark:bg-slate-900 p-2 rounded-lg border border-slate-200 dark:border-slate-700 inline-block">
                    សរុប ៨ ថ្នាក់ (10A-H)
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* ═══════════ MODALS ═══════════ */}

      {/* Modal: Create Classroom */}
      {isClassModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm font-khmer animate-in fade-in duration-200">
          <div className="bg-white dark:bg-[#1e293b] rounded-2xl w-full max-w-md border border-slate-200 dark:border-slate-800 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center px-6 py-4 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <School className="w-5 h-5 text-blue-500" />
                បង្កើតថ្នាក់រៀនថ្មី
              </h3>
              <button onClick={() => setIsClassModalOpen(false)} className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleCreateClassroom} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">ឈ្មោះថ្នាក់រៀន</label>
                <input
                  type="text" required placeholder="ឧទាហរណ៍: 12C"
                  value={newClass.name} onChange={(e) => setNewClass({ ...newClass, name: e.target.value })}
                  className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">កម្រិតថ្នាក់</label>
                  <select
                    value={newClass.grade_level} onChange={(e) => setNewClass({ ...newClass, grade_level: Number(e.target.value) })}
                    className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  >
                    <option value={10}>ថ្នាក់ទី ១០</option>
                    <option value={11}>ថ្នាក់ទី ១១</option>
                    <option value={12}>ថ្នាក់ទី ១២</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">ផ្នែក/ជំនាញ</label>
                  <select
                    value={newClass.stream} onChange={(e) => setNewClass({ ...newClass, stream: e.target.value })}
                    className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  >
                    <option value="science">វិទ្យាសាស្ត្រ</option>
                    <option value="social_science">វិទ្យាសាស្ត្រសង្គម</option>
                    <option value="none">ទូទៅ</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">លេខបន្ទប់</label>
                <input
                  type="text" value={newClass.room_number} onChange={(e) => setNewClass({ ...newClass, room_number: e.target.value })}
                  className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                />
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800 mt-6">
                <button type="button" onClick={() => setIsClassModalOpen(false)} className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl font-semibold transition-colors">បោះបង់</button>
                <button type="submit" className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold flex items-center gap-2 shadow-sm shadow-blue-500/20 transition-all active:scale-95">
                  <Save className="w-4 h-4" /> រក្សាទុក
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Create Subject */}
      {isSubjectModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm font-khmer animate-in fade-in duration-200">
          <div className="bg-white dark:bg-[#1e293b] rounded-2xl w-full max-w-md border border-slate-200 dark:border-slate-800 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center px-6 py-4 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-emerald-500" />
                បន្ថែមមុខវិជ្ជាថ្មី
              </h3>
              <button onClick={() => setIsSubjectModalOpen(false)} className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleCreateSubject} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">ឈ្មោះមុខវិជ្ជា</label>
                <input
                  type="text" required placeholder="ឧទាហរណ៍: ព័ត៌មានវិទ្យា (ICT)"
                  value={newSubject.name} onChange={(e) => setNewSubject({ ...newSubject, name: e.target.value })}
                  className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">កូដមុខវិជ្ជា</label>
                  <input
                    type="text" required placeholder="ICT"
                    value={newSubject.code} onChange={(e) => setNewSubject({ ...newSubject, code: e.target.value.toUpperCase() })}
                    className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">មេគុណពិន្ទុ</label>
                  <input
                    type="number" min="1" max="5"
                    value={newSubject.coefficient} onChange={(e) => setNewSubject({ ...newSubject, coefficient: Number(e.target.value) })}
                    className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800 mt-6">
                <button type="button" onClick={() => setIsSubjectModalOpen(false)} className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl font-semibold transition-colors">បោះបង់</button>
                <button type="submit" className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold flex items-center gap-2 shadow-sm shadow-emerald-500/20 transition-all active:scale-95">
                  <Save className="w-4 h-4" /> រក្សាទុក
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Create Academic Year */}
      {isYearModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm font-khmer animate-in fade-in duration-200">
          <div className="bg-white dark:bg-[#1e293b] rounded-2xl w-full max-w-md border border-slate-200 dark:border-slate-800 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center px-6 py-4 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <Calendar className="w-5 h-5 text-violet-500" />
                បង្កើតឆ្នាំសិក្សាថ្មី
              </h3>
              <button onClick={() => setIsYearModalOpen(false)} className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleCreateYear} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">ឈ្មោះឆ្នាំសិក្សា</label>
                <input
                  type="text" required placeholder="2026-2027"
                  value={newYear.name} onChange={(e) => setNewYear({ ...newYear, name: e.target.value })}
                  className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">ថ្ងៃចាប់ផ្តើម</label>
                  <input
                    type="date" required
                    value={newYear.start_date} onChange={(e) => setNewYear({ ...newYear, start_date: e.target.value })}
                    className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">ថ្ងៃបញ្ចប់</label>
                  <input
                    type="date" required
                    value={newYear.end_date} onChange={(e) => setNewYear({ ...newYear, end_date: e.target.value })}
                    className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all"
                  />
                </div>
              </div>
              <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-700">
                <input
                  type="checkbox" id="is_current"
                  checked={newYear.is_current} onChange={(e) => setNewYear({ ...newYear, is_current: e.target.checked })}
                  className="w-4 h-4 rounded text-violet-600 focus:ring-violet-500"
                />
                <label htmlFor="is_current" className="text-sm font-medium text-slate-700 dark:text-slate-300 cursor-pointer">
                  កំណត់ជាឆ្នាំសិក្សាដែលកំពុងដំណើរការ
                </label>
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800 mt-6">
                <button type="button" onClick={() => setIsYearModalOpen(false)} className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl font-semibold transition-colors">បោះបង់</button>
                <button type="submit" className="px-5 py-2.5 bg-violet-600 hover:bg-violet-700 text-white rounded-xl font-semibold flex items-center gap-2 shadow-sm shadow-violet-500/20 transition-all active:scale-95">
                  <Save className="w-4 h-4" /> រក្សាទុក
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Academics;