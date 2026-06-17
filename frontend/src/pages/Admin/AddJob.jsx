import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Import axios for API calls
import { useNavigate } from 'react-router-dom'; // To redirect after successful submission

const AddJob = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    company: '',
    role: '',
    location: '',
    ctc: '',
    offerType: '',
    dept: '',
    minCgpa: '',
    minGradYear: '',
    date: '',
    description: ''
  });
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/company`);
        setCompanies(response.data);
      } catch (err) {
        console.error('Error fetching companies:', err);
      }
    };
    fetchCompanies();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent default form submission
    setLoading(true);
    setError(null);
    setSuccess(false);

    const postJob = async () => {
      try {
        // Transform inputs to match backend expectations (e.g., array for departments)
        const payload = {
          ...formData,
          dept: formData.dept.split(',').map((item) => item.trim()),
          location: formData.location.split(',').map((item) => item.trim()),
          ctc: formData.ctc ? Number(formData.ctc) : undefined,
          minCgpa: Number(formData.minCgpa),
          minGradYear: Number(formData.minGradYear),
          date: new Date(formData.date).toISOString() // Send as ISO string for backend
        };

        const response = await axios.post(`${import.meta.env.VITE_API_URL}/jobs/add_job`, payload);
        console.log('Job created successfully:', response.data);
        setSuccess(true);
        alert("Job posted successfully!");
        // Optionally clear form or redirect
        setFormData({ // Clear form fields
          company: '', role: '', location: '', ctc: '', offerType: '',
          dept: '', minCgpa: '', minGradYear: '', date: '', description: ''
        });
        navigate('/admin'); // Redirect to admin dashboard after success
      } catch (err) {
        console.error('Error creating job:', err.response?.data || err.message);
        setError(err.response?.data?.message || 'Failed to create job. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    postJob();
  };

  return (
    <div className="max-w-4xl mx-auto my-12 p-8 bg-white shadow-xl rounded-2xl border border-gray-100">
      <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Post a New Job</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <label className="block text-sm font-medium text-gray-700">Select Company *</label>
            <select
              name="company"
              value={formData.company._id}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 outline-none cursor-pointer"
            >
              <option value="">-- Choose a Company --</option>
              {companies.map((comp) => (
                <option key={comp._id} value={comp._id}>
                  {comp.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Job Role *</label>
            <input type="text" name="role" value={formData.role} onChange={handleChange} required className="mt-1 block w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 outline-none" placeholder="e.g. Frontend Developer" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Location *</label>
            <input type="text" name="location" value={formData.location} onChange={handleChange} required className="mt-1 block w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 outline-none" placeholder="e.g. Remote" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">CTC (LPA)</label>
            <input type="number" name="ctc" value={formData.ctc} onChange={handleChange} className="mt-1 block w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 outline-none" placeholder="e.g. 15" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Offer Type *</label>
            <select name="offerType" value={formData.offerType} onChange={handleChange} required className="mt-1 block w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 outline-none">
              <option value="">Select Type</option>
              <option value="Full Time">Full Time</option>
              <option value="Internship">Internship</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Eligible Departments *</label>
            <input type="text" name="dept" value={formData.dept} onChange={handleChange} required className="mt-1 block w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 outline-none" placeholder="CS, IT, EC (Comma separated)" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Minimum CGPA *</label>
            <input type="number" step="0.01" name="minCgpa" value={formData.minCgpa} onChange={handleChange} required className="mt-1 block w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 outline-none" placeholder="e.g. 8.0" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Min Graduation Year *</label>
            <input type="number" name="minGradYear" value={formData.minGradYear} onChange={handleChange} required className="mt-1 block w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 outline-none" placeholder="e.g. 2025" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Application Deadline *</label>
            <input type="date" name="date" value={formData.date} onChange={handleChange} required className="mt-1 block w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 outline-none" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Description *</label>
          <textarea name="description" value={formData.description} onChange={handleChange} required rows="4" className="mt-1 block w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 outline-none" placeholder="Enter detailed job requirements..."></textarea>
        </div>
        <div className="text-center pt-4">
          {loading && <p className="text-center text-blue-600">Posting job...</p>}
          {error && <p className="text-center text-red-600">{error}</p>}
          {success && <p className="text-center text-green-600">Job posted successfully!</p>}
          <button type="submit" disabled={loading} className="px-10 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transform hover:scale-[1.02] active:scale-95 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed">
            {loading ? 'Posting...' : 'Create Job Post'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddJob;