import React, { useEffect, useState } from 'react'
import { getLatestStats } from '../api/statsApi'

export default function StatsPage() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true)
        const data = await getLatestStats()
        setStats(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500 mb-4"></div>
          <p className="text-slate-400 text-lg">Loading placement stats...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-red-500/20 border border-red-500 rounded-lg p-6 text-red-300">{error}</div>
        </div>
      </div>
    )
  }

  if (!stats) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 text-slate-400">No placement statistics available yet.</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Placement Statistics {stats.year}</h1>
          <p className="text-slate-400">Overall Placement Overview for the Year</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gradient-to-br from-teal-900/40 to-teal-800/20 border border-teal-700/50 rounded-xl p-6 shadow-lg">
            <div className="text-sm text-teal-300 mb-2">Placement Percentage</div>
            <div className="text-4xl font-bold text-teal-400">{stats.placement_percentage}%</div>
          </div>
          <div className="bg-gradient-to-br from-blue-900/40 to-blue-800/20 border border-blue-700/50 rounded-xl p-6 shadow-lg">
            <div className="text-sm text-blue-300 mb-2">Placed Students</div>
            <div className="text-4xl font-bold text-blue-400">{stats.placed_students}</div>
          </div>
          <div className="bg-gradient-to-br from-purple-900/40 to-purple-800/20 border border-purple-700/50 rounded-xl p-6 shadow-lg">
            <div className="text-sm text-purple-300 mb-2">Total Students</div>
            <div className="text-4xl font-bold text-purple-400">{stats.total_students}</div>
          </div>
          <div className="bg-gradient-to-br from-orange-900/40 to-orange-800/20 border border-orange-700/50 rounded-xl p-6 shadow-lg">
            <div className="text-sm text-orange-300 mb-2">Year</div>
            <div className="text-4xl font-bold text-orange-400">{stats.year}</div>
          </div>
        </div>

        {stats.package_stats && Object.keys(stats.package_stats).length > 0 && (
          <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-8 shadow-xl backdrop-blur-sm mb-8">
            <h2 className="text-2xl font-bold text-white mb-6">Package Statistics</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {stats.package_stats.highest_package && (
                <div className="bg-slate-900/50 p-6 rounded-lg border border-slate-700">
                  <div className="text-sm text-emerald-300 mb-2">Highest Package</div>
                  <div className="text-3xl font-bold text-emerald-400">{stats.package_stats.highest_package} LPA</div>
                </div>
              )}
              {stats.package_stats.lowest_package && (
                <div className="bg-slate-900/50 p-6 rounded-lg border border-slate-700">
                  <div className="text-sm text-orange-300 mb-2">Lowest Package</div>
                  <div className="text-3xl font-bold text-orange-400">{stats.package_stats.lowest_package} LPA</div>
                </div>
              )}
              {stats.package_stats.average_package && (
                <div className="bg-slate-900/50 p-6 rounded-lg border border-slate-700">
                  <div className="text-sm text-blue-300 mb-2">Average Package</div>
                  <div className="text-3xl font-bold text-blue-400">{stats.package_stats.average_package} LPA</div>
                </div>
              )}
              {stats.package_stats.median_package && (
                <div className="bg-slate-900/50 p-6 rounded-lg border border-slate-700">
                  <div className="text-sm text-purple-300 mb-2">Median Package</div>
                  <div className="text-3xl font-bold text-purple-400">{stats.package_stats.median_package} LPA</div>
                </div>
              )}
            </div>
          </div>
        )}

        {stats.roles_offered && stats.roles_offered.length > 0 && (
          <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-8 shadow-xl backdrop-blur-sm mb-8">
            <h2 className="text-2xl font-bold text-white mb-6">Role Distribution</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {stats.roles_offered.map((role, idx) => (
                <div key={idx} className="bg-slate-900/50 p-5 rounded-lg border border-slate-700 hover:border-teal-500/50 transition">
                  <div className="font-semibold text-white text-lg">{role.role}</div>
                  <div className="flex justify-between mt-3 text-sm text-slate-300">
                    <span>Count: <span className="text-teal-400 font-semibold">{role.count}</span></span>
                    {role.avg_package && <span>Avg: <span className="text-emerald-400 font-semibold">{role.avg_package} LPA</span></span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {stats.department_stats && stats.department_stats.length > 0 && (
          <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-8 shadow-xl backdrop-blur-sm">
            <h2 className="text-2xl font-bold text-white mb-6">Department-wise Placement</h2>
            <div className="grid gap-4 md:grid-cols-2">
              {stats.department_stats.map((dept, idx) => (
                <div key={idx} className="bg-slate-900/50 p-6 rounded-lg border border-slate-700">
                  <div className="font-semibold text-white mb-3 text-lg">{dept.department}</div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between text-slate-300">
                      <span>Placed:</span>
                      <span className="font-semibold text-teal-400">{dept.placed_students}/{dept.total_students}</span>
                    </div>
                    <div className="flex justify-between text-slate-300">
                      <span>Percentage:</span>
                      <span className="font-semibold text-emerald-400">{dept.placement_percentage}%</span>
                    </div>
                    <div className="mt-3 w-full bg-slate-800 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-teal-500 to-emerald-500 h-2 rounded-full transition"
                        style={{ width: `${dept.placement_percentage}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

