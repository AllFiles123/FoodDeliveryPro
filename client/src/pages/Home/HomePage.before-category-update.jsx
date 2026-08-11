import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  MapPin,
  Star,
  Plus,
  Clock3,
  SlidersHorizontal,
  Bell,
  Check,
  Eye,
  Grid2X2,
  ChevronRight,
} from "lucide-react";

import { useNavigate } from "react-router-dom";
import FilterBottomSheet from "../../components/FilterBottomSheet/FilterBottomSheet";
import restaurantService from "../../services/restaurantService";
import { useCart } from "../../context/CartContext";

export default function HomePage() {
  const navigate = useNavigate();

  const { addToCart, getItemQty } = useCart();

  const [restaurants, setRestaurants] = useState([]);
  const [restaurantFoods, setRestaurantFoods] = useState({});
  const [showFilter, setShowFilter] = useState(false);

  const [activeCategory, setActiveCategory] = useState("All");
  const [activeTimeFilter, setActiveTimeFilter] =
    useState("Today");

  const [userLocation, setUserLocation] = useState(
    () =>
      localStorage.getItem("userLocation") ||
      "Set your location"
  );

  const [currentBanner, setCurrentBanner] = useState(0);
  const [addedItemId, setAddedItemId] = useState(null);

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
   *
   * Existing banner structure preserved.
   */
  const banners = [
    {
      id: 1,
      image:
        "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200&q=85",
      title: "Fresh Deals",
    },
    {
      id: 2,
      image:
        "https://images.unsplash.com/photo-1543353071-873f17a7a088?w=1200&q=85",
      title: "Healthy Salads",
    },
    {
      id: 3,
      image:
        "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=1200&q=85",
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

  /*
   * CATEGORIES
   *
   * All comes first.
   * Every category remains circular.
   * Selected category moves upward.
   */
  const categories = [
    {
      name: "All",
      image:
        "https://images.unsplash.com/photo-1547592180-85f173990554?w=300&q=80",
      icon: Grid2X2,
    },
    {
      name: "Fruits",
      image:
        "https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=300&q=80",
    },
    {
      name: "Drinks",
      image:
        "https://images.unsplash.com/photo-1544145945-f90425340c7e?w=300&q=80",
    },
    {
      name: "Snacks",
      image:
        "https://images.unsplash.com/photo-1621939514649-280e2aaec8a9?w=300&q=80",
    },
    {
      name: "Food",
      image:
        "https://images.unsplash.com/photo-1547592180-85f173990554?w=300&q=80",
    },
  ];

  /*
   * FALLBACK POPULAR ITEMS
   *
   * Existing home data preserved.
   */
  const popularDishes = [
    {
      id: "popular-1",
      name: "Cabbage with sauce",
      category: "Food",
      calorie: "170 Kal",
      price: 250,
      image:
        "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&q=80",
    },
    {
      id: "popular-2",
      name: "Puree soup with turkey",
      category: "Food",
      calorie: "100 Kal",
      price: 350,
      image:
        "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=800&q=80",
    },
    {
      id: "popular-3",
      name: "Three-Meat Lasagna",
      category: "Food",
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
      id: "featured-1",
      title: "Egg Salad",
      name: "Egg Salad",
      category: "Food",
      rating: "4.3",
      time: "10-15 mins",
      deliveryFee: "৳20 delivery",
      price: 220,
      image:
        "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=1000&q=80",
    },
    {
      id: "featured-2",
      title: "Chicken Pasta",
      name: "Chicken Pasta",
      category: "Food",
      rating: "4.7",
      time: "15-20 mins",
      deliveryFee: "৳30 delivery",
      price: 320,
      image:
        "https://images.unsplash.com/photo-1551892374-ecf8754cf8b0?w=1000&q=80",
    },
    {
      id: "featured-3",
      title: "Fresh Pizza",
      name: "Fresh Pizza",
      category: "Food",
      rating: "4.8",
      time: "20-25 mins",
      deliveryFee: "৳25 delivery",
      price: 450,
      image:
        "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=1000&q=80",
    },
    {
      id: "featured-4",
      title: "Grilled Chicken",
      name: "Grilled Chicken",
      category: "Food",
      rating: "4.6",
      time: "15-25 mins",
      deliveryFee: "৳20 delivery",
      price: 390,
      image:
        "https://images.unsplash.com/photo-1532550907401-a500c9a57435?w=1000&q=80",
    },
  ];

  /*
   * PEOPLE LOOKING FOR
   */
  const peopleLookingFor = [
    {
      id: "people-1",
      dish: "Spicy Fresh Crab",
      name: "Spicy Fresh Crab",
      restaurant: "Waroenk Kita",
      category: "Food",
      price: 550,
      image:
        "https://images.unsplash.com/photo-1551248429-40975aa4de74?w=500&q=80",
    },
    {
      id: "people-2",
      dish: "Chicken Burger",
      name: "Chicken Burger",
      restaurant: "Burger House",
      category: "Food",
      price: 280,
      image:
        "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&q=80",
    },
  ];

  /*
   * LOAD RESTAURANTS
   *
   * Existing API call preserved.
   *
   * Additional food loading is only used for:
   * - category filtering
   * - restaurant menu item count
   */
  useEffect(() => {
    const loadRestaurants = async () => {
      try {
        const response =
          await restaurantService.getRestaurants();

        const loadedRestaurants =
          response?.restaurants || [];

        setRestaurants(loadedRestaurants);

        const foodMap = {};

        await Promise.all(
          loadedRestaurants.map(async (restaurant) => {
            try {
              const result =
                await restaurantService.getFoodsByRestaurantId(
                  restaurant.id
                );

              foodMap[restaurant.id] =
                result?.foods || [];
            } catch (error) {
              console.error(
                "Restaurant food loading error:",
                error
              );

              foodMap[restaurant.id] = [];
            }
          })
        );

        setRestaurantFoods(foodMap);
      } catch (error) {
        console.error(
          "Failed to load restaurants:",
          error
        );
      }
    };

    loadRestaurants();
  }, []);

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
   * ALL FOOD FROM API
   */
  const allApiFoods = useMemo(() => {
    const result = [];

    Object.entries(restaurantFoods).forEach(
      ([restaurantId, foods]) => {
        foods.forEach((food) => {
          result.push({
            ...food,
            restaurantId,
            restaurantName:
              restaurants.find(
                (restaurant) =>
                  String(restaurant.id) ===
                  String(restaurantId)
              )?.name || "",
          });
        });
      }
    );

    return result;
  }, [restaurantFoods, restaurants]);

  /*
   * CATEGORY MATCH
   */
  const matchesCategory = (item) => {
    if (activeCategory === "All") {
      return true;
    }

    const category = String(
      item?.category ||
        item?.categoryName ||
        item?.type ||
        ""
    ).toLowerCase();

    return category ===
      activeCategory.toLowerCase();
  };

  /*
   * CATEGORY FOOD
   *
   * All:
   *   Existing home content remains.
   *
   * Other category:
   *   Only matching category content appears.
   */
  const categoryFoods = useMemo(() => {
    if (activeCategory === "All") {
      return allApiFoods;
    }

    return allApiFoods.filter(matchesCategory);
  }, [activeCategory, allApiFoods]);

  /*
   * POPULAR ITEMS
   */
  const visiblePopularDishes = useMemo(() => {
    if (activeCategory === "All") {
      return popularDishes;
    }

    const apiItems = categoryFoods.slice(0, 8);

    if (apiItems.length > 0) {
      return apiItems.map((item) => ({
        ...item,
        id: item.id,
        name:
          item.name ||
          item.title ||
          "Food Item",
        price:
          Number(item.price) || 0,
        image:
          item.image ||
          item.imageUrl ||
          item.thumbnail ||
          "",
        rating:
          item.rating || "4.5",
      }));
    }

    return [];
  }, [
    activeCategory,
    categoryFoods,
  ]);

  /*
   * FEATURED FILTER
   */
  const visibleFeaturedItems = useMemo(() => {
    if (activeCategory === "All") {
      return featuredItems;
    }

    return categoryFoods
      .slice(0, 6)
      .map((item) => ({
        ...item,
        title:
          item.name ||
          item.title ||
          "Food Item",
        name:
          item.name ||
          item.title ||
          "Food Item",
        price:
          Number(item.price) || 0,
        rating:
          item.rating || "4.5",
        time:
          item.deliveryTime ||
          "15-25 mins",
        deliveryFee:
          item.deliveryFee ||
          "Delivery available",
        image:
          item.image ||
          item.imageUrl ||
          item.thumbnail ||
          "",
      }));
  }, [
    activeCategory,
    categoryFoods,
  ]);

  /*
   * RESTAURANT CATEGORY FILTER
   *
   * When a category is selected,
   * only restaurants having that category
   * will appear.
   */
  const visibleRestaurants = useMemo(() => {
    if (activeCategory === "All") {
      return restaurants;
    }

    return restaurants.filter((restaurant) => {
      const foods =
        restaurantFoods[restaurant.id] || [];

      return foods.some(matchesCategory);
    });
  }, [
    activeCategory,
    restaurants,
    restaurantFoods,
  ]);

  /*
   * RESTAURANT ITEM COUNT
   */
  const getRestaurantItemCount = (restaurant) => {
    const foods =
      restaurantFoods[restaurant.id] || [];

    if (activeCategory === "All") {
      return foods.length;
    }

    return foods.filter(matchesCategory).length;
  };

  /*
   * ADD TO CART
   *
   * Existing CartContext logic preserved.
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

      restaurantId:
        item.restaurantId ||
        item.restaurant?.id ||
        "",

      restaurantName:
        item.restaurantName ||
        item.restaurant?.name ||
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

  /*
   * RESTAURANT CARD
   */
  const RestaurantCard = ({
    restaurant,
  }) => {
    const itemCount =
      getRestaurantItemCount(restaurant);

    return (
      <motion.button
        type="button"
        whileTap={{ scale: 0.97 }}
        onClick={() =>
          navigate(
            `/restaurants/${restaurant.id}`
          )
        }
        className="group min-w-[285px] max-w-[285px] overflow-hidden rounded-[28px] border border-gray-100 bg-white text-left shadow-[0_8px_25px_rgba(0,0,0,0.07)]"
      >
        <div className="relative h-[155px] overflow-hidden">
          <img
            src={
              restaurant.image ||
              "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1000&q=80"
            }
            alt={restaurant.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />

          <div className="absolute left-3 top-3 flex items-center gap-1 rounded-full bg-white px-3 py-1.5 text-[11px] font-extrabold shadow-sm">
            <Star
              size={12}
              className="fill-yellow-400 text-yellow-400"
            />
            {restaurant.rating || "4.5"}
          </div>
        </div>

        <div className="p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h3 className="truncate text-[16px] font-extrabold text-gray-900">
                {restaurant.name}
              </h3>

              <p className="mt-1 truncate text-[10px] font-bold uppercase tracking-wide text-gray-400">
                {restaurant.category ||
                  "Restaurant"}
              </p>
            </div>

            <div className="flex shrink-0 items-center gap-1 rounded-full bg-[#FFF3EB] px-3 py-2 text-[10px] font-extrabold text-[#FF5A00]">
              <Clock3 size={12} />
              {restaurant.deliveryTime ||
                "20-30 mins"}
            </div>
          </div>

          <div className="mt-3 flex items-center justify-between border-t border-gray-100 pt-3">
            <div className="flex items-center gap-1.5 text-[11px] font-bold text-gray-500">
              <Eye
                size={14}
                className="text-[#FF5A00]"
              />
              {itemCount} items
            </div>

            <ChevronRight
              size={18}
              className="text-[#FF5A00]"
            />
          </div>
        </div>
      </motion.button>
    );
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#FDFDFD] pb-24">

      {/* =====================================================
          HERO / BANNER
      ===================================================== */}

      <section className="relative h-[430px] w-full overflow-hidden">

        <AnimatePresence mode="wait">
          <motion.img
            key={currentBanner}
            src={
              banners[currentBanner].image
            }
            initial={{
              opacity: 0,
              scale: 1.03,
            }}
            animate={{
              opacity: 1,
              scale: 1,
            }}
            exit={{
              opacity: 0,
            }}
            transition={{
              duration: 0.8,
            }}
            className="absolute inset-0 h-full w-full object-cover"
            alt={
              banners[currentBanner].title
            }
          />
        </AnimatePresence>

        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/20 to-[#FDFDFD]" />

        <div className="absolute inset-0 px-5 pt-6">

          {/* HEADER */}

          <div className="flex items-center justify-between">

            <button
              type="button"
              onClick={() =>
                navigate("/location")
              }
              className="flex items-center gap-2 rounded-full bg-white/20 p-1 pr-4 backdrop-blur-md"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white">
                <MapPin
                  size={18}
                  className="text-[#FF5A00]"
                />
              </span>

              <div className="text-left">
                <p className="text-[9px] font-bold uppercase text-white/75">
                  Delivery to
                </p>

                <p className="max-w-[145px] truncate text-[11px] font-extrabold text-white">
                  {userLocation}
                </p>
              </div>
            </button>

            <div className="flex gap-2">

              <button
                type="button"
                className="relative flex h-11 w-11 items-center justify-center rounded-full bg-white/20 backdrop-blur-md"
                aria-label="Notifications"
              >
                <Bell
                  size={20}
                  className="text-white"
                />

                <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-[#FF5A00]" />
              </button>

              <button
                type="button"
                onClick={() =>
                  navigate("/profile")
                }
                className="h-11 w-11 overflow-hidden rounded-full border-2 border-white"
                aria-label="Profile"
              >
                <img
                  src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&q=80"
                  alt="Profile"
                  className="h-full w-full object-cover"
                />
              </button>

            </div>
          </div>

          {/* HERO TITLE */}

          <h1 className="mt-10 max-w-[330px] text-[32px] font-extrabold leading-[1.1] text-white">
            What are you going
            <br />
            to eat today?
          </h1>

          {/* SEARCH + FILTER */}

          <div className="mt-7 flex items-center gap-2 rounded-full bg-[#252525] p-1.5 shadow-2xl">

            <button
              type="button"
              onClick={() =>
                navigate("/search")
              }
              className="flex min-w-0 flex-1 items-center gap-3 rounded-full px-5 py-3.5 text-left"
            >
              <Search
                size={21}
                className="shrink-0 text-gray-300"
              />

              <span className="truncate text-sm font-medium text-gray-400">
                Search here...
              </span>
            </button>

            <button
              type="button"
              onClick={() =>
                setShowFilter(true)
              }
              className="flex h-[50px] shrink-0 items-center gap-2 rounded-full bg-[#FF5A00] px-5 text-sm font-extrabold text-white shadow-md active:scale-95"
            >
              Filter

              <SlidersHorizontal
                size={18}
              />
            </button>

          </div>

        </div>
      </section>

      <main className="relative mx-auto max-w-7xl px-5">

        {/* =====================================================
            CATEGORIES
        ===================================================== */}

        <section className="relative -mt-4">

          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-[20px] font-extrabold text-gray-900">
              Categories
            </h2>

            <button
              type="button"
              onClick={() =>
                setActiveCategory("All")
              }
              className="text-xs font-extrabold text-[#FF5A00]"
            >
              See All
            </button>
          </div>

          <div className="no-scrollbar flex items-start gap-5 overflow-x-auto px-1 pb-5 pt-4">

            {categories.map((item) => {
              const selected =
                activeCategory ===
                item.name;

              const Icon = item.icon;

              return (
                <div
                  key={item.name}
                  className="flex min-w-[68px] flex-col items-center"
                >
                  <motion.button
                    type="button"
                    onClick={() =>
                      setActiveCategory(
                        item.name
                      )
                    }
                    animate={{
                      y: selected ? -9 : 0,
                      scale: selected
                        ? 1.05
                        : 1,
                    }}
                    whileTap={{
                      scale: 0.92,
                    }}
                    transition={{
                      type: "spring",
                      stiffness: 400,
                      damping: 25,
                    }}
                    className={`relative flex h-[68px] w-[68px] items-center justify-center overflow-hidden rounded-full bg-white shadow-[0_5px_20px_rgba(0,0,0,0.10)] ${
                      selected
                        ? "ring-2 ring-[#FF5A00]"
                        : ""
                    }`}
                  >
                    {Icon ? (
                      <Icon
                        size={28}
                        strokeWidth={2.2}
                        className={
                          selected
                            ? "text-[#FF5A00]"
                            : "text-gray-700"
                        }
                      />
                    ) : (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-full w-full object-cover"
                      />
                    )}
                  </motion.button>

                  <p
                    className={`mt-2 text-[11px] font-extrabold ${
                      selected
                        ? "text-[#FF5A00]"
                        : "text-gray-600"
                    }`}
                  >
                    {item.name}
                  </p>
                </div>
              );
            })}

          </div>
        </section>

        {/* =====================================================
            POPULAR ITEMS
        ===================================================== */}

        <section className="mt-3">

          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-[21px] font-extrabold text-gray-900">
              Popular Items
            </h2>

            <button
              type="button"
              onClick={() =>
                navigate("/restaurants")
              }
              className="text-xs font-extrabold text-[#FF5A00]"
            >
              See All
            </button>
          </div>

          {visiblePopularDishes.length > 0 ? (
            <div className="no-scrollbar flex gap-4 overflow-x-auto pb-4">

              {visiblePopularDishes.map(
                (item) => {
                  const qty =
                    getItemQty(item.id);

                  return (
                    <motion.div
                      key={item.id}
                      whileTap={{
                        scale: 0.97,
                      }}
                      className="min-w-[205px] overflow-hidden rounded-[25px] border border-gray-100 bg-white shadow-[0_8px_25px_rgba(0,0,0,0.08)]"
                    >
                      <div className="relative h-[135px]">

                        <img
                          src={
                            item.image
                          }
                          alt={
                            item.name
                          }
                          className="h-full w-full object-cover"
                        />

                        <div className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-white px-2.5 py-1.5 text-[10px] font-extrabold shadow-sm">
                          <Star
                            size={11}
                            className="fill-yellow-400 text-yellow-400"
                          />
                          {item.rating ||
                            "4.5"}
                        </div>

                      </div>

                      <div className="p-3.5">

                        <h3 className="truncate text-[14px] font-extrabold text-gray-900">
                          {item.name}
                        </h3>

                        {item.calorie && (
                          <p className="mt-1 text-[10px] font-bold text-gray-400">
                            {item.calorie}
                          </p>
                        )}

                        <div className="mt-3 flex items-center justify-between">

                          <span className="text-[17px] font-extrabold text-[#FF5A00]">
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
                            className={`flex h-9 w-9 items-center justify-center rounded-full text-white shadow-md active:scale-90 ${
                              addedItemId ===
                              item.id
                                ? "bg-green-500"
                                : "bg-[#FF5A00]"
                            }`}
                          >
                            {addedItemId ===
                            item.id ? (
                              <Check
                                size={17}
                              />
                            ) : (
                              <Plus
                                size={18}
                              />
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
          ) : (
            <div className="rounded-[24px] bg-gray-50 p-8 text-center">
              <p className="text-sm font-bold text-gray-500">
                No items found in this category.
              </p>
            </div>
          )}

        </section>

        {/* =====================================================
            FEATURED ITEMS
        ===================================================== */}

        <section className="mt-9">

          <div className="mb-5 flex items-center justify-between">

            <h2 className="text-[21px] font-extrabold text-gray-900">
              Featured Items
            </h2>

            <button
              type="button"
              onClick={() =>
                navigate("/restaurants")
              }
              className="text-xs font-extrabold text-[#FF5A00]"
            >
              See All
            </button>

          </div>

          <div className="no-scrollbar flex gap-4 overflow-x-auto pb-4">

            {visibleFeaturedItems.map(
              (item) => {
                const qty =
                  getItemQty(item.id);

                return (
                  <motion.div
                    key={item.id}
                    whileTap={{
                      scale: 0.97,
                    }}
                    className="min-w-[235px] overflow-hidden rounded-[25px] border border-gray-100 bg-white shadow-[0_7px_22px_rgba(0,0,0,0.07)]"
                  >

                    <div className="relative h-[145px]">

                      <img
                        src={item.image}
                        alt={
                          item.title
                        }
                        className="h-full w-full object-cover"
                      />

                      <span className="absolute left-3 top-3 rounded-full bg-[#FF5A00] px-3 py-1.5 text-[9px] font-extrabold text-white">
                        FEATURED
                      </span>

                      <span className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-white px-2.5 py-1.5 text-[10px] font-bold">
                        <Star
                          size={11}
                          className="fill-yellow-400 text-yellow-400"
                        />
                        {item.rating}
                      </span>

                    </div>

                    <div className="p-3.5">

                      <h3 className="truncate text-[14px] font-extrabold text-gray-900">
                        {item.title}
                      </h3>

                      <p className="mt-1 text-[9px] font-bold text-gray-400">
                        {item.time} •{" "}
                        {item.deliveryFee}
                      </p>

                      <div className="mt-3 flex items-center justify-between">

                        <span className="text-[16px] font-extrabold text-[#FF5A00]">
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
                          className={`flex h-9 w-9 items-center justify-center rounded-full text-white shadow-md ${
                            addedItemId ===
                            item.id
                              ? "bg-green-500"
                              : "bg-[#FF5A00]"
                          }`}
                        >
                          {addedItemId ===
                          item.id ? (
                            <Check
                              size={17}
                            />
                          ) : (
                            <Plus
                              size={18}
                            />
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
            POPULAR RESTAURANTS
        ===================================================== */}

        <section className="mt-10">

          <div className="mb-4 flex items-center justify-between">

            <h2 className="text-[21px] font-extrabold text-gray-900">
              Popular Restaurant
            </h2>

            <button
              type="button"
              onClick={() =>
                navigate("/restaurants")
              }
              className="text-xs font-extrabold text-[#FF5A00]"
            >
              See All
            </button>

          </div>

          <div className="no-scrollbar mb-5 flex gap-2.5 overflow-x-auto pb-2">

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
                className={`whitespace-nowrap rounded-full px-5 py-2.5 text-[10px] font-extrabold ${
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

          {visibleRestaurants.length > 0 ? (
            <div className="no-scrollbar flex gap-4 overflow-x-auto pb-5">

              {visibleRestaurants.map(
                (restaurant) => (
                  <RestaurantCard
                    key={restaurant.id}
                    restaurant={
                      restaurant
                    }
                  />
                )
              )}

            </div>
          ) : (
            <div className="rounded-[25px] border border-gray-100 bg-white p-8 text-center shadow-sm">
              <p className="text-sm font-bold text-gray-500">
                No restaurants available
                for this category.
              </p>
            </div>
          )}

        </section>

        {/* =====================================================
            BEST BRANDS NEAR YOU
        *
        * Separate brand-style card.
        * No item count here.
        * ===================================================== */}

        <section className="mt-9">

          <div className="mb-5 flex items-center justify-between">

            <h2 className="text-[21px] font-extrabold text-gray-900">
              Best Brands Near You
            </h2>

            <button
              type="button"
              onClick={() =>
                navigate("/restaurants")
              }
              className="text-xs font-extrabold text-[#FF5A00]"
            >
              See All
            </button>

          </div>

          <div className="no-scrollbar flex gap-3 overflow-x-auto pb-4">

            {restaurants
              .slice(0, 8)
              .map((restaurant) => (
                <motion.button
                  key={`brand-${restaurant.id}`}
                  type="button"
                  whileTap={{
                    scale: 0.95,
                  }}
                  onClick={() =>
                    navigate(
                      `/restaurants/${restaurant.id}`
                    )
                  }
                  className="flex min-w-[105px] flex-col items-center rounded-[22px] border border-gray-100 bg-white p-3 shadow-[0_5px_18px_rgba(0,0,0,0.06)]"
                >

                  <div className="flex h-[68px] w-[68px] items-center justify-center overflow-hidden rounded-[18px] bg-[#FFF7F1]">
                    <img
                      src={
                        restaurant.image ||
                        "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=300&q=80"
                      }
                      alt={
                        restaurant.name
                      }
                      className="h-full w-full object-cover"
                    />
                  </div>

                  <p className="mt-2 w-full truncate text-center text-[10px] font-extrabold text-gray-800">
                    {restaurant.name}
                  </p>

                </motion.button>
              ))}

          </div>
        </section>

        {/* =====================================================
            PEOPLE LOOKING FOR
        ===================================================== */}

        <section className="mt-9">

          <div className="mb-5 flex items-center justify-between">

            <h2 className="text-[21px] font-extrabold text-gray-900">
              People are looking for
            </h2>

            <ChevronRight
              size={20}
              className="text-[#FF5A00]"
            />

          </div>

          <div className="no-scrollbar flex gap-4 overflow-x-auto pb-4">

            {peopleLookingFor
              .filter(matchesCategory)
              .map((item) => {
                const qty =
                  getItemQty(item.id);

                return (
                  <div
                    key={item.id}
                    className="flex min-w-[270px] items-center justify-between rounded-[24px] border border-gray-100 bg-white p-3 shadow-sm"
                  >

                    <div className="flex min-w-0 items-center gap-3">

                      <img
                        src={item.image}
                        alt={item.dish}
                        className="h-16 w-16 shrink-0 rounded-2xl object-cover"
                      />

                      <div className="min-w-0">

                        <h3 className="truncate text-[13px] font-extrabold text-gray-800">
                          {item.dish}
                        </h3>

                        <p className="mt-1 truncate text-[9px] font-bold uppercase text-gray-400">
                          {item.restaurant}
                        </p>

                        <p className="mt-1 text-[14px] font-extrabold text-[#FF5A00]">
                          {formatPrice(
                            item.price
                          )}
                        </p>

                        {qty > 0 && (
                          <p className="text-[9px] font-bold text-green-600">
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
                      className={`ml-2 flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-white shadow-md ${
                        addedItemId ===
                        item.id
                          ? "bg-green-500"
                          : "bg-[#FF5A00]"
                      }`}
                    >
                      {addedItemId ===
                      item.id ? (
                        <Check
                          size={17}
                        />
                      ) : (
                        <Plus
                          size={18}
                        />
                      )}
                    </button>

                  </div>
                );
              })}

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

      </main>

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
