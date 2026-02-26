import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Heart, MessageCircle, Share2, MoreHorizontal, Image as ImageIcon, Send } from 'lucide-react';

const FreedomWall = () => {
  const [posts, setPosts] = useState([
    { id: 1, alias: "Anon-XJ9", content: "Just passed my midterms! MSU Main library is my second home now. 📚✨", likes: 24, replies: 5, time: "2h ago", campus: "MSU Main" },
    { id: 2, alias: "Anon-K22", content: "Anyone know where the best coffee is near MSU IIT? Need caffeine for this coding project. ☕️", likes: 12, replies: 8, time: "4h ago", campus: "MSU IIT" },
    { id: 3, alias: "Anon-P01", content: "The sunset at MSU Naawan today was absolutely breathtaking. We are so lucky to study here. 🌅", likes: 56, replies: 3, time: "6h ago", campus: "MSU Naawan" },
  ]);

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <header className="flex justify-between items-end">
        <div className="space-y-1">
          <h2 className="text-3xl font-bold text-gray-900">Freedom Wall</h2>
          <p className="text-gray-500">Share your thoughts anonymously.</p>
        </div>
        <div className="flex gap-2">
          <select className="bg-white border border-gray-200 rounded-xl px-4 py-2 text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none">
            <option>All Campuses</option>
            <option>MSU Main</option>
            <option>MSU IIT</option>
            <option>MSU Gensan</option>
          </select>
        </div>
      </header>

      {/* Create Post */}
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 space-y-4">
        <textarea 
          placeholder="What's on your mind? (Anonymous)" 
          className="w-full min-h-[120px] p-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 resize-none text-gray-800"
        />
        <div className="flex justify-between items-center">
          <div className="flex gap-2">
            <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all">
              <ImageIcon size={20} />
            </button>
          </div>
          <button className="bg-blue-600 text-white px-6 py-2 rounded-xl font-bold hover:bg-blue-700 transition-all flex items-center gap-2">
            Post
            <Send size={18} />
          </button>
        </div>
      </div>

      {/* Posts Feed */}
      <div className="space-y-6">
        {posts.map((post) => (
          <motion.div 
            key={post.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 space-y-4"
          >
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-xs">
                  {post.alias.split('-')[1]}
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">{post.alias}</h4>
                  <div className="flex items-center gap-2 text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                    <span>{post.campus}</span>
                    <span>•</span>
                    <span>{post.time}</span>
                  </div>
                </div>
              </div>
              <button className="p-2 text-gray-400 hover:text-gray-600 rounded-xl transition-all">
                <MoreHorizontal size={20} />
              </button>
            </div>

            <p className="text-gray-800 leading-relaxed">{post.content}</p>

            <div className="pt-4 border-t border-gray-50 flex items-center gap-6">
              <button className="flex items-center gap-2 text-gray-400 hover:text-red-500 transition-colors group">
                <div className="p-2 group-hover:bg-red-50 rounded-xl transition-all">
                  <Heart size={20} />
                </div>
                <span className="text-sm font-bold">{post.likes}</span>
              </button>
              <button className="flex items-center gap-2 text-gray-400 hover:text-blue-500 transition-colors group">
                <div className="p-2 group-hover:bg-blue-50 rounded-xl transition-all">
                  <MessageCircle size={20} />
                </div>
                <span className="text-sm font-bold">{post.replies}</span>
              </button>
              <button className="flex items-center gap-2 text-gray-400 hover:text-gray-600 transition-colors group ml-auto">
                <div className="p-2 group-hover:bg-gray-50 rounded-xl transition-all">
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
