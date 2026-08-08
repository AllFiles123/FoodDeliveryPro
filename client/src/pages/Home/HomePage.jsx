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
  const [activeTimeFilter, setActiveTimeFilter] = useState("Today");

  const [userLocation, setUserLocation] = useState(
    () => localStorage.getItem("userLocation") || "Set your location"
  );

  useEffect(() => {
    const updateLocation = () => {
      setUserLocation(
        localStorage.getItem("userLocation") || "Set your location"
      );
    };

    window.addEventListener("locationChanged", updateLocation);

    return () => {
      window.removeEventListener("locationChanged", updateLocation);
    };
  }, []);

  const [currentBanner, setCurrentBanner] = useState(0);

  const banners = [
    {
      id: 1,
      image:
        "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1000&q=80",
      title: "Fresh Deals",
    },
    {
      id: 2,
      image:
        "https://images.unsplash.com/photo-1543353071-873f17a7a088?w=1000&q=80",
      title: "Healthy Salads",
    },
    {
      id: 3,
      image:
        "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=1000&q=80",
      title: "Grilled Items",
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentBanner((prev) =>
        prev === banners.length - 1 ? 0 : prev + 1
      );
    }, 3000);

    return () => clearInterval(timer);
  }, [banners.length]);

  const [filters, setFilters] = useState({
    category: "",
    rating: 0,
    minPrice: "",
    maxPrice: "",
    deliveryTime: "",
  });

  const categories = [
    { name: "Fruits", icon: "🍎" },
    { name: "Drinks", icon: "🍹" },
    { name: "All", icon: "🍱" },
    { name: "Snack", icon: "🍿" },
    { name: "Food", icon: "🥗" },
  ];

  const popularDishes = [
    {
      id: 1,
      name: "Cabbage with sauce",
      calorie: "170 Kal",
      price: "$25.00",
      image:
        "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&q=80",
    },
    {
      id: 2,
      name: "Puree soup with turkey",
      calorie: "100 Kal",
      price: "$35.00",
      image:
        "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=800&q=80",
    },
    {
      id: 3,
      name: "Three-Meat Lasagna",
      calorie: "250 Kal",
      price: "$45.00",
      image:
        "https://images.unsplash.com/photo-1574894709920-11b28e7367e3?w=800&q=80",
    },
  ];

  const featuredItems = [
    {
      id: 1,
      title: "Egg salad",
      rating: "4.3",
      time: "10-15 mins",
      deliveryFee: "$2 delivery",
      image:
        "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=1000&q=80",
      tags: ["COFFEE", "CHICKEN", "FAST FOOD"],
    },
  ];

  const peopleLookingFor = [
    {
      id: 1,
      dish: "Spacy fresh crab",
      restaurant: "Waroenk kita",
      image:
        "https://images.unsplash.com/photo-1551248429-40975aa4de74?w=500&q=80",
    },
  ];

  useEffect(() => {
    document.body.style.overflow = showFilter ? "hidden" : "auto";

    return () => {
      document.body.style.overflow = "auto";
    };
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

      {/* --- 1. FULL AUTO-SLIDING BANNER --- */}
      <div className="relative h-[480px] w-full overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.img
            key={currentBanner}
            src={banners[currentBanner].image}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0 w-full h-full object-cover"
          />
        </AnimatePresence>

        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-[#FDFDFD]" />

        <div className="absolute inset-0 px-5 pt-6 flex flex-col">

          {/* Header Area */}
          <div className="flex items-center justify-between z-10 mb-8">

            <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md p-1 pr-4 rounded-full border border-white/20">

              <div className="bg-white p-2 rounded-full shadow-sm flex items-center justify-center">
                <MapPin size={16} className="text-[#1BAC4B]" />
              </div>

              <div>
                <p className="text-[10px] text-white/80 uppercase font-bold tracking-tight">
                  Delivery to
                </p>

                <h2 className="text-[12px] font-bold text-white">
                  {userLocation}
                </h2>
              </div>

            </div>

            <div className="flex gap-2">

              <button className="h-11 w-11 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20 relative">
                <Bell size={20} className="text-white" />

                <span className="absolute top-3.5 right-3.5 w-2 h-2 bg-[#FF5C38] rounded-full border-2 border-white" />
              </button>

              <button
                onClick={() => navigate("/profile")}
                className="h-11 w-11 rounded-full border-2 border-white overflow-hidden shadow-lg"
              >
                <img
                  src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&q=80"
                  className="w-full h-full object-cover"
                  alt="profile"
                />
              </button>

            </div>
          </div>

          <h1 className="text-[34px] font-bold text-white mb-6 leading-tight drop-shadow-md">
            Hungry? <br />
            <span className="font-normal text-white/80">
              Order & Eat.
            </span>
          </h1>

          {/* Search Bar */}
          <div className="flex gap-3 mt-4">

            <div className="flex-1 flex items-center gap-3 rounded-2xl bg-white px-5 py-4 shadow-2xl">
              <Search size={20} className="text-gray-400" />

              <input
                placeholder="Search for fast food..."
                className="w-full bg-transparent outline-none text-sm font-medium"
              />
            </div>

            <button
              onClick={() => setShowFilter(true)}
              className="flex h-[58px] w-[58px] items-center justify-center rounded-2xl bg-[#1BAC4B] text-white shadow-lg active:scale-95 transition-all"
            >
              <SlidersHorizontal size={22} />
            </button>

          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-5 relative">

        {/* --- 2. BIG CATEGORY ICONS --- */}
        <section className="relative h-36 flex items-end justify-center -mt-16 z-20">

          <div className="absolute top-0 w-[140%] h-[280px] bg-[#FDFDFD] rounded-[100%] -z-10 shadow-[0_-15px_30px_rgba(0,0,0,0.05)] border-t border-gray-50" />

          <div className="flex justify-between w-full px-1 items-end pb-4">

            {categories.map((item, index) => (

              <div
                key={index}
                className="flex flex-col items-center flex-1"
              >

                <motion.button
                  onClick={() => setActiveCategory(index)}
                  className={`w-16 h-16 rounded-full bg-white shadow-lg flex items-center justify-center text-3xl transition-all duration-300
                  ${
                    activeCategory === index
                      ? "scale-110 -translate-y-4 ring-4 ring-[#1BAC4B]/10"
                      : "opacity-90"
                  }`}
                >
                  {item.icon}
                </motion.button>

                <p
                  className={`text-[11px] mt-2 font-bold ${
                    activeCategory === index
                      ? "text-gray-900"
                      : "text-gray-400"
                  }`}
                >
                  {item.name}
                </p>

              </div>

            ))}

          </div>
        </section>

        {/* --- 3. POPULAR NOW --- */}
        <section className="mt-4 relative pt-6 pb-12">

          <div className="absolute inset-0 bg-[#F8F8F8] rounded-[50px] -z-10 translate-y-4" />

          <div className="mb-6 flex items-center justify-between px-2">

            <h2 className="text-xl font-extrabold text-gray-900">
              Popular Now
            </h2>

            <button className="text-xs font-bold text-[#1BAC4B]">
              View All
            </button>

          </div>

          <div className="flex gap-5 overflow-x-auto pb-4 no-scrollbar snap-x snap-mandatory px-2">

            {popularDishes.map((item) => (

              <motion.div
                key={item.id}
                className="min-w-[180px] snap-center bg-white rounded-[35px] p-5 shadow-xl border border-gray-50 flex flex-col items-center"
              >

                <img
                  src={item.image}
                  alt={item.name}
                  className="w-28 h-28 object-cover rounded-full shadow-md ring-4 ring-gray-50 mb-4"
                />

                <div className="w-full text-center">

                  <h3 className="text-[13px] font-bold text-gray-800 line-clamp-1">
                    {item.name}
                  </h3>

                  <p className="text-[10px] text-gray-400 mt-1.5 font-bold">
                    🔥 {item.calorie}
                  </p>

                  <div className="mt-3 font-bold text-[17px] text-[#FF5C38]">
                    {item.price}
                  </div>

                </div>

              </motion.div>

            ))}

          </div>
        </section>

        {/* --- 4. FEATURED ITEMS --- */}
        <section className="mt-10">

          <h2 className="text-xl font-bold mb-5 text-gray-900">
            Featured Items
          </h2>

          {featuredItems.map((item) => (

            <div
              key={item.id}
              className="bg-white rounded-[25px] overflow-hidden shadow-sm border border-gray-50 mb-5 flex p-3 gap-4"
            >

              <img
                src={item.image}
                className="h-24 w-24 rounded-2xl object-cover"
                alt={item.title}
              />

              <div className="flex-1 flex flex-col justify-center">

                <div className="flex justify-between items-start">

                  <h3 className="font-bold text-[15px] text-gray-800">
                    {item.title} ✅
                  </h3>

                  <div className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded-lg">

                    <Star
                      size={10}
                      className="fill-yellow-400 text-yellow-400"
                    />

                    <span className="text-[10px] font-bold">
                      {item.rating}
                    </span>

                  </div>

                </div>

                <p className="text-[10px] text-gray-400 font-bold mt-1 tracking-tight">
                  {item.time} • {item.deliveryFee}
                </p>

                <div className="flex gap-2 mt-2">

                  {item.tags.slice(0, 2).map((tag) => (

                    <span
                      key={tag}
                      className="bg-gray-50 px-2 py-1 rounded text-[9px] font-bold text-gray-400 uppercase"
                    >
                      {tag}
                    </span>

                  ))}

                </div>

              </div>

            </div>

          ))}

        </section>

        {/* --- 5. POPULAR RESTAURANT --- */}
        <section className="mt-8">

          <div className="mb-4 flex items-center justify-between">

            <h2 className="text-xl font-extrabold text-gray-900">
              Popular Restaurant
            </h2>

            <button
              onClick={() => navigate("/restaurants")}
              className="text-[#FF5C38] text-sm font-bold"
            >
              See All
            </button>

          </div>

          {/* Time Filter Pills */}
          <div className="flex gap-3 mb-6 overflow-x-auto no-scrollbar py-2">

            {["Today", "This Week", "This Month"].map((filter) => (

              <button
                key={filter}
                onClick={() => setActiveTimeFilter(filter)}
                className={`px-6 py-2.5 rounded-full text-[11px] font-bold transition-all whitespace-nowrap
                ${
                  activeTimeFilter === filter
                    ? "bg-[#1BAC4B] text-white shadow-md"
                    : "bg-gray-100 text-gray-400"
                }`}
              >
                {filter}
              </button>

            ))}

          </div>

          <div className="space-y-6">

            {restaurants.map((restaurant) => (

              <motion.div
                key={restaurant.id}
                onClick={() =>
                  navigate(`/restaurants/${restaurant.id}`)
                }
                className="bg-white rounded-[30px] overflow-hidden shadow-md border border-gray-50 group"
              >

                <div className="relative h-48">

                  <img
                    src={restaurant.image}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    alt={restaurant.name}
                  />

                  <div className="absolute left-4 top-4 bg-white/90 px-3 py-1 rounded-full shadow-sm backdrop-blur-sm">

                    <div className="flex items-center gap-1.5 font-bold text-[11px]">

                      <Star
                        size={12}
                        className="fill-yellow-400 text-yellow-400"
                      />

                      {restaurant.rating}

                    </div>

                  </div>

                </div>

                <div className="p-5 flex justify-between items-center">

                  <div>

                    <h3 className="text-lg font-bold text-gray-900">
                      {restaurant.name}
                    </h3>

                    <p className="text-[10px] text-gray-400 font-bold uppercase mt-1 tracking-widest">
                      {restaurant.category}
                    </p>

                  </div>

                  <div className="text-[11px] text-gray-500 font-bold flex items-center gap-1.5 bg-gray-50 px-3 py-2 rounded-full">

                    <Clock3
                      size={14}
                      className="text-gray-400"
                    />

                    {restaurant.deliveryTime}

                  </div>

                </div>

              </motion.div>

            ))}

          </div>
        </section>

        {/* --- 6. PEOPLE LOOKING FOR --- */}
        <section className="mt-10">

          <h2 className="text-xl font-bold mb-5 text-gray-900">
            People are looking for 🔥
          </h2>

          <div className="space-y-4">

            {peopleLookingFor.map((item) => (

              <div
                key={item.id}
                className="flex items-center justify-between bg-white rounded-[24px] p-4 shadow-sm border border-gray-50"
              >

                <div className="flex items-center gap-4">

                  <img
                    src={item.image}
                    alt={item.dish}
                    className="h-16 w-16 rounded-2xl object-cover shadow-sm"
                  />

                  <div>

                    <h3 className="font-bold text-sm text-gray-800">
                      {item.dish}
                    </h3>

                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tight">
                      {item.restaurant}
                    </p>

                  </div>

                </div>

                <button className="h-11 w-11 bg-[#1BAC4B] text-white rounded-xl flex items-center justify-center shadow-sm active:scale-95 transition-transform">
                  <Plus size={22} />
                </button>

              </div>

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

      <style
        dangerouslySetInnerHTML={{
          __html: `
            .no-scrollbar::-webkit-scrollbar { display: none; }
            .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
          `,
        }}
      />

    </div>
  );
}
