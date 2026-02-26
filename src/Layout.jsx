import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import { Home, MessageSquare, Heart, Search, User, Settings, LayoutDashboard } from 'lucide-react';

const Layout = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      {/* Sidebar Navigation */}
      <nav className="w-full md:w-64 bg-white border-r border-gray-200 flex flex-col h-screen sticky top-0">
        <div className="p-6 border-b border-gray-100">
          <h1 className="text-2xl font-bold text-blue-600 flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white text-xs">M</div>
            OneMSU
          </h1>
        </div>
        
        <div className="flex-1 p-4 space-y-2 overflow-y-auto">
          <Link to="/" className="flex items-center gap-3 p-3 rounded-xl hover:bg-blue-50 text-gray-700 hover:text-blue-600 transition-all">
            <Home size={20} />
            <span className="font-medium">Home</span>
          </Link>
          <Link to="/messenger" className="flex items-center gap-3 p-3 rounded-xl hover:bg-blue-50 text-gray-700 hover:text-blue-600 transition-all">
            <MessageSquare size={20} />
            <span className="font-medium">Messenger</span>
          </Link>
          <Link to="/freedomwall" className="flex items-center gap-3 p-3 rounded-xl hover:bg-blue-50 text-gray-700 hover:text-blue-600 transition-all">
            <Heart size={20} />
            <span className="font-medium">Freedom Wall</span>
          </Link>
          <Link to="/lostfound" className="flex items-center gap-3 p-3 rounded-xl hover:bg-blue-50 text-gray-700 hover:text-blue-600 transition-all">
            <Search size={20} />
            <span className="font-medium">Lost & Found</span>
          </Link>
          <Link to="/explorer" className="flex items-center gap-3 p-3 rounded-xl hover:bg-blue-50 text-gray-700 hover:text-blue-600 transition-all">
            <LayoutDashboard size={20} />
            <span className="font-medium">Explorer</span>
          </Link>
        </div>

        <div className="p-4 border-t border-gray-100 space-y-2">
          <Link to="/profile" className="flex items-center gap-3 p-3 rounded-xl hover:bg-blue-50 text-gray-700 hover:text-blue-600 transition-all">
            <User size={20} />
            <span className="font-medium">Profile</span>
          </Link>
          <Link to="/feedbacks" className="flex items-center gap-3 p-3 rounded-xl hover:bg-blue-50 text-gray-700 hover:text-blue-600 transition-all">
            <Settings size={20} />
            <span className="font-medium">Feedbacks</span>
          </Link>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-4 md:p-8">
        <div className="max-w-5xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;
