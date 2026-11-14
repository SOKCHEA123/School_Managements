import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Menu, Moon, Sun, LogOut, User, KeyRound, ChevronDown,
  Bell, HelpCircle, Settings, ShieldCheck, Search, X, Command,
} from 'lucide-react';
import API from '../../services/api';
import { useApp } from '../../context/AppContext';

const Navbar = () => {
  const navigate = useNavigate();
  const { lang, toggleLang, isDarkMode, toggleDarkMode, toggleMobileSidebar, t } = useApp();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const dropdownRef = useRef(null);
  const searchRef = useRef(null); // បន្ថែម Ref សម្រាប់ Search ដើម្បីចុចខាងក្រៅឱ្យបិទ
  const searchInputRef = useRef(null);

  let user = null;
  try {
    const savedUser = localStorage.getItem('user');
    if (savedUser) user = JSON.parse(savedUser);
  } catch {
    user = null;
  }

  /* ចុចខាងក្រៅឱ្យបិទ Dropdown និង Search */
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  /* ចុច ⌘K / Ctrl+K បើក Search, Esc បិទ */
  useEffect(() => {
    const handleKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
        setTimeout(() => searchInputRef.current?.focus(), 50);
      }
      if (e.key === 'Escape') setIsSearchOpen(false);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  const handleLogout = async () => {
    try {
      await API.post('/auth/logout');
    } catch {
      /* ignore */
    } finally {
      localStorage.removeItem('access_token');
      localStorage.removeItem('user');
      navigate('/login');
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
      setSearchQuery('');
    }
  };

  const displayName = user?.name || user?.username || 'Admin';
  const displayRole = user?.role || 'Administrator';
  const initials = displayName
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <header className="h-16 bg-[#1a1e4a] border-b border-[#2a3163] flex items-center justify-between px-3 sm:px-5 sticky top-0 z-50">
      
      {/* ═══════════ LEFT: Menu + Search ═══════════ */}
      <div className="flex items-center gap-2 flex-1 min-w-0">
        
        {/* Mobile Sidebar Toggle */}
        <button
          type="button"
          onClick={toggleMobileSidebar}
          className="lg:hidden p-2 rounded-lg text-slate-400 hover:bg-white/10 hover:text-white transition-colors shrink-0"
          title="បើក Menu"
        >
          <Menu className="w-5 h-5" strokeWidth={1.8} />
        </button>

        {/* 🔍 Search Container (Desktop) */}
        <div className="relative hidden md:block" ref={searchRef}>
          {/* Trigger Button */}
          <button
            type="button"
            onClick={() => { setIsSearchOpen(true); setTimeout(() => searchInputRef.current?.focus(), 50); }}
            className={`flex items-center gap-2 h-9 w-72 lg:w-80 px-3 rounded-lg border text-slate-400 transition-all ${
              isSearchOpen 
                ? 'bg-[#252a55] border-cyan-500/50 text-slate-200 shadow-[0_0_0_3px_rgba(34,211,238,0.1)]' 
                : 'bg-[#252a55] border-[#2f376b] hover:border-cyan-400/50 hover:text-slate-200'
            }`}
          >
            <Search className="w-4 h-4 text-cyan-400 shrink-0" strokeWidth={2} />
            <span className="text-xs flex-1 text-left truncate">ស្វែងរកសិស្ស, គ្រូ, ឯកសារ...</span>
            <kbd className="hidden lg:flex items-center gap-0.5 px-1.5 py-0.5 rounded border border-[#3a4277] bg-[#1e2348] text-[10px] text-slate-400 font-mono">
              <Command className="w-2.5 h-2.5" /> K
            </kbd>
          </button>

          {/* 🔍 Search Dropdown (ធ្លាក់ចុះក្រោមជាប់នឹង Search Bar) */}
          {isSearchOpen && (
            <div className="absolute top-full left-0 mt-2 w-[380px] bg-[#1e224d] border border-[#2f376b] rounded-xl shadow-2xl shadow-black/50 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
              <form onSubmit={handleSearchSubmit} className="flex items-center gap-3 px-4 py-3 border-b border-[#2a3163]">
                <Search className="w-5 h-5 text-cyan-400 shrink-0" strokeWidth={2} />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="ស្វែងរកសិស្ស, គ្រូ, ថ្នាក់រៀន..."
                  className="flex-1 bg-transparent text-sm text-slate-100 placeholder-slate-500 outline-none"
                />
                <button
                  type="button"
                  onClick={() => setIsSearchOpen(false)}
                  className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                >
                  <X className="w-4 h-4" strokeWidth={2} />
                </button>
              </form>

              {/* Quick Links */}
              <div className="px-4 py-3">
                <p className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold mb-2">
                  ស្វែងរករហ័ស
                </p>
                <div className="grid grid-cols-2 gap-1.5">
                  {[
                    { label: 'សិស្ស', color: 'text-cyan-400', to: '/students' },
                    { label: 'គ្រូបង្រៀន', color: 'text-emerald-400', to: '/teachers' },
                    { label: 'កាលវិភាគ', color: 'text-sky-400', to: '/timetable' },
                    { label: 'ពិន្ទុប្រឡង', color: 'text-amber-400', to: '/exams' },
                  ].map((item) => (
                    <button
                      key={item.label}
                      onClick={() => { navigate(item.to); setIsSearchOpen(false); }}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-sm text-slate-300 transition-colors text-left"
                    >
                      <Search className={`w-3.5 h-3.5 ${item.color}`} strokeWidth={2} />
                      {item.label}
                    </button>
                  ))}
                </div>
                <div className="mt-3 pt-3 border-t border-[#2a3163] flex items-center justify-between text-[11px] text-slate-500">
                  <span className="flex items-center gap-1">
                    <kbd className="px-1.5 py-0.5 rounded border border-[#3a4277] bg-[#1e2348] font-mono text-[10px]">Esc</kbd> បិទ
                  </span>
                  <span className="flex items-center gap-1">
                    <kbd className="px-1.5 py-0.5 rounded border border-[#3a4277] bg-[#1e2348] font-mono text-[10px]">Enter</kbd> ស្វែងរក
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 🔍 Search Icon (Mobile) */}
        <button
          type="button"
          onClick={() => { setIsSearchOpen(true); setTimeout(() => searchInputRef.current?.focus(), 50); }}
          className="md:hidden p-2 rounded-lg text-cyan-400 hover:bg-cyan-500/10 transition-colors shrink-0"
          title="ស្វែងរក"
        >
          <Search className="w-5 h-5" strokeWidth={2} />
        </button>
      </div>

      {/* ═══════════ RIGHT: Controls (Help, Bell, Lang, DarkMode, User) ═══════════ */}
      {/* ... (ដដែលដូចកូដមុន គ្រាន់តែខ្លីៗ) ... */}
      <div className="flex items-center gap-0.5 sm:gap-1">
        {/* Help */}
        <button onClick={() => navigate('/help')} title="ជំនួយ" className="group hidden sm:flex h-9 w-9 items-center justify-center rounded-lg text-cyan-400/80 hover:text-cyan-300 hover:bg-cyan-500/10 transition-all">
          <HelpCircle className="w-[18px] h-[18px] group-hover:drop-shadow-[0_0_6px_rgba(34,211,238,0.8)] transition-all" strokeWidth={1.9} />
        </button>

        {/* Notifications */}
        <button onClick={() => navigate('/notifications')} title="ការជូនដំណឹង" className="group relative h-9 w-9 flex items-center justify-center rounded-lg text-amber-400/80 hover:text-amber-300 hover:bg-amber-500/10 transition-all">
          <Bell className="w-[18px] h-[18px] group-hover:drop-shadow-[0_0_6px_rgba(251,191,36,0.8)] transition-all" strokeWidth={1.9} />
          <span className="absolute top-1.5 right-1.5 flex items-center justify-center min-w-[14px] h-[14px] px-1 rounded-full bg-gradient-to-br from-rose-500 to-pink-500 text-[9px] font-bold text-white ring-2 ring-[#1a1e4a] shadow-[0_0_8px_rgba(244,63,94,0.6)]">3</span>
        </button>

        {/* Language */}
        <button onClick={toggleLang} title={lang === 'KH' ? 'Switch to English' : 'ប្តូរទៅភាសាខ្មែរ'} className="h-9 px-2 rounded-lg flex items-center gap-1.5 text-emerald-400/80 hover:text-emerald-300 hover:bg-emerald-500/10 transition-all">
          <img src={lang === 'KH' ? 'https://flagcdn.com/w40/kh.png' : 'https://flagcdn.com/w40/us.png'} alt="Flag" className="w-4 h-3 object-cover rounded-sm" />
          <span className="text-xs font-medium hidden sm:block">{lang === 'KH' ? 'ខ្មែរ' : 'EN'}</span>
        </button>

        {/* Dark/Light Mode */}
        <button onClick={toggleDarkMode} title={isDarkMode ? 'Light Mode' : 'Dark Mode'} className="group h-9 w-9 rounded-lg flex items-center justify-center text-violet-400/80 hover:text-violet-300 hover:bg-violet-500/10 transition-all">
          {isDarkMode ? <Sun className="w-[18px] h-[18px] group-hover:drop-shadow-[0_0_6px_rgba(167,139,250,0.8)] transition-all" strokeWidth={1.9} /> : <Moon className="w-[18px] h-[18px] group-hover:drop-shadow-[0_0_6px_rgba(167,139,250,0.8)] transition-all" strokeWidth={1.9} />}
        </button>

        <div className="h-6 w-px bg-gradient-to-b from-transparent via-[#3a4277] to-transparent mx-1.5" />

        {/* User Profile Dropdown */}
        {user && (
          <div className="relative" ref={dropdownRef}>
            <button onClick={() => setIsDropdownOpen(!isDropdownOpen)} className={`flex items-center gap-2 p-1 pl-1 pr-1.5 sm:pr-2 rounded-lg transition-all outline-none ${isDropdownOpen ? 'bg-white/10' : 'hover:bg-white/5'}`}>
              <div className="relative shrink-0">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 via-blue-500 to-violet-500 text-white flex items-center justify-center text-[11px] font-bold shadow-[0_0_10px_rgba(96,165,250,0.45)]">
                  {initials || <User className="w-4 h-4" strokeWidth={2} />}
                </div>
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-[#1a1e4a] shadow-[0_0_6px_rgba(52,211,153,0.9)]" />
              </div>
              <div className="hidden md:block text-left min-w-0">
                <div className="text-xs font-semibold text-slate-100 leading-tight max-w-[110px] truncate">{displayName}</div>
                <div className="text-[10px] text-cyan-400/80 leading-tight max-w-[110px] truncate font-medium">{displayRole}</div>
              </div>
              <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180 text-cyan-400' : ''}`} strokeWidth={2} />
            </button>

            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-60 bg-[#1e224d] border border-[#2a3163] rounded-xl shadow-2xl shadow-black/40 py-1.5 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="px-3.5 py-3 border-b border-[#2a3163] mb-1.5 bg-gradient-to-r from-cyan-500/5 to-violet-500/5">
                  <p className="text-sm font-semibold text-white truncate">{displayName}</p>
                  <p className="text-[11px] text-slate-400 truncate mt-0.5">{user.email || displayRole}</p>
                </div>
                {/* Menu Items... (ដាក់ដដែល) */}
                <button onClick={() => { setIsDropdownOpen(false); navigate('/profile'); }} className="w-full flex items-center gap-2.5 px-3.5 py-2 text-sm text-slate-300 hover:bg-white/5 hover:text-white"><User className="w-4 h-4 text-cyan-400" /> ព័ត៌មានផ្ទាល់ខ្លួន</button>
                <button onClick={() => { setIsDropdownOpen(false); navigate('/change-password'); }} className="w-full flex items-center gap-2.5 px-3.5 py-2 text-sm text-slate-300 hover:bg-white/5 hover:text-white"><KeyRound className="w-4 h-4 text-amber-400" /> ផ្លាស់ប្តូរពាក្យសម្ងាត់</button>
                <button onClick={() => { setIsDropdownOpen(false); navigate('/security'); }} className="w-full flex items-center gap-2.5 px-3.5 py-2 text-sm text-slate-300 hover:bg-white/5 hover:text-white"><ShieldCheck className="w-4 h-4 text-emerald-400" /> សុវត្ថិភាពគណនី</button>
                <button onClick={() => { setIsDropdownOpen(false); navigate('/settings'); }} className="w-full flex items-center gap-2.5 px-3.5 py-2 text-sm text-slate-300 hover:bg-white/5 hover:text-white"><Settings className="w-4 h-4 text-violet-400" /> ការកំណត់ប្រព័ន្ធ</button>
                <div className="h-px w-full bg-[#2a3163] my-1.5" />
                <button onClick={handleLogout} className="w-full flex items-center gap-2.5 px-3.5 py-2 text-sm text-rose-400 hover:bg-rose-500/10 hover:text-rose-300"><LogOut className="w-4 h-4" /> {t?.logout || 'ចាកចេញ'}</button>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;