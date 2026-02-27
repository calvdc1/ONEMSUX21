import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Heart, MessageCircle, Share2, MoreHorizontal, Image as ImageIcon, Send, Sparkles, ShieldAlert } from 'lucide-react';

const FreedomWall = () => {
  const [posts, setPosts] = useState([
    { id: 1, alias: "Anon-XJ9", content: "Just passed my midterms! MSU Main library is my second home now. 📚✨", likes: 24, replies: 5, time: "2h ago", campus: "MSU Main" },
    { id: 2, alias: "Anon-K22", content: "Anyone know where the best coffee is near MSU IIT? Need caffeine for this coding project. ☕️", likes: 12, replies: 8, time: "4h ago", campus: "MSU IIT" },
    { id: 3, alias: "Anon-P01", content: "The sunset at MSU Naawan today was absolutely breathtaking. We are so lucky to study here. 🌅", likes: 56, replies: 3, time: "6h ago", campus: "MSU Naawan" },
  ]);

  return (
    <div className="max-w-3xl mx-auto space-y-12">
      <header className="flex justify-between items-end">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-[#b99740]">
            <Sparkles size={14} />
            Anonymous Feed
          </div>
          <h2 className="text-5xl font-black tracking-tighter text-white">Freedom Wall</h2>
          <p className="text-white/40 font-medium">Speak your truth. Connect with the campus soul.</p>
        </div>
        <div className="flex gap-3">
          <select className="bg-white/5 border border-white/10 rounded-2xl px-6 py-3 text-sm font-bold text-white focus:ring-2 focus:ring-[#b99740] outline-none transition-all">
            <option className="bg-[#0d0703]">All Campuses</option>
            <option className="bg-[#0d0703]">MSU Main</option>
            <option className="bg-[#0d0703]">MSU IIT</option>
            <option className="bg-[#0d0703]">MSU Gensan</option>
          </select>
        </div>
      </header>

      {/* Create Post */}
      <div className="glass-surface p-8 rounded-[40px] border border-white/10 space-y-6 shadow-2xl">
        <div className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/5">
          <ShieldAlert size={20} className="text-[#b99740]" />
          <p className="text-xs font-bold text-white/40 uppercase tracking-wider">Posts are anonymous. Please follow community guidelines.</p>
        </div>
        <textarea 
          placeholder="What's on your mind, MSUan?" 
          className="w-full min-h-[160px] p-6 bg-white/5 border border-white/5 rounded-3xl focus:ring-2 focus:ring-[#b99740] outline-none resize-none text-white placeholder:text-white/20 font-medium leading-relaxed"
        />
        <div className="flex justify-between items-center pt-2">
          <div className="flex gap-3">
            <button className="w-12 h-12 flex items-center justify-center text-white/20 hover:text-[#b99740] hover:bg-white/5 rounded-2xl transition-all">
              <ImageIcon size={22} />
            </button>
          </div>
          <button className="bg-[#b99740] text-black px-10 py-4 rounded-2xl font-black hover:scale-105 transition-all flex items-center gap-3 shadow-xl shadow-gold/20">
            Broadcast Post
            <Send size={20} />
          </button>
        </div>
      </div>

      {/* Posts Feed */}
      <div className="space-y-8">
        {posts.map((post) => (
          <motion.div 
            key={post.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="card-gold p-8 rounded-[40px] space-y-6 group"
          >
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-[#b99740] to-[#5e0a10] rounded-2xl flex items-center justify-center text-white font-black text-sm shadow-lg shadow-maroon/20 group-hover:rotate-6 transition-transform">
                  {post.alias.split('-')[1]}
                </div>
                <div className="space-y-1">
                  <h4 className="text-lg font-bold text-white tracking-tight">{post.alias}</h4>
                  <div className="flex items-center gap-3 text-[10px] text-white/30 font-black uppercase tracking-widest">
                    <span className="text-[#b99740]">{post.campus}</span>
                    <span className="w-1 h-1 bg-white/10 rounded-full" />
                    <span>{post.time}</span>
                  </div>
                </div>
              </div>
              <button className="w-10 h-10 flex items-center justify-center text-white/20 hover:text-white rounded-xl transition-all">
                <MoreHorizontal size={20} />
              </button>
            </div>

            <p className="text-white/80 text-lg leading-relaxed font-medium">{post.content}</p>

            <div className="pt-6 border-t border-white/5 flex items-center gap-8">
              <button className="flex items-center gap-3 text-white/30 hover:text-red-500 transition-all group/btn">
                <div className="w-10 h-10 flex items-center justify-center group-hover/btn:bg-red-500/10 rounded-xl transition-all">
                  <Heart size={20} />
                </div>
                <span className="text-sm font-black">{post.likes}</span>
              </button>
              <button className="flex items-center gap-3 text-white/30 hover:text-[#b99740] transition-all group/btn">
                <div className="w-10 h-10 flex items-center justify-center group-hover/btn:bg-[#b99740]/10 rounded-xl transition-all">
                  <MessageCircle size={20} />
                </div>
                <span className="text-sm font-black">{post.replies}</span>
              </button>
              <button className="flex items-center gap-3 text-white/30 hover:text-white transition-all group/btn ml-auto">
                <div className="w-10 h-10 flex items-center justify-center group-hover/btn:bg-white/5 rounded-xl transition-all">
                  <Share2 size={20} />
                </div>
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default FreedomWall;
