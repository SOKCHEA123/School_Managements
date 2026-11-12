import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Bell,
  Megaphone,
  Calendar as CalIcon,
  Plus,
  Send,
  Trash2,
  X,
  CheckCircle2,
  CalendarCheck,
} from 'lucide-react';
import { communicationService } from '../../services';
import { useApp } from '../../context/AppContext';

const Communication = () => {
  const { lang } = useApp();
  const [searchParams, setSearchParams] = useSearchParams();
  const currentTab = searchParams.get('tab') || 'announcements';

  const [data, setData] = useState(null);
  const [announcements, setAnnouncements] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [events, setEvents] = useState([]);
  const [calendarEvents, setCalendarEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  // Modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newAnnouncement, setNewAnnouncement] = useState({ title: '', content: '', priority: 'normal', author: 'ការិយាល័យសិក្សា' });

  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [newEvent, setNewEvent] = useState({ title: '', date: new Date().toISOString().split('T')[0], location: 'ទីធ្លាវិទ្យាល័យ', desc: '' });

  const [isNotifModalOpen, setIsNotifModalOpen] = useState(false);
  const [newNotif, setNewNotif] = useState({ to: 'អាណាព្យាបាលសិស្ស', message: '' });

  const [isCalModalOpen, setIsCalModalOpen] = useState(false);
  const [newCalEvent, setNewCalEvent] = useState({ title: '', date: new Date().toISOString().split('T')[0], type: 'academic' });

  const setTab = (tab) => {
    setSearchParams({ tab });
  };

  const showMsg = (msg) => {
    setMessage(msg);
    setTimeout(() => setMessage(''), 3500);
  };

  const fetchComm = async () => {
    setLoading(true);
    try {
      const [cRes, aRes, nRes, eRes, calRes] = await Promise.all([
        communicationService.getOverview(),
        communicationService.getAnnouncements(),
        communicationService.getNotifications(),
        communicationService.getEvents(),
        communicationService.getAcademicCalendar(),
      ]);
      setData(cRes);
      setAnnouncements(aRes?.data || aRes?.announcements || cRes?.announcements || []);
      setNotifications(nRes?.data || nRes?.notifications || cRes?.notifications || []);
      setEvents(eRes?.data || eRes?.events || cRes?.events || []);
      setCalendarEvents(calRes?.data || calRes?.events || cRes?.calendar || []);
    } catch {}
    finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComm();
  }, []);

  const handleCreateAnnouncement = async (e) => {
    e.preventDefault();
    try {
      await communicationService.createAnnouncement(newAnnouncement);
      showMsg('✅ បានផ្សាយដំណឹងជោគជ័យ!');
      setIsModalOpen(false);
      setNewAnnouncement({ title: '', content: '', priority: 'normal', author: 'ការិយាល័យសិក្សា' });
      fetchComm();
    } catch {
      showMsg('❌ បរាជ័យក្នុងការផ្សាយដំណឹង');
    }
  };

  const handleDeleteAnnouncement = async (id) => {
    if (!window.confirm('តើអ្នកចង់លុបសេចក្តីប្រកាសនេះមែនទេ?')) return;
    try {
      await communicationService.deleteAnnouncement(id);
      showMsg('✅ បានលុបសេចក្តីប្រកាសរួចរាល់');
      fetchComm();
    } catch {
      showMsg('❌ បរាជ័យក្នុងការលុប');
    }
  };

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    try {
      await communicationService.createEvent(newEvent);
      showMsg('✅ បានបង្កើតព្រឹត្តិការណ៍ដោយជោគជ័យ!');
      setIsEventModalOpen(false);
      fetchComm();
    } catch {
      showMsg('❌ បរាជ័យក្នុងការបង្កើតព្រឹត្តិការណ៍');
    }
  };

  const handleDeleteEvent = async (id) => {
    if (!window.confirm('តើអ្នកចង់លុបព្រឹត្តិការណ៍នេះមែនទេ?')) return;
    try {
      await communicationService.deleteEvent(id);
      showMsg('✅ បានលុបព្រឹត្តិការណ៍រួចរាល់');
      fetchComm();
    } catch {
      showMsg('❌ បរាជ័យក្នុងការលុប');
    }
  };

  const handleCreateNotif = async (e) => {
    e.preventDefault();
    try {
      await communicationService.createNotification(newNotif);
      showMsg('✅ បានផ្ញើសារជូនដំណឹងដោយជោគជ័យ!');
      setIsNotifModalOpen(false);
      fetchComm();
    } catch {
      showMsg('❌ បរាជ័យក្នុងការផ្ញើសារ');
    }
  };

  const handleCreateCalEvent = async (e) => {
    e.preventDefault();
    try {
      await communicationService.createCalendarEvent(newCalEvent);
      showMsg('✅ បានបន្ថែមក្នុងប្រតិទិនដោយជោគជ័យ!');
      setIsCalModalOpen(false);
      fetchComm();
    } catch {
      showMsg('❌ បរាជ័យក្នុងការបន្ថែម');
    }
  };

  return (
    <div className="space-y-6 font-khmer transition-colors duration-200 min-h-full">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            ៩. ទំនាក់ទំនង & ដំណឹង (Communication)
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            សេចក្តីប្រកាស ការជូនដំណឹង ព្រឹត្តិការណ៍សាលារៀន និងប្រតិទិនសកម្មភាពប្រចាំឆ្នាំ
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-xs cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ បង្កើតដំណឹងថ្មី</span>
          </button>
          <button
            onClick={() => setIsEventModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow-xs cursor-pointer"
          >
            <CalIcon className="w-3.5 h-3.5" />
            <span>+ ព្រឹត្តិការណ៍</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 dark:border-gray-800 pb-3">
        {[
          { key: 'announcements', label: 'សេចក្តីប្រកាស (Announcements)', icon: Megaphone },
          { key: 'notifications', label: 'ការជូនដំណឹង (Notifications)', icon: Bell },
          { key: 'events', label: 'ព្រឹត្តិការណ៍សាលា (School Events)', icon: CalIcon },
          { key: 'calendar', label: 'ប្រតិទិនសិក្សា (Academic Calendar)', icon: CalendarCheck },
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

      {/* TAB 1: ANNOUNCEMENTS */}
      {currentTab === 'announcements' && (
        <div className="space-y-4">
          {(announcements.length > 0 ? announcements : [
            {
              id: 1,
              title: 'កាលវិភាគប្រឡងឆមាសលើកទី ១ ឆ្នាំសិក្សា ២០២៥-២០២៦',
              content: 'សូមជំរាបជូនដល់ប្អូនៗសិស្សានុសិស្សទាំងអស់ឱ្យបានជ្រាបថា ការប្រឡងឆមាសនឹងចាប់ផ្តើមពីថ្ងៃទី ១៥ ខែកុម្ភៈ តទៅ។ សិស្សត្រូវស្លៀកពាក់ឯកសណ្ឋានសាលាឱ្យបានត្រឹមត្រូវ។',
              date: '2026-11-05',
              author: 'ការិយាល័យសិក្សា',
              priority: 'high',
            },
            {
              id: 2,
              title: 'ការរៀបចំទិវាបរិស្ថាន និងការដាំដើមឈើក្នុងបរិវេណសាលា',
              content: 'វិទ្យាល័យ ហ៊ុន សែន ស្នួល នឹងប្រារព្ធយុទ្ធនាការសាលាបៃតងនៅចុងសប្តាហ៍នេះ។ សូមអញ្ជើញសិស្សានុសិស្សទាំងអស់ចូលរួមដោយស្ម័គ្រចិត្ត។',
              date: '2026-11-02',
              author: 'គណៈគ្រប់គ្រងសាលា',
              priority: 'medium',
            },
          ]).map((a) => (
            <div key={a.id} className="bg-white dark:bg-[#1e293b] rounded-2xl border border-slate-200 dark:border-gray-800 p-5 shadow-xs">
              <div className="flex items-center justify-between mb-2">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  a.priority === 'high' ? 'bg-rose-500/10 text-rose-500' : 'bg-blue-500/10 text-blue-500'
                }`}>
                  {a.priority === 'high' ? 'ដំណឹងបន្ទាន់ (Urgent)' : 'ដំណឹងទូទៅ'}
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-slate-400 font-mono">{a.date}</span>
                  <button onClick={() => handleDeleteAnnouncement(a.id)} className="text-red-400 hover:text-red-500 p-1">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-2">{a.title}</h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{a.content}</p>
              <div className="mt-3 pt-3 border-t border-slate-100 dark:border-gray-800 text-[11px] text-slate-400">
                ផ្សាយដោយ: <span className="font-semibold text-slate-700 dark:text-slate-300">{a.author || 'ការិយាល័យសិក្សា'}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 2: NOTIFICATIONS */}
      {currentTab === 'notifications' && (
        <div className="bg-white dark:bg-[#1e293b] p-6 rounded-2xl border border-slate-200 dark:border-gray-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              ការជូនដំណឹងតាមប្រព័ន្ធ និងផ្ញើសារ SMS (System & SMS Notifications)
            </h3>
            <button
              onClick={() => setIsNotifModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>ផ្ញើសារជូនដំណឹង</span>
            </button>
          </div>
          <div className="divide-y divide-slate-200 dark:divide-gray-800">
            {(notifications.length > 0 ? notifications : [
              { to: 'អាណាព្យាបាលសិស្សថ្នាក់ទី ១២', text: 'ជូនដំណឹងអំពីលទ្ធផលប្រឡងប្រចាំខែវិច្ឆិកា និងការត្រៀមបាក់ឌុប', time: '1 ថ្ងៃមុន', status: 'បានផ្ញើរួច' },
              { to: 'លោកគ្រូ-អ្នកគ្រូទាំងអស់', text: 'ការប្រជុំបូកសរុបការងារពាក់កណ្តាលឆមាសទី ១ នៅសាលប្រជុំធំ', time: '2 ថ្ងៃមុន', status: 'បានផ្ញើរួច' },
            ]).map((n, idx) => (
              <div key={idx} className="py-3 flex items-center justify-between text-xs">
                <div>
                  <div className="font-bold text-slate-900 dark:text-white">ផ្ញើទៅកាន់: {n.to}</div>
                  <div className="text-slate-400 mt-0.5">{n.text || n.message}</div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] bg-emerald-500/15 text-emerald-500 px-2 py-0.5 rounded-full font-bold">{n.status || 'បានផ្ញើរួច'}</span>
                  <div className="text-[10px] text-slate-400 mt-1">{n.time || 'ថ្មីៗ'}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: SCHOOL EVENTS */}
      {currentTab === 'events' && (
        <div className="bg-white dark:bg-[#1e293b] p-6 rounded-2xl border border-slate-200 dark:border-gray-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              ព្រឹត្តិការណ៍សាលារៀន (School Events & Activities)
            </h3>
            <button
              onClick={() => setIsEventModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ បន្ថែមព្រឹត្តិការណ៍</span>
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(events.length > 0 ? events : [
              { id: 1, title: 'ទិវាគ្រូបង្រៀនពិភពលោក (World Teachers\' Day)', date: '2026-10-05', location: 'ទីធ្លាវិទ្យាល័យ', desc: 'កម្មវិធីថ្លែងអំណរគុណ និងជូនកម្រងផ្កាដល់លោកគ្រូអ្នកគ្រូ' },
              { id: 2, title: 'ការប្រកួតកីឡាបាល់ទាត់ និងបាល់ទះសិស្សប្រចាំឆ្នាំ', date: '2026-12-20', location: 'តារាងបាល់ទាត់សាលា', desc: 'ការប្រកួតមិត្តភាពរវាងថ្នាក់ទី ១០ ដល់ ១២' },
            ]).map((ev) => (
              <div key={ev.id} className="p-4 rounded-xl bg-slate-100 dark:bg-[#252d52] border border-slate-200 dark:border-[#333d6d] flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start">
                    <div className="text-xs font-bold text-slate-900 dark:text-white">{ev.title}</div>
                    <button onClick={() => handleDeleteEvent(ev.id)} className="text-red-400 hover:text-red-500 p-1">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="text-xs text-blue-400 font-semibold mt-1">កាលបរិច្ឆេទ: {ev.date} • {ev.location}</div>
                  <p className="text-[11px] text-slate-400 mt-2">{ev.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: CALENDAR */}
      {currentTab === 'calendar' && (
        <div className="bg-white dark:bg-[#1e293b] p-6 rounded-2xl border border-slate-200 dark:border-gray-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              ប្រតិទិនសិក្សាប្រចាំឆ្នាំ (Academic Year Calendar)
            </h3>
            <button
              onClick={() => setIsCalModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ បន្ថែមកាលវិភាគប្រតិទិន</span>
            </button>
          </div>
          <div className="divide-y divide-slate-200 dark:divide-gray-800 text-xs">
            {(calendarEvents.length > 0 ? calendarEvents : [
              { date: '2026-10-01', title: 'បើកបវេសនកាលឆ្នាំសិក្សាថ្មី ២០២៦-២០២៧', type: 'សាលារៀន' },
              { date: '2026-12-15 ដល់ 18', title: 'ការប្រឡងឆមាសលើកទី ១', type: 'ការប្រឡង' },
              { date: '2027-02-01 ដល់ 07', title: 'វិស្សមកាលតូចពាក់កណ្តាលឆ្នាំសិក្សា', type: 'ឈប់សម្រាក' },
            ]).map((c, idx) => (
              <div key={idx} className="py-3 flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-900 dark:text-white">{c.title}</div>
                  <div className="text-slate-400 font-mono mt-0.5">{c.date}</div>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/15 text-blue-500">
                  {c.type || 'សិក្សា'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal: Announcement */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs font-khmer">
          <div className="bg-white dark:bg-[#1e293b] rounded-2xl w-full max-w-md p-6 border border-slate-200 dark:border-gray-800">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100 dark:border-gray-800">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">បង្កើតដំណឹងថ្មី</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-200"><X className="w-4 h-4" /></button>
            </div>
            <form onSubmit={handleCreateAnnouncement} className="space-y-4 mt-4 text-xs">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 mb-1">ចំណងជើង</label>
                <input
                  type="text"
                  required
                  placeholder="កាលវិភាគប្រឡង..."
                  value={newAnnouncement.title}
                  onChange={(e) => setNewAnnouncement({ ...newAnnouncement, title: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-slate-700 dark:text-slate-300 mb-1">កម្រិតអាទិភាព</label>
                <select
                  value={newAnnouncement.priority}
                  onChange={(e) => setNewAnnouncement({ ...newAnnouncement, priority: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                >
                  <option value="normal">ដំណឹងទូទៅ</option>
                  <option value="high">ដំណឹងបន្ទាន់ (Urgent)</option>
                </select>
              </div>
              <div>
                <label className="block text-slate-700 dark:text-slate-300 mb-1">ខ្លឹមសារ</label>
                <textarea
                  rows={4}
                  required
                  placeholder="ព័ត៌មានលម្អិត..."
                  value={newAnnouncement.content}
                  onChange={(e) => setNewAnnouncement({ ...newAnnouncement, content: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl">បោះបង់</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-xl font-bold">ផ្សាយដំណឹង</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Event */}
      {isEventModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs font-khmer">
          <div className="bg-white dark:bg-[#1e293b] rounded-2xl w-full max-w-md p-6 border border-slate-200 dark:border-gray-800">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100 dark:border-gray-800">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">បង្កើតព្រឹត្តិការណ៍ថ្មី</h3>
              <button onClick={() => setIsEventModalOpen(false)} className="text-slate-400 hover:text-slate-200"><X className="w-4 h-4" /></button>
            </div>
            <form onSubmit={handleCreateEvent} className="space-y-4 mt-4 text-xs">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 mb-1">ឈ្មោះកម្មវិធី/ព្រឹត្តិការណ៍</label>
                <input
                  type="text"
                  required
                  value={newEvent.title}
                  onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 mb-1">កាលបរិច្ឆេទ</label>
                  <input
                    type="date"
                    required
                    value={newEvent.date}
                    onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 mb-1">ទីកន្លែង</label>
                  <input
                    type="text"
                    value={newEvent.location}
                    onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                  />
                </div>
              </div>
              <div>
                <label className="block text-slate-700 dark:text-slate-300 mb-1">ព័ត៌មានបន្ថែម</label>
                <textarea
                  rows={3}
                  value={newEvent.desc}
                  onChange={(e) => setNewEvent({ ...newEvent, desc: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setIsEventModalOpen(false)} className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl">បោះបង់</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-xl font-bold">រក្សាទុក</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Notification */}
      {isNotifModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs font-khmer">
          <div className="bg-white dark:bg-[#1e293b] rounded-2xl w-full max-w-md p-6 border border-slate-200 dark:border-gray-800">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100 dark:border-gray-800">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">ផ្ញើសារជូនដំណឹង</h3>
              <button onClick={() => setIsNotifModalOpen(false)} className="text-slate-400 hover:text-slate-200"><X className="w-4 h-4" /></button>
            </div>
            <form onSubmit={handleCreateNotif} className="space-y-4 mt-4 text-xs">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 mb-1">ផ្ញើទៅកាន់</label>
                <input
                  type="text"
                  required
                  value={newNotif.to}
                  onChange={(e) => setNewNotif({ ...newNotif, to: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-slate-700 dark:text-slate-300 mb-1">ខ្លឹមសារសារ</label>
                <textarea
                  rows={3}
                  required
                  value={newNotif.message}
                  onChange={(e) => setNewNotif({ ...newNotif, message: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setIsNotifModalOpen(false)} className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl">បោះបង់</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-xl font-bold">ផ្ញើសារ</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Calendar Event */}
      {isCalModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs font-khmer">
          <div className="bg-white dark:bg-[#1e293b] rounded-2xl w-full max-w-md p-6 border border-slate-200 dark:border-gray-800">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100 dark:border-gray-800">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">បន្ថែមកាលវិភាគប្រតិទិន</h3>
              <button onClick={() => setIsCalModalOpen(false)} className="text-slate-400 hover:text-slate-200"><X className="w-4 h-4" /></button>
            </div>
            <form onSubmit={handleCreateCalEvent} className="space-y-4 mt-4 text-xs">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 mb-1">ព្រឹត្តិការណ៍ប្រតិទិន</label>
                <input
                  type="text"
                  required
                  value={newCalEvent.title}
                  onChange={(e) => setNewCalEvent({ ...newCalEvent, title: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 mb-1">កាលបរិច្ឆេទ</label>
                  <input
                    type="date"
                    required
                    value={newCalEvent.date}
                    onChange={(e) => setNewCalEvent({ ...newCalEvent, date: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 mb-1">ប្រភេទ</label>
                  <select
                    value={newCalEvent.type}
                    onChange={(e) => setNewCalEvent({ ...newCalEvent, type: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                  >
                    <option value="academic">ការសិក្សា</option>
                    <option value="exam">ការប្រឡង</option>
                    <option value="holiday">ឈប់សម្រាក</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setIsCalModalOpen(false)} className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl">បោះបង់</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-xl font-bold">រក្សាទុក</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Communication;
