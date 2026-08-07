import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
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

  // নতুন ব্যানারের ডেটা
  const banners = [
    { id: 1, image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1000&q=80", title: "Fresh Deals", discount: "50% OFF" },
    { id: 2, image: "https://images.unsplash.com/photo-1543353071-873f17a7a088?w=1000&q=80", title: "Healthy Salads", discount: "Buy 1 Get 1" },
    { id: 3, image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=1000&q=80", title: "Grilled Items", discount: "Free Delivery" },
  ];

  const [filters, setFilters] = useState({
    category: "",
    rating: 0,
    minPrice: "",
    maxPrice: "",
    deliveryTime: ""
  });

  const categories = [
    { name: "Fruits", icon: "🍎" },
    { name: "Drinks", icon: "🍹" },
    { name: "All", icon: "🍱" },
    { name: "Snack", icon: "🍿" },
    { name: "Food", icon: "🥗" }
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
    document.body.style.overflow = showFilter ? "hidden" : "auto";
    return () => { document.body.style.overflow = "auto"; };
  }, [showFilter]);

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
      
      {/* --- Slidable Banner Section (Full Top) --- */}
      <div className="relative h-[420px] w-full">
        {/* Banner Slider */}
        <div className="absolute inset-0 flex overflow-x-auto snap-x snap-mandatory no-scrollbar scroll-smooth">
          {banners.map((banner) => (
            <div key={banner.id} className="min-w-full h-full relative snap-start">
              <img src={banner.image} className="w-full h-full object-cover" alt={banner.title} />
              <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-white"></div>
            </div>
          ))}
        </div>

        {/* Content Over Banner */}
        <div className="absolute inset-0 px-5 pt-6 flex flex-col justify-between">
          
          {/* Header (Location & Profile) */}
          <div className="flex items-center justify-between z-10">
            <div className="flex items-center gap-3 bg-white/20 backdrop-blur-md p-1.5 pr-4 rounded-full border border-white/30">
               <div className="bg-white p-2 rounded-full shadow-sm flex items-center justify-center">
                  <MapPin size={16} className="text-[#1BAC4B]" />
               </div>
               <div>
                  <p className="text-[10px] text-white/80 uppercase font-bold tracking-tight">Delivery to</p>
                  <h2 className="text-[12px] font-bold text-white">11/2 Diriyah, Riyadh</h2>
               </div>
            </div>
            <div className="flex gap-2">
               <button className="h-11 w-11 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/30 relative">
                  <Bell size={20} className="text-white" />
                  <span className="absolute top-3 right-3 w-2 h-2 bg-[#FF5C38] rounded-full border-2 border-white"></span>
               </button>
               {/* Profile Picture instead of Cart */}
               <button onClick={() => navigate("/profile")} className="h-11 w-11 rounded-full border-2 border-white overflow-hidden shadow-lg">
                  <img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&q=80" className="w-full h-full object-cover" alt="profile" />
               </button>
            </div>
          </div>

          <div className="mb-14">
            <h1 className="text-[32px] font-bold text-white mb-6 leading-tight drop-shadow-lg">
               Hungry? <br />
               <span className="font-normal text-white/80">Order & Eat.</span>
            </h1>

            {/* Search & Filter Over Banner */}
            <div className="flex gap-3">
              <div className="flex-1 flex items-center gap-3 rounded-full bg-white px-6 py-4 shadow-xl">
                <Search size={20} className="text-gray-400" />
                <input placeholder="Search for fast food..." className="w-full bg-transparent outline-none text-sm font-medium" />
              </div>
              <button
                onClick={() => setShowFilter(true)}
                className="flex h-14 w-14 items-center justify-center rounded-full bg-[#1BAC4B] text-white shadow-lg transition-transform active:scale-95" 
              >
                <SlidersHorizontal size={22} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-5">
        
        {/* Category Circle Arch (Already styled in your code) */}
        <section className="relative h-40 mb-12 flex items-end justify-center -mt-10 z-20">
           <div className="absolute top-[-15%] w-[150%] h-[300px] bg-[#FDFDFD] rounded-[100%] -z-10 border-t border-gray-100 shadow-[0_-20px_40px_rgba(0,0,0,0.03)]"></div>
           
           <div className="flex justify-between w-full px-1 items-end pb-2">
              {categories.map((item, index) => (
                <div key={index} className="flex flex-col items-center flex-1">
                   <motion.button
                     onClick={() => setActiveCategory(index)}
                     className={`w-14 h-14 rounded-full bg-white shadow-md flex items-center justify-center text-2xl transition-all duration-300
                      ${activeCategory === index ? 'scale-110 -translate-y-6 shadow-xl ring-2 ring-[#1BAC4B]/20' : 'opacity-80'}`}
                   >
                     {item.icon}
                   </motion.button>
                   <p className={`text-[10px] mt-2 font-bold ${activeCategory === index ? 'text-gray-900' : 'text-gray-400'}`}>
                     {item.name}
                   </p>
                   {activeCategory === index && (
                     <div className="w-5 h-[3px] bg-black rounded-full mt-1"></div>
                   )}
                </div>
              ))}
           </div>
        </section>

        {/* Popular Dishes */}
        <section className="mt-8 relative pt-10 pb-16">
          <div className="absolute inset-0 bg-[#F4F4F4]/60 rounded-t-[100px] -z-10 scale-110 translate-y-6"></div>
          
          <div className="mb-6 flex items-center justify-between px-1">
             <h2 className="text-xl font-bold text-gray-900">Popular Now</h2>
             <button className="text-xs font-bold text-gray-400">View All</button>
          </div>

          <div className="flex gap-6 overflow-x-auto pb-4 no-scrollbar snap-x snap-mandatory px-2">
            {popularDishes.map((item) => (
              <motion.div 
                key={item.id} 
                className="min-w-[190px] snap-center bg-white rounded-[40px] p-6 shadow-xl border border-gray-50 flex flex-col items-center relative"
              >
                <div className="mb-4">
                  <img src={item.image} alt={item.name} className="w-32 h-32 object-cover rounded-full shadow-lg ring-4 ring-white" />
                </div>
                <div className="w-full text-center">
                   <h3 className="text-[13px] font-bold text-gray-800 leading-tight h-8 line-clamp-2">{item.name}</h3>
                   <p className="text-[10px] text-gray-400 mt-2 font-bold flex items-center justify-center gap-1">
                      🔥 {item.calorie}
                   </p>
                   <div className="mt-4 font-bold text-[18px] text-[#FF5C38]">
                      {item.price}
                   </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Featured Items */}
        <section className="mt-12">
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
        </section>

        {/* People looking for */}
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
                 <button className="h-11 w-11 bg-[#1BAC4B] text-white rounded-xl flex items-center justify-center shadow-sm active:scale-95 transition-transform">
                   <Plus size={22} />
                 </button>
               </div>
             ))}
           </div>
        </section>

        {/* Nearby Restaurants */}
        <section className="mt-12">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">Nearby Restaurants</h2>
            <button onClick={() => navigate("/restaurants")} className="text-[#FF5C38] text-sm font-bold">See All</button>
          </div>
          <div className="space-y-8">
            {restaurants.map((restaurant) => (
              <motion.div
                key={restaurant.id}
                onClick={() => navigate(`/restaurants/${restaurant.id}`)}
                className="bg-white rounded-[32px] overflow-hidden shadow-lg border border-gray-50 group cursor-pointer"
              >
                <div className="relative h-56">
                  <img src={restaurant.image} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" alt={restaurant.name} />
                  <div className="absolute left-5 top-5 bg-white/90 px-3.5 py-1.5 rounded-full shadow-md backdrop-blur-sm">
                    <div className="flex items-center gap-1.5 font-bold text-xs">
                       <Star size={14} className="fill-yellow-400 text-yellow-400" /> {restaurant.rating}
                    </div>
                  </div>
                </div>
                <div className="p-6 flex justify-between items-center">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{restaurant.name}</h3>
                    <p className="text-xs text-gray-400 font-bold uppercase mt-1.5 tracking-widest">{restaurant.category}</p>
                  </div>
                  <div className="text-xs text-gray-500 font-bold flex items-center gap-1.5 bg-gray-50 px-3 py-2 rounded-full">
                    <Clock3 size={16} className="text-gray-400" /> {restaurant.deliveryTime}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

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
