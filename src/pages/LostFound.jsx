import React, { useState } from 'react';
import { Search, Plus, MapPin, Tag, Calendar, CheckCircle2, Clock } from 'lucide-react';

const LostFound = () => {
  const [items, setItems] = useState([
    { id: 1, type: "lost", title: "Blue Hydroflask", description: "Lost near the MSU Main library. Has a MSU sticker.", campus: "MSU Main", date: "Oct 24, 2026", status: "pending", image: "https://picsum.photos/seed/bottle/400/300" },
    { id: 2, type: "found", title: "Scientific Calculator", description: "Found in Room 302, Engineering Building. Casio brand.", campus: "MSU IIT", date: "Oct 23, 2026", status: "resolved", image: "https://picsum.photos/seed/calc/400/300" },
    { id: 3, type: "lost", title: "Keys with Keychain", description: "Lost my keys with a small teddy bear keychain.", campus: "MSU Gensan", date: "Oct 22, 2026", status: "pending", image: "https://picsum.photos/seed/keys/400/300" },
  ]);

  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div className="space-y-1">
          <h2 className="text-3xl font-bold text-gray-900">Lost & Found</h2>
          <p className="text-gray-500">Help reunite items with their owners.</p>
        </div>
        <button className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 transition-all flex items-center gap-2 shadow-lg shadow-blue-200">
          <Plus size={20} />
          Report Item
        </button>
      </header>

      <div className="flex gap-4 overflow-x-auto pb-2">
        <button className="px-6 py-2 bg-blue-600 text-white rounded-full font-bold text-sm whitespace-nowrap">All Items</button>
        <button className="px-6 py-2 bg-white border border-gray-200 text-gray-600 rounded-full font-bold text-sm hover:bg-gray-50 transition-colors whitespace-nowrap">Lost</button>
        <button className="px-6 py-2 bg-white border border-gray-200 text-gray-600 rounded-full font-bold text-sm hover:bg-gray-50 transition-colors whitespace-nowrap">Found</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item) => (
          <div key={item.id} className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden group">
            <div className="relative h-48 overflow-hidden">
              <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" referrerPolicy="no-referrer" />
              <div className={`absolute top-4 left-4 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${item.type === 'lost' ? 'bg-red-500 text-white' : 'bg-green-500 text-white'}`}>
                {item.type}
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div className="space-y-1">
                <h3 className="text-xl font-bold text-gray-900">{item.title}</h3>
                <div className="flex items-center gap-2 text-xs text-gray-400 font-medium">
                  <MapPin size={14} />
                  {item.campus}
                </div>
              </div>
              <p className="text-sm text-gray-500 line-clamp-2">{item.description}</p>
              <div className="pt-4 border-t border-gray-50 flex justify-between items-center">
                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <Calendar size={14} />
                  {item.date}
                </div>
                <div className={`flex items-center gap-1 text-xs font-bold ${item.status === 'resolved' ? 'text-green-600' : 'text-amber-600'}`}>
                  {item.status === 'resolved' ? <CheckCircle2 size={14} /> : <Clock size={14} />}
                  {item.status === 'resolved' ? 'Resolved' : 'Pending'}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LostFound;
