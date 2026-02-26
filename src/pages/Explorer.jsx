import React from 'react';
import { Search, Users, MapPin, Globe, TrendingUp, Star, Filter } from 'lucide-react';
import { motion } from 'motion/react';

const Explorer = () => {
  const groups = [
    { id: 1, name: "MSU Main Debate Society", members: 156, campus: "MSU Main", category: "Clubs", image: "https://picsum.photos/seed/debate/400/300" },
    { id: 2, name: "IIT Tech Innovators", members: 89, campus: "MSU IIT", category: "Technology", image: "https://picsum.photos/seed/tech/400/300" },
    { id: 3, name: "Gensan Arts Guild", members: 124, campus: "MSU Gensan", category: "Arts", image: "https://picsum.photos/seed/arts/400/300" },
    { id: 4, name: "Naawan Marine Society", members: 67, campus: "MSU Naawan", category: "Science", image: "https://picsum.photos/seed/marine/400/300" },
  ];

  return (
    <div className="space-y-8">
      <header className="space-y-4">
        <div className="flex justify-between items-end">
          <div className="space-y-1">
            <h2 className="text-3xl font-bold text-gray-900">Explorer</h2>
            <p className="text-gray-500">Discover groups and communities across MSU campuses.</p>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input 
              type="text" 
              placeholder="Search groups, clubs, or interests..." 
              className="w-full pl-12 pr-4 py-4 bg-white border border-gray-100 rounded-2xl shadow-sm focus:ring-2 focus:ring-blue-500 outline-none text-gray-800"
            />
          </div>
          <button className="px-6 py-4 bg-white border border-gray-100 rounded-2xl shadow-sm flex items-center gap-2 text-gray-600 font-bold hover:bg-gray-50 transition-all">
            <Filter size={20} />
            Filters
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Filters */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 space-y-6">
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <TrendingUp size={18} className="text-blue-600" />
              Trending Categories
            </h3>
            <div className="space-y-2">
              {["Academic", "Cultural", "Sports", "Technology", "Religious", "Social"].map((cat) => (
                <button key={cat} className="w-full text-left px-4 py-2 rounded-xl text-sm font-medium text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-all">
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-blue-600 p-6 rounded-3xl shadow-lg shadow-blue-200 text-white space-y-4">
            <Globe size={32} className="text-blue-200" />
            <h3 className="text-xl font-bold">Campus Network</h3>
            <p className="text-blue-100 text-sm">Connect with students from all 11 MSU campuses across Mindanao.</p>
          </div>
        </div>

        {/* Main Grid */}
        <div className="lg:col-span-3 space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-bold text-gray-900">Recommended for You</h3>
            <div className="flex gap-2">
              <button className="p-2 bg-white border border-gray-100 rounded-xl text-gray-400 hover:text-blue-600 transition-all shadow-sm">
                <Star size={18} />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {groups.map((group) => (
              <motion.div 
                key={group.id}
                whileHover={{ y: -5 }}
                className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden group flex flex-col"
              >
                <div className="relative h-40 overflow-hidden">
                  <img src={group.image} alt={group.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" referrerPolicy="no-referrer" />
                  <div className="absolute top-4 right-4 px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-[10px] font-bold text-blue-600 uppercase tracking-wider">
                    {group.category}
                  </div>
                </div>
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <h4 className="text-lg font-bold text-gray-900 leading-tight">{group.name}</h4>
                    <div className="flex items-center gap-4 text-xs text-gray-400 font-medium">
                      <div className="flex items-center gap-1">
                        <Users size={14} />
                        {group.members} members
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin size={14} />
                        {group.campus}
                      </div>
                    </div>
                  </div>
                  <button className="w-full py-3 bg-blue-50 text-blue-600 rounded-xl font-bold text-sm hover:bg-blue-600 hover:text-white transition-all">
                    Join Group
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
