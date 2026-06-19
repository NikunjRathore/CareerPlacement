import React, { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { createStats, getAllStats, deleteStats } from '../../api/statsApi'

export default function PlacementStats() {
  const { token } = useAuth()
  const [stats, setStats] = useState([])
  const [loading, setLoading] = useState(true)
  const [success, setSuccess] = useState(false)
  const [activeTab, setActiveTab] = useState('overall')
  const [form, setForm] = useState({
    year: '',
    total_students: '',
    placed_students: '',
    highest_package: '',
    lowest_package: '',
    average_package: '',
    median_package: '',
  })
  const [companyStats, setCompanyStats] = useState([{ company: '', students_hired: '', packages_offered: '' }])
  const [roleStats, setRoleStats] = useState([{ role: '', count: '', avg_package: '' }])
  const [error, setError] = useState(null)

  const load = async () => {
    try {
      setLoading(true)
      const data = await getAllStats(token)
      setStats(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleCompanyChange = (idx, field, val) => {
    const updated = [...companyStats]
    updated[idx][field] = val
    setCompanyStats(updated)
  }

  const handleRoleChange = (idx, field, val) => {
    const updated = [...roleStats]
    updated[idx][field] = val
    setRoleStats(updated)
  }

  const addCompanyRow = () => setCompanyStats([...companyStats, { company: '', students_hired: '', packages_offered: '' }])
  const removeCompanyRow = (idx) => setCompanyStats(companyStats.filter((_, i) => i !== idx))
  const addRoleRow = () => setRoleStats([...roleStats, { role: '', count: '', avg_package: '' }])
  const removeRoleRow = (idx) => setRoleStats(roleStats.filter((_, i) => i !== idx))

  const handleDeleteStats = async (id) => {
    if (window.confirm('Are you sure you want to delete this stats record?')) {
      try {
        setError(null)
        await deleteStats(id, token)
        setSuccess(true)
        setTimeout(() => setSuccess(false), 3000)
        await load()
      } catch (err) {
        setError(err.message || 'Failed to delete stats')
      }
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      setError(null)
      setSuccess(false)

      // Validation
      if (!form.year || form.year < 2000 || form.year > 2100) {
        setError('Please enter a valid year (2000-2100)')
        return
      }
      if (!form.total_students || Number(form.total_students) <= 0) {
        setError('Total students must be greater than 0')
        return
      }
      if (Number(form.placed_students) > Number(form.total_students)) {
        setError('Placed students cannot exceed total students')
        return
      }
      if (Number(form.placed_students) < 0) {
        setError('Placed students cannot be negative')
        return
      }

      const payload = {
        year: Number(form.year),
        total_students: Number(form.total_students),
        placed_students: Number(form.placed_students),
        package_stats: {
          highest_package: form.highest_package ? Number(form.highest_package) : undefined,
          lowest_package: form.lowest_package ? Number(form.lowest_package) : undefined,
          average_package: form.average_package ? Number(form.average_package) : undefined,
          median_package: form.median_package ? Number(form.median_package) : undefined,
        },
        roles_offered: roleStats
          .filter(r => r.role && r.count)
          .map(r => ({ role: r.role, count: Number(r.count), avg_package: r.avg_package ? Number(r.avg_package) : 0 })),
      }
      await createStats(payload, token)
      setSuccess(true)
      setForm({ year: '', total_students: '', placed_students: '', highest_package: '', lowest_package: '', average_package: '', median_package: '' })
      setCompanyStats([{ company: '', students_hired: '', packages_offered: '' }])
      setRoleStats([{ role: '', count: '', avg_package: '' }])
      setTimeout(() => setSuccess(false), 3000)
      await load()
    } catch (err) {
      setError(err.message || 'Failed to save stats')
    }
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Placement Statistics Management</h1>
          <p className="text-slate-400">Add and manage placement data for your institution</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-6 border-b border-slate-700">
          {['overall', 'packages', 'roles', 'view'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 font-semibold transition ${
                activeTab === tab
                  ? 'text-teal-400 border-b-2 border-teal-400'
                  : 'text-slate-400 hover:text-slate-300'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Overall Stats Tab */}
        {activeTab === 'overall' && (
          <div className="grid gap-6 mb-6">
            <form onSubmit={e => { e.preventDefault(); setActiveTab('packages') }} className="bg-slate-800/50 border border-slate-700 rounded-2xl p-8 shadow-xl backdrop-blur-sm">
              <h2 className="text-2xl font-bold text-white mb-6">Overall Statistics</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-slate-400">Year *</label>
                  <input type="number" name="year" value={form.year} onChange={handleChange} required className="bg-slate-900 border border-slate-700 rounded-lg p-3 text-white outline-none focus:ring-2 focus:ring-teal-500" placeholder="2026" />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-slate-400">Total Students *</label>
                  <input type="number" name="total_students" value={form.total_students} onChange={handleChange} required className="bg-slate-900 border border-slate-700 rounded-lg p-3 text-white outline-none focus:ring-2 focus:ring-teal-500" placeholder="250" />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-slate-400">Placed Students *</label>
                  <input type="number" name="placed_students" value={form.placed_students} onChange={handleChange} required className="bg-slate-900 border border-slate-700 rounded-lg p-3 text-white outline-none focus:ring-2 focus:ring-teal-500" placeholder="180" />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-slate-400">Percentage (Auto-calculated)</label>
                  <div className="bg-slate-900 border border-slate-700 rounded-lg p-3 text-white text-lg font-semibold">
                    {form.total_students && form.placed_students ? `${((form.placed_students / form.total_students) * 100).toFixed(2)}%` : '-'}
                  </div>
                </div>
              </div>
              <button type="submit" className="mt-6 px-6 py-2 bg-teal-600 hover:bg-teal-500 text-white font-semibold rounded-lg transition active:scale-95">Next: Package Stats →</button>
            </form>
          </div>
        )}

        {/* Packages Tab */}
        {activeTab === 'packages' && (
          <form onSubmit={e => { e.preventDefault(); setActiveTab('roles') }} className="bg-slate-800/50 border border-slate-700 rounded-2xl p-8 shadow-xl backdrop-blur-sm">
            <h2 className="text-2xl font-bold text-white mb-6">Package Statistics</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-slate-400">Highest Package (LPA)</label>
                <input type="number" step="0.01" name="highest_package" value={form.highest_package} onChange={handleChange} className="bg-slate-900 border border-slate-700 rounded-lg p-3 text-white outline-none focus:ring-2 focus:ring-teal-500" placeholder="25.5" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-slate-400">Lowest Package (LPA)</label>
                <input type="number" step="0.01" name="lowest_package" value={form.lowest_package} onChange={handleChange} className="bg-slate-900 border border-slate-700 rounded-lg p-3 text-white outline-none focus:ring-2 focus:ring-teal-500" placeholder="8.0" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-slate-400">Average Package (LPA)</label>
                <input type="number" step="0.01" name="average_package" value={form.average_package} onChange={handleChange} className="bg-slate-900 border border-slate-700 rounded-lg p-3 text-white outline-none focus:ring-2 focus:ring-teal-500" placeholder="14.5" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-slate-400">Median Package (LPA)</label>
                <input type="number" step="0.01" name="median_package" value={form.median_package} onChange={handleChange} className="bg-slate-900 border border-slate-700 rounded-lg p-3 text-white outline-none focus:ring-2 focus:ring-teal-500" placeholder="12.0" />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button type="button" onClick={() => setActiveTab('overall')} className="px-6 py-2 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-lg transition">← Back</button>
              <button type="submit" className="px-6 py-2 bg-teal-600 hover:bg-teal-500 text-white font-semibold rounded-lg transition active:scale-95">Next: Roles →</button>
            </div>
          </form>
        )}

        {/* Roles Tab */}
        {activeTab === 'roles' && (
          <form onSubmit={e => { e.preventDefault(); setActiveTab('view') }} className="bg-slate-800/50 border border-slate-700 rounded-2xl p-8 shadow-xl backdrop-blur-sm">
            <h2 className="text-2xl font-bold text-white mb-6">Role Distribution</h2>
            <div className="space-y-4 mb-6">
              {roleStats.map((role, idx) => (
                <div key={idx} className="grid grid-cols-1 md:grid-cols-4 gap-3 p-4 bg-slate-900/50 rounded-lg border border-slate-700">
                  <input type="text" placeholder="Role (e.g. SDE)" value={role.role} onChange={(e) => handleRoleChange(idx, 'role', e.target.value)} className="bg-slate-800 border border-slate-600 rounded p-2 text-white outline-none focus:ring-2 focus:ring-teal-500" />
                  <input type="number" placeholder="Count" value={role.count} onChange={(e) => handleRoleChange(idx, 'count', e.target.value)} className="bg-slate-800 border border-slate-600 rounded p-2 text-white outline-none focus:ring-2 focus:ring-teal-500" />
                  <input type="number" step="0.01" placeholder="Avg Package" value={role.avg_package} onChange={(e) => handleRoleChange(idx, 'avg_package', e.target.value)} className="bg-slate-800 border border-slate-600 rounded p-2 text-white outline-none focus:ring-2 focus:ring-teal-500" />
                  <button type="button" onClick={() => removeRoleRow(idx)} className="bg-red-600/20 hover:bg-red-600/40 text-red-300 rounded p-2 font-semibold transition">Remove</button>
                </div>
              ))}
            </div>
            <button type="button" onClick={addRoleRow} className="mb-6 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-lg transition">+ Add Role</button>
            <div className="flex gap-3">
              <button type="button" onClick={() => setActiveTab('packages')} className="px-6 py-2 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-lg transition">← Back</button>
              <button type="submit" className="px-6 py-2 bg-teal-600 hover:bg-teal-500 text-white font-semibold rounded-lg transition active:scale-95">Review →</button>
            </div>
          </form>
        )}

        {/* View/Submit Tab */}
        {activeTab === 'view' && (
          <div className="space-y-6">
            <form onSubmit={handleSubmit} className="bg-slate-800/50 border border-slate-700 rounded-2xl p-8 shadow-xl backdrop-blur-sm">
              <h2 className="text-2xl font-bold text-white mb-4">Review & Submit</h2>
              <div className="space-y-4 text-slate-300">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-slate-900/50 p-4 rounded">
                    <div className="text-sm text-slate-400">Year</div>
                    <div className="text-xl font-bold text-teal-400">{form.year}</div>
                  </div>
                  <div className="bg-slate-900/50 p-4 rounded">
                    <div className="text-sm text-slate-400">Total Students</div>
                    <div className="text-xl font-bold text-teal-400">{form.total_students}</div>
                  </div>
                  <div className="bg-slate-900/50 p-4 rounded">
                    <div className="text-sm text-slate-400">Placed</div>
                    <div className="text-xl font-bold text-teal-400">{form.placed_students}</div>
                  </div>
                  <div className="bg-slate-900/50 p-4 rounded">
                    <div className="text-sm text-slate-400">Percentage</div>
                    <div className="text-xl font-bold text-teal-400">{form.total_students && form.placed_students ? `${((form.placed_students / form.total_students) * 100).toFixed(2)}%` : '-'}</div>
                  </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-slate-900/50 p-4 rounded">
                    <div className="text-sm text-slate-400">Highest</div>
                    <div className="text-lg font-bold text-emerald-400">{form.highest_package ? form.highest_package : '-'} LPA</div>
                  </div>
                  <div className="bg-slate-900/50 p-4 rounded">
                    <div className="text-sm text-slate-400">Lowest</div>
                    <div className="text-lg font-bold text-orange-400">{form.lowest_package ? form.lowest_package : '-'} LPA</div>
                  </div>
                  <div className="bg-slate-900/50 p-4 rounded">
                    <div className="text-sm text-slate-400">Average</div>
                    <div className="text-lg font-bold text-blue-400">{form.average_package ? form.average_package : '-'} LPA</div>
                  </div>
                  <div className="bg-slate-900/50 p-4 rounded">
                    <div className="text-sm text-slate-400">Median</div>
                    <div className="text-lg font-bold text-purple-400">{form.median_package ? form.median_package : '-'} LPA</div>
                  </div>
                </div>
              </div>
              {error && <div className="mt-4 p-3 bg-red-500/20 border border-red-500 rounded text-red-300">{error}</div>}
              {success && <div className="mt-4 p-3 bg-emerald-500/20 border border-emerald-500 rounded text-emerald-300">✓ Stats saved successfully!</div>}
              <div className="flex gap-3 mt-6">
                <button type="button" onClick={() => setActiveTab('roles')} className="px-6 py-2 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-lg transition">← Back</button>
                <button type="submit" className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg transition active:scale-95 shadow-lg">✓ Save All Stats</button>
              </div>
            </form>
          </div>
        )}

        {/* Existing Stats */}
        <div className="mt-8 bg-slate-800/50 border border-slate-700 rounded-2xl p-8 shadow-xl backdrop-blur-sm">
          <h3 className="text-2xl font-bold text-white mb-6">Saved Statistics</h3>
          {loading ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-teal-500"></div>
              <p className="text-slate-400 mt-2">Loading...</p>
            </div>
          ) : stats.length === 0 ? (
            <div className="text-center py-8 text-slate-400">No placement stats yet. Add one above!</div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {stats.map((s) => (
                <div key={s._id} className="bg-slate-900/50 border border-slate-700 rounded-lg p-6 hover:border-teal-500/50 transition relative">
                  <button
                    onClick={() => handleDeleteStats(s._id)}
                    className="absolute top-2 right-2 bg-red-600/20 hover:bg-red-600/40 border border-red-600/50 text-red-400 px-2 py-1 rounded text-xs font-medium transition"
                  >
                    Delete
                  </button>
                  <div className="text-sm text-slate-400 mb-2">Year</div>
                  <div className="text-3xl font-bold text-teal-400 mb-4">{s.year}</div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Placement:</span>
                      <span className="text-white font-semibold">{s.placement_percentage}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Placed:</span>
                      <span className="text-white font-semibold">{s.placed_students}/{s.total_students}</span>
                    </div>
                    {s.package_stats?.average_package && (
                      <div className="flex justify-between">
                        <span className="text-slate-400">Avg Package:</span>
                        <span className="text-emerald-400 font-semibold">{s.package_stats.average_package} LPA</span>
                      </div>
                    )}
                    {s.roles_offered?.length > 0 && (
                      <div className="flex justify-between">
                        <span className="text-slate-400">Roles:</span>
                        <span className="text-blue-400 font-semibold">{s.roles_offered.length}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
