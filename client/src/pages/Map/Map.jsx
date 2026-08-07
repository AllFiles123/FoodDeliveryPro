import React from 'react';
import { ChevronLeft, MoreVertical, MessageCircle, Phone, Truck } from 'lucide-react';

const Map = () => {
  return (
    <div className="max-w-md mx-auto bg-gray-100 min-h-screen relative overflow-hidden">
      {/* Simulated Map Background */}
      <div className="absolute inset-0 bg-[#f4f1ea]">
        <img 
          src="https://api.mapbox.com/styles/v1/mapbox/light-v10/static/72.8777,19.0760,14,0/400x800?access_token=YOUR_MAPBOX_TOKEN" 
          className="w-full h-full object-cover opacity-60" 
          alt="Map"
        />
        {/* SVG Path Simulation */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          <path d="M100 450 L300 470 L340 280 L450 280" fill="none" stroke="#f97316" strokeWidth="4" strokeDasharray="8 4" />
        </svg>
        {/* Delivery Truck Icon on Map */}
        <div className="absolute left-[200px] top-[455px] bg-white p-3 rounded-full shadow-xl border-4 border-orange-500">
          <Truck className="text-orange-500" size={24} />
        </div>
        {/* Destination Icon */}
        <div className="absolute left-[330px] top-[260px] bg-orange-500 p-3 rounded-full shadow-2xl animate-bounce">
          <div className="bg-white w-2 h-2 rounded-full mx-auto mt-1"></div>
        </div>
      </div>

      {/* Header Buttons */}
      <div className="relative p-6 flex justify-between items-center">
        <button className="p-3 bg-white rounded-full shadow-lg"><ChevronLeft size={20} /></button>
        <h2 className="font-bold text-lg">Order Tracking</h2>
        <button className="p-3 bg-white rounded-full shadow-lg"><MoreVertical size={20} /></button>
      </div>

      {/* Floating Info Panel */}
      <div className="absolute bottom-6 left-4 right-4 space-y-4">
        {/* Delivery Person Card */}
        <div className="bg-white p-4 rounded-[32px] shadow-xl border border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="https://i.pravatar.cc/150?u=david" alt="Driver" className="w-12 h-12 rounded-full object-cover" />
            <div>
              <h4 className="font-bold">David Warner</h4>
              <p className="text-xs text-gray-400">ID: 12345678</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button className="p-3 bg-orange-50 rounded-full text-orange-500"><MessageCircle size={20}/></button>
            <button className="p-3 bg-orange-500 rounded-full text-white"><Phone size={20}/></button>
          </div>
        </div>

        {/* Timeline Status Card */}
        <div className="bg-white p-6 rounded-[32px] shadow-xl border border-gray-100">
          <div className="space-y-6">
            <StatusItem time="10:30 PM" title="Order Confirmed" desc="Your order has been successfully placed." active />
            <StatusItem time="10:45 PM" title="Preparing Food" desc="Your meal is being freshly prepared." active />
            <StatusItem time="11:50 PM" title="Food on the Way" desc="Our delivery hero is on the way." active />
            <StatusItem time="12:30 PM" title="Delivered to you" desc="Enjoy your meal!" />
          </div>
          
          <button className="w-full mt-6 bg-gradient-to-r from-orange-400 to-orange-600 text-white py-4 rounded-2xl font-bold">
            Order Received
          </button>
        </div>
      </div>
    </div>
  );
};

const StatusItem = ({ time, title, desc, active }) => (
  <div className="flex gap-4">
    <div className="flex flex-col items-center">
      <div className={`w-3 h-3 rounded-full ${active ? 'bg-orange-500' : 'bg-gray-200'}`}></div>
      <div className="w-0.5 h-10 bg-gray-100"></div>
    </div>
    <div className="flex-1">
      <div className="flex justify-between items-start">
        <h5 className="font-bold text-sm">{title}</h5>
        <span className="text-[10px] text-gray-400 font-bold">{time}</span>
      </div>
      <p className="text-xs text-gray-400 mt-1">{desc}</p>
    </div>
  </div>
);

export default Map;
