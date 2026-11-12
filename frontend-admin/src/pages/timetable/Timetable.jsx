import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Calendar,
  Clock,
  School,
  GraduationCap,
  DoorOpen,
  Printer,
  Plus,
  X,
  CheckCircle2,
} from 'lucide-react';
import { timetableService, academicService } from '../../services';
import { useApp } from '../../context/AppContext';

const Timetable = () => {
  const { lang } = useApp();
  const [searchParams, setSearchParams] = useSearchParams();
  const currentTab = searchParams.get('tab') || 'class';

  const [classrooms, setClassrooms] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [schedule, setSchedule] = useState([]);
  const [teacherSchedule, setTeacherSchedule] = useState([]);
  const [roomSchedule, setRoomSchedule] = useState([]);
  const [examTimetable, setExamTimetable] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Modal: Add Timetable Slot
  const [isSlotModalOpen, setIsSlotModalOpen] = useState(false);
  const [newSlot, setNewSlot] = useState({
    classroom_id: '',
    day_of_week: 'monday',
    start_time: '07:00',
    end_time: '07:50',
    subject: 'គណិតវិទ្យា',
    teacher: 'លោកគ្រូ សុខ',
    room_number: '101',
  });

  const setTab = (tab) => {
    setSearchParams({ tab });
  };

  const showMsg = (msg) => {
    setMessage(msg);
    setTimeout(() => setMessage(''), 3500);
  };

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const res = await academicService.getClassrooms();
        const list = Array.isArray(res) ? res : (res?.data || []);
        setClassrooms(list);
        if (list.length > 0) {
          setSelectedClass(list[0].id);
          setNewSlot((prev) => ({ ...prev, classroom_id: list[0].id }));
        }
      } catch {}
    };
    fetchClasses();
  }, []);

  const fetchTimetable = async () => {
    if (!selectedClass) return;
    setLoading(true);
    try {
      const res = await timetableService.getTimetables({ classroom_id: selectedClass });
      const sched = res?.schedule || [];
      // Flatten or structure
      const slotsList = [];
      if (Array.isArray(sched)) {
        sched.forEach((dayObj) => {
          if (dayObj.slots) {
            dayObj.slots.forEach((s) => {
              slotsList.push({ day: dayObj.day, ...s });
            });
          }
        });
      }
      setSchedule(slotsList);
    } catch {}
    finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentTab === 'class') {
      fetchTimetable();
    }
  }, [selectedClass, currentTab]);

  useEffect(() => {
    const fetchOtherTabs = async () => {
      try {
        if (currentTab === 'teacher') {
          const res = await timetableService.getTeacherTimetable();
          setTeacherSchedule(res?.schedule || []);
        } else if (currentTab === 'room') {
          const res = await timetableService.getRoomSchedule();
          setRoomSchedule(res?.rooms || []);
        } else if (currentTab === 'exam') {
          const res = await timetableService.getExamTimetable();
          setExamTimetable(res?.timetable || []);
        }
      } catch {}
    };
    fetchOtherTabs();
  }, [currentTab]);

  const handleCreateSlot = async (e) => {
    e.preventDefault();
    try {
      await timetableService.createTimetable(newSlot);
      showMsg('✅ បានបន្ថែមម៉ោងសិក្សាថ្មីដោយជោគជ័យ!');
      setIsSlotModalOpen(false);
      setSchedule((prev) => [...prev, { day: newSlot.day_of_week, time: `${newSlot.start_time} - ${newSlot.end_time}`, subject: newSlot.subject, teacher: newSlot.teacher }]);
    } catch {
      showMsg('❌ បរាជ័យក្នុងការរក្សាទុកកាលវិភាគ');
    }
  };

  const daysKh = {
    monday: 'ចន្ទ (Monday)',
    tuesday: 'អង្គារ (Tuesday)',
    wednesday: 'ពុធ (Wednesday)',
    thursday: 'ព្រហស្បតិ៍ (Thursday)',
    friday: 'សុក្រ (Friday)',
    saturday: 'សៅរ៍ (Saturday)',
  };

  return (
    <div className="space-y-6 font-khmer transition-colors duration-200 min-h-full">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            ៥. ការគ្រប់គ្រងកាលវិភាគ (Timetable Management)
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            កាលវិភាគប្រចាំសប្តាហ៍តាមថ្នាក់ គ្រូបង្រៀន បន្ទប់សិក្សា និងកាលវិភាគសម័យប្រឡង
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setIsSlotModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-xs cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ បន្ថែមម៉ោងសិក្សា</span>
          </button>
          <button className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-semibold border border-slate-200 dark:border-gray-700 cursor-pointer">
            <Printer className="w-3.5 h-3.5" />
            <span>បោះពុម្ព (Print)</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 dark:border-gray-800 pb-3">
        {[
          { key: 'class', label: 'កាលវិភាគតាមថ្នាក់ (Class)', icon: School },
          { key: 'teacher', label: 'កាលវិភាគគ្រូ (Teachers)', icon: GraduationCap },
          { key: 'room', label: 'បន្ទប់សិក្សា/ពិសោធន៍ (Rooms)', icon: DoorOpen },
          { key: 'exam', label: 'កាលវិភាគប្រឡង (Exams)', icon: Calendar },
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

      {/* TAB 1: CLASS TIMETABLE */}
      {currentTab === 'class' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-[#1e293b] p-4 rounded-2xl border border-slate-200 dark:border-gray-800 flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">ជ្រើសរើសថ្នាក់រៀន:</span>
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="bg-slate-100 dark:bg-[#252d52] border border-slate-300 dark:border-[#353d6b] rounded-xl px-3 py-1.5 text-xs text-slate-800 dark:text-white"
              >
                {classrooms.map((c) => (
                  <option key={c.id} value={c.id}>{c.name || `ថ្នាក់ ${c.grade_level}`}</option>
                ))}
              </select>
            </div>
            <span className="text-xs text-slate-400">វេនសិក្សា: ពេលព្រឹក (07:00 AM - 11:15 AM)</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.keys(daysKh).map((dayKey) => {
              const daySessions = schedule.filter((s) => s.day === dayKey);
              return (
                <div key={dayKey} className="bg-white dark:bg-[#1e293b] rounded-2xl border border-slate-200 dark:border-gray-800 overflow-hidden shadow-xs">
                  <div className="bg-slate-100 dark:bg-[#252d52] px-4 py-3 border-b border-slate-200 dark:border-gray-800 flex items-center justify-between">
                    <span className="font-bold text-xs text-slate-900 dark:text-white">{daysKh[dayKey]}</span>
                    <span className="text-[10px] bg-blue-500/10 text-blue-500 font-bold px-2 py-0.5 rounded-full">
                      {daySessions.length || 4} ម៉ោង
                    </span>
                  </div>
                  <div className="p-3 divide-y divide-slate-100 dark:divide-gray-800">
                    {(daySessions.length > 0 ? daySessions : [
                      { time: '07:00 - 07:50', subject: 'គណិតវិទ្យា', teacher: 'លោកគ្រូ សុខ' },
                      { time: '07:55 - 08:45', subject: 'រូបវិទ្យា', teacher: 'លោកគ្រូ ហេង' },
                      { time: '09:00 - 09:50', subject: 'អក្សរសាស្ត្រខ្មែរ', teacher: 'អ្នកគ្រូ កែវ' },
                      { time: '09:55 - 10:45', subject: 'ភាសាអង់គ្លេស', teacher: 'អ្នកគ្រូ ស៊ុន' },
                    ]).map((sess, idx) => (
                      <div key={idx} className="py-2.5 flex items-center justify-between">
                        <div>
                          <div className="text-xs font-bold text-slate-900 dark:text-white">{sess.subject}</div>
                          <div className="text-[11px] text-slate-400 mt-0.5">{sess.teacher}</div>
                        </div>
                        <span className="text-[10px] font-mono font-semibold bg-slate-100 dark:bg-gray-800 px-2 py-1 rounded-md text-slate-500">
                          {sess.time}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: TEACHER TIMETABLE */}
      {currentTab === 'teacher' && (
        <div className="bg-white dark:bg-[#1e293b] p-6 rounded-2xl border border-slate-200 dark:border-gray-800 space-y-4">
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            កាលវិភាគបង្រៀនរបស់គ្រូ (Teacher Timetable)
          </h3>
          <p className="text-xs text-slate-400">
            ត្រួតពិនិត្យម៉ោងបង្រៀនរបស់លោកគ្រូ-អ្នកគ្រូម្នាក់ៗ ក្នុងមួយសប្តាហ៍
          </p>
          <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-gray-800">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 dark:bg-[#252d52] font-bold">
                <tr>
                  <th className="p-3">ឈ្មោះគ្រូបង្រៀន</th>
                  <th className="p-3">មុខវិជ្ជា</th>
                  <th className="p-3">ថ្នាក់បង្រៀន</th>
                  <th className="p-3">ម៉ោង/សប្តាហ៍</th>
                  <th className="p-3">ថ្ងៃបង្រៀន</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-gray-800">
                {(teacherSchedule.length > 0 ? teacherSchedule : [
                  { name: 'លោកគ្រូ សុខ ចិន្តា', subject: 'គណិតវិទ្យា', classes: '12A, 12B, 11A', hours: '18 ម៉ោង', days: 'ចន្ទ, អង្គារ, ពុធ, ព្រហ' },
                  { name: 'អ្នកគ្រូ កែវ មុន្នី', subject: 'អក្សរសាស្ត្រខ្មែរ', classes: '10A, 10B, 12A', hours: '16 ម៉ោង', days: 'ចន្ទ, ពុធ, សុក្រ' },
                  { name: 'លោកគ្រូ ហេង សុភា', subject: 'រូបវិទ្យា', classes: '11B, 12A, 12B', hours: '18 ម៉ោង', days: 'អង្គារ, ព្រហ, សៅរ៍' },
                ]).map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-[#252d52]/50">
                    <td className="p-3 font-bold text-slate-900 dark:text-white">{row.name}</td>
                    <td className="p-3 text-blue-500 font-semibold">{row.subject}</td>
                    <td className="p-3">{row.classes}</td>
                    <td className="p-3 font-mono font-bold text-emerald-500">{row.hours}</td>
                    <td className="p-3">{row.days}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: ROOM SCHEDULE */}
      {currentTab === 'room' && (
        <div className="bg-white dark:bg-[#1e293b] p-6 rounded-2xl border border-slate-200 dark:border-gray-800 space-y-4">
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            កាលវិភាគបន្ទប់សិក្សា និងបន្ទប់ពិសោធន៍ (Room Schedule)
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {(roomSchedule.length > 0 ? roomSchedule : [
              { room: 'បន្ទប់ពិសោធន៍វិទ្យាសាស្ត្រ (Lab)', usage: 'ថ្នាក់ទី 12A (រូបវិទ្យា)', time: '08:00 - 09:30 AM', status: 'កំពុងប្រើប្រាស់' },
              { room: 'បន្ទប់កុំព្យូទ័រ (Computer Lab)', usage: 'ថ្នាក់ទី 10C (ICT)', time: '09:00 - 10:30 AM', status: 'កំពុងប្រើប្រាស់' },
              { room: 'សាលប្រជុំ / បណ្ណាល័យ', usage: 'អានសៀវភៅ & ស្រាវជ្រាវ', time: 'ពេញមួយថ្ងៃ', status: 'ទំនេរ' },
            ]).map((rm, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-slate-100 dark:bg-[#252d52] border border-slate-200 dark:border-[#333d6d]">
                <div className="text-xs font-bold text-slate-900 dark:text-white">{rm.room}</div>
                <div className="text-xs text-blue-400 font-semibold mt-1">{rm.usage}</div>
                <div className="text-[11px] text-slate-400 font-mono mt-1">{rm.time}</div>
                <span className="inline-block mt-3 text-[10px] bg-emerald-500/15 text-emerald-400 px-2.5 py-0.5 rounded-full font-bold">
                  {rm.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: EXAM TIMETABLE */}
      {currentTab === 'exam' && (
        <div className="bg-white dark:bg-[#1e293b] p-6 rounded-2xl border border-slate-200 dark:border-gray-800 space-y-4">
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            កាលវិភាគសម័យប្រឡងឆមាស (Semester Exam Timetable)
          </h3>
          <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 text-xs text-blue-300">
            សម័យប្រឡងឆមាសលើកទី ១ នឹងចាប់ផ្តើមពីថ្ងៃទី ១៥ ដល់ ១៨ ខែធ្នូ ឆ្នាំ ២០២៦។ សិស្សត្រូវមានវត្តមានមុន ៣០ នាទី។
          </div>
          <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-gray-800">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 dark:bg-[#252d52] font-bold">
                <tr>
                  <th className="p-3">កាលបរិច្ឆេទ</th>
                  <th className="p-3">ម៉ោង</th>
                  <th className="p-3">មុខវិជ្ជា</th>
                  <th className="p-3">បន្ទប់</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-gray-800">
                {(examTimetable.length > 0 ? examTimetable : [
                  { date: '2026-12-15', time: '07:30 - 09:00 AM', subject: 'គណិតវិទ្យា', rooms: 'បន្ទប់ 101-108' },
                  { date: '2026-12-15', time: '09:30 - 11:00 AM', subject: 'រូបវិទ្យា', rooms: 'បន្ទប់ 101-108' },
                  { date: '2026-12-16', time: '07:30 - 09:00 AM', subject: 'អក្សរសាស្ត្រខ្មែរ', rooms: 'បន្ទប់ 101-108' },
                ]).map((ex, idx) => (
                  <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-[#252d52]/50">
                    <td className="p-3 font-mono">{ex.date}</td>
                    <td className="p-3 font-mono text-blue-500">{ex.time}</td>
                    <td className="p-3 font-bold text-slate-900 dark:text-white">{ex.subject}</td>
                    <td className="p-3 font-mono">{ex.rooms}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal: Add Timetable Slot */}
      {isSlotModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs font-khmer">
          <div className="bg-white dark:bg-[#1e293b] rounded-2xl w-full max-w-md p-6 border border-slate-200 dark:border-gray-800">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100 dark:border-gray-800">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">បន្ថែមម៉ោងសិក្សាថ្មី</h3>
              <button onClick={() => setIsSlotModalOpen(false)} className="text-slate-400 hover:text-slate-200"><X className="w-4 h-4" /></button>
            </div>
            <form onSubmit={handleCreateSlot} className="space-y-4 mt-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 mb-1">ថ្នាក់រៀន</label>
                  <select
                    value={newSlot.classroom_id}
                    onChange={(e) => setNewSlot({ ...newSlot, classroom_id: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                  >
                    {classrooms.map((c) => (
                      <option key={c.id} value={c.id}>{c.name || `ថ្នាក់ ${c.grade_level}`}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 mb-1">ថ្ងៃសិក្សា</label>
                  <select
                    value={newSlot.day_of_week}
                    onChange={(e) => setNewSlot({ ...newSlot, day_of_week: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                  >
                    <option value="monday">ចន្ទ (Monday)</option>
                    <option value="tuesday">អង្គារ (Tuesday)</option>
                    <option value="wednesday">ពុធ (Wednesday)</option>
                    <option value="thursday">ព្រហស្បតិ៍ (Thursday)</option>
                    <option value="friday">សុក្រ (Friday)</option>
                    <option value="saturday">សៅរ៍ (Saturday)</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 mb-1">ម៉ោងចាប់ផ្តើម</label>
                  <input
                    type="time"
                    required
                    value={newSlot.start_time}
                    onChange={(e) => setNewSlot({ ...newSlot, start_time: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 mb-1">ម៉ោងបញ្ចប់</label>
                  <input
                    type="time"
                    required
                    value={newSlot.end_time}
                    onChange={(e) => setNewSlot({ ...newSlot, end_time: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-mono"
                  />
                </div>
              </div>
              <div>
                <label className="block text-slate-700 dark:text-slate-300 mb-1">មុខវិជ្ជា</label>
                <input
                  type="text"
                  required
                  placeholder="គណិតវិទ្យា"
                  value={newSlot.subject}
                  onChange={(e) => setNewSlot({ ...newSlot, subject: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 mb-1">គ្រូបង្រៀន</label>
                  <input
                    type="text"
                    placeholder="លោកគ្រូ សុខ"
                    value={newSlot.teacher}
                    onChange={(e) => setNewSlot({ ...newSlot, teacher: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 mb-1">បន្ទប់</label>
                  <input
                    type="text"
                    placeholder="101"
                    value={newSlot.room_number}
                    onChange={(e) => setNewSlot({ ...newSlot, room_number: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setIsSlotModalOpen(false)} className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl">បោះបង់</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-xl font-bold">រក្សាទុក</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Timetable;
