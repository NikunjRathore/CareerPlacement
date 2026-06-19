import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AddNotification = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    type: 'info',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      // Validation
      if (!formData.title || formData.title.trim().length === 0) {
        alert('Title is required')
        setLoading(false)
        return
      }
      if (!formData.message || formData.message.trim().length < 5) {
        alert('Message must be at least 5 characters')
        setLoading(false)
        return
      }

      const token = localStorage.getItem('token')
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/notifications/add_notification`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      )
      alert('Notification broadcasted successfully!')
      setFormData({ title: '', message: '', type: 'info' })
      navigate('/admin')
    } catch (err) {
      const serverMsg = err?.response?.data?.message || err?.response?.data || err.message
      alert('Failed to send notification. ' + (serverMsg || 'Please try again.'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-8 bg-slate-800/50 border border-slate-700 rounded-2xl shadow-xl backdrop-blur-sm">
      <h2 className="text-3xl font-bold text-white mb-8">Send New Notification</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-slate-400">Notification Title *</label>
          <input name="title" value={formData.title} onChange={handleChange} required className="bg-slate-900 border border-slate-700 rounded-lg p-3 text-white outline-none focus:ring-2 focus:ring-teal-500" placeholder="e.g. Placement Drive Update" />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-slate-400">Category</label>
          <select name="type" value={formData.type} onChange={handleChange} className="bg-slate-900 border border-slate-700 rounded-lg p-3 text-white outline-none focus:ring-2 focus:ring-teal-500">
            <option value="info">General Info</option>
            <option value="warning">Important Warning</option>
            <option value="urgent">Urgent Announcement</option>
          </select>
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-slate-400">Content *</label>
          <textarea name="message" value={formData.message} rows="4" onChange={handleChange} required className="bg-slate-900 border border-slate-700 rounded-lg p-3 text-white outline-none focus:ring-2 focus:ring-teal-500 resize-none" placeholder="Enter the message for students..." />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-teal-600 hover:bg-teal-500 text-white font-bold py-3 rounded-xl transition duration-200 shadow-lg active:scale-95 disabled:opacity-50"
        >
          {loading ? 'Sending...' : 'Broadcast Notification'}
        </button>
      </form>
    </div>
  );
};

export default AddNotification;