import React, { useState } from 'react';
import { Bell, Send, Users, Search, MessageSquare, CheckCircle2 } from 'lucide-react';

const ParentCommunication = () => {
  const [targetGroup, setTargetGroup] = useState('all');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [message, setMessage] = useState('');

  const handleSend = (e) => {
    e.preventDefault();
    setMessage('✅ បានផ្ញើសារជូនដំណឹងទៅកាន់អាណាព្យាបាលដោយជោគជ័យ!');
    setTitle('');
    setContent('');
    setTimeout(() => setMessage(''), 4000);
  };

  const recentLogs = [
    { id: 1, title: 'ជូនដំណឹងអំពីការប្រឡងឆមាសទី ១', target: 'សិស្សទាំងអស់', date: '2026-11-10', status: 'sent' },
    { id: 2, title: 'កិច្ចប្រជុំអាណាព្យាបាលសិស្សថ្នាក់ទី ១២', target: 'អាណាព្យាបាលថ្នាក់ទី ១២', date: '2026-11-05', status: 'sent' },
    { id: 3, title: 'ការបង់ថ្លៃសិក្សាឆមាសថ្មី', target: 'សិស្សមិនទាន់ទូទាត់', date: '2026-10-28', status: 'sent' },
  ];

  return (
    <div className="space-y-6 font-khmer">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <span className="p-2 rounded-xl bg-violet-500/10 text-violet-500">
            <Bell className="w-5 h-5" />
          </span>
          <h1 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white">
            ទំនាក់ទំនងអាណាព្យាបាល (Parent Communication)
          </h1>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          ផ្ញើសារជូនដំណឹង សេចក្តីប្រកាសបន្ទាន់ និងព័ត៌មានសិក្សាទៅកាន់អាណាព្យាបាល
        </p>
      </div>

      {message && (
        <div className="p-4 rounded-xl text-xs font-semibold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
          {message}
        </div>
      )}

      {/* Broadcast Form */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-[#1e293b] p-6 rounded-2xl border border-slate-200 dark:border-gray-800 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Send className="w-4 h-4 text-blue-500" />
            <span>បង្កើតសារជូនដំណឹងថ្មី</span>
          </h3>

          <form onSubmit={handleSend} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-700 dark:text-slate-300 mb-1">ផ្ញើទៅកាន់ក្រុមគោលដៅ</label>
              <select
                value={targetGroup}
                onChange={(e) => setTargetGroup(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
              >
                <option value="all">អាណាព្យាបាលទាំងអស់ (All Parents)</option>
                <option value="grade12">អាណាព្យាបាលថ្នាក់ទី ១២</option>
                <option value="grade11">អាណាព្យាបាលថ្នាក់ទី ១១</option>
                <option value="grade10">អាណាព្យាបាលថ្នាក់ទី ១០</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-700 dark:text-slate-300 mb-1">ចំណងជើងសេចក្តីជូនដំណឹង *</label>
              <input
                type="text"
                required
                placeholder="ឧ. កិច្ចប្រជុំអាណាព្យាបាលសិស្ស..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-slate-700 dark:text-slate-300 mb-1">ខ្លឹមសារសារ *</label>
              <textarea
                required
                rows={5}
                placeholder="សរសេរខ្លឹមសារលម្អិតនៅទីនេះ..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
              />
            </div>

            <button
              type="submit"
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs cursor-pointer transition-all"
            >
              <Send className="w-3.5 h-3.5" />
              <span>ផ្ញើសេចក្តីជូនដំណឹង</span>
            </button>
          </form>
        </div>

        {/* Recent logs */}
        <div className="bg-white dark:bg-[#1e293b] p-6 rounded-2xl border border-slate-200 dark:border-gray-800 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-violet-500" />
            <span>ប្រវត្តិសារដែលបានផ្ញើ</span>
          </h3>

          <div className="space-y-3">
            {recentLogs.map((log) => (
              <div key={log.id} className="p-3 rounded-xl bg-slate-50 dark:bg-[#252d52] border border-slate-200/60 dark:border-[#353d6b] space-y-1">
                <div className="font-bold text-xs text-slate-900 dark:text-white">{log.title}</div>
                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span>{log.target}</span>
                  <span className="font-mono">{log.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParentCommunication;
