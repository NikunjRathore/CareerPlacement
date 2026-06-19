import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const ResumeUploadPage = () => {
  const { user, token } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [resume, setResume] = useState(null);
  const [file, setFile] = useState(null);
  const [atsDetails, setAtsDetails] = useState(null);
  const [extractedText, setExtractedText] = useState('');

  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    fetchResume();
  }, []);

  const fetchResume = async () => {
    try {
      const res = await axios.get(`${API_URL}/resume`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setResume(res.data);
      fetchATSDetails();
    } catch (error) {
      console.log('No resume uploaded yet');
    }
  };

  const fetchATSDetails = async () => {
    try {
      const res = await axios.get(`${API_URL}/resume/ats/details`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAtsDetails(res.data);
    } catch (error) {
      console.log('ATS details not available');
    }
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      alert('Please select a file');
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('extracted_text', extractedText);
      formData.append('filename', file.name);

      const res = await axios.post(`${API_URL}/resume`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      setResume(res.data);
      setFile(null);
      setAtsDetails({
        ats_score: res.data.ats_score,
        score_breakdown: res.data.score_breakdown,
        keywords_found: res.data.keywords_found.length,
        total_keywords: 22,
        suggestions: res.data.suggestions,
        sections: res.data.sections
      });
      alert('Resume uploaded successfully!');
    } catch (error) {
      alert('Error uploading resume: ' + error.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 75) return 'text-green-400';
    if (score >= 50) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 to-slate-800 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8">Resume Manager</h1>

        {/* Upload Section */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-8 mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">Upload Your Resume</h2>
          <form onSubmit={handleUpload} className="space-y-4">
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={handleFileChange}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-slate-400"
            />
            <textarea
              placeholder="Or paste your resume text here for analysis..."
              value={extractedText}
              onChange={(e) => setExtractedText(e.target.value)}
              rows="6"
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white"
            />
            <button
              type="submit"
              disabled={loading || (!file && !extractedText)}
              className="w-full bg-teal-600 hover:bg-teal-500 text-white font-bold py-3 rounded-xl transition duration-200 shadow-lg active:scale-95 disabled:opacity-50"
            >
              {loading ? 'Analyzing...' : 'Upload & Analyze Resume'}
            </button>
          </form>
        </div>

        {/* ATS Score Display */}
        {atsDetails && (
          <div className="space-y-8">
            {/* Main Score */}
            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">ATS Score</h2>
                <div className={`text-5xl font-bold ${getScoreColor(atsDetails.ats_score)}`}>
                  {atsDetails.ats_score}
                </div>
              </div>
              <p className="text-slate-400">
                {atsDetails.ats_score >= 75
                  ? '✓ Your resume is ATS-friendly!'
                  : atsDetails.ats_score >= 50
                  ? '△ Your resume needs some improvements'
                  : '✗ Your resume needs significant improvements'}
              </p>
            </div>

            {/* Score Breakdown */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
                <p className="text-slate-400 text-sm">Format Score</p>
                <p className="text-3xl font-bold text-blue-400">{atsDetails.score_breakdown?.format_score || 0}/20</p>
              </div>
              <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
                <p className="text-slate-400 text-sm">Keyword Score</p>
                <p className="text-3xl font-bold text-purple-400">{atsDetails.score_breakdown?.keyword_score || 0}/30</p>
              </div>
              <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
                <p className="text-slate-400 text-sm">Content Score</p>
                <p className="text-3xl font-bold text-green-400">{atsDetails.score_breakdown?.content_score || 0}/30</p>
              </div>
              <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
                <p className="text-slate-400 text-sm">Sections Score</p>
                <p className="text-3xl font-bold text-orange-400">{atsDetails.score_breakdown?.sections_score || 0}/20</p>
              </div>
            </div>

            {/* Keywords Found */}
            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
              <h3 className="text-xl font-bold text-white mb-4">
                Keywords Found: {atsDetails.keywords_found}/{atsDetails.total_keywords}
              </h3>
              <div className="w-full bg-slate-900 rounded-full h-2">
                <div
                  className="bg-teal-500 h-2 rounded-full"
                  style={{ width: `${(atsDetails.keywords_found / atsDetails.total_keywords) * 100}%` }}
                />
              </div>
            </div>

            {/* Sections Checklist */}
            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
              <h3 className="text-xl font-bold text-white mb-4">Resume Sections</h3>
              <div className="space-y-2">
                {Object.entries(atsDetails.sections).map(([key, value]) => (
                  <div key={key} className="flex items-center gap-3">
                    <span className={value ? 'text-green-400' : 'text-red-400'}>
                      {value ? '✓' : '✗'}
                    </span>
                    <span className="text-white capitalize">{key.replace('has_', '').replace(/_/g, ' ')}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Suggestions */}
            {atsDetails.suggestions && atsDetails.suggestions.length > 0 && (
              <div className="bg-slate-800/50 border border-yellow-700/50 rounded-xl p-6">
                <h3 className="text-xl font-bold text-yellow-400 mb-4">📝 Improvement Suggestions</h3>
                <ul className="space-y-2">
                  {atsDetails.suggestions.map((suggestion, idx) => (
                    <li key={idx} className="text-slate-300 flex items-start gap-3">
                      <span className="text-yellow-400 mt-1">•</span>
                      <span>{suggestion}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ResumeUploadPage;
