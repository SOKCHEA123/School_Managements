import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  PenLine, List, Lock, Download, Search, Save, Unlock,
  CheckCircle2, AlertCircle, Users, BookOpen, Clock, ShieldAlert
} from 'lucide-react';
import API from '../../services/api';
import { useApp } from '../../context/AppContext';

const Grades = () => {
  const [searchParams] = useSearchParams();
  const initialTab = searchParams.get('tab') || 'batch';
  const [activeTab, setActiveTab] = useState(initialTab); // 'batch', 'list', 'lock'
  const { lang } = useApp();

  // Master Data
  const [classrooms, setClassrooms] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [academicYears, setAcademicYears] = useState([]);
  const [loadingMaster, setLoadingMaster] = useState(true);

  // Tab 1: Batch Input State
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedSemester, setSelectedSemester] = useState('semester_1');
  const [selectedMonth, setSelectedMonth] = useState('1');
  const [classStudents, setClassStudents] = useState([]);
  const [scores, setScores] = useState({});
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [savingBatch, setSavingBatch] = useState(false);
  const [batchMessage, setBatchMessage] = useState({ type: '', text: '' });

  // Tab 2: Grade List State
  const [gradesList, setGradesList] = useState([]);
  const [filterClass, setFilterClass] = useState('');
  const [filterSubject, setFilterSubject] = useState('');
  const [filterYear, setFilterYear] = useState('');
  const [filterMonth, setFilterMonth] = useState('');
  const [loadingGrades, setLoadingGrades] = useState(false);

  // Tab 3: Lock State
  const [lockYear, setLockYear] = useState('');
  const [lockMonth, setLockMonth] = useState('1');
  const [lockClass, setLockClass] = useState('');
  const [locking, setLocking] = useState(false);
  const [lockMessage, setLockMessage] = useState({ type: '', text: '' });

  // Fetch Master Data
  useEffect(() => {
    const fetchMasterData = async () => {
      setLoadingMaster(true);
      try {
        const [cRes, sRes, yRes] = await Promise.all([
          API.get('/admin/classrooms'),
          API.get('/admin/subjects'),
          API.get('/admin/academic-years'),
        ]);

        const cData = cRes.data?.data || cRes.data || [];
        const sData = sRes.data?.data || sRes.data || [];
        const yData = yRes.data?.data || yRes.data || [];

        setClassrooms(cData);
        setSubjects(sData);
        setAcademicYears(yData);

        if (cData.length > 0) setSelectedClass(cData[0].id.toString());
        if (sData.length > 0) setSelectedSubject(sData[0].id.toString());
        if (yData.length > 0) {
          setSelectedYear(yData[0].id.toString());
          setLockYear(yData[0].id.toString());
        }
      } catch (err) {
        console.error('Failed to load master data', err);
      } finally {
        setLoadingMaster(false);
      }
    };
    fetchMasterData();
  }, []);

  // Fetch Students for Batch Input
  const handleLoadStudentsForBatch = async () => {
    if (!selectedClass) {
      setBatchMessage({ type: 'error', text: 'សូមជ្រើសរើសថ្នាក់រៀនជាមុនសិន!' });
      return;
    }
    setLoadingStudents(true);
    setBatchMessage({ type: '', text: '' });
    try {
      const res = await API.get('/admin/students', {
        params: { classroom_id: selectedClass }
      });
      const list = res.data?.data || (Array.isArray(res.data) ? res.data : []);
      setClassStudents(list);

      const initialScores = {};
      list.forEach((st) => { initialScores[st.id] = ''; });
      setScores(initialScores);

      if (list.length === 0) {
        setBatchMessage({ type: 'info', text: 'មិនមានសិស្សក្នុងថ្នាក់រៀននេះទេ' });
      }
    } catch (err) {
      setBatchMessage({
        type: 'error',
        text: err.response?.data?.message || 'មិនអាចទាញយកបញ្ជីសិស្សបានទេ'
      });
    } finally {
      setLoadingStudents(false);
    }
  };

  const handleScoreChange = (studentId, val) => {
    setScores((prev) => ({ ...prev, [studentId]: val }));
  };

  // Submit Batch Grades
  const handleSubmitBatch = async (e) => {
    e.preventDefault();
    if (classStudents.length === 0) {
      setBatchMessage({ type: 'error', text: 'មិនមានសិស្សដើម្បីបញ្ចូលពិន្ទុទេ!' });
      return;
    }

    const gradesPayload = [];
    for (const st of classStudents) {
      const scoreVal = scores[st.id];
      if (scoreVal === '' || scoreVal === undefined || scoreVal === null) continue; 
      
      const num = parseFloat(scoreVal);
      if (isNaN(num) || num < 0 || num > 100) {
        setBatchMessage({
          type: 'error',
          text: `ពិន្ទុរបស់សិស្ស ${st.full_name_km || st.student_code} មិនត្រឹមត្រូវ (ត្រូវចន្លោះពី 0 ដល់ 100)`
        });
        return;
      }
      gradesPayload.push({ student_id: st.id, score: num });
    }

    if (gradesPayload.length === 0) {
      setBatchMessage({ type: 'error', text: 'សូមបញ្ចូលពិន្ទុយ៉ាងហោចណាស់សិស្សម្នាក់!' });
      return;
    }

    setSavingBatch(true);
    setBatchMessage({ type: '', text: '' });
    try {
      const res = await API.post('/admin/grades/batch', {
        classroom_id: parseInt(selectedClass, 10),
        subject_id: parseInt(selectedSubject, 10),
        academic_year_id: parseInt(selectedYear, 10),
        month: parseInt(selectedMonth, 10),
        semester: selectedSemester,
        grades: gradesPayload,
      });

      setBatchMessage({
        type: 'success',
        text: res.data?.message || `រក្សាទុកពិន្ទុសិស្ស ${gradesPayload.length} នាក់បានជោគជ័យ!`
      });
    } catch (err) {
      setBatchMessage({
        type: 'error',
        text: err.response?.data?.message || 'បរាជ័យក្នុងការរក្សាទុកពិន្ទុ'
      });
    } finally {
      setSavingBatch(false);
    }
  };

  // Fetch Grades List (Tab 2)
  const fetchGradesList = useCallback(async () => {
    setLoadingGrades(true);
    try {
      const params = {};
      if (filterClass) params.classroom_id = filterClass;
      if (filterSubject) params.subject_id = filterSubject;
      if (filterYear) params.academic_year_id = filterYear;
      if (filterMonth) params.month = filterMonth;

      const res = await API.get('/admin/grades', { params });
      const data = res.data?.data || (Array.isArray(res.data) ? res.data : []);
      setGradesList(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingGrades(false);
    }
  }, [filterClass, filterSubject, filterYear, filterMonth]);

  useEffect(() => {
    if (activeTab === 'list') {
      fetchGradesList();
    }
  }, [activeTab, fetchGradesList]);

  // Submit Lock Grades (Tab 3)
  const handleLockGrades = async (e) => {
    e.preventDefault();
    if (!window.confirm('តើអ្នកប្រាកដជាចង់ចាក់សោពិន្ទុសម្រាប់ខែនេះមែនទេ? នៅពេលចាក់សោរួច នឹងមិនអាចកែប្រែបានទៀតទេ។')) return;

    setLocking(true);
    setLockMessage({ type: '', text: '' });
    try {
      const payload = {
        academic_year_id: parseInt(lockYear, 10),
        month: parseInt(lockMonth, 10),
      };
      if (lockClass) payload.classroom_id = parseInt(lockClass, 10);

      const res = await API.post('/admin/grades/lock', payload);
      setLockMessage({
        type: 'success',
        text: res.data?.message || `ចាក់សោពិន្ទុជោគជ័យ! (${res.data?.locked_records || 0} កំណត់ត្រា)`
      });
    } catch (err) {
      setLockMessage({
        type: 'error',
        text: err.response?.data?.message || 'មិនអាចចាក់សោពិន្ទុបានទេ'
      });
    } finally {
      setLocking(false);
    }
  };

  const months = [
    { id: 1, name: 'មករា (Jan)' }, { id: 2, name: 'កុម្ភៈ (Feb)' },
    { id: 3, name: 'មីនា (Mar)' }, { id: 4, name: 'មេសា (Apr)' },
    { id: 5, name: 'ឧសភា (May)' }, { id: 6, name: 'មិថុនា (Jun)' },
    { id: 7, name: 'កក្កដា (Jul)' }, { id: 8, name: 'សីហា (Aug)' },
    { id: 9, name: 'កញ្ញា (Sep)' }, { id: 10, name: 'តុលា (Oct)' },
    { id: 11, name: 'វិច្ឆិកា (Nov)' }, { id: 12, name: 'ធ្នូ (Dec)' },
  ];

  return (
    <div className="space-y-6 font-khmer transition-colors duration-200">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          គ្រប់គ្រងពិន្ទុសិស្ស (Grades Management)
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          បញ្ចូលពិន្ទុតាមថ្នាក់ មើលបញ្ជីពិន្ទុ និងចាក់សោពិន្ទុប្រចាំខែ
        </p>
      </div>

      {/* Tabs Navigation */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 dark:border-slate-800 pb-4">
        <button
          onClick={() => setActiveTab('batch')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
            activeTab === 'batch'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
              : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700'
          }`}
        >
          <PenLine className={`w-4 h-4 ${activeTab === 'batch' ? 'text-blue-200' : 'text-blue-500'}`} />
          បញ្ចូលពិន្ទុជាក្រុម
        </button>
        <button
          onClick={() => setActiveTab('list')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
            activeTab === 'list'
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/20'
              : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700'
          }`}
        >
          <List className={`w-4 h-4 ${activeTab === 'list' ? 'text-emerald-200' : 'text-emerald-500'}`} />
          បញ្ជីពិន្ទុ
        </button>
        <button
          onClick={() => setActiveTab('lock')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
            activeTab === 'lock'
              ? 'bg-rose-600 text-white shadow-md shadow-rose-500/20'
              : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700'
          }`}
        >
          <Lock className={`w-4 h-4 ${activeTab === 'lock' ? 'text-rose-200' : 'text-rose-500'}`} />
          ចាក់សោពិន្ទុ
        </button>
      </div>

      {loadingMaster ? (
        <div className="py-20 text-center flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm text-slate-500">កំពុងទាញយកទិន្នន័យចាំបាច់...</p>
        </div>
      ) : (
        <>
          {/* TAB 1: BATCH GRADE INPUT */}
          {activeTab === 'batch' && (
            <div className="space-y-5 animate-in fade-in slide-in-from-bottom-2 duration-300">
              {/* Filter Selector Card */}
              <div className="bg-white dark:bg-[#1e293b] p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <h3 className="text-sm font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-blue-500" />
                  ជ្រើសរើសព័ត៌មានថ្នាក់ និងមុខវិជ្ជា
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">ឆ្នាំសិក្សា</label>
                    <select value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)} className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500">
                      {academicYears.map((y) => <option key={y.id} value={y.id}>{y.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">ថ្នាក់រៀន</label>
                    <select value={selectedClass} onChange={(e) => setSelectedClass(e.target.value)} className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500">
                      {classrooms.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">មុខវិជ្ជា</label>
                    <select value={selectedSubject} onChange={(e) => setSelectedSubject(e.target.value)} className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500">
                      {subjects.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">ឆមាស</label>
                    <select value={selectedSemester} onChange={(e) => setSelectedSemester(e.target.value)} className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500">
                      <option value="semester_1">ឆមាសទី ១</option>
                      <option value="semester_2">ឆមាសទី ២</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">ខែ</label>
                    <select value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)} className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500">
                      {months.map((m) => <option key={m.id} value={m.id}>ខែ {m.id} - {m.name}</option>)}
                    </select>
                  </div>
                </div>
                <div className="mt-5 flex justify-end">
                  <button
                    onClick={handleLoadStudentsForBatch}
                    disabled={loadingStudents}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-sm active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Download className="w-4 h-4" />
                    {loadingStudents ? 'កំពុងទាញយក...' : 'ទាញយកបញ្ជីសិស្ស'}
                  </button>
                </div>
              </div>

              {/* Alerts */}
              {batchMessage.text && (
                <div className={`p-4 rounded-xl text-sm flex items-start gap-3 border ${
                  batchMessage.type === 'success' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                  batchMessage.type === 'error' ? 'bg-rose-50 text-rose-700 border-rose-200' :
                  'bg-blue-50 text-blue-700 border-blue-200'
                }`}>
                  {batchMessage.type === 'success' ? <CheckCircle2 className="w-5 h-5 shrink-0" /> : <AlertCircle className="w-5 h-5 shrink-0" />}
                  <span className="font-medium">{batchMessage.text}</span>
                </div>
              )}

              {/* Students Table */}
              {classStudents.length > 0 && (
                <form onSubmit={handleSubmitBatch} className="bg-white dark:bg-[#1e293b] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                  <div className="p-4 bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
                    <div className="font-semibold text-sm text-slate-800 dark:text-white flex items-center gap-2">
                      <Users className="w-4 h-4 text-slate-500" />
                      បញ្ជីសិស្សសរុប: <span className="text-blue-600 dark:text-blue-400">{classStudents.length}</span> នាក់
                    </div>
                    <div className="text-xs text-slate-500">* ពិន្ទុអតិបរមា: 100</div>
                  </div>
                  
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                      <thead className="bg-slate-50/75 dark:bg-slate-900/50 text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase border-b border-slate-200 dark:border-slate-800">
                        <tr>
                          <th className="px-5 py-3">ល.រ</th>
                          <th className="px-5 py-3">អត្តលេខ</th>
                          <th className="px-5 py-3">ឈ្មោះខ្មែរ</th>
                          <th className="px-5 py-3">ឈ្មោះឡាតាំង</th>
                          <th className="px-5 py-3">ភេទ</th>
                          <th className="px-5 py-3 w-[150px]">ពិន្ទុ (0-100)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                        {classStudents.map((st, idx) => (
                          <tr key={st.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40">
                            <td className="px-5 py-3 text-slate-500">{idx + 1}</td>
                            <td className="px-5 py-3 font-mono text-xs font-bold text-blue-600 dark:text-blue-400">{st.student_code}</td>
                            <td className="px-5 py-3 font-bold text-slate-800 dark:text-slate-200">{st.full_name_km || '—'}</td>
                            <td className="px-5 py-3 text-slate-500">{st.full_name_en || '—'}</td>
                            <td className="px-5 py-3">
                              <span className={`inline-flex px-2 py-0.5 rounded-md text-xs font-semibold ${
                                st.gender === 'F' ? 'bg-rose-100 text-rose-700' : 'bg-blue-100 text-blue-700'
                              }`}>
                                {st.gender === 'F' ? 'ស្រី' : 'ប្រុស'}
                              </span>
                            </td>
                            <td className="px-5 py-3">
                              <input
                                type="number" step="0.01" min="0" max="100" placeholder="0 - 100"
                                value={scores[st.id] !== undefined ? scores[st.id] : ''}
                                onChange={(e) => handleScoreChange(st.id, e.target.value)}
                                className="w-full px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg text-sm font-bold text-slate-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                              />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="p-4 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-200 dark:border-slate-800 flex justify-end">
                    <button
                      type="submit" disabled={savingBatch}
                      className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-sm active:scale-95 disabled:opacity-50"
                    >
                      <Save className="w-4 h-4" />
                      {savingBatch ? 'កំពុងរក្សាទុក...' : 'រក្សាទុកពិន្ទុទាំងអស់'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* TAB 2: VIEW GRADES LIST */}
          {activeTab === 'list' && (
            <div className="space-y-5 animate-in fade-in slide-in-from-bottom-2 duration-300">
              {/* Filter Bar */}
              <div className="bg-white dark:bg-[#1e293b] p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">ថ្នាក់រៀន</label>
                  <select value={filterClass} onChange={(e) => setFilterClass(e.target.value)} className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm">
                    <option value="">-- គ្រប់ថ្នាក់ --</option>
                    {classrooms.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">មុខវិជ្ជា</label>
                  <select value={filterSubject} onChange={(e) => setFilterSubject(e.target.value)} className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm">
                    <option value="">-- គ្រប់មុខវិជ្ជា --</option>
                    {subjects.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">ខែ</label>
                  <select value={filterMonth} onChange={(e) => setFilterMonth(e.target.value)} className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm">
                    <option value="">-- គ្រប់ខែ --</option>
                    {months.map((m) => <option key={m.id} value={m.id}>ខែ {m.id}</option>)}
                  </select>
                </div>
                <div>
                  <button onClick={fetchGradesList} className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold transition-all">
                    <Search className="w-4 h-4" /> ស្វែងរក
                  </button>
                </div>
              </div>

              {/* Table */}
              <div className="bg-white dark:bg-[#1e293b] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50/75 dark:bg-slate-900/50 text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase border-b border-slate-200 dark:border-slate-800">
                      <tr>
                        <th className="px-5 py-3">ល.រ</th>
                        <th className="px-5 py-3">អត្តលេខ</th>
                        <th className="px-5 py-3">សិស្ស</th>
                        <th className="px-5 py-3">មុខវិជ្ជា</th>
                        <th className="px-5 py-3">ឆមាស</th>
                        <th className="px-5 py-3">ខែ</th>
                        <th className="px-5 py-3">ពិន្ទុ</th>
                        <th className="px-5 py-3">ស្ថានភាព</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                      {loadingGrades ? (
                        <tr>
                          <td colSpan="8" className="text-center py-10 text-slate-500">កំពុងទាញយកទិន្នន័យ...</td>
                        </tr>
                      ) : gradesList.length === 0 ? (
                        <tr>
                          <td colSpan="8" className="text-center py-10 text-slate-500">មិនទាន់មានទិន្នន័យពិន្ទុទេ</td>
                        </tr>
                      ) : (
                        gradesList.map((g, idx) => (
                          <tr key={g.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40">
                            <td className="px-5 py-3 text-slate-500">{idx + 1}</td>
                            <td className="px-5 py-3 font-mono text-xs text-blue-600 dark:text-blue-400">{g.student?.student_code || '—'}</td>
                            <td className="px-5 py-3 font-bold text-slate-800 dark:text-white">{g.student?.full_name_km || g.student?.full_name_en || '—'}</td>
                            <td className="px-5 py-3 text-slate-600 dark:text-slate-300">{g.subject?.name || '—'}</td>
                            <td className="px-5 py-3 text-slate-500">{g.semester === 'semester_1' ? 'ឆមាសទី ១' : 'ឆមាសទី ២'}</td>
                            <td className="px-5 py-3 text-slate-500">ខែ {g.month}</td>
                            <td className="px-5 py-3">
                              <span className={`font-bold text-base ${g.score >= 50 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                                {g.score}
                              </span>
                            </td>
                            <td className="px-5 py-3">
                              {g.is_locked ? (
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-100 text-rose-700 border border-rose-200">
                                  <Lock className="w-3 h-3" /> ចាក់សោ
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700 border border-emerald-200">
                                  <Unlock className="w-3 h-3" /> អាចកែប្រែ
                                </span>
                              )}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: LOCK GRADES */}
          {activeTab === 'lock' && (
            <div className="max-w-2xl animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="bg-white dark:bg-[#1e293b] p-6 rounded-2xl border border-rose-200 dark:border-rose-900/50 shadow-sm">
                <div className="flex items-start gap-4 mb-6 pb-5 border-b border-slate-100 dark:border-slate-800">
                  <div className="w-12 h-12 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
                    <ShieldAlert className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-800 dark:text-white">ចាក់សោពិន្ទុប្រចាំខែ</h3>
                    <p className="text-sm text-slate-500 mt-1">នៅពេលចាក់សោរួច គ្រូបង្រៀនមិនអាចកែប្រែពិន្ទុសម្រាប់កាលបរិច្ឆេទនេះបានឡើយ។</p>
                  </div>
                </div>

                {lockMessage.text && (
                  <div className={`p-4 rounded-xl text-sm flex items-start gap-3 border mb-5 ${
                    lockMessage.type === 'success' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-rose-50 text-rose-700 border-rose-200'
                  }`}>
                    {lockMessage.type === 'success' ? <CheckCircle2 className="w-5 h-5 shrink-0" /> : <AlertCircle className="w-5 h-5 shrink-0" />}
                    <span className="font-medium">{lockMessage.text}</span>
                  </div>
                )}

                <form onSubmit={handleLockGrades} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">ឆ្នាំសិក្សា *</label>
                      <select value={lockYear} onChange={(e) => setLockYear(e.target.value)} required className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500">
                        {academicYears.map((y) => <option key={y.id} value={y.id}>{y.name}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">ខែដែលត្រូវចាក់សោ *</label>
                      <select value={lockMonth} onChange={(e) => setLockMonth(e.target.value)} required className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500">
                        {months.map((m) => <option key={m.id} value={m.id}>ខែ {m.id} - {m.name}</option>)}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">ថ្នាក់រៀនជាក់លាក់ (ស្រេចចិត្ត)</label>
                    <select value={lockClass} onChange={(e) => setLockClass(e.target.value)} className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500">
                      <option value="">-- ចាក់សោគ្រប់ថ្នាក់ក្នុងខែនេះ --</option>
                      {classrooms.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                  </div>

                  <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                    <button
                      type="submit" disabled={locking}
                      className="w-full flex items-center justify-center gap-2 bg-rose-600 hover:bg-rose-700 text-white px-5 py-3 rounded-xl text-sm font-semibold transition-all shadow-sm active:scale-95 disabled:opacity-50"
                    >
                      <Lock className="w-4 h-4" />
                      {locking ? 'កំពុងចាក់សោ...' : 'បញ្ជាក់ការចាក់សោពិន្ទុ'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Grades;