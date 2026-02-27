import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Search, Plus, MapPin, Tag, Calendar, CheckCircle2, Clock, Filter, ArrowUpRight, Sparkles } from 'lucide-react';

const LostFound = () => {
  const [items, setItems] = useState([
    { id: 1, type: "lost", title: "Blue Hydroflask", description: "Lost near the MSU Main library. Has a MSU sticker.", campus: "MSU Main", date: "Oct 24, 2026", status: "pending", image: "https://picsum.photos/seed/bottle/400/300" },
    { id: 2, type: "found", title: "Scientific Calculator", description: "Found in Room 302, Engineering Building. Casio brand.", campus: "MSU IIT", date: "Oct 23, 2026", status: "resolved", image: "https://picsum.photos/seed/calc/400/300" },
    { id: 3, type: "lost", title: "Keys with Keychain", description: "Lost my keys with a small teddy bear keychain.", campus: "MSU Gensan", date: "Oct 22, 2026", status: "pending", image: "https://picsum.photos/seed/keys/400/300" },
  ]);

  return (
    <div className="space-y-12">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-[#b99740]">
            <Sparkles size={14} />
            Community Support
          </div>
          <h2 className="text-5xl font-black tracking-tighter text-white">Lost & Found</h2>
          <p className="text-white/40 font-medium">Helping MSUans recover their belongings through community vigilance.</p>
        </div>
        <button className="bg-[#b99740] text-black px-8 py-4 rounded-2xl font-black hover:scale-105 transition-all flex items-center gap-3 shadow-xl shadow-gold/20">
          <Plus size={20} />
          Report Item
        </button>
      </header>

      {/* Search & Filter */}
      <div className="glass-surface p-4 rounded-[32px] border border-white/10 flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative group">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-[#b99740] transition-colors" size={20} />
          <input 
            type="text" 
            placeholder="Search for lost items..." 
            className="w-full pl-14 pr-6 py-4 bg-white/5 border border-white/5 rounded-2xl focus:ring-2 focus:ring-[#b99740] outline-none text-sm text-white placeholder:text-white/20 transition-all"
          />
        </div>
        <div className="flex gap-4 overflow-x-auto scrollbar-hide">
          <button className="px-8 py-4 bg-[#b99740] text-black rounded-2xl text-sm font-black whitespace-nowrap shadow-xl shadow-gold/10">All Items</button>
          <button className="px-8 py-4 bg-white/5 border border-white/5 text-white/40 rounded-2xl text-sm font-bold hover:text-white hover:bg-white/10 transition-all whitespace-nowrap">Lost</button>
          <button className="px-8 py-4 bg-white/5 border border-white/5 text-white/40 rounded-2xl text-sm font-bold hover:text-white hover:bg-white/10 transition-all whitespace-nowrap">Found</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {items.map((item) => (
          <motion.div 
            key={item.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ y: -10 }}
            className="card-gold rounded-[40px] overflow-hidden group"
          >
            <div className="relative h-64 overflow-hidden">
              <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" referrerPolicy="no-referrer" />
              <div className="absolute top-6 left-6">
                <span className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl ${
                  item.type === 'lost' ? 'bg-red-500 text-white' : 'bg-green-500 text-white'
                }`}>
                  {item.type}
                </span>
              </div>
            </div>
            <div className="p-8 space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between items-start">
                  <h3 className="text-2xl font-bold text-white tracking-tight">{item.title}</h3>
                  <ArrowUpRight size={20} className="text-white/20 group-hover:text-[#b99740] transition-colors" />
                </div>
                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#b99740]">
                  <MapPin size={12} />
                  {item.campus}
                </div>
              </div>
              
              <p className="text-sm text-white/40 font-medium leading-relaxed line-clamp-2">{item.description}</p>
              
              <div className="pt-6 border-t border-white/5 flex justify-between items-center">
                <div className="flex items-center gap-2 text-[10px] text-white/20 font-bold uppercase tracking-widest">
                  <Calendar size={14} />
                  {item.date}
                </div>
                <div className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-widest ${item.status === 'resolved' ? 'text-green-500' : 'text-[#b99740]'}`}>
                  {item.status === 'resolved' ? <CheckCircle2 size={14} /> : <Clock size={14} />}
                  {item.status}
                </div>
              </div>

              <button className="w-full py-4 bg-white/5 border border-white/5 rounded-2xl font-bold text-sm hover:bg-[#b99740] hover:text-black transition-all">
                View Details
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default LostFound;
