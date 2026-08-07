import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Search,
  MapPin,
  Star,
  Plus,
  Clock3,
  SlidersHorizontal,
  Bell,
} from "lucide-react";

import { useNavigate } from "react-router-dom";
import FilterBottomSheet from "../../components/FilterBottomSheet/FilterBottomSheet";
import restaurantService from "../../services/restaurantService";

export default function HomePage() {
  const navigate = useNavigate();
  const [restaurants, setRestaurants] = useState([]);
  const [showFilter, setShowFilter] = useState(false);
  const [activeCategory, setActiveCategory] = useState(2); 

  const [filters, setFilters] = useState({
    category: "",
    rating: 0,
    minPrice: "",
    maxPrice: "",
    deliveryTime: ""
  });

  // Slidable Banner data
  const banners = [
    {
      id: 1,
      discount: "30% OFF",
      title: "The Fastest in Delivery Food",
      image: "https://img.freepik.com/free-vector/delivery-staff-ride-motorcycles-shopping-concept_1150-34879.jpg",
      bgColor: "bg-[#FDE8E8]"
    }
  ];

  const categories = [
    { name: "Pizza", icon: "🍕" },
    { name: "Cupcake", icon: "🧁" },
    { name: "Burger", icon: "🍔" },
    { name: "Salad", icon: "🥗" },
    { name: "Pasta", icon: "🍝" }
  ];

  const popularDishes = [
    {
      id: 1,
      name: "Cabbage with sauce",
      calorie: "170 Kal",
      price: "$25.00",
      image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&q=80"
    },
    {
      id: 2,
      name: "Puree soup with turkey",
      calorie: "100 Kal",
      price: "$35.00",
      image: "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=800&q=80"
    },
    {
        id: 3,
        name: "Three-Meat Lasagna",
        calorie: "250 Kal",
        price: "$45.00",
        image: "https://images.unsplash.com/photo-1574894709920-11b28e7367e3?w=800&q=80"
    }
  ];

  const featuredItems = [
    {
      id: 1,
      title: "Egg salad",
      rating: "4.3",
      time: "10-15 mins",
      deliveryFee: "$2 delivery",
      image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=1000&q=80",
      tags: ["COFFEE", "CHICKEN", "FAST FOOD"]
    }
  ];

  const peopleLookingFor = [
    {
      id: 1,
      dish: "Spacy fresh crab",
      restaurant: "Waroenk kita",
      image: "https://images.unsplash.com/photo-1551248429-40975aa4de74?w=500&q=80"
    }
  ];

  useEffect(() => {
    const loadRestaurants = async () => {
      try {
        const response = await restaurantService.getRestaurants();
        setRestaurants(response.restaurants || []);
      } catch (error) {
        console.error(error);
      }
    };
    loadRestaurants();
  }, []);

  return (
    <div className="min-h-screen bg-[#FDFDFD] pb-24 overflow-x-hidden">
      
      {/* --- Slidable Banner (Top screen coverage) --- */}
      <div className="relative h-[420px]">
        <div className="absolute inset-0 flex overflow-x-auto no-scrollbar snap-x snap-mandatory">
          {banners.map((banner) => (
            <div key={banner.id} className={`min-w-full h-full snap-center ${banner.bgColor} relative flex items-end px-6 pb-12`}>
              <div className="w-1/2 relative z-10 mb-6">
                <div className="inline-block bg-white/80 px-2 py-1 rounded-lg border border-red-100 mb-2">
                  <span className="text-[12px] font-bold text-red-500 uppercase italic">30% OFF</span>
                </div>
                <h2 className="text-2xl font-bold text-gray-800 leading-tight mb-4">
                  The Fastest in Delivery <span className="text-red-500">Food</span>
                </h2>
                <button className="bg-black text-white text-[10px] font-bold px-6 py-2.5 rounded-full shadow-lg">Order Now</button>
              </div>
              <div className="absolute right-0 bottom-10 w-1/2 flex justify-end pr-4">
                <img src={banner.image} alt="delivery" className="w-44 h-44 object-contain" />
              </div>
            </div>
          ))}
        </div>

        {/* Header Overlay */}
        <div className="absolute top-0 left-0 w-full z-20 px-5 pt-10">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    {/* Profile picture instead of Bag icon */}
                    <img 
                        src="https://api.dicebear.com/7.x/avataaars/svg?seed=Jon" 
                        alt="profile" 
                        className="w-11 h-11 rounded-full bg-white border-2 border-white shadow-md object-cover"
                    />
                    <div>
                        <p className="text-[14px] font-bold text-gray-800">Hello Jon 👋</p>
                        <p className="text-[10px] text-gray-400 font-medium">Good Morning</p>
                    </div>
                </div>
                <div className="flex gap-2 items-center">
                    <button className="h-10 w-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm relative">
                        <Bell size={18} className="text-gray-600" />
                        <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-red-500 rounded-full"></span>
                    </button>
                </div>
            </div>

            {/* Search Bar */}
            <div className="flex gap-3">
                <div className="flex-1 flex items-center gap-3 rounded-full bg-white px-6 py-4 shadow-sm">
                    <Search size={20} className="text-gray-400" />
                    <input placeholder="Search services..." className="w-full bg-transparent outline-none text-sm font-medium" />
                </div>
                <button
                    onClick={() => setShowFilter(true)}
                    className="flex h-14 w-14 items-center justify-center rounded-full bg-black text-white shadow-lg" 
                >
                    <SlidersHorizontal size={22} />
                </button>
            </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl relative z-10 -mt-8 bg-[#FDFDFD] rounded-t-[40px] pt-10">
        
        {/* Category Section (Clean Image 1 Style - No background shape) */}
        <section className="px-5 mb-10">
          <div className="flex items-center justify-between mb-6">
             <h2 className="text-lg font-bold text-gray-900">Category</h2>
             <button className="text-xs font-bold text-gray-400">See All</button>
          </div>
          <div className="flex items-center overflow-x-auto no-scrollbar gap-5">
              {categories.map((item, index) => (
                <div key={index} className="flex flex-col items-center flex-shrink-0">
                   <motion.button
                     onClick={() => setActiveCategory(index)}
                     className={`w-[70px] h-[90px] rounded-[36px] flex items-center justify-center text-3xl transition-all duration-300
                      ${activeCategory === index ? 'bg-[#E31837] text-white shadow-xl scale-105' : 'bg-[#FAFAFA] border border-gray-100 opacity-70'}`}
                   >
                     {item.icon}
                   </motion.button>
                   <p className={`text-[11px] mt-2 font-bold ${activeCategory === index ? 'text-gray-900' : 'text-gray-400'}`}>
                     {item.name}
                   </p>
                </div>
              ))}
          </div>
        </section>

        {/* --- Popular Now (Marked Red Box Style - Without search button) --- */}
        <section className="relative pt-6 pb-12 overflow-hidden">
          {/* Subtle curved background to match image mark */}
          <div className="absolute inset-0 bg-[#F4F4F4]/70 rounded-t-[140px] -z-10 translate-y-14 scale-x-125"></div>
          
          <div className="px-6 flex items-center justify-between mb-20">
             <h2 className="text-xl font-bold text-gray-900">Popular Now</h2>
             <button className="text-xs font-bold text-gray-400">View All</button>
          </div>

          {/* Slidable Items with Trapezoid backgrounds */}
          <div className="flex items-end justify-center overflow-x-auto no-scrollbar snap-x snap-mandatory gap-4 px-10">
            {popularDishes.map((item, index) => (
              <div key={item.id} className="relative flex flex-col items-center snap-center min-w-[180px]">
                
                {/* The Tapered/Trapezoid Card Background */}
                <div className={`w-[170px] h-[150px] bg-[#EAEAEA] rounded-t-[80px] rounded-b-[24px] transition-all duration-500 relative flex flex-col items-center justify-end pb-8 
                  ${index === 1 ? 'bg-[#E2E2E2] scale-110 opacity-100 z-10' : 'opacity-40 scale-95'}`}>
                  
                  {/* Circular Image overflowing top */}
                  <div className="absolute top-[-55px] left-1/2 -translate-x-1/2">
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className={`w-32 h-32 object-cover rounded-full shadow-2xl ring-4 ring-white transition-all 
                        ${index === 1 ? 'scale-110' : 'scale-90'}`}
                    />
                  </div>
                  
                  <div className="px-4 text-center">
                    <h3 className="text-[11px] font-bold text-gray-800 leading-tight h-6 line-clamp-2">{item.name}</h3>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Rest of the Page (Featured & Looking for) */}
        <div className="px-5 mt-10">
            <h2 className="text-xl font-bold mb-6 text-gray-900">Featured Items</h2>
            {featuredItems.map(item => (
                <div key={item.id} className="bg-white rounded-[30px] overflow-hidden shadow-sm border border-gray-50 mb-6">
                    <div className="relative h-48">
                        <img src={item.image} className="h-full w-full object-cover" alt={item.title} />
                        <div className="absolute top-4 left-4 bg-white px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-md">
                        <span className="text-[11px] font-bold">{item.rating}</span>
                        <Star size={12} className="fill-yellow-400 text-yellow-400" />
                        </div>
                    </div>
                    <div className="p-5 flex justify-between items-center">
                        <div>
                        <h3 className="font-bold text-[17px] text-gray-800">{item.title} ✅</h3>
                        <p className="text-[11px] text-gray-400 font-bold mt-1 uppercase tracking-wider">{item.time} • {item.deliveryFee}</p>
                        </div>
                        <div className="flex gap-2">
                        {item.tags.slice(0, 2).map(tag => (
                            <span key={tag} className="bg-gray-100 px-3 py-1.5 rounded-lg text-[10px] font-bold text-gray-500 uppercase">{tag}</span>
                        ))}
                        </div>
                    </div>
                </div>
            ))}

            <section className="mt-12">
            <h2 className="text-xl font-bold mb-6 text-gray-900">People are looking for 🔥</h2>
            <div className="space-y-4">
                {peopleLookingFor.map((item) => (
                <div key={item.id} className="flex items-center justify-between bg-white rounded-[24px] p-4 shadow-sm border border-gray-50">
                    <div className="flex items-center gap-4">
                    <img src={item.image} alt={item.dish} className="h-16 w-16 rounded-2xl object-cover shadow-sm" />
                    <div>
                        <h3 className="font-bold text-sm text-gray-800">{item.dish}</h3>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tight">{item.restaurant}</p>
                    </div>
                    </div>
                    <button className="h-11 w-11 bg-[#1BAC4B] text-white rounded-xl flex items-center justify-center shadow-sm">
                        <Plus size={22} />
                    </button>
                </div>
                ))}
            </div>
            </section>
        </div>

        <FilterBottomSheet
          open={showFilter}
          onClose={() => setShowFilter(false)}
          filters={filters}
          setFilters={setFilters}
          onApply={() => setShowFilter(false)}
        />
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />
    </div>
  );
}
