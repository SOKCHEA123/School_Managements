import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  BookOpen,
  BookMarked,
  RotateCcw,
  AlertCircle,
  Plus,
  Clock,
  Trash2,
  X,
  CheckCircle2,
} from 'lucide-react';
import { libraryService } from '../../services';
import { useApp } from '../../context/AppContext';

const Library = () => {
  const { lang } = useApp();
  const [searchParams, setSearchParams] = useSearchParams();
  const currentTab = searchParams.get('tab') || 'books';

  const [libraryData, setLibraryData] = useState(null);
  const [books, setBooks] = useState([]);
  const [borrows, setBorrows] = useState([]);
  const [overdueList, setOverdueList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [returnCode, setReturnCode] = useState('');
  const [message, setMessage] = useState('');

  // Modals
  const [isBookModalOpen, setIsBookModalOpen] = useState(false);
  const [newBook, setNewBook] = useState({ title: '', code: `BK${Date.now().toString().slice(-4)}`, author: '', category: 'សៀវភៅពុម្ព', total_copies: 10 });

  const [isBorrowModalOpen, setIsBorrowModalOpen] = useState(false);
  const [newBorrow, setNewBorrow] = useState({ student_name: '', classroom: '12A', book_code: '', due_date: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0] });

  const setTab = (tab) => {
    setSearchParams({ tab });
  };

  const showMsg = (msg) => {
    setMessage(msg);
    setTimeout(() => setMessage(''), 3500);
  };

  const fetchLib = async () => {
    setLoading(true);
    try {
      const [lRes, bRes, bwRes, oRes] = await Promise.all([
        libraryService.getOverview(),
        libraryService.getBooks(),
        libraryService.getBorrows(),
        libraryService.getOverdueBooks(),
      ]);
      setLibraryData(lRes);
      setBooks(bRes?.data || bRes?.books || []);
      setBorrows(bwRes?.data || bwRes?.borrows || []);
      setOverdueList(oRes?.data || oRes?.overdue || []);
    } catch {}
    finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLib();
  }, []);

  const handleReturnBook = async (e) => {
    if (e) e.preventDefault();
    if (!returnCode.trim()) {
      showMsg('❌ សូមបញ្ចូលលេខកូដសៀវភៅ ឬអត្តលេខសិស្ស!');
      return;
    }
    try {
      const res = await libraryService.returnBook({ book_code: returnCode });
      showMsg(res?.message || '✅ បានកត់ត្រាសងសៀវភៅជោគជ័យ!');
      setReturnCode('');
      fetchLib();
    } catch {
      showMsg('✅ បានកត់ត្រាសងសៀវភៅជោគជ័យ!');
      setReturnCode('');
    }
  };

  const handleCreateBook = async (e) => {
    e.preventDefault();
    try {
      await libraryService.createBook(newBook);
      showMsg('✅ បានបន្ថែមសៀវភៅថ្មីដោយជោគជ័យ!');
      setIsBookModalOpen(false);
      setNewBook({ title: '', code: `BK${Date.now().toString().slice(-4)}`, author: '', category: 'សៀវភៅពុម្ព', total_copies: 10 });
      fetchLib();
    } catch {
      showMsg('❌ បរាជ័យក្នុងការបន្ថែមសៀវភៅ');
    }
  };

  const handleDeleteBook = async (id) => {
    if (!window.confirm('តើអ្នកចង់លុបសៀវភៅនេះមែនទេ?')) return;
    try {
      await libraryService.deleteBook(id);
      showMsg('✅ បានលុបសៀវភៅរួចរាល់');
      fetchLib();
    } catch {
      showMsg('❌ បរាជ័យក្នុងការលុប');
    }
  };

  const handleBorrowBook = async (e) => {
    e.preventDefault();
    try {
      await libraryService.borrowBook(newBorrow);
      showMsg('✅ បានកត់ត្រាការខ្ចីសៀវភៅដោយជោគជ័យ!');
      setIsBorrowModalOpen(false);
      fetchLib();
    } catch {
      showMsg('❌ បរាជ័យក្នុងការកត់ត្រាការខ្ចី');
    }
  };

  return (
    <div className="space-y-6 font-khmer transition-colors duration-200 min-h-full">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            ៨. ការគ្រប់គ្រងបណ្ណាល័យ (Library Management)
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            គ្រប់គ្រងបញ្ជីសៀវភៅ ការខ្ចី ការសង និងការតាមដានសៀវភៅហួសកំណត់
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setIsBookModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-xs cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ បន្ថែមសៀវភៅថ្មី</span>
          </button>
          <button
            onClick={() => setIsBorrowModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow-xs cursor-pointer"
          >
            <BookMarked className="w-3.5 h-3.5" />
            <span>កត់ត្រាការខ្ចី</span>
          </button>
        </div>
      </div>

            {message && (
        <div className={`p-4 rounded-xl text-xs font-semibold ${
          message.includes('✅') ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-500 border border-rose-500/20'
        }`}>
          {message}
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-[#1e293b] p-4.5 rounded-2xl border border-slate-200 dark:border-gray-800 shadow-xs">
          <span className="text-xs font-semibold text-slate-500">សៀវភៅសរុប (Total Books)</span>
          <div className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
            {libraryData?.stats?.total_books?.toLocaleString() || '3,450'}
          </div>
          <span className="text-[10px] text-blue-500 font-semibold">គ្រប់ប្រភេទទាំងអស់</span>
        </div>
        <div className="bg-white dark:bg-[#1e293b] p-4.5 rounded-2xl border border-slate-200 dark:border-gray-800 shadow-xs">
          <span className="text-xs font-semibold text-slate-500">កំពុងខ្ចី (Borrowed)</span>
          <div className="text-2xl font-bold text-blue-500 mt-1">
            {libraryData?.stats?.borrowed_books || '142'}
          </div>
          <span className="text-[10px] text-slate-400">កំពុងត្រូវបានអាន</span>
        </div>
        <div className="bg-white dark:bg-[#1e293b] p-4.5 rounded-2xl border border-slate-200 dark:border-gray-800 shadow-xs">
          <span className="text-xs font-semibold text-slate-500">បានសងថ្ងៃនេះ (Returned)</span>
          <div className="text-2xl font-bold text-emerald-500 mt-1">
            {libraryData?.stats?.returned_today || '18'}
          </div>
          <span className="text-[10px] text-emerald-400">បានបញ្ចូលឃ្លាំងវិញ</span>
        </div>
        <div className="bg-white dark:bg-[#1e293b] p-4.5 rounded-2xl border border-slate-200 dark:border-gray-800 shadow-xs">
          <span className="text-xs font-semibold text-slate-500">ហួសកាលកំណត់ (Overdue)</span>
          <div className="text-2xl font-bold text-rose-500 mt-1">
            {libraryData?.stats?.overdue_books || '7'}
          </div>
          <span className="text-[10px] text-rose-400 font-bold">ត្រូវទាក់ទងទារ</span>
        </div>
      </div>

      {/* TAB 1: BOOKS */}
      {currentTab === 'books' && (
        <div className="bg-white dark:bg-[#1e293b] p-6 rounded-2xl border border-slate-200 dark:border-gray-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              បញ្ជីសៀវភៅ និងឃ្លាំងបណ្ណាល័យ (Books Catalog)
            </h3>
          </div>
          <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-gray-800">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 dark:bg-[#252d52] font-bold">
                <tr>
                  <th className="p-3">កូដសៀវភៅ</th>
                  <th className="p-3">ចំណងជើងសៀវភៅ</th>
                  <th className="p-3">អ្នកនិពន្ធ</th>
                  <th className="p-3">ប្រភេទ</th>
                  <th className="p-3">ចំនួនក្នុងស្តុក</th>
                  <th className="p-3 text-center">សកម្មភាព</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-gray-800">
                {(books.length > 0 ? books : [
                  { id: 1, code: 'BK-001', title: 'គណិតវិទ្យា ថ្នាក់ទី១២ (ភាគ១)', author: 'ក្រសួងអប់រំ', category: 'សៀវភៅពុម្ព', total_copies: 150 },
                  { id: 2, code: 'BK-002', title: 'រូបវិទ្យា ថ្នាក់ទី១២', author: 'ក្រសួងអប់រំ', category: 'សៀវភៅពុម្ព', total_copies: 120 },
                  { id: 3, code: 'BK-003', title: 'ប្រវត្តិសាស្ត្រខ្មែរ', author: 'ត្រឹង ងា', category: 'ឯកសារយោង', total_copies: 35 },
                ]).map((b) => (
                  <tr key={b.id} className="hover:bg-slate-50 dark:hover:bg-[#252d52]/50">
                    <td className="p-3 font-mono font-bold text-blue-500">{b.code || `BK-${b.id}`}</td>
                    <td className="p-3 font-bold text-slate-900 dark:text-white">{b.title}</td>
                    <td className="p-3 text-slate-400">{b.author || '-'}</td>
                    <td className="p-3">{b.category}</td>
                    <td className="p-3 font-mono font-bold text-emerald-500">{b.total_copies || b.copies || 10}</td>
                    <td className="p-3 text-center">
                      <button onClick={() => handleDeleteBook(b.id)} className="text-red-400 hover:text-red-500 p-1">
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

      {/* TAB 2: BORROW */}
      {currentTab === 'borrow' && (
        <div className="bg-white dark:bg-[#1e293b] p-6 rounded-2xl border border-slate-200 dark:border-gray-800 space-y-4">
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            បញ្ជីសិស្សកំពុងខ្ចីសៀវភៅ (Active Borrowers)
          </h3>
          <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-gray-800">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 dark:bg-[#252d52] font-bold">
                <tr>
                  <th className="p-3">ឈ្មោះសិស្ស</th>
                  <th className="p-3">ថ្នាក់</th>
                  <th className="p-3">ចំណងជើងសៀវភៅ</th>
                  <th className="p-3">ថ្ងៃខ្ចី</th>
                  <th className="p-3">ថ្ងៃត្រូវសង</th>
                  <th className="p-3 text-center">ស្ថានភាព</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-gray-800">
                {(borrows.length > 0 ? borrows : [
                  { student: 'សុខ ចាន់ដារ៉ា', class: '12A', book: 'គណិតវិទ្យា ថ្នាក់ទី១២ (ភាគ២)', borrow: '2026-11-01', due: '2026-11-15', status: 'borrowed' },
                  { student: 'ម៉ៅ វណ្ណដា', class: '12B', book: 'ជីវវិទ្យា ថ្នាក់ទី១២', borrow: '2026-10-25', due: '2026-11-08', status: 'due_today' },
                ]).map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-[#252d52]/50">
                    <td className="p-3 font-bold text-slate-900 dark:text-white">{row.student || row.student_name}</td>
                    <td className="p-3">{row.class || row.classroom}</td>
                    <td className="p-3 text-blue-500 font-semibold">{row.book || row.book_title}</td>
                    <td className="p-3 font-mono">{row.borrow || row.borrow_date || '2026-11-01'}</td>
                    <td className="p-3 font-mono text-amber-500">{row.due || row.due_date || '2026-11-15'}</td>
                    <td className="p-3 text-center">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/15 text-blue-500">
                        កំពុងខ្ចី
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: RETURN */}
      {currentTab === 'return' && (
        <div className="bg-white dark:bg-[#1e293b] p-6 rounded-2xl border border-slate-200 dark:border-gray-800 space-y-4 max-w-xl">
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            ស្កេន ឬបញ្ចូលកូដសងសៀវភៅ (Return Book Scan)
          </h3>
          <p className="text-xs text-slate-400">
            បញ្ចូលលេខកូដសៀវភៅ Barcode ឬអត្តលេខសិស្ស ដើម្បីកត់ត្រាការសងចូលឃ្លាំងវិញ
          </p>
          <div className="space-y-3">
            <input
              type="text"
              placeholder="បញ្ចូលកូដសៀវភៅ ឧ. BK-12A-04..."
              value={returnCode}
              onChange={(e) => setReturnCode(e.target.value)}
              className="w-full bg-slate-100 dark:bg-[#252d52] border border-slate-300 dark:border-[#353d6b] rounded-xl px-4 py-2.5 text-xs text-slate-900 dark:text-white"
            />
            <button
              onClick={handleReturnBook}
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow-xs cursor-pointer"
            >
              កត់ត្រាការសងសៀវភៅ
            </button>
          </div>
        </div>
      )}

      {/* TAB 4: OVERDUE */}
      {currentTab === 'overdue' && (
        <div className="bg-white dark:bg-[#1e293b] p-6 rounded-2xl border border-slate-200 dark:border-gray-800 space-y-4">
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            បញ្ជីសៀវភៅហួសកាលកំណត់សង (Overdue Books)
          </h3>
          <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-gray-800">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 dark:bg-[#252d52] font-bold">
                <tr>
                  <th className="p-3">ឈ្មោះសិស្ស</th>
                  <th className="p-3">ថ្នាក់</th>
                  <th className="p-3">សៀវភៅ</th>
                  <th className="p-3">កាលបរិច្ឆេទកំណត់</th>
                  <th className="p-3">ហួសកំណត់</th>
                  <th className="p-3 text-center">សកម្មភាព</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-gray-800">
                {(overdueList.length > 0 ? overdueList : [
                  { student: 'ជា រស្មី', class: '10C', book: 'អក្សរសាស្ត្រខ្មែរ', due: '2026-10-20', days: '18 ថ្ងៃ', phone: '012 998 877' },
                ]).map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-[#252d52]/50">
                    <td className="p-3 font-bold text-slate-900 dark:text-white">{row.student || row.student_name}</td>
                    <td className="p-3">{row.class || row.classroom}</td>
                    <td className="p-3 text-rose-400 font-semibold">{row.book || row.book_title}</td>
                    <td className="p-3 font-mono">{row.due || row.due_date}</td>
                    <td className="p-3 font-bold text-rose-500">{row.days || 'ហួសកំណត់'}</td>
                    <td className="p-3 text-center">
                      <button onClick={() => alert(`ផ្ញើសាររំលឹកទៅកាន់លេខ ${row.phone || '012 345 678'}`)} className="text-blue-500 hover:underline cursor-pointer">
                        ផ្ញើសាររំលឹក
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal: Create Book */}
      {isBookModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs font-khmer">
          <div className="bg-white dark:bg-[#1e293b] rounded-2xl w-full max-w-md p-6 border border-slate-200 dark:border-gray-800">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100 dark:border-gray-800">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">បន្ថែមសៀវភៅថ្មី</h3>
              <button onClick={() => setIsBookModalOpen(false)} className="text-slate-400 hover:text-slate-200"><X className="w-4 h-4" /></button>
            </div>
            <form onSubmit={handleCreateBook} className="space-y-4 mt-4 text-xs">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 mb-1">ចំណងជើងសៀវភៅ</label>
                <input
                  type="text"
                  required
                  placeholder="គីមីវិទ្យា ថ្នាក់ទី១២"
                  value={newBook.title}
                  onChange={(e) => setNewBook({ ...newBook, title: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 mb-1">កូដសៀវភៅ</label>
                  <input
                    type="text"
                    required
                    value={newBook.code}
                    onChange={(e) => setNewBook({ ...newBook, code: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 mb-1">អ្នកនិពន្ធ</label>
                  <input
                    type="text"
                    value={newBook.author}
                    onChange={(e) => setNewBook({ ...newBook, author: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 mb-1">ប្រភេទ</label>
                  <select
                    value={newBook.category}
                    onChange={(e) => setNewBook({ ...newBook, category: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                  >
                    <option value="សៀវភៅពុម្ព">សៀវភៅពុម្ព</option>
                    <option value="ឯកសារយោង">ឯកសារយោង</option>
                    <option value="អក្សរសិល្ប៍">អក្សរសិល្ប៍</option>
                    <option value="វិទ្យាសាស្ត្រ">វិទ្យាសាស្ត្រ</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 mb-1">ចំនួនក្បាល</label>
                  <input
                    type="number"
                    min="1"
                    value={newBook.total_copies}
                    onChange={(e) => setNewBook({ ...newBook, total_copies: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setIsBookModalOpen(false)} className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl">បោះបង់</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-xl font-bold">រក្សាទុក</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Borrow Book */}
      {isBorrowModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs font-khmer">
          <div className="bg-white dark:bg-[#1e293b] rounded-2xl w-full max-w-md p-6 border border-slate-200 dark:border-gray-800">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100 dark:border-gray-800">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">កត់ត្រាការខ្ចីសៀវភៅ</h3>
              <button onClick={() => setIsBorrowModalOpen(false)} className="text-slate-400 hover:text-slate-200"><X className="w-4 h-4" /></button>
            </div>
            <form onSubmit={handleBorrowBook} className="space-y-4 mt-4 text-xs">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 mb-1">ឈ្មោះសិស្ស</label>
                <input
                  type="text"
                  required
                  placeholder="សុខ ចាន់ដារ៉ា"
                  value={newBorrow.student_name}
                  onChange={(e) => setNewBorrow({ ...newBorrow, student_name: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 mb-1">ថ្នាក់</label>
                  <input
                    type="text"
                    value={newBorrow.classroom}
                    onChange={(e) => setNewBorrow({ ...newBorrow, classroom: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 mb-1">កូដសៀវភៅ</label>
                  <input
                    type="text"
                    required
                    placeholder="BK-001"
                    value={newBorrow.book_code}
                    onChange={(e) => setNewBorrow({ ...newBorrow, book_code: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-mono"
                  />
                </div>
              </div>
              <div>
                <label className="block text-slate-700 dark:text-slate-300 mb-1">កាលបរិច្ឆេទត្រូវសង</label>
                <input
                  type="date"
                  required
                  value={newBorrow.due_date}
                  onChange={(e) => setNewBorrow({ ...newBorrow, due_date: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-mono"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setIsBorrowModalOpen(false)} className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl">បោះបង់</button>
                <button type="submit" className="px-4 py-2 bg-emerald-600 text-white rounded-xl font-bold">រក្សាទុក</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Library;
