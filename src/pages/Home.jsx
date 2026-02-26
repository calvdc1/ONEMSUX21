import React from 'react';
import { motion } from 'motion/react';
import { MessageSquare, Heart, Search, Users, MapPin } from 'lucide-react';

const Home = () => {
  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <h2 className="text-3xl font-bold text-gray-900">Welcome to OneMSU</h2>
        <p className="text-gray-500">Your all-in-one campus community platform.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Quick Access Cards */}
        <motion.div 
          whileHover={{ y: -5 }}
          className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4"
        >
          <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center">
            <MessageSquare size={24} />
          </div>
          <h3 className="text-xl font-semibold">Messenger</h3>
          <p className="text-gray-500 text-sm">Connect with fellow students and faculty members in real-time.</p>
        </motion.div>

        <motion.div 
          whileHover={{ y: -5 }}
          className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4"
        >
          <div className="w-12 h-12 bg-red-100 text-red-600 rounded-xl flex items-center justify-center">
            <Heart size={24} />
          </div>
          <h3 className="text-xl font-semibold">Freedom Wall</h3>
          <p className="text-gray-500 text-sm">Share your thoughts anonymously and connect with the campus vibe.</p>
        </motion.div>

        <motion.div 
          whileHover={{ y: -5 }}
          className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4"
        >
          <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-xl flex items-center justify-center">
            <Search size={24} />
          </div>
          <h3 className="text-xl font-semibold">Lost & Found</h3>
          <p className="text-gray-500 text-sm">Help others find their lost items or report something you found.</p>
        </motion.div>
      </div>

      <section className="bg-blue-600 rounded-3xl p-8 text-white flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="space-y-4">
          <h2 className="text-3xl font-bold">Join Campus Groups</h2>
          <p className="text-blue-100">Find and join clubs, academic societies, and interest groups across all MSU campuses.</p>
          <button className="bg-white text-blue-600 px-6 py-3 rounded-xl font-bold hover:bg-blue-50 transition-colors">
            Explore Groups
          </button>
        </div>
        <div className="flex -space-x-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="w-16 h-16 rounded-full border-4 border-blue-600 bg-gray-200 overflow-hidden">
              <img src={`https://picsum.photos/seed/${i}/100/100`} alt="User" referrerPolicy="no-referrer" />
            </div>
          ))}
          <div className="w-16 h-16 rounded-full border-4 border-blue-600 bg-blue-500 flex items-center justify-center font-bold">
            +50
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 space-y-6">
          <h3 className="text-2xl font-bold flex items-center gap-2">
            <MapPin className="text-blue-600" />
            Campus Updates
          </h3>
          <div className="space-y-4">
            {[
              { title: "MSU Main: Midterm Exams Schedule", date: "2 hours ago" },
              { title: "MSU IIT: Tech Summit 2026", date: "5 hours ago" },
              { title: "MSU Gensan: Cultural Festival", date: "1 day ago" }
            ].map((update, i) => (
              <div key={i} className="flex justify-between items-center p-4 rounded-2xl bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer">
                <span className="font-medium text-gray-800">{update.title}</span>
                <span className="text-xs text-gray-400">{update.date}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 space-y-6">
          <h3 className="text-2xl font-bold flex items-center gap-2">
            <Users className="text-blue-600" />
            Active Discussions
          </h3>
          <div className="space-y-4">
            {[
              { title: "Best study spots in MSU Naawan?", replies: 12 },
              { title: "MSU Tawi-Tawi: Oceanic Research Circle", replies: 8 },
              { title: "General: Enrollment Tips for 2026", replies: 45 }
            ].map((discussion, i) => (
              <div key={i} className="flex justify-between items-center p-4 rounded-2xl bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer">
                <span className="font-medium text-gray-800">{discussion.title}</span>
                <div className="flex items-center gap-1 text-xs text-blue-600 font-bold">
                  <MessageSquare size={14} />
                  {discussion.replies}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
