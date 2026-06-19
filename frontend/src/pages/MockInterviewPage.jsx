import React from "react";
import { useState } from "react";

export const MockInterviewPage = ()=>{
    const [mockInterviews, setMockInterviews] = useState([
        {
          id: 1,
          company: 'Tech Corp',
          role: 'Software Engineer',
          date: '2024-03-15',
          score: 78,
          feedback: 'Good problem-solving skills. Work on communication.'
        },
        {
          id: 2,
          company: 'Innovation Inc',
          role: 'Data Engineer',
          date: '2024-03-10',
          score: 82,
          feedback: 'Excellent approach to system design questions.'
        }
      ]);

    return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 to-slate-800 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8">Mock Interview</h1>
          <div className="space-y-4">
            {mockInterviews.length === 0 ? (
              <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-8 text-center">
                <p className="text-slate-400">No mock interviews yet. Schedule your first one!</p>
              </div>
            ) : (
              mockInterviews.map(interview => (
                <div key={interview.id} className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-white">{interview.company}</h3>
                      <p className="text-slate-400">{interview.role}</p>
                      <p className="text-sm text-slate-500">Date: {new Date(interview.date).toLocaleDateString()}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold text-teal-400">{interview.score}%</div>
                      <p className="text-slate-400 text-sm">Performance Score</p>
                    </div>
                  </div>
                  <div className="pt-4 border-t border-slate-700">
                    <p className="text-slate-400 text-sm mb-2">Feedback:</p>
                    <p className="text-white">{interview.feedback}</p>
                  </div>
                </div>
              ))
            )}

            <button className="w-full bg-teal-600 hover:bg-teal-500 text-white font-bold py-3 rounded-xl transition mt-4">
              + Schedule New Mock Interview
            </button>
          </div>
      </div>
    </div>
  );
}