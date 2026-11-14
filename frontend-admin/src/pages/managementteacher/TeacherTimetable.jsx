import React, { useState, useEffect, useCallback } from 'react';
import { CalendarDays, Clock, School, User, Printer, BookOpen, ChevronDown, Loader2 } from 'lucide-react';
import { teacherService, timetableService } from '../../services';

const TeacherTimetable = () => {
  const [teachers, setTeachers] = useState([]);
  const [selectedTeacher, setSelectedTeacher] = useState('');
  const [loadingTeachers, setLoadingTeachers] = useState(true);
  
  // បន្ថែម State សម្រាប់ផ្ទុកទិន្នន័យកាលវិភាគពិតប្រាកដ
  const [schedule, setSchedule] = useState([]);
  const [loadingSchedule, setLoadingSchedule] = useState(false);

  const days = [
    { key: 'monday', label: 'ច័ន្ទ (Mon)' },
    { key: 'tuesday', label: 'អង្គារ (Tue)' },
    { key: 'wednesday', label: 'ពុធ (Wed)' },
    { key: 'thursday', label: 'ព្រហស្បតិ៍ (Thu)' },
    { key: 'friday', label: 'សុក្រ (Fri)' },
    { key: 'saturday', label: 'សៅរ៍ (Sat)' },
  ];

  // ទុកទិន្នន័យនេះជា Fallback បើ API មិនដំណើរការ
  const defaultSchedule = [
    { day: 'monday', time: '07:00 - 07:50 AM', subject: 'គណិតវិទ្យា', class: '12A', room: '101' },
    { day: 'monday', time: '08:00 - 08:50 AM', subject: 'គណិតវិទ្យា', class: '12B', room: '102' },
    { day: 'tuesday', time: '07:00 - 07:50 AM', subject: 'គណិតវិទ្យា', class: '11A', room: '201' },
    { day: 'wednesday', time: '09:00 - 09:50 AM', subject: 'គណិតវិទ្យា', class: '12A', room: '101' },
    { day: 'thursday', time: '07:00 - 08:50 AM', subject: 'គណិតវិទ្យា (២ ម៉ោង)', class: '10A', room: '301' },
    { day: 'friday', time: '08:00 - 08:50 AM', subject: 'គណិតវិទ្យា', class: '12B', room: '102' },
    { day: 'saturday', time: '07:00 - 07:50 AM', subject: 'ស្វ័យសិក្សា / ពង្រឹង', class: '12A', room: '101' },
  ];

  // 1. ទាញយកបញ្ជីឈ្មោះគ្រូជាមុនសិន
  useEffect(() => {
    const fetchTeachers = async () => {
      setLoadingTeachers(true);
      try {
        const res = await teacherService.getTeachers();
        const list = res?.data?.data || res?.data || (Array.isArray(res) ? res : []);
        
        if (list && list.length > 0) {
          setTeachers(list);
          setSelectedTeacher(list[0].id || list[0].name); // ជ្រើសរើសគ្រូទី១ដោយស្វ័យប្រវត្តិ
        } else {
          throw new Error('No teachers');
        }
      } catch (error) {
        const mockTeachers = [
          { id: 1, full_name_km: 'លោកគ្រូ សុខ ចាន់ដារ៉ា' },
          { id: 2, full_name_km: 'អ្នកគ្រូ កែវ វិសាល' },
        ];
        setTeachers(mockTeachers);
        setSelectedTeacher(mockTeachers[0].id);
      } finally {
        setLoadingTeachers(false);
      }
    };
    fetchTeachers();
  }, []);

  // 2. ទាញយកកាលវិភាគរាល់ពេលដែល `selectedTeacher` ផ្លាស់ប្តូរ
  const fetchTimetable = useCallback(async (teacherId) => {
    if (!teacherId) return;
    
    setLoadingSchedule(true);
    try {
      // ប្រើ timetableService ដើម្បីទាញយកទិន្នន័យពិតប្រាកដ
      // (អ្នកត្រូវប្រាកដថា API របស់អ្នកមាន endpoint នេះ)
      const res = await timetableService.getTeacherTimetable(teacherId);
      
      // ពិនិត្យមើលថាតើ API របស់អ្នកត្រឡប់ទិន្នន័យមកជាទម្រង់អ្វី
      const data = res?.data?.data || res?.data || (Array.isArray(res) ? res : []);
      
      if (data && data.length > 0) {
        setSchedule(data);
      } else {
        // បើគ្មានទិន្នន័យក្នុង API សម្រាប់គ្រូនេះ បង្ហាញទទេ ឬប្រើ default
        setSchedule(defaultSchedule); 
      }
    } catch (error) {
      console.error("Failed to fetch timetable:", error);
      // ប្រសិនបើ API មានបញ្ហា យើងប្រើទិន្នន័យសាកល្បងទៅមុន
      setSchedule(defaultSchedule);
    } finally {
      setLoadingSchedule(false);
    }
  }, []);

  // ហៅ Function ទាញយកទិន្នន័យពេលគ្រូផ្លាស់ប្តូរ
  useEffect(() => {
    if (selectedTeacher) {
      fetchTimetable(selectedTeacher);
    }
  }, [selectedTeacher, fetchTimetable]);


  return (
    <div className="space-y-6 font-khmer transition-colors duration-200 p-4 md:p-0">
      
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <span className="p-2.5 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
              <CalendarDays className="w-6 h-6" strokeWidth={1.8} />
            </span>
            <h1 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white">
              កាលវិភាគគ្រូបង្រៀន
            </h1>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
            កាលវិភាគបង្រៀនប្រចាំសប្តាហ៍របស់លោកគ្រូ-អ្នកគ្រូម្នាក់ៗ
          </p>
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto">
          <div className="relative w-full sm:w-[240px]">
            <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <select
              value={selectedTeacher}
              onChange={(e) => setSelectedTeacher(e.target.value)}
              disabled={loadingTeachers}
              className="w-full pl-9 pr-10 py-2.5 bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-900 dark:text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all cursor-pointer appearance-none disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loadingTeachers && <option value="">កំពុងទាញយក...</option>}
              {!loadingTeachers && teachers.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.full_name_km || t.name || 'គ្មានឈ្មោះ'}
                </option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          <button
            onClick={() => window.print()}
            className="w-full sm:w-auto px-4 py-2.5 bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 shadow-sm transition-all active:scale-95 shrink-0"
          >
            <Printer className="w-4 h-4" />
            <span>បោះពុម្ព</span>
          </button>
        </div>
      </div>

      {/* Timetable Grid */}
      <div className="relative">
        {/* បង្ហាញ Loading ពេលកំពុងទាញយកកាលវិភាគ */}
        {loadingSchedule ? (
          <div className="py-20 flex flex-col items-center justify-center gap-3 bg-white dark:bg-[#1e293b] rounded-2xl border border-slate-200 dark:border-slate-800">
             <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
             <p className="text-sm text-slate-500">កំពុងទាញយកកាលវិភាគ...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {days.map((day) => {
              // ប្រើ `schedule` ជំនួស `defaultSchedule`
              const daySlots = schedule.filter((s) => s.day === day.key);
              return (
                <div
                  key={day.key}
                  className="bg-white dark:bg-[#1e293b] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden"
                >
                  {/* Day Header */}
                  <div className="px-4 py-3 bg-slate-50/80 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <span className="font-semibold text-sm text-slate-800 dark:text-slate-200">{day.label}</span>
                    <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-slate-200/60 dark:bg-slate-700 text-slate-600 dark:text-slate-300 font-medium">
                      {daySlots.length} ម៉ោង
                    </span>
                  </div>

                  {/* Slots */}
                  <div className="p-4 space-y-3">
                    {daySlots.length === 0 ? (
                      <div className="py-8 text-center flex flex-col items-center justify-center gap-2">
                        <BookOpen className="w-6 h-6 text-slate-300 dark:text-slate-600" strokeWidth={1.5} />
                        <span className="text-xs text-slate-400 font-medium">គ្មានម៉ោងបង្រៀន</span>
                      </div>
                    ) : (
                      daySlots.map((slot, sIdx) => (
                        <div
                          key={sIdx}
                          className="group p-3 rounded-xl bg-white dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/60 hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-sm transition-all space-y-2"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <span className="font-bold text-sm text-slate-800 dark:text-white leading-tight">
                              {slot.subject}
                            </span>
                            <span className="shrink-0 px-2 py-0.5 rounded-md text-[11px] font-bold bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-500/20">
                              {slot.class}
                            </span>
                          </div>
                          
                          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-1">
                            <div className="flex items-center gap-1.5">
                              <Clock className="w-3.5 h-3.5 text-slate-400" />
                              <span className="font-mono">{slot.time}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <School className="w-3.5 h-3.5 text-slate-400" />
                              <span>បន្ទប់ {slot.room}</span>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default TeacherTimetable;