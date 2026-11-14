import React, { useState, useEffect } from 'react';
import { Award, Printer, Plus, Trash2, X, CheckCircle2, FileText, Search } from 'lucide-react';
import { studentServicesService } from '../../services';

/**
 * Option 5: លិខិតបញ្ជាក់ការសិក្សា (Student Certificates)
 */
const StudentCertificates = () => {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCert, setNewCert] = useState({
    student_name: '',
    classroom: '12A',
    certificate_type: 'លិខិតបញ្ជាក់ការសិក្សា',
    issue_date: new Date().toISOString().split('T')[0],
  });

  const showMsg = (msg) => {
    setMessage(msg);
    setTimeout(() => setMessage(''), 4000);
  };

  const loadCertificates = async () => {
    setLoading(true);
    try {
      const res = await studentServicesService.getCertificates();
      setCertificates(res?.data || res?.certificates || []);
    } catch (err) {
      console.warn('Failed to load certificates', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCertificates();
  }, []);

  const handleCreateCert = async (e) => {
    e.preventDefault();
    try {
      await studentServicesService.createCertificate(newCert);
      showMsg('✅ បានចេញលិខិតបញ្ជាក់ដោយជោគជ័យ!');
      setIsModalOpen(false);
      setNewCert({
        student_name: '',
        classroom: '12A',
        certificate_type: 'លិខិតបញ្ជាក់ការសិក្សា',
        issue_date: new Date().toISOString().split('T')[0],
      });
      loadCertificates();
    } catch {
      showMsg('❌ បរាជ័យក្នុងការចេញលិខិត');
    }
  };

  const handleDeleteCert = async (id) => {
    if (!window.confirm('តើអ្នកចង់លុបកំណត់ត្រាលិខិតនេះមែនទេ?')) return;
    try {
      if (studentServicesService.deleteCertificate) {
        await studentServicesService.deleteCertificate(id);
      }
      showMsg('✅ បានលុបកំណត់ត្រាលិខិត');
      loadCertificates();
    } catch {
      showMsg('❌ បរាជ័យក្នុងការលុប');
    }
  };

  const handlePrint = (type, studentName = '') => {
    alert(`កំពុងដំណើរការបោះពុម្ព: ${type} ${studentName ? `សម្រាប់សិស្ស ${studentName}` : ''}`);
  };

  const fallbackCertificates = [
    { id: 1, student_name: 'កែវ ចិន្តា', classroom: '12A', certificate_type: 'លិខិតបញ្ជាក់ការសិក្សា', issue_date: '2026-11-08' },
    { id: 2, student_name: 'សេង ហេង', classroom: '11B', certificate_type: 'លិខិតសរសើរសិស្សពូកែ', issue_date: '2026-11-04' },
    { id: 3, student_name: 'ជា សុភ័ក្ត្រ', classroom: '10A', certificate_type: 'លិខិតបញ្ជាក់អត្តសញ្ញាណ', issue_date: '2026-10-30' },
  ];

  const displayList = (certificates.length > 0 ? certificates : fallbackCertificates).filter((c) => {
    const name = c.student_name || '';
    const type = c.certificate_type || '';
    return name.toLowerCase().includes(searchTerm.toLowerCase()) || type.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div className="space-y-6 font-khmer">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-violet-500/10 text-violet-400">
              <Award className="w-5 h-5" />
            </span>
            <h1 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white">
              លិខិតបញ្ជាក់ការសិក្សា (Academic Certificates)
            </h1>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            ចេញលិខិតបញ្ជាក់ការសិក្សា លិខិតបញ្ជាក់អត្តសញ្ញាណ និងលិខិតសរសើរសិស្ស
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-xs flex items-center justify-center gap-2 cursor-pointer transition-all"
        >
          <Printer className="w-4 h-4" />
          <span>+ ចេញលិខិតបញ្ជាក់ថ្មី</span>
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

      {/* Templates Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-gray-800 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-blue-500" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">លិខិតបញ្ជាក់ការសិក្សា</h3>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
              បញ្ជាក់ថាសិស្សពិតជាកំពុងសិក្សានៅវិទ្យាល័យ ហ៊ុន សែន ស្នួល ក្នុងឆ្នាំសិក្សា ២០២៥-២០២៦។
            </p>
          </div>
          <button
            onClick={() => handlePrint('លិខិតបញ្ជាក់ការសិក្សា')}
            className="mt-4 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer shadow-xs transition-all"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>បោះពុម្ពគំរូ</span>
          </button>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-gray-800 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-500" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">លិខិតសរសើរសិស្សពូកែ</h3>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
              ចេញជូនសិស្សានុសិស្សដែលទទួលបានចំណាត់ថ្នាក់ល្អប្រសើរប្រចាំខែ និងឆមាស។
            </p>
          </div>
          <button
            onClick={() => handlePrint('លិខិតសរសើរសិស្សពូកែ')}
            className="mt-4 px-3.5 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer shadow-xs transition-all"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>បោះពុម្ពគំរូ</span>
          </button>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-gray-800 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">លិខិតបញ្ជាក់អត្តសញ្ញាណ</h3>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
              បញ្ជាក់ព័ត៌មានអត្តសញ្ញាណ ថ្ងៃខែឆ្នាំកំណើត និងថ្នាក់រៀនសម្រាប់ឯកសារផ្លូវការ។
            </p>
          </div>
          <button
            onClick={() => handlePrint('លិខិតបញ្ជាក់អត្តសញ្ញាណ')}
            className="mt-4 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer shadow-xs transition-all"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>បោះពុម្ពគំរូ</span>
          </button>
        </div>
      </div>

      {/* Certificate History Table */}
      <div className="bg-white dark:bg-[#1e293b] rounded-2xl border border-slate-200 dark:border-gray-800 overflow-hidden shadow-xs space-y-4 p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            ប្រវត្តិលិខិតដែលបានចេញ (Issued Certificates History)
          </h3>
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="ស្វែងរក..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 dark:bg-[#252d52] font-bold text-slate-700 dark:text-slate-300">
              <tr>
                <th className="p-3">ឈ្មោះសិស្ស</th>
                <th className="p-3">ថ្នាក់</th>
                <th className="p-3">ប្រភេទលិខិត</th>
                <th className="p-3">កាលបរិច្ឆេទចេញ</th>
                <th className="p-3 text-center">សកម្មភាព</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-gray-800">
              {displayList.map((c, idx) => (
                <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-[#252d52]/50 transition-colors">
                  <td className="p-3 font-bold text-slate-900 dark:text-white">{c.student_name}</td>
                  <td className="p-3 text-slate-600 dark:text-slate-300">{c.classroom}</td>
                  <td className="p-3 font-medium text-blue-500">{c.certificate_type}</td>
                  <td className="p-3 font-mono text-slate-500">{c.issue_date}</td>
                  <td className="p-3 text-center flex items-center justify-center gap-2">
                    <button
                      onClick={() => handlePrint(c.certificate_type, c.student_name)}
                      className="text-blue-500 hover:text-blue-700 p-1 rounded-lg hover:bg-blue-500/10"
                      title="បោះពុម្ព"
                    >
                      <Printer className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteCert(c.id)}
                      className="text-rose-400 hover:text-rose-600 p-1 rounded-lg hover:bg-rose-500/10"
                      title="លុប"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Certificate */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs font-khmer">
          <div className="bg-white dark:bg-[#1e293b] rounded-2xl w-full max-w-md p-6 border border-slate-200 dark:border-gray-800 shadow-xl">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100 dark:border-gray-800">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">ចេញលិខិតបញ្ជាក់ការសិក្សា</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-200">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleCreateCert} className="space-y-4 mt-4 text-xs">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 mb-1">ឈ្មោះសិស្ស *</label>
                <input
                  type="text"
                  required
                  placeholder="សុខ ចាន់ដារ៉ា"
                  value={newCert.student_name}
                  onChange={(e) => setNewCert({ ...newCert, student_name: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 mb-1">ថ្នាក់</label>
                  <input
                    type="text"
                    value={newCert.classroom}
                    onChange={(e) => setNewCert({ ...newCert, classroom: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 mb-1">កាលបរិច្ឆេទចេញ</label>
                  <input
                    type="date"
                    value={newCert.issue_date}
                    onChange={(e) => setNewCert({ ...newCert, issue_date: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                  />
                </div>
              </div>
              <div>
                <label className="block text-slate-700 dark:text-slate-300 mb-1">ប្រភេទលិខិត</label>
                <select
                  value={newCert.certificate_type}
                  onChange={(e) => setNewCert({ ...newCert, certificate_type: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                >
                  <option value="លិខិតបញ្ជាក់ការសិក្សា">លិខិតបញ្ជាក់ការសិក្សា</option>
                  <option value="លិខិតសរសើរសិស្សពូកែ">លិខិតសរសើរសិស្សពូកែ</option>
                  <option value="លិខិតបញ្ជាក់អត្តសញ្ញាណ">លិខិតបញ្ជាក់អត្តសញ្ញាណ</option>
                </select>
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
                  ចេញលិខិត
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentCertificates;
