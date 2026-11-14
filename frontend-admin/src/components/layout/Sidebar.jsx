import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import {
  LayoutDashboard, GraduationCap, CalendarCheck, Award, Calendar,
  DollarSign, BookOpen, Megaphone, BarChart3, ShieldCheck,
  Settings, ChevronDown, School, Users, UserCheck, Layers,
  Clock, FileSpreadsheet, AlertTriangle, FolderOpen, Receipt, FileText,
  Bell, Database, Globe, Printer, Sparkles, TrendingUp,
  ArrowRightLeft, ShieldAlert, CreditCard, TrendingDown, RotateCcw,
  BookMarked, KeyRound, History, Download, Building, Image, User,
  Calculator, Trophy, CheckCircle2, AlertCircle, DoorOpen, X,
} from 'lucide-react';

const Sidebar = () => {
  const { isMobileSidebarOpen, setIsMobileSidebarOpen } = useApp();
  const location = useLocation();
  const currentPath = location.pathname + location.search;

  const menuItems = [
    {
      id: 'students',
      titleKm: 'ការគ្រប់គ្រងសិស្ស',
      icon: Users,
      // 🎨 Cyan → Sky (ស្រស់)
      iconColor: 'text-cyan-400',
      activeColor: 'text-cyan-300',
      glow: 'drop-shadow-[0_0_6px_rgba(34,211,238,0.55)]',
      tint: 'bg-cyan-500/10',
      basePath: '/students',
      subItems: [
        { label: 'បញ្ជីសិស្សទាំងអស់', to: '/students', icon: Users, subColor: 'text-cyan-400' },
        { label: 'ការឡើងថ្នាក់', to: '/students/promotion', icon: TrendingUp, subColor: 'text-emerald-400' },
        { label: 'ការផ្ទេរការសិក្សា', to: '/students/transfer', icon: ArrowRightLeft, subColor: 'text-amber-400' },
        { label: 'វិន័យ & ការព្រមាន', to: '/students/discipline', icon: ShieldAlert, subColor: 'text-rose-400' },
        { label: 'លិខិតបញ្ជាក់ការសិក្សា', to: '/students/certificates', icon: Award, subColor: 'text-violet-400' },
        { label: 'សំណុំឯកសារសិស្ស', to: '/students/documents', icon: FolderOpen, subColor: 'text-teal-400' },
      ],
    },
    {
      id: 'teachers',
      titleKm: 'ការគ្រប់គ្រងគ្រូ',
      icon: GraduationCap,
      // 🎨 Emerald (ស្រស់)
      iconColor: 'text-emerald-400',
      activeColor: 'text-emerald-300',
      glow: 'drop-shadow-[0_0_6px_rgba(52,211,153,0.55)]',
      tint: 'bg-emerald-500/10',
      basePath: '/teachers',
      subItems: [
        { label: 'បញ្ជីគ្រូបង្រៀន', to: '/teachers', icon: GraduationCap, subColor: 'text-emerald-400' },
        { label: 'វត្តមានគ្រូបង្រៀន', to: '/teachers/attendance', icon: CheckCircle2, subColor: 'text-green-400' },
        { label: 'កាលវិភាគគ្រូបង្រៀន', to: '/teachers/timetable', icon: Calendar, subColor: 'text-teal-400' },
      ],
    },
    {
      id: 'parents',
      titleKm: 'អាណាព្យាបាល',
      icon: UserCheck,
      // 🎨 Violet (ស្រស់)
      iconColor: 'text-violet-400',
      activeColor: 'text-violet-300',
      glow: 'drop-shadow-[0_0_6px_rgba(167,139,250,0.55)]',
      tint: 'bg-violet-500/10',
      basePath: '/parents',
      subItems: [
        { label: 'បញ្ជីអាណាព្យាបាល', to: '/parents', icon: UserCheck, subColor: 'text-violet-400' },
        { label: 'ទំនាក់ទំនងអាណាព្យាបាល', to: '/parents/communication', icon: Bell, subColor: 'text-fuchsia-400' },
      ],
    },
    {
      id: 'academic',
      titleKm: 'រចនាសម្ព័ន្ធសិក្សា',
      icon: School,
      // 🎨 Blue (ស្រស់)
      iconColor: 'text-blue-400',
      activeColor: 'text-blue-300',
      glow: 'drop-shadow-[0_0_6px_rgba(96,165,250,0.55)]',
      tint: 'bg-blue-500/10',
      basePath: '/academics',
      subItems: [
        { label: 'បន្ទប់រៀន', to: '/academics?tab=classrooms', icon: School, subColor: 'text-blue-400' },
        { label: 'មុខវិជ្ជា', to: '/academics?tab=subjects', icon: BookOpen, subColor: 'text-sky-400' },
        { label: 'ឆ្នាំសិក្សា', to: '/academics?tab=academic-years', icon: Calendar, subColor: 'text-indigo-400' },
        { label: 'វេន & បន្ទប់', to: '/academics?tab=sections', icon: Layers, subColor: 'text-cyan-400' },
      ],
    },
    {
      id: 'attendance',
      titleKm: 'ការគ្រប់គ្រងវត្តមាន',
      icon: CalendarCheck,
      // 🎨 Orange (ស្រស់)
      iconColor: 'text-orange-400',
      activeColor: 'text-orange-300',
      glow: 'drop-shadow-[0_0_6px_rgba(251,146,60,0.55)]',
      tint: 'bg-orange-500/10',
      basePath: '/attendance',
      subItems: [
        { label: 'វត្តមានសិស្ស', to: '/attendance?tab=student', icon: Users, subColor: 'text-cyan-400' },
        { label: 'វត្តមានគ្រូ', to: '/attendance?tab=teacher', icon: GraduationCap, subColor: 'text-emerald-400' },
        { label: 'វត្តមានប្រចាំថ្ងៃ', to: '/attendance?tab=daily', icon: CalendarCheck, subColor: 'text-orange-400' },
        { label: 'វត្តមានប្រចាំខែ', to: '/attendance?tab=monthly', icon: FileSpreadsheet, subColor: 'text-amber-400' },
        { label: 'អវត្តមាន / យឺត / ច្បាប់', to: '/attendance?tab=absent-late', icon: AlertTriangle, subColor: 'text-rose-400' },
      ],
    },
    {
      id: 'timetables',
      titleKm: 'កាលវិភាគសិក្សា',
      icon: Calendar,
      // 🎨 Sky (ស្រស់)
      iconColor: 'text-sky-400',
      activeColor: 'text-sky-300',
      glow: 'drop-shadow-[0_0_6px_rgba(56,189,248,0.55)]',
      tint: 'bg-sky-500/10',
      basePath: '/timetable',
      subItems: [
        { label: 'រចនាសម្ព័ន្ធម៉ោងរៀន', to: '/timetable?tab=structure', icon: Clock, subColor: 'text-slate-400' },
        { label: 'កាលវិភាគតាមថ្នាក់', to: '/timetable?tab=class', icon: Calendar, subColor: 'text-sky-400' },
        { label: 'កាលវិភាគគ្រូបង្រៀន', to: '/timetable?tab=teacher', icon: GraduationCap, subColor: 'text-emerald-400' },
        { label: 'កាលវិភាគបន្ទប់', to: '/timetable?tab=room', icon: DoorOpen, subColor: 'text-blue-400' },
        { label: 'កាលវិភាគប្រឡង', to: '/timetable?tab=exam', icon: FileText, subColor: 'text-indigo-400' },
        { label: 'បោះពុម្ពកាលវិភាគ', to: '/timetable?tab=print', icon: Printer, subColor: 'text-slate-400' },
      ],
    },
    {
      id: 'exams',
      titleKm: 'ការប្រឡង & ពិន្ទុ',
      icon: Award,
      // 🎨 Amber (ស្រស់)
      iconColor: 'text-amber-400',
      activeColor: 'text-amber-300',
      glow: 'drop-shadow-[0_0_6px_rgba(251,191,36,0.55)]',
      tint: 'bg-amber-500/10',
      basePath: '/exams',
      subItems: [
        { label: 'គ្រប់គ្រងសម័យប្រឡង', to: '/exams?tab=exams', icon: FileText, subColor: 'text-indigo-400' },
        { label: 'កាលវិភាគប្រឡង', to: '/exams?tab=schedule', icon: Calendar, subColor: 'text-sky-400' },
        { label: 'បញ្ចូលពិន្ទុសិស្ស', to: '/grades', icon: Calculator, subColor: 'text-teal-400' },
        { label: 'គណនាពិន្ទុ & និទ្ទេស', to: '/exams?tab=calculation', icon: TrendingUp, subColor: 'text-emerald-400' },
        { label: 'ចំណាត់ថ្នាក់សិស្ស', to: '/exams?tab=ranking', icon: Trophy, subColor: 'text-amber-400' },
        { label: 'ព្រឹត្តិបត្រពិន្ទុ', to: '/exams?tab=report-cards', icon: Award, subColor: 'text-orange-400' },
      ],
    },
    {
      id: 'finance',
      titleKm: 'ហិរញ្ញវត្ថុ',
      icon: DollarSign,
      // 🎨 Green (ស្រស់)
      iconColor: 'text-green-400',
      activeColor: 'text-green-300',
      glow: 'drop-shadow-[0_0_6px_rgba(74,222,128,0.55)]',
      tint: 'bg-green-500/10',
      basePath: '/finance',
      subItems: [
        { label: 'កម្រៃសិក្សា', to: '/finance?tab=fees', icon: CreditCard, subColor: 'text-green-400' },
        { label: 'កំណត់ត្រាបង់ប្រាក់', to: '/finance?tab=payments', icon: Receipt, subColor: 'text-emerald-400' },
        { label: 'ចំណាយ', to: '/finance?tab=expenses', icon: TrendingDown, subColor: 'text-rose-400' },
        { label: 'ចំណូល', to: '/finance?tab=income', icon: TrendingUp, subColor: 'text-green-400' },
        { label: 'របាយការណ៍ហិរញ្ញវត្ថុ', to: '/finance?tab=reports', icon: FileText, subColor: 'text-teal-400' },
      ],
    },
    {
      id: 'library',
      titleKm: 'បណ្ណាល័យ',
      icon: BookOpen,
      // 🎨 Orange → Amber (ស្រស់)
      iconColor: 'text-orange-400',
      activeColor: 'text-orange-300',
      glow: 'drop-shadow-[0_0_6px_rgba(251,146,60,0.55)]',
      tint: 'bg-orange-500/10',
      basePath: '/library',
      subItems: [
        { label: 'បញ្ជីសៀវភៅ', to: '/library?tab=books', icon: BookOpen, subColor: 'text-amber-400' },
        { label: 'ខ្ចីសៀវភៅ', to: '/library?tab=borrow', icon: BookMarked, subColor: 'text-orange-400' },
        { label: 'សងសៀវភៅ', to: '/library?tab=return', icon: RotateCcw, subColor: 'text-teal-400' },
        { label: 'សៀវភៅហួសកំណត់', to: '/library?tab=overdue', icon: AlertCircle, subColor: 'text-rose-400' },
      ],
    },
    {
      id: 'communication',
      titleKm: 'ទំនាក់ទំនង & ដំណឹង',
      icon: Megaphone,
      // 🎨 Pink (ស្រស់)
      iconColor: 'text-pink-400',
      activeColor: 'text-pink-300',
      glow: 'drop-shadow-[0_0_6px_rgba(244,114,182,0.55)]',
      tint: 'bg-pink-500/10',
      basePath: '/communication',
      subItems: [
        { label: 'សេចក្តីប្រកាស', to: '/communication?tab=announcements', icon: Megaphone, subColor: 'text-pink-400' },
        { label: 'ការជូនដំណឹង', to: '/communication?tab=notifications', icon: Bell, subColor: 'text-rose-400' },
        { label: 'ព្រឹត្តិការណ៍សាលា', to: '/communication?tab=events', icon: Sparkles, subColor: 'text-fuchsia-400' },
        { label: 'ប្រតិទិនសកម្មភាព', to: '/communication?tab=calendar', icon: Calendar, subColor: 'text-violet-400' },
      ],
    },
    {
      id: 'reports',
      titleKm: 'របាយការណ៍ & វិភាគ',
      icon: BarChart3,
      // 🎨 Indigo (ស្រស់)
      iconColor: 'text-indigo-400',
      activeColor: 'text-indigo-300',
      glow: 'drop-shadow-[0_0_6px_rgba(129,140,248,0.55)]',
      tint: 'bg-indigo-500/10',
      basePath: '/reports',
      subItems: [
        { label: 'របាយការណ៍សិស្ស', to: '/reports?tab=students', icon: Users, subColor: 'text-cyan-400' },
        { label: 'របាយការណ៍គ្រូ', to: '/reports?tab=teachers', icon: GraduationCap, subColor: 'text-emerald-400' },
        { label: 'របាយការណ៍វត្តមាន', to: '/reports?tab=attendance', icon: CalendarCheck, subColor: 'text-orange-400' },
        { label: 'របាយការណ៍ប្រឡង', to: '/reports?tab=exams', icon: Award, subColor: 'text-amber-400' },
        { label: 'របាយការណ៍ហិរញ្ញវត្ថុ', to: '/reports?tab=finance', icon: DollarSign, subColor: 'text-green-400' },
        { label: 'នាំចេញ PDF / Excel', to: '/reports?tab=export', icon: Download, subColor: 'text-violet-400' },
      ],
    },
    {
      id: 'security',
      titleKm: 'អ្នកប្រើប្រាស់ & សុវត្ថិភាព',
      icon: ShieldCheck,
      // 🎨 Rose (ស្រស់)
      iconColor: 'text-rose-400',
      activeColor: 'text-rose-300',
      glow: 'drop-shadow-[0_0_6px_rgba(251,113,133,0.55)]',
      tint: 'bg-rose-500/10',
      basePath: '/security',
      subItems: [
        { label: 'អ្នកប្រើប្រាស់', to: '/security?tab=users', icon: Users, subColor: 'text-cyan-400' },
        { label: 'តួនាទី', to: '/security?tab=roles', icon: ShieldCheck, subColor: 'text-rose-400' },
        { label: 'សិទ្ធិអនុញ្ញាត', to: '/security?tab=permissions', icon: KeyRound, subColor: 'text-amber-400' },
        { label: 'ប្រវត្តិចូលប្រើ', to: '/security?tab=history', icon: History, subColor: 'text-slate-400' },
        { label: 'កំណត់ត្រាសកម្មភាព', to: '/security?tab=logs', icon: Clock, subColor: 'text-slate-400' },
      ],
    },
    {
      id: 'settings',
      titleKm: 'ការកំណត់ប្រព័ន្ធ',
      icon: Settings,
      // 🎨 Slate (ស្រស់ស្រាល)
      iconColor: 'text-slate-300',
      activeColor: 'text-slate-200',
      glow: 'drop-shadow-[0_0_6px_rgba(203,213,225,0.45)]',
      tint: 'bg-slate-500/10',
      basePath: '/settings',
      subItems: [
        { label: 'ព័ត៌មានវិទ្យាល័យ', to: '/settings?tab=info', icon: Building, subColor: 'text-slate-400' },
        { label: 'Logo & ស្លាកសញ្ញា', to: '/settings?tab=branding', icon: Image, subColor: 'text-violet-400' },
        { label: 'ភាសា ខ្មែរ / English', to: '/settings?tab=language', icon: Globe, subColor: 'text-cyan-400' },
        { label: 'ការកំណត់កម្រិត', to: '/settings?tab=academic', icon: BookOpen, subColor: 'text-amber-400' },
        { label: 'បម្រុងទុក Database', to: '/settings?tab=backup', icon: Database, subColor: 'text-indigo-400' },
        { label: 'គណនី Profile', to: '/settings?tab=profile', icon: User, subColor: 'text-teal-400' },
      ],
    },
  ];

  const [openSection, setOpenSection] = useState(() => {
    const found = menuItems.find(
      (m) =>
        location.pathname === m.basePath ||
        (m.basePath !== '/dashboard' && location.pathname.startsWith(m.basePath + '/')) ||
        m.subItems.some((s) => {
          if (s.to.includes('?')) {
            const [subPath, subQuery] = s.to.split('?');
            return location.pathname === subPath && location.search.replace(/^\?/, '') === subQuery;
          }
          return location.pathname === s.to;
        })
    );
    return found ? found.id : null;
  });

  useEffect(() => {
    const matched = menuItems.find(
      (m) =>
        location.pathname === m.basePath ||
        (m.basePath !== '/dashboard' && location.pathname.startsWith(m.basePath + '/')) ||
        m.subItems.some((s) => {
          if (s.to.includes('?')) {
            const [subPath, subQuery] = s.to.split('?');
            return location.pathname === subPath && location.search.replace(/^\?/, '') === subQuery;
          }
          return location.pathname === s.to;
        })
    );
    if (matched) setOpenSection(matched.id);
  }, [location.pathname, location.search]);

  const toggleSection = (id) =>
    setOpenSection((prev) => (prev === id ? null : id));

  return (
    <aside
      className={`w-[260px] min-w-[260px] h-screen bg-[#1e223c] border-r border-[#2d3357] flex flex-col shrink-0 select-none font-khmer fixed inset-y-0 left-0 z-50 lg:relative lg:translate-x-0 lg:z-auto ${
        isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      {/* Brand Header */}
      <div className="flex items-center justify-between px-3.5 py-3 border-b border-[#2d3357]">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-9 h-9 rounded-lg bg-[#252a4a] flex items-center justify-center shrink-0 overflow-hidden">
            <img
              src="/Logo.png"
              alt="School Logo"
              className="w-full h-full object-contain p-1"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                e.currentTarget.nextElementSibling.style.display = 'flex';
              }}
            />
            <div className="hidden w-full h-full items-center justify-center text-slate-400">
              <School className="w-4 h-4" strokeWidth={1.75} />
            </div>
          </div>
          <div className="min-w-0 flex flex-col">
            <span className="text-[13.5px] font-semibold text-slate-100 truncate leading-tight">
              វិទ្យាល័យ ហ៊ុន សែន ស្នួល
            </span>
            <span className="text-[11px] text-slate-400 truncate leading-tight mt-0.5">
              ប្រព័ន្ធគ្រប់គ្រងសាលា
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsMobileSidebarOpen(false)}
          className="lg:hidden p-1.5 rounded-md text-slate-400 hover:text-slate-100 hover:bg-[#252a4a] shrink-0"
          title="បិទ Menu"
        >
          <X className="w-4 h-4" strokeWidth={1.75} />
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-2 py-2.5 space-y-0.5 scrollbar-thin scrollbar-thumb-[#2d3357] scrollbar-track-transparent">
        {/* Dashboard */}
        <NavLink
          to="/dashboard"
          onClick={() => setIsMobileSidebarOpen(false)}
          className={({ isActive }) =>
            `group w-full flex items-center gap-2.5 px-2.5 py-2 rounded-md text-[13px] font-medium ${
              isActive
                ? 'bg-blue-600/25 text-blue-200 shadow-[0_0_0_1px_rgba(59,130,246,0.35)]'
                : 'text-slate-300 hover:bg-[#2a3050] hover:text-slate-100'
            }`
          }
        >
          {({ isActive }) => (
            <>
              <LayoutDashboard
                className={`w-[18px] h-[18px] shrink-0 ${
                  isActive
                    ? 'text-blue-300 drop-shadow-[0_0_8px_rgba(96,165,250,0.8)]'
                    : 'text-blue-400 group-hover:text-blue-300 drop-shadow-[0_0_4px_rgba(96,165,250,0.45)]'
                }`}
                strokeWidth={1.85}
              />
              <span className="truncate">ផ្ទាំងគ្រប់គ្រង</span>
            </>
          )}
        </NavLink>

        <div className="my-1.5 border-t border-[#2d3357]" />

        {menuItems.map((item) => {
          const Icon = item.icon;
          const isOpen = openSection === item.id;
          const isCategoryActive =
            location.pathname === item.basePath ||
            (item.basePath !== '/dashboard' && location.pathname.startsWith(item.basePath + '/')) ||
            item.subItems.some((s) => {
              if (s.to.includes('?')) {
                const [subPath, subQuery] = s.to.split('?');
                return (
                  location.pathname === subPath &&
                  location.search.replace(/^\?/, '') === subQuery
                );
              }
              return location.pathname === s.to;
            });

          return (
            <div key={item.id}>
              {/* Parent */}
              <button
                type="button"
                onClick={() => toggleSection(item.id)}
                className={`group w-full flex items-center justify-between gap-2 px-2.5 py-2 rounded-md text-[13px] font-medium transition-colors ${
                  isOpen
                    ? 'bg-[#2a3050] text-slate-100'
                    : isCategoryActive
                    ? 'bg-[#2a3050]/80 text-slate-100'
                    : 'text-slate-300 hover:bg-[#2a3050] hover:text-slate-100'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  {/* 🔥 Icon container with soft colored background */}
                  <span
                    className={`relative flex items-center justify-center w-6 h-6 rounded-md shrink-0 transition-all duration-200 ${
                      isOpen || isCategoryActive
                        ? `${item.tint} ring-1 ring-white/5`
                        : 'bg-transparent group-hover:' + item.tint.replace('bg-', 'bg-')
                    }`}
                  >
                    <Icon
                      className={`w-[18px] h-[18px] ${
                        isOpen || isCategoryActive
                          ? `${item.activeColor} ${item.glow}`
                          : `${item.iconColor} group-hover:${item.activeColor} group-hover:${item.glow}`
                      }`}
                      strokeWidth={1.9}
                    />
                  </span>
                  <span className="truncate">{item.titleKm}</span>
                </div>
                <ChevronDown
                  className={`w-3.5 h-3.5 shrink-0 transition-transform ${
                    isOpen
                      ? 'rotate-180 text-slate-300'
                      : 'text-slate-500 group-hover:text-slate-300'
                  }`}
                  strokeWidth={2}
                />
              </button>

              {/* Sub-items */}
              <div
                className={`grid ${
                  isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                } transition-all duration-200`}
              >
                <div className="overflow-hidden">
                  <div className="ml-4 pl-2 border-l border-[#2d3357] space-y-0.5 py-1 mt-0.5">
                    {item.subItems.map((sub, sIdx) => {
                      const SubIcon = sub.icon || Clock;
                      const isSubActive = (() => {
                        if (sub.to.includes('?')) {
                          const [subPath, subQuery] = sub.to.split('?');
                          return (
                            location.pathname === subPath &&
                            location.search.replace(/^\?/, '') === subQuery
                          );
                        }
                        return location.pathname === sub.to;
                      })();

                      return (
                        <NavLink
                          key={sIdx}
                          to={sub.to}
                          onClick={() => setIsMobileSidebarOpen(false)}
                          className={`group/sub flex items-center gap-2 px-2.5 py-1.5 rounded-md text-[12.5px] transition-colors ${
                            isSubActive
                              ? 'bg-blue-600/20 text-blue-300 font-medium'
                              : 'text-slate-400 hover:text-slate-100 hover:bg-[#2a3050]/80'
                          }`}
                        >
                          <SubIcon
                            className={`w-4 h-4 shrink-0 transition-all ${
                              isSubActive
                                ? 'text-blue-300 drop-shadow-[0_0_6px_rgba(96,165,250,0.7)]'
                                : `${sub.subColor} group-hover/sub:brightness-125 group-hover/sub:drop-shadow-[0_0_4px_currentColor]`
                            }`}
                            strokeWidth={1.9}
                          />
                          <span className="truncate">{sub.label}</span>
                        </NavLink>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-3 py-3 border-t border-[#2d3357]">
        <div className="text-[12px] text-center leading-relaxed">
          <div className="font-medium text-slate-400">v19.3.0</div>
          <div className="text-slate-500 mt-0.5">Developed by Mao Sokchea</div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;