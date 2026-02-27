import React, { useState } from 'react';
import { Search, Send, Plus, MoreVertical, Phone, Video, Globe, ShieldCheck, Sparkles, User } from 'lucide-react';
import { motion } from 'motion/react';

const Messenger = () => {
  const [activeChat, setActiveChat] = useState(1);

  const contacts = [
    { id: 1, name: "MSU Main Debate", lastMsg: "See you at the meeting!", time: "10:30 AM", unread: 2, avatar: "https://picsum.photos/seed/1/100/100", campus: "MSU Main" },
    { id: 2, name: "Maria Santos", lastMsg: "Did you finish the project?", time: "9:45 AM", unread: 0, avatar: "https://picsum.photos/seed/2/100/100", campus: "MSU IIT" },
    { id: 3, name: "Tech Innovators", lastMsg: "New workshop alert!", time: "Yesterday", unread: 0, avatar: "https://picsum.photos/seed/3/100/100", campus: "MSU Gensan" },
    { id: 4, name: "Juan Dela Cruz", lastMsg: "Thanks for the help!", time: "Yesterday", unread: 0, avatar: "https://picsum.photos/seed/4/100/100", campus: "MSU Naawan" },
  ];

  return (
    <div className="h-[calc(100vh-12rem)] glass-surface rounded-[48px] border border-white/10 flex overflow-hidden shadow-2xl">
      {/* Sidebar */}
      <div className="w-96 border-r border-white/5 flex flex-col bg-white/[0.02]">
        <div className="p-10 space-y-8">
          <div className="flex justify-between items-center">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-[#b99740]">
                <Sparkles size={14} />
                Network
              </div>
              <h2 className="text-3xl font-black tracking-tighter text-white">Messages</h2>
            </div>
            <button className="w-12 h-12 bg-[#b99740] text-black rounded-2xl flex items-center justify-center hover:scale-110 transition-all shadow-xl shadow-gold/20">
              <Plus size={24} />
            </button>
          </div>
          <div className="relative group">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-[#b99740] transition-colors" size={20} />
            <input 
              type="text" 
              placeholder="Search campus network..." 
              className="w-full pl-14 pr-6 py-5 bg-white/5 border border-white/5 rounded-[24px] focus:ring-2 focus:ring-[#b99740] outline-none text-sm text-white placeholder:text-white/20 transition-all"
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto scrollbar-hide px-6 pb-10 space-y-3">
          {contacts.map((contact) => (
            <motion.div 
              key={contact.id}
              onClick={() => setActiveChat(contact.id)}
              whileHover={{ x: 4 }}
              className={`p-5 flex gap-5 cursor-pointer rounded-[32px] transition-all border ${
                activeChat === contact.id 
                  ? 'bg-white/10 border-white/10 shadow-2xl shadow-gold/5' 
                  : 'hover:bg-white/5 border-transparent'
              }`}
            >
              <div className="relative">
                <img src={contact.avatar} alt={contact.name} className="w-16 h-16 rounded-[24px] object-cover border-2 border-white/5 group-hover:border-[#b99740]/50 transition-all" referrerPolicy="no-referrer" />
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 border-4 border-[#0d0703] rounded-full shadow-lg" />
              </div>
              <div className="flex-1 min-w-0 space-y-1.5">
                <div className="flex justify-between items-start">
                  <h3 className="font-black text-white truncate text-base tracking-tight">{contact.name}</h3>
                  <span className="text-[10px] text-white/20 font-black uppercase tracking-widest">{contact.time}</span>
                </div>
                <p className="text-xs text-white/40 truncate font-medium leading-relaxed">{contact.lastMsg}</p>
                <div className="flex items-center gap-2">
                  <span className="text-[9px] font-black uppercase tracking-[0.2em] text-[#b99740]">{contact.campus}</span>
                </div>
              </div>
              {contact.unread > 0 && (
                <div className="w-6 h-6 bg-[#b99740] text-black text-[10px] font-black rounded-xl flex items-center justify-center self-center shadow-xl shadow-gold/20">
                  {contact.unread}
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col bg-gradient-to-b from-white/[0.03] to-transparent">
        {/* Header */}
        <div className="p-8 border-b border-white/5 flex justify-between items-center bg-white/[0.02] backdrop-blur-xl">
          <div className="flex items-center gap-6">
            <div className="relative">
              <img src={`https://picsum.photos/seed/${activeChat}/100/100`} alt="Active" className="w-14 h-14 rounded-[24px] object-cover border-2 border-white/10 shadow-xl" referrerPolicy="no-referrer" />
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 border-4 border-[#0d0703] rounded-full shadow-lg" />
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h3 className="font-black text-white text-2xl tracking-tighter">{contacts.find(c => c.id === activeChat)?.name}</h3>
                <ShieldCheck size={20} className="text-[#b99740]" />
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]"></div>
                  <span className="text-[10px] text-green-500 font-black uppercase tracking-widest">Active Now</span>
                </div>
                <span className="text-white/10">•</span>
                <span className="text-[10px] text-white/40 font-black uppercase tracking-widest">{contacts.find(c => c.id === activeChat)?.campus}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="w-12 h-12 rounded-2xl bg-white/5 text-white/40 hover:text-[#b99740] hover:bg-white/10 transition-all flex items-center justify-center border border-white/5">
              <Phone size={22} />
            </button>
            <button className="w-12 h-12 rounded-2xl bg-white/5 text-white/40 hover:text-[#b99740] hover:bg-white/10 transition-all flex items-center justify-center border border-white/5">
              <Video size={22} />
            </button>
            <button className="w-12 h-12 rounded-2xl bg-white/5 text-white/40 hover:text-[#b99740] hover:bg-white/10 transition-all flex items-center justify-center border border-white/5">
              <MoreVertical size={22} />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 p-10 overflow-y-auto scrollbar-hide space-y-8">
          <div className="flex justify-center">
            <span className="px-6 py-2.5 bg-white/5 border border-white/5 rounded-full text-[10px] text-white/20 font-black uppercase tracking-[0.3em] backdrop-blur-md">Secure Campus Protocol Active</span>
          </div>
          
          <div className="flex gap-5 max-w-[70%]">
            <img src={`https://picsum.photos/seed/${activeChat}/100/100`} alt="User" className="w-12 h-12 rounded-2xl self-end border-2 border-white/10 shadow-lg" referrerPolicy="no-referrer" />
            <div className="bg-white/5 p-6 rounded-[32px] rounded-bl-none border border-white/5 shadow-2xl backdrop-blur-md">
              <p className="text-base text-white/80 leading-relaxed font-medium">Hello! Are you coming to the MSU Main event tomorrow? We have some updates on the security protocols and unified network access.</p>
              <div className="flex items-center gap-2 mt-4">
                <span className="text-[9px] text-white/20 font-black uppercase tracking-widest">10:30 AM</span>
                <span className="text-white/10">•</span>
                <ShieldCheck size={12} className="text-[#b99740]/40" />
              </div>
            </div>
          </div>

          <div className="flex gap-5 max-w-[70%] ml-auto flex-row-reverse">
            <div className="w-12 h-12 rounded-2xl bg-[#b99740] text-black flex items-center justify-center self-end shadow-xl shadow-gold/20">
              <User size={24} />
            </div>
            <div className="hero-metallic p-6 rounded-[32px] rounded-br-none shadow-2xl shadow-gold/10 border border-white/10">
              <p className="text-base text-black font-black leading-relaxed">Yes, I'll be there! I'm bringing the materials we discussed. Looking forward to connecting with the team and seeing the new OneMSU dashboard live.</p>
              <div className="flex items-center justify-end gap-2 mt-4">
                <span className="text-[9px] text-black/40 font-black uppercase tracking-widest">10:32 AM</span>
                <ShieldCheck size={12} className="text-black/40" />
              </div>
            </div>
          </div>
        </div>

        {/* Input */}
        <div className="p-10 bg-white/[0.02] backdrop-blur-2xl border-t border-white/5">
          <div className="flex gap-6 items-center">
            <div className="flex-1 relative group">
              <input 
                type="text" 
                placeholder="Type your secure message..." 
                className="w-full pl-8 pr-16 py-6 bg-white/5 border border-white/5 rounded-[32px] focus:ring-2 focus:ring-[#b99740] outline-none text-base text-white placeholder:text-white/20 transition-all shadow-inner"
              />
              <button className="absolute right-6 top-1/2 -translate-y-1/2 text-white/20 hover:text-[#b99740] transition-all">
                <Globe size={24} />
              </button>
            </div>
            <button className="w-20 h-20 bg-[#b99740] text-black rounded-[32px] flex items-center justify-center hover:scale-110 transition-all shadow-2xl shadow-gold/30 group">
              <Send size={32} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Messenger;
