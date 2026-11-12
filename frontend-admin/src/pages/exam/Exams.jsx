import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  FileText,
  Calendar,
  Clock,
  Award,
  CheckCircle2,
  AlertCircle,
  Plus,
  Calculator,
  Trophy,
  Printer,
  X,
  Trash2,
} from 'lucide-react';
import { examService } from '../../services';
import { useApp } from '../../context/AppContext';

const Exams = () => {
  const { lang } = useApp();
  const [searchParams, setSearchParams] = useSearchParams();
  const currentTab = searchParams.get('tab') || 'exams';
  const navigate = useNavigate();

  const [exams, setExams] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [rankings, setRankings] = useState([]);
  const [reportCards, setReportCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [calcSummary, setCalcSummary] = useState(null);

  // Modal: Create Exam
  const [isExamModalOpen, setIsExamModalOpen] = useState(false);
  const [newExam, setNewExam] = useState({
    title: '',
    academic_year: '2025-2026',
    start_date: '2026-12-15',
    end_date: '2026-12-20',
    status: 'upcoming',
  });

  // Modal: Create Schedule
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [newSchedule, setNewSchedule] = useState({
    date: '2026-12-15',
    time: '07:30 - 09:00 AM',
    subject: 'គណិតវិទ្យា',
    grade: 'ថ្នាក់ទី ១២',
    duration: '90 នាទី',
    rooms: 'បន្ទប់ 101 - 108',
  });

  const setTab = (tab) => {
    setSearchParams({ tab });
  };

  const showMsg = (msg) => {
    setMessage(msg);
    setTimeout(() => setMessage(''), 3500);
  };

  const fetchExamsData = async () => {
    setLoading(true);
    try {
      const [eRes, sRes, rRes, rcRes] = await Promise.all([
        examService.getExams(),
        examService.getExamSchedule(),
        examService.getStudentRankings(),
        examService.getReportCards(),
      ]);
      setExams(eRes?.exams || []);
      setSchedules(sRes?.schedules || eRes?.exam_schedule || []);
      setRankings(rRes?.rankings || []);
      setReportCards(rcRes?.cards || []);
    } catch (err) {
      console.warn('Error fetching exam data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExamsData();
  }, []);

  const handleCreateExam = async (e) => {
    e.preventDefault();
    try {
      await examService.createExam(newExam);
      showMsg('✅ បានបង្កើតសម័យប្រឡងថ្មីដោយជោគជ័យ!');
      setIsExamModalOpen(false);
      setNewExam({ title: '', academic_year: '2025-2026', start_date: '2026-12-15', end_date: '2026-12-20', status: 'upcoming' });
      fetchExamsData();
    } catch {
      showMsg('❌ បរាជ័យក្នុងការបង្កើតសម័យប្រឡង');
    }
  };

  const handleDeleteExam = async (id) => {
    if (!window.confirm('តើអ្នកចង់លុបសម័យប្រឡងនេះមែនទេ?')) return;
    try {
      await examService.deleteExam(id);
      showMsg('✅ បានលុបសម័យប្រឡងរួចរាល់');
      fetchExamsData();
    } catch {
      showMsg('❌ បរាជ័យក្នុងការលុប');
    }
  };

  const handleCreateSchedule = async (e) => {
    e.preventDefault();
    try {
      await examService.createExamSchedule(newSchedule);
      showMsg('✅ បានបន្ថែមវិញ្ញាសាក្នុងកាលវិភាគប្រឡងដោយជោគជ័យ!');
      setIsScheduleModalOpen(false);
      fetchExamsData();
    } catch {
      showMsg('❌ បរាជ័យក្នុងការរក្សាទុកកាលវិភាគ');
    }
  };

  const handleRunCalculation = async () => {
    try {
      const res = await examService.calculateGrades();
      setCalcSummary(res?.summary || null);
      showMsg('✅ បានដំណើរការគណនាពិន្ទុ និងនិទ្ទេសសិស្សរួចរាល់!');
    } catch {
      showMsg('❌ បរាជ័យក្នុងការគណនា');
    }
  };

  return (
    <div className="space-y-6 font-khmer transition-colors duration-200 min-h-full">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            ៤. ការប្រឡង & លទ្ធផល (Examination & Results)
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            គ្រប់គ្រងសម័យប្រឡង កាលវិភាគ បញ្ចូលពិន្ទុ គណនានិទ្ទេស ចំណាត់ថ្នាក់ និងព្រឹត្តិបត្រពិន្ទុ
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => navigate('/grades')}
            className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-2 rounded-xl text-xs font-semibold shadow-xs cursor-pointer"
          >
            <Calculator className="w-3.5 h-3.5" />
            <span>បញ្ចូលពិន្ទុសិស្ស</span>
          </button>
          <button
            onClick={() => setIsExamModalOpen(true)}
            className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white px-3.5 py-2 rounded-xl text-xs font-semibold shadow-xs cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>បង្កើតសម័យប្រឡង</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 dark:border-gray-800 pb-3">
        {[
          { key: 'exams', label: 'សម័យប្រឡង (Exams)', icon: FileText },
          { key: 'schedule', label: 'កាលវិភាគប្រឡង (Schedule)', icon: Calendar },
          { key: 'calculation', label: 'គណនានិទ្ទេស MoEYS', icon: Calculator },
          { key: 'ranking', label: 'តារាងចំណាត់ថ្នាក់ (Rankings)', icon: Trophy },
          { key: 'report-cards', label: 'ព្រឹត្តិបត្រពិន្ទុ (Report Cards)', icon: Award },
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

      {/* TAB 1: EXAM MANAGEMENT */}
      {currentTab === 'exams' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {(exams.length > 0 ? exams : [
            { id: 1, title: 'ការប្រឡងឆមាសលើកទី ១', type: 'Semester Exam', academic_year: '2025-2026', start_date: '2026-12-15', end_date: '2026-12-18', status: 'upcoming', total_students: 850 },
            { id: 2, title: 'ការប្រឡងសាកល្បងបាក់ឌុប (Mock BacII)', type: 'National Mock Exam', academic_year: '2025-2026', start_date: '2026-11-20', end_date: '2026-11-21', status: 'upcoming', total_students: 260 },
            { id: 3, title: 'ការប្រឡងប្រចាំខែ វិច្ឆិកា', type: 'Monthly Test', academic_year: '2025-2026', start_date: '2026-11-28', end_date: '2026-11-30', status: 'planned', total_students: 850 },
          ]).map((ex) => (
            <div key={ex.id} className="bg-white dark:bg-[#1e293b] rounded-2xl border border-slate-200 dark:border-gray-800 p-5 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] bg-blue-500/10 text-blue-500 font-bold px-2.5 py-0.5 rounded-full">
                    {ex.type || 'ប្រឡងផ្លូវការ'}
                  </span>
                  <span className="text-[10px] bg-emerald-500/10 text-emerald-500 font-bold px-2 py-0.5 rounded-full">
                    {ex.status}
                  </span>
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white leading-snug">
                  {ex.title}
                </h3>
                <div className="text-xs text-slate-400 mt-2 space-y-1">
                  <div>ឆ្នាំសិក្សា: {ex.academic_year}</div>
                  <div>កាលបរិច្ឆេទ: {ex.start_date} ដល់ {ex.end_date}</div>
                  <div>បេក្ខជនសរុប: {ex.total_students || 850} នាក់</div>
                </div>
              </div>
              <div className="mt-5 pt-3 border-t border-slate-100 dark:border-gray-800 flex justify-between items-center">
                <button onClick={() => setTab('schedule')} className="text-xs text-blue-500 font-semibold hover:underline">
                  មើលកាលវិភាគ →
                </button>
                <div className="flex items-center gap-2">
                  <button onClick={() => navigate('/grades')} className="text-xs text-emerald-500 font-semibold hover:underline">
                    បញ្ចូលពិន្ទុ →
                  </button>
                  <button onClick={() => handleDeleteExam(ex.id)} className="text-red-400 hover:text-red-500 p-1">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 2: EXAM SCHEDULE */}
      {currentTab === 'schedule' && (
        <div className="bg-white dark:bg-[#1e293b] p-6 rounded-2xl border border-slate-200 dark:border-gray-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              កាលវិភាគប្រឡងលម្អិតតាមមុខវិជ្ជា (Detailed Exam Timetable)
            </h3>
            <button
              onClick={() => setIsScheduleModalOpen(true)}
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>បន្ថែមវិញ្ញាសាប្រឡង</span>
            </button>
          </div>
          <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-gray-800">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 dark:bg-[#252d52] font-bold">
                <tr>
                  <th className="p-3">កាលបរិច្ឆេទ</th>
                  <th className="p-3">ម៉ោងប្រឡង</th>
                  <th className="p-3">មុខវិជ្ជាវិញ្ញាសា</th>
                  <th className="p-3">កម្រិតថ្នាក់</th>
                  <th className="p-3">រយៈពេល</th>
                  <th className="p-3">បន្ទប់ប្រឡង</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-gray-800">
                {(schedules.length > 0 ? schedules : [
                  { date: '2026-12-15', time: '07:30 - 09:00 AM', subject: 'គណិតវិទ្យា (ថ្នាក់វិទ្យាសាស្ត្រ)', grade: 'ថ្នាក់ទី ១២', duration: '90 នាទី', rooms: 'បន្ទប់ 101 - 108' },
                  { date: '2026-12-15', time: '09:30 - 11:00 AM', subject: 'រូបវិទ្យា', grade: 'ថ្នាក់ទី ១២', duration: '90 នាទី', rooms: 'បន្ទប់ 101 - 108' },
                  { date: '2026-12-16', time: '07:30 - 09:00 AM', subject: 'អក្សរសាស្ត្រខ្មែរ', grade: 'ថ្នាក់ទី ១២', duration: '90 នាទី', rooms: 'បន្ទប់ 101 - 108' },
                  { date: '2026-12-16', time: '09:30 - 11:00 AM', subject: 'គីមីវិទ្យា / ជីវវិទ្យា', grade: 'ថ្នាក់ទី ១២', duration: '90 នាទី', rooms: 'បន្ទប់ 101 - 108' },
                  { date: '2026-12-17', time: '07:30 - 09:00 AM', subject: 'ភាសាអង់គ្លេស', grade: 'ថ្នាក់ទី ១២', duration: '90 នាទី', rooms: 'បន្ទប់ 101 - 108' },
                ]).map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-[#252d52]/50">
                    <td className="p-3 font-mono">{row.date}</td>
                    <td className="p-3 font-mono text-blue-500 font-bold">{row.time}</td>
                    <td className="p-3 font-bold text-slate-900 dark:text-white">{row.subject}</td>
                    <td className="p-3">{row.grade}</td>
                    <td className="p-3">{row.duration}</td>
                    <td className="p-3 font-mono">{row.rooms}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: GRADE CALCULATION */}
      {currentTab === 'calculation' && (
        <div className="bg-white dark:bg-[#1e293b] p-6 rounded-2xl border border-slate-200 dark:border-gray-800 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                រូបមន្តគណនាពិន្ទុ និងការកំណត់និទ្ទេស (Grade Scale MoEYS)
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                ប្រព័ន្ធគណនាពិន្ទុមធ្យមភាគ និងកម្រិតនិទ្ទេសស្វ័យប្រវត្តិតាមស្តង់ដារក្រសួងអប់រំ យុវជន និងកីឡា
              </p>
            </div>
            <button
              onClick={handleRunCalculation}
              className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow-xs flex items-center gap-2 cursor-pointer self-start sm:self-auto"
            >
              <Calculator className="w-4 h-4" />
              <span>ដំណើរការគណនាពិន្ទុស្វ័យប្រវត្តិ</span>
            </button>
          </div>

          {calcSummary && (
            <div className="p-4 bg-emerald-50 dark:bg-[#132d2e] rounded-xl border border-emerald-300 dark:border-emerald-700 space-y-2">
              <div className="text-xs font-bold text-emerald-700 dark:text-emerald-300">
                លទ្ធផលគណនាថ្មីៗ: គណនាសិស្សសរុប {calcSummary.total_students_calculated} នាក់ (អត្រាជាប់ {calcSummary.pass_rate})
              </div>
              <div className="flex flex-wrap gap-3 text-xs font-mono font-bold">
                <span className="text-emerald-600">និទ្ទេស A: {calcSummary.grade_A}</span>
                <span className="text-blue-600">និទ្ទេស B: {calcSummary.grade_B}</span>
                <span className="text-cyan-600">និទ្ទេស C: {calcSummary.grade_C}</span>
                <span className="text-amber-600">និទ្ទេស D: {calcSummary.grade_D}</span>
                <span className="text-orange-600">និទ្ទេស E: {calcSummary.grade_E}</span>
                <span className="text-rose-600">និទ្ទេស F: {calcSummary.grade_F}</span>
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
            {[
              { grade: 'និទ្ទេស A', range: 'មធ្យមភាគ ≥ 85.0%', desc: 'ល្អប្រសើរ (Excellent)', color: 'border-emerald-500 text-emerald-500' },
              { grade: 'និទ្ទេស B', range: '75.0% - 84.9%', desc: 'ល្អណាស់ (Very Good)', color: 'border-blue-500 text-blue-500' },
              { grade: 'និទ្ទេស C', range: '65.0% - 74.9%', desc: 'ល្អ (Good)', color: 'border-cyan-500 text-cyan-500' },
              { grade: 'និទ្ទេស D', range: '55.0% - 64.9%', desc: 'ល្អបង្គួរ (Fair)', color: 'border-amber-500 text-amber-500' },
              { grade: 'និទ្ទេស E', range: '50.0% - 54.9%', desc: 'មធ្យម (Passing)', color: 'border-orange-500 text-orange-500' },
              { grade: 'និទ្ទេស F', range: '< 50.0%', desc: 'ធ្លាក់ (Fail)', color: 'border-rose-500 text-rose-500' },
            ].map((g, idx) => (
              <div key={idx} className={`p-4 rounded-xl bg-slate-100 dark:bg-[#252d52] border-t-4 ${g.color}`}>
                <div className="text-sm font-bold">{g.grade}</div>
                <div className="text-xs font-mono font-bold mt-1 text-slate-900 dark:text-white">{g.range}</div>
                <div className="text-[11px] text-slate-400 mt-1">{g.desc}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: STUDENT RANKING */}
      {currentTab === 'ranking' && (
        <div className="bg-white dark:bg-[#1e293b] p-6 rounded-2xl border border-slate-200 dark:border-gray-800 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                តារាងចំណាត់ថ្នាក់សិស្ស (Student Ranking - MoEYS Standard)
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                ចំណាត់ថ្នាក់តាមថ្នាក់នីមួយៗ គិតតាមមធ្យមភាគពិន្ទុ
              </p>
            </div>
            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white rounded-xl text-xs font-semibold cursor-pointer">
              <Printer className="w-3.5 h-3.5" />
              <span>បោះពុម្ពតារាងចំណាត់ថ្នាក់</span>
            </button>
          </div>

          <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-gray-800">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 dark:bg-[#252d52] font-bold">
                <tr>
                  <th className="p-3 text-center">ចំណាត់ថ្នាក់</th>
                  <th className="p-3">អត្តលេខ</th>
                  <th className="p-3">ឈ្មោះសិស្ស</th>
                  <th className="p-3">ថ្នាក់</th>
                  <th className="p-3">ពិន្ទុសរុប</th>
                  <th className="p-3">មធ្យមភាគ</th>
                  <th className="p-3 text-center">និទ្ទេស</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-gray-800">
                {(rankings.length > 0 ? rankings : [
                  { rank: 1, student_code: 'STU7589', name: 'សុខ ចាន់ដារ៉ា', classroom: '12A', total_score: 475, average: 95.0, letter_grade: 'A' },
                  { rank: 2, student_code: 'STU8901', name: 'កែវ វិសាល', classroom: '12A', total_score: 445, average: 89.0, letter_grade: 'A' },
                  { rank: 3, student_code: 'STU9120', name: 'ហេង សុជាតា', classroom: '12A', total_score: 412, average: 82.4, letter_grade: 'B' },
                  { rank: 4, student_code: 'STU9121', name: 'ម៉ៅ វណ្ណដា', classroom: '12A', total_score: 388, average: 77.6, letter_grade: 'B' },
                  { rank: 5, student_code: 'STU9122', name: 'ជា រស្មី', classroom: '12A', total_score: 355, average: 71.0, letter_grade: 'C' },
                ]).map((r, idx) => (
                  <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-[#252d52]/50">
                    <td className="p-3 text-center">
                      <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full font-bold text-xs ${
                        r.rank === 1 ? 'bg-amber-500 text-white' :
                        r.rank === 2 ? 'bg-slate-300 text-slate-800' :
                        r.rank === 3 ? 'bg-amber-700 text-white' :
                        'bg-slate-100 dark:bg-gray-800 text-slate-500'
                      }`}>
                        {r.rank}
                      </span>
                    </td>
                    <td className="p-3 font-mono font-bold text-blue-500">{r.student_code || r.code}</td>
                    <td className="p-3 font-bold text-slate-900 dark:text-white">{r.name || r.full_name_km}</td>
                    <td className="p-3">{r.classroom || r.class}</td>
                    <td className="p-3 font-mono font-bold">{r.total_score || (r.average ? r.average * 5 : '-')}</td>
                    <td className="p-3 font-mono font-bold text-emerald-500">{r.average}</td>
                    <td className="p-3 text-center">
                      <span className="px-2.5 py-0.5 rounded-md font-bold text-xs bg-blue-500/10 text-blue-500">
                        {r.letter_grade || r.grade}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 5: REPORT CARDS */}
      {currentTab === 'report-cards' && (
        <div className="bg-white dark:bg-[#1e293b] p-6 rounded-2xl border border-slate-200 dark:border-gray-800 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                ព្រឹត្តិបត្រពិន្ទុសិស្ស និងសៀវភៅតាមដាន (Report Cards & Transcript)
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                ទាញយក ឬបោះពុម្ពសន្លឹកព្រឹត្តិបត្រពិន្ទុប្រចាំឆមាសជូនអាណាព្យាបាល
              </p>
            </div>
            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white rounded-xl text-xs font-semibold cursor-pointer">
              <Printer className="w-3.5 h-3.5" />
              <span>បោះពុម្ពព្រឹត្តិបត្រទាំងអស់</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl bg-slate-100 dark:bg-[#252d52] border border-slate-200 dark:border-[#333d6d]">
              <div className="text-sm font-bold text-slate-900 dark:text-white">ព្រឹត្តិបត្រពិន្ទុឆមាសទី ១</div>
              <p className="text-xs text-slate-400 mt-1">ទម្រង់ផ្លូវការក្រសួងអប់រំ យុវជន និងកីឡា សម្រាប់សិស្សថ្នាក់ទី ១០ ដល់ ១២</p>
              <div className="mt-4 flex gap-2">
                <button
                  onClick={() => alert('កំពុងបង្កើត PDF ព្រឹត្តិបត្រពិន្ទុ...')}
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold cursor-pointer"
                >
                  ទាញយក PDF
                </button>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-100 dark:bg-[#252d52] border border-slate-200 dark:border-[#333d6d]">
              <div className="text-sm font-bold text-slate-900 dark:text-white">តារាងកិត្តិយស (Honor Roll)</div>
              <p className="text-xs text-slate-400 mt-1">បញ្ជីសិស្សពូកែចំណាត់ថ្នាក់លេខ ១, ២, ៣ ប្រចាំវិទ្យាល័យ និងតាមថ្នាក់</p>
              <div className="mt-4 flex gap-2">
                <button
                  onClick={() => alert('កំពុងបង្កើត PDF តារាងកិត្តិយស...')}
                  className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-semibold cursor-pointer"
                >
                  ទាញយកតារាងកិត្តិយស
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Create Exam */}
      {isExamModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs font-khmer">
          <div className="bg-white dark:bg-[#1e293b] rounded-2xl w-full max-w-md p-6 border border-slate-200 dark:border-gray-800">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100 dark:border-gray-800">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">បង្កើតសម័យប្រឡងថ្មី</h3>
              <button onClick={() => setIsExamModalOpen(false)} className="text-slate-400 hover:text-slate-200"><X className="w-4 h-4" /></button>
            </div>
            <form onSubmit={handleCreateExam} className="space-y-4 mt-4 text-xs">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 mb-1">ចំណងជើងសម័យប្រឡង</label>
                <input
                  type="text"
                  required
                  placeholder="ការប្រឡងឆមាសទី ២"
                  value={newExam.title}
                  onChange={(e) => setNewExam({ ...newExam, title: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-slate-700 dark:text-slate-300 mb-1">ឆ្នាំសិក្សា</label>
                <input
                  type="text"
                  required
                  value={newExam.academic_year}
                  onChange={(e) => setNewExam({ ...newExam, academic_year: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 mb-1">កាលបរិច្ឆេទចាប់ផ្តើម</label>
                  <input
                    type="date"
                    required
                    value={newExam.start_date}
                    onChange={(e) => setNewExam({ ...newExam, start_date: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 mb-1">កាលបរិច្ឆេទបញ្ចប់</label>
                  <input
                    type="date"
                    required
                    value={newExam.end_date}
                    onChange={(e) => setNewExam({ ...newExam, end_date: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setIsExamModalOpen(false)} className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl">បោះបង់</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-xl font-bold">រក្សាទុក</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Create Schedule */}
      {isScheduleModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs font-khmer">
          <div className="bg-white dark:bg-[#1e293b] rounded-2xl w-full max-w-md p-6 border border-slate-200 dark:border-gray-800">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100 dark:border-gray-800">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">បន្ថែមវិញ្ញាសាក្នុងកាលវិភាគ</h3>
              <button onClick={() => setIsScheduleModalOpen(false)} className="text-slate-400 hover:text-slate-200"><X className="w-4 h-4" /></button>
            </div>
            <form onSubmit={handleCreateSchedule} className="space-y-4 mt-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 mb-1">កាលបរិច្ឆេទ</label>
                  <input
                    type="date"
                    required
                    value={newSchedule.date}
                    onChange={(e) => setNewSchedule({ ...newSchedule, date: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 mb-1">ម៉ោងប្រឡង</label>
                  <input
                    type="text"
                    required
                    placeholder="07:30 - 09:00 AM"
                    value={newSchedule.time}
                    onChange={(e) => setNewSchedule({ ...newSchedule, time: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                  />
                </div>
              </div>
              <div>
                <label className="block text-slate-700 dark:text-slate-300 mb-1">មុខវិជ្ជា</label>
                <input
                  type="text"
                  required
                  placeholder="គណិតវិទ្យា"
                  value={newSchedule.subject}
                  onChange={(e) => setNewSchedule({ ...newSchedule, subject: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 mb-1">កម្រិតថ្នាក់</label>
                  <input
                    type="text"
                    value={newSchedule.grade}
                    onChange={(e) => setNewSchedule({ ...newSchedule, grade: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 mb-1">បន្ទប់ប្រឡង</label>
                  <input
                    type="text"
                    value={newSchedule.rooms}
                    onChange={(e) => setNewSchedule({ ...newSchedule, rooms: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setIsScheduleModalOpen(false)} className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl">បោះបង់</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-xl font-bold">រក្សាទុក</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Exams;
