import React, { useContext } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import { AuthContext } from '../context/AuthContext';
import { Users } from 'lucide-react';

const Layout = () => {
  const { user } = useContext(AuthContext);

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-200 flex flex-col">
      {/* Top Navbar */}
      <nav className="bg-slate-900 border-b border-slate-800 sticky top-0 z-20 h-16">
        <div className="w-full px-4 sm:px-6 lg:px-8 h-full flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-500/30">
              <Users size={24} />
            </div>
            <span className="font-bold text-xl text-white tracking-tight hidden sm:block">StaffSync Pro</span>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center border border-slate-700 shadow-inner">
              <span className="text-sm font-medium text-indigo-400">
                {user?.name?.charAt(0).toUpperCase() || 'U'}
              </span>
            </div>
            <span className="text-sm font-medium text-slate-300">{user?.name}</span>
          </div>
        </div>
      </nav>

      {/* Main Layout Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className="hidden md:block z-10">
          <Sidebar />
        </div>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-8 bg-[#0f172a]">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Mobile Bottom Navigation (Visible only on small screens) */}
      <div className="md:hidden border-t border-slate-800 bg-slate-900 sticky bottom-0 z-20">
        <div className="flex justify-around p-2">
          {/* Note: In a fully fleshed mobile app, you would duplicate the NavLinks here with icons only */}
          <span className="text-xs text-slate-500 p-2">Use desktop for full navigation features</span>
        </div>
      </div>
    </div>
  );
};

export default Layout;
