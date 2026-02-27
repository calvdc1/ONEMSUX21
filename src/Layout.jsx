import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { Home, MessageSquare, Heart, Search, User, Settings, LayoutDashboard, Globe, Bell, ShieldCheck, Sparkles, LogOut } from 'lucide-react';
import { motion } from 'motion/react';

const Layout = () => {
  const location = useLocation();

  const navItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/messenger', icon: MessageSquare, label: 'Messenger' },
    { path: '/freedomwall', icon: Heart, label: 'Freedom Wall' },
    { path: '/lostfound', icon: Search, label: 'Lost & Found' },
    { path: '/explorer', icon: LayoutDashboard, label: 'Explorer' },
  ];

  return (
    <div className="min-h-screen bg-[#0a0502] text-[#f5f2ed] flex flex-col md:flex-row overflow-hidden font-sans">
      {/* Sidebar Navigation */}
      <nav className="w-full md:w-80 bg-[#0d0703] border-r border-white/5 flex flex-col h-screen sticky top-0 z-50 shadow-2xl">
        <div className="p-10">
          <Link to="/" className="flex items-center gap-4 group">
            <div className="w-12 h-12 bg-gradient-to-br from-[#b99740] to-[#5e0a10] rounded-2xl flex items-center justify-center text-white shadow-2xl shadow-maroon/40 group-hover:scale-110 transition-all duration-500 border border-white/10">
              <Globe size={24} />
            </div>
            <div className="space-y-0.5">
              <h1 className="text-2xl font-black tracking-tighter text-white">
                ONEMSU
              </h1>
              <div className="flex items-center gap-1.5 text-[8px] font-black uppercase tracking-[0.3em] text-[#b99740]">
                <ShieldCheck size={10} />
                Unified Network
              </div>
            </div>
          </Link>
        </div>
        
        <div className="flex-1 px-6 space-y-2 overflow-y-auto scrollbar-hide">
          <p className="px-5 py-3 text-[10px] font-black uppercase tracking-[0.4em] text-white/20">System Navigation</p>
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link 
                key={item.path}
                to={item.path} 
                className={`flex items-center gap-4 p-5 rounded-[24px] transition-all group relative border ${
                  isActive 
                    ? 'bg-white/5 border-white/10 text-[#b99740] shadow-xl shadow-gold/5' 
                    : 'text-white/40 border-transparent hover:text-white hover:bg-white/5 hover:border-white/5'
                }`}
              >
                {isActive && (
                  <motion.div 
                    layoutId="activeNav"
                    className="absolute left-0 w-1.5 h-8 bg-[#b99740] rounded-r-full shadow-[0_0_15px_rgba(185,151,64,0.5)]"
                  />
                )}
                <item.icon size={22} className={isActive ? 'text-[#b99740]' : 'group-hover:text-[#b99740] transition-colors'} />
                <span className="font-black text-sm tracking-tight uppercase">{item.label}</span>
                {isActive && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="ml-auto w-1.5 h-1.5 rounded-full bg-[#b99740] shadow-[0_0_10px_rgba(185,151,64,0.8)]"
                  />
                )}
              </Link>
            );
          })}
        </div>

        <div className="p-8 border-t border-white/5 space-y-6">
          <div className="glass-surface p-5 rounded-[32px] border border-white/10 group hover:border-[#b99740]/30 transition-all">
            <div className="flex items-center gap-4">
              <div className="relative">
                <img src="https://picsum.photos/seed/user/100/100" alt="Avatar" className="w-12 h-12 rounded-2xl object-cover border-2 border-white/5 group-hover:border-[#b99740]/50 transition-all" referrerPolicy="no-referrer" />
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-4 border-[#0d0703] shadow-lg"></div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-black text-white truncate">Xander Camarin</p>
                <div className="flex items-center gap-1.5 text-[9px] text-[#b99740] font-black uppercase tracking-widest">
                  <Sparkles size={10} />
                  MSU Main
                </div>
              </div>
              <button className="p-2.5 text-white/20 hover:text-[#b99740] transition-all bg-white/5 rounded-xl">
                <Bell size={18} />
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <Link to="/profile" className="flex items-center justify-center gap-2.5 p-4 rounded-2xl bg-white/5 border border-white/5 text-[10px] font-black uppercase tracking-widest hover:bg-white/10 hover:border-white/10 transition-all text-white/60 hover:text-white">
              <User size={16} />
              Profile
            </Link>
            <button className="flex items-center justify-center gap-2.5 p-4 rounded-2xl bg-white/5 border border-white/5 text-[10px] font-black uppercase tracking-widest hover:bg-red-500/10 hover:border-red-500/20 transition-all text-white/60 hover:text-red-500">
              <LogOut size={16} />
              Exit
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto scrollbar-hide relative bg-main-gradient">
        {/* Background Accents */}
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-maroon/5 blur-[150px] rounded-full -z-10 pointer-events-none animate-pulse" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gold/5 blur-[120px] rounded-full -z-10 pointer-events-none" />
        
        <div className="max-w-7xl mx-auto p-8 md:p-16">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;
