import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { ChevronLeft, MoreVertical, MessageCircle, Phone, Truck } from 'lucide-react';

// কাস্টম আইকন তৈরি (ম্যাপের জন্য)
const riderIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/2830/2830305.png', // ডেলিভারি আইকন
  iconSize: [40, 40],
  iconAnchor: [20, 40],
});

const userIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/1277/1277332.png', // ইউজার/হোম আইকন
  iconSize: [35, 35],
  iconAnchor: [17, 35],
});

const Map = () => {
  // ডামি লোকেশন (ঢাকা শহরের স্থানাঙ্ক উদাহরণ হিসেবে)
  const [riderPos, setRiderPos] = useState([23.8103, 90.4125]); // রাইডারের শুরুর পজিশন
  const userPos = [23.7949, 90.4043]; // কাস্টমারের পজিশন (গন্তব্য)

  // রাইডারের মুভমেন্ট সিমুলেট করা (প্রতি ৫ সেকেন্ডে রাইডার গন্তব্যের দিকে আসবে)
  useEffect(() => {
    const interval = setInterval(() => {
      setRiderPos((prev) => {
        const newLat = prev[0] - 0.0002; // ধীরে ধীরে নিচে নামছে
        const newLng = prev[1] - 0.0001; // ধীরে ধীরে বামে আসছে
        return [newLat, newLng];
      });
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="max-w-md mx-auto bg-gray-100 h-screen relative flex flex-col overflow-hidden font-sans">
      
      {/* ১. রিয়েল ম্যাপ সেকশন */}
      <div className="absolute inset-0 z-0">
        <MapContainer 
          center={userPos} 
          zoom={14} 
          zoomControl={false} 
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; OpenStreetMap contributors'
          />
          
          {/* রাইডার মার্কার */}
          <Marker position={riderPos} icon={riderIcon}>
            <Popup>David is here!</Popup>
          </Marker>

          {/* কাস্টমার/গন্তব্য মার্কার */}
          <Marker position={userPos} icon={userIcon}>
            <Popup>Your Location</Popup>
          </Marker>

          {/* রাস্তা বা পথ দেখানো */}
          <Polyline positions={[riderPos, userPos]} color="#16a34a" dashArray="10, 10" />
        </MapContainer>
      </div>

      {/* ২. হেডার */}
      <div className="relative z-[1000] p-5 flex justify-between items-center">
        <button className="p-3 bg-white/90 backdrop-blur-md rounded-full shadow-lg">
          <ChevronLeft size={22} className="text-gray-700" />
        </button>
        <h2 className="font-bold text-xl text-gray-800 bg-white/50 px-4 py-1 rounded-full backdrop-blur-sm">Tracking Rider</h2>
        <button className="p-3 bg-white/90 backdrop-blur-md rounded-full shadow-lg">
          <MoreVertical size={22} className="text-gray-700" />
        </button>
      </div>

      {/* ৩. নিচের কন্টেন্ট প্যানেল (স্ক্রলিং সহ) */}
      <div className="relative z-[1000] flex-1 overflow-y-auto px-4 pb-28 mt-auto flex flex-col justify-end space-y-4">
        
        {/* রাইডার ইনফো কার্ড */}
        <div className="bg-white/95 backdrop-blur-md p-4 rounded-[30px] shadow-2xl border border-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="https://i.pravatar.cc/150?u=david" className="w-14 h-14 rounded-full border-2 border-green-500" alt="David" />
            <div>
              <h4 className="font-bold text-gray-800">David Warner</h4>
              <p className="text-xs text-gray-400">ID: 12345678</p>
            </div>
          </div>
          <div className="flex gap-2">
            {/* মেসেজ বাটন (SMS link) */}
            <a href="sms:+880123456789" className="p-3 bg-green-50 rounded-2xl text-green-600 hover:bg-green-100">
              <MessageCircle size={22}/>
            </a>
            {/* কল বাটন (Phone link) */}
            <a href="tel:+880123456789" className="p-3 bg-green-600 rounded-2xl text-white shadow-lg">
              <Phone size={22}/>
            </a>
          </div>
        </div>

        {/* স্ট্যাটাস কার্ড */}
        <div className="bg-white p-6 rounded-[35px] shadow-2xl border border-gray-50 mb-4">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-green-100 rounded-lg text-green-600"><Truck size={20}/></div>
              <div>
                <p className="text-[10px] text-gray-400 font-bold uppercase">Estimated Time</p>
                <p className="text-sm font-bold text-gray-800">15 - 20 Minutes</p>
              </div>
            </div>
            <div className="text-right">
                <p className="text-[10px] text-gray-400 font-bold uppercase">Distance</p>
                <p className="text-sm font-bold text-gray-800">2.4 km</p>
            </div>
          </div>

          <div className="space-y-4">
            <StatusItem title="Order Confirmed" time="10:30 PM" active />
            <StatusItem title="Preparing Food" time="10:45 PM" active />
            <StatusItem title="Food on the Way" time="11:50 PM" active pulse />
            <StatusItem title="Delivered to you" time="12:30 PM" last />
          </div>

          <button className="w-full mt-8 bg-green-600 hover:bg-green-700 text-white py-4 rounded-2xl font-bold text-lg shadow-xl shadow-green-100 transition-all active:scale-95">
            Order Received
          </button>
        </div>
      </div>
    </div>
  );
};

// টাইমলাইন আইটেম
const StatusItem = ({ title, time, active, last, pulse }) => (
  <div className="flex gap-4">
    <div className="flex flex-col items-center">
      <div className={`w-3 h-3 rounded-full ${active ? 'bg-green-600' : 'bg-gray-200'} ${pulse && 'animate-ping'}`}></div>
      {!last && <div className={`w-0.5 h-8 ${active ? 'bg-green-600' : 'bg-gray-100'}`}></div>}
    </div>
    <div className="flex-1 flex justify-between">
      <p className={`text-xs font-bold ${active ? 'text-gray-800' : 'text-gray-300'}`}>{title}</p>
      <span className="text-[10px] font-bold text-gray-400">{time}</span>
    </div>
  </div>
);

export default Map;
