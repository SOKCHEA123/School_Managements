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
} from 'lucide-react';
import { academicService } from '../services';
import { useApp } from '../context/AppContext';

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

  const setTab = (tab) => {
    setSearchParams({ tab });
  };

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
      const res = await academicService.createClassroom(newClass);
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
            ២. ការគ្រប់គ្រងការសិក្សា (Academic Management)
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            គ្រប់គ្រងសិស្ស គ្រូ អាណាព្យាបាល បន្ទប់រៀន មុខវិជ្ជា ឆ្នាំសិក្សា និងវេនសិក្សា
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 dark:border-gray-800 pb-3">
        {[
          { key: 'classrooms', label: 'ថ្នាក់រៀន (Classrooms)', icon: School },
          { key: 'subjects', label: 'មុខវិជ្ជា (Subjects)', icon: BookOpen },
          { key: 'academic-years', label: 'ឆ្នាំសិក្សា (Academic Years)', icon: Calendar },
          { key: 'sections', label: 'វេនសិក្សា (Sections)', icon: Layers },
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

      {/* Alerts */}
      {success && (
        <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60 rounded-xl text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
          <span>{success}</span>
        </div>
      )}
      {error && (
        <div className="p-3 bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800/60 rounded-xl text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {loading && (
        <div className="py-12 text-center text-slate-400 text-xs">កំពុងដំណើរការទាញយកទិន្នន័យ...</div>
      )}

      {/* TAB: CLASSROOMS */}
      {!loading && currentTab === 'classrooms' && (
        <div className="bg-white dark:bg-[#1e293b] rounded-2xl border border-slate-200 dark:border-gray-800 overflow-hidden shadow-xs">
          <div className="p-4 bg-slate-100 dark:bg-[#252d52] border-b border-slate-200 dark:border-gray-800 flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-900 dark:text-white">
              បញ្ជីថ្នាក់រៀនសរុប ({classrooms.length} ថ្នាក់)
            </h3>
            <button
              onClick={() => setIsClassModalOpen(true)}
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>បង្កើតថ្នាក់ថ្មី</span>
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-5">
            {classrooms.map((c) => (
              <div key={c.id} className="p-4 rounded-xl bg-slate-50 dark:bg-[#252d52] border border-slate-200 dark:border-[#333d6d] shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400">
                      កម្រិតទី {c.grade_level || '12'}
                    </span>
                    <span className="text-xs font-mono font-bold text-emerald-400">
                      {c.stream || 'វិទ្យាសាស្ត្រ'}
                    </span>
                  </div>
                  <h4 className="text-base font-bold text-slate-900 dark:text-white mt-1">
                    {c.name || `ថ្នាក់ ${c.grade_level}`}
                  </h4>
                  <div className="text-xs text-slate-400 mt-2">
                    បន្ទប់: <span className="font-mono text-slate-200">{c.room_number || '101'}</span>
                  </div>
                </div>
                <div className="mt-4 pt-2 border-t border-slate-200 dark:border-gray-700/50 flex justify-between items-center text-[11px] text-slate-400">
                  <span>សិស្ស: 35 នាក់</span>
                  <button
                    onClick={() => handleDeleteClassroom(c.id)}
                    className="text-red-400 hover:text-red-500 p-1"
                    title="លុបថ្នាក់"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB: SUBJECTS */}
      {!loading && currentTab === 'subjects' && (
        <div className="bg-white dark:bg-[#1e293b] rounded-2xl border border-slate-200 dark:border-gray-800 overflow-hidden shadow-xs">
          <div className="p-4 bg-slate-100 dark:bg-[#252d52] border-b border-slate-200 dark:border-gray-800 flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-900 dark:text-white">
              មុខវិជ្ជាបង្រៀនតាមកម្មវិធីសិក្សាជាតិ ({subjects.length} មុខវិជ្ជា)
            </h3>
            <button
              onClick={() => setIsSubjectModalOpen(true)}
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>បន្ថែមមុខវិជ្ជា</span>
            </button>
          </div>
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-[#1b213b] font-bold">
              <tr>
                <th className="p-3">កូដមុខវិជ្ជា</th>
                <th className="p-3">ឈ្មោះមុខវិជ្ជា</th>
                <th className="p-3">មេគុណ</th>
                <th className="p-3">កម្រិតថ្នាក់</th>
                <th className="p-3 text-center">សកម្មភាព</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-gray-800">
              {subjects.map((s) => (
                <tr key={s.id} className="hover:bg-slate-50 dark:hover:bg-[#252d52]/50">
                  <td className="p-3 font-mono font-bold text-blue-500">{s.code || `SUB-${s.id}`}</td>
                  <td className="p-3 font-bold text-slate-900 dark:text-white">{s.name_km || s.name}</td>
                  <td className="p-3 font-mono font-bold text-emerald-400">{s.coefficient || 2}</td>
                  <td className="p-3 font-semibold text-slate-400">ថ្នាក់ទី {s.grade_level || 12}</td>
                  <td className="p-3 text-center">
                    <button
                      onClick={() => handleDeleteSubject(s.id)}
                      className="text-red-400 hover:text-red-500 p-1"
                      title="លុបមុខវិជ្ជា"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* TAB: ACADEMIC YEARS */}
      {!loading && currentTab === 'academic-years' && (
        <div className="bg-white dark:bg-[#1e293b] rounded-2xl border border-slate-200 dark:border-gray-800 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              បញ្ជីឆ្នាំសិក្សា (Academic Years)
            </h3>
            <button
              onClick={() => setIsYearModalOpen(true)}
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>បង្កើតឆ្នាំសិក្សាថ្មី</span>
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {academicYears.map((y) => (
              <div key={y.id} className="p-4 rounded-xl bg-slate-50 dark:bg-[#252d52] border border-slate-200 dark:border-[#333d6d] flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-bold text-slate-900 dark:text-white">{y.name || y.year}</span>
                    {y.is_current ? (
                      <span className="text-[10px] bg-emerald-500/15 text-emerald-400 px-2 py-0.5 rounded-full font-bold">
                        កំពុងដំណើរការ
                      </span>
                    ) : (
                      <span className="text-[10px] bg-slate-500/15 text-slate-400 px-2 py-0.5 rounded-full">
                        ចាស់
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-slate-400 mt-2">
                    កាលបរិច្ឆេទ: {y.start_date || '01-11-2025'} ដល់ {y.end_date || '31-08-2026'}
                  </div>
                </div>
                <div className="mt-4 pt-2 border-t border-slate-200 dark:border-gray-700/40 flex justify-end">
                  <button
                    onClick={() => handleDeleteYear(y.id)}
                    className="text-red-400 hover:text-red-500 p-1"
                    title="លុបឆ្នាំសិក្សា"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB: SECTIONS */}
      {!loading && currentTab === 'sections' && (
        <div className="bg-white dark:bg-[#1e293b] rounded-2xl border border-slate-200 dark:border-gray-800 p-6 shadow-xs space-y-4">
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            វេនសិក្សា និងបន្ទប់រៀន (Class Sections & Shifts)
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#252d52] border border-slate-200 dark:border-[#333d6d]">
              <div className="text-sm font-bold text-blue-400">វេនពេលព្រឹក (Morning Shift)</div>
              <div className="text-slate-400 mt-1">ម៉ោង 07:00 AM - 11:15 AM • ថ្នាក់ទី ១១ និង ១២</div>
              <div className="text-emerald-400 font-bold mt-2">សរុប ១៦ ថ្នាក់ (11A-H, 12A-H)</div>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#252d52] border border-slate-200 dark:border-[#333d6d]">
              <div className="text-sm font-bold text-amber-400">វេនពេលរសៀល (Afternoon Shift)</div>
              <div className="text-slate-400 mt-1">ម៉ោង 01:00 PM - 05:15 PM • ថ្នាក់ទី ១០</div>
              <div className="text-emerald-400 font-bold mt-2">សរុប ៨ ថ្នាក់ (10A-H)</div>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Create Classroom */}
      {isClassModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs font-khmer">
          <div className="bg-white dark:bg-[#1e293b] rounded-2xl w-full max-w-md p-6 border border-slate-200 dark:border-gray-800">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100 dark:border-gray-800">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">បង្កើតថ្នាក់រៀនថ្មី</h3>
              <button onClick={() => setIsClassModalOpen(false)} className="text-slate-400 hover:text-slate-200"><X className="w-4 h-4" /></button>
            </div>
            <form onSubmit={handleCreateClassroom} className="space-y-4 mt-4 text-xs">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 mb-1">ឈ្មោះថ្នាក់រៀន</label>
                <input
                  type="text"
                  required
                  placeholder="ឧទាហរណ៍: 12C"
                  value={newClass.name}
                  onChange={(e) => setNewClass({ ...newClass, name: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 mb-1">កម្រិតថ្នាក់</label>
                  <select
                    value={newClass.grade_level}
                    onChange={(e) => setNewClass({ ...newClass, grade_level: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                  >
                    <option value={10}>ថ្នាក់ទី ១០</option>
                    <option value={11}>ថ្នាក់ទី ១១</option>
                    <option value={12}>ថ្នាក់ទី ១២</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 mb-1">ផ្នែក/ជំនាញ</label>
                  <select
                    value={newClass.stream}
                    onChange={(e) => setNewClass({ ...newClass, stream: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                  >
                    <option value="science">វិទ្យាសាស្ត្រ</option>
                    <option value="social_science">វិទ្យាសាស្ត្រសង្គម</option>
                    <option value="none">ទូទៅ</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-slate-700 dark:text-slate-300 mb-1">លេខបន្ទប់</label>
                <input
                  type="text"
                  value={newClass.room_number}
                  onChange={(e) => setNewClass({ ...newClass, room_number: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setIsClassModalOpen(false)} className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl">បោះបង់</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-xl font-bold">រក្សាទុក</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Create Subject */}
      {isSubjectModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs font-khmer">
          <div className="bg-white dark:bg-[#1e293b] rounded-2xl w-full max-w-md p-6 border border-slate-200 dark:border-gray-800">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100 dark:border-gray-800">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">បន្ថែមមុខវិជ្ជាថ្មី</h3>
              <button onClick={() => setIsSubjectModalOpen(false)} className="text-slate-400 hover:text-slate-200"><X className="w-4 h-4" /></button>
            </div>
            <form onSubmit={handleCreateSubject} className="space-y-4 mt-4 text-xs">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 mb-1">ឈ្មោះមុខវិជ្ជា</label>
                <input
                  type="text"
                  required
                  placeholder="ឧទាហរណ៍: ព័ត៌មានវិទ្យា (ICT)"
                  value={newSubject.name}
                  onChange={(e) => setNewSubject({ ...newSubject, name: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 mb-1">កូដមុខវិជ្ជា</label>
                  <input
                    type="text"
                    required
                    placeholder="ICT"
                    value={newSubject.code}
                    onChange={(e) => setNewSubject({ ...newSubject, code: e.target.value.toUpperCase() })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 mb-1">មេគុណពិន្ទុ</label>
                  <input
                    type="number"
                    min="1"
                    max="5"
                    value={newSubject.coefficient}
                    onChange={(e) => setNewSubject({ ...newSubject, coefficient: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setIsSubjectModalOpen(false)} className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl">បោះបង់</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-xl font-bold">រក្សាទុក</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Create Academic Year */}
      {isYearModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs font-khmer">
          <div className="bg-white dark:bg-[#1e293b] rounded-2xl w-full max-w-md p-6 border border-slate-200 dark:border-gray-800">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100 dark:border-gray-800">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">បង្កើតឆ្នាំសិក្សាថ្មី</h3>
              <button onClick={() => setIsYearModalOpen(false)} className="text-slate-400 hover:text-slate-200"><X className="w-4 h-4" /></button>
            </div>
            <form onSubmit={handleCreateYear} className="space-y-4 mt-4 text-xs">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 mb-1">ឈ្មោះឆ្នាំសិក្សា</label>
                <input
                  type="text"
                  required
                  placeholder="2026-2027"
                  value={newYear.name}
                  onChange={(e) => setNewYear({ ...newYear, name: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 mb-1">ថ្ងៃចាប់ផ្តើម</label>
                  <input
                    type="date"
                    required
                    value={newYear.start_date}
                    onChange={(e) => setNewYear({ ...newYear, start_date: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 mb-1">ថ្ងៃបញ្ចប់</label>
                  <input
                    type="date"
                    required
                    value={newYear.end_date}
                    onChange={(e) => setNewYear({ ...newYear, end_date: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                  />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="is_current"
                  checked={newYear.is_current}
                  onChange={(e) => setNewYear({ ...newYear, is_current: e.target.checked })}
                  className="rounded text-blue-600"
                />
                <label htmlFor="is_current" className="text-slate-700 dark:text-slate-300">កំណត់ជាឆ្នាំសិក្សាដែលកំពុងដំណើរការ</label>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setIsYearModalOpen(false)} className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl">បោះបង់</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-xl font-bold">រក្សាទុក</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Academics;
