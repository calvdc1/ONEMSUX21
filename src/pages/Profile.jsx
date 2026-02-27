import React from 'react';
import { User, Mail, MapPin, BookOpen, GraduationCap, Building2, Edit3, ShieldCheck, Camera, Sparkles, Bell, Globe } from 'lucide-react';
import { motion } from 'motion/react';

const Profile = () => {
  const user = {
    name: "Xander Camarin",
    email: "xandercamarin@gmail.com",
    campus: "MSU Main",
    studentId: "2022-0001",
    program: "BS Computer Science",
    yearLevel: "3rd Year",
    department: "College of Information Technology",
    bio: "Passionate about building community tools and exploring the future of tech in MSU. Lead developer of OneMSU platform.",
    avatar: "https://picsum.photos/seed/user/200/200",
    cover: "https://picsum.photos/seed/campus/1200/400",
    isVerified: true,
    isAdmin: true
  };

  return (
    <div className="space-y-12 pb-20">
      {/* Header / Cover */}
      <div className="relative h-80 md:h-[400px] rounded-[48px] overflow-hidden group shadow-2xl border border-white/10">
        <img src={user.cover} alt="Cover" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" referrerPolicy="no-referrer" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0502] via-transparent to-transparent"></div>
        <div className="absolute top-8 right-8 flex gap-3">
          <button className="p-4 bg-white/10 backdrop-blur-md border border-white/10 text-white rounded-2xl hover:bg-white/20 transition-all">
            <Camera size={20} />
          </button>
        </div>
      </div>

      {/* Profile Info */}
      <div className="relative -mt-32 px-12 space-y-12">
        <div className="flex flex-col md:flex-row items-end gap-10">
          <div className="relative group">
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="relative"
            >
              <img src={user.avatar} alt={user.name} className="w-48 h-48 rounded-[40px] border-[12px] border-[#0a0502] shadow-2xl object-cover" referrerPolicy="no-referrer" />
              <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-[#b99740] text-black rounded-2xl flex items-center justify-center shadow-xl shadow-gold/20 border-4 border-[#0a0502] hover:scale-110 transition-transform cursor-pointer">
                <Camera size={20} />
              </div>
            </motion.div>
          </div>
          <div className="flex-1 space-y-4 pb-4">
            <div className="flex items-center gap-4">
              <h2 className="text-6xl font-black tracking-tighter text-white">{user.name}</h2>
              {user.isVerified && <ShieldCheck className="text-[#b99740]" size={32} />}
            </div>
            <div className="flex flex-wrap gap-4 items-center">
              <div className="px-4 py-2 bg-white/5 border border-white/5 rounded-xl flex items-center gap-2 text-xs font-bold text-white/60">
                <MapPin size={14} className="text-[#b99740]" />
                {user.campus}
              </div>
              {user.isAdmin && (
                <div className="px-4 py-2 bg-[#b99740]/10 border border-[#b99740]/20 text-[#b99740] text-[10px] font-black rounded-xl uppercase tracking-widest">
                  System Administrator
                </div>
              )}
              <div className="px-4 py-2 bg-white/5 border border-white/5 rounded-xl flex items-center gap-2 text-xs font-bold text-white/60">
                <Globe size={14} className="text-[#b99740]" />
                Network Verified
              </div>
            </div>
          </div>
          <button className="bg-[#b99740] text-black px-10 py-5 rounded-[24px] font-black hover:scale-105 transition-all flex items-center gap-3 shadow-xl shadow-gold/20">
            <Edit3 size={20} />
            Edit Profile
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Left Column: Details */}
          <div className="lg:col-span-1 space-y-8">
            <div className="glass-surface p-10 rounded-[48px] border border-white/10 space-y-8">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-[#b99740]">
                  <Sparkles size={14} />
                  Identity
                </div>
                <h3 className="text-2xl font-bold text-white tracking-tight">About Me</h3>
              </div>
              <p className="text-white/40 leading-relaxed font-medium">{user.bio}</p>
              <div className="space-y-6 pt-8 border-t border-white/5">
                <div className="flex items-center gap-4 text-white/60">
                  <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-[#b99740]">
                    <Mail size={18} />
                  </div>
                  <span className="text-sm font-bold">{user.email}</span>
                </div>
                <div className="flex items-center gap-4 text-white/60">
                  <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-[#b99740]">
                    <GraduationCap size={18} />
                  </div>
                  <span className="text-sm font-bold">{user.studentId}</span>
                </div>
                <div className="flex items-center gap-4 text-white/60">
                  <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-[#b99740]">
                    <BookOpen size={18} />
                  </div>
                  <span className="text-sm font-bold">{user.program}</span>
                </div>
                <div className="flex items-center gap-4 text-white/60">
                  <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-[#b99740]">
                    <Building2 size={18} />
                  </div>
                  <span className="text-sm font-bold">{user.department}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Activity */}
          <div className="lg:col-span-2 space-y-8">
            <div className="glass-surface p-10 rounded-[48px] border border-white/10 space-y-8">
              <div className="flex justify-between items-center">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-[#b99740]">
                    <Bell size={14} />
                    Activity Log
                  </div>
                  <h3 className="text-2xl font-bold text-white tracking-tight">Recent Network Activity</h3>
                </div>
                <button className="text-[#b99740] text-xs font-black uppercase tracking-widest hover:underline">View All History</button>
              </div>
              <div className="space-y-4">
                {[
                  { type: "post", content: "Broadcasted a new post on Freedom Wall", time: "2 hours ago", campus: "MSU Main" },
                  { type: "group", content: "Joined MSU Main Debate Society", time: "1 day ago", campus: "MSU Main" },
                  { type: "lost", content: "Reported a lost Blue Hydroflask", time: "3 days ago", campus: "MSU Main" }
                ].map((activity, i) => (
                  <div key={i} className="flex items-center gap-6 p-6 rounded-[32px] bg-white/5 hover:bg-white/10 transition-all cursor-pointer border border-white/5 group">
                    <div className="w-14 h-14 bg-white/5 text-[#b99740] rounded-2xl flex items-center justify-center group-hover:bg-[#b99740] group-hover:text-black transition-all">
                      <User size={24} />
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="text-lg font-bold text-white/80 group-hover:text-white transition-colors">{activity.content}</p>
                      <div className="flex items-center gap-3">
                        <span className="text-[10px] font-black uppercase tracking-widest text-[#b99740]">{activity.campus}</span>
                        <span className="text-[10px] text-white/20 font-bold uppercase tracking-widest">{activity.time}</span>
                      </div>
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
