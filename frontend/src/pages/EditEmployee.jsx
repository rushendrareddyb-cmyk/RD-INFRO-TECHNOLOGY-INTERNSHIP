import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import api from '../services/api';

const EditEmployee = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    employeeId: '',
    name: '',
    email: '',
    department: '',
    designation: '',
    salary: ''
  });

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const response = await api.get(`/employees/${id}`);
        setFormData(response.data);
      } catch (err) {
        setError('Failed to fetch employee details');
      } finally {
        setLoading(false);
      }
    };
    fetchEmployee();
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    
    try {
      await api.put(`/employees/${id}`, formData);
      navigate('/employees');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update employee');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center space-x-4">
        <Link to="/employees" className="p-2 bg-slate-900 border border-slate-800 text-slate-400 hover:text-white rounded-xl transition-colors shadow-lg">
          <ArrowLeft size={20} />
        </Link>
        <h1 className="text-3xl font-bold text-white tracking-tight">Edit Employee</h1>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl">
        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-4 rounded-xl mb-6 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">Employee ID</label>
              <input required type="text" name="employeeId" value={formData.employeeId} onChange={handleChange} className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all shadow-inner" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">Full Name</label>
              <input required type="text" name="name" value={formData.name} onChange={handleChange} className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all shadow-inner" />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <label className="text-sm font-medium text-slate-300">Email Address</label>
              <input required type="email" name="email" value={formData.email} onChange={handleChange} className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all shadow-inner" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">Department</label>
              <input required type="text" name="department" value={formData.department} onChange={handleChange} className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all shadow-inner" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">Designation</label>
              <input required type="text" name="designation" value={formData.designation} onChange={handleChange} className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all shadow-inner" />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <label className="text-sm font-medium text-slate-300">Salary</label>
              <input required type="number" name="salary" value={formData.salary} onChange={handleChange} className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all shadow-inner" />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl font-medium transition-all shadow-lg shadow-indigo-500/30 disabled:opacity-50"
            >
              <Save size={20} />
              <span>{saving ? 'Updating...' : 'Update Employee'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditEmployee;
