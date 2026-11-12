import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Calendar,
  CheckCircle2,
  Clock,
  UserX,
  AlertCircle,
  Save,
  Users,
  GraduationCap,
  CalendarCheck,
  FileSpreadsheet,
  Plus,
  X,
} from 'lucide-react';
import { attendanceService, academicService } from '../../services';
import { useApp } from '../../context/AppContext';

const Attendance = () => {
  const { lang } = useApp();
  const [searchParams, setSearchParams] = useSearchParams();
  const currentTab = searchParams.get('tab') || 'student';

  const [classrooms, setClassrooms] = useState([]);
  const [selectedClass, setSelectedClass] = useState(1);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [summary, setSummary] = useState(null);

  // Teacher Attendance
  const [teacherRecords, setTeacherRecords] = useState([]);
  const [isTeacherModalOpen, setIsTeacherModalOpen] = useState(false);
  const [newTeacherAtt, setNewTeacherAtt] = useState({
    teacher_id: 1,
    name: '',
    status: 'present',
    date: new Date().toISOString().split('T')[0],
    time: '07:00 AM',
  });

  // Daily & Monthly & Absent
  const [dailyData, setDailyData] = useState(null);
  const [monthlyData, setMonthlyData] = useState(null);
  const [absentLateRecords, setAbsentLateRecords] = useState([]);

  const setTab = (tab) => {
    setSearchParams({ tab });
  };

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const res = await academicService.getClassrooms();
        const list = Array.isArray(res) ? res : (res?.data || []);
        if (list && list.length > 0) {
          setClassrooms(list);
          setSelectedClass(list[0].id);
        }
      } catch (err) {
        console.warn('Using default classrooms');
      }
    };
    fetchClasses();
  }, []);

  const fetchAttendance = async () => {
    if (!selectedClass) return;
    setLoading(true);
    setMessage('');
    try {
      const [aRes, sRes] = await Promise.all([
        attendanceService.getAttendances({ classroom_id: selectedClass, date: selectedDate }),
        attendanceService.getSummary({ classroom_id: selectedClass }),
      ]);
      setRecords(aRes?.records || []);
      setSummary(sRes || null);
    } catch {
      setMessage('មិនអាចទាញយកទិន្នន័យវត្តមានបានទេ');
    } finally {
      setLoading(false);
    }
  };

  const fetchTabSpecificData = async () => {
    try {
      if (currentTab === 'teacher') {
        const res = await attendanceService.getTeachersAttendance({ date: selectedDate });
        setTeacherRecords(res?.teachers || []);
      } else if (currentTab === 'daily') {
        const res = await attendanceService.getDaily({ date: selectedDate });
        setDailyData(res);
      } else if (currentTab === 'monthly') {
        const res = await attendanceService.getMonthly();
        setMonthlyData(res);
      } else if (currentTab === 'absent-late') {
        const res = await attendanceService.getAbsentLateList({ date: selectedDate });
        setAbsentLateRecords(res?.records || []);
      }
    } catch (e) {
      console.warn('Failed loading tab data', e);
    }
  };

  useEffect(() => {
    if (currentTab === 'student') {
      fetchAttendance();
    } else {
      fetchTabSpecificData();
    }
  }, [selectedClass, selectedDate, currentTab]);

  const handleStatusChange = (studentId, status) => {
    setRecords((prev) =>
      prev.map((r) => (r.student_id === studentId ? { ...r, status } : r))
    );
  };

  const handleReasonChange = (studentId, reason) => {
    setRecords((prev) =>
      prev.map((r) => (r.student_id === studentId ? { ...r, reason } : r))
    );
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await attendanceService.storeBatch({
        classroom_id: selectedClass,
        date: selectedDate,
        attendances: records.map((r) => ({
          student_id: r.student_id,
          status: r.status,
          reason: r.reason,
        })),
      });
      setMessage('✅ បានកត់ត្រាវត្តមានដោយជោគជ័យ!');
      setTimeout(() => setMessage(''), 3500);
      fetchAttendance();
    } catch {
      setMessage('❌ បរាជ័យក្នុងការកត់ត្រាវត្តមាន');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveTeacherAttendance = async (e) => {
    e.preventDefault();
    try {
      await attendanceService.storeTeacherAttendance(newTeacherAtt);
      setMessage('✅ បានកត់ត្រាវត្តមានគ្រូដោយជោគជ័យ!');
      setIsTeacherModalOpen(false);
      fetchTabSpecificData();
      setTimeout(() => setMessage(''), 3500);
    } catch {
      setMessage('❌ បរាជ័យក្នុងការកត់ត្រាវត្តមានគ្រូ');
    }
  };

  const counts = {
    present: records.filter((r) => r.status === 'present').length,
    late: records.filter((r) => r.status === 'late').length,
    permission: records.filter((r) => r.status === 'permission').length,
    absent: records.filter((r) => r.status === 'absent').length,
  };

  return (
    <div className="space-y-6 font-khmer min-h-full transition-colors duration-200">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            ៣. ការគ្រប់គ្រងវត្តមាន (Attendance Management)
          </h1>
          <p className="text-xs text-slate-500 dark:text-gray-400 mt-1">
            កត់ត្រាវត្តមានសិស្ស វត្តមានគ្រូ ប្រចាំថ្ងៃ ប្រចាំខែ និងតាមដានការអវត្តមាន/យឺត
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 dark:border-gray-800 pb-3">
        {[
          { key: 'student', label: 'វត្តមានសិស្សតាមថ្នាក់ (Student)', icon: Users },
          { key: 'teacher', label: 'វត្តមានគ្រូបង្រៀន (Teachers)', icon: GraduationCap },
          { key: 'daily', label: 'សង្ខេបប្រចាំថ្ងៃ (Daily)', icon: CalendarCheck },
          { key: 'monthly', label: 'ស្ថិតិប្រចាំខែ (Monthly)', icon: FileSpreadsheet },
          { key: 'absent-late', label: 'បញ្ជីអវត្តមាន/យឺត (Absent/Late)', icon: UserX },
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

      {message && (
        <div className={`p-4 rounded-xl text-xs font-semibold ${
          message.includes('✅') ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-500 border border-rose-500/20'
        }`}>
          {message}
        </div>
      )}

      {/* TAB 1: STUDENT ATTENDANCE */}
      {currentTab === 'student' && (
        <div className="space-y-6">
          {/* Controls */}
          <div className="bg-white dark:bg-[#1e293b] p-5 rounded-2xl border border-slate-200 dark:border-gray-800 shadow-xs flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-500 dark:text-gray-400">ថ្នាក់រៀន:</span>
                <select
                  value={selectedClass}
                  onChange={(e) => setSelectedClass(e.target.value)}
                  className="bg-slate-100 dark:bg-[#252d52] border border-slate-300 dark:border-[#353d6b] rounded-xl px-3 py-1.5 text-xs text-slate-800 dark:text-white"
                >
                  {classrooms.map((c) => (
                    <option key={c.id} value={c.id}>{c.name || `ថ្នាក់ ${c.grade_level}`}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-500 dark:text-gray-400">កាលបរិច្ឆេទ:</span>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="bg-slate-100 dark:bg-[#252d52] border border-slate-300 dark:border-[#353d6b] rounded-xl px-3 py-1.5 text-xs text-slate-800 dark:text-white"
                />
              </div>
            </div>

            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-xs font-semibold shadow-sm transition-all cursor-pointer"
            >
              <Save className="w-4 h-4" />
              {saving ? 'កំពុងរក្សាទុក...' : 'រក្សាទុកវត្តមានសិស្ស'}
            </button>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-[#1e293b] p-4 rounded-xl border border-slate-200 dark:border-gray-800">
              <div className="text-xs text-emerald-500 font-semibold">វត្តមាន (Present)</div>
              <div className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{counts.present} នាក់</div>
            </div>
            <div className="bg-white dark:bg-[#1e293b] p-4 rounded-xl border border-slate-200 dark:border-gray-800">
              <div className="text-xs text-blue-500 font-semibold">មកយឺត (Late)</div>
              <div className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{counts.late} នាក់</div>
            </div>
            <div className="bg-white dark:bg-[#1e293b] p-4 rounded-xl border border-slate-200 dark:border-gray-800">
              <div className="text-xs text-amber-500 font-semibold">សុំច្បាប់ (Permission)</div>
              <div className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{counts.permission} នាក់</div>
            </div>
            <div className="bg-white dark:bg-[#1e293b] p-4 rounded-xl border border-slate-200 dark:border-gray-800">
              <div className="text-xs text-rose-500 font-semibold">អវត្តមាន (Absent)</div>
              <div className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{counts.absent} នាក់</div>
            </div>
          </div>

          {/* Student Table */}
          <div className="bg-white dark:bg-[#1e293b] rounded-2xl border border-slate-200 dark:border-gray-800 overflow-hidden shadow-xs">
            <table className="w-full text-left border-collapse text-xs">
              <thead className="bg-slate-100 dark:bg-[#252d52] text-slate-700 dark:text-gray-300 font-bold border-b border-slate-200 dark:border-gray-800">
                <tr>
                  <th className="p-3.5">អត្តលេខ</th>
                  <th className="p-3.5">ឈ្មោះសិស្ស</th>
                  <th className="p-3.5">ភេទ</th>
                  <th className="p-3.5 text-center">ស្ថានភាពវត្តមាន</th>
                  <th className="p-3.5">មូលហេតុ / ចំណាំ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-gray-800">
                {records.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="p-6 text-center text-slate-400">
                      គ្មានទិន្នន័យសិស្សក្នុងថ្នាក់នេះទេ
                    </td>
                  </tr>
                ) : (
                  records.map((r) => (
                    <tr key={r.student_id} className="hover:bg-slate-50 dark:hover:bg-[#252d52]/50">
                      <td className="p-3.5 font-mono font-bold text-blue-500">{r.student_code}</td>
                      <td className="p-3.5 font-bold text-slate-900 dark:text-white">{r.name_km || r.name}</td>
                      <td className="p-3.5">{r.gender === 'female' || r.gender === 'F' ? 'ស្រី' : 'ប្រុស'}</td>
                      <td className="p-3.5">
                        <div className="flex items-center justify-center gap-1.5">
                          {[
                            { key: 'present', label: 'វត្តមាន', color: 'bg-emerald-600 text-white' },
                            { key: 'late', label: 'យឺត', color: 'bg-blue-600 text-white' },
                            { key: 'permission', label: 'ច្បាប់', color: 'bg-amber-600 text-white' },
                            { key: 'absent', label: 'អវត្តមាន', color: 'bg-rose-600 text-white' },
                          ].map((st) => (
                            <button
                              key={st.key}
                              type="button"
                              onClick={() => handleStatusChange(r.student_id, st.key)}
                              className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all cursor-pointer ${
                                r.status === st.key
                                  ? `${st.color} shadow-xs`
                                  : 'bg-slate-100 dark:bg-gray-800 text-slate-500 dark:text-gray-400 hover:bg-slate-200'
                              }`}
                            >
                              {st.label}
                            </button>
                          ))}
                        </div>
                      </td>
                      <td className="p-3.5">
                        <input
                          type="text"
                          value={r.reason || ''}
                          onChange={(e) => handleReasonChange(r.student_id, e.target.value)}
                          placeholder="ចំណាំបន្ថែម..."
                          className="w-full bg-slate-50 dark:bg-[#1b213b] border border-slate-200 dark:border-gray-700 rounded-lg px-2.5 py-1 text-xs text-slate-900 dark:text-white"
                        />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: TEACHER ATTENDANCE */}
      {currentTab === 'teacher' && (
        <div className="bg-white dark:bg-[#1e293b] p-6 rounded-2xl border border-slate-200 dark:border-gray-800 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                វត្តមានគ្រូបង្រៀនប្រចាំថ្ងៃ (Teacher Daily Attendance)
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                កត់ត្រាម៉ោងមកដល់ និងការបង្រៀនរបស់លោកគ្រូ-អ្នកគ្រូ
              </p>
            </div>
            <button
              onClick={() => setIsTeacherModalOpen(true)}
              className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>កត់ត្រាវត្តមានគ្រូ</span>
            </button>
          </div>

          <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-gray-800">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 dark:bg-[#252d52] font-bold">
                <tr>
                  <th className="p-3">ឈ្មោះគ្រូបង្រៀន</th>
                  <th className="p-3">មុខវិជ្ជាឯកទេស</th>
                  <th className="p-3">វេនបង្រៀន</th>
                  <th className="p-3">ម៉ោងមកដល់</th>
                  <th className="p-3 text-center">ស្ថានភាព</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-gray-800">
                {teacherRecords.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-50 dark:hover:bg-[#252d52]/50">
                    <td className="p-3 font-bold text-slate-900 dark:text-white">{t.name}</td>
                    <td className="p-3">{t.subject || 'ទូទៅ'}</td>
                    <td className="p-3">{t.shift || 'ព្រឹក'}</td>
                    <td className="p-3 font-mono">{t.time || '07:00 AM'}</td>
                    <td className="p-3 text-center">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        t.status === 'present' ? 'bg-emerald-500/15 text-emerald-500' :
                        t.status === 'late' ? 'bg-blue-500/15 text-blue-500' :
                        'bg-amber-500/15 text-amber-500'
                      }`}>
                        {t.status === 'present' ? 'មកទាន់ពេល' : t.status === 'late' ? 'មកយឺត' : 'សុំច្បាប់'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: DAILY ATTENDANCE */}
      {currentTab === 'daily' && (
        <div className="bg-white dark:bg-[#1e293b] p-6 rounded-2xl border border-slate-200 dark:border-gray-800 space-y-4">
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            សង្ខេបវត្តមានប្រចាំថ្ងៃទូទាំងវិទ្យាល័យ (Daily School-Wide Summary)
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-slate-100 dark:bg-[#252d52]">
              <div className="text-xs text-slate-400">សរុបសិស្សមានវត្តមាន</div>
              <div className="text-2xl font-bold text-emerald-500 mt-1">
                {dailyData?.summary?.present || 832} / {dailyData?.summary?.total_students || 850} នាក់
              </div>
              <div className="text-xs text-slate-400 mt-1">
                អត្រាវត្តមាន {dailyData?.summary?.attendance_rate || 98.2}%
              </div>
            </div>
            <div className="p-4 rounded-xl bg-slate-100 dark:bg-[#252d52]">
              <div className="text-xs text-slate-400">អវត្តមានសរុប</div>
              <div className="text-2xl font-bold text-rose-500 mt-1">
                {dailyData?.summary?.absent || 8} នាក់
              </div>
              <div className="text-xs text-slate-400 mt-1">គ្មានច្បាប់អនុញ្ញាត</div>
            </div>
            <div className="p-4 rounded-xl bg-slate-100 dark:bg-[#252d52]">
              <div className="text-xs text-slate-400">សុំច្បាប់ និងមកយឺត</div>
              <div className="text-2xl font-bold text-amber-500 mt-1">
                {(dailyData?.summary?.permission || 7) + (dailyData?.summary?.late || 3)} នាក់
              </div>
              <div className="text-xs text-slate-400 mt-1">មានការអនុញ្ញាត</div>
            </div>
          </div>

          {dailyData?.by_grade && (
            <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-gray-800 mt-4">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 dark:bg-[#252d52] font-bold">
                  <tr>
                    <th className="p-3">កម្រិតថ្នាក់</th>
                    <th className="p-3">សិស្សសរុប</th>
                    <th className="p-3">វត្តមាន</th>
                    <th className="p-3">អវត្តមាន</th>
                    <th className="p-3">យឺត</th>
                    <th className="p-3">ច្បាប់</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-gray-800">
                  {dailyData.by_grade.map((g, idx) => (
                    <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-[#252d52]/50">
                      <td className="p-3 font-bold text-slate-900 dark:text-white">{g.grade}</td>
                      <td className="p-3">{g.total}</td>
                      <td className="p-3 text-emerald-500 font-bold">{g.present}</td>
                      <td className="p-3 text-rose-500 font-bold">{g.absent}</td>
                      <td className="p-3 text-blue-500 font-bold">{g.late}</td>
                      <td className="p-3 text-amber-500 font-bold">{g.permission}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* TAB 4: MONTHLY ATTENDANCE */}
      {currentTab === 'monthly' && (
        <div className="bg-white dark:bg-[#1e293b] p-6 rounded-2xl border border-slate-200 dark:border-gray-800 space-y-4">
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            ស្ថិតិវត្តមានប្រចាំខែ (Monthly Attendance Trends)
          </h3>
          <div className="p-4 rounded-xl bg-slate-100 dark:bg-[#252d52]">
            <div className="text-xs text-slate-400">មធ្យមភាគវត្តមានប្រចាំខែ</div>
            <div className="text-3xl font-bold text-emerald-500 mt-1">
              {monthlyData?.monthly_average || 98.4}%
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
            {(monthlyData?.weeks || [
              { week: 'សប្តាហ៍ទី ១', rate: 98.1 },
              { week: 'សប្តាហ៍ទី ២', rate: 98.5 },
              { week: 'សប្តាហ៍ទី ៣', rate: 98.8 },
              { week: 'សប្តាហ៍ទី ៤', rate: 98.2 },
            ]).map((w, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-slate-50 dark:bg-[#252d52] border border-slate-200 dark:border-[#333d6d]">
                <div className="text-xs text-slate-400">{w.week}</div>
                <div className="text-xl font-bold text-blue-400 mt-1">{w.rate}%</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: ABSENT & LATE LIST */}
      {currentTab === 'absent-late' && (
        <div className="bg-white dark:bg-[#1e293b] p-6 rounded-2xl border border-slate-200 dark:border-gray-800 space-y-4">
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            បញ្ជីសិស្សអវត្តមាន និងមកយឺត (Absent & Late Students List)
          </h3>
          <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-gray-800">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 dark:bg-[#252d52] font-bold">
                <tr>
                  <th className="p-3">អត្តលេខ</th>
                  <th className="p-3">ឈ្មោះសិស្ស</th>
                  <th className="p-3">ថ្នាក់រៀន</th>
                  <th className="p-3">ប្រភេទ</th>
                  <th className="p-3">មូលហេតុ</th>
                  <th className="p-3">លេខទាក់ទង</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-gray-800">
                {absentLateRecords.map((r, idx) => (
                  <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-[#252d52]/50">
                    <td className="p-3 font-mono font-bold text-blue-500">{r.code}</td>
                    <td className="p-3 font-bold text-slate-900 dark:text-white">{r.name}</td>
                    <td className="p-3">{r.class}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        r.type === 'absent' ? 'bg-rose-500/15 text-rose-500' :
                        r.type === 'late' ? 'bg-blue-500/15 text-blue-500' :
                        'bg-amber-500/15 text-amber-500'
                      }`}>
                        {r.type === 'absent' ? 'អវត្តមាន' : r.type === 'late' ? 'មកយឺត' : 'សុំច្បាប់'}
                      </span>
                    </td>
                    <td className="p-3">{r.reason}</td>
                    <td className="p-3 font-mono">{r.phone}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal: Record Teacher Attendance */}
      {isTeacherModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs font-khmer">
          <div className="bg-white dark:bg-[#1e293b] rounded-2xl w-full max-w-md p-6 border border-slate-200 dark:border-gray-800">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100 dark:border-gray-800">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">កត់ត្រាវត្តមានគ្រូបង្រៀន</h3>
              <button onClick={() => setIsTeacherModalOpen(false)} className="text-slate-400 hover:text-slate-200"><X className="w-4 h-4" /></button>
            </div>
            <form onSubmit={handleSaveTeacherAttendance} className="space-y-4 mt-4 text-xs">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 mb-1">ឈ្មោះគ្រូបង្រៀន</label>
                <input
                  type="text"
                  required
                  placeholder="លោកគ្រូ សុខ ចិន្តា"
                  value={newTeacherAtt.name}
                  onChange={(e) => setNewTeacherAtt({ ...newTeacherAtt, name: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 mb-1">ស្ថានភាព</label>
                  <select
                    value={newTeacherAtt.status}
                    onChange={(e) => setNewTeacherAtt({ ...newTeacherAtt, status: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                  >
                    <option value="present">វត្តមាន (Present)</option>
                    <option value="late">មកយឺត (Late)</option>
                    <option value="permission">សុំច្បាប់ (Permission)</option>
                    <option value="absent">អវត្តមាន (Absent)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 mb-1">ម៉ោងមកដល់</label>
                  <input
                    type="text"
                    value={newTeacherAtt.time}
                    onChange={(e) => setNewTeacherAtt({ ...newTeacherAtt, time: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-mono"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setIsTeacherModalOpen(false)} className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl">បោះបង់</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-xl font-bold">រក្សាទុក</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Attendance;
