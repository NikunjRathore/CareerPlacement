import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AddCompany = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    website: '',
    logo: '',
    industry: '',
    description: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      console.log('Sending formData:', formData);
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/company/add_company`, formData);
      console.log('Response:', response.data);
      alert('Company added successfully!');
      navigate('/admin');
    } catch (err) {
      console.error('Error details:', err.response?.data);
      const errorMessage = err.response?.data?.message || err.response?.data?.error || 'Failed to add company';
      alert(`Error: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-8 bg-slate-800/50 border border-slate-700 rounded-2xl shadow-xl backdrop-blur-sm">
      <h2 className="text-3xl font-bold text-white mb-8">Register New Company</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-slate-400">Company Name *</label>
            <input name="name" onChange={handleChange} required className="bg-slate-900 border border-slate-700 rounded-lg p-3 text-white outline-none focus:ring-2 focus:ring-teal-500" />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-slate-400">Industry</label>
            <input name="industry" onChange={handleChange} className="bg-slate-900 border border-slate-700 rounded-lg p-3 text-white outline-none focus:ring-2 focus:ring-teal-500" placeholder="e.g. Technology" />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-slate-400">Website URL</label>
            <input name="website" onChange={handleChange} className="bg-slate-900 border border-slate-700 rounded-lg p-3 text-white outline-none focus:ring-2 focus:ring-teal-500" placeholder="https://..." />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-slate-400">Logo URL</label>
            <input name="logo" onChange={handleChange} className="bg-slate-900 border border-slate-700 rounded-lg p-3 text-white outline-none focus:ring-2 focus:ring-teal-500" placeholder="Image URL" />
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-slate-400">Description *</label>
          <textarea name="description" rows="4" onChange={handleChange} required className="bg-slate-900 border border-slate-700 rounded-lg p-3 text-white outline-none focus:ring-2 focus:ring-teal-500 resize-none" />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-teal-600 hover:bg-teal-500 text-white font-bold py-3 rounded-xl transition duration-200 shadow-lg active:scale-95 disabled:opacity-50"
        >
          {loading ? 'Adding...' : 'Register Company'}
        </button>
      </form>
    </div>
  );
};

export default AddCompany;