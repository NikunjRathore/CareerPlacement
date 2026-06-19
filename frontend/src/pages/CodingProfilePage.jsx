import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const CodingProfilePage = () => {
  const { user, token } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState(null);
  const [formData, setFormData] = useState({
    leetcode: { username: '', rating: null, problems_solved: null },
    hackerrank: { username: '', rating: null },
    codechef: { username: '', rating: null, problems_solved: null },
    github: { username: '', repositories: null, followers: null }
  });

  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    fetchCodingProfile();
  }, []);

  const fetchCodingProfile = async () => {
    try {
      const res = await axios.get(`${API_URL}/coding-profile`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProfile(res.data);
      setFormData({
        leetcode: res.data.leetcode || { username: '', rating: 0, problems_solved: 0 },
        hackerrank: res.data.hackerrank || { username: '', rating: 0 },
        codechef: res.data.codechef || { username: '', rating: 0, problems_solved: 0 },
        github: res.data.github || { username: '', repositories: 0, followers: 0 }
      });
    } catch (error) {
      console.log('No profile yet');
    }
  };

  const handleChange = (platform, field, value) => {
    setFormData({
      ...formData,
      [platform]: {
        ...formData[platform],
        [field]: isNaN(value) ? value : parseInt(value)
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(`${API_URL}/coding-profile`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProfile(res.data);
      alert('Coding profile updated successfully!');
    } catch (error) {
      alert('Error updating profile: ' + error.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 to-slate-800 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8">Coding Profile</h1>

        {profile && (
          <div className="mb-8 p-6 bg-slate-800/50 border border-slate-700 rounded-xl">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-slate-400 text-sm">Overall Score</p>
                <p className="text-3xl font-bold text-teal-400">{profile.overall_score}/100</p>
              </div>
              <div>
                <p className="text-slate-400 text-sm">Last Updated</p>
                <p className="text-lg text-white">{new Date(profile.last_updated).toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* LeetCode */}
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              <span className="text-yellow-500">◆</span> LeetCode
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Username"
                value={formData.leetcode.username}
                onChange={(e) => handleChange('leetcode', 'username', e.target.value)}
                className="bg-slate-900 border border-slate-700 rounded-lg p-3 text-white"
              />
              <input
                disabled
                type="number"
                placeholder="Rating"
                value={formData.leetcode.rating}
                onChange={(e) => handleChange('leetcode', 'rating', e.target.value)}
                className="bg-slate-900 border border-slate-700 rounded-lg p-3 text-white"
              />
              <input
                disabled
                type="number"
                placeholder="Problems Solved"
                value={formData.leetcode.problems_solved}
                onChange={(e) => handleChange('leetcode', 'problems_solved', e.target.value)}
                className="bg-slate-900 border border-slate-700 rounded-lg p-3 text-white col-span-2"
              />
            </div>
          </div>

          {/* HackerRank */}
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              <span className="text-green-500">⬢</span> HackerRank
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Username"
                value={formData.hackerrank.username}
                onChange={(e) => handleChange('hackerrank', 'username', e.target.value)}
                className="bg-slate-900 border border-slate-700 rounded-lg p-3 text-white"
              />
              <input
                disabled
                type="number"
                placeholder="Rating"
                value={formData.hackerrank.rating}
                onChange={(e) => handleChange('hackerrank', 'rating', e.target.value)}
                className="bg-slate-900 border border-slate-700 rounded-lg p-3 text-white"
              />
            </div>
          </div>

          {/* CodeChef */}
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              <span className="text-orange-500">◈</span> CodeChef
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Username"
                value={formData.codechef.username}
                onChange={(e) => handleChange('codechef', 'username', e.target.value)}
                className="bg-slate-900 border border-slate-700 rounded-lg p-3 text-white"
              />
              <input
                disabled
                type="number"
                placeholder="Rating"
                value={formData.codechef.rating}
                onChange={(e) => handleChange('codechef', 'rating', e.target.value)}
                className="bg-slate-900 border border-slate-700 rounded-lg p-3 text-white"
              />
              <input
                disabled
                type="number"
                placeholder="Problems Solved"
                value={formData.codechef.problems_solved}
                onChange={(e) => handleChange('codechef', 'problems_solved', e.target.value)}
                className="bg-slate-900 border border-slate-700 rounded-lg p-3 text-white col-span-2"
              />
            </div>
          </div>

          {/* GitHub */}
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              <span className="text-gray-400">◇</span> GitHub
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Username"
                value={formData.github.username}
                onChange={(e) => handleChange('github', 'username', e.target.value)}
                className="bg-slate-900 border border-slate-700 rounded-lg p-3 text-white"
              />
              <input
                disabled
                type="number"
                placeholder="Public Repositories"
                value={formData.github.repositories}
                onChange={(e) => handleChange('github', 'repositories', e.target.value)}
                className="bg-slate-900 border border-slate-700 rounded-lg p-3 text-white"
              />
              <input
                disabled
                type="number"
                placeholder="Followers"
                value={formData.github.followers}
                onChange={(e) => handleChange('github', 'followers', e.target.value)}
                className="bg-slate-900 border border-slate-700 rounded-lg p-3 text-white"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-teal-600 hover:bg-teal-500 text-white font-bold py-3 rounded-xl transition duration-200 shadow-lg active:scale-95 disabled:opacity-50"
          >
            {loading ? 'Saving...' : 'Save Coding Profile'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CodingProfilePage;
