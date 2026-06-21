import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { getEmployees, createEmployee, updateEmployee, deleteEmployee } from '../services/employeeService';
import { Search, Plus, Edit2, Trash2, LogOut, Users, Building, Briefcase, DollarSign, X } from 'lucide-react';

const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const [employees, setEmployees] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentEmployee, setCurrentEmployee] = useState(null);
  
  // Form State
  const [formData, setFormData] = useState({
    employeeId: '', name: '', email: '', department: '', designation: '', salary: ''
  });

  const fetchEmployees = async (search = '') => {
    try {
      const data = await getEmployees(search);
      setEmployees(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchEmployees(searchQuery);
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const handleOpenModal = (employee = null) => {
    if (employee) {
      setCurrentEmployee(employee);
      setFormData(employee);
    } else {
      setCurrentEmployee(null);
      setFormData({ employeeId: '', name: '', email: '', department: '', designation: '', salary: '' });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => setIsModalOpen(false);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (currentEmployee) {
        await updateEmployee(currentEmployee._id, formData);
      } else {
        await createEmployee(formData);
      }
      handleCloseModal();
      fetchEmployees();
    } catch (error) {
      alert('Error saving employee: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      try {
        await deleteEmployee(id);
        fetchEmployees();
      } catch (error) {
        console.error(error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-200">
      {/* Navigation */}
      <nav className="bg-slate-900 border-b border-slate-800 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-500/30">
                <Users size={24} />
              </div>
              <span className="font-bold text-xl text-white tracking-tight">StaffSync Pro</span>
            </div>
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center border border-slate-700">
                  <span className="text-sm font-medium text-indigo-400">{user?.name?.charAt(0).toUpperCase()}</span>
                </div>
                <span className="text-sm font-medium text-slate-300 hidden sm:block">{user?.name}</span>
              </div>
              <button 
                onClick={logout}
                className="flex items-center text-slate-400 hover:text-white transition-colors group"
              >
                <LogOut size={18} className="mr-2 group-hover:text-red-400 transition-colors" />
                <span className="text-sm font-medium">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Actions */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white">Employee Directory</h1>
            <p className="text-sm text-slate-400 mt-1">Manage your team members and their information.</p>
          </div>
          
          <div className="flex w-full sm:w-auto gap-4">
            <div className="relative flex-grow sm:flex-grow-0">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-slate-500" />
              </div>
              <input
                type="text"
                className="block w-full sm:w-64 pl-10 pr-3 py-2.5 bg-slate-800/50 border border-slate-700 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                placeholder="Search employees..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button
              onClick={() => handleOpenModal()}
              className="inline-flex items-center justify-center px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium rounded-xl shadow-lg shadow-indigo-500/30 transition-all active:scale-95 whitespace-nowrap"
            >
              <Plus size={18} className="mr-2" />
              Add Employee
            </button>
          </div>
        </div>

        {/* Employee Grid */}
        {employees.length === 0 ? (
          <div className="text-center py-20 bg-slate-800/20 rounded-2xl border border-slate-800 border-dashed">
            <Users size={48} className="mx-auto text-slate-600 mb-4" />
            <h3 className="text-lg font-medium text-slate-300">No employees found</h3>
            <p className="text-slate-500 mt-1">Get started by adding a new employee to the system.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {employees.map((emp) => (
              <div key={emp._id} className="bg-slate-800 border border-slate-700 rounded-2xl p-6 hover:border-slate-600 transition-all hover:shadow-xl hover:shadow-black/50 group">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg shadow-inner">
                      {emp.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white group-hover:text-indigo-400 transition-colors">{emp.name}</h3>
                      <p className="text-sm text-slate-400 font-mono text-xs mt-0.5">{emp.employeeId}</p>
                    </div>
                  </div>
                  <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => handleOpenModal(emp)} className="p-2 text-slate-400 hover:text-indigo-400 hover:bg-indigo-400/10 rounded-lg transition-colors">
                      <Edit2 size={16} />
                    </button>
                    <button onClick={() => handleDelete(emp._id)} className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                
                <div className="space-y-3 mt-6">
                  <div className="flex items-center text-sm text-slate-300">
                    <Briefcase size={16} className="text-slate-500 mr-3" />
                    <span>{emp.designation}</span>
                  </div>
                  <div className="flex items-center text-sm text-slate-300">
                    <Building size={16} className="text-slate-500 mr-3" />
                    <span className="bg-slate-700/50 px-2.5 py-1 rounded-md border border-slate-600/50">{emp.department}</span>
                  </div>
                  <div className="flex items-center text-sm text-slate-300">
                    <DollarSign size={16} className="text-emerald-500 mr-3" />
                    <span className="font-medium text-emerald-400">${emp.salary.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center text-sm text-slate-400 pt-2 border-t border-slate-700/50 mt-2">
                    <span className="truncate">{emp.email}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-slate-800 border border-slate-700 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center p-6 border-b border-slate-700">
              <h2 className="text-xl font-semibold text-white">
                {currentEmployee ? 'Edit Employee' : 'Add New Employee'}
              </h2>
              <button onClick={handleCloseModal} className="text-slate-400 hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-xs font-medium text-slate-400 mb-1.5 uppercase tracking-wider">Employee ID</label>
                  <input required type="text" name="employeeId" value={formData.employeeId} onChange={handleInputChange} disabled={!!currentEmployee} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 outline-none" />
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-xs font-medium text-slate-400 mb-1.5 uppercase tracking-wider">Full Name</label>
                  <input required type="text" name="name" value={formData.name} onChange={handleInputChange} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-indigo-500 outline-none" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5 uppercase tracking-wider">Email Address</label>
                <input required type="email" name="email" value={formData.email} onChange={handleInputChange} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-indigo-500 outline-none" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-xs font-medium text-slate-400 mb-1.5 uppercase tracking-wider">Department</label>
                  <input required type="text" name="department" value={formData.department} onChange={handleInputChange} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-indigo-500 outline-none" />
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-xs font-medium text-slate-400 mb-1.5 uppercase tracking-wider">Designation</label>
                  <input required type="text" name="designation" value={formData.designation} onChange={handleInputChange} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-indigo-500 outline-none" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5 uppercase tracking-wider">Salary ($)</label>
                <input required type="number" name="salary" value={formData.salary} onChange={handleInputChange} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-indigo-500 outline-none" />
              </div>

              <div className="flex justify-end space-x-3 pt-6 border-t border-slate-700 mt-6">
                <button type="button" onClick={handleCloseModal} className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors">
                  {currentEmployee ? 'Save Changes' : 'Add Employee'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
