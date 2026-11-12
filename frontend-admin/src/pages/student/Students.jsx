import React, { useEffect, useState, useCallback } from 'react';
import {
  Users,
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  School,
  UserCheck,
  RotateCcw,
  AlertCircle,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import API from '../../services/api';
import { useApp } from '../../context/AppContext';
import InputStudent from './InputStudent';
import EditStudent from './EditStudent';
import DeleteStudent from './DeleteStudent';

const defaultClassrooms = [
  { id: 1, name: '12A' },
  { id: 2, name: '12B' },
  { id: 3, name: '11A' },
  { id: 4, name: '11B' },
  { id: 5, name: '10A' },
  { id: 6, name: '10B' },
];

const Students = () => {
  const { lang, t } = useApp();
  const [students, setStudents] = useState([]);
  const [classrooms, setClassrooms] = useState(defaultClassrooms);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClassroom, setSelectedClassroom] = useState('');

  // Modal States
  const [isInputOpen, setIsInputOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [deletingStudent, setDeletingStudent] = useState(null);

  // Fetch Classrooms
  useEffect(() => {
    const fetchClassrooms = async () => {
      try {
        const res = await API.get('/admin/classrooms');
        const list = Array.isArray(res.data) ? res.data : (res.data?.data || []);
        if (list && list.length > 0) {
          setClassrooms(list);
        }
      } catch (err) {
        console.warn('Using default classrooms fallback');
      }
    };
    fetchClassrooms();
  }, []);

  // Fetch Students
  const fetchStudents = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params = {};
      if (searchTerm.trim()) params.search = searchTerm.trim();
      if (selectedClassroom) params.classroom_id = selectedClassroom;

      const response = await API.get('/admin/students', { params });
      const list = response.data?.data || (Array.isArray(response.data) ? response.data : []);
      setStudents(list);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          (lang === 'KH' ? 'បរាជ័យក្នុងការទាញយកទិន្នន័យសិស្ស' : 'Failed to load students.')
      );
    } finally {
      setLoading(false);
    }
  }, [searchTerm, selectedClassroom, lang]);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  // Handle Success Message (Auto hide after 3s)
  const handleSuccess = (msg) => {
    setSuccess(msg);
    setTimeout(() => setSuccess(''), 3500);
    fetchStudents();
  };

  // Quick Stats Calculations
  const femaleCount = students.filter((s) => s.gender === 'F' || s.gender === 'female').length;
  const maleCount = students.filter((s) => s.gender === 'M' || s.gender === 'male').length;

  return (
    <div className="space-y-6 font-khmer transition-colors duration-200">
      
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            {lang === 'KH' ? 'ការគ្រប់គ្រងសិស្ស' : 'Student Management'}
            <span className="text-[11px] bg-blue-500/15 text-blue-600 dark:text-blue-400 px-2.5 py-0.5 rounded-full font-semibold border border-blue-500/20 flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              {lang === 'KH' ? `សរុប ${students.length} នាក់` : `Total ${students.length}`}
            </span>
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            {lang === 'KH'
              ? 'គ្រប់គ្រងបញ្ជីឈ្មោះសិស្ស បន្ថែមសិស្សថ្មី កែប្រែព័ត៌មាន និងចាត់ថ្នាក់រៀន'
              : 'Manage student records, enrollment, class assignments, and personal details.'}
          </p>
        </div>

        <button
          onClick={() => setIsInputOpen(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-sm hover:shadow active:scale-95 cursor-pointer self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          {lang === 'KH' ? 'បន្ថែមសិស្សថ្មី' : 'Add New Student'}
        </button>
      </div>

      {/* Mini Stats Cards (matching Dashboard) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-[#1e293b] p-4.5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-xs font-medium text-slate-500 dark:text-slate-400">
              {lang === 'KH' ? 'សិស្សសរុប' : 'Total Students'}
            </div>
            <div className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
              {students.length}
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
            <Users className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white dark:bg-[#1e293b] p-4.5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-xs font-medium text-slate-500 dark:text-slate-400">
              {lang === 'KH' ? 'សិស្សស្រី' : 'Female Students'}
            </div>
            <div className="text-2xl font-bold text-rose-600 dark:text-rose-400 mt-1">
              {femaleCount}
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center">
            <UserCheck className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white dark:bg-[#1e293b] p-4.5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-xs font-medium text-slate-500 dark:text-slate-400">
              {lang === 'KH' ? 'សិស្សប្រុស' : 'Male Students'}
            </div>
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mt-1">
              {maleCount}
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
            <Users className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white dark:bg-[#1e293b] p-4.5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-xs font-medium text-slate-500 dark:text-slate-400">
              {lang === 'KH' ? 'ថ្នាក់រៀនសរុប' : 'Total Classes'}
            </div>
            <div className="text-2xl font-bold text-violet-600 dark:text-violet-400 mt-1">
              {classrooms.length}
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-violet-500/10 text-violet-600 dark:text-violet-400 flex items-center justify-center">
            <School className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Notifications */}
      {success && (
        <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60 rounded-2xl text-sm flex items-center gap-3 animate-fade-in shadow-xs">
          <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
          <span className="font-medium">{success}</span>
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800/60 rounded-2xl text-sm flex items-center gap-3 animate-fade-in shadow-xs">
          <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
          <span className="font-medium">{error}</span>
        </div>
      )}

      {/* Search & Filter Bar */}
      <div className="bg-white dark:bg-[#1e293b] p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col md:flex-row gap-3 items-stretch md:items-center">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4.5 h-4.5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder={
              lang === 'KH'
                ? 'ស្វែងរកតាមឈ្មោះខ្មែរ ឈ្មោះឡាតាំង ឬអត្តលេខ...'
                : 'Search by student name or code...'
            }
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition-all"
          />
        </div>

        {/* Classroom Filter */}
        <div className="relative min-w-[200px]">
          <Filter className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <select
            value={selectedClassroom}
            onChange={(e) => setSelectedClassroom(e.target.value)}
            className="w-full pl-9.5 pr-8 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 cursor-pointer appearance-none transition-all"
          >
            <option value="">{lang === 'KH' ? '-- គ្រប់ថ្នាក់ទាំងអស់ --' : '-- All Classes --'}</option>
            {classrooms.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 text-xs">
            ▼
          </div>
        </div>

        {/* Reset Filter Button */}
        {(searchTerm || selectedClassroom) && (
          <button
            type="button"
            onClick={() => {
              setSearchTerm('');
              setSelectedClassroom('');
            }}
            className="px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-xl text-xs font-medium flex items-center justify-center gap-1.5 transition-all cursor-pointer"
            title="Reset Filters"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{lang === 'KH' ? 'សម្អាត' : 'Reset'}</span>
          </button>
        )}
      </div>

      {/* Main Students Table Card */}
      <div className="bg-white dark:bg-[#1e293b] rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs overflow-hidden transition-all duration-200">
        {loading ? (
          <div className="py-20 text-center flex flex-col items-center justify-center gap-3">
            <div className="w-9 h-9 border-3 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
              {lang === 'KH' ? 'កំពុងទាញយកទិន្នន័យពី Server...' : 'Loading students from database...'}
            </p>
          </div>
        ) : students.length === 0 ? (
          <div className="py-20 text-center flex flex-col items-center justify-center gap-4 px-4">
            <div className="w-16 h-16 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <Users className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-800 dark:text-white">
                {lang === 'KH' ? 'មិនទាន់មានទិន្នន័យសិស្សឡើយ' : 'No Students Found'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm">
                {lang === 'KH'
                  ? 'មិនមានទិន្នន័យស្របតាមលក្ខខណ្ឌស្វែងរក ឬមិនទាន់បានបញ្ចូលសិស្សនៅឡើយ។'
                  : 'No student matches your current filter or no records exist.'}
              </p>
            </div>
            <button
              onClick={() => setIsInputOpen(true)}
              className="mt-2 flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-xs font-semibold transition-all shadow-sm active:scale-95 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              {lang === 'KH' ? 'បន្ថែមសិស្សដំបូង' : 'Add First Student'}
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50/75 dark:bg-slate-900/50 text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider border-b border-slate-200/80 dark:border-slate-800">
                <tr>
                  <th className="px-6 py-4">អត្តលេខ</th>
                  <th className="px-6 py-4">ឈ្មោះសិស្ស (ខ្មែរ / ឡាតាំង)</th>
                  <th className="px-6 py-4">ភេទ</th>
                  <th className="px-6 py-4">ថ្នាក់រៀន</th>
                  <th className="px-6 py-4">ផ្នែកសិក្សា</th>
                  <th className="px-6 py-4">ទូរស័ព្ទអាណាព្យាបាល</th>
                  <th className="px-6 py-4">ស្ថានភាព</th>
                  <th className="px-6 py-4 text-center">សកម្មភាព</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-slate-700 dark:text-slate-300">
                {students.map((student) => (
                  <tr
                    key={student.id}
                    className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    {/* Student Code */}
                    <td className="px-6 py-4 font-mono font-bold text-xs text-blue-600 dark:text-blue-400">
                      {student.student_code}
                    </td>

                    {/* Name KM & EN */}
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-900 dark:text-white leading-tight">
                        {student.full_name_km}
                      </div>
                      <div className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
                        {student.full_name_en || '—'}
                      </div>
                    </td>

                    {/* Gender */}
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                          student.gender === 'F' || student.gender === 'female'
                            ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20'
                            : 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20'
                        }`}
                      >
                        {student.gender === 'F' || student.gender === 'female' ? 'ស្រី' : 'ប្រុស'}
                      </span>
                    </td>

                    {/* Classroom */}
                    <td className="px-6 py-4 font-medium">
                      {student.classroom?.name ? (
                        <span className="inline-flex items-center gap-1.5 text-slate-800 dark:text-slate-200">
                          <School className="w-3.5 h-3.5 text-slate-400" />
                          {student.classroom.name}
                        </span>
                      ) : (
                        <span className="text-slate-400 text-xs">មិនទាន់ចាត់ថ្នាក់</span>
                      )}
                    </td>

                    {/* Stream */}
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium ${
                          student.stream === 'social'
                            ? 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20'
                            : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                        }`}
                      >
                        {student.stream === 'social' ? 'សង្គម' : 'វិទ្យាសាស្ត្រ'}
                      </span>
                    </td>

                    {/* Parent Phone */}
                    <td className="px-6 py-4 text-xs font-mono text-slate-600 dark:text-slate-400">
                      {student.parent_phone || '—'}
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                          student.status === 'active' || !student.status
                            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                            : 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border border-slate-500/20'
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            student.status === 'active' || !student.status
                              ? 'bg-emerald-500'
                              : 'bg-slate-400'
                          }`}
                        />
                        {student.status === 'suspended' ? 'ផ្អាក' : 'សកម្ម'}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => setEditingStudent(student)}
                          className="p-1.5 rounded-lg text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/40 border border-blue-200 dark:border-blue-900/50 transition-all cursor-pointer"
                          title="Edit Student"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setDeletingStudent(student)}
                          className="p-1.5 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 border border-red-200 dark:border-red-900/50 transition-all cursor-pointer"
                          title="Delete Student"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modals */}
      {isInputOpen && (
        <InputStudent
          classrooms={classrooms}
          onClose={() => setIsInputOpen(false)}
          onSuccess={handleSuccess}
        />
      )}
      {editingStudent && (
        <EditStudent
          student={editingStudent}
          classrooms={classrooms}
          onClose={() => setEditingStudent(null)}
          onSuccess={handleSuccess}
        />
      )}
      {deletingStudent && (
        <DeleteStudent
          student={deletingStudent}
          onClose={() => setDeletingStudent(null)}
          onSuccess={handleSuccess}
        />
      )}
    </div>
  );
};

export default Students;
