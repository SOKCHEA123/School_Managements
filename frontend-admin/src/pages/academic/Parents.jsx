import React, { useEffect, useState } from 'react';
import {
  Users,
  Search,
  Phone,
  Mail,
  UserCheck,
  Shield,
  Plus,
  Edit,
  Trash2,
  X,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { parentService } from '../../services';
import { useApp } from '../../context/AppContext';

const Parents = () => {
  const { lang } = useApp();
  const [parents, setParents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  // Modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingParent, setEditingParent] = useState(null);
  const [parentForm, setParentForm] = useState({
    name_km: '',
    name_en: '',
    phone: '',
    occupation: '',
    student_name: '',
    classroom: '12A',
    address: 'ស្រុកស្នួល ក្រចេះ',
  });

  const showMsg = (msg) => {
    setMessage(msg);
    setTimeout(() => setMessage(''), 3500);
  };

  const fetchParents = async () => {
    setLoading(true);
    try {
      const res = await parentService.getParents();
      const list = res?.data || (Array.isArray(res) ? res : []);
      setParents(list);
    } catch {
      setParents([
        { id: 1, name_km: 'សុខ សម្បត្តិ', name_en: 'Sok Sambath', phone: '012 345 678', occupation: 'កសិករ', student_name: 'សុខ ចាន់ដារ៉ា', classroom: '12A', address: 'ភូមិស្នួល ស្រុកស្នួល' },
        { id: 2, name_km: 'កែវ សុគន្ធា', name_en: 'Keo Sokunthea', phone: '097 888 9999', occupation: 'អាជីវករ', student_name: 'កែវ វិសាល', classroom: '11B', address: 'ផ្សារស្នួល ក្រចេះ' },
        { id: 3, name_km: 'ម៉ៅ វីរៈ', name_en: 'Mao Virak', phone: '088 123 4567', occupation: 'មន្ត្រីរាជការ', student_name: 'ម៉ៅ វណ្ណដា', classroom: '12B', address: 'ស្នួល ក្រចេះ' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchParents();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingParent) {
        await parentService.updateParent(editingParent.id, parentForm);
        showMsg('✅ បានកែប្រែព័ត៌មានអាណាព្យាបាលដោយជោគជ័យ!');
      } else {
        await parentService.createParent(parentForm);
        showMsg('✅ បានបន្ថែមអាណាព្យាបាលដោយជោគជ័យ!');
      }
      setIsModalOpen(false);
      setEditingParent(null);
      setParentForm({ name_km: '', name_en: '', phone: '', occupation: '', student_name: '', classroom: '12A', address: 'ស្រុកស្នួល ក្រចេះ' });
      fetchParents();
    } catch {
      showMsg('❌ បរាជ័យក្នុងការរក្សាទុក');
    }
  };

  const handleEdit = (p) => {
    setEditingParent(p);
    setParentForm({
      name_km: p.name_km || '',
      name_en: p.name_en || '',
      phone: p.phone || '',
      occupation: p.occupation || '',
      student_name: p.student_name || '',
      classroom: p.classroom || '12A',
      address: p.address || '',
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('តើអ្នកចង់លុបព័ត៌មានអាណាព្យាបាលនេះមែនទេ?')) return;
    try {
      await parentService.deleteParent(id);
      showMsg('✅ បានលុបព័ត៌មានអាណាព្យាបាលរួចរាល់');
      fetchParents();
    } catch {
      showMsg('❌ បរាជ័យក្នុងការលុប');
    }
  };

  const filtered = parents.filter(
    (p) =>
      p.name_km?.includes(searchTerm) ||
      p.name_en?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.phone?.includes(searchTerm) ||
      p.student_name?.includes(searchTerm)
  );

  return (
    <div className="space-y-6 font-khmer transition-colors duration-200">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            គ្រប់គ្រងអាណាព្យាបាល (Parents Management)
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            ព័ត៌មានទំនាក់ទំនងមាតាបិតា និងអាណាព្យាបាលសិស្ស
          </p>
        </div>
        <button
          onClick={() => {
            setEditingParent(null);
            setParentForm({ name_km: '', name_en: '', phone: '', occupation: '', student_name: '', classroom: '12A', address: 'ស្រុកស្នួល ក្រចេះ' });
            setIsModalOpen(true);
          }}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl text-sm font-semibold shadow-sm active:scale-95 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>បន្ថែមអាណាព្យាបាល</span>
        </button>
      </div>

      {message && (
        <div className={`p-4 rounded-xl text-xs font-semibold ${
          message.includes('✅') ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-500 border border-rose-500/20'
        }`}>
          {message}
        </div>
      )}

      {/* Search Bar */}
      <div className="bg-white dark:bg-[#1e293b] p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="w-4.5 h-4.5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="ស្វែងរកតាមឈ្មោះអាណាព្យាបាល លេខទូរស័ព្ទ ឬឈ្មោះកូន..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-[#1e293b] rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50/75 dark:bg-slate-900/50 text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase border-b border-slate-200/80 dark:border-slate-800">
              <tr>
                <th className="px-6 py-4">ឈ្មោះអាណាព្យាបាល</th>
                <th className="px-6 py-4">លេខទូរស័ព្ទ</th>
                <th className="px-6 py-4">មុខរបរ</th>
                <th className="px-6 py-4">អាណាព្យាបាលរបស់សិស្ស</th>
                <th className="px-6 py-4">ថ្នាក់រៀន</th>
                <th className="px-6 py-4">អាសយដ្ឋាន</th>
                <th className="px-6 py-4 text-center">សកម្មភាព</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-slate-700 dark:text-slate-300 text-xs">
              {filtered.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40">
                  <td className="px-6 py-4 font-bold text-slate-900 dark:text-white">
                    {p.name_km}
                    <div className="text-xs text-slate-400 font-normal">{p.name_en}</div>
                  </td>
                  <td className="px-6 py-4 font-mono text-xs text-blue-600 dark:text-blue-400 font-semibold">{p.phone}</td>
                  <td className="px-6 py-4">{p.occupation}</td>
                  <td className="px-6 py-4 font-semibold text-slate-900 dark:text-white">{p.student_name}</td>
                  <td className="px-6 py-4 text-xs font-semibold">{p.classroom}</td>
                  <td className="px-6 py-4 text-xs text-slate-400">{p.address}</td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => handleEdit(p)}
                        className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/40 border border-blue-200 dark:border-blue-900/50 cursor-pointer"
                        title="កែប្រែ"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(p.id)}
                        className="p-1.5 rounded-lg text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 border border-red-200 dark:border-red-900/50 cursor-pointer"
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
      </div>

      {/* Add / Edit Parent Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs font-khmer">
          <div className="bg-white dark:bg-[#1e293b] rounded-2xl w-full max-w-md shadow-2xl border border-slate-200 dark:border-slate-800 p-6">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100 dark:border-slate-800 mb-4">
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                {editingParent ? 'កែប្រែព័ត៌មានអាណាព្យាបាល' : 'បន្ថែមអាណាព្យាបាលថ្មី'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-200"><X className="w-4 h-4" /></button>
            </div>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-xs">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">ឈ្មោះខ្មែរ *</label>
                <input
                  type="text"
                  required
                  value={parentForm.name_km}
                  onChange={(e) => setParentForm({ ...parentForm, name_km: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">ឈ្មោះឡាតាំង</label>
                  <input
                    type="text"
                    value={parentForm.name_en}
                    onChange={(e) => setParentForm({ ...parentForm, name_en: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">លេខទូរស័ព្ទ *</label>
                  <input
                    type="text"
                    required
                    value={parentForm.phone}
                    onChange={(e) => setParentForm({ ...parentForm, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">មុខរបរ</label>
                  <input
                    type="text"
                    value={parentForm.occupation}
                    onChange={(e) => setParentForm({ ...parentForm, occupation: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">អាណាព្យាបាលរបស់សិស្ស</label>
                  <input
                    type="text"
                    value={parentForm.student_name}
                    onChange={(e) => setParentForm({ ...parentForm, student_name: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">អាសយដ្ឋាន</label>
                <input
                  type="text"
                  value={parentForm.address}
                  onChange={(e) => setParentForm({ ...parentForm, address: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white"
                />
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
                  {editingParent ? 'ធ្វើបច្ចុប្បន្នភាព' : 'រក្សាទុក'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Parents;
