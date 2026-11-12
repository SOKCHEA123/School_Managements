import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  ShieldAlert,
  ArrowRightLeft,
  Award,
  FolderOpen,
  Printer,
  Plus,
  Trash2,
  X,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { studentServicesService } from '../../services';
import { useApp } from '../../context/AppContext';

const StudentServices = () => {
  const { lang } = useApp();
  const [searchParams, setSearchParams] = useSearchParams();
  const currentTab = searchParams.get('tab') || 'promotion';

  const [data, setData] = useState(null);
  const [transfers, setTransfers] = useState([]);
  const [disciplines, setDisciplines] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  // Modals
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const [newTransfer, setNewTransfer] = useState({
    student_name: '',
    code: `STU${Date.now().toString().slice(-4)}`,
    type: 'transfer_in',
    school: '',
    classroom: '11A',
    date: new Date().toISOString().split('T')[0],
  });

  const [isDisciplineModalOpen, setIsDisciplineModalOpen] = useState(false);
  const [newDiscipline, setNewDiscipline] = useState({
    student_name: '',
    classroom: '12A',
    infraction: '',
    severity: 'ស្រាល',
    date: new Date().toISOString().split('T')[0],
  });

  const [isCertModalOpen, setIsCertModalOpen] = useState(false);
  const [newCert, setNewCert] = useState({
    student_name: '',
    classroom: '12A',
    certificate_type: 'លិខិតបញ្ជាក់ការសិក្សា',
    issue_date: new Date().toISOString().split('T')[0],
  });

  const setTab = (tab) => {
    setSearchParams({ tab });
  };

  const showMsg = (msg) => {
    setMessage(msg);
    setTimeout(() => setMessage(''), 3500);
  };

  const fetchServicesData = async () => {
    setLoading(true);
    try {
      const [sRes, tRes, disRes, cRes, dRes] = await Promise.all([
        studentServicesService.getOverview(),
        studentServicesService.getTransfers(),
        studentServicesService.getDisciplines(),
        studentServicesService.getCertificates(),
        studentServicesService.getDocuments(),
      ]);
      setData(sRes);
      setTransfers(tRes?.data || tRes?.transfers || []);
      setDisciplines(disRes?.data || disRes?.disciplines || []);
      setCertificates(cRes?.data || cRes?.certificates || []);
      setDocuments(dRes?.data || dRes?.documents || []);
    } catch (err) {
      console.warn('Error fetching student services', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServicesData();
  }, []);

  const handlePromoteStudents = async () => {
    if (!window.confirm('តើអ្នកពិតជាចង់ដំណើរការឡើងថ្នាក់ស្វ័យប្រវត្តិមែនទេ?')) return;
    try {
      const res = await studentServicesService.promoteStudents();
      showMsg('✅ បានដំណើរការឡើងថ្នាក់សិស្សដោយជោគជ័យ!');
      fetchServicesData();
    } catch {
      showMsg('❌ បរាជ័យក្នុងការដំណើរការឡើងថ្នាក់');
    }
  };

  const handleCreateTransfer = async (e) => {
    e.preventDefault();
    try {
      await studentServicesService.createTransfer(newTransfer);
      showMsg('✅ បានចុះឈ្មោះផ្ទេរការសិក្សាដោយជោគជ័យ!');
      setIsTransferModalOpen(false);
      setNewTransfer({ student_name: '', code: `STU${Date.now().toString().slice(-4)}`, type: 'transfer_in', school: '', classroom: '11A', date: new Date().toISOString().split('T')[0] });
      fetchServicesData();
    } catch {
      showMsg('❌ បរាជ័យក្នុងការចុះឈ្មោះផ្ទេរ');
    }
  };

  const handleDeleteTransfer = async (id) => {
    if (!window.confirm('តើអ្នកចង់លុបកំណត់ត្រានេះមែនទេ?')) return;
    try {
      await studentServicesService.deleteTransfer(id);
      showMsg('✅ បានលុបកំណត់ត្រាផ្ទេរការសិក្សា');
      fetchServicesData();
    } catch {
      showMsg('❌ បរាជ័យក្នុងការលុប');
    }
  };

  const handleCreateDiscipline = async (e) => {
    e.preventDefault();
    try {
      await studentServicesService.createDiscipline(newDiscipline);
      showMsg('✅ បានកត់ត្រាកំហុសវិន័យដោយជោគជ័យ!');
      setIsDisciplineModalOpen(false);
      setNewDiscipline({ student_name: '', classroom: '12A', infraction: '', severity: 'ស្រាល', date: new Date().toISOString().split('T')[0] });
      fetchServicesData();
    } catch {
      showMsg('❌ បរាជ័យក្នុងការកត់ត្រាវិន័យ');
    }
  };

  const handleDeleteDiscipline = async (id) => {
    if (!window.confirm('តើអ្នកចង់លុបករណីវិន័យនេះមែនទេ?')) return;
    try {
      await studentServicesService.deleteDiscipline(id);
      showMsg('✅ បានលុបកំណត់ត្រាវិន័យ');
      fetchServicesData();
    } catch {
      showMsg('❌ បរាជ័យក្នុងការលុប');
    }
  };

  const handleCreateCert = async (e) => {
    e.preventDefault();
    try {
      await studentServicesService.createCertificate(newCert);
      showMsg('✅ បានចេញលិខិតបញ្ជាក់ដោយជោគជ័យ!');
      setIsCertModalOpen(false);
      fetchServicesData();
    } catch {
      showMsg('❌ បរាជ័យក្នុងការចេញលិខិត');
    }
  };

  return (
    <div className="space-y-6 font-khmer transition-colors duration-200 min-h-full">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            ៦. សេវាកម្មសិស្ស (Student Services)
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            ការឡើងថ្នាក់ ការផ្ទេរការសិក្សា វិន័យសិស្ស លិខិតបញ្ជាក់ការសិក្សា និងសំណុំឯកសារ
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 dark:border-gray-800 pb-3">
        {[
          { key: 'promotion', label: 'ការឡើងថ្នាក់ (Promotion)', icon: Award },
          { key: 'transfer', label: 'ការផ្ទេរការសិក្សា (Transfer)', icon: ArrowRightLeft },
          { key: 'discipline', label: 'វិន័យ & ការព្រមាន (Discipline)', icon: ShieldAlert },
          { key: 'certificates', label: 'លិខិតបញ្ជាក់ការសិក្សា (Certificates)', icon: Award },
          { key: 'documents', label: 'សំណុំឯកសារសិស្ស (Documents)', icon: FolderOpen },
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

      {/* TAB 1: PROMOTION */}
      {currentTab === 'promotion' && (
        <div className="bg-white dark:bg-[#1e293b] p-6 rounded-2xl border border-slate-200 dark:border-gray-800 space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                ការឡើងថ្នាក់សិស្សសម្រាប់ឆ្នាំសិក្សាថ្មី (Academic Promotion Engine)
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                ដំណើរការឡើងថ្នាក់ស្វ័យប្រវត្តិតាមលក្ខខណ្ឌមធ្យមភាគពិន្ទុ និងវត្តមាន
              </p>
            </div>
            <button
              onClick={handlePromoteStudents}
              className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow-xs cursor-pointer"
            >
              ដំណើរការឡើងថ្នាក់រួម
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-slate-100 dark:bg-[#252d52]">
              <div className="text-xs text-slate-400">សិស្សគ្រប់លក្ខខណ្ឌឡើងថ្នាក់</div>
              <div className="text-2xl font-bold text-emerald-500 mt-1">
                {data?.promotions_eligible || 820} / 850 នាក់
              </div>
              <div className="text-xs text-emerald-400 mt-1">96.5% នៃសិស្សទាំងអស់</div>
            </div>
            <div className="p-4 rounded-xl bg-slate-100 dark:bg-[#252d52]">
              <div className="text-xs text-slate-400">សិស្សត្រូវប្រឡងសង (Re-exam)</div>
              <div className="text-2xl font-bold text-amber-500 mt-1">
                {data?.re_exam_students || 22} នាក់
              </div>
              <div className="text-xs text-slate-400 mt-1">ពិន្ទុមធ្យមភាគ 45 - 49.9</div>
            </div>
            <div className="p-4 rounded-xl bg-slate-100 dark:bg-[#252d52]">
              <div className="text-xs text-slate-400">សិស្សត្រួតថ្នាក់ (Retain)</div>
              <div className="text-2xl font-bold text-rose-500 mt-1">
                {data?.retained_students || 8} នាក់
              </div>
              <div className="text-xs text-slate-400 mt-1">អវត្តមានលើសកម្រិតកំណត់</div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: TRANSFER */}
      {currentTab === 'transfer' && (
        <div className="bg-white dark:bg-[#1e293b] p-6 rounded-2xl border border-slate-200 dark:border-gray-800 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                ការផ្ទេរការសិក្សា (Student Transfer Records)
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                កត់ត្រាសិស្សផ្ទេរចូលពីវិទ្យាល័យផ្សេង និងសិស្សផ្ទេរចេញ
              </p>
            </div>
            <button
              onClick={() => setIsTransferModalOpen(true)}
              className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ ចុះឈ្មោះផ្ទេរការសិក្សា</span>
            </button>
          </div>

          <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-gray-800">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 dark:bg-[#252d52] font-bold">
                <tr>
                  <th className="p-3">អត្តលេខ</th>
                  <th className="p-3">ឈ្មោះសិស្ស</th>
                  <th className="p-3">ប្រភេទ</th>
                  <th className="p-3">សាលារៀនប្រភព/គោលដៅ</th>
                  <th className="p-3">ថ្នាក់រៀន</th>
                  <th className="p-3">កាលបរិច្ឆេទ</th>
                  <th className="p-3 text-center">សកម្មភាព</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-gray-800">
                {(transfers.length > 0 ? transfers : [
                  { id: 1, code: 'STU7590', student_name: 'ម៉ៅ វណ្ណដេត', type: 'transfer_in', school: 'វិទ្យាល័យ ព្រះមហាក្សត្រីយានី (ក្រចេះ)', classroom: '11A', date: '2026-11-01' },
                  { id: 2, code: 'STU6820', student_name: 'ចាន់ ស្រីនាង', type: 'transfer_out', school: 'វិទ្យាល័យ ហ៊ុន សែន មិត្តភាព (ភ្នំពេញ)', classroom: '10B', date: '2026-10-25' },
                ]).map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-[#252d52]/50">
                    <td className="p-3 font-mono font-bold text-blue-500">{row.code || `STU${row.id}`}</td>
                    <td className="p-3 font-bold text-slate-900 dark:text-white">{row.student_name || row.name}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        row.type === 'transfer_in' ? 'bg-emerald-500/15 text-emerald-500' : 'bg-blue-500/15 text-blue-500'
                      }`}>
                        {row.type === 'transfer_in' ? 'ផ្ទេរចូល' : 'ផ្ទេរចេញ'}
                      </span>
                    </td>
                    <td className="p-3">{row.school}</td>
                    <td className="p-3">{row.classroom || row.class}</td>
                    <td className="p-3 font-mono">{row.date}</td>
                    <td className="p-3 text-center">
                      <button onClick={() => handleDeleteTransfer(row.id)} className="text-red-400 hover:text-red-500 p-1">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: DISCIPLINE */}
      {currentTab === 'discipline' && (
        <div className="bg-white dark:bg-[#1e293b] p-6 rounded-2xl border border-slate-200 dark:border-gray-800 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                ការគ្រប់គ្រងវិន័យ និងការព្រមាន (Discipline & Infractions)
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                កត់ត្រាករណីល្មើសវិន័យសាលា ការអញ្ជើញអាណាព្យាបាល និងកិច្ចសន្យាកែលម្អ
              </p>
            </div>
            <button
              onClick={() => setIsDisciplineModalOpen(true)}
              className="px-3.5 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ កត់ត្រាកំហុសវិន័យ</span>
            </button>
          </div>

          <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-gray-800">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 dark:bg-[#252d52] font-bold">
                <tr>
                  <th className="p-3">ឈ្មោះសិស្ស</th>
                  <th className="p-3">ថ្នាក់</th>
                  <th className="p-3">ប្រភេទបទល្មើស</th>
                  <th className="p-3">កម្រិតធ្ងន់ធ្ងរ</th>
                  <th className="p-3">កាលបរិច្ឆេទ</th>
                  <th className="p-3 text-center">ស្ថានភាព</th>
                  <th className="p-3 text-center">សកម្មភាព</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-gray-800">
                {(disciplines.length > 0 ? disciplines : [
                  { id: 1, student_name: 'សុខ ចាន់ដារ៉ា', classroom: '12A', infraction: 'គេចសាលាម៉ោងទី ៣', severity: 'ស្រាល', date: '2026-11-05', status: 'warned' },
                  { id: 2, student_name: 'កែវ វិសាល', classroom: '11B', infraction: 'មិនពាក់ឯកសណ្ឋានសាលា', severity: 'ស្រាល', date: '2026-11-06', status: 'resolved' },
                ]).map((d, idx) => (
                  <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-[#252d52]/50">
                    <td className="p-3 font-bold text-slate-900 dark:text-white">{d.student_name}</td>
                    <td className="p-3">{d.classroom}</td>
                    <td className="p-3 text-rose-400 font-semibold">{d.infraction}</td>
                    <td className="p-3">{d.severity}</td>
                    <td className="p-3 font-mono">{d.date}</td>
                    <td className="p-3 text-center">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/15 text-amber-500">
                        {d.status === 'resolved' ? 'ដោះស្រាយរួច' : 'បានព្រមាន'}
                      </span>
                    </td>
                    <td className="p-3 text-center">
                      <button onClick={() => handleDeleteDiscipline(d.id)} className="text-red-400 hover:text-red-500 p-1">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: CERTIFICATES */}
      {currentTab === 'certificates' && (
        <div className="bg-white dark:bg-[#1e293b] p-6 rounded-2xl border border-slate-200 dark:border-gray-800 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                លិខិតបញ្ជាក់ការសិក្សា (Academic Certificates)
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                ចេញលិខិតបញ្ជាក់ការសិក្សា លិខិតបញ្ជាក់អត្តសញ្ញាណ និងលិខិតសរសើរ
              </p>
            </div>
            <button
              onClick={() => setIsCertModalOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-xs cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>ចេញលិខិតបញ្ជាក់ថ្មី</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl bg-slate-100 dark:bg-[#252d52] border border-slate-200 dark:border-[#333d6d]">
              <div className="text-sm font-bold text-slate-900 dark:text-white">លិខិតបញ្ជាក់ការសិក្សា (Study Certificate)</div>
              <p className="text-xs text-slate-400 mt-1">បញ្ជាក់ថាសិស្សពិតជាកំពុងសិក្សានៅវិទ្យាល័យ ហ៊ុន សែន ស្នួល ក្នុងឆ្នាំសិក្សា ២០២៥-២០២៦</p>
              <button
                onClick={() => alert('កំពុងដំណើរការបោះពុម្ពលិខិត...')}
                className="mt-4 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold cursor-pointer"
              >
                បោះពុម្ពលិខិត
              </button>
            </div>

            <div className="p-5 rounded-2xl bg-slate-100 dark:bg-[#252d52] border border-slate-200 dark:border-[#333d6d]">
              <div className="text-sm font-bold text-slate-900 dark:text-white">លិខិតសរសើរសិស្សពូកែ (Certificate of Honor)</div>
              <p className="text-xs text-slate-400 mt-1">ចេញជូនសិស្សានុសិស្សដែលទទួលបានចំណាត់ថ្នាក់ល្អប្រសើរប្រចាំខែ និងឆមាស</p>
              <button
                onClick={() => alert('កំពុងដំណើរការបោះពុម្ពលិខិតសរសើរ...')}
                className="mt-4 px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-semibold cursor-pointer"
              >
                បោះពុម្ពលិខិតសរសើរ
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: DOCUMENTS */}
      {currentTab === 'documents' && (
        <div className="bg-white dark:bg-[#1e293b] p-6 rounded-2xl border border-slate-200 dark:border-gray-800 space-y-4">
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            សំណុំឯកសារសិស្ស (Student Document Archives)
          </h3>
          <p className="text-xs text-slate-400">
            គ្រប់គ្រងសំបុត្រកំណើត សៀវភៅស្នាក់នៅ និងសញ្ញាបត្របឋម/ឌីប្លូមរបស់សិស្ស
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-slate-100 dark:bg-[#252d52]">
              <div className="text-xs text-slate-400">សំបុត្រកំណើតដែលបានផ្ទៀងផ្ទាត់</div>
              <div className="text-xl font-bold text-emerald-500 mt-1">842 / 850 ច្បាប់</div>
            </div>
            <div className="p-4 rounded-xl bg-slate-100 dark:bg-[#252d52]">
              <div className="text-xs text-slate-400">សញ្ញាបត្របឋមសិក្សា / ឌីប្លូម</div>
              <div className="text-xl font-bold text-blue-500 mt-1">830 ច្បាប់</div>
            </div>
            <div className="p-4 rounded-xl bg-slate-100 dark:bg-[#252d52]">
              <div className="text-xs text-slate-400">ឯកសារនៅខ្វះ (Pending)</div>
              <div className="text-xl font-bold text-rose-500 mt-1">8 សំណុំរឿង</div>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Transfer */}
      {isTransferModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs font-khmer">
          <div className="bg-white dark:bg-[#1e293b] rounded-2xl w-full max-w-md p-6 border border-slate-200 dark:border-gray-800">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100 dark:border-gray-800">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">ចុះឈ្មោះផ្ទេរការសិក្សា</h3>
              <button onClick={() => setIsTransferModalOpen(false)} className="text-slate-400 hover:text-slate-200"><X className="w-4 h-4" /></button>
            </div>
            <form onSubmit={handleCreateTransfer} className="space-y-4 mt-4 text-xs">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 mb-1">ឈ្មោះសិស្ស</label>
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
                <label className="block text-slate-700 dark:text-slate-300 mb-1">សាលារៀនប្រភព ឬគោលដៅ</label>
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
                <button type="button" onClick={() => setIsTransferModalOpen(false)} className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl">បោះបង់</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-xl font-bold">រក្សាទុក</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Discipline */}
      {isDisciplineModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs font-khmer">
          <div className="bg-white dark:bg-[#1e293b] rounded-2xl w-full max-w-md p-6 border border-slate-200 dark:border-gray-800">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100 dark:border-gray-800">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">កត់ត្រាកំហុសវិន័យ</h3>
              <button onClick={() => setIsDisciplineModalOpen(false)} className="text-slate-400 hover:text-slate-200"><X className="w-4 h-4" /></button>
            </div>
            <form onSubmit={handleCreateDiscipline} className="space-y-4 mt-4 text-xs">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 mb-1">ឈ្មោះសិស្ស</label>
                <input
                  type="text"
                  required
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
                <label className="block text-slate-700 dark:text-slate-300 mb-1">បទល្មើស</label>
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
                <button type="button" onClick={() => setIsDisciplineModalOpen(false)} className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl">បោះបង់</button>
                <button type="submit" className="px-4 py-2 bg-rose-600 text-white rounded-xl font-bold">រក្សាទុក</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Certificate */}
      {isCertModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs font-khmer">
          <div className="bg-white dark:bg-[#1e293b] rounded-2xl w-full max-w-md p-6 border border-slate-200 dark:border-gray-800">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100 dark:border-gray-800">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">ចេញលិខិតបញ្ជាក់ការសិក្សា</h3>
              <button onClick={() => setIsCertModalOpen(false)} className="text-slate-400 hover:text-slate-200"><X className="w-4 h-4" /></button>
            </div>
            <form onSubmit={handleCreateCert} className="space-y-4 mt-4 text-xs">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 mb-1">ឈ្មោះសិស្ស</label>
                <input
                  type="text"
                  required
                  placeholder="សុខ ចាន់ដារ៉ា"
                  value={newCert.student_name}
                  onChange={(e) => setNewCert({ ...newCert, student_name: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                />
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
                <button type="button" onClick={() => setIsCertModalOpen(false)} className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl">បោះបង់</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-xl font-bold">ចេញលិខិត</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentServices;
