import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, UserPlus, UserCircle, LogOut } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

const Sidebar = () => {
  const { logout, user } = useContext(AuthContext);

  const navLinks = [
    { path: '/', icon: <LayoutDashboard size={20} />, label: 'Dashboard Overview' },
    { path: '/employees', icon: <Users size={20} />, label: 'Employee List' },
    { path: '/employees/add', icon: <UserPlus size={20} />, label: 'Add Employee' },
    { path: '/profile', icon: <UserCircle size={20} />, label: 'My Profile' },
  ];

  return (
    <div className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col h-[calc(100vh-4rem)] sticky top-16">
      <div className="p-4 flex-1">
        <div className="space-y-1 mt-4">
          {navLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) =>
                `flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`
              }
            >
              {link.icon}
              <span className="font-medium text-sm">{link.label}</span>
            </NavLink>
          ))}
        </div>
      </div>
      
      <div className="p-4 border-t border-slate-800">
        <button
          onClick={logout}
          className="flex items-center space-x-3 px-4 py-3 w-full rounded-xl text-slate-400 hover:text-red-400 hover:bg-red-400/10 transition-all group"
        >
          <LogOut size={20} className="group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium text-sm">Sign Out</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
