import React, { useState } from 'react';
import { Heart, Flame, Bell, ChevronLeft } from 'lucide-react';

const Favourite = () => {
  const [activeTab, setActiveTab] = useState('items');

  const items = [
    { id: 1, name: 'Classic Burger', cal: '165', price: '20.00', img: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500' },
    { id: 2, name: 'Crispy Chicken', cal: '100', price: '25.00', img: 'https://images.unsplash.com/photo-1562967914-608f82629710?w=500' },
    { id: 3, name: 'Salmon Steak', cal: '125', price: '27.00', img: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=500' },
    { id: 4, name: 'Noodles', cal: '100', price: '15.00', img: 'https://images.unsplash.com/photo-1552611052-33e04de081de?w=500' },
  ];

  return (
    <div className="max-w-md mx-auto bg-gray-50 min-h-screen p-4 pb-20">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <button className="p-2 bg-white rounded-xl shadow-sm"><ChevronLeft size={20} /></button>
        <h1 className="text-xl font-bold">Favorite List</h1>
        <button className="p-2 bg-white rounded-xl shadow-sm"><Bell size={20} /></button>
      </div>

      {/* Tabs */}
      <div className="flex bg-white p-1 rounded-2xl mb-6 shadow-sm">
        <button 
          onClick={() => setActiveTab('items')}
          className={`flex-1 py-2 rounded-xl text-sm font-semibold transition-all ${activeTab === 'items' ? 'bg-orange-500 text-white' : 'text-gray-500'}`}
        >
          Favourite Items
        </button>
        <button 
          onClick={() => setActiveTab('restaurants')}
          className={`flex-1 py-2 rounded-xl text-sm font-semibold transition-all ${activeTab === 'restaurants' ? 'bg-orange-500 text-white' : 'text-gray-500'}`}
        >
          Favourite Restaurants
        </button>
      </div>

      {/* Grid Content */}
      <div className="grid grid-cols-2 gap-4">
        {activeTab === 'items' ? (
          items.map((item) => (
            <div key={item.id} className="bg-white p-3 rounded-3xl shadow-md relative">
              <button className="absolute right-3 top-3 text-red-500 bg-white/80 p-1 rounded-full shadow-sm">
                <Heart size={16} fill="currentColor" />
              </button>
              <img src={item.img} alt={item.name} className="w-full h-32 object-cover rounded-2xl mb-2" />
              <h3 className="font-bold text-gray-800 text-sm">{item.name}</h3>
              <div className="flex justify-between items-center mt-2">
                <span className="flex items-center text-xs text-orange-500 font-medium">
                  <Flame size={12} className="mr-1" /> {item.cal} Kal
                </span>
                <span className="text-orange-500 font-bold">${item.price}</span>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-2 text-center py-10 text-gray-400">No Favourite Restaurants Found</div>
        )}
      </div>
    </div>
  );
};

export default Favourite;
