import React, { useState, useEffect } from 'react';
import { ArrowRightLeft, Plus, Trash2, X, Search, Filter } from 'lucide-react';
import { studentServicesService } from '../../services';

/**
 * Option 3: ការផ្ទេរការសិក្សា (Student Transfer)
 */
const StudentTransfer = () => {
  const [transfers, setTransfers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTransfer, setNewTransfer] = useState({
    student_name: '',
    code: `STU${Date.now().toString().slice(-4)}`,
    type: 'transfer_in',
    school: '',
    classroom: '11A',
    date: new Date().toISOString().split('T')[0],
  });

  const showMsg = (msg) => {
    setMessage(msg);
    setTimeout(() => setMessage(''), 4000);
  };

  const loadTransfers = async () => {
    setLoading(true);
    try {
      const res = await studentServicesService.getTransfers();
      setTransfers(res?.data || res?.transfers || []);
    } catch (err) {
      console.warn('Failed to load transfers', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTransfers();
  }, []);

  const handleCreateTransfer = async (e) => {
    e.preventDefault();
    try {
      await studentServicesService.createTransfer(newTransfer);
      showMsg('✅ បានចុះឈ្មោះផ្ទេរការសិក្សាដោយជោគជ័យ!');
      setIsModalOpen(false);
      setNewTransfer({
        student_name: '',
        code: `STU${Date.now().toString().slice(-4)}`,
        type: 'transfer_in',
        school: '',
        classroom: '11A',
        date: new Date().toISOString().split('T')[0],
      });
      loadTransfers();
    } catch {
      showMsg('❌ បរាជ័យក្នុងការចុះឈ្មោះផ្ទេរ');
    }
  };

  const handleDeleteTransfer = async (id) => {
    if (!window.confirm('តើអ្នកចង់លុបកំណត់ត្រានេះមែនទេ?')) return;
    try {
      await studentServicesService.deleteTransfer(id);
      showMsg('✅ បានលុបកំណត់ត្រាផ្ទេរការសិក្សា');
      loadTransfers();
    } catch {
      showMsg('❌ បរាជ័យក្នុងការលុប');
    }
  };

  const fallbackTransfers = [
    { id: 1, code: 'STU7590', student_name: 'ម៉ៅ វណ្ណដេត', type: 'transfer_in', school: 'វិទ្យាល័យ ព្រះមហាក្សត្រីយានី (ក្រចេះ)', classroom: '11A', date: '2026-11-01' },
    { id: 2, code: 'STU6820', student_name: 'ចាន់ ស្រីនាង', type: 'transfer_out', school: 'វិទ្យាល័យ ហ៊ុន សែន មិត្តភាព (ភ្នំពេញ)', classroom: '10B', date: '2026-10-25' },
    { id: 3, code: 'STU9142', student_name: 'រ័ត្ន បញ្ញា', type: 'transfer_in', school: 'វិទ្យាល័យ ហ៊ុន សែន ត្បូងឃ្មុំ', classroom: '12A', date: '2026-10-18' },
  ];

  const displayList = (transfers.length > 0 ? transfers : fallbackTransfers).filter((row) => {
    const name = row.student_name || row.name || '';
    const code = row.code || '';
    const school = row.school || '';
    const matchesSearch =
      name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      school.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || row.type === typeFilter;
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-6 font-khmer">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-amber-500/10 text-amber-500">
              <ArrowRightLeft className="w-5 h-5" />
            </span>
            <h1 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white">
              ការផ្ទេរការសិក្សា (Student Transfer)
            </h1>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            កត់ត្រាសិស្សផ្ទេរចូលពីវិទ្យាល័យផ្សេង និងសិស្សផ្ទេរចេញ
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-xs flex items-center justify-center gap-2 cursor-pointer transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>+ ចុះឈ្មោះផ្ទេរការសិក្សា</span>
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
            placeholder="ស្វែងរកតាមឈ្មោះ, អត្តលេខ, សាលារៀន..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-3 py-2 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
          >
            <option value="all">ប្រភេទទាំងអស់</option>
            <option value="transfer_in">ផ្ទេរចូល (Transfer In)</option>
            <option value="transfer_out">ផ្ទេរចេញ (Transfer Out)</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-[#1e293b] rounded-2xl border border-slate-200 dark:border-gray-800 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 dark:bg-[#252d52] font-bold text-slate-700 dark:text-slate-300">
              <tr>
                <th className="p-3.5">អត្តលេខ</th>
                <th className="p-3.5">ឈ្មោះសិស្ស</th>
                <th className="p-3.5">ប្រភេទ</th>
                <th className="p-3.5">សាលារៀនប្រភព / គោលដៅ</th>
                <th className="p-3.5">ថ្នាក់រៀន</th>
                <th className="p-3.5">កាលបរិច្ឆេទ</th>
                <th className="p-3.5 text-center">សកម្មភាព</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-gray-800">
              {displayList.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-[#252d52]/50 transition-colors">
                  <td className="p-3.5 font-mono font-bold text-blue-500">{row.code || `STU${row.id}`}</td>
                  <td className="p-3.5 font-bold text-slate-900 dark:text-white">{row.student_name || row.name}</td>
                  <td className="p-3.5">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        row.type === 'transfer_in'
                          ? 'bg-emerald-500/15 text-emerald-500 border border-emerald-500/20'
                          : 'bg-blue-500/15 text-blue-500 border border-blue-500/20'
                      }`}
                    >
                      {row.type === 'transfer_in' ? 'ផ្ទេរចូល' : 'ផ្ទេរចេញ'}
                    </span>
                  </td>
                  <td className="p-3.5 text-slate-600 dark:text-slate-300">{row.school}</td>
                  <td className="p-3.5 text-slate-600 dark:text-slate-300">{row.classroom || row.class}</td>
                  <td className="p-3.5 font-mono text-slate-500">{row.date}</td>
                  <td className="p-3.5 text-center">
                    <button
                      onClick={() => handleDeleteTransfer(row.id)}
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

      {/* Modal: Transfer */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs font-khmer">
          <div className="bg-white dark:bg-[#1e293b] rounded-2xl w-full max-w-md p-6 border border-slate-200 dark:border-gray-800 shadow-xl">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100 dark:border-gray-800">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">ចុះឈ្មោះផ្ទេរការសិក្សា</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-200">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleCreateTransfer} className="space-y-4 mt-4 text-xs">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 mb-1">ឈ្មោះសិស្ស *</label>
                <input
                  type="text"
                  required
                  placeholder="សុខ ចាន់ដារ៉ា"
                  value={newTransfer.student_name}
                  onChange={(e) => setNewTransfer({ ...newTransfer, student_name: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 mb-1">ប្រភេទ</label>
                  <select
                    value={newTransfer.type}
                    onChange={(e) => setNewTransfer({ ...newTransfer, type: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                  >
                    <option value="transfer_in">ផ្ទេរចូល</option>
                    <option value="transfer_out">ផ្ទេរចេញ</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 mb-1">ថ្នាក់រៀន</label>
                  <input
                    type="text"
                    value={newTransfer.classroom}
                    onChange={(e) => setNewTransfer({ ...newTransfer, classroom: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                  />
                </div>
              </div>
              <div>
                <label className="block text-slate-700 dark:text-slate-300 mb-1">សាលារៀនប្រភព ឬគោលដៅ *</label>
                <input
                  type="text"
                  required
                  placeholder="វិទ្យាល័យ ព្រះមហាក្សត្រីយានី"
                  value={newTransfer.school}
                  onChange={(e) => setNewTransfer({ ...newTransfer, school: e.target.value })}
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
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-xl font-bold">
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

export default StudentTransfer;
