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
  ChevronRight,
  Pizza,
  Beef,
  Coffee,
  IceCream2,
  Salad,
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
  const [activeCategory, setActiveCategory] = useState(0);
  const [filters, setFilters] = useState({
    category: "",
    rating: 0,
    minPrice: "",
    maxPrice: "",
    deliveryTime: ""
  });

  // Category data updated for the "Circle Arch" style
  const categories = [
    { name: "Fruits", icon: "🍎" },
    { name: "Drinks", icon: "🍹" },
    { name: "All", icon: "🍱" },
    { name: "Snack", icon: "🍿" },
    { name: "Food", icon: "🥗" }
  ];

  const featuredItems = [
    {
      id: 1,
      title: "Egg salad",
      rating: "4.3",
      time: "10-15 mins",
      deliveryFee: "$2 delivery",
      image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800",
      tags: ["COFFEE", "CHICKEN", "FAST FOOD"]
    },
    {
      id: 2,
      title: "Starbucks",
      rating: "4.3",
      time: "10-15 mins",
      deliveryFee: "$2 delivery",
      image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800",
      tags: ["COFFEE"]
    }
  ];

  const popularDishes = [
    {
      id: 1,
      name: "Classic Burger",
      calorie: "170 Kal",
      price: "$25.00",
      image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800"
    },
    {
      id: 2,
      name: "Chocolate ice",
      calorie: "100 Kal",
      price: "$35.00",
      image: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=800"
    }
  ];

  const peopleLookingFor = [
    {
      id: 1,
      dish: "Spacy fresh crab",
      restaurant: "Waroenk kita",
      image: "https://images.unsplash.com/photo-1551248429-40975aa4de74?w=300"
    },
    {
      id: 2,
      dish: "Bruschetta",
      restaurant: "Waroenk kita",
      image: "https://images.unsplash.com/photo-1572656631137-7935297eff55?w=300"
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
    <div className="min-h-screen bg-[#F5F5F5] pb-20">
      <div className="mx-auto max-w-7xl px-5 py-6">
        
        {/* Header - Image 3 Style */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
             <div className="bg-white p-2 rounded-full shadow-sm">
                <MapPin size={18} className="text-gray-400" />
             </div>
             <div>
                <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Delivery to</p>
                <h2 className="text-sm font-bold text-gray-800">11/2 Diriyah, Riyadh</h2>
             </div>
          </div>
          <div className="flex gap-2">
             <button className="h-10 w-10 bg-white rounded-full flex items-center justify-center shadow-sm relative">
                <Bell size={20} className="text-gray-600" />
                <span className="absolute top-2 right-2 w-2 h-2 bg-orange-500 rounded-full border-2 border-white"></span>
             </button>
             <button className="h-10 w-10 bg-white rounded-full flex items-center justify-center shadow-sm">
                <ShoppingBag size={20} className="text-gray-600" />
             </button>
          </div>
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-6">Hungry? <span className="font-normal text-gray-400">Order & Eat.</span></h1>

        {/* Search & Filter - Image 2 Style Color */}
        <div className="flex gap-3 mb-8">
          <div className="flex-1 flex items-center gap-3 rounded-full bg-white px-5 py-4 shadow-sm border border-gray-100">
            <Search size={20} className="text-gray-400" />
            <input placeholder="Search for fast food..." className="w-full bg-transparent outline-none text-sm" />
          </div>
          <button
            onClick={() => setShowFilter(true)}
            className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#1BAC4B] text-white shadow-lg" // Image 2 style teal color
          >
            <SlidersHorizontal size={22} />
          </button>
        </div>

        {/* Categories - Image 3 Circle Slide Style */}
        <section className="relative mt-12 mb-10">
          <div className="absolute inset-0 -top-10 flex justify-center overflow-hidden pointer-events-none">
             <div className="w-[120%] h-[200px] bg-white rounded-[100%] shadow-sm opacity-60"></div>
          </div>
          
          <div className="relative flex justify-between px-2">
            {categories.map((item, index) => (
              <motion.button
                key={item.name}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveCategory(index)}
                className="flex flex-col items-center z-10"
              >
                <div className={`h-16 w-16 rounded-full flex items-center justify-center text-2xl transition-all duration-300 shadow-lg ${activeCategory === index ? 'bg-white scale-110 -translate-y-4' : 'bg-white opacity-80'}`}>
                  {item.icon}
                </div>
                <p className={`mt-2 text-xs font-semibold ${activeCategory === index ? 'text-gray-900' : 'text-gray-400'}`}>
                  {item.name}
                </p>
                {activeCategory === index && (
                  <div className="mt-1 w-5 h-[3px] bg-black rounded-full" />
                )}
              </motion.button>
            ))}
          </div>
        </section>

        {/* Popular Dishes - Image 1 Style */}
        <section className="mt-10">
          <div className="mb-5 flex items-center justify-between px-2">
            <h2 className="text-xl font-bold">Popular Dishes</h2>
            <button className="text-xs font-bold text-gray-400">See all</button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {popularDishes.map((item) => (
              <motion.div key={item.id} className="bg-white rounded-[30px] p-4 shadow-sm relative border border-gray-50">
                <button className="absolute right-4 top-4 z-10">
                  <Heart size={18} className="text-red-500 fill-red-500" />
                </button>
                <div className="flex justify-center mb-2">
                  <img src={item.image} alt={item.name} className="h-28 w-28 object-cover rounded-full shadow-lg" />
                </div>
                <h3 className="font-bold text-sm text-gray-800">{item.name}</h3>
                <p className="text-[10px] text-gray-400 mt-1 flex items-center gap-1 font-bold">
                   🔥 {item.calorie}
                </p>
                <div className="mt-4 flex items-center justify-between">
                  <span className="font-bold text-orange-500 text-sm">{item.price}</span>
                  <button className="h-8 w-8 bg-black text-white rounded-xl flex items-center justify-center">
                    <Plus size={16} />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Featured Items - Image 2 Style */}
        <section className="mt-10">
          <div className="mb-5 flex items-center justify-between px-2">
            <h2 className="text-xl font-bold">Featured Items</h2>
            <button className="text-[#FF5C38] text-sm font-semibold">View All</button>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide">
            {featuredItems.map((item) => (
              <motion.div key={item.id} className="min-w-[280px] snap-start bg-white rounded-[25px] overflow-hidden shadow-md">
                <div className="relative h-40">
                  <img src={item.image} alt={item.title} className="h-full w-full object-cover" />
                  <div className="absolute top-3 left-3 bg-white px-2 py-1 rounded-full flex items-center gap-1 shadow-sm">
                    <span className="text-[10px] font-bold">{item.rating}</span>
                    <Star size={10} className="fill-yellow-400 text-yellow-400" />
                  </div>
                  <button className="absolute top-3 right-3 h-8 w-8 bg-white rounded-full flex items-center justify-center shadow-md">
                     <Heart size={16} className="text-red-500" />
                  </button>
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-gray-800">{item.title} ✅</h3>
                  <div className="flex items-center gap-3 mt-2 text-[10px] text-gray-400 font-bold">
                    <span className="flex items-center gap-1"><Clock3 size={12}/> {item.time}</span>
                    <span>• {item.deliveryFee}</span>
                  </div>
                  <div className="mt-3 flex gap-2">
                    {item.tags.slice(0, 2).map(tag => (
                       <span key={tag} className="bg-gray-100 px-2 py-1 rounded-md text-[9px] font-bold text-gray-500">{tag}</span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* People Looking For - Image 2 Style */}
        <section className="mt-10">
          <div className="mb-5 flex items-center justify-between px-2">
            <h2 className="text-xl font-bold">People are looking for 🔥</h2>
            <button className="text-gray-400 text-sm font-bold">See all</button>
          </div>
          <div className="space-y-4">
            {peopleLookingFor.map((item) => (
              <div key={item.id} className="flex items-center justify-between bg-white rounded-3xl p-3 shadow-sm border border-gray-50">
                <div className="flex items-center gap-4">
                  <img src={item.image} alt={item.dish} className="h-14 w-14 rounded-2xl object-cover" />
                  <div>
                    <h3 className="font-bold text-sm">{item.dish}</h3>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tight">{item.restaurant}</p>
                  </div>
                </div>
                <button className="h-10 w-10 bg-[#1BAC4B] text-white rounded-xl flex items-center justify-center shadow-sm">
                  <Plus size={20} />
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Nearby Restaurants - Original Logic Kept */}
        <section className="mt-10">
          <div className="mb-5 flex items-center justify-between px-2">
            <h2 className="text-xl font-bold">Nearby Restaurants</h2>
            <button onClick={() => navigate("/restaurants")} className="text-[#FF5C38] text-sm font-semibold">See All</button>
          </div>
          <div className="space-y-6">
            {restaurants.map((restaurant) => (
              <motion.div
                key={restaurant.id}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate(`/restaurants/${restaurant.id}`)}
                className="cursor-pointer overflow-hidden rounded-[25px] bg-white shadow-lg border border-gray-50"
              >
                <div className="relative">
                  <img
                    src={restaurant.image || "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200"}
                    alt={restaurant.name}
                    className="h-52 w-full object-cover"
                  />
                  <div className="absolute left-4 top-4 flex items-center gap-1 rounded-full bg-white/90 px-3 py-1 backdrop-blur shadow">
                    <Star size={12} className="fill-yellow-400 text-yellow-400" />
                    <span className="font-bold text-xs">{restaurant.rating}</span>
                  </div>
                </div>
                <div className="p-4 flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-bold">{restaurant.name}</h3>
                    <p className="text-xs text-gray-400 font-bold">{restaurant.category || "Restaurant"}</p>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-gray-500 font-bold">
                    <Clock3 size={14} />
                    <span>{restaurant.deliveryTime}</span>
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

      {/* Modern Bottom Navigation Bar - From Image 3 */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 w-[90%] max-w-md bg-black rounded-full p-2 flex items-center justify-between shadow-2xl z-50">
          <div className="h-12 w-12 bg-orange-500 rounded-full flex items-center justify-center">
              <div className="w-5 h-5 bg-white rounded-sm"></div>
          </div>
          <button className="p-3 text-gray-400"><Heart size={20}/></button>
          <button className="p-3 text-gray-400"><MapPin size={20}/></button>
          <button className="p-3 text-gray-400"><ShoppingBag size={20}/></button>
          <button className="p-3 text-gray-400"><div className="w-6 h-6 border-2 border-gray-400 rounded-full flex items-center justify-center text-[10px] font-bold">👤</div></button>
      </div>
    </div>
  );
}
