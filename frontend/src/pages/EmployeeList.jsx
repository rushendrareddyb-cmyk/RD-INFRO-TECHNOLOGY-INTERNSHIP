import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Plus, Edit2, Trash2, Mail, Briefcase } from 'lucide-react';
import api from '../services/api';

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await api.get('/employees');
      setEmployees(response.data);
    } catch (error) {
      console.error('Error fetching employees:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      try {
        await api.delete(`/employees/${id}`);
        fetchEmployees();
      } catch (error) {
        console.error('Error deleting employee:', error);
      }
    }
  };

  const filteredEmployees = employees.filter(emp => 
    emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.employeeId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-3xl font-bold text-white tracking-tight">Employee Directory</h1>
        
        <div className="flex items-center space-x-4 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-slate-500" />
            </div>
            <input
              type="text"
              placeholder="Search employees..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent placeholder-slate-500 transition-all shadow-inner"
            />
          </div>
          <Link
            to="/employees/add"
            className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl transition-colors shadow-lg shadow-indigo-500/30 whitespace-nowrap"
          >
            <Plus size={20} />
            <span className="hidden sm:inline">Add Employee</span>
          </Link>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
        </div>
      ) : filteredEmployees.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center shadow-xl">
          <Users size={48} className="mx-auto text-slate-600 mb-4" />
          <h3 className="text-xl font-medium text-slate-300">No employees found</h3>
          <p className="text-slate-500 mt-2">Try adjusting your search or add a new employee.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredEmployees.map((emp) => (
            <div key={emp._id} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl hover:border-slate-700 transition-colors group relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity flex space-x-2">
                <Link to={`/employees/edit/${emp._id}`} className="p-2 bg-slate-800 hover:bg-indigo-500/20 hover:text-indigo-400 text-slate-400 rounded-lg transition-colors">
                  <Edit2 size={16} />
                </Link>
                <button onClick={() => handleDelete(emp._id)} className="p-2 bg-slate-800 hover:bg-red-500/20 hover:text-red-400 text-slate-400 rounded-lg transition-colors">
                  <Trash2 size={16} />
                </button>
              </div>

              <div className="flex items-center space-x-4 mb-4">
                <div className="w-12 h-12 bg-indigo-500/10 text-indigo-400 rounded-xl flex items-center justify-center font-bold text-lg border border-indigo-500/20">
                  {emp.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white leading-tight">{emp.name}</h3>
                  <p className="text-sm text-indigo-400 font-medium">{emp.designation}</p>
                </div>
              </div>

              <div className="space-y-3 text-sm text-slate-400 mt-6">
                <div className="flex items-center space-x-3">
                  <Briefcase size={16} className="text-slate-500" />
                  <span>{emp.department} &bull; ID: {emp.employeeId}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail size={16} className="text-slate-500" />
                  <span className="truncate">{emp.email}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EmployeeList;
