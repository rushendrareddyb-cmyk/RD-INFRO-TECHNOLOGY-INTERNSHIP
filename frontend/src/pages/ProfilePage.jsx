import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { UserCircle, Mail, ShieldCheck, Key } from 'lucide-react';

const ProfilePage = () => {
  const { user } = useContext(AuthContext);

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold text-white tracking-tight">My Profile</h1>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="h-32 bg-gradient-to-r from-indigo-600 to-purple-600 relative">
          <div className="absolute -bottom-12 left-8 w-24 h-24 bg-slate-800 rounded-2xl border-4 border-slate-900 flex items-center justify-center text-4xl font-bold text-indigo-400 shadow-xl">
            {user?.name?.charAt(0).toUpperCase() || 'U'}
          </div>
        </div>
        
        <div className="pt-16 pb-8 px-8">
          <div className="flex justify-between items-start mb-8">
            <div>
              <h2 className="text-2xl font-bold text-white">{user?.name}</h2>
              <div className="flex items-center text-indigo-400 mt-1 space-x-2 font-medium">
                <ShieldCheck size={16} />
                <span>System Administrator</span>
              </div>
            </div>
            <span className="px-3 py-1 bg-green-500/10 text-green-400 text-xs font-semibold rounded-full border border-green-500/20">
              Active Account
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-5 flex items-start space-x-4">
              <div className="p-3 bg-slate-800 rounded-lg text-slate-400">
                <UserCircle size={24} />
              </div>
              <div>
                <p className="text-sm text-slate-400 font-medium">Full Name</p>
                <p className="text-white font-medium mt-1">{user?.name}</p>
              </div>
            </div>
            
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-5 flex items-start space-x-4">
              <div className="p-3 bg-slate-800 rounded-lg text-slate-400">
                <Mail size={24} />
              </div>
              <div>
                <p className="text-sm text-slate-400 font-medium">Email Address</p>
                <p className="text-white font-medium mt-1">{user?.email}</p>
              </div>
            </div>

            <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-5 flex items-start space-x-4 sm:col-span-2">
              <div className="p-3 bg-slate-800 rounded-lg text-slate-400">
                <Key size={24} />
              </div>
              <div>
                <p className="text-sm text-slate-400 font-medium">Account Security</p>
                <p className="text-white font-medium mt-1">Secured with Bcrypt Encryption & JSON Web Tokens</p>
                <button className="mt-4 text-sm font-medium text-indigo-400 hover:text-indigo-300 transition-colors">
                  Change Password (Coming Soon)
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
