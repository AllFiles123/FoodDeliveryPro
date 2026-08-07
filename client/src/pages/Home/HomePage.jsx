import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Search,
  MapPin,
  Star,
  Heart,
  Plus,
  Clock3,
  SlidersHorizontal,
  Bell,
  ShoppingBag,
  Minus
} from "lucide-react";

import { useNavigate } from "react-router-dom";
import FilterBottomSheet from "../../components/FilterBottomSheet/FilterBottomSheet";
import restaurantService from "../../services/restaurantService";

export default function HomePage() {
  const navigate = useNavigate();
  const [restaurants, setRestaurants] = useState([]);
  const [showFilter, setShowFilter] = useState(false);
  const [activeCategory, setActiveCategory] = useState(2); // 'All' index default active

  const [filters, setFilters] = useState({
    category: "",
    rating: 0,
    minPrice: "",
    maxPrice: "",
    deliveryTime: ""
  });

  // Categories from Image 3
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
      name: "Classic Burger",
      calorie: "170 Kal",
      price: "$25.00",
      image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&q=80"
    },
    {
      id: 2,
      name: "Chocolate ice",
      calorie: "100 Kal",
      price: "$35.00",
      image: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=800&q=80"
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
    <div className="min-h-screen bg-[#FDFDFD] pb-10">
      <div className="mx-auto max-w-7xl px-5 py-6">
        
        {/* Header Section */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
             <div className="bg-white p-2.5 rounded-full shadow-sm border border-gray-100 flex items-center justify-center">
                <MapPin size={18} className="text-gray-500" />
             </div>
             <div>
                <p className="text-[10px] text-gray-400 uppercase font-bold tracking-tight">Delivery to</p>
                <h2 className="text-[13px] font-bold text-gray-800">11/2 Diriyah, Riyadh</h2>
             </div>
          </div>
          <div className="flex gap-2">
             <button className="h-11 w-11 bg-white rounded-full flex items-center justify-center shadow-sm border border-gray-100 relative">
                <Bell size={20} className="text-gray-600" />
                <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-[#FF5C38] rounded-full border-2 border-white"></span>
             </button>
             <button className="h-11 w-11 bg-white rounded-full flex items-center justify-center shadow-sm border border-gray-100">
                <ShoppingBag size={20} className="text-gray-600" />
             </button>
          </div>
        </div>

        <h1 className="text-[32px] font-bold text-gray-900 mb-6 leading-tight">Hungry? <span className="font-normal text-gray-400">Order & Eat.</span></h1>

        {/* Search & Teal Filter Button */}
        <div className="flex gap-3 mb-10">
          <div className="flex-1 flex items-center gap-3 rounded-full bg-[#FAFAFA] px-6 py-4 border border-gray-100">
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

        {/* Category Circle Arch (Image 3 style) */}
        <section className="relative h-48 mb-12 flex items-end justify-center overflow-hidden">
           <div className="absolute top-[-15%] w-[150%] h-[320px] bg-[#F4F4F4] rounded-[100%] -z-10 opacity-80 border-b border-gray-100"></div>
           
           <div className="flex justify-between w-full px-1 items-end pb-2">
              {categories.map((item, index) => (
                <div key={index} className="flex flex-col items-center flex-1">
                   <motion.button
                     onClick={() => setActiveCategory(index)}
                     className={`w-14 h-14 rounded-full bg-white shadow-md flex items-center justify-center text-2xl transition-all duration-300
                      ${activeCategory === index ? 'scale-110 -translate-y-6 shadow-xl ring-2 ring-white' : 'opacity-80'}`}
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

        {/* Popular Dishes (Image 1 style) */}
        <section className="mt-8">
          <div className="mb-5 flex items-center justify-between px-1">
             <h2 className="text-xl font-bold text-gray-900">Popular Dishes</h2>
             <button className="text-xs font-bold text-gray-400">See all</button>
          </div>
          <div className="grid grid-cols-2 gap-5">
            {popularDishes.map((item) => (
              <motion.div key={item.id} className="bg-white rounded-[32px] p-5 shadow-sm border border-gray-50 relative flex flex-col items-center">
                <button className="absolute right-5 top-5 z-10 bg-white/80 p-1.5 rounded-full shadow-sm">
                  <Heart size={18} className="text-red-500 fill-red-500" />
                </button>
                <img src={item.image} alt={item.name} className="w-32 h-32 object-cover rounded-full shadow-lg mb-4 ring-4 ring-white" />
                <div className="w-full text-center">
                   <h3 className="text-sm font-bold text-gray-800">{item.name}</h3>
                   <p className="text-[10px] text-gray-400 mt-1 font-bold flex items-center justify-center gap-1">
                      🔥 {item.calorie}
                   </p>
                   <div className="mt-5 flex items-center justify-between w-full">
                      <span className="font-bold text-[15px] text-[#FF5C38]">{item.price}</span>
                      <button className="h-9 w-9 bg-black text-white rounded-2xl flex items-center justify-center shadow-lg active:scale-90 transition-transform">
                         <Plus size={18}/>
                      </button>
                   </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Featured Items (Image 2 style) */}
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

        {/* People looking for (Image 2 style) */}
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

        {/* Nearby Restaurants (Logic preserved) */}
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
    </div>
  );
}

