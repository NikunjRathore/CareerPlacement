import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const CompanyTargetingPage = () => {
  const { user, token } = useContext(AuthContext);
  const [companies, setCompanies] = useState([]);
  const [targetedCompanies, setTargetedCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('recommended'); // recommended, all-companies, targeted

  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    fetchCompanyData();
  }, []);

  const fetchCompanyData = async () => {
    try {
      const [recommended, targeted] = await Promise.all([
        axios.get(`${API_URL}/company-data/recommended`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get(`${API_URL}/company-data/targets`, {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);

      setCompanies(recommended.data);
      setTargetedCompanies(targeted.data);
    } catch (error) {
      console.error('Error fetching company data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTarget = async (companyId) => {
    try {
      await axios.post(
        `${API_URL}/company-data/targets`,
        { company_id: companyId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchCompanyData();
    } catch (error) {
      alert('Error adding to targets: ' + error.response?.data?.message);
    }
  };

  const handleRemoveTarget = async (companyId) => {
    try {
      await axios.delete(
        `${API_URL}/company-data/targets/${companyId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchCompanyData();
    } catch (error) {
      alert('Error removing from targets');
    }
  };

  const isTargeted = (companyId) => {
    return targetedCompanies.some(tc => tc.company._id === companyId || tc.company === companyId);
  };

  const CompanyCard = ({ data }) => {
    const company = data.company;
    const isTarget = isTargeted(company._id);

    return (
      <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 hover:border-teal-500/50 transition">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <h3 className="text-xl font-bold text-white">{company.name}</h3>
            <p className="text-slate-400 text-sm">{company.industry}</p>
          </div>
          <button
            onClick={() => isTarget ? handleRemoveTarget(company._id) : handleAddTarget(company._id)}
            className={`px-4 py-2 rounded-lg font-semibold transition ${
              isTarget
                ? 'bg-red-600 hover:bg-red-500 text-white'
                : 'bg-teal-600 hover:bg-teal-500 text-white'
            }`}
          >
            {isTarget ? '✓ Targeted' : '+ Target'}
          </button>
        </div>

        {data.year && (
          <div className="grid grid-cols-2 gap-4 mb-4 pt-4 border-t border-slate-700">
            <div>
              <p className="text-slate-400 text-xs">Year</p>
              <p className="text-white font-semibold">{data.year}</p>
            </div>
            <div>
              <p className="text-slate-400 text-xs">Slots</p>
              <p className="text-white font-semibold">{data.slots_offered || 'N/A'}</p>
            </div>
            <div>
              <p className="text-slate-400 text-xs">Avg Package (LPA)</p>
              <p className="text-teal-400 font-semibold">{data.package?.avg_package || 'N/A'}</p>
            </div>
            <div>
              <p className="text-slate-400 text-xs">Min CGPA</p>
              <p className="text-white font-semibold">{data.min_cgpa || 'N/A'}</p>
            </div>
          </div>
        )}

        {data.roles && (
          <div className="pt-4 border-t border-slate-700">
            <p className="text-slate-400 text-xs mb-2">Roles</p>
            <div className="flex flex-wrap gap-2">
              {data.roles.map(role => (
                <span key={role} className="bg-slate-900 text-teal-300 text-xs px-3 py-1 rounded-full">
                  {role}
                </span>
              ))}
            </div>
          </div>
        )}

        {company.website && (
          <div className="mt-4">
            <a
              href={company.website}
              target="_blank"
              rel="noopener noreferrer"
              className="text-teal-400 hover:text-teal-300 text-sm font-semibold"
            >
              Visit Website →
            </a>
          </div>
        )}
      </div>
    );
  };

  if (loading) return <div className="text-white text-center py-10">Loading...</div>;

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 to-slate-800 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8">Company Targeting</h1>

        {/* Tabs */}
        <div className="flex gap-4 mb-8">
          <button
            onClick={() => setActiveTab('recommended')}
            className={`px-6 py-3 rounded-lg font-semibold transition ${
              activeTab === 'recommended'
                ? 'bg-teal-600 text-white'
                : 'bg-slate-800 border border-slate-700 text-slate-400 hover:text-white'
            }`}
          >
            📊 Recommended ({companies.length})
          </button>
          <button
            onClick={() => setActiveTab('targeted')}
            className={`px-6 py-3 rounded-lg font-semibold transition ${
              activeTab === 'targeted'
                ? 'bg-teal-600 text-white'
                : 'bg-slate-800 border border-slate-700 text-slate-400 hover:text-white'
            }`}
          >
            🎯 Your Targets ({targetedCompanies.length})
          </button>
        </div>

        {/* Content */}
        <div className="space-y-6">
          {activeTab === 'recommended' && (
            <>
              {companies.length === 0 ? (
                <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-8 text-center">
                  <p className="text-slate-400">
                    Complete your profile to get personalized company recommendations based on your CGPA and skills.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {companies.map(company => (
                    <CompanyCard key={company._id} data={company} />
                  ))}
                </div>
              )}
            </>
          )}

          {activeTab === 'targeted' && (
            <>
              {targetedCompanies.length === 0 ? (
                <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-8 text-center">
                  <p className="text-slate-400">No targeted companies yet. Select companies from recommendations!</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {targetedCompanies.map(company => (
                    <CompanyCard key={company._id} data={company} />
                  ))}
                </div>
              )}
            </>
          )}
        </div>

        {/* Tips Card */}
        <div className="mt-12 bg-linear-to-r from-blue-900/30 to-purple-900/30 border border-blue-700/50 rounded-xl p-8">
          <h2 className="text-2xl font-bold text-blue-300 mb-4">💡 Targeting Strategy Tips</h2>
          <ul className="space-y-3 text-slate-300">
            <li className="flex gap-3">
              <span className="text-blue-400">→</span>
              <span>Target companies with CGPA cutoffs close to yours</span>
            </li>
            <li className="flex gap-3">
              <span className="text-blue-400">→</span>
              <span>Look at historical data - packages and number of roles offered</span>
            </li>
            <li className="flex gap-3">
              <span className="text-blue-400">→</span>
              <span>Consider both dream companies and realistic targets</span>
            </li>
            <li className="flex gap-3">
              <span className="text-blue-400">→</span>
              <span>Track interview rounds for each targeted company</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CompanyTargetingPage;
