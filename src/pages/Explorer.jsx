import React from 'react';
import { Search, Users, MapPin, Globe, TrendingUp, Star, Filter, ArrowUpRight, Sparkles, ShieldCheck } from 'lucide-react';
import { motion } from 'motion/react';

const Explorer = () => {
  const groups = [
    { id: 1, name: "MSU Main Debate Society", members: 156, campus: "MSU Main", category: "Clubs", image: "https://picsum.photos/seed/debate/400/300" },
    { id: 2, name: "IIT Tech Innovators", members: 89, campus: "MSU IIT", category: "Technology", image: "https://picsum.photos/seed/tech/400/300" },
    { id: 3, name: "Gensan Arts Guild", members: 124, campus: "MSU Gensan", category: "Arts", image: "https://picsum.photos/seed/arts/400/300" },
    { id: 4, name: "Naawan Marine Society", members: 67, campus: "MSU Naawan", category: "Science", image: "https://picsum.photos/seed/marine/400/300" },
  ];

  return (
    <div className="space-y-12">
      <header className="space-y-6">
        <div className="flex justify-between items-end">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-[#b99740]">
              <Sparkles size={14} />
              Network Discovery
            </div>
            <h2 className="text-5xl font-black tracking-tighter text-white">Explorer</h2>
            <p className="text-white/40 font-medium max-w-xl">Discover elite groups, academic societies, and cultural communities across the MSU network.</p>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative group">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-[#b99740] transition-colors" size={20} />
            <input 
              type="text" 
              placeholder="Search groups, clubs, or interests..." 
              className="w-full pl-14 pr-6 py-5 bg-white/5 border border-white/5 rounded-[24px] focus:ring-2 focus:ring-[#b99740] outline-none text-white placeholder:text-white/20 transition-all"
            />
          </div>
          <button className="px-8 py-5 bg-white/5 border border-white/5 rounded-[24px] flex items-center gap-3 text-white/60 font-bold hover:text-white hover:bg-white/10 transition-all">
            <Filter size={20} />
            Filters
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
        {/* Sidebar Filters */}
        <div className="lg:col-span-1 space-y-8">
          <div className="glass-surface p-8 rounded-[40px] border border-white/10 space-y-8">
            <h3 className="text-lg font-bold text-white flex items-center gap-3">
              <TrendingUp size={18} className="text-[#b99740]" />
              Trending
            </h3>
            <div className="space-y-2">
              {["Academic", "Cultural", "Sports", "Technology", "Religious", "Social"].map((cat) => (
                <button key={cat} className="w-full text-left px-5 py-3 rounded-2xl text-sm font-bold text-white/40 hover:bg-white/5 hover:text-[#b99740] transition-all">
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="hero-metallic p-8 rounded-[40px] border border-white/10 text-white space-y-6 shadow-2xl">
            <Globe size={32} className="text-[#b99740]" />
            <h3 className="text-xl font-black tracking-tight">Campus Network</h3>
            <p className="text-white/60 text-sm font-medium leading-relaxed">Connect with students from all 11 MSU campuses across Mindanao.</p>
            <button className="w-full py-4 bg-white/10 backdrop-blur-md rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-white/20 transition-all">
              Join Global Feed
            </button>
          </div>
        </div>

        {/* Main Grid */}
        <div className="lg:col-span-3 space-y-8">
          <div className="flex justify-between items-center">
            <h3 className="text-2xl font-bold text-white tracking-tight">Recommended Communities</h3>
            <div className="flex gap-2">
              <button className="w-10 h-10 bg-white/5 border border-white/5 rounded-xl text-white/20 hover:text-[#b99740] transition-all flex items-center justify-center">
                <Star size={18} />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {groups.map((group) => (
              <motion.div 
                key={group.id}
                whileHover={{ y: -10 }}
                className="card-gold rounded-[40px] overflow-hidden group flex flex-col"
              >
                <div className="relative h-52 overflow-hidden">
                  <img src={group.image} alt={group.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" referrerPolicy="no-referrer" />
                  <div className="absolute top-6 right-6 px-4 py-2 bg-black/40 backdrop-blur-md border border-white/10 rounded-xl text-[10px] font-black text-[#b99740] uppercase tracking-widest">
                    {group.category}
                  </div>
                </div>
                <div className="p-8 flex-1 flex flex-col justify-between space-y-6">
                  <div className="space-y-3">
                    <div className="flex justify-between items-start">
                      <h4 className="text-2xl font-bold text-white leading-tight tracking-tight">{group.name}</h4>
                      <ArrowUpRight size={20} className="text-white/20 group-hover:text-[#b99740] transition-colors" />
                    </div>
                    <div className="flex items-center gap-6 text-[10px] text-white/30 font-black uppercase tracking-widest">
                      <div className="flex items-center gap-2">
                        <Users size={14} className="text-[#b99740]" />
                        {group.members} members
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin size={14} className="text-[#b99740]" />
                        {group.campus}
                      </div>
                    </div>
                  </div>
                  <button className="w-full py-4 bg-white/5 border border-white/5 text-white/60 rounded-2xl font-black text-sm hover:bg-[#b99740] hover:text-black transition-all flex items-center justify-center gap-2">
                    <ShieldCheck size={18} />
                    Join Community
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Explorer;
