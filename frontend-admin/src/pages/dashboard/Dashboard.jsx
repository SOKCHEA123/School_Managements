import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  GraduationCap,
  School,
  CalendarCheck,
  Plus,
  ArrowUpRight,
  Clock,
  Megaphone,
  TrendingUp,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { dashboardService } from '../../services';
import { useApp } from '../../context/AppContext';

const chartData = [
  { name: 'មករា', students: 400 },
  { name: 'កុម្ភៈ', students: 450 },
  { name: 'មីនា', students: 420 },
  { name: 'មេសា', students: 480 },
  { name: 'ឧសភា', students: 550 },
  { name: 'មិថុនា', students: 510 },
  { name: 'កក្កដា', students: 600 },
  { name: 'សីហា', students: 650 },
  { name: 'កញ្ញា', students: 620 },
  { name: 'តុលា', students: 720 },
  { name: 'វិច្ឆិកា', students: 780 },
  { name: 'ធ្នូ', students: 850 },
];

// Explicit color maps so Tailwind can detect classes at build time
const COLORS = {
  emerald: { text: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-500/10', dot: 'bg-emerald-500' },
  blue:    { text: 'text-blue-600 dark:text-blue-400',       bg: 'bg-blue-50 dark:bg-blue-500/10',       dot: 'bg-blue-500' },
  violet:  { text: 'text-violet-600 dark:text-violet-400',   bg: 'bg-violet-50 dark:bg-violet-500/10',   dot: 'bg-violet-500' },
  amber:   { text: 'text-amber-600 dark:text-amber-400',     bg: 'bg-amber-50 dark:bg-amber-500/10',     dot: 'bg-amber-500' },
  rose:    { text: 'text-rose-600 dark:text-rose-400',       bg: 'bg-rose-50 dark:bg-rose-500/10',       dot: 'bg-rose-500' },
  slate:   { text: 'text-slate-600 dark:text-slate-400',     bg: 'bg-slate-50 dark:bg-slate-500/10',     dot: 'bg-slate-500' },
};

const Dashboard = () => {
  const { isDarkMode, lang } = useApp();
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    total_students: 850,
    total_teachers: 45,
    total_classrooms: 24,
    total_grades: 1250,
    today_present: 832,
    today_absent: 8,
    today_permission: 7,
    today_late: 3,
    attendance_rate: 98.2,
  });
  const [recentActivities, setRecentActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [overviewRes, activitiesRes] = await Promise.allSettled([
          dashboardService.getOverview(),
          dashboardService.getRecentActivities(),
        ]);

        if (overviewRes.status === 'fulfilled' && overviewRes.value) {
          const data = overviewRes.value?.data || overviewRes.value;
          if (data?.summary) {
            setStats((prev) => ({ ...prev, ...data.summary }));
          } else if (data?.total_students !== undefined) {
            setStats((prev) => ({ ...prev, ...data }));
          }
        }

        if (activitiesRes.status === 'fulfilled' && activitiesRes.value) {
          const actData = activitiesRes.value?.data || activitiesRes.value;
          if (Array.isArray(actData) && actData.length > 0) {
            setRecentActivities(actData.slice(0, 5));
          }
        }
      } catch {
        // Safe fallback
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  let user = null;
  try {
    const saved = localStorage.getItem('user');
    if (saved) user = JSON.parse(saved);
  } catch {
    user = null;
  }

  const statCards = [
    { label: 'សិស្សសរុប',    sublabel: 'Total Students',  value: stats.total_students,              icon: Users,         color: 'emerald', trend: '+12.5%', trendUp: true },
    { label: 'គ្រូបង្រៀន',   sublabel: 'Total Teachers',  value: stats.total_teachers,              icon: GraduationCap, color: 'blue',    trend: '+4.1%',  trendUp: true },
    { label: 'ថ្នាក់រៀន',     sublabel: 'Classrooms',      value: stats.total_classrooms,            icon: School,        color: 'violet',  trend: 'Stable', trendUp: null },
    { label: 'អត្រាវត្តមាន', sublabel: 'Attendance Rate', value: `${stats.attendance_rate || 98.2}%`, icon: CalendarCheck, color: 'amber',   trend: 'ខ្ពស់',  trendUp: true },
  ];

  const attendanceItems = [
    { label: 'មកទាន់ពេល', value: stats.today_present || 832,    color: 'emerald' },
    { label: 'សុំច្បាប់',    value: stats.today_permission || 7,  color: 'amber' },
    { label: 'មកយឺត',       value: stats.today_late || 3,        color: 'blue' },
    { label: 'អវត្តមាន',    value: stats.today_absent || 8,      color: 'rose' },
  ];

  return (
    <div className="space-y-5 min-h-full bg-slate-50 dark:bg-[#0b1120] text-slate-700 dark:text-gray-300 font-khmer transition-colors duration-200">

      {/* Header */}
      <div className="rounded-xl bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-gray-800 p-5 sm:p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
              ផ្ទាំងគ្រប់គ្រង
            </p>
            <h1 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
              សូមស្វាគមន៍, {user?.name || user?.username || 'Admin'}
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              វិទ្យាល័យ ហ៊ុន សែន ស្នួល · ឆ្នាំសិក្សា ២០២៥-២០២៦
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => navigate('/students')}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              បន្ថែមសិស្ស
            </button>
            <button
              onClick={() => navigate('/grades')}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold bg-white dark:bg-[#0f172a] text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-gray-700 hover:bg-slate-50 dark:hover:bg-[#1a2438] transition-colors"
            >
              <ArrowUpRight className="w-3.5 h-3.5" />
              បញ្ចូលពិន្ទុ
            </button>
            <button
              onClick={() => navigate('/attendance')}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white transition-colors"
            >
              <CalendarCheck className="w-3.5 h-3.5" />
              កត់ត្រាវត្តមាន
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {statCards.map((card, idx) => {
          const Icon = card.icon;
          const c = COLORS[card.color];
          return (
            <div
              key={idx}
              className="bg-white dark:bg-[#1e293b] p-4 rounded-xl border border-slate-200 dark:border-gray-800 transition-colors hover:border-slate-300 dark:hover:border-gray-700"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="text-xs font-semibold text-slate-700 dark:text-gray-200">{card.label}</h4>
                  <p className="text-[10px] text-slate-400 dark:text-gray-500 mt-0.5">{card.sublabel}</p>
                </div>
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${c.bg}`}>
                  <Icon className={`w-4 h-4 ${c.text}`} />
                </div>
              </div>
              <div className="flex items-end justify-between">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                  {loading ? (
                    <span className="inline-block w-12 h-6 bg-slate-200 dark:bg-gray-700 rounded animate-pulse" />
                  ) : (
                    card.value
                  )}
                </h2>
                <span
                  className={`flex items-center gap-0.5 text-[10px] font-semibold px-1.5 py-0.5 rounded ${
                    card.trendUp === true
                      ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10'
                      : card.trendUp === false
                      ? 'text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-500/10'
                      : 'text-slate-500 dark:text-gray-400 bg-slate-100 dark:bg-slate-500/10'
                  }`}
                >
                  {card.trendUp === true && <TrendingUp className="w-2.5 h-2.5" />}
                  {card.trend}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Chart + Attendance */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Chart */}
        <div className="lg:col-span-2 bg-white dark:bg-[#1e293b] rounded-xl border border-slate-200 dark:border-gray-800 p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white">កំណើនសិស្សប្រចាំឆ្នាំ</h3>
              <p className="text-[11px] text-slate-500 dark:text-gray-500 mt-0.5">ស្ថិតិសិស្សតាមខែ</p>
            </div>
            <span className="flex items-center gap-1 px-2 py-1 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded text-[11px] font-semibold">
              <TrendingUp className="w-3 h-3" />
              +15.4%
            </span>
          </div>
          <div className="h-52 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorStudents" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#64748b" opacity={0.12} />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 10, fill: '#94a3b8' }}
                  axisLine={false}
                  tickLine={false}
                  dy={5}
                />
                <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    fontSize: 12,
                    borderRadius: 8,
                    border: '1px solid #e2e8f0',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                    padding: '6px 10px',
                  }}
                  labelStyle={{ fontWeight: 600, marginBottom: 2 }}
                />
                <Area
                  type="monotone"
                  dataKey="students"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorStudents)"
                  activeDot={{ r: 4, strokeWidth: 2, stroke: '#fff' }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Attendance */}
        <div className="bg-white dark:bg-[#1e293b] rounded-xl border border-slate-200 dark:border-gray-800 p-5 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">វត្តមានថ្ងៃនេះ</h3>
            <div className="space-y-2">
              {attendanceItems.map((item, idx) => {
                const c = COLORS[item.color];
                return (
                  <div
                    key={idx}
                    className={`flex items-center justify-between px-3 py-2 rounded-lg ${c.bg}`}
                  >
                    <div className="flex items-center gap-2">
                      <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
                      <span className={`text-xs font-medium ${c.text}`}>{item.label}</span>
                    </div>
                    <span className={`text-sm font-bold ${c.text}`}>{item.value}</span>
                  </div>
                );
              })}
            </div>
          </div>
          <button
            onClick={() => navigate('/attendance')}
            className="w-full mt-3 py-2 bg-slate-100 dark:bg-[#0f172a] hover:bg-slate-200 dark:hover:bg-[#1a2438] text-slate-700 dark:text-slate-200 rounded-lg text-xs font-semibold transition-colors flex items-center justify-center gap-1"
          >
            ពិនិត្យលម្អិត
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Gender */}
        <div className="bg-white dark:bg-[#1e293b] p-4 rounded-xl border border-slate-200 dark:border-gray-800">
          <h4 className="text-xs font-semibold text-slate-900 dark:text-white mb-3">ស្ថិតិសិស្ស</h4>
          <div className="space-y-2.5">
            <div className="flex justify-between text-xs mb-1.5">
              <span className="text-blue-600 dark:text-blue-400 font-medium flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-blue-500" />
                ប្រុស 418
              </span>
              <span className="text-pink-600 dark:text-pink-400 font-medium flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-pink-500" />
                ស្រី 432
              </span>
            </div>
            <div className="w-full bg-slate-100 dark:bg-gray-700 h-1.5 rounded-full overflow-hidden flex">
              <div className="bg-blue-500 h-full w-[49.2%]" />
              <div className="bg-pink-500 h-full w-[50.8%]" />
            </div>
            <div className="pt-2.5 border-t border-slate-100 dark:border-gray-800 flex justify-between text-xs">
              <span className="text-emerald-600 dark:text-emerald-400 font-medium">វិទ្យាសាស្ត្រ 520</span>
              <span className="text-violet-600 dark:text-violet-400 font-medium">សង្គម 330</span>
            </div>
          </div>
        </div>

        {/* Grades */}
        <div className="bg-white dark:bg-[#1e293b] p-4 rounded-xl border border-slate-200 dark:border-gray-800">
          <h4 className="text-xs font-semibold text-slate-900 dark:text-white mb-3">កម្រិតថ្នាក់</h4>
          <div className="space-y-1.5 text-xs">
            {[
              { label: 'ថ្នាក់ទី ១០', value: 310, color: 'blue' },
              { label: 'ថ្នាក់ទី ១១', value: 280, color: 'violet' },
              { label: 'ថ្នាក់ទី ១២', value: 260, color: 'amber' },
            ].map((g, idx) => (
              <div
                key={idx}
                className="flex justify-between items-center px-2.5 py-2 rounded-md bg-slate-50 dark:bg-[#252852]"
              >
                <span className={`font-medium ${COLORS[g.color].text}`}>{g.label}</span>
                <span className="font-bold text-slate-900 dark:text-white">{g.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Teachers */}
        <div className="bg-white dark:bg-[#1e293b] p-4 rounded-xl border border-slate-200 dark:border-gray-800">
          <h4 className="text-xs font-semibold text-slate-900 dark:text-white mb-3">គ្រូបង្រៀន</h4>
          <div className="space-y-1.5 text-xs">
            {[
              { label: 'ក្របខណ្ឌរដ្ឋ', value: 38, color: 'emerald' },
              { label: 'កិច្ចសន្យា',   value: 7,  color: 'blue' },
              { label: 'បន្ទុកថ្នាក់',   value: 24, color: 'amber' },
            ].map((t, idx) => (
              <div
                key={idx}
                className="flex justify-between items-center px-2.5 py-2 rounded-md bg-slate-50 dark:bg-[#252852]"
              >
                <span className={`font-medium ${COLORS[t.color].text}`}>{t.label}</span>
                <span className="font-bold text-slate-900 dark:text-white">{t.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Activities & Announcements */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Activities */}
        <div className="bg-white dark:bg-[#1e293b] p-5 rounded-xl border border-slate-200 dark:border-gray-800">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-slate-400" />
              សកម្មភាពថ្មីៗ
            </h3>
            <button
              onClick={() => navigate('/security?tab=logs')}
              className="text-[11px] text-blue-600 dark:text-blue-400 font-semibold hover:underline flex items-center gap-0.5"
            >
              មើលទាំងអស់
              <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>
          <div className="divide-y divide-slate-100 dark:divide-gray-800">
            {(recentActivities.length > 0
              ? recentActivities.map((act) => ({
                  time: act.created_at
                    ? new Date(act.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                    : 'ឥឡូវនេះ',
                  user: act.causer_name || act.user?.name || act.user_name || 'Admin',
                  action: act.description || act.action || 'សកម្មភាពប្រព័ន្ធ',
                  badge: act.log_name || 'System',
                  badgeColor: 'blue',
                }))
              : [
                  { time: '10 នាទីមុន', user: 'Admin Sokchea',        action: 'បញ្ចូលពិន្ទុ ថ្នាក់ 12A គណិតវិទ្យា',       badge: 'Grades',     badgeColor: 'blue' },
                  { time: '25 នាទីមុន', user: 'លោកគ្រូ សុភា',         action: 'កត់ត្រាវត្តមាន 11B (34/35)',            badge: 'Attendance', badgeColor: 'emerald' },
                  { time: '1 ម៉ោងមុន',  user: 'ការិយាល័យសិក្សា',       action: 'ចុះឈ្មោះសិស្សថ្មី 3 នាក់ ថ្នាក់ 10C',    badge: 'Students',   badgeColor: 'violet' },
                ]
            ).map((act, idx) => {
              const c = COLORS[act.badgeColor];
              return (
                <div key={idx} className="py-2.5 flex items-start justify-between gap-3 text-xs">
                  <div className="flex items-start gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-200 text-[10px] font-bold shrink-0">
                      {act.user.charAt(0)}
                    </div>
                    <div>
                      <div className="font-semibold text-slate-900 dark:text-white">{act.user}</div>
                      <div className="text-slate-500 dark:text-slate-400 mt-0.5">{act.action}</div>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className={`text-[10px] ${c.bg} ${c.text} px-2 py-0.5 rounded font-semibold`}>
                      {act.badge}
                    </span>
                    <div className="text-[10px] text-slate-400 mt-1">{act.time}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Announcements */}
        <div className="bg-white dark:bg-[#1e293b] p-5 rounded-xl border border-slate-200 dark:border-gray-800">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-2">
              <Megaphone className="w-4 h-4 text-slate-400" />
              ដំណឹងសំខាន់ៗ
            </h3>
            <button
              onClick={() => navigate('/communication')}
              className="text-[11px] text-blue-600 dark:text-blue-400 font-semibold hover:underline flex items-center gap-0.5"
            >
              មើលទាំងអស់
              <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>
          <div className="space-y-2.5 text-xs">
            <div className="p-3 rounded-lg border border-slate-200 dark:border-gray-800 bg-slate-50 dark:bg-[#0f172a]">
              <div className="flex justify-between items-center mb-1.5">
                <span className="font-semibold text-blue-600 dark:text-blue-400">ប្រឡងឆមាសលើកទី ១</span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">15-18 ធ្នូ</span>
              </div>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                សម្រាប់សិស្សថ្នាក់ទី ១០ ដល់ ១២ ចាប់ពីថ្ងៃទី ១៥ ធ្នូ។
              </p>
            </div>
            <div className="p-3 rounded-lg border border-slate-200 dark:border-gray-800 bg-slate-50 dark:bg-[#0f172a]">
              <div className="flex justify-between items-center mb-1.5">
                <span className="font-semibold text-emerald-600 dark:text-emerald-400">សាលាបៃតង</span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">ចុងសប្តាហ៍</span>
              </div>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                សកម្មភាពដាំដើមឈើ និងសម្អាតបរិវេណសាលា។
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;