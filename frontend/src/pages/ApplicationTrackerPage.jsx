import { useCallback, useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const ApplicationTrackerPage = () => {
  const { token } = useContext(AuthContext);
  const [applications, setApplications] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState(null);

  const statusColors = {
    applied: 'bg-blue-500/20 text-blue-300 border-blue-500/50',
    screening: 'bg-purple-500/20 text-purple-300 border-purple-500/50',
    selected: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50',
    rejected: 'bg-red-500/20 text-red-300 border-red-500/50',
  };

  const fetchApplications = useCallback(async () => {
    try {
      const res = await axios.get(`${API_URL}/applications`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setApplications(res.data);
    } catch (error) {
      console.error('Error fetching applications:', error);
    } finally {
      setLoading(false);
    }
  }, [token]);

  const fetchStats = useCallback(async () => {
    try {
      const res = await axios.get(`${API_URL}/applications/stats`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStats(res.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  }, [token]);

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    fetchApplications();
    fetchStats();
  }, [fetchApplications, fetchStats]);
  /* eslint-enable react-hooks/set-state-in-effect */


  const handleDelete = async (appId) => {
    if (confirm('Are you sure you want to delete this application?')) {
      try {
        await axios.delete(`${API_URL}/applications/${appId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        fetchApplications();
        fetchStats();
      } catch {
        alert('Error deleting application');
      }
    }
  };

 const handleStatus = async (app, roundChange = 0, isRejected = false) => {
  let newStatus;

  const currentRound = app.current_round;
  const newRoundIdx = currentRound + roundChange;
  const totalRounds = app.job?.rounds?.length || 0;

  if (isRejected) {
    if (!confirm("Are you sure you want to reject this application?")) return;
    newStatus = "rejected";
  } else if (newRoundIdx === -1) {
    newStatus = "applied";
  } else if (newRoundIdx >= totalRounds-1) {
    newStatus = "selected";
  } else {
    newStatus = "screening";
  }

  try {
    await axios.put(
      `${API_URL}/applications/${app._id}`,
      {
        status: newStatus,
        current_round: newRoundIdx,
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    fetchApplications();
    fetchStats();
  } catch (error) {
    alert("Error updating application");
  }
};

  const allRounds = [
    ...(selectedApp?.rounds_completed || []).map(round => ({
      name: round,
      status: "completed"
    })),
    ...(selectedApp?.rounds_pending || []).map(round => ({
      name: round,
      status: "pending"
    }))
  ];


  if (loading) return <div className="text-white text-center py-10">Loading...</div>;

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 to-slate-800 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8">Application Tracker</h1>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
              <p className="text-slate-400 text-sm">Total Applications</p>
              <p className="text-3xl font-bold text-teal-400">{stats.total_applications}</p>
            </div>
            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
              <p className="text-slate-400 text-sm">Shortlisted</p>
              <p className="text-3xl font-bold text-blue-400">
                {Object.values(stats.by_status || {}).reduce((a, b) => a + b, 0) - stats.rejected_count}
              </p>
            </div>
            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
              <p className="text-slate-400 text-sm">Selected</p>
              <p className="text-3xl font-bold text-green-400">{stats.selected_count}</p>
            </div>
            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
              <p className="text-slate-400 text-sm">Rejected</p>
              <p className="text-3xl font-bold text-red-400">{stats.rejected_count}</p>
            </div>
          </div>
        )}

        {/* Applications List */}
        <div className="space-y-4">
          {applications.length === 0 ? (
            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-8 text-center">
              <p className="text-slate-400">No applications yet. Apply to jobs to start tracking!</p>
            </div>
          ) : (
            applications.map(app => (
              <div
                key={app._id}
                className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 hover:border-teal-500/50 transition cursor-pointer"
                onClick={() => setSelectedApp(selectedApp?._id === app._id ? null : app)}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-white">{app.job?.role}</h3>
                    <p className="text-slate-400">{app.job?.company?.name || 'Unknown Company'}</p>
                    <p className="text-sm text-slate-500">Applied: {new Date(app.applied_date).toLocaleDateString()}</p>
                  </div>
                  <span className={`px-4 py-2 rounded-full border text-sm font-semibold ${statusColors[app.status]}`}>
                    {app.status.toUpperCase()}
                  </span>
                </div>

                {/* Rounds visual */}
                <div className="mt-4 flex flex-wrap items-center gap-2">
                  
                  {/* Decrease button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleStatus(app, -1);
                    }}
                    disabled={app.current_round < 0}
                    className="px-3 py-1 rounded-full bg-slate-800 text-white border border-slate-600 hover:bg-slate-700 disabled:opacity-40"
                  >
                    ⬅ 
                  </button>

                  {/* Rounds */}
                  {(app.job?.rounds || []).map((round, idx) => {
                    const passed = idx <= app.current_round;

                    return (
                      <button
                        key={idx}
                        className={`px-3 py-1 rounded-full text-sm font-medium transition-all duration-200 ${
                          passed
                            ? "bg-emerald-500 text-white"
                            : idx === app.current_round
                            ? "bg-yellow-500 text-black"
                            : "bg-slate-700 text-slate-400"
                        } border ${
                          passed ? "border-emerald-600" : "border-slate-700"
                        }`}
                      >
                        {round}
                      </button>
                    );
                  })}

                  {/* Increase button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleStatus(app, 1);
                    }}
                    disabled={app.current_round >= (app.job?.rounds?.length -1)}
                    className="px-3 py-1 rounded-full bg-teal-600 text-white border border-teal-500 hover:bg-teal-500 disabled:opacity-40"
                  >
                    ➡
                  </button>
                </div>

                {selectedApp?._id === app._id && (
                  <div
                    className="mt-6 pt-6 border-t border-slate-700 space-y-4"
                    onClick={(e) => e.stopPropagation()}
                  >

                    <div className='flex gap-2'>
                      {selectedApp.status!=='selected' && selectedApp.status !== 'rejected' && (
                        <>
                          <button
                            onClick={() => handleStatus(app,null,true)}
                            className="w-full bg-red-800 hover:bg-red-700 text-white font-bold py-2 rounded-lg transition"
                          >
                            Rejected
                          </button>
                          <button
                            onClick={() => handleDelete(app._id)}
                            className="w-full bg-red-600 hover:bg-red-500 text-white font-bold py-2 rounded-lg transition"
                          >
                            Delete Application
                          </button>
                        </>
            
                      )}

                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ApplicationTrackerPage;
