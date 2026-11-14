import React, { useEffect, useState } from 'react';
import {
  Users,
  UserCheck,
  Plus,
  Search,
  Phone,
  Mail,
  GraduationCap,
  School,
  Edit,
  Trash2,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
  X,
} from 'lucide-react';
import { teacherService, academicService } from '../../services';
import { useApp } from '../../context/AppContext';

const TeacherList = () => {
  const { lang } = useApp();
  const [teachers, setTeachers] = useState([]);
  const [classrooms, setClassrooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState(null);

  const [formData, setFormData] = useState({
    teacher_code: `TCH${Date.now().toString().slice(-4)}`,
    full_name_km: '',
    full_name_en: '',
    gender: 'male',
    phone: '',
    email: '',
    classroom_id: '',
  });

  const fetchTeachers = async () => {
    setLoading(true);
    try {
      const [tRes, cRes] = await Promise.all([
        teacherService.getTeachers(),
        academicService.getClassrooms(),
      ]);
      setTeachers(tRes?.data || (Array.isArray(tRes) ? tRes : []));
      setClassrooms(cRes?.data || (Array.isArray(cRes) ? cRes : []));
    } catch {
      setError('មិនអាចទាញយកទិន្នន័យគ្រូបង្រៀនបានទេ');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeachers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (editingTeacher) {
        await teacherService.updateTeacher(editingTeacher.id, formData);
        if (formData.classroom_id) {
          await teacherService.assignHomeroom(editingTeacher.id, formData.classroom_id);
        }
        setSuccess('បានកែប្រែទិន្នន័យគ្រូបង្រៀនដោយជោគជ័យ!');
      } else {
        await teacherService.createTeacher(formData);
        setSuccess('បានបន្ថែមគ្រូបង្រៀនដោយជោគជ័យ!');
      }
      setIsModalOpen(false);
      setEditingTeacher(null);
      setFormData({
        teacher_code: `TCH${Date.now().toString().slice(-4)}`,
        full_name_km: '',
        full_name_en: '',
        gender: 'male',
        phone: '',
        email: '',
        classroom_id: '',
      });
      fetchTeachers();
      setTimeout(() => setSuccess(''), 3500);
    } catch (err) {
      setError(err.response?.data?.message || 'បរាជ័យក្នុងការរក្សាទុក');
    }
  };

  const handleEdit = (t) => {
    setEditingTeacher(t);
    setFormData({
      teacher_code: t.teacher_code || '',
      full_name_km: t.full_name_km || '',
      full_name_en: t.full_name_en || '',
      gender: t.gender || 'male',
      phone: t.phone || '',
      email: t.user?.email || '',
      classroom_id: t.homeroom_classroom?.id || t.classroom_id || '',
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('តើអ្នកចង់លុបទិន្នន័យគ្រូបង្រៀននេះមែនទេ?')) return;
    try {
      await teacherService.deleteTeacher(id);
      setSuccess('បានលុបគ្រូបង្រៀនដោយជោគជ័យ');
      fetchTeachers();
      setTimeout(() => setSuccess(''), 3500);
    } catch {
      setError('បរាជ័យក្នុងការលុប');
    }
  };

  const filteredTeachers = teachers.filter((t) => {
    const q = searchTerm.toLowerCase();
    return (
      t.full_name_km?.toLowerCase().includes(q) ||
      t.full_name_en?.toLowerCase().includes(q) ||
      t.teacher_code?.toLowerCase().includes(q) ||
      t.phone?.includes(q)
    );
  });

  return (
    <div className="space-y-6 font-khmer transition-colors duration-200">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            {lang === 'KH' ? 'ការគ្រប់គ្រងគ្រូបង្រៀន' : 'Teacher Management'}
            <span className="text-[11px] bg-blue-500/15 text-blue-600 dark:text-blue-400 px-2.5 py-0.5 rounded-full font-semibold border border-blue-500/20">
              {lang === 'KH' ? `សរុប ${teachers.length} នាក់` : `Total ${teachers.length}`}
            </span>
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            គ្រប់គ្រងបញ្ជីឈ្មោះគ្រូបង្រៀន បន្ទុកថ្នាក់ និងព័ត៌មានទំនាក់ទំនង
          </p>
        </div>

        <button
          onClick={() => {
            setEditingTeacher(null);
            setFormData({
              teacher_code: `TCH${Date.now().toString().slice(-4)}`,
              full_name_km: '',
              full_name_en: '',
              gender: 'male',
              phone: '',
              email: '',
              classroom_id: '',
            });
            setIsModalOpen(true);
          }}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-sm active:scale-95 cursor-pointer self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>បន្ថែមគ្រូថ្មី</span>
        </button>
      </div>

      {/* Notifications */}
      {success && (
        <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60 rounded-2xl text-sm flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
          <span>{success}</span>
        </div>
      )}
      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800/60 rounded-2xl text-sm flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Search Bar */}
      <div className="bg-white dark:bg-[#1e293b] p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="w-4.5 h-4.5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="ស្វែងរកតាមឈ្មោះគ្រូ អត្តលេខ ឬលេខទូរស័ព្ទ..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
          />
        </div>
        {searchTerm && (
          <button
            onClick={() => setSearchTerm('')}
            className="px-3.5 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-xl text-xs flex items-center gap-1.5 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>សម្អាត</span>
          </button>
        )}
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-[#1e293b] rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs overflow-hidden">
        {loading ? (
          <div className="py-20 text-center text-slate-400 text-sm animate-pulse">កំពុងទាញយកទិន្នន័យ...</div>
        ) : filteredTeachers.length === 0 ? (
          <div className="py-20 text-center text-slate-400 text-sm">មិនមានទិន្នន័យគ្រូបង្រៀនឡើយ</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50/75 dark:bg-slate-900/50 text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider border-b border-slate-200/80 dark:border-slate-800">
                <tr>
                  <th className="px-6 py-4">អត្តលេខ</th>
                  <th className="px-6 py-4">ឈ្មោះគ្រូបង្រៀន</th>
                  <th className="px-6 py-4">ភេទ</th>
                  <th className="px-6 py-4">បន្ទុកថ្នាក់ (Homeroom)</th>
                  <th className="px-6 py-4">លេខទូរស័ព្ទ</th>
                  <th className="px-6 py-4">អ៊ីមែលគណនី</th>
                  <th className="px-6 py-4 text-center">សកម្មភាព</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-slate-700 dark:text-slate-300 text-xs">
                {filteredTeachers.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="px-6 py-4 font-mono font-bold text-xs text-blue-600 dark:text-blue-400">
                      {t.teacher_code}
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-900 dark:text-white">{t.full_name_km}</div>
                      <div className="text-xs text-slate-400">{t.full_name_en || '—'}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${t.gender === 'female' ? 'bg-rose-500/10 text-rose-600' : 'bg-blue-500/10 text-blue-600'}`}>
                        {t.gender === 'female' ? 'ស្រី' : 'ប្រុស'}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-medium">
                      {t.homeroom_classroom?.name ? (
                        <span className="inline-flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-semibold bg-emerald-500/10 px-2.5 py-0.5 rounded-full text-xs border border-emerald-500/20">
                          <School className="w-3.5 h-3.5" />
                          {t.homeroom_classroom.name}
                        </span>
                      ) : (
                        <span className="text-slate-400 text-xs">គ្មានបន្ទុកថ្នាក់</span>
                      )}
                    </td>
                    <td className="px-6 py-4 font-mono text-xs">{t.phone || '—'}</td>
                    <td className="px-6 py-4 text-xs text-slate-500">{t.user?.email || '—'}</td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleEdit(t)}
                          className="p-1.5 rounded-lg text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/40 border border-blue-200 dark:border-blue-900/50 cursor-pointer"
                          title="កែប្រែ"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(t.id)}
                          className="p-1.5 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 border border-red-200 dark:border-red-900/50 cursor-pointer"
                          title="លុប"
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

      {/* Modal Add/Edit Teacher */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs font-khmer">
          <div className="bg-white dark:bg-[#1e293b] rounded-2xl w-full max-w-lg shadow-2xl border border-slate-200 dark:border-slate-800 p-6">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100 dark:border-slate-800 mb-4">
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                {editingTeacher ? 'កែប្រែព័ត៌មានគ្រូបង្រៀន' : 'បន្ថែមគ្រូបង្រៀនថ្មី'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-200"><X className="w-4 h-4" /></button>
            </div>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-xs">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">អត្តលេខគ្រូ *</label>
                <input
                  type="text"
                  required
                  value={formData.teacher_code}
                  onChange={(e) => setFormData({ ...formData, teacher_code: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-mono text-slate-900 dark:text-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">ឈ្មោះខ្មែរ *</label>
                  <input
                    type="text"
                    required
                    value={formData.full_name_km}
                    onChange={(e) => setFormData({ ...formData, full_name_km: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">ឈ្មោះឡាតាំង</label>
                  <input
                    type="text"
                    value={formData.full_name_en}
                    onChange={(e) => setFormData({ ...formData, full_name_en: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">ភេទ</label>
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white"
                  >
                    <option value="male">ប្រុស</option>
                    <option value="female">ស្រី</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">បន្ទុកថ្នាក់ (Homeroom)</label>
                  <select
                    value={formData.classroom_id}
                    onChange={(e) => setFormData({ ...formData, classroom_id: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white"
                  >
                    <option value="">-- គ្មានបន្ទុកថ្នាក់ --</option>
                    {classrooms.map((c) => (
                      <option key={c.id} value={c.id}>{c.name || `ថ្នាក់ ${c.grade_level}`}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">លេខទូរស័ព្ទ</label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">អ៊ីមែលគណនី</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-sm font-medium cursor-pointer"
                >
                  បោះបង់
                </button>
                <button
                  type="submit"
                  className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold shadow-sm cursor-pointer"
                >
                  {editingTeacher ? 'ធ្វើបច្ចុប្បន្នភាព' : 'រក្សាទុក'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherList;
