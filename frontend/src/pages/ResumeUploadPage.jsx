import React, { useState, useContext, useRef } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const ResumeUploadPage = () => {
  const { token } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);
  const [job_desc, setJob_desc] = useState('');
  const fileInputRef= useRef(null);
   
  const API_URL = import.meta.env.VITE_API_URL;


  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file || !job_desc.trim()) {
      alert('Please select a file and enter a job description');
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('job_description', job_desc);
      formData.append('resume_pdf', file);

      await axios.post(`${API_URL}/resume/add`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      alert('Resume uploaded successfully!');
    } catch (error) {
      alert('Error uploading resume: ' + error.response?.data?.message);
    } finally {
      setLoading(false);
      setFile(null);
      setJob_desc("");
      if(fileInputRef.current){
        fileInputRef.current.value="";
      }
    }
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
              ref={fileInputRef}
              type="file"
              accept="application/pdf"
              name='resume_pdf'
              onChange={handleFileChange}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-slate-400"
            />
            <textarea
              placeholder="Paste your job description text here for analysis..."
              value={job_desc}
              name='job_description'
              onChange={(e) => setJob_desc(e.target.value)}
              rows="6"
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white"
            />
            <button
              type="submit"
              disabled={loading || (!file )|| (!job_desc.trim())}
              className="w-full bg-teal-600 hover:bg-teal-500 text-white font-bold py-3 rounded-xl transition duration-200 shadow-lg active:scale-95 disabled:opacity-50"
            >
              {loading ? 'Analyzing...' : 'Upload & Analyze Resume'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResumeUploadPage;
