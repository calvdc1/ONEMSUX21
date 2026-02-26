import React, { useState } from 'react';
import { Search, Send, Plus, MoreVertical, Phone, Video } from 'lucide-react';

const Messenger = () => {
  const [activeChat, setActiveChat] = useState(1);

  const contacts = [
    { id: 1, name: "MSU Main Debate", lastMsg: "See you at the meeting!", time: "10:30 AM", unread: 2, avatar: "https://picsum.photos/seed/1/100/100" },
    { id: 2, name: "Maria Santos", lastMsg: "Did you finish the project?", time: "9:45 AM", unread: 0, avatar: "https://picsum.photos/seed/2/100/100" },
    { id: 3, name: "Tech Innovators", lastMsg: "New workshop alert!", time: "Yesterday", unread: 0, avatar: "https://picsum.photos/seed/3/100/100" },
    { id: 4, name: "Juan Dela Cruz", lastMsg: "Thanks for the help!", time: "Yesterday", unread: 0, avatar: "https://picsum.photos/seed/4/100/100" },
  ];

  return (
    <div className="h-[calc(100vh-8rem)] bg-white rounded-3xl shadow-sm border border-gray-100 flex overflow-hidden">
      {/* Sidebar */}
      <div className="w-80 border-r border-gray-100 flex flex-col">
        <div className="p-4 border-b border-gray-100 space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">Messages</h2>
            <button className="p-2 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition-colors">
              <Plus size={20} />
            </button>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search chats..." 
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {contacts.map((contact) => (
            <div 
              key={contact.id}
              onClick={() => setActiveChat(contact.id)}
              className={`p-4 flex gap-3 cursor-pointer transition-colors ${activeChat === contact.id ? 'bg-blue-50' : 'hover:bg-gray-50'}`}
            >
              <img src={contact.avatar} alt={contact.name} className="w-12 h-12 rounded-full object-cover" referrerPolicy="no-referrer" />
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start">
                  <h3 className="font-semibold text-gray-900 truncate">{contact.name}</h3>
                  <span className="text-xs text-gray-400">{contact.time}</span>
                </div>
                <p className="text-sm text-gray-500 truncate">{contact.lastMsg}</p>
              </div>
              {contact.unread > 0 && (
                <div className="w-5 h-5 bg-blue-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {contact.unread}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-100 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <img src={`https://picsum.photos/seed/${activeChat}/100/100`} alt="Active" className="w-10 h-10 rounded-full object-cover" referrerPolicy="no-referrer" />
            <div>
              <h3 className="font-bold text-gray-900">{contacts.find(c => c.id === activeChat)?.name}</h3>
              <span className="text-xs text-green-500 font-medium">Online</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all">
              <Phone size={20} />
            </button>
            <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all">
              <Video size={20} />
            </button>
            <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all">
              <MoreVertical size={20} />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-gray-50/50">
          <div className="flex justify-center">
            <span className="px-3 py-1 bg-white border border-gray-100 rounded-full text-[10px] text-gray-400 font-bold uppercase tracking-wider">Today</span>
          </div>
          
          <div className="flex gap-3 max-w-[80%]">
            <img src={`https://picsum.photos/seed/${activeChat}/100/100`} alt="User" className="w-8 h-8 rounded-full self-end" referrerPolicy="no-referrer" />
            <div className="bg-white p-4 rounded-2xl rounded-bl-none shadow-sm border border-gray-100">
              <p className="text-sm text-gray-800">Hello! Are you coming to the MSU Main event tomorrow?</p>
              <span className="text-[10px] text-gray-400 mt-1 block">10:30 AM</span>
            </div>
          </div>

          <div className="flex gap-3 max-w-[80%] ml-auto flex-row-reverse">
            <div className="bg-blue-600 p-4 rounded-2xl rounded-br-none shadow-sm text-white">
              <p className="text-sm">Yes, I'll be there! I'm bringing the materials we discussed.</p>
              <span className="text-[10px] text-blue-200 mt-1 block text-right">10:32 AM</span>
            </div>
          </div>
        </div>

        {/* Input */}
        <div className="p-4 border-t border-gray-100">
          <div className="flex gap-2">
            <input 
              type="text" 
              placeholder="Type a message..." 
              className="flex-1 px-4 py-3 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 text-sm"
            />
            <button className="p-3 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-200">
              <Send size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Messenger;
