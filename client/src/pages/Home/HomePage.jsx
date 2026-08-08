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
  ShoppingCart,
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

  const [currentBanner, setCurrentBanner] = useState(0);

  const [filters, setFilters] = useState({
    category: "",
    rating: 0,
    minPrice: "",
    maxPrice: "",
    deliveryTime: "",
    nearMe: false,
  });

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

  const categories = [
    {
      name: "Fruits",
      icon: "🍎",
      image:
        "https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=300&q=80",
    },
    {
      name: "Drinks",
      icon: "🍹",
      image:
        "https://images.unsplash.com/photo-1544145945-f90425340c7e?w=300&q=80",
    },
    {
      name: "All",
      icon: "🍱",
      image:
        "https://images.unsplash.com/photo-1547592180-85f173990554?w=300&q=80",
    },
    {
      name: "Snacks",
      icon: "🍿",
      image:
        "https://images.unsplash.com/photo-1621939514649-280e2aaec8a9?w=300&q=80",
    },
    {
      name: "Food",
      icon: "🥗",
      image:
        "https://images.unsplash.com/photo-1547592180-85f173990554?w=300&q=80",
    },
  ];

  const popularDishes = [
    {
      id: 1,
      name: "Cabbage with sauce",
      calorie: "170 Kal",
      price: "৳250",
      image:
        "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&q=80",
    },
    {
      id: 2,
      name: "Puree soup with turkey",
      calorie: "100 Kal",
      price: "৳350",
      image:
        "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=800&q=80",
    },
    {
      id: 3,
      name: "Three-Meat Lasagna",
      calorie: "250 Kal",
      price: "৳450",
      image:
        "https://images.unsplash.com/photo-1574894709920-11b28e7367e3?w=800&q=80",
    },
  ];

  const featuredItems = [
    {
      id: 1,
      title: "Egg Salad",
      rating: "4.3",
      time: "10-15 mins",
      deliveryFee: "৳20 delivery",
      price: "৳220",
      image:
        "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=1000&q=80",
      tags: ["COFFEE", "CHICKEN"],
    },
    {
      id: 2,
      title: "Chicken Pasta",
      rating: "4.7",
      time: "15-20 mins",
      deliveryFee: "৳30 delivery",
      price: "৳320",
      image:
        "https://images.unsplash.com/photo-1551892374-ecf8754cf8b0?w=1000&q=80",
      tags: ["PASTA", "FAST FOOD"],
    },
    {
      id: 3,
      title: "Fresh Pizza",
      rating: "4.8",
      time: "20-25 mins",
      deliveryFee: "৳25 delivery",
      price: "৳450",
      image:
        "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=1000&q=80",
      tags: ["PIZZA", "ITALIAN"],
    },
    {
      id: 4,
      title: "Grilled Chicken",
      rating: "4.6",
      time: "15-25 mins",
      deliveryFee: "৳20 delivery",
      price: "৳390",
      image:
        "https://images.unsplash.com/photo-1532550907401-a500c9a57435?w=1000&q=80",
      tags: ["CHICKEN", "GRILLED"],
    },
  ];

  const peopleLookingFor = [
    {
      id: 1,
      dish: "Spicy Fresh Crab",
      restaurant: "Waroenk Kita",
      price: "৳550",
      image:
        "https://images.unsplash.com/photo-1551248429-40975aa4de74?w=500&q=80",
    },
    {
      id: 2,
      dish: "Chicken Burger",
      restaurant: "Burger House",
      price: "৳280",
      image:
        "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&q=80",
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

  const handleAddToCart = (item) => {
    const existingCart = JSON.parse(
      localStorage.getItem("cart") || "[]"
    );

    const existingIndex = existingCart.findIndex(
      (cartItem) => cartItem.id === item.id
    );

    if (existingIndex >= 0) {
      existingCart[existingIndex].quantity =
        (existingCart[existingIndex].quantity || 1) + 1;
    } else {
      existingCart.push({
        ...item,
        quantity: 1,
      });
    }

    localStorage.setItem(
      "cart",
      JSON.stringify(existingCart)
    );

    window.dispatchEvent(new Event("cartUpdated"));
  };

  return (
    <div className="min-h-screen bg-[#FDFDFD] pb-24 overflow-x-hidden">

      {/* ================= BANNER ================= */}

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

        <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-transparent to-[#FDFDFD]" />

        <div className="absolute inset-0 px-5 pt-6 flex flex-col">

          {/* Header */}

          <div className="flex items-center justify-between z-10 mb-8">

            <div className="flex items-center gap-3 bg-white/15 backdrop-blur-md p-1 pr-4 rounded-full border border-white/20">

              <div className="bg-white p-2 rounded-full shadow-sm flex items-center justify-center">

                <MapPin
                  size={16}
                  className="text-[#FF5A00]"
                />

              </div>

              <div>

                <p className="text-[10px] text-white/80 uppercase font-bold">
                  Delivery to
                </p>

                <h2 className="text-[12px] font-bold text-white">
                  {userLocation}
                </h2>

              </div>

            </div>

            <div className="flex gap-2">

              <button
                type="button"
                className="h-11 w-11 bg-white/15 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20 relative"
              >

                <Bell
                  size={20}
                  className="text-white"
                />

                <span className="absolute top-3 right-3 w-2 h-2 bg-[#FF5A00] rounded-full border-2 border-white" />

              </button>

              <button
                type="button"
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

            Hungry?

            <br />

            <span className="font-normal text-white/80">
              Order & Eat.
            </span>

          </h1>

          {/* Search */}

          <div className="flex gap-3 mt-4">

            <div className="flex-1 flex items-center gap-3 rounded-2xl bg-white px-5 py-4 shadow-2xl">

              <Search
                size={20}
                className="text-gray-400"
              />

              <input
                placeholder="Search for fast food..."
                className="w-full bg-transparent outline-none text-sm font-medium"
              />

            </div>

            <button
              type="button"
              onClick={() => setShowFilter(true)}
              className="flex h-[58px] w-[58px] items-center justify-center rounded-2xl bg-[#FF5A00] text-white shadow-lg active:scale-95 transition-all"
            >

              <SlidersHorizontal size={22} />

            </button>

          </div>

        </div>
      </div>

      <div className="mx-auto max-w-7xl px-5 relative">

        {/* ================= CATEGORIES ================= */}

        <section className="relative h-[190px] flex items-end justify-center -mt-20 z-20">

          <div className="absolute top-0 w-[145%] h-[300px] bg-[#FDFDFD] rounded-[100%] -z-10 shadow-[0_-15px_30px_rgba(0,0,0,0.05)] border-t border-gray-50" />

          <div className="flex justify-between w-full px-0 items-end pb-4">

            {categories.map((item, index) => (

              <div
                key={item.name}
                className="flex flex-col items-center flex-1"
              >

                <motion.button
                  type="button"
                  onClick={() => setActiveCategory(index)}
                  whileTap={{ scale: 0.92 }}
                  className={`relative w-[62px] h-[62px] rounded-full bg-white shadow-lg overflow-hidden flex items-center justify-center transition-all duration-300 ${
                    activeCategory === index
                      ? "scale-110 -translate-y-3 ring-4 ring-[#FF5A00]/15"
                      : "opacity-95"
                  }`}
                >

                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />

                  <div className="absolute inset-0 bg-black/10" />

                </motion.button>

                <p
                  className={`text-[11px] mt-2 font-bold ${
                    activeCategory === index
                      ? "text-gray-900"
                      : "text-gray-500"
                  }`}
                >
                  {item.name}
                </p>

              </div>

            ))}

          </div>
        </section>

        {/* ================= POPULAR ITEMS ================= */}

        <section className="mt-2 relative pt-5 pb-10">

          <div className="absolute inset-0 bg-[#F8F8F8] rounded-[45px] -z-10 translate-y-3" />

          <div className="mb-5 flex items-center justify-between px-2">

            <h2 className="text-xl font-extrabold text-gray-900">
              Popular Items
            </h2>

            <button
              type="button"
              className="text-xs font-bold text-[#FF5A00]"
            >
              View All
            </button>

          </div>

          <div className="flex gap-5 overflow-x-auto pb-4 no-scrollbar snap-x snap-mandatory px-2">

            {popularDishes.map((item) => (

              <motion.div
                key={item.id}
                whileTap={{ scale: 0.97 }}
                className="min-w-[180px] snap-center bg-white rounded-[30px] p-4 shadow-lg border border-gray-100 flex flex-col items-center"
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

                  <div className="mt-3 font-extrabold text-[17px] text-[#FF5A00]">
                    {item.price}
                  </div>

                </div>

              </motion.div>

            ))}

          </div>
        </section>

        {/* ================= FEATURED ITEMS ================= */}

        <section className="mt-8">

          <div className="mb-5 flex items-center justify-between">

            <h2 className="text-xl font-extrabold text-gray-900">
              Featured Items
            </h2>

            <button
              type="button"
              className="text-sm font-bold text-[#FF5A00]"
            >
              See All
            </button>

          </div>

          <div className="grid grid-cols-2 gap-4">

            {featuredItems.map((item) => (

              <motion.div
                key={item.id}
                whileTap={{ scale: 0.97 }}
                className="overflow-hidden rounded-[24px] bg-white shadow-md border border-gray-100"
              >

                <div className="relative h-[145px]">

                  <img
                    src={item.image}
                    alt={item.title}
                    className="h-full w-full object-cover"
                  />

                  <div className="absolute top-3 left-3 bg-[#FF5A00] text-white px-2.5 py-1 rounded-full text-[9px] font-extrabold">
                    FEATURED
                  </div>

                  <div className="absolute top-3 right-3 flex items-center gap-1 rounded-full bg-white/95 px-2 py-1">

                    <Star
                      size={11}
                      className="fill-yellow-400 text-yellow-400"
                    />

                    <span className="text-[10px] font-bold">
                      {item.rating}
                    </span>

                  </div>

                </div>

                <div className="p-3">

                  <h3 className="font-extrabold text-[14px] text-gray-900 line-clamp-1">
                    {item.title}
                  </h3>

                  <p className="mt-1 text-[9px] font-bold text-gray-400">
                    {item.time} • {item.deliveryFee}
                  </p>

                  <div className="mt-2 flex items-center justify-between">

                    <span className="font-extrabold text-[#FF5A00] text-[15px]">
                      {item.price}
                    </span>

                    <button
                      type="button"
                      onClick={() => handleAddToCart(item)}
                      className="h-9 w-9 rounded-xl bg-[#FF5A00] text-white flex items-center justify-center shadow-md active:scale-90 transition-transform"
                      aria-label={`Add ${item.title} to cart`}
                    >

                      <Plus size={19} />

                    </button>

                  </div>

                </div>

              </motion.div>

            ))}

          </div>

        </section>

        {/* ================= POPULAR RESTAURANTS ================= */}

        <section className="mt-10">

          <div className="mb-4 flex items-center justify-between">

            <h2 className="text-xl font-extrabold text-gray-900">
              Popular Restaurant
            </h2>

            <button
              type="button"
              onClick={() => navigate("/restaurants")}
              className="text-[#FF5A00] text-sm font-bold"
            >
              See All
            </button>

          </div>

          <div className="flex gap-3 mb-6 overflow-x-auto no-scrollbar py-2">

            {["Today", "This Week", "This Month"].map(
              (filter) => (

                <button
                  key={filter}
                  type="button"
                  onClick={() =>
                    setActiveTimeFilter(filter)
                  }
                  className={`px-6 py-2.5 rounded-full text-[11px] font-bold transition-all whitespace-nowrap ${
                    activeTimeFilter === filter
                      ? "bg-[#FF5A00] text-white shadow-md"
                      : "bg-gray-100 text-gray-500"
                  }`}
                >
                  {filter}
                </button>

              )
            )}

          </div>

          <div className="space-y-6">

            {restaurants.map((restaurant) => (

              <motion.div
                key={restaurant.id}
                whileTap={{ scale: 0.98 }}
                onClick={() =>
                  navigate(
                    `/restaurants/${restaurant.id}`
                  )
                }
                className="bg-white rounded-[30px] overflow-hidden shadow-md border border-gray-100 group cursor-pointer"
              >

                <div className="relative h-48">

                  <img
                    src={
                      restaurant.image ||
                      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1000&q=80"
                    }
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    alt={restaurant.name}
                  />

                  <div className="absolute left-4 top-4 bg-white/95 px-3 py-1 rounded-full shadow-sm">

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
                      className="text-[#FF5A00]"
                    />

                    {restaurant.deliveryTime}

                  </div>

                </div>

              </motion.div>

            ))}

          </div>

        </section>

        {/* ================= PEOPLE ARE LOOKING FOR ================= */}

        <section className="mt-10">

          <h2 className="text-xl font-extrabold mb-5 text-gray-900">
            People are looking for 🔥
          </h2>

          <div className="space-y-4">

            {peopleLookingFor.map((item) => (

              <div
                key={item.id}
                className="flex items-center justify-between bg-white rounded-[24px] p-4 shadow-sm border border-gray-100"
              >

                <div className="flex items-center gap-4 min-w-0">

                  <img
                    src={item.image}
                    alt={item.dish}
                    className="h-16 w-16 rounded-2xl object-cover shadow-sm"
                  />

                  <div className="min-w-0">

                    <h3 className="font-extrabold text-sm text-gray-800 truncate">
                      {item.dish}
                    </h3>

                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tight">
                      {item.restaurant}
                    </p>

                    <p className="mt-1 text-sm font-extrabold text-[#FF5A00]">
                      {item.price}
                    </p>

                  </div>

                </div>

                <button
                  type="button"
                  onClick={() => handleAddToCart(item)}
                  className="ml-3 h-11 w-11 shrink-0 bg-[#FF5A00] text-white rounded-xl flex items-center justify-center shadow-md active:scale-90 transition-transform"
                  aria-label={`Add ${item.dish} to cart`}
                >

                  <ShoppingCart size={19} />

                </button>

              </div>

            ))}

          </div>

        </section>

        {/* ================= FILTER ================= */}

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
            .no-scrollbar::-webkit-scrollbar {
              display: none;
            }

            .no-scrollbar {
              -ms-overflow-style: none;
              scrollbar-width: none;
            }
          `,
        }}
      />

    </div>
  );
}
