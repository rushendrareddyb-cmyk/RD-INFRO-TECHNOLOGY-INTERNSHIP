import React, { useState, useEffect } from 'react';
import { Users, Building, Wallet, TrendingUp } from 'lucide-react';
import api from '../services/api';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalEmployees: 0,
    departments: 0,
    totalSalary: 0,
    avgSalary: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await api.get('/employees');
      const employees = response.data;
      
      const departments = new Set(employees.map(emp => emp.department)).size;
      const totalSalary = employees.reduce((sum, emp) => sum + Number(emp.salary), 0);
      const avgSalary = employees.length ? totalSalary / employees.length : 0;

      setStats({
        totalEmployees: employees.length,
        departments,
        totalSalary,
        avgSalary
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    { title: 'Total Employees', value: stats.totalEmployees, icon: <Users size={24} className="text-blue-400" />, bg: 'bg-blue-400/10' },
    { title: 'Departments', value: stats.departments, icon: <Building size={24} className="text-purple-400" />, bg: 'bg-purple-400/10' },
    { title: 'Total Payroll', value: `$${stats.totalSalary.toLocaleString()}`, icon: <Wallet size={24} className="text-green-400" />, bg: 'bg-green-400/10' },
    { title: 'Avg Salary', value: `$${Math.round(stats.avgSalary).toLocaleString()}`, icon: <TrendingUp size={24} className="text-amber-400" />, bg: 'bg-amber-400/10' },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white tracking-tight">Dashboard Overview</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <div key={index} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden group">
            <div className={`absolute -right-6 -top-6 w-24 h-24 rounded-full ${stat.bg} blur-2xl group-hover:scale-150 transition-transform duration-500`}></div>
            <div className="relative z-10 flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-slate-400 mb-1">{stat.title}</p>
                <h3 className="text-3xl font-bold text-white">{stat.value}</h3>
              </div>
              <div className={`p-3 rounded-xl ${stat.bg}`}>
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Decorative Chart Area */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl mt-8 h-96 flex flex-col items-center justify-center text-slate-500 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5"></div>
        <TrendingUp size={48} className="mb-4 opacity-20" />
        <p>Analytics Chart Placeholder</p>
        <p className="text-sm mt-2 text-center max-w-md">In a full production environment, this space would feature interactive Recharts or Chart.js visualizations for hiring trends and department distributions.</p>
      </div>
    </div>
  );
};

export default Dashboard;
