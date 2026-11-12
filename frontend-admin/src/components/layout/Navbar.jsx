import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Menu, Moon, Sun, LogOut, User, KeyRound, ChevronDown, 
  Bell, HelpCircle, Settings, ShieldCheck 
} from 'lucide-react';
import API from '../../services/api';
import { useApp } from '../../context/AppContext';

const Navbar = () => {
  const navigate = useNavigate();
  const { lang, toggleLang, isDarkMode, toggleDarkMode, toggleMobileSidebar, t } = useApp();
  
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  let user = null;
  try {
    const savedUser = localStorage.getItem('user');
    if (savedUser) user = JSON.parse(savedUser);
  } catch {
    user = null;
  }

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await API.post('/auth/logout');
    } catch {
      // ignore
    } finally {
      localStorage.removeItem('access_token');
      localStorage.removeItem('user');
      navigate('/login');
    }
  };

  const displayName = user?.name || user?.username || 'Admin';
  const displayRole = user?.role || 'Administrator';

  return (
    <header className="h-16 bg-[#1a1e4a] border-b border-[#2a3163] flex items-center justify-between px-4 sm:px-6 sticky top-0 z-20">
      
      {/* Left: Mobile Sidebar Toggle */}
      <div className="flex items-center">
        <button
          type="button"
          onClick={toggleMobileSidebar}
          className="lg:hidden p-2 rounded-lg text-slate-400 hover:bg-white/10 hover:text-white transition-colors"
          title="បើក Menu"
        >
          <Menu className="w-5 h-5" strokeWidth={1.8} />
        </button>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-1 sm:gap-2">
        
        {/* Help */}
        <button
          type="button"
          onClick={() => navigate('/help')}
          title="ជំនួយ"
          className="hidden sm:flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 hover:bg-white/10 hover:text-white transition-colors"
        >
          <HelpCircle className="w-[18px] h-[18px]" strokeWidth={1.8} />
        </button>

        {/* Notifications */}
        <button
          type="button"
          onClick={() => navigate('/notifications')}
          title="ការជូនដំណឹង"
          className="relative h-9 w-9 flex items-center justify-center rounded-lg text-slate-400 hover:bg-white/10 hover:text-white transition-colors"
        >
          <Bell className="w-[18px] h-[18px]" strokeWidth={1.8} />
          <span className="absolute top-2.5 right-2.5 w-1.5 h-1.5 bg-rose-500 rounded-full ring-2 ring-[#1a1e4a]"></span>
        </button>

        {/* Language Switcher */}
        <button
          type="button"
          onClick={toggleLang}
          title={lang === 'KH' ? 'Switch to English' : 'ប្តូរទៅភាសាខ្មែរ'}
          className="h-9 px-2.5 rounded-lg flex items-center gap-2 text-slate-400 hover:bg-white/10 hover:text-white transition-colors"
        >
          <img
            src={lang === 'KH' ? 'https://flagcdn.com/w40/kh.png' : 'https://flagcdn.com/w40/us.png'}
            alt={lang === 'KH' ? 'Khmer' : 'English'}
            className="w-4 h-3 object-cover rounded-sm opacity-80"
          />
          <span className="text-xs font-medium hidden sm:block">
            {lang === 'KH' ? 'ខ្មែរ' : 'EN'}
          </span>
        </button>

        {/* Dark/Light Mode */}
        <button
          type="button"
          onClick={toggleDarkMode}
          title={isDarkMode ? 'Light Mode' : 'Dark Mode'}
          className="h-9 w-9 rounded-lg flex items-center justify-center text-slate-400 hover:bg-white/10 hover:text-white transition-colors"
        >
          {isDarkMode ? (
            <Sun className="w-[18px] h-[18px]" strokeWidth={1.8} />
          ) : (
            <Moon className="w-[18px] h-[18px]" strokeWidth={1.8} />
          )}
        </button>

        {/* Divider */}
        <div className="h-5 w-px bg-white/10 mx-1" />

        {/* User Profile Dropdown */}
        {user && (
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-2.5 p-1 pl-1.5 pr-1.5 rounded-lg hover:bg-white/5 transition-colors outline-none"
            >
              {/* កែមកជា Icon User វិញ */}
              <div className="w-8 h-8 rounded-full bg-slate-700/50 text-slate-300 flex items-center justify-center border border-slate-600/50">
                <User className="w-4 h-4" strokeWidth={1.8} />
              </div>
              
              <div className="hidden md:block text-left">
                <div className="text-xs font-semibold text-slate-200 leading-tight max-w-[100px] truncate">
                  {displayName}
                </div>
                <div className="text-[10px] text-slate-400 leading-tight max-w-[100px] truncate">
                  {displayRole}
                </div>
              </div>
              <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} strokeWidth={2} />
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-[#1e224d] border border-[#2a3163] rounded-lg shadow-xl py-1 z-50">
                
                {/* User Info Header */}
                <div className="px-3.5 py-2.5 border-b border-[#2a3163] mb-1">
                  <p className="text-sm font-medium text-white truncate">{displayName}</p>
                  <p className="text-[11px] text-slate-400 truncate">{user.email || displayRole}</p>
                </div>

                {/* ព័ត៌មានផ្ទាល់ខ្លួន */}
                <button
                  onClick={() => { setIsDropdownOpen(false); navigate('/profile'); }}
                  className="w-full flex items-center gap-2.5 px-3.5 py-2 text-sm text-slate-300 hover:bg-white/5 hover:text-white transition-colors"
                >
                  <User className="w-4 h-4 text-slate-400" strokeWidth={1.8} />
                  ព័ត៌មានផ្ទាល់ខ្លួន
                </button>

                {/* ផ្លាស់ប្តូរពាក្យសម្ងាត់ */}
                <button
                  onClick={() => { setIsDropdownOpen(false); navigate('/change-password'); }}
                  className="w-full flex items-center gap-2.5 px-3.5 py-2 text-sm text-slate-300 hover:bg-white/5 hover:text-white transition-colors"
                >
                  <KeyRound className="w-4 h-4 text-slate-400" strokeWidth={1.8} />
                  ផ្លាស់ប្តូរពាក្យសម្ងាត់
                </button>

                {/* សុវត្ថិភាពគណនី */}
                <button
                  onClick={() => { setIsDropdownOpen(false); navigate('/security'); }}
                  className="w-full flex items-center gap-2.5 px-3.5 py-2 text-sm text-slate-300 hover:bg-white/5 hover:text-white transition-colors"
                >
                  <ShieldCheck className="w-4 h-4 text-slate-400" strokeWidth={1.8} />
                  សុវត្ថិភាពគណនី
                </button>

                {/* ការកំណត់ប្រព័ន្ធ */}
                <button
                  onClick={() => { setIsDropdownOpen(false); navigate('/settings'); }}
                  className="w-full flex items-center gap-2.5 px-3.5 py-2 text-sm text-slate-300 hover:bg-white/5 hover:text-white transition-colors"
                >
                  <Settings className="w-4 h-4 text-slate-400" strokeWidth={1.8} />
                  ការកំណត់ប្រព័ន្ធ
                </button>

                <div className="h-px w-full bg-[#2a3163] my-1" />

                {/* ចាកចេញ */}
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2.5 px-3.5 py-2 text-sm text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 transition-colors"
                >
                  <LogOut className="w-4 h-4" strokeWidth={1.8} />
                  {t?.logout || 'ចាកចេញ'}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;