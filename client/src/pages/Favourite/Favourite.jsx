import React, { useState } from 'react';
import { Heart, Flame, Bell, ChevronLeft, Search } from 'lucide-react';

const Favourite = () => {
  const [activeTab, setActiveTab] = useState('items');

  const items = [
    { id: 1, name: 'Classic Burger', cal: '165', price: '20.00', img: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500' },
    { id: 2, name: 'Crispy Chicken', cal: '100', price: '25.00', img: 'https://images.unsplash.com/photo-1562967914-608f82629710?w=500' },
    { id: 3, name: 'Salmon Steak', cal: '125', price: '27.00', img: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=500' },
    { id: 4, name: 'Noodles', cal: '100', price: '15.00', img: 'https://images.unsplash.com/photo-1552611052-33e04de081de?w=500' },
    { id: 5, name: 'Classic Burger', cal: '170', price: '26.00', img: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=500' },
    { id: 6, name: 'Chocolate ice', cal: '100', price: '17.00', img: 'https://images.unsplash.com/photo-1563805042-7684c849a135?w=500' },
  ];

  return (
    <div className="max-w-md mx-auto bg-gray-50 min-h-screen p-4 pb-24 font-sans">
      {/* Header */}
      <div className="flex justify-between items-center mb-6 pt-2">
        <button className="p-3 bg-white rounded-2xl shadow-sm text-gray-700 hover:bg-gray-100 transition-all">
          <ChevronLeft size={20} />
        </button>
        <h1 className="text-xl font-bold text-gray-800">Favorite List</h1>
        <button className="p-3 bg-white rounded-2xl shadow-sm text-gray-700 hover:bg-gray-100 transition-all">
          <Bell size={20} />
        </button>
      </div>

      {/* সার্চ বার (ঐচ্ছিক কিন্তু সুন্দর দেখাবে) */}
      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
        <input 
          type="text" 
          placeholder="Search favorites..." 
          className="w-full bg-white py-3 pl-12 pr-4 rounded-2xl border-none shadow-sm focus:ring-2 focus:ring-green-500 outline-none"
        />
      </div>

      {/* Tabs - নির্দেশানুযায়ী সবুজ বাটন */}
      <div className="flex bg-white p-1.5 rounded-2xl mb-6 shadow-sm border border-gray-100">
        <button 
          onClick={() => setActiveTab('items')}
          className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all duration-300 ${
            activeTab === 'items' ? 'bg-green-600 text-white shadow-lg shadow-green-100' : 'text-gray-400 hover:text-green-600'
          }`}
        >
          Favourite Items
        </button>
        <button 
          onClick={() => setActiveTab('restaurants')}
          className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all duration-300 ${
            activeTab === 'restaurants' ? 'bg-green-600 text-white shadow-lg shadow-green-100' : 'text-gray-400 hover:text-green-600'
          }`}
        >
          Favourite Restaurants
        </button>
      </div>

      {/* Grid Content */}
      <div className="grid grid-cols-2 gap-5 overflow-y-auto max-h-[calc(100vh-280px)] pr-1 custom-scrollbar">
        {activeTab === 'items' ? (
          items.map((item) => (
            <div key={item.id} className="bg-white p-3 rounded-[32px] shadow-md border border-gray-50 relative group transition-transform hover:scale-[1.02]">
              {/* হার্ট আইকন লাল রাখা হয়েছে কারণ এটি ফেভারিট বোঝায়, তবে ব্যাকগ্রাউন্ড সবুজ আভা দিতে পারে */}
              <button className="absolute right-3 top-3 text-red-500 bg-white/90 p-2 rounded-full shadow-md z-10 hover:scale-110 transition-transform">
                <Heart size={16} fill="currentColor" />
              </button>
              
              <div className="overflow-hidden rounded-[24px] mb-3">
                <img src={item.img} alt={item.name} className="w-full h-32 object-cover transition-transform duration-500 group-hover:scale-110" />
              </div>
              
              <h3 className="font-bold text-gray-800 text-[15px] px-1 truncate">{item.name}</h3>
              
              <div className="flex justify-between items-center mt-3 px-1 pb-1">
                <span className="flex items-center text-[11px] text-green-600 font-extrabold bg-green-50 px-2 py-1 rounded-lg">
                  <Flame size={12} className="mr-1" /> {item.cal} Kal
                </span>
                <span className="text-green-700 font-black text-sm">${item.price}</span>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-2 flex flex-col items-center justify-center py-20 text-gray-300">
            <div className="p-6 bg-gray-100 rounded-full mb-4">
               <Search size={40} />
            </div>
            <p className="font-bold">No Favourite Restaurants Found</p>
          </div>
        )}
      </div>

      {/* কাস্টম সিএসএস ফর স্ক্রলবার */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e5e7eb; border-radius: 10px; }
      `}</style>
    </div>
  );
};

export default Favourite;

