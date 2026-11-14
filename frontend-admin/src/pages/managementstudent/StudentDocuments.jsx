import React, { useState, useEffect } from 'react';
import { FolderOpen, FileCheck, AlertCircle, Upload, CheckCircle2, Search, Filter } from 'lucide-react';
import { studentServicesService } from '../../services';

/**
 * Option 6: សំណុំឯកសារសិស្ស (Student Documents)
 */
const StudentDocuments = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const showMsg = (msg) => {
    setMessage(msg);
    setTimeout(() => setMessage(''), 4000);
  };

  const loadDocuments = async () => {
    setLoading(true);
    try {
      const res = await studentServicesService.getDocuments();
      setDocuments(res?.data || res?.documents || []);
    } catch (err) {
      console.warn('Failed to load documents', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDocuments();
  }, []);

  const fallbackDocuments = [
    { id: 1, student_name: 'សុខ ចាន់ដារ៉ា', classroom: '12A', birth_certificate: true, residence_book: true, diploma: true, status: 'complete' },
    { id: 2, student_name: 'កែវ វិសាល', classroom: '11B', birth_certificate: true, residence_book: false, diploma: true, status: 'pending' },
    { id: 3, student_name: 'ម៉ៅ វណ្ណដេត', classroom: '11A', birth_certificate: true, residence_book: true, diploma: true, status: 'complete' },
    { id: 4, student_name: 'ចាន់ ស្រីនាង', classroom: '10B', birth_certificate: true, residence_book: true, diploma: false, status: 'pending' },
    { id: 5, student_name: 'រ័ត្ន បញ្ញា', classroom: '12A', birth_certificate: false, residence_book: true, diploma: true, status: 'missing' },
  ];

  const displayList = (documents.length > 0 ? documents : fallbackDocuments).filter((doc) => {
    const name = doc.student_name || '';
    const classroom = doc.classroom || '';
    const matchesSearch =
      name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      classroom.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || doc.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 font-khmer">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-teal-500/10 text-teal-400">
              <FolderOpen className="w-5 h-5" />
            </span>
            <h1 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white">
              សំណុំឯកសារសិស្ស (Student Documents)
            </h1>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            គ្រប់គ្រងសំបុត្រកំណើត សៀវភៅស្នាក់នៅ និងសញ្ញាបត្របឋម/ឌីប្លូមរបស់សិស្ស
          </p>
        </div>

        <button
          onClick={() => showMsg('✅ បានទាញយករបាយការណ៍ស្ថានភាពឯកសាររួចរាល់')}
          className="px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-semibold shadow-xs flex items-center justify-center gap-2 cursor-pointer transition-all"
        >
          <FileCheck className="w-4 h-4" />
          <span>ផ្ទៀងផ្ទាត់ឯកសារសរុប</span>
        </button>
      </div>

      {message && (
        <div className="p-4 rounded-xl text-xs font-semibold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
          {message}
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-gray-800 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 dark:text-slate-400">សំបុត្រកំណើតដែលបានផ្ទៀងផ្ទាត់</span>
            <span className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-500">
              <CheckCircle2 className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl font-bold text-emerald-500 mt-2">842 / 850 ច្បាប់</div>
          <div className="text-xs text-emerald-500/80 mt-1 font-medium">99.0% នៃសិស្សទាំងអស់</div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-gray-800 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 dark:text-slate-400">សញ្ញាបត្របឋមសិក្សា / ឌីប្លូម</span>
            <span className="p-1.5 rounded-lg bg-blue-500/10 text-blue-500">
              <FileCheck className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl font-bold text-blue-500 mt-2">830 ច្បាប់</div>
          <div className="text-xs text-blue-500/80 mt-1 font-medium">97.6% បានផ្ទៀងផ្ទាត់</div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-gray-800 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 dark:text-slate-400">ឯកសារនៅខ្វះ (Pending)</span>
            <span className="p-1.5 rounded-lg bg-rose-500/10 text-rose-500">
              <AlertCircle className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl font-bold text-rose-500 mt-2">8 សំណុំរឿង</div>
          <div className="text-xs text-rose-400 mt-1 font-medium">ទាមទារការជូនដំណឹងទៅអាណាព្យាបាល</div>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="bg-white dark:bg-[#1e293b] p-4 rounded-2xl border border-slate-200 dark:border-gray-800 flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="ស្វែងរកតាមឈ្មោះសិស្ស, ថ្នាក់..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-teal-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
          >
            <option value="all">ស្ថានភាពទាំងអស់</option>
            <option value="complete">គ្រប់គ្រាន់ (Complete)</option>
            <option value="pending">ខ្វះខ្លះ (Pending)</option>
            <option value="missing">មិនទាន់មាន (Missing)</option>
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
                <th className="p-3.5">ថ្នាក់រៀន</th>
                <th className="p-3.5 text-center">សំបុត្រកំណើត</th>
                <th className="p-3.5 text-center">សៀវភៅស្នាក់នៅ</th>
                <th className="p-3.5 text-center">សញ្ញាបត្រ</th>
                <th className="p-3.5 text-center">ស្ថានភាពសំណុំឯកសារ</th>
                <th className="p-3.5 text-center">សកម្មភាព</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-gray-800">
              {displayList.map((doc, idx) => (
                <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-[#252d52]/50 transition-colors">
                  <td className="p-3.5 font-bold text-slate-900 dark:text-white">{doc.student_name}</td>
                  <td className="p-3.5 text-slate-600 dark:text-slate-300">{doc.classroom}</td>
                  <td className="p-3.5 text-center">
                    {doc.birth_certificate ? (
                      <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-500">
                        ✓ មាន
                      </span>
                    ) : (
                      <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/15 text-rose-500">
                        ✗ ខ្វះ
                      </span>
                    )}
                  </td>
                  <td className="p-3.5 text-center">
                    {doc.residence_book ? (
                      <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-500">
                        ✓ មាន
                      </span>
                    ) : (
                      <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/15 text-rose-500">
                        ✗ ខ្វះ
                      </span>
                    )}
                  </td>
                  <td className="p-3.5 text-center">
                    {doc.diploma ? (
                      <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-500">
                        ✓ មាន
                      </span>
                    ) : (
                      <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/15 text-rose-500">
                        ✗ ខ្វះ
                      </span>
                    )}
                  </td>
                  <td className="p-3.5 text-center">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        doc.status === 'complete'
                          ? 'bg-emerald-500/15 text-emerald-500'
                          : doc.status === 'pending'
                          ? 'bg-amber-500/15 text-amber-500'
                          : 'bg-rose-500/15 text-rose-500'
                      }`}
                    >
                      {doc.status === 'complete' ? 'គ្រប់គ្រាន់' : doc.status === 'pending' ? 'នៅខ្វះខ្លះ' : 'មិនទាន់មាន'}
                    </span>
                  </td>
                  <td className="p-3.5 text-center">
                    <button
                      onClick={() => showMsg(`បានបើកផ្ទាំងផ្ទុកឡើងឯកសារសម្រាប់ ${doc.student_name}`)}
                      className="text-teal-500 hover:text-teal-700 p-1.5 rounded-lg hover:bg-teal-500/10 inline-flex items-center gap-1 text-[11px]"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>ផ្ទុកឡើង</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default StudentDocuments;
