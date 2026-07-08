import React, { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const AddJob = () => {
  const navigate = useNavigate()
  const { token } = useAuth()
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
  })
  const [rounds, setRounds] = useState([])
  const [selectedRound, setSelectedRound] = useState('')
  const roundOptions = [
    'Online Test',
    'Technical Interview',
    'HR Interview',
    'Coding Round',
    'System Design',
    'Managerial Round',
    'Final Discussion'
  ]
  const [companies, setCompanies] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/company`)
        setCompanies(response.data)
      } catch (err) {
        console.error('Error fetching companies:', err)
      }
    }
    fetchCompanies()
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleAddRound = () => {
    if (!selectedRound) return
    if (rounds.includes(selectedRound)) {
      setError('This round is already selected')
      return
    }
    setRounds((prev) => [...prev, selectedRound])
    setSelectedRound('')
    setError(null)
  }

  const handleRemoveRound = () => {
    setRounds((prev) => prev.slice(0, -1))
    setError(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(false)

    try {
      // Validation
      if (!formData.company) {
        setError('Please select a company')
        setLoading(false)
        return
      }
      if (!formData.role || formData.role.trim().length === 0) {
        setError('Job role is required')
        setLoading(false)
        return
      }
      if (!formData.date) {
        setError('Application deadline is required')
        setLoading(false)
        return
      }
      if (new Date(formData.date) < new Date()) {
        setError('Deadline cannot be in the past')
        setLoading(false)
        return
      }
      if (Number(formData.minCgpa) < 0 || Number(formData.minCgpa) > 10) {
        setError('CGPA must be between 0 and 10')
        setLoading(false)
        return
      }
      if (!formData.description || formData.description.trim().length < 10) {
        setError('Description must be at least 10 characters')
        setLoading(false)
        return
      }

      const payload = {
        ...formData,
        dept: formData.dept.split(',').map((item) => item.trim()).filter(Boolean),
        location: formData.location.split(',').map((item) => item.trim()).filter(Boolean),
        ctc: formData.ctc ? Number(formData.ctc) : undefined,
        minCgpa: Number(formData.minCgpa),
        minGradYear: Number(formData.minGradYear),
        date: new Date(formData.date).toISOString(),
        rounds
      }

      await axios.post(`${import.meta.env.VITE_API_URL}/jobs/add_job`, payload, {
        headers: { Authorization: `Bearer ${token}` }
      })
      
      setSuccess(true)
      setFormData({ company: '', role: '', location: '', ctc: '', offerType: '', dept: '', minCgpa: '', minGradYear: '', date: '', description: '' })
      setRounds([])
      setSelectedRound('')
      setTimeout(() => navigate('/admin'), 2000)
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to create job')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Post New Job</h1>
          <p className="text-slate-400">Create and post a new job opportunity for students</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-slate-800/50 border border-slate-700 rounded-2xl p-8 shadow-xl backdrop-blur-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-slate-400">Select Company *</label>
              <select
                name="company"
                value={formData.company}
                onChange={handleChange}
                required
                className="bg-slate-900 border border-slate-700 rounded-lg p-3 text-white outline-none focus:ring-2 focus:ring-teal-500 cursor-pointer"
              >
                <option value="">-- Choose a Company --</option>
                {companies.map((comp) => (
                  <option key={comp._id} value={comp._id}>
                    {comp.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-slate-400">Job Role *</label>
              <input type="text" name="role" value={formData.role} onChange={handleChange} required className="bg-slate-900 border border-slate-700 rounded-lg p-3 text-white outline-none focus:ring-2 focus:ring-teal-500" placeholder="e.g. Frontend Developer" />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-slate-400">Location *</label>
              <input type="text" name="location" value={formData.location} onChange={handleChange} required className="bg-slate-900 border border-slate-700 rounded-lg p-3 text-white outline-none focus:ring-2 focus:ring-teal-500" placeholder="e.g. Remote" />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-slate-400">CTC (LPA)</label>
              <input type="number" step="0.01" name="ctc" value={formData.ctc} onChange={handleChange} className="bg-slate-900 border border-slate-700 rounded-lg p-3 text-white outline-none focus:ring-2 focus:ring-teal-500" placeholder="e.g. 15" />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-slate-400">Offer Type *</label>
              <select name="offerType" value={formData.offerType} onChange={handleChange} required className="bg-slate-900 border border-slate-700 rounded-lg p-3 text-white outline-none focus:ring-2 focus:ring-teal-500 cursor-pointer">
                <option value="">Select Type</option>
                <option value="Full Time">Full Time</option>
                <option value="Internship">Internship</option>
              </select>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-slate-400">Departments *</label>
              <input type="text" name="dept" value={formData.dept} onChange={handleChange} required className="bg-slate-900 border border-slate-700 rounded-lg p-3 text-white outline-none focus:ring-2 focus:ring-teal-500" placeholder="CS, IT, EC" />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-slate-400">Min CGPA *</label>
              <input type="number" step="0.01" name="minCgpa" value={formData.minCgpa} onChange={handleChange} required className="bg-slate-900 border border-slate-700 rounded-lg p-3 text-white outline-none focus:ring-2 focus:ring-teal-500" placeholder="e.g. 8.0" />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-slate-400">Min Grad Year *</label>
              <input type="number" name="minGradYear" value={formData.minGradYear} onChange={handleChange} required className="bg-slate-900 border border-slate-700 rounded-lg p-3 text-white outline-none focus:ring-2 focus:ring-teal-500" placeholder="2025" />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-slate-400">Deadline *</label>
              <input type="date" name="date" value={formData.date} onChange={handleChange} required className="bg-slate-900 border border-slate-700 rounded-lg p-3 text-white outline-none focus:ring-2 focus:ring-teal-500" />
            </div>
          </div>

          <div className="flex flex-col gap-2 mb-6">
            <label className="text-sm font-semibold text-slate-400">Description *</label>
            <textarea name="description" value={formData.description} onChange={handleChange} required rows="4" className="bg-slate-900 border border-slate-700 rounded-lg p-3 text-white outline-none focus:ring-2 focus:ring-teal-500 resize-none" placeholder="Enter job requirements..." />
          </div>

          <div className="flex flex-col gap-2 mb-6">
            <label className="text-sm font-semibold text-slate-400">Interview Rounds</label>
            <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-3">
              <select
                value={selectedRound}
                onChange={(e) => {
                  setSelectedRound(e.target.value)
                  setError(null)
                }}
                className="bg-slate-900 border border-slate-700 rounded-lg p-3 text-white outline-none focus:ring-2 focus:ring-teal-500 cursor-pointer"
              >
                <option value="">Select next round</option>
                {roundOptions.map((round) => (
                  <option key={round} value={round} disabled={rounds.includes(round)}>
                    {round}
                  </option>
                ))}
              </select>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleAddRound}
                  disabled={!selectedRound}
                  className="px-4 py-3 bg-teal-600 hover:bg-teal-500 text-white rounded-xl transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Add Round
                </button>
                <button
                  type="button"
                  onClick={handleRemoveRound}
                  disabled={rounds.length === 0}
                  className="px-4 py-3 bg-red-600 hover:bg-red-500 text-white rounded-xl transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Remove Round
                </button>
              </div>
            </div>
            {rounds.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {rounds.map((round, index) => (
                  <span key={`${round}-${index}`} className="px-3 py-1 rounded-full bg-slate-700 text-slate-100 border border-slate-600">
                    {round}
                  </span>
                ))}
              </div>
            )}
          </div>

          {error && <div className="mb-4 p-3 bg-red-500/20 border border-red-500 rounded text-red-300">{error}</div>}
          {success && <div className="mb-4 p-3 bg-emerald-500/20 border border-emerald-500 rounded text-emerald-300">✓ Job posted successfully!</div>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-teal-600 hover:bg-teal-500 text-white font-bold py-3 rounded-xl transition duration-200 shadow-lg active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Posting...' : '✓ Post Job'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default AddJob