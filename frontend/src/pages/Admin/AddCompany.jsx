import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const inputClass =
  'rounded-lg border border-slate-700/70 bg-slate-950/60 p-3 text-white outline-none transition placeholder:text-slate-500 focus:border-teal-400 focus:ring-2 focus:ring-teal-500/30';
const labelClass = 'text-sm font-semibold text-slate-300';

const AddCompany = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
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
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess(false)
    try {
      // Validation
      if (!formData.name || formData.name.trim().length === 0) {
        setError('Company name is required')
        setLoading(false)
        return
      }
      if (!formData.description || formData.description.trim().length < 10) {
        setError('Description must be at least 10 characters')
        setLoading(false)
        return
      }
      if (formData.website && !formData.website.match(/^https?:\/\/.+/)) {
        setError('Please enter a valid website URL')
        setLoading(false)
        return
      }

      await axios.post(`${import.meta.env.VITE_API_URL}/company/add_company`, formData)
      setSuccess(true)
      setFormData({
        name: '',
        website: '',
        logo: '',
        industry: '',
        description: '',
      })
      setTimeout(() => navigate('/admin'), 900)
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.response?.data?.error || 'Failed to add company'
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-linear-to-br from-slate-900 via-slate-800 to-slate-900 px-5 py-8 text-white sm:px-8">
      <div className="absolute left-0 top-0 h-80 w-80 rounded-full bg-teal-500/10 blur-3xl" />
      <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-indigo-500/10 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-5xl">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-teal-400">
              Company Management
            </p>
            <h1 className="mt-2 text-3xl font-bold text-white sm:text-4xl">Register New Company</h1>
          </div>
          <button
            type="button"
            onClick={() => navigate('/admin')}
            className="rounded-lg border border-slate-700/70 bg-slate-900/60 px-4 py-2 text-sm font-semibold text-slate-200 transition hover:border-teal-400/70 hover:text-teal-300"
          >
            Back to Dashboard
          </button>
        </div>

        <section className="rounded-2xl border border-slate-700/50 bg-linear-to-br from-slate-800/70 to-slate-900/80 p-6 shadow-xl shadow-slate-950/40 backdrop-blur sm:p-8">
          {error && (
            <div className="mb-6 rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm font-medium text-red-200">
              {error}
            </div>
          )}
          {success && (
            <div className="mb-6 rounded-lg border border-emerald-500/40 bg-emerald-500/10 px-4 py-3 text-sm font-medium text-emerald-200">
              Company added successfully.
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="flex flex-col gap-2">
                <label className={labelClass}>Company Name *</label>
                <input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className={inputClass}
                  placeholder="e.g. Infosys"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className={labelClass}>Industry</label>
                <input
                  name="industry"
                  value={formData.industry}
                  onChange={handleChange}
                  className={inputClass}
                  placeholder="e.g. Technology"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className={labelClass}>Website URL</label>
                <input
                  name="website"
                  value={formData.website}
                  onChange={handleChange}
                  className={inputClass}
                  placeholder="https://company.com"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className={labelClass}>Logo URL</label>
                <input
                  name="logo"
                  value={formData.logo}
                  onChange={handleChange}
                  className={inputClass}
                  placeholder="https://company.com/logo.png"
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className={labelClass}>Description *</label>
              <textarea
                name="description"
                value={formData.description}
                rows="5"
                onChange={handleChange}
                required
                className={`${inputClass} resize-none`}
                placeholder="Add the company profile and placement details."
              />
            </div>

            <div className="flex flex-col-reverse gap-3 border-t border-slate-700/50 pt-6 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => navigate('/admin')}
                className="rounded-lg border border-slate-700/70 px-5 py-3 text-sm font-semibold text-slate-200 transition hover:border-slate-500 hover:bg-slate-800/70"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="rounded-lg bg-teal-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-teal-600/20 transition hover:bg-teal-500 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? 'Adding...' : 'Register Company'}
              </button>
            </div>
          </form>
        </section>
      </div>
    </main>
  );
};

export default AddCompany;
