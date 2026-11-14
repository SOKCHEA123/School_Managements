import React, { useState, useEffect } from 'react';
import { ShieldAlert, Plus, Trash2, X, Search, Filter, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { studentServicesService } from '../../services';

/**
 * Option 4: វិន័យ & ការព្រមាន (Student Discipline)
 */
const StudentDiscipline = () => {
  const [disciplines, setDisciplines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [severityFilter, setSeverityFilter] = useState('all');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newDiscipline, setNewDiscipline] = useState({
    student_name: '',
    classroom: '12A',
    infraction: '',
    severity: 'ស្រាល',
    date: new Date().toISOString().split('T')[0],
  });

  const showMsg = (msg) => {
    setMessage(msg);
    setTimeout(() => setMessage(''), 4000);
  };

  const loadDisciplines = async () => {
    setLoading(true);
    try {
      const res = await studentServicesService.getDisciplines();
      setDisciplines(res?.data || res?.disciplines || []);
    } catch (err) {
      console.warn('Failed to load disciplines', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDisciplines();
  }, []);

  const handleCreateDiscipline = async (e) => {
    e.preventDefault();
    try {
      await studentServicesService.createDiscipline(newDiscipline);
      showMsg('✅ បានកត់ត្រាកំហុសវិន័យដោយជោគជ័យ!');
      setIsModalOpen(false);
      setNewDiscipline({
        student_name: '',
        classroom: '12A',
        infraction: '',
        severity: 'ស្រាល',
        date: new Date().toISOString().split('T')[0],
      });
      loadDisciplines();
    } catch {
      showMsg('❌ បរាជ័យក្នុងការកត់ត្រាវិន័យ');
    }
  };

  const handleDeleteDiscipline = async (id) => {
    if (!window.confirm('តើអ្នកចង់លុបករណីវិន័យនេះមែនទេ?')) return;
    try {
      await studentServicesService.deleteDiscipline(id);
      showMsg('✅ បានលុបកំណត់ត្រាវិន័យ');
      loadDisciplines();
    } catch {
      showMsg('❌ បរាជ័យក្នុងការលុប');
    }
  };

  const fallbackDisciplines = [
    { id: 1, student_name: 'សុខ ចាន់ដារ៉ា', classroom: '12A', infraction: 'គេចសាលាម៉ោងទី ៣', severity: 'ស្រាល', date: '2026-11-05', status: 'warned' },
    { id: 2, student_name: 'កែវ វិសាល', classroom: '11B', infraction: 'មិនពាក់ឯកសណ្ឋានសាលា', severity: 'ស្រាល', date: '2026-11-06', status: 'resolved' },
    { id: 3, student_name: 'ជា សុភ័ក្ត្រ', classroom: '10A', infraction: 'ឈ្លោះប្រកែកគ្នាក្នុងម៉ោងសម្រាក', severity: 'មធ្យម', date: '2026-11-02', status: 'warned' },
  ];

  const displayList = (disciplines.length > 0 ? disciplines : fallbackDisciplines).filter((item) => {
    const name = item.student_name || '';
    const infraction = item.infraction || '';
    const matchesSearch =
      name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      infraction.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSeverity = severityFilter === 'all' || item.severity === severityFilter;
    return matchesSearch && matchesSeverity;
  });

  return (
    <div className="space-y-6 font-khmer">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-rose-500/10 text-rose-500">
              <ShieldAlert className="w-5 h-5" />
            </span>
            <h1 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white">
              វិន័យ & ការព្រមាន (Student Discipline)
            </h1>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            កត់ត្រាករណីល្មើសវិន័យសាលា ការអញ្ជើញអាណាព្យាបាល និងកិច្ចសន្យាកែលម្អ
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-semibold shadow-xs flex items-center justify-center gap-2 cursor-pointer transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>+ កត់ត្រាកំហុសវិន័យ</span>
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

      {/* Filter and Search */}
      <div className="bg-white dark:bg-[#1e293b] p-4 rounded-2xl border border-slate-200 dark:border-gray-800 flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="ស្វែងរកតាមឈ្មោះសិស្ស, បទល្មើស..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-rose-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
            className="px-3 py-2 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
          >
            <option value="all">កម្រិតទាំងអស់</option>
            <option value="ស្រាល">ស្រាល</option>
            <option value="មធ្យម">មធ្យម</option>
            <option value="ធ្ងន់">ធ្ងន់</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-[#1e293b] rounded-2xl border border-slate-200 dark:border-gray-800 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 dark:bg-[#252d52] font-bold text-slate-700 dark:text-slate-300">
              <tr>
                <th className="p-3.5">ឈ្មោះសិស្ស</th>
                <th className="p-3.5">ថ្នាក់</th>
                <th className="p-3.5">ប្រភេទបទល្មើស</th>
                <th className="p-3.5">កម្រិតធ្ងន់ធ្ងរ</th>
                <th className="p-3.5">កាលបរិច្ឆេទ</th>
                <th className="p-3.5 text-center">ស្ថានភាព</th>
                <th className="p-3.5 text-center">សកម្មភាព</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-gray-800">
              {displayList.map((d, idx) => (
                <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-[#252d52]/50 transition-colors">
                  <td className="p-3.5 font-bold text-slate-900 dark:text-white">{d.student_name}</td>
                  <td className="p-3.5 text-slate-600 dark:text-slate-300">{d.classroom}</td>
                  <td className="p-3.5 text-rose-500 font-semibold">{d.infraction}</td>
                  <td className="p-3.5">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        d.severity === 'ធ្ងន់'
                          ? 'bg-rose-500/15 text-rose-500 border border-rose-500/20'
                          : d.severity === 'មធ្យម'
                          ? 'bg-amber-500/15 text-amber-500 border border-amber-500/20'
                          : 'bg-slate-500/15 text-slate-400 border border-slate-500/20'
                      }`}
                    >
                      {d.severity}
                    </span>
                  </td>
                  <td className="p-3.5 font-mono text-slate-500">{d.date}</td>
                  <td className="p-3.5 text-center">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        d.status === 'resolved'
                          ? 'bg-emerald-500/15 text-emerald-500 border border-emerald-500/20'
                          : 'bg-amber-500/15 text-amber-500 border border-amber-500/20'
                      }`}
                    >
                      {d.status === 'resolved' ? 'ដោះស្រាយរួច' : 'បានព្រមាន'}
                    </span>
                  </td>
                  <td className="p-3.5 text-center">
                    <button
                      onClick={() => handleDeleteDiscipline(d.id)}
                      className="text-rose-400 hover:text-rose-600 p-1.5 rounded-lg hover:bg-rose-500/10 transition-colors"
                      title="លុប"
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

      {/* Modal: Discipline */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs font-khmer">
          <div className="bg-white dark:bg-[#1e293b] rounded-2xl w-full max-w-md p-6 border border-slate-200 dark:border-gray-800 shadow-xl">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100 dark:border-gray-800">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">កត់ត្រាកំហុសវិន័យ</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-200">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleCreateDiscipline} className="space-y-4 mt-4 text-xs">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 mb-1">ឈ្មោះសិស្ស *</label>
                <input
                  type="text"
                  required
                  placeholder="សុខ ចាន់ដារ៉ា"
                  value={newDiscipline.student_name}
                  onChange={(e) => setNewDiscipline({ ...newDiscipline, student_name: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 mb-1">ថ្នាក់</label>
                  <input
                    type="text"
                    value={newDiscipline.classroom}
                    onChange={(e) => setNewDiscipline({ ...newDiscipline, classroom: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 mb-1">កម្រិតធ្ងន់ធ្ងរ</label>
                  <select
                    value={newDiscipline.severity}
                    onChange={(e) => setNewDiscipline({ ...newDiscipline, severity: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                  >
                    <option value="ស្រាល">ស្រាល</option>
                    <option value="មធ្យម">មធ្យម</option>
                    <option value="ធ្ងន់">ធ្ងន់</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-slate-700 dark:text-slate-300 mb-1">បទល្មើស *</label>
                <input
                  type="text"
                  required
                  placeholder="គេចសាលាម៉ោងទី ៣"
                  value={newDiscipline.infraction}
                  onChange={(e) => setNewDiscipline({ ...newDiscipline, infraction: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl"
                >
                  បោះបង់
                </button>
                <button type="submit" className="px-4 py-2 bg-rose-600 text-white rounded-xl font-bold">
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

export default StudentDiscipline;
