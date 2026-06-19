import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const PlacementReadinessPage = () => {
  const { user, token } = useContext(AuthContext);
  const [readiness, setReadiness] = useState(null);
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);

  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    fetchReadinessData();
  }, []);

  const fetchReadinessData = async () => {
    try {
      const [readinessRes, progressRes] = await Promise.all([
        axios.get(`${API_URL}/readiness/score`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get(`${API_URL}/readiness/progress`, {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);

      setReadiness(readinessRes.data);
      setProgress(progressRes.data);
    } catch (error) {
      console.error('Error fetching readiness data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getScoreGrade = (score) => {
    if (score >= 80) return { grade: 'A+', color: 'text-emerald-400', bg: 'bg-emerald-500/20' };
    if (score >= 70) return { grade: 'A', color: 'text-green-400', bg: 'bg-green-500/20' };
    if (score >= 60) return { grade: 'B', color: 'text-yellow-400', bg: 'bg-yellow-500/20' };
    if (score >= 50) return { grade: 'C', color: 'text-orange-400', bg: 'bg-orange-500/20' };
    return { grade: 'D', color: 'text-red-400', bg: 'bg-red-500/20' };
  };

  if (loading) return <div className="text-white text-center py-10">Loading...</div>;

  if (!readiness) return <div className="text-white text-center py-10">Error loading readiness data</div>;

  const gradeInfo = getScoreGrade(readiness.total_score);

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 to-slate-800 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8">Placement Readiness Score</h1>

        {/* Main Score Card */}
        <div className={`${gradeInfo.bg} border border-slate-700 rounded-2xl p-12 mb-8 text-center`}>
          <div className={`text-7xl font-bold ${gradeInfo.color} mb-4`}>{readiness.total_score}</div>
          <div className={`text-4xl font-bold ${gradeInfo.color} mb-2`}>{gradeInfo.grade}</div>
          <p className="text-slate-400 text-lg">
            {readiness.total_score >= 80
              ? 'Excellent! You are well-prepared for placements'
              : readiness.total_score >= 60
              ? 'Good progress! Keep improving'
              : 'Work on the areas below to improve your readiness'}
          </p>
        </div>

        {/* Score Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {Object.entries(readiness.breakdown).map(([category, details]) => (
            <div key={category} className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-lg font-bold text-white capitalize">{category.replace(/_/g, ' ')}</h3>
                <span className="text-2xl font-bold text-teal-400">
                  {details.score.toFixed(0)}/{details.max}
                </span>
              </div>
              <div className="w-full bg-slate-900 rounded-full h-3">
                <div
                  className="bg-linear-to-r from-teal-500 to-cyan-500 h-3 rounded-full"
                  style={{ width: `${(details.score / details.max) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Profile Completion */}
        {progress && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
              <h2 className="text-2xl font-bold text-white mb-6">Profile Completion</h2>
              <div className="space-y-4">
                {Object.entries(progress.profile_completion).map(([field, completed]) => (
                  <div key={field} className="flex items-center gap-3">
                    <span className={completed ? 'text-green-400' : 'text-slate-500'}>
                      {completed ? '✓' : '○'}
                    </span>
                    <span className="text-white capitalize">{field.replace(/_/g, ' ')}</span>
                  </div>
                ))}
              </div>
              <div className="mt-6 pt-6 border-t border-slate-700">
                <p className="text-slate-400 text-sm">Overall Progress</p>
                <div className="mt-3 flex items-center gap-3">
                  <div className="flex-1 bg-slate-900 rounded-full h-2">
                    <div
                      className="bg-teal-500 h-2 rounded-full"
                      style={{ width: `${progress.completion_percentage}%` }}
                    />
                  </div>
                  <span className="text-teal-400 font-bold">{Math.round(progress.completion_percentage)}%</span>
                </div>
              </div>
            </div>

            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
              <h2 className="text-2xl font-bold text-white mb-6">Application Status</h2>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-slate-400">Total Applications</span>
                  <span className="text-teal-400 font-bold">{progress.applications.total}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Shortlisted</span>
                  <span className="text-blue-400 font-bold">{progress.applications.shortlisted}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Selected</span>
                  <span className="text-green-400 font-bold">{progress.applications.selected}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Rejected</span>
                  <span className="text-red-400 font-bold">{progress.applications.rejected}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Suggestions */}
        {readiness.suggestions && readiness.suggestions.length > 0 && (
          <div className="bg-slate-800/50 border border-blue-700/50 rounded-xl p-6">
            <h2 className="text-2xl font-bold text-blue-400 mb-4">💡 Recommendations</h2>
            <ul className="space-y-3">
              {readiness.suggestions.map((suggestion, idx) => (
                <li key={idx} className="text-slate-300 flex items-start gap-3">
                  <span className="text-blue-400 mt-1 shrink-0">→</span>
                  <span>{suggestion}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlacementReadinessPage;
