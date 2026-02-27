import React from 'react';
import { LayoutDashboard, Users, MessageSquare, Heart, Search, TrendingUp, ArrowUpRight, ArrowDownRight } from 'lucide-react';

const Dashboard = () => {
  const stats = [
    { label: "Active Users", value: "1,245", change: "+12%", trend: "up", icon: Users, color: "blue" },
    { label: "Messages Sent", value: "45.2k", change: "+8%", trend: "up", icon: MessageSquare, color: "green" },
    { label: "Freedom Posts", value: "892", change: "-3%", trend: "down", icon: Heart, color: "red" },
    { label: "Items Found", value: "124", change: "+24%", trend: "up", icon: Search, color: "amber" },
  ];

  return (
    <div className="space-y-8">
      <header className="space-y-1">
        <h2 className="text-3xl font-bold text-gray-900">Admin Dashboard</h2>
        <p className="text-gray-500">Overview of campus activity and platform health.</p>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 space-y-4">
            <div className="flex justify-between items-start">
              <div className={`p-3 rounded-2xl bg-${stat.color}-50 text-${stat.color}-600`}>
                <stat.icon size={24} />
              </div>
              <div className={`flex items-center gap-1 text-xs font-bold ${stat.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                {stat.trend === 'up' ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                {stat.change}
              </div>
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider">{stat.label}</h3>
              <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Chart Area */}
        <div className="lg:col-span-2 bg-white p-8 rounded-3xl shadow-sm border border-gray-100 space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <TrendingUp size={20} className="text-blue-600" />
              Activity Trends
            </h3>
            <select className="bg-gray-50 border-none rounded-xl px-4 py-2 text-sm font-bold focus:ring-2 focus:ring-blue-500 outline-none">
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
            </select>
          </div>
          <div className="h-64 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 font-medium border border-dashed border-gray-200">
            Activity Chart Visualization
          </div>
        </div>

        {/* Side Panel */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 space-y-6">
          <h3 className="text-xl font-bold text-gray-900">Recent Reports</h3>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="p-4 rounded-2xl bg-gray-50 border border-gray-100 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-red-600 bg-red-50 px-2 py-1 rounded-full">Freedom Wall</span>
                  <span className="text-[10px] text-gray-400 font-bold">10m ago</span>
                </div>
                <p className="text-xs text-gray-600 line-clamp-2 font-medium">Inappropriate content reported in MSU Main feed. Requires review.</p>
                <button className="text-xs font-bold text-blue-600 hover:underline">Review Post</button>
              </div>
            ))}
          </div>
          <button className="w-full py-3 bg-gray-900 text-white rounded-xl font-bold text-sm hover:bg-black transition-all">
            View All Reports
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
