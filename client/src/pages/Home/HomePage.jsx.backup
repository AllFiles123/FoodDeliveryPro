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
  Check,
  Eye,
} from "lucide-react";

import { useNavigate } from "react-router-dom";
import FilterBottomSheet from "../../components/FilterBottomSheet/FilterBottomSheet";
import restaurantService from "../../services/restaurantService";
import { useCart } from "../../context/CartContext";

export default function HomePage() {
  const navigate = useNavigate();

  const {
    addToCart,
    getItemQty,
  } = useCart();

  const [restaurants, setRestaurants] = useState([]);
  const [restaurantFoodCounts, setRestaurantFoodCounts] =
    useState({});

  const [showFilter, setShowFilter] = useState(false);

  const [activeCategory, setActiveCategory] =
    useState(2);

  const [activeTimeFilter, setActiveTimeFilter] =
    useState("Today");

  const [userLocation, setUserLocation] =
    useState(
      () =>
        localStorage.getItem("userLocation") ||
        "Set your location"
    );

  const [currentBanner, setCurrentBanner] =
    useState(0);

  const [addedItemId, setAddedItemId] =
    useState(null);

  const [filters, setFilters] = useState({
    category: "",
    rating: 0,
    minPrice: "",
    maxPrice: "",
    deliveryTime: "",
    nearMe: false,
  });

  /*
   * LOCATION
   */
  useEffect(() => {
    const updateLocation = () => {
      setUserLocation(
        localStorage.getItem("userLocation") ||
          "Set your location"
      );
    };

    window.addEventListener(
      "locationChanged",
      updateLocation
    );

    return () => {
      window.removeEventListener(
        "locationChanged",
        updateLocation
      );
    };
  }, []);

  /*
   * BANNERS
   */
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
        prev === banners.length - 1
          ? 0
          : prev + 1
      );
    }, 3000);

    return () => clearInterval(timer);
  }, [banners.length]);

  /*
   * CATEGORIES
   */
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

  /*
   * POPULAR DISHES
   */
  const popularDishes = [
    {
      id: 1,
      name: "Cabbage with sauce",
      calorie: "170 Kal",
      price: 250,
      image:
        "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&q=80",
    },
    {
      id: 2,
      name: "Puree soup with turkey",
      calorie: "100 Kal",
      price: 350,
      image:
        "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=800&q=80",
    },
    {
      id: 3,
      name: "Three-Meat Lasagna",
      calorie: "250 Kal",
      price: 450,
      image:
        "https://images.unsplash.com/photo-1574894709920-11b28e7367e3?w=800&q=80",
    },
  ];

  /*
   * FEATURED ITEMS
   */
  const featuredItems = [
    {
      id: 1,
      title: "Egg Salad",
      name: "Egg Salad",
      rating: "4.3",
      time: "10-15 mins",
      deliveryFee: "৳20 delivery",
      price: 220,
      image:
        "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=1000&q=80",
      tags: ["COFFEE", "CHICKEN"],
    },
    {
      id: 2,
      title: "Chicken Pasta",
      name: "Chicken Pasta",
      rating: "4.7",
      time: "15-20 mins",
      deliveryFee: "৳30 delivery",
      price: 320,
      image:
        "https://images.unsplash.com/photo-1551892374-ecf8754cf8b0?w=1000&q=80",
      tags: ["PASTA", "FAST FOOD"],
    },
    {
      id: 3,
      title: "Fresh Pizza",
      name: "Fresh Pizza",
      rating: "4.8",
      time: "20-25 mins",
      deliveryFee: "৳25 delivery",
      price: 450,
      image:
        "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=1000&q=80",
      tags: ["PIZZA", "ITALIAN"],
    },
    {
      id: 4,
      title: "Grilled Chicken",
      name: "Grilled Chicken",
      rating: "4.6",
      time: "15-25 mins",
      deliveryFee: "৳20 delivery",
      price: 390,
      image:
        "https://images.unsplash.com/photo-1532550907401-a500c9a57435?w=1000&q=80",
      tags: ["CHICKEN", "GRILLED"],
    },
  ];

  /*
   * PEOPLE LOOKING FOR
   */
  const peopleLookingFor = [
    {
      id: 1,
      dish: "Spicy Fresh Crab",
      name: "Spicy Fresh Crab",
      restaurant: "Waroenk Kita",
      price: 550,
      image:
        "https://images.unsplash.com/photo-1551248429-40975aa4de74?w=500&q=80",
    },
    {
      id: 2,
      dish: "Chicken Burger",
      name: "Chicken Burger",
      restaurant: "Burger House",
      price: 280,
      image:
        "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&q=80",
    },
  ];

  /*
   * BODY LOCK
   */
  useEffect(() => {
    document.body.style.overflow =
      showFilter ? "hidden" : "auto";

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [showFilter]);

  /*
   * LOAD RESTAURANTS
   */
  useEffect(() => {
    const loadRestaurants = async () => {
      try {
        const response =
          await restaurantService.getRestaurants();

        const loadedRestaurants =
          response?.restaurants || [];

        setRestaurants(loadedRestaurants);

        /*
         * Load menu count for every restaurant.
         * Existing restaurant API is reused.
         */
        const countEntries =
          await Promise.all(
            loadedRestaurants.map(
              async (restaurant) => {
                try {
                  const result =
                    await restaurantService.getFoodsByRestaurantId(
                      restaurant.id
                    );

                  return [
                    restaurant.id,
                    (result?.foods || []).length,
                  ];
                } catch (error) {
                  console.error(
                    "Failed to load restaurant food count:",
                    restaurant.id,
                    error
                  );

                  return [
                    restaurant.id,
                    0,
                  ];
                }
              }
            )
          );

        setRestaurantFoodCounts(
          Object.fromEntries(countEntries)
        );
      } catch (error) {
        console.error(
          "Failed to load restaurants:",
          error
        );

        setRestaurants([]);
      }
    };

    loadRestaurants();
  }, []);

  /*
   * ADD TO CART
   */
  const handleAddToCart = (item) => {
    const cartItem = {
      ...item,
      id: item.id,
      name:
        item.name ||
        item.title ||
        item.dish ||
        "Food Item",
      title:
        item.title ||
        item.name ||
        item.dish ||
        "Food Item",
      price:
        typeof item.price === "number"
          ? item.price
          : Number(
              String(item.price || 0)
                .replace(/[৳$,\s]/g, "")
            ) || 0,
      image:
        item.image ||
        item.thumbnail ||
        item.imageUrl ||
        "",
    };

    addToCart(cartItem);

    setAddedItemId(item.id);

    window.setTimeout(() => {
      setAddedItemId((current) =>
        current === item.id
          ? null
          : current
      );
    }, 900);
  };

  /*
   * PRICE FORMAT
   */
  const formatPrice = (price) => {
    const numeric =
      typeof price === "number"
        ? price
        : Number(
            String(price || 0)
              .replace(/[৳$,\s]/g, "")
          ) || 0;

    return `৳${numeric}`;
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#FDFDFD] pb-24">

      {/* =====================================================
          HERO
      ===================================================== */}

      <div className="relative h-[480px] w-full overflow-hidden">

        <AnimatePresence mode="wait">

          <motion.img
            key={currentBanner}
            src={banners[currentBanner].image}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0 h-full w-full object-cover"
            alt={banners[currentBanner].title}
          />

        </AnimatePresence>

        <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-transparent to-[#FDFDFD]" />

        <div className="absolute inset-0 flex flex-col px-5 pt-6">

          {/* HEADER */}

          <div className="z-10 mb-8 flex items-center justify-between">

            <button
              type="button"
              onClick={() =>
                navigate("/location")
              }
              className="flex items-center gap-3 rounded-full border border-white/20 bg-white/15 p-1 pr-4 backdrop-blur-md"
            >

              <div className="flex items-center justify-center rounded-full bg-white p-2 shadow-sm">

                <MapPin
                  size={16}
                  className="text-[#FF5A00]"
                />

              </div>

              <div className="text-left">

                <p className="text-[10px] font-bold uppercase text-white/80">
                  Delivery to
                </p>

                <h2 className="max-w-[150px] truncate text-[12px] font-bold text-white">
                  {userLocation}
                </h2>

              </div>

            </button>

            <div className="flex gap-2">

              <button
                type="button"
                className="relative flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-white/15 backdrop-blur-md"
                aria-label="Notifications"
              >

                <Bell
                  size={20}
                  className="text-white"
                />

                <span className="absolute right-3 top-3 h-2 w-2 rounded-full border-2 border-white bg-[#FF5A00]" />

              </button>

              <button
                type="button"
                onClick={() =>
                  navigate("/profile")
                }
                className="h-11 w-11 overflow-hidden rounded-full border-2 border-white shadow-lg"
                aria-label="Profile"
              >

                <img
                  src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&q=80"
                  className="h-full w-full object-cover"
                  alt="profile"
                />

              </button>

            </div>

          </div>

          <h1 className="mb-6 text-[34px] font-bold leading-tight text-white drop-shadow-md">

            Hungry?

            <br />

            <span className="font-normal text-white/80">
              Order & Eat.
            </span>

          </h1>

          {/* SEARCH */}

          <div className="mt-4 flex gap-3">

            <button
              type="button"
              onClick={() =>
                navigate("/search")
              }
              className="flex flex-1 items-center gap-3 rounded-2xl bg-white px-5 py-4 text-left shadow-2xl"
            >

              <Search
                size={20}
                className="shrink-0 text-gray-400"
              />

              <span className="text-sm font-medium text-gray-400">
                Search for fast food...
              </span>

            </button>

            {/* REFERENCE 2 FILTER BUTTON */}

            <button
              type="button"
              onClick={() =>
                setShowFilter(true)
              }
              className="flex h-[58px] w-[58px] shrink-0 items-center justify-center rounded-full bg-black text-white shadow-xl transition-all active:scale-95"
              aria-label="Open filters"
            >

              <SlidersHorizontal
                size={22}
                strokeWidth={2.4}
              />

            </button>

          </div>

        </div>

      </div>

      <div className="relative mx-auto max-w-7xl px-5">

        {/* =====================================================
            CATEGORIES
        ===================================================== */}

        <section className="relative z-20 -mt-14">

          <div className="rounded-t-[42px] bg-[#FDFDFD] px-1 pt-7">

            <div className="flex w-full items-start justify-between gap-2">

              {categories.map(
                (item, index) => {

                  const active =
                    activeCategory === index;

                  return (
                    <div
                      key={item.name}
                      className="flex min-w-0 flex-1 flex-col items-center"
                    >

                      <motion.button
                        type="button"
                        onClick={() =>
                          setActiveCategory(index)
                        }
                        whileTap={{
                          scale: 0.94,
                        }}
                        className={`relative flex h-[68px] w-[68px] shrink-0 items-center justify-center overflow-hidden rounded-full bg-white transition-all duration-200 ${
                          active
                            ? "ring-2 ring-[#FF5A00] ring-offset-2"
                            : "shadow-md"
                        }`}
                      >

                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-full w-full object-cover"
                        />

                        <div
                          className={`absolute inset-0 ${
                            active
                              ? "bg-black/5"
                              : "bg-black/10"
                          }`}
                        />

                      </motion.button>

                      <p
                        className={`mt-2 text-center text-[11px] ${
                          active
                            ? "font-extrabold text-gray-900"
                            : "font-semibold text-gray-500"
                        }`}
                      >
                        {item.name}
                      </p>

                    </div>
                  );
                }
              )}

            </div>

          </div>

        </section>

        {/* =====================================================
            POPULAR ITEMS
        ===================================================== */}

        <section className="mt-8">

          <div className="mb-5 flex items-center justify-between">

            <h2 className="text-xl font-extrabold text-gray-900">
              Popular Items
            </h2>

            <button
              type="button"
              onClick={() =>
                navigate("/restaurants")
              }
              className="text-xs font-bold text-[#FF5A00]"
            >
              See All
            </button>

          </div>

          <div className="no-scrollbar flex snap-x snap-mandatory gap-5 overflow-x-auto px-1 pb-4">

            {popularDishes.map(
              (item) => {

                const qty =
                  getItemQty(item.id);

                return (
                  <motion.div
                    key={item.id}
                    whileTap={{
                      scale: 0.97,
                    }}
                    className="min-w-[180px] snap-start rounded-[30px] border border-gray-100 bg-white p-4 shadow-lg"
                  >

                    <img
                      src={item.image}
                      alt={item.name}
                      className="mx-auto mb-4 h-28 w-28 rounded-full object-cover shadow-md ring-4 ring-gray-50"
                    />

                    <div className="text-center">

                      <h3 className="line-clamp-1 text-[13px] font-bold text-gray-800">
                        {item.name}
                      </h3>

                      <p className="mt-1.5 text-[10px] font-bold text-gray-400">
                        🔥 {item.calorie}
                      </p>

                      <div className="mt-3 flex items-center justify-between">

                        <div className="text-[17px] font-extrabold text-[#FF5A00]">
                          {formatPrice(
                            item.price
                          )}
                        </div>

                        <button
                          type="button"
                          onClick={() =>
                            handleAddToCart(
                              item
                            )
                          }
                          className={`flex h-9 w-9 items-center justify-center rounded-xl text-white shadow-md transition-all active:scale-90 ${
                            addedItemId ===
                            item.id
                              ? "bg-green-500"
                              : "bg-[#FF5A00]"
                          }`}
                        >

                          {addedItemId ===
                          item.id ? (
                            <Check size={18} />
                          ) : (
                            <Plus size={19} />
                          )}

                        </button>

                      </div>

                      {qty > 0 && (
                        <p className="mt-2 text-[9px] font-bold text-green-600">
                          {qty} in cart
                        </p>
                      )}

                    </div>

                  </motion.div>
                );
              }
            )}

          </div>

        </section>

        {/* =====================================================
            FEATURED ITEMS
        ===================================================== */}

        <section className="mt-8">

          <div className="mb-5 flex items-center justify-between">

            <h2 className="text-xl font-extrabold text-gray-900">
              Featured Items
            </h2>

            <button
              type="button"
              onClick={() =>
                navigate("/restaurants")
              }
              className="text-sm font-bold text-[#FF5A00]"
            >
              See All
            </button>

          </div>

          <div className="grid grid-cols-2 gap-4">

            {featuredItems.map(
              (item) => {

                const qty =
                  getItemQty(item.id);

                return (
                  <motion.div
                    key={item.id}
                    whileTap={{
                      scale: 0.97,
                    }}
                    className="overflow-hidden rounded-[24px] border border-gray-100 bg-white shadow-md"
                  >

                    <div className="relative h-[145px]">

                      <img
                        src={item.image}
                        alt={item.title}
                        className="h-full w-full object-cover"
                      />

                      <div className="absolute left-3 top-3 rounded-full bg-[#FF5A00] px-2.5 py-1 text-[9px] font-extrabold text-white">
                        FEATURED
                      </div>

                      <div className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-white/95 px-2 py-1">

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

                      <h3 className="line-clamp-1 text-[14px] font-extrabold text-gray-900">
                        {item.title}
                      </h3>

                      <p className="mt-1 text-[9px] font-bold text-gray-400">
                        {item.time} •{" "}
                        {item.deliveryFee}
                      </p>

                      <div className="mt-2 flex items-center justify-between">

                        <span className="text-[15px] font-extrabold text-[#FF5A00]">
                          {formatPrice(
                            item.price
                          )}
                        </span>

                        <button
                          type="button"
                          onClick={() =>
                            handleAddToCart(
                              item
                            )
                          }
                          className={`flex h-9 w-9 items-center justify-center rounded-xl text-white shadow-md transition-transform active:scale-90 ${
                            addedItemId ===
                            item.id
                              ? "bg-green-500"
                              : "bg-[#FF5A00]"
                          }`}
                        >

                          {addedItemId ===
                          item.id ? (
                            <Check size={18} />
                          ) : (
                            <Plus size={19} />
                          )}

                        </button>

                      </div>

                      {qty > 0 && (
                        <p className="mt-2 text-[9px] font-bold text-green-600">
                          {qty} in cart
                        </p>
                      )}

                    </div>

                  </motion.div>
                );
              }
            )}

          </div>

        </section>

        {/* =====================================================
            POPULAR RESTAURANT / BRAND CARDS
        ===================================================== */}

        <section className="mt-10">

          <div className="mb-4 flex items-center justify-between">

            <div>

              <h2 className="text-xl font-extrabold text-gray-900">
                Popular Restaurant
              </h2>

              <p className="mt-1 text-[10px] font-semibold text-gray-400">
                Best places near you
              </p>

            </div>

            <button
              type="button"
              onClick={() =>
                navigate("/restaurants")
              }
              className="text-sm font-bold text-[#FF5A00]"
            >
              See All
            </button>

          </div>

          {/* TIME FILTER */}

          <div className="no-scrollbar mb-5 flex gap-3 overflow-x-auto py-1">

            {[
              "Today",
              "This Week",
              "This Month",
            ].map((filter) => (

              <button
                key={filter}
                type="button"
                onClick={() =>
                  setActiveTimeFilter(
                    filter
                  )
                }
                className={`whitespace-nowrap rounded-full px-5 py-2.5 text-[11px] font-bold transition-all ${
                  activeTimeFilter ===
                  filter
                    ? "bg-[#FF5A00] text-white shadow-md"
                    : "bg-gray-100 text-gray-500"
                }`}
              >
                {filter}
              </button>

            ))}

          </div>

          {/* HORIZONTAL BRAND CARDS */}

          <div className="no-scrollbar flex gap-4 overflow-x-auto pb-4">

            {restaurants.map(
              (restaurant) => {

                const itemCount =
                  restaurantFoodCounts[
                    restaurant.id
                  ] || 0;

                return (
                  <motion.button
                    key={restaurant.id}
                    type="button"
                    whileTap={{
                      scale: 0.97,
                    }}
                    onClick={() =>
                      navigate(
                        `/restaurants/${restaurant.id}`
                      )
                    }
                    className="relative flex min-w-[285px] shrink-0 items-center gap-4 overflow-hidden rounded-[28px] border border-gray-100 bg-white p-3 text-left shadow-md"
                  >

                    {/* RESTAURANT IMAGE */}

                    <div className="relative h-[92px] w-[92px] shrink-0 overflow-hidden rounded-[22px] bg-gray-100">

                      <img
                        src={
                          restaurant.image ||
                          "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=500&q=80"
                        }
                        className="h-full w-full object-cover"
                        alt={
                          restaurant.name
                        }
                      />

                      {/* RATING */}

                      <div className="absolute left-2 top-2 flex items-center gap-1 rounded-full bg-white/95 px-2 py-1 shadow-sm">

                        <Star
                          size={10}
                          className="fill-yellow-400 text-yellow-400"
                        />

                        <span className="text-[9px] font-extrabold text-gray-800">
                          {restaurant.rating ||
                            "4.5"}
                        </span>

                      </div>

                    </div>

                    {/* RESTAURANT INFO */}

                    <div className="min-w-0 flex-1">

                      <h3 className="truncate text-[15px] font-extrabold text-gray-900">
                        {restaurant.name}
                      </h3>

                      <p className="mt-1 truncate text-[9px] font-bold uppercase tracking-wider text-gray-400">
                        {restaurant.category ||
                          "Restaurant"}
                      </p>

                      <div className="mt-3 flex items-center gap-2">

                        <span className="rounded-full bg-black px-2.5 py-1 text-[9px] font-extrabold text-white">
                          {itemCount} items
                        </span>

                        {restaurant.deliveryTime && (
                          <span className="flex items-center gap-1 text-[9px] font-bold text-gray-400">

                            <Clock3
                              size={11}
                              className="text-[#FF5A00]"
                            />

                            {restaurant.deliveryTime}

                          </span>
                        )}

                      </div>

                    </div>

                    {/* VIEW BUTTON */}

                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#FF5A00] text-white shadow-md shadow-orange-200">

                      <Eye size={18} />

                    </div>

                  </motion.button>
                );
              }
            )}

            {restaurants.length === 0 && (
              <div className="w-full rounded-[28px] border border-gray-100 bg-white p-8 text-center shadow-sm">

                <p className="text-sm font-bold text-gray-500">
                  No restaurants available right now.
                </p>

              </div>
            )}

          </div>

        </section>

        {/* =====================================================
            BEST BRANDS NEAR YOU
        ===================================================== */}

        <section className="mt-10">

          <div className="mb-5 flex items-center justify-between">

            <div>

              <h2 className="text-xl font-extrabold text-gray-900">
                Best Brands Near You
              </h2>

              <p className="mt-1 text-[10px] font-semibold text-gray-400">
                Discover popular food spots
              </p>

            </div>

            <button
              type="button"
              onClick={() =>
                navigate("/restaurants")
              }
              className="text-sm font-bold text-[#FF5A00]"
            >
              See All
            </button>

          </div>

          <div className="no-scrollbar flex gap-4 overflow-x-auto pb-3">

            {restaurants
              .slice(0, 6)
              .map((restaurant) => {

                const itemCount =
                  restaurantFoodCounts[
                    restaurant.id
                  ] || 0;

                return (
                  <motion.button
                    key={`best-${restaurant.id}`}
                    type="button"
                    whileTap={{
                      scale: 0.96,
                    }}
                    onClick={() =>
                      navigate(
                        `/restaurants/${restaurant.id}`
                      )
                    }
                    className="min-w-[220px] shrink-0 overflow-hidden rounded-[26px] border border-gray-100 bg-white text-left shadow-md"
                  >

                    <div className="relative h-[120px]">

                      <img
                        src={
                          restaurant.image ||
                          "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&q=80"
                        }
                        alt={
                          restaurant.name
                        }
                        className="h-full w-full object-cover"
                      />

                      <div className="absolute left-3 top-3 flex items-center gap-1 rounded-full bg-white/95 px-2.5 py-1">

                        <Star
                          size={10}
                          className="fill-yellow-400 text-yellow-400"
                        />

                        <span className="text-[9px] font-extrabold">
                          {restaurant.rating ||
                            "4.5"}
                        </span>

                      </div>

                    </div>

                    <div className="p-3">

                      <h3 className="truncate text-sm font-extrabold text-gray-900">
                        {restaurant.name}
                      </h3>

                      <div className="mt-2 flex items-center justify-between">

                        <span className="rounded-full bg-black px-2.5 py-1 text-[9px] font-extrabold text-white">
                          {itemCount} items
                        </span>

                        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#FF5A00] text-white">
                          <Eye size={15} />
                        </span>

                      </div>

                    </div>

                  </motion.button>
                );
              })}

          </div>

        </section>

        {/* =====================================================
            PEOPLE ARE LOOKING FOR
        ===================================================== */}

        <section className="mt-10">

          <h2 className="mb-5 text-xl font-extrabold text-gray-900">
            People are looking for 🔥
          </h2>

          <div className="space-y-4">

            {peopleLookingFor.map(
              (item) => {

                const qty =
                  getItemQty(item.id);

                return (
                  <div
                    key={item.id}
                    className="flex items-center justify-between rounded-[24px] border border-gray-100 bg-white p-4 shadow-sm"
                  >

                    <div className="flex min-w-0 items-center gap-4">

                      <img
                        src={item.image}
                        alt={item.dish}
                        className="h-16 w-16 rounded-2xl object-cover shadow-sm"
                      />

                      <div className="min-w-0">

                        <h3 className="truncate text-sm font-extrabold text-gray-800">
                          {item.dish}
                        </h3>

                        <p className="text-[10px] font-bold uppercase tracking-tight text-gray-400">
                          {item.restaurant}
                        </p>

                        <p className="mt-1 text-sm font-extrabold text-[#FF5A00]">
                          {formatPrice(
                            item.price
                          )}
                        </p>

                        {qty > 0 && (
                          <p className="mt-0.5 text-[9px] font-bold text-green-600">
                            {qty} in cart
                          </p>
                        )}

                      </div>

                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        handleAddToCart(
                          item
                        )
                      }
                      className={`ml-3 flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-white shadow-md transition-transform active:scale-90 ${
                        addedItemId ===
                        item.id
                          ? "bg-green-500"
                          : "bg-[#FF5A00]"
                      }`}
                    >

                      {addedItemId ===
                      item.id ? (
                        <Check size={19} />
                      ) : (
                        <ShoppingCart
                          size={19}
                        />
                      )}

                    </button>

                  </div>
                );
              }
            )}

          </div>

        </section>

        {/* =====================================================
            FILTER
        ===================================================== */}

        <FilterBottomSheet
          open={showFilter}
          onClose={() =>
            setShowFilter(false)
          }
          filters={filters}
          setFilters={setFilters}
          onApply={() =>
            setShowFilter(false)
          }
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
