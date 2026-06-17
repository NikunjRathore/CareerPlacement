import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useJobs } from '../context/JobContext'

function JobListingPage({ user }) {
  const navigate = useNavigate()
  const { jobs } = useJobs()
  const [filter, setFilter] = useState({ dept: '', minCgpa: '' })

  const filteredJobs = jobs.filter((job) => {
    const matchDept = filter.dept === '' || job.dept.find((dept) => dept === filter.dept)
    const matchCgpa = filter.minCgpa === '' || job.minCgpa <= parseFloat(filter.minCgpa)
    return matchDept && matchCgpa
  })

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6">
      <header className="max-w-6xl mx-auto flex justify-between items-center mb-10">
        <button onClick={() => navigate('/user/dashboard')} className="text-teal-400 font-semibold hover:underline">
          &larr; Back to Dashboard
        </button>
        <h1 className="text-3xl font-bold">Upcoming Companies</h1>
        <div className="w-20"></div> {/* Spacer */}
      </header>

      <main className="max-w-6xl mx-auto">
        {/* Filters */}
        <section className="grid gap-4 sm:grid-cols-3 mb-8 bg-slate-800/50 p-6 rounded-xl border border-slate-700">
          <div>
            <label className="block text-xs font-semibold uppercase text-slate-400 mb-2">Department</label>
            <select 
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 focus:ring-2 focus:ring-teal-500 outline-none"
              value={filter.dept}
              onChange={(e) => setFilter({ ...filter, dept: e.target.value })}
            >
              <option value="">All Departments</option>
              <option value="CSE">Computer Science</option>
              <option value="ECE">ECE</option>
              <option value="EE">Electrical</option>
              <option value="MECH">Mechanical</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase text-slate-400 mb-2">Min Required CGPA</label>
            <input 
              type="number" 
              step="0.01"
              placeholder="e.g. 8.00"
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 focus:ring-2 focus:ring-teal-500 outline-none"
              value={filter.minCgpa}
              onChange={(e) => setFilter({ ...filter, minCgpa: e.target.value })}
            />
          </div>
        </section>

        {/* List */}
        <div className="grid gap-4">
          {filteredJobs.length > 0 ? (
            [...filteredJobs].sort((a, b) => new Date(a.date) - new Date(b.date)).map(job => (
              <div key={job.id} className="bg-slate-800/30 border border-slate-700 p-6 rounded-xl flex flex-wrap justify-between items-center gap-4 hover:border-teal-500/50 transition">
                <div>
                  <h3 className="text-xl font-bold text-white">{job.company?.name || 'Unknown Company'}</h3>
                  <p className="text-teal-400 font-medium">{job.role}</p>
                  <div className="flex gap-4 mt-2 text-sm text-slate-400">
                    <span>🏢 {job.dept?.join(', ')}</span>
                    <span>� Min CGPA: {job.minCgpa}</span>
                    <span>📅 {job.date}</span>
                  </div>
                </div>
                <button className="bg-teal-600 hover:bg-teal-500 px-6 py-2 rounded-lg font-bold transition">
                  Apply Now
                </button>
              </div>
            ))
          ) : (
            <div className="text-center py-20 text-slate-500">
              No companies matching your criteria found.
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default JobListingPage