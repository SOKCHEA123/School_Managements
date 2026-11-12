import React, { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

export const translations = {
  KH: {
    brandSubtitle: 'Admin & Staff',
    schoolName: 'វិទ្យាល័យ ហ៊ុន សែន ស្នួល',
    adminPanel: 'Admin Panel',
    dashboard: 'ផ្ទាំងគ្រប់គ្រង',
    students: 'គ្រប់គ្រងសិស្ស',
    grades: 'គ្រប់គ្រងពិន្ទុ',
    academics: 'ព័ត៌មានសិក្សា',
    logout: 'ចាកចេញ',
    welcome: 'សូមស្វាគមន៍',
    totalStudents: 'សិស្សសរុប',
    teachers: 'គ្រូបង្រៀន',
    classrooms: 'ថ្នាក់រៀន',
    totalGrades: 'ទិន្នន័យពិន្ទុ',
    quickActions: 'ផ្លូវកាត់ និងសកម្មភាពរហ័ស',
    systemStatus: 'ស្ថានភាពប្រព័ន្ធ',
    systemDesc: 'ប្រព័ន្ធបានតភ្ជាប់ជាមួយ Laravel API (PostgreSQL) ដោយជោគជ័យ។ រាល់ការបញ្ចូលសិស្ស ការកត់ត្រាពិន្ទុ និងការចាក់សោពិន្ទុ ត្រូវបានការពារតាមរយៈ Laravel Sanctum & Policy Permissions។',
    batchGrades: 'បញ្ចូលពិន្ទុជាក្រុម',
    viewGrades: 'បញ្ជីពិន្ទុ',
    lockGrades: 'ចាក់សោពិន្ទុ',
    addStudent: 'បន្ថែមសិស្សថ្មី',
    search: 'ស្វែងរក',
    academicYear: 'ឆ្នាំសិក្សា',
    classroom: 'ថ្នាក់រៀន',
    subject: 'មុខវិជ្ជា',
    semester: 'ឆមាស',
    month: 'ខែ',
    score: 'ពិន្ទុ',
    status: 'ស្ថានភាព',
    actions: 'សកម្មភាព',
    save: 'រក្សាទុក',
    cancel: 'បោះបង់',
    locked: 'ចាក់សោ',
    editable: 'អាចកែប្រែបាន',
  },
  EN: {
    brandSubtitle: 'Admin & Staff',
    schoolName: 'Hun Sen Snoul High School',
    adminPanel: 'Admin Panel',
    dashboard: 'Dashboard',
    students: 'Students',
    grades: 'Grades',
    academics: 'Academics',
    logout: 'Logout',
    welcome: 'Welcome',
    totalStudents: 'Total Students',
    teachers: 'Teachers',
    classrooms: 'Classrooms',
    totalGrades: 'Total Grades',
    quickActions: 'Quick Actions',
    systemStatus: 'System Status',
    systemDesc: 'System successfully connected with Laravel API (PostgreSQL). Grade management, batch inputs, and security policies are fully enforced via Sanctum.',
    batchGrades: 'Batch Grades Input',
    viewGrades: 'View Grades',
    lockGrades: 'Lock Monthly Grades',
    addStudent: 'Add Student',
    search: 'Search',
    academicYear: 'Academic Year',
    classroom: 'Classroom',
    subject: 'Subject',
    semester: 'Semester',
    month: 'Month',
    score: 'Score',
    status: 'Status',
    actions: 'Actions',
    save: 'Save Changes',
    cancel: 'Cancel',
    locked: 'Locked',
    editable: 'Editable',
  },
};

export const AppProvider = ({ children }) => {
  // 1. Language State
  const [lang, setLang] = useState(() => {
    try {
      return localStorage.getItem('admin_lang') || 'KH';
    } catch {
      return 'KH';
    }
  });

  const toggleLang = () => {
    setLang((prev) => {
      const next = prev === 'KH' ? 'EN' : 'KH';
      try {
        localStorage.setItem('admin_lang', next);
      } catch {}
      return next;
    });
  };

  // 2. Dark Mode State
  const [isDarkMode, setIsDarkMode] = useState(() => {
    try {
      const saved = localStorage.getItem('admin_theme');
      if (saved) return saved === 'dark';
      return document.documentElement.classList.contains('dark');
    } catch {
      return false;
    }
  });

  useEffect(() => {
    const root = document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
      try {
        localStorage.setItem('admin_theme', 'dark');
      } catch {}
    } else {
      root.classList.remove('dark');
      try {
        localStorage.setItem('admin_theme', 'light');
      } catch {}
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => !prev);
  };

  // 3. Mobile Sidebar Drawer State
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const toggleMobileSidebar = () => setIsMobileSidebarOpen((prev) => !prev);

  const t = translations[lang] || translations.KH;

  return (
    <AppContext.Provider
      value={{
        lang,
        setLang,
        toggleLang,
        isDarkMode,
        toggleDarkMode,
        isMobileSidebarOpen,
        setIsMobileSidebarOpen,
        toggleMobileSidebar,
        t,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
