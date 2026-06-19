import React, { useState } from 'react';

const InterviewPrepPage = () => {
  const [activeTab, setActiveTab] = useState('dsa');
  const [dsaTopics, setDsaTopics] = useState([
    { topic: 'Arrays', proficiency: 'intermediate', problems: 45 },
    { topic: 'LinkedList', proficiency: 'beginner', problems: 20 },
    { topic: 'Trees', proficiency: 'intermediate', problems: 35 },
    { topic: 'Graphs', proficiency: 'beginner', problems: 15 },
    { topic: 'Dynamic Programming', proficiency: 'beginner', problems: 25 },
    { topic: 'Sorting & Searching', proficiency: 'advanced', problems: 60 },
    { topic: 'Strings', proficiency: 'intermediate', problems: 40 },
    { topic: 'Hashing', proficiency: 'intermediate', problems: 30 }
  ]);


  const [experiences, setExperiences] = useState([
    {
      id: 1,
      company: 'Global Tech',
      role: 'Backend Developer',
      difficulty: 'medium',
      result: 'selected',
      topics: ['API Design', 'Database Optimization', 'System Architecture'],
      description: 'Three rounds including online test, technical, and HR round.'
    }
  ]);

  const getProficiencyColor = (level) => {
    switch (level) {
      case 'beginner':
        return 'bg-red-500/20 text-red-300 border-red-500/50';
      case 'intermediate':
        return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/50';
      case 'advanced':
        return 'bg-green-500/20 text-green-300 border-green-500/50';
      default:
        return 'bg-slate-500/20 text-slate-300 border-slate-500/50';
    }
  };

  const getResultColor = (result) => {
    switch (result) {
      case 'selected':
        return 'bg-green-500/20 text-green-300';
      case 'rejected':
        return 'bg-red-500/20 text-red-300';
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-300';
      default:
        return 'bg-slate-500/20 text-slate-300';
    }
  };

  const getDifficultyEmoji = (difficulty) => {
    switch (difficulty) {
      case 'easy':
        return '⭐';
      case 'medium':
        return '⭐⭐';
      case 'hard':
        return '⭐⭐⭐';
      default:
        return '';
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 to-slate-800 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8">Interview Preparation</h1>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 flex-wrap">
          <button
            onClick={() => setActiveTab('dsa')}
            className={`px-6 py-3 rounded-lg font-semibold transition ${
              activeTab === 'dsa'
                ? 'bg-teal-600 text-white'
                : 'bg-slate-800 border border-slate-700 text-slate-400 hover:text-white'
            }`}
          >
            📚 DSA Topics
          </button>
          <button
            onClick={() => setActiveTab('experiences')}
            className={`px-6 py-3 rounded-lg font-semibold transition ${
              activeTab === 'experiences'
                ? 'bg-teal-600 text-white'
                : 'bg-slate-800 border border-slate-700 text-slate-400 hover:text-white'
            }`}
          >
            💬 Interview Experiences
          </button>
        </div>

        {/* DSA Topics */}
        {activeTab === 'dsa' && (
          <div className="space-y-4">
            {dsaTopics.map(topic => (
              <div key={topic.topic} className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-white">{topic.topic}</h3>
                    <p className="text-slate-400 text-sm">Problems solved: {topic.problems}</p>
                  </div>
                  <span className={`px-4 py-2 rounded-full border text-sm font-semibold ${getProficiencyColor(topic.proficiency)}`}>
                    {topic.proficiency.charAt(0).toUpperCase() + topic.proficiency.slice(1)}
                  </span>
                </div>
                <div className="w-full bg-slate-900 rounded-full h-3">
                  <div
                    className={`h-3 rounded-full ${
                      topic.proficiency === 'beginner'
                        ? 'bg-red-500'
                        : topic.proficiency === 'intermediate'
                        ? 'bg-yellow-500'
                        : 'bg-green-500'
                    }`}
                    style={{ width: `${(topic.problems / 60) * 100}%` }}
                  />
                </div>
              </div>
            ))}

            <div className="bg-linear-to-r from-blue-900/30 to-purple-900/30 border border-blue-700/50 rounded-xl p-6 mt-8">
              <h3 className="text-xl font-bold text-blue-300 mb-4">📖 Popular DSA Resources</h3>
              <ul className="space-y-2 text-slate-300">
                <li className="flex gap-2">
                  <span className="text-blue-400">→</span>
                  <span><strong>LeetCode:</strong> 1500+ problems, daily challenges</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-blue-400">→</span>
                  <span><strong>GeeksforGeeks:</strong> Detailed topic explanations</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-blue-400">→</span>
                  <span><strong>InterviewBit:</strong> Company-specific questions</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-blue-400">→</span>
                  <span><strong>HackerRank:</strong> Competitive programming</span>
                </li>
              </ul>
            </div>
          </div>
        )}

        {/* Interview Experiences */}
        {activeTab === 'experiences' && (
          <div className="space-y-4">
            {experiences.length === 0 ? (
              <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-8 text-center">
                <p className="text-slate-400">No interview experiences shared yet. Share yours!</p>
              </div>
            ) : (
              experiences.map(exp => (
                <div key={exp.id} className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-white">{exp.company}</h3>
                      <p className="text-slate-400">{exp.role}</p>
                    </div>
                    <div className="flex gap-2">
                      <span className={`px-4 py-2 rounded-full text-sm font-semibold ${getResultColor(exp.result)}`}>
                        {exp.result.toUpperCase()}
                      </span>
                      <span className="bg-slate-900 px-4 py-2 rounded-full text-sm font-semibold text-slate-300">
                        {getDifficultyEmoji(exp.difficulty)}
                      </span>
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-slate-400 text-sm mb-2">Topics Covered:</p>
                    <div className="flex flex-wrap gap-2">
                      {exp.topics.map(topic => (
                        <span key={topic} className="bg-teal-500/20 text-teal-300 text-xs px-3 py-1 rounded-full">
                          {topic}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-700">
                    <p className="text-slate-300">{exp.description}</p>
                  </div>
                </div>
              ))
            )}

            <button className="w-full bg-teal-600 hover:bg-teal-500 text-white font-bold py-3 rounded-xl transition mt-4">
              + Share Interview Experience
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default InterviewPrepPage;
