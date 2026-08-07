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
  const [activeCategory, setActiveCategory] = useState(2); // 'All' index default active (index 2)

  const [filters, setFilters] = useState({
    category: "",
    rating: 0,
    minPrice: "",
    maxPrice: "",
    deliveryTime: ""
  });

  // Categories from your image
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
      name: "Noodles Twistara",
      desc: "With Spicy Sauce",
      price: "5.33",
      discount: "-25%",
      image: "https://images.unsplash.com/photo-1552611052-33e04de081de?w=800"
    },
    {
      id: 2,
      name: "Pizza Sicilia",
      desc: "Pizza Sicilia",
      price: "8.99",
      discount: "-25%",
      image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800"
    }
  ];

  // Logic preservation
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
                <MapPin size={18} className="text-gray-400" />
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

        {/* Search Bar & Filter Button (Filter Shape from Image, Color from Ager File) */}
        <div className="flex gap-3 mb-10">
          <div className="flex-1 flex items-center gap-3 rounded-full bg-[#FAFAFA] px-6 py-4 border border-gray-100">
            <Search size={20} className="text-gray-400" />
            <input placeholder="Search for fast food..." className="w-full bg-transparent outline-none text-sm font-medium" />
          </div>
          <button
            onClick={() => setShowFilter(true)}
            className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-white shadow-lg transition-transform active:scale-95" 
          >
            {/* Filter icon from Image 3 */}
            <SlidersHorizontal size={22} />
          </button>
        </div>

        {/* Category Circle Arch (Exactly Like Image 3) */}
        <section className="relative h-44 mb-14 flex items-end justify-center overflow-hidden">
           {/* Gray Curve Arch Background */}
           <div className="absolute top-0 w-[180%] h-[400px] bg-[#F4F4F4] rounded-[100%] -z-10 opacity-70"></div>
           
           <div className="flex justify-between w-full px-2 items-end pb-3">
              {categories.map((item, index) => (
                <div key={index} className="flex flex-col items-center flex-1">
                   <motion.button
                     onClick={() => setActiveCategory(index)}
                     className={`w-14 h-14 rounded-full bg-white shadow-md flex items-center justify-center text-xl transition-all duration-300
                      ${activeCategory === index ? 'scale-110 -translate-y-6 shadow-xl' : 'opacity-80'}`}
                   >
                     {item.icon}
                   </motion.button>
                   <p className={`text-[10px] mt-2 font-bold ${activeCategory === index ? 'text-gray-900' : 'text-gray-400'}`}>
                     {item.name}
                   </p>
                   {activeCategory === index && (
                     <div className="w-6 h-[2px] bg-black rounded-full mt-1"></div>
                   )}
                </div>
              ))}
           </div>
        </section>

        {/* Popular Dishes (Full Image Layout) */}
        <section className="mt-8">
          <div className="grid grid-cols-2 gap-4">
            {popularDishes.map((item) => (
              <motion.div key={item.id} className="bg-white rounded-[32px] p-4 shadow-sm border border-gray-50 relative flex flex-col items-center">
                {/* Discount Badge */}
                <div className="absolute top-12 left-1/2 -translate-x-1/2 bg-black text-white text-[9px] px-2 py-0.5 rounded-full font-bold z-10">
                   {item.discount}
                </div>
                
                {/* Product Image */}
                <img src={item.image} alt={item.name} className="w-32 h-32 object-contain mb-2" />
                
                <div className="w-full text-center">
                   <h3 className="text-xs font-bold text-gray-800">{item.name}</h3>
                   <p className="text-[9px] text-gray-400 mt-1">{item.desc}</p>
                   
                   <div className="mt-4 flex items-center justify-between w-full px-1">
                      <div className="font-bold text-sm">
                         <span className="text-orange-500">$</span> {item.price}
                      </div>
                      <button className={`h-8 w-8 rounded-full flex items-center justify-center shadow-sm 
                        ${item.id === 2 ? 'bg-black text-white' : 'bg-[#FAFAFA] text-gray-400'}`}>
                         {item.id === 2 ? <Minus size={16}/> : <Plus size={16}/>}
                      </button>
                   </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Other Sections preserved with original logic */}
        <section className="mt-12">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">Nearby Restaurants</h2>
            <button onClick={() => navigate("/restaurants")} className="text-primary text-sm font-bold">See All</button>
          </div>
          <div className="space-y-6">
            {restaurants.map((restaurant) => (
              <motion.div
                key={restaurant.id}
                onClick={() => navigate(`/restaurants/${restaurant.id}`)}
                className="bg-white rounded-[32px] overflow-hidden shadow-md border border-gray-50 cursor-pointer"
              >
                <img src={restaurant.image} className="h-52 w-full object-cover" alt={restaurant.name} />
                <div className="p-5 flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-bold">{restaurant.name}</h3>
                    <p className="text-xs text-gray-400 font-bold uppercase mt-1 tracking-wider">{restaurant.category}</p>
                  </div>
                  <div className="text-xs text-gray-500 font-bold flex items-center gap-1.5 bg-gray-50 px-3 py-2 rounded-full">
                    <Clock3 size={16} /> {restaurant.deliveryTime}
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

