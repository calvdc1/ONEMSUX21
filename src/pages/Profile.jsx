import React from 'react';
import { User, Mail, MapPin, BookOpen, GraduationCap, Building2, Edit3, ShieldCheck, Camera } from 'lucide-react';

const Profile = () => {
  const user = {
    name: "Xander Camarin",
    email: "xandercamarin@gmail.com",
    campus: "MSU Main",
    studentId: "2022-0001",
    program: "BS Computer Science",
    yearLevel: "3rd Year",
    department: "College of Information Technology",
    bio: "Passionate about building community tools and exploring the future of tech in MSU.",
    avatar: "https://picsum.photos/seed/user/200/200",
    cover: "https://picsum.photos/seed/campus/1200/400",
    isVerified: true,
    isAdmin: true
  };

  return (
    <div className="space-y-8">
      {/* Header / Cover */}
      <div className="relative h-64 md:h-80 rounded-3xl overflow-hidden group shadow-lg shadow-gray-200">
        <img src={user.cover} alt="Cover" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" referrerPolicy="no-referrer" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
        <button className="absolute top-4 right-4 p-3 bg-white/20 backdrop-blur-md text-white rounded-xl hover:bg-white/30 transition-all">
          <Camera size={20} />
        </button>
      </div>

      {/* Profile Info */}
      <div className="relative -mt-24 px-8 pb-8 space-y-8">
        <div className="flex flex-col md:flex-row items-end gap-6">
          <div className="relative group">
            <img src={user.avatar} alt={user.name} className="w-40 h-40 rounded-3xl border-8 border-white shadow-xl object-cover" referrerPolicy="no-referrer" />
            <button className="absolute bottom-2 right-2 p-2 bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-700 transition-all">
              <Camera size={16} />
            </button>
          </div>
          <div className="flex-1 space-y-2 pb-2">
            <div className="flex items-center gap-3">
              <h2 className="text-4xl font-bold text-gray-900">{user.name}</h2>
              {user.isVerified && <ShieldCheck className="text-blue-600" size={28} />}
              {user.isAdmin && <span className="px-3 py-1 bg-blue-100 text-blue-600 text-[10px] font-bold rounded-full uppercase tracking-wider">Admin</span>}
            </div>
            <p className="text-gray-500 font-medium flex items-center gap-2">
              <MapPin size={18} className="text-blue-600" />
              {user.campus}
            </p>
          </div>
          <button className="bg-white border border-gray-200 text-gray-700 px-6 py-3 rounded-xl font-bold hover:bg-gray-50 transition-all flex items-center gap-2 shadow-sm">
            <Edit3 size={20} />
            Edit Profile
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left Column: Details */}
          <div className="md:col-span-1 space-y-6">
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 space-y-6">
              <h3 className="text-xl font-bold text-gray-900">About Me</h3>
              <p className="text-gray-600 leading-relaxed text-sm">{user.bio}</p>
              <div className="space-y-4 pt-4 border-t border-gray-50">
                <div className="flex items-center gap-3 text-gray-500">
                  <Mail size={18} className="text-blue-600" />
                  <span className="text-sm font-medium">{user.email}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-500">
                  <GraduationCap size={18} className="text-blue-600" />
                  <span className="text-sm font-medium">{user.studentId}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-500">
                  <BookOpen size={18} className="text-blue-600" />
                  <span className="text-sm font-medium">{user.program}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-500">
                  <Building2 size={18} className="text-blue-600" />
                  <span className="text-sm font-medium">{user.department}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Activity */}
          <div className="md:col-span-2 space-y-6">
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold text-gray-900">Recent Activity</h3>
                <button className="text-blue-600 text-sm font-bold hover:underline">View All</button>
              </div>
              <div className="space-y-4">
                {[
                  { type: "post", content: "Just posted on Freedom Wall", time: "2 hours ago" },
                  { type: "group", content: "Joined MSU Main Debate Society", time: "1 day ago" },
                  { type: "lost", content: "Reported a lost item", time: "3 days ago" }
                ].map((activity, i) => (
                  <div key={i} className="flex items-center gap-4 p-4 rounded-2xl bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer">
                    <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center">
                      <User size={20} />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-bold text-gray-800">{activity.content}</p>
                      <span className="text-xs text-gray-400">{activity.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
