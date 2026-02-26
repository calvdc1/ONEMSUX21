import React, { useState } from 'react';
import { Send, MessageSquare, ShieldCheck, Clock, AlertCircle } from 'lucide-react';

const Feedbacks = () => {
  const [feedbacks, setFeedbacks] = useState([
    { id: 1, content: "The new messenger feature is great! Very helpful for group projects.", status: "reviewed", time: "2 days ago" },
    { id: 2, content: "Can we have a dark mode option for the freedom wall?", status: "pending", time: "5 hours ago" },
    { id: 3, content: "Found a bug in the lost and found image upload.", status: "resolved", time: "1 week ago" },
  ]);

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <header className="space-y-1">
        <h2 className="text-3xl font-bold text-gray-900">Feedbacks</h2>
        <p className="text-gray-500">Help us improve the OneMSU experience.</p>
      </header>

      {/* Submit Feedback */}
      <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 space-y-6">
        <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-2xl border border-blue-100 text-blue-700">
          <AlertCircle size={24} />
          <p className="text-sm font-medium">Your feedback is anonymous unless you choose to include your name.</p>
        </div>
        
        <div className="space-y-4">
          <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">Your Message</label>
          <textarea 
            placeholder="Tell us what's on your mind..." 
            className="w-full min-h-[150px] p-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 resize-none text-gray-800"
          />
        </div>

        <button className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold hover:bg-blue-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-200">
          Submit Feedback
          <Send size={20} />
        </button>
      </div>

      {/* Recent Feedbacks */}
      <div className="space-y-6">
        <h3 className="text-xl font-bold text-gray-900">Your Recent Submissions</h3>
        <div className="space-y-4">
          {feedbacks.map((fb) => (
            <div key={fb.id} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex gap-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                fb.status === 'resolved' ? 'bg-green-100 text-green-600' : 
                fb.status === 'reviewed' ? 'bg-blue-100 text-blue-600' : 'bg-amber-100 text-amber-600'
              }`}>
                <MessageSquare size={24} />
              </div>
              <div className="flex-1 space-y-2">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full ${
                      fb.status === 'resolved' ? 'bg-green-50 text-green-600' : 
                      fb.status === 'reviewed' ? 'bg-blue-50 text-blue-600' : 'bg-amber-50 text-amber-600'
                    }`}>
                      {fb.status}
                    </span>
                    <span className="text-xs text-gray-400 font-medium">{fb.time}</span>
                  </div>
                </div>
                <p className="text-sm text-gray-700 leading-relaxed">{fb.content}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Feedbacks;
