import React from 'react';
import { ChevronLeft, Info, Plus, Minus, ShoppingBag } from 'lucide-react';

const FoodDetails = () => {
  return (
    <div className="max-w-md mx-auto bg-gray-50 min-h-screen">
      {/* Yellow Header Section */}
      <div className="bg-yellow-400 rounded-b-[40px] p-6 pb-12 relative h-80 flex flex-col items-center">
        <div className="w-full flex justify-between">
          <button className="p-2 bg-white/50 rounded-xl backdrop-blur-md"><ChevronLeft size={20}/></button>
          <button className="p-2 bg-white/50 rounded-xl backdrop-blur-md"><Info size={20}/></button>
        </div>
        <img 
          src="https://www.freepnglogos.com/uploads/burger-png/burger-png-the-alchemist-food-beverages-26.png" 
          alt="Burger" 
          className="w-64 h-64 object-contain mt-4 drop-shadow-2xl"
        />
      </div>

      {/* Content Section */}
      <div className="px-6 -mt-8">
        <div className="bg-white p-6 rounded-3xl shadow-lg border border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Special Burger</h2>
            <span className="text-lg font-bold text-gray-800">Rs: 1,220</span>
          </div>
          <p className="text-gray-500 text-sm leading-relaxed mb-6">
            The Tandoori Fusion Burger is a bold blend of juicy grilled patty infused with smoky tandoori spices, 
            layered with fresh veggies, creamy mint mayo, and a soft toasted bun. It's where Indian flavors meet Western style.
          </p>

          {/* Sides Selection */}
          <div className="bg-gray-50 p-4 rounded-3xl mb-8">
            <div className="flex justify-between items-center mb-3">
              <h4 className="font-bold text-sm">Sides <span className="text-gray-400 text-xs font-normal">(Any Three)</span></h4>
              <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs font-bold">Free</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {['French Fries', 'Cheesy Fries', 'Onion Rings', 'Nuggets'].map((side, i) => (
                <label key={i} className="flex items-center space-x-2 text-sm text-gray-600">
                  <input type="checkbox" className="rounded-md border-gray-300 text-orange-500 focus:ring-orange-500" defaultChecked={i !== 1} />
                  <span>{side}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center bg-gray-100 rounded-xl p-1">
              <button className="p-2 text-gray-500"><Minus size={18}/></button>
              <span className="px-4 font-bold">1</span>
              <button className="p-2 text-orange-500"><Plus size={18}/></button>
            </div>
            {/* সবুজ বাটন নির্দেশানুযায়ী */}
            <button className="flex-1 bg-green-600 hover:bg-green-700 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-green-200">
              <ShoppingBag size={20} /> Add To Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FoodDetails;
