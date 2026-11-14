import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  CreditCard,
  FileText,
  PieChart,
  Receipt,
  Plus,
  Printer,
  Trash2,
  X,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { financeService } from '../../services';
import { useApp } from '../../context/AppContext';

const Finance = () => {
  const { lang } = useApp();
  const [searchParams, setSearchParams] = useSearchParams();
  const currentTab = searchParams.get('tab') || 'fees';

  const [financeData, setFinanceData] = useState(null);
  const [fees, setFees] = useState([]);
  const [payments, setPayments] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [incomeList, setIncomeList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  // Modals
  const [isIncomeModalOpen, setIsIncomeModalOpen] = useState(false);
  const [newIncome, setNewIncome] = useState({ title: '', amount: '', source: 'សប្បុរសជន', date: new Date().toISOString().split('T')[0] });

  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [newExpense, setNewExpense] = useState({ title: '', amount: '', category: 'ថែទាំ', payer: 'រដ្ឋបាល', date: new Date().toISOString().split('T')[0] });

  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [newPayment, setNewPayment] = useState({ student: '', class: '12A', type: 'វិភាគទានសមាគម', amount: '20,000 KHR', date: new Date().toISOString().split('T')[0] });

  const setTab = (tab) => {
    setSearchParams({ tab });
  };

  const showMsg = (msg) => {
    setMessage(msg);
    setTimeout(() => setMessage(''), 3500);
  };

  const fetchFinanceData = async () => {
    setLoading(true);
    try {
      const [fRes, feeRes, pRes, eRes, iRes] = await Promise.all([
        financeService.getOverview(),
        financeService.getFees(),
        financeService.getPayments(),
        financeService.getExpenses(),
        financeService.getIncome(),
      ]);
      setFinanceData(fRes);
      setFees(feeRes?.data || feeRes?.fees || fRes?.fee_categories || []);
      setPayments(pRes?.data || pRes?.payments || []);
      setExpenses(eRes?.data || eRes?.expenses || []);
      setIncomeList(iRes?.data || iRes?.income || []);
    } catch (err) {
      console.warn('Error loading finance', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFinanceData();
  }, []);

  const handleCreateIncome = async (e) => {
    e.preventDefault();
    try {
      await financeService.createIncome(newIncome);
      showMsg('✅ បានកត់ត្រាចំណូលដោយជោគជ័យ!');
      setIsIncomeModalOpen(false);
      setNewIncome({ title: '', amount: '', source: 'សប្បុរសជន', date: new Date().toISOString().split('T')[0] });
      fetchFinanceData();
    } catch {
      showMsg('❌ បរាជ័យក្នុងការកត់ត្រាចំណូល');
    }
  };

  const handleCreateExpense = async (e) => {
    e.preventDefault();
    try {
      await financeService.createExpense(newExpense);
      showMsg('✅ បានកត់ត្រាចំណាយដោយជោគជ័យ!');
      setIsExpenseModalOpen(false);
      setNewExpense({ title: '', amount: '', category: 'ថែទាំ', payer: 'រដ្ឋបាល', date: new Date().toISOString().split('T')[0] });
      fetchFinanceData();
    } catch {
      showMsg('❌ បរាជ័យក្នុងការកត់ត្រាចំណាយ');
    }
  };

  const handleCreatePayment = async (e) => {
    e.preventDefault();
    try {
      await financeService.createPayment(newPayment);
      showMsg('✅ បានចេញវិក្កយបត្របង់ប្រាក់ដោយជោគជ័យ!');
      setIsPaymentModalOpen(false);
      fetchFinanceData();
    } catch {
      showMsg('❌ បរាជ័យក្នុងការចេញវិក្កយបត្រ');
    }
  };

  const handleDeleteExpense = async (id) => {
    if (!window.confirm('តើអ្នកចង់លុបចំណាយនេះមែនទេ?')) return;
    try {
      await financeService.deleteExpense(id);
      showMsg('✅ បានលុបកំណត់ត្រាចំណាយរួចរាល់');
      fetchFinanceData();
    } catch {
      showMsg('❌ បរាជ័យក្នុងការលុប');
    }
  };

  return (
    <div className="space-y-6 font-khmer transition-colors duration-200 min-h-full">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            ៧. ការគ្រប់គ្រងហិរញ្ញវត្ថុ (Finance Management)
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            កម្រៃសិក្សា កំណត់ត្រាបង់ប្រាក់ ចំណូល ចំណាយ និងរបាយការណ៍សវនកម្ម
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setIsIncomeModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow-xs cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ កត់ត្រាចំណូល</span>
          </button>
          <button
            onClick={() => setIsExpenseModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-semibold shadow-xs cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ កត់ត្រាចំណាយ</span>
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

      {/* Top Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-[#1e293b] p-5 rounded-2xl border border-slate-200 dark:border-gray-800 shadow-xs">
          <div className="text-xs font-semibold text-slate-500">ចំណូលសរុប (Total Income)</div>
          <div className="text-2xl font-bold text-emerald-500 mt-2">$12,500.00</div>
          <div className="text-[11px] text-slate-400 mt-1">មូលនិធិសមាគម + ជំនួយសប្បុរសធម៌</div>
        </div>
        <div className="bg-white dark:bg-[#1e293b] p-5 rounded-2xl border border-slate-200 dark:border-gray-800 shadow-xs">
          <div className="text-xs font-semibold text-slate-500">ចំណាយសរុប (Total Expenses)</div>
          <div className="text-2xl font-bold text-rose-500 mt-2">$4,300.00</div>
          <div className="text-[11px] text-slate-400 mt-1">ជួសជុលបន្ទប់រៀន & ថ្លៃទឹកភ្លើង</div>
        </div>
        <div className="bg-white dark:bg-[#1e293b] p-5 rounded-2xl border border-slate-200 dark:border-gray-800 shadow-xs">
          <div className="text-xs font-semibold text-slate-500">សមតុល្យមូលនិធិ (Net Balance)</div>
          <div className="text-2xl font-bold text-blue-500 mt-2">$8,200.00</div>
          <div className="text-[11px] text-emerald-400 mt-1">ស្ថានភាពហិរញ្ញវត្ថុមានស្ថិរភាព</div>
        </div>
      </div>

      {/* TAB 1: FEES */}
      {currentTab === 'fees' && (
        <div className="bg-white dark:bg-[#1e293b] p-6 rounded-2xl border border-slate-200 dark:border-gray-800 space-y-4">
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            កម្រៃសិក្សា និងវិភាគទានសមាគមមាតាបិតា (Fee Categories)
          </h3>
          <div className="space-y-3">
            {(fees.length > 0 ? fees : [
              { name: 'វិភាគទានសមាគមមាតាបិតា (PTA Fund)', amount: '20,000 KHR / ឆ្នាំ', collected: '85%' },
              { name: 'សៀវភៅតាមដាន & កាតសិស្ស', amount: '10,000 KHR', collected: '98%' },
              { name: 'ឯកសណ្ឋានកីឡាប្រចាំសាលា', amount: '25,000 KHR', collected: '90%' },
            ]).map((fee, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-slate-100 dark:bg-[#252d52] flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white">{fee.name || fee.title}</div>
                  <div className="text-xs text-blue-500 font-mono font-bold mt-1">{fee.amount}</div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-emerald-400">ប្រមូលបាន {fee.collected || '90%'}</span>
                  <div className="w-28 bg-slate-200 dark:bg-gray-700 h-2 rounded-full mt-1.5 overflow-hidden">
                    <div className="bg-emerald-500 h-full" style={{ width: fee.collected || '90%' }}></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: PAYMENTS */}
      {currentTab === 'payments' && (
        <div className="bg-white dark:bg-[#1e293b] p-6 rounded-2xl border border-slate-200 dark:border-gray-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              កំណត់ត្រាបង់ប្រាក់ និងវិក្កយបត្រ (Payment Records & Receipts)
            </h3>
            <button
              onClick={() => setIsPaymentModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold cursor-pointer"
            >
              <Receipt className="w-3.5 h-3.5" />
              <span>ចេញវិក្កយបត្រថ្មី</span>
            </button>
          </div>

          <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-gray-800">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 dark:bg-[#252d52] font-bold">
                <tr>
                  <th className="p-3">លេខវិក្កយបត្រ</th>
                  <th className="p-3">ឈ្មោះសិស្ស</th>
                  <th className="p-3">ថ្នាក់</th>
                  <th className="p-3">ប្រភេទបង់</th>
                  <th className="p-3">ចំនួនទឹកប្រាក់</th>
                  <th className="p-3">កាលបរិច្ឆេទ</th>
                  <th className="p-3 text-center">សកម្មភាព</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-gray-800">
                {(payments.length > 0 ? payments : [
                  { id: 'INV-2026-001', student: 'សុខ ចាន់ដារ៉ា', class: '12A', type: 'វិភាគទានសមាគម', amount: '20,000 KHR', date: '2026-11-07' },
                  { id: 'INV-2026-002', student: 'កែវ វិសាល', class: '11B', type: 'កាតសិស្ស & សៀវភៅតាមដាន', amount: '10,000 KHR', date: '2026-11-06' },
                ]).map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-[#252d52]/50">
                    <td className="p-3 font-mono font-bold text-blue-500">{row.id || `INV-${idx + 1}`}</td>
                    <td className="p-3 font-bold text-slate-900 dark:text-white">{row.student || row.student_name}</td>
                    <td className="p-3">{row.class || row.classroom}</td>
                    <td className="p-3">{row.type}</td>
                    <td className="p-3 font-mono font-bold text-emerald-500">{row.amount}</td>
                    <td className="p-3 font-mono">{row.date}</td>
                    <td className="p-3 text-center">
                      <button onClick={() => alert('កំពុងបោះពុម្ពវិក្កយបត្រ...')} className="text-blue-500 hover:underline cursor-pointer">
                        បោះពុម្ព
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: EXPENSES */}
      {currentTab === 'expenses' && (
        <div className="bg-white dark:bg-[#1e293b] p-6 rounded-2xl border border-slate-200 dark:border-gray-800 space-y-4">
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            ចំណាយប្រតិបត្តិការសាលា (School Expenses)
          </h3>
          <div className="divide-y divide-slate-200 dark:divide-gray-800">
            {(expenses.length > 0 ? expenses : [
              { id: 1, title: 'ទិញសម្ភារៈពិសោធន៍វិទ្យាសាស្ត្រ (គីមី & រូបវិទ្យា)', amount: '- $250.00', date: '2026-11-06', payer: 'គណៈកម្មការសាលា' },
              { id: 2, title: 'ជួសជុលកង្ហារ និងភ្លើងបន្ទប់រៀន 11B & 10C', amount: '- 80,000 KHR', date: '2026-11-05', payer: 'ផ្នែកថែទាំ' },
              { id: 3, title: 'ថ្លៃទឹកស្អាត និងអគ្គិសនីប្រចាំខែតុលា', amount: '- 320,000 KHR', date: '2026-11-02', payer: 'រដ្ឋបាល' },
            ]).map((exp, idx) => (
              <div key={idx} className="py-3 flex items-center justify-between text-xs">
                <div>
                  <div className="font-bold text-slate-900 dark:text-white">{exp.title}</div>
                  <div className="text-slate-400 mt-0.5">ចំណាយដោយ: {exp.payer || 'រដ្ឋបាល'} • {exp.date}</div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-mono font-bold text-rose-500 text-sm">{exp.amount}</span>
                  <button onClick={() => handleDeleteExpense(exp.id)} className="text-red-400 hover:text-red-500 p-1">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: INCOME */}
      {currentTab === 'income' && (
        <div className="bg-white dark:bg-[#1e293b] p-6 rounded-2xl border border-slate-200 dark:border-gray-800 space-y-4">
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            ចំណូល និងមូលនិធិសប្បុរសធម៌ (School Incomes & Grants)
          </h3>
          <div className="divide-y divide-slate-200 dark:divide-gray-800">
            {(incomeList.length > 0 ? incomeList : [
              { id: 1, title: 'ជំនួយសប្បុរសធម៌សាងសង់តារាងបាល់ទះ', amount: '+ $1,200.00', source: 'អតីតសិស្ស', date: '2026-11-01' },
              { id: 2, title: 'មូលនិធិសមាគមមាតាបិតាប្រចាំឆ្នាំ', amount: '+ $3,500.00', source: 'មាតាបិតាសិស្ស', date: '2026-10-28' },
            ]).map((inc, idx) => (
              <div key={idx} className="py-3 flex items-center justify-between text-xs">
                <div>
                  <div className="font-bold text-slate-900 dark:text-white">{inc.title}</div>
                  <div className="text-slate-400 mt-0.5">ប្រភព: {inc.source} • {inc.date}</div>
                </div>
                <span className="font-mono font-bold text-emerald-500 text-sm">{inc.amount}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal: Record Income */}
      {isIncomeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs font-khmer">
          <div className="bg-white dark:bg-[#1e293b] rounded-2xl w-full max-w-md p-6 border border-slate-200 dark:border-gray-800">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100 dark:border-gray-800">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">កត់ត្រាចំណូលថ្មី</h3>
              <button onClick={() => setIsIncomeModalOpen(false)} className="text-slate-400 hover:text-slate-200"><X className="w-4 h-4" /></button>
            </div>
            <form onSubmit={handleCreateIncome} className="space-y-4 mt-4 text-xs">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 mb-1">បរិយាយចំណូល</label>
                <input
                  type="text"
                  required
                  placeholder="ជំនួយសប្បុរសធម៌..."
                  value={newIncome.title}
                  onChange={(e) => setNewIncome({ ...newIncome, title: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 mb-1">ចំនួនទឹកប្រាក់</label>
                  <input
                    type="text"
                    required
                    placeholder="+ $500.00"
                    value={newIncome.amount}
                    onChange={(e) => setNewIncome({ ...newIncome, amount: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 mb-1">ប្រភព</label>
                  <input
                    type="text"
                    value={newIncome.source}
                    onChange={(e) => setNewIncome({ ...newIncome, source: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setIsIncomeModalOpen(false)} className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl">បោះបង់</button>
                <button type="submit" className="px-4 py-2 bg-emerald-600 text-white rounded-xl font-bold">រក្សាទុក</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Record Expense */}
      {isExpenseModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs font-khmer">
          <div className="bg-white dark:bg-[#1e293b] rounded-2xl w-full max-w-md p-6 border border-slate-200 dark:border-gray-800">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100 dark:border-gray-800">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">កត់ត្រាចំណាយថ្មី</h3>
              <button onClick={() => setIsExpenseModalOpen(false)} className="text-slate-400 hover:text-slate-200"><X className="w-4 h-4" /></button>
            </div>
            <form onSubmit={handleCreateExpense} className="space-y-4 mt-4 text-xs">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 mb-1">បរិយាយចំណាយ</label>
                <input
                  type="text"
                  required
                  placeholder="ទិញសម្ភារៈបន្ទប់ពិសោធន៍..."
                  value={newExpense.title}
                  onChange={(e) => setNewExpense({ ...newExpense, title: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 mb-1">ចំនួនទឹកប្រាក់</label>
                  <input
                    type="text"
                    required
                    placeholder="- $100.00"
                    value={newExpense.amount}
                    onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 mb-1">អ្នកទូទាត់</label>
                  <input
                    type="text"
                    value={newExpense.payer}
                    onChange={(e) => setNewExpense({ ...newExpense, payer: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setIsExpenseModalOpen(false)} className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl">បោះបង់</button>
                <button type="submit" className="px-4 py-2 bg-rose-600 text-white rounded-xl font-bold">រក្សាទុក</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Payment */}
      {isPaymentModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs font-khmer">
          <div className="bg-white dark:bg-[#1e293b] rounded-2xl w-full max-w-md p-6 border border-slate-200 dark:border-gray-800">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100 dark:border-gray-800">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">ចេញវិក្កយបត្របង់ប្រាក់</h3>
              <button onClick={() => setIsPaymentModalOpen(false)} className="text-slate-400 hover:text-slate-200"><X className="w-4 h-4" /></button>
            </div>
            <form onSubmit={handleCreatePayment} className="space-y-4 mt-4 text-xs">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 mb-1">ឈ្មោះសិស្ស</label>
                <input
                  type="text"
                  required
                  placeholder="សុខ ចាន់ដារ៉ា"
                  value={newPayment.student}
                  onChange={(e) => setNewPayment({ ...newPayment, student: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 mb-1">ថ្នាក់</label>
                  <input
                    type="text"
                    value={newPayment.class}
                    onChange={(e) => setNewPayment({ ...newPayment, class: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 mb-1">ចំនួនទឹកប្រាក់</label>
                  <input
                    type="text"
                    required
                    value={newPayment.amount}
                    onChange={(e) => setNewPayment({ ...newPayment, amount: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-mono"
                  />
                </div>
              </div>
              <div>
                <label className="block text-slate-700 dark:text-slate-300 mb-1">ប្រភេទបង់</label>
                <input
                  type="text"
                  value={newPayment.type}
                  onChange={(e) => setNewPayment({ ...newPayment, type: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setIsPaymentModalOpen(false)} className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl">បោះបង់</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-xl font-bold">ចេញវិក្កយបត្រ</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Finance;
