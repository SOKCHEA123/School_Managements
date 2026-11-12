import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import { useApp } from '../../context/AppContext';

const AdminLayout = () => {
  const { isMobileSidebarOpen, setIsMobileSidebarOpen } = useApp();

  return (
    <div className="h-screen w-screen overflow-hidden flex bg-slate-50 dark:bg-[#0f172a] text-slate-900 dark:text-slate-100 font-khmer transition-colors duration-200">
      {/* Mobile Drawer Backdrop */}
      {isMobileSidebarOpen && (
        <div
          onClick={() => setIsMobileSidebarOpen(false)}
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-40 lg:hidden transition-opacity duration-300 cursor-pointer"
        />
      )}

      {/* Sidebar: Fixed stationary on left, no scroll-along */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden min-w-0">
        <Navbar />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 bg-slate-50 dark:bg-[#0f172a] transition-colors duration-200">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
