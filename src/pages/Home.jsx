import React from 'react';
import { motion } from 'motion/react';
import { MessageSquare, Heart, Search, Users, MapPin, ArrowRight, Sparkles, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="relative h-[400px] rounded-[40px] overflow-hidden hero-metallic flex items-center px-12 border border-white/10 shadow-2xl">
        <div className="max-w-2xl space-y-6 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-xs font-bold uppercase tracking-widest text-[#b99740]"
          >
            <Sparkles size={14} />
            The Official MSU Network
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-6xl font-black tracking-tighter leading-[0.9] text-white"
          >
            One Vision. <br />
            <span className="text-metallic-gold">One MSU.</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-white/60 font-medium max-w-lg leading-relaxed"
          >
            Connecting all 11 campuses across Mindanao. Empowering the MSUan community with a unified digital experience.
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex gap-4"
          >
            <Link to="/explorer" className="px-8 py-4 bg-[#b99740] text-black font-black rounded-2xl hover:scale-105 transition-all shadow-xl shadow-gold/20 flex items-center gap-2">
              Explore Network
              <ArrowRight size={20} />
            </Link>
            <button className="px-8 py-4 bg-white/5 backdrop-blur-md border border-white/10 text-white font-bold rounded-2xl hover:bg-white/10 transition-all">
              Learn More
            </button>
          </motion.div>
        </div>

        {/* Floating Elements */}
        <div className="absolute right-12 top-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-to-br from-[#b99740]/20 to-transparent rounded-full blur-3xl animate-pulse" />
      </section>

      {/* Quick Access Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { title: "Messenger", desc: "Real-time campus communication", icon: MessageSquare, color: "blue", path: "/messenger" },
          { title: "Freedom Wall", desc: "Share anonymously with the tribe", icon: Heart, color: "maroon", path: "/freedomwall" },
          { title: "Lost & Found", desc: "Community-driven item recovery", icon: Search, color: "gold", path: "/lostfound" }
        ].map((item, i) => (
          <Link key={i} to={item.path}>
            <motion.div 
              whileHover={{ y: -10 }}
              className="card-gold p-8 rounded-[32px] space-y-6 group cursor-pointer"
            >
              <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center text-[#b99740] group-hover:bg-[#b99740] group-hover:text-black transition-all duration-500">
                <item.icon size={28} />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-bold tracking-tight text-white">{item.title}</h3>
                <p className="text-sm text-white/40 font-medium leading-relaxed">{item.desc}</p>
              </div>
              <div className="pt-4 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#b99740] opacity-0 group-hover:opacity-100 transition-opacity">
                Enter Module <ArrowRight size={12} />
              </div>
            </motion.div>
          </Link>
        ))}
      </div>

      {/* Campus Updates & Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="glass-surface p-10 rounded-[40px] space-y-8">
          <div className="flex justify-between items-center">
            <h3 className="text-2xl font-bold flex items-center gap-3">
              <MapPin className="text-[#b99740]" size={24} />
              Campus Network
            </h3>
            <span className="text-[10px] font-black uppercase tracking-widest text-white/30">Live Updates</span>
          </div>
          <div className="space-y-4">
            {[
              { campus: "MSU Main", event: "Midterm Exams Schedule Released", time: "2h ago", type: "Academic" },
              { campus: "MSU IIT", event: "Tech Summit 2026 Registration", time: "5h ago", type: "Event" },
              { campus: "MSU Gensan", event: "Cultural Festival Highlights", time: "1d ago", type: "Cultural" }
            ].map((update, i) => (
              <div key={i} className="flex items-center gap-6 p-5 rounded-3xl bg-white/5 hover:bg-white/10 transition-all cursor-pointer border border-white/5 group">
                <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-white/40 group-hover:text-[#b99740] transition-colors">
                  <ShieldCheck size={20} />
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black uppercase tracking-widest text-[#b99740]">{update.campus}</span>
                    <span className="text-[10px] text-white/20">•</span>
                    <span className="text-[10px] font-bold text-white/20 uppercase tracking-widest">{update.type}</span>
                  </div>
                  <p className="font-bold text-white/80 group-hover:text-white transition-colors">{update.event}</p>
                </div>
                <span className="text-[10px] font-bold text-white/20">{update.time}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-surface p-10 rounded-[40px] space-y-8">
          <div className="flex justify-between items-center">
            <h3 className="text-2xl font-bold flex items-center gap-3">
              <Users className="text-[#b99740]" size={24} />
              Community Pulse
            </h3>
            <span className="text-[10px] font-black uppercase tracking-widest text-white/30">Trending</span>
          </div>
          <div className="space-y-4">
            {[
              { title: "Best study spots in MSU Naawan?", replies: 12, author: "Anon-XJ9" },
              { title: "MSU Tawi-Tawi: Oceanic Research Circle", replies: 8, author: "MarineBio" },
              { title: "General: Enrollment Tips for 2026", replies: 45, author: "Admin" }
            ].map((discussion, i) => (
              <div key={i} className="flex items-center justify-between p-5 rounded-3xl bg-white/5 hover:bg-white/10 transition-all cursor-pointer border border-white/5 group">
                <div className="space-y-1">
                  <p className="font-bold text-white/80 group-hover:text-white transition-colors">{discussion.title}</p>
                  <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest">Started by {discussion.author}</p>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 text-[#b99740] font-black text-xs">
                  <MessageSquare size={14} />
                  {discussion.replies}
                </div>
              </div>
            ))}
          </div>
          <button className="w-full py-4 bg-white/5 border border-white/10 rounded-2xl font-bold text-sm hover:bg-white/10 transition-all">
            View All Discussions
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
