import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  MapPin,
  Star,
  Plus,
  Bell,
  ShoppingCart,
  Check,
  SlidersHorizontal,
  Heart,
  Eye,
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
  const [allFoods, setAllFoods] = useState([]);

  const [showFilter, setShowFilter] = useState(false);

  const [activeCategory, setActiveCategory] =
    useState("All");

  const [userLocation, setUserLocation] = useState(
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
   * ============================================================
   * LOCATION
   * ============================================================
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
   * ============================================================
   * ORIGINAL BANNER LOGIC
   * ============================================================
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
        prev === banners.length - 1
          ? 0
          : prev + 1
      );
    }, 3000);

    return () => clearInterval(timer);
  }, [banners.length]);

  /*
   * ============================================================
   * CATEGORY IMAGES
   * ============================================================
   */

  const categoryImages = {
    All:
      "https://images.unsplash.com/photo-1547592180-85f173990554?w=300&q=80",

    Burger:
      "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=300&q=80",

    Pizza:
      "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=300&q=80",

    Sushi:
      "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=300&q=80",

    Salad:
      "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=300&q=80",

    Fruits:
      "https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=300&q=80",

    Drinks:
      "https://images.unsplash.com/photo-1544145945-f90425340c7e?w=300&q=80",

    Snacks:
      "https://images.unsplash.com/photo-1621939514649-280e2aaec8a9?w=300&q=80",

    Food:
      "https://images.unsplash.com/photo-1547592180-85f173990554?w=300&q=80",
  };

  /*
   * ============================================================
   * LOAD RESTAURANTS
   *
   * Existing restaurantService API preserved.
   * Restaurant food API is only used to enrich existing data.
   * ============================================================
   */

  useEffect(() => {
    const loadRestaurants = async () => {
      try {
        const response =
          await restaurantService.getRestaurants();

        const restaurantList =
          response?.restaurants || [];

        setRestaurants(restaurantList);

        /*
         * Load menu data without changing the
         * existing restaurant API behaviour.
         */
        const restaurantFoodResults =
          await Promise.all(
            restaurantList.map(async (restaurant) => {
              try {
                const result =
                  await restaurantService.getFoodsByRestaurantId(
                    restaurant.id
                  );

                const foods = result?.foods || [];

                return {
                  restaurantId: restaurant.id,
                  restaurantName: restaurant.name,
                  foods,
                };
              } catch (error) {
                console.error(
                  "Restaurant food loading error:",
                  error
                );

                return {
                  restaurantId: restaurant.id,
                  restaurantName: restaurant.name,
                  foods: [],
                };
              }
            })
          );

        const flattenedFoods =
          restaurantFoodResults.flatMap(
            ({ restaurantId, restaurantName, foods }) =>
              foods.map((food) => ({
                ...food,
                restaurantId,
                restaurantName,
              }))
          );

        setAllFoods(flattenedFoods);
      } catch (error) {
        console.error(
          "Failed to load restaurants:",
          error
        );

        setRestaurants([]);
        setAllFoods([]);
      }
    };

    loadRestaurants();
  }, []);

  /*
   * ============================================================
   * CATEGORY NORMALIZER
   * ============================================================
   */

  const normalizeCategory = (value) => {
    if (!value) return "";

    return String(value)
      .trim()
      .toLowerCase()
      .replace(/[_-]/g, " ")
      .replace(/\s+/g, " ");
  };

  const categoryAliases = {
    burger: ["burger", "burgers"],
    pizza: ["pizza", "pizzas"],
    sushi: ["sushi"],
    salad: ["salad", "salads"],
    fruits: ["fruit", "fruits"],
    drinks: [
      "drink",
      "drinks",
      "beverage",
      "beverages",
    ],
    snacks: [
      "snack",
      "snacks",
      "fast food",
      "fastfood",
    ],
    food: ["food", "foods"],
  };

  const foodBelongsToCategory = (
    food,
    category
  ) => {
    if (category === "All") return true;

    const foodCategory =
      normalizeCategory(food?.category);

    const selected =
      normalizeCategory(category);

    const aliases =
      categoryAliases[selected] || [selected];

    return aliases.some((alias) => {
      const normalizedAlias =
        normalizeCategory(alias);

      return (
        foodCategory === normalizedAlias ||
        foodCategory.includes(normalizedAlias) ||
        normalizedAlias.includes(foodCategory)
      );
    });
  };

  /*
   * ============================================================
   * DYNAMIC CATEGORIES
   *
   * All ALWAYS comes first.
   * ============================================================
   */

  const categories = useMemo(() => {
    const baseCategories = [
      "All",
      "Burger",
      "Pizza",
      "Sushi",
      "Salad",
      "Fruits",
      "Drinks",
      "Snacks",
    ];

    const available = new Set();

    allFoods.forEach((food) => {
      const category =
        String(food?.category || "").trim();

      if (category) {
        available.add(normalizeCategory(category));
      }
    });

    const result = baseCategories.filter(
      (category) => {
        if (category === "All") return true;

        if (!allFoods.length) return true;

        return allFoods.some((food) =>
          foodBelongsToCategory(
            food,
            category
          )
        );
      }
    );

    /*
     * Keep unknown API categories available too.
     */
    allFoods.forEach((food) => {
      const raw =
        String(food?.category || "").trim();

      if (!raw) return;

      const exists = result.some(
        (item) =>
          normalizeCategory(item) ===
          normalizeCategory(raw)
      );

      if (!exists) {
        result.push(raw);
      }
    });

    return result;
  }, [allFoods]);

  /*
   * ============================================================
   * CATEGORY FILTERED FOODS
   * ============================================================
   */

  const categoryFoods = useMemo(() => {
    if (activeCategory === "All") {
      return allFoods;
    }

    return allFoods.filter((food) =>
      foodBelongsToCategory(
        food,
        activeCategory
      )
    );
  }, [allFoods, activeCategory]);

  /*
   * ============================================================
   * POPULAR DISHES
   * ============================================================
   *
   * All = original Home content.
   * Specific category = API foods from that category.
   * ============================================================
   */

  const defaultPopularDishes = [
    {
      id: "popular-1",
      name: "Cabbage with sauce",
      calorie: "170 Kal",
      price: 250,
      image:
        "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&q=80",
    },
    {
      id: "popular-2",
      name: "Puree soup with turkey",
      calorie: "100 Kal",
      price: 350,
      image:
        "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=800&q=80",
    },
    {
      id: "popular-3",
      name: "Three-Meat Lasagna",
      calorie: "250 Kal",
      price: 450,
      image:
        "https://images.unsplash.com/photo-1574894709920-11b28e7367e3?w=800&q=80",
    },
  ];

  const popularDishes = useMemo(() => {
    if (activeCategory === "All") {
      return defaultPopularDishes;
    }

    return categoryFoods.slice(0, 8).map(
      (food, index) => ({
        ...food,
        id:
          food.id ||
          `category-popular-${index}`,
        name:
          food.name ||
          food.title ||
          "Food Item",
        price:
          Number(food.price || 0),
        calorie:
          food.calorie ||
          food.calories ||
          "100 Kal",
        image:
          food.image ||
          food.imageUrl ||
          "",
      })
    );
  }, [
    activeCategory,
    categoryFoods,
  ]);

  /*
   * ============================================================
   * FEATURED ITEMS
   * ============================================================
   */

  const defaultFeaturedItems = [
    {
      id: "featured-1",
      title: "Egg Salad",
      name: "Egg Salad",
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
      rating: "4.6",
      time: "15-25 mins",
      deliveryFee: "৳20 delivery",
      price: 390,
      image:
        "https://images.unsplash.com/photo-1532550907401-a500c9a57435?w=1000&q=80",
    },
  ];

  const featuredItems = useMemo(() => {
    if (activeCategory === "All") {
      return defaultFeaturedItems;
    }

    return categoryFoods.slice(0, 4).map(
      (food, index) => ({
        ...food,
        id:
          food.id ||
          `category-featured-${index}`,
        title:
          food.name ||
          food.title ||
          "Food Item",
        name:
          food.name ||
          food.title ||
          "Food Item",
        rating:
          food.rating || "4.5",
        time:
          food.deliveryTime ||
          food.time ||
          "20-30 mins",
        deliveryFee:
          food.deliveryFee ||
          "Free delivery",
        price:
          Number(food.price || 0),
        image:
          food.image ||
          food.imageUrl ||
          "",
      })
    );
  }, [
    activeCategory,
    categoryFoods,
  ]);

  /*
   * ============================================================
   * CATEGORY REELS / STORY SECTION
   * ============================================================
   */

  const reels = [
    {
      id: 1,
      name: "Fresh",
      image:
        "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=500&q=80",
    },
    {
      id: 2,
      name: "Hot Deals",
      image:
        "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=500&q=80",
    },
    {
      id: 3,
      name: "Popular",
      image:
        "https://images.unsplash.com/photo-1547592180-85f173990554?w=500&q=80",
    },
    {
      id: 4,
      name: "Best Rated",
      image:
        "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500&q=80",
    },
    {
      id: 5,
      name: "New",
      image:
        "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=500&q=80",
    },
  ];

  /*
   * ============================================================
   * RESTAURANT MENU COUNTS
   * ============================================================
   */

  const getRestaurantMenuCount = (
    restaurant
  ) => {
    const foods = allFoods.filter(
      (food) =>
        String(food.restaurantId) ===
        String(restaurant.id)
    );

    return foods.length;
  };

  /*
   * ============================================================
   * CATEGORY RESTAURANTS
   * ============================================================
   */

  const visibleRestaurants = useMemo(() => {
    if (activeCategory === "All") {
      return restaurants;
    }

    const restaurantIds = new Set(
      categoryFoods.map((food) =>
        String(food.restaurantId)
      )
    );

    return restaurants.filter((restaurant) =>
      restaurantIds.has(
        String(restaurant.id)
      )
    );
  }, [
    restaurants,
    categoryFoods,
    activeCategory,
  ]);

  /*
   * ============================================================
   * CART
   * ============================================================
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
   * ============================================================
   * BODY LOCK
   * ============================================================
   */

  useEffect(() => {
    document.body.style.overflow =
      showFilter ? "hidden" : "auto";

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [showFilter]);

  /*
   * ============================================================
   * FOOD CARD
   * ============================================================
   */

  const PopularDishCard = ({
    item,
  }) => {
    const qty = getItemQty(item.id);

    return (
      <motion.div
        whileTap={{ scale: 0.97 }}
        className="relative min-w-[176px] overflow-hidden rounded-[26px] bg-white shadow-[0_8px_25px_rgba(0,0,0,0.07)]"
      >
        <button
          type="button"
          onClick={() =>
            navigate(`/food/${item.id}`, {
              state: {
                food: item,
              },
            })
          }
          className="block w-full text-left"
        >
          <div className="relative h-[122px] overflow-hidden rounded-t-[26px]">
            {item.image ? (
              <img
                src={item.image}
                alt={item.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="h-full w-full bg-gray-100" />
            )}

            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
              }}
              className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/95 text-gray-700 shadow-sm"
              aria-label={`Favourite ${item.name}`}
            >
              <Heart size={15} />
            </button>
          </div>

          <div className="p-3.5">
            <h3 className="line-clamp-1 text-[13px] font-extrabold text-gray-900">
              {item.name}
            </h3>

            <p className="mt-1.5 text-[10px] font-semibold text-gray-400">
              {item.calorie || "100 Kal"}
            </p>

            <p className="mt-2 text-[16px] font-extrabold text-[#FF5A00]">
              {formatPrice(item.price)}
            </p>
          </div>
        </button>

        <button
          type="button"
          onClick={() =>
            handleAddToCart(item)
          }
          className={`absolute bottom-[48px] right-3 flex h-8 w-8 items-center justify-center rounded-full text-white shadow-md transition-all active:scale-90 ${
            addedItemId === item.id
              ? "bg-green-500"
              : "bg-[#FF5A00]"
          }`}
          aria-label={`Add ${item.name} to cart`}
        >
          {addedItemId === item.id ? (
            <Check size={16} />
          ) : (
            <Plus size={17} />
          )}
        </button>

        {qty > 0 && (
          <div className="px-3.5 pb-2 text-[9px] font-bold text-green-600">
            {qty} in cart
          </div>
        )}
      </motion.div>
    );
  };

  /*
   * ============================================================
   * FEATURED CARD
   * ============================================================
   */

  const FeaturedCard = ({ item }) => {
    const qty = getItemQty(item.id);

    return (
      <motion.div
        whileTap={{ scale: 0.97 }}
        className="overflow-hidden rounded-[24px] border border-gray-100 bg-white shadow-md"
      >
        <button
          type="button"
          onClick={() =>
            navigate(`/food/${item.id}`, {
              state: {
                food: item,
              },
            })
          }
          className="block w-full text-left"
        >
          <div className="relative h-[145px]">
            {item.image ? (
              <img
                src={item.image}
                alt={item.title}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="h-full w-full bg-gray-100" />
            )}

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
              {item.time}
            </p>

            <div className="mt-2 flex items-center justify-between">
              <span className="text-[15px] font-extrabold text-[#FF5A00]">
                {formatPrice(item.price)}
              </span>
            </div>
          </div>
        </button>

        <button
          type="button"
          onClick={() =>
            handleAddToCart(item)
          }
          className={`mx-3 mb-3 flex h-9 w-[calc(100%-24px)] items-center justify-center gap-2 rounded-xl text-white shadow-md transition-transform active:scale-95 ${
            addedItemId === item.id
              ? "bg-green-500"
              : "bg-[#FF5A00]"
          }`}
        >
          {addedItemId === item.id ? (
            <>
              <Check size={16} />
              Added
            </>
          ) : (
            <>
              <ShoppingCart size={16} />
              Add
            </>
          )}
        </button>

        {qty > 0 && (
          <p className="pb-3 text-center text-[9px] font-bold text-green-600">
            {qty} in cart
          </p>
        )}
      </motion.div>
    );
  };

  /*
   * ============================================================
   * RESTAURANT CARD
   *
   * Different from Popular Dish / Brand card.
   * Horizontal restaurant carousel.
   * ============================================================
   */

  const RestaurantCard = ({
    restaurant,
  }) => {
    const menuCount =
      getRestaurantMenuCount(
        restaurant
      );

    return (
      <motion.button
        type="button"
        whileTap={{ scale: 0.97 }}
        onClick={() =>
          navigate(
            `/restaurants/${restaurant.id}`
          )
        }
        className="group relative min-w-[278px] overflow-hidden rounded-[28px] bg-white text-left shadow-[0_8px_28px_rgba(0,0,0,0.08)]"
      >
        <div className="relative h-[170px] overflow-hidden">
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

          <button
            type="button"
            onClick={(event) =>
              event.stopPropagation()
            }
            className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/95 text-gray-700 shadow-sm"
            aria-label={`Favourite ${restaurant.name}`}
          >
            <Heart size={17} />
          </button>
        </div>

        <div className="p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h3 className="truncate text-[16px] font-extrabold text-gray-900">
                {restaurant.name}
              </h3>

              <p className="mt-1 truncate text-[10px] font-semibold uppercase tracking-wider text-gray-400">
                {restaurant.category ||
                  "Restaurant"}
              </p>
            </div>

            <ChevronRight
              size={18}
              className="mt-1 shrink-0 text-gray-400"
            />
          </div>

          <div className="mt-4 flex items-center gap-2">
            <span className="rounded-full bg-[#FFF3EB] px-3 py-1.5 text-[10px] font-extrabold text-[#FF5A00]">
              {menuCount} items
            </span>

            {restaurant.deliveryTime && (
              <span className="rounded-full bg-gray-50 px-3 py-1.5 text-[10px] font-bold text-gray-500">
                {restaurant.deliveryTime}
              </span>
            )}
          </div>
        </div>
      </motion.button>
    );
  };

  /*
   * ============================================================
   * RENDER
   * ============================================================
   */

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#FDFDFD] pb-24">

      {/* ======================================================
          ORIGINAL HERO / BANNER
          ====================================================== */}

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

        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/15 to-[#FDFDFD]" />

        <div className="absolute inset-0 px-5 pt-6">

          {/* HEADER */}

          <div className="z-10 mb-8 flex items-center justify-between">

            <button
              type="button"
              onClick={() =>
                navigate("/location")
              }
              className="flex items-center gap-3 rounded-full border border-white/20 bg-white/15 p-1 pr-4 backdrop-blur-md"
            >
              <div className="flex items-center justify-center rounded-full bg-white p-2">
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

          {/* SEARCH + FILTER */}

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

            <button
              type="button"
              onClick={() =>
                setShowFilter(true)
              }
              className="flex h-[58px] w-[58px] items-center justify-center rounded-2xl bg-[#FF5A00] text-white shadow-lg transition-all active:scale-95"
              aria-label="Open filters"
            >
              <SlidersHorizontal
                size={23}
                strokeWidth={2.3}
              />
            </button>

          </div>
        </div>
      </div>

      <main className="mx-auto max-w-7xl px-5">

        {/* ======================================================
            CATEGORY FOOD ORDER CTA
            Compact Static Rider + Order Now
            ====================================================== */}

        <section className="relative z-20 -mt-10 mb-[-10px] h-[145px] overflow-visible">
          <div className="absolute inset-x-0 top-[-8px] flex justify-center">
            <div className="relative h-[140px] w-full max-w-[320px]">

              <img
                src="/animations/category-order-rider.png"
                alt="Order food now"
                className="absolute left-1/2 top-0 h-[135px] w-[245px] -translate-x-1/2 object-contain"
              />

              <button
                type="button"
                onClick={() => navigate("/category-food")}
                className="absolute bottom-[2px] left-1/2 h-[40px] w-[175px] -translate-x-1/2 rounded-full"
                aria-label="Order Now"
              />

            </div>
          </div>
        </section>

        {/* ====================================================
            CATEGORY
            ==================================================== */}

        <section className="relative -mt-10 z-20">

          <div className="mb-4 flex items-center justify-between px-1">
            <h2 className="text-xl font-extrabold text-gray-900">
              Category
            </h2>

            <button
              type="button"
              onClick={() =>
                setActiveCategory("All")
              }
              className="text-xs font-bold text-gray-400"
            >
              See All
            </button>
          </div>

          <div className="no-scrollbar flex gap-3 overflow-x-auto pb-3">

            {categories.map(
              (category) => {
                const selected =
                  activeCategory === category;

                return (
                  <motion.button
                    key={category}
                    type="button"
                    whileTap={{
                      scale: 0.96,
                    }}
                    onClick={() =>
                      setActiveCategory(
                        category
                      )
                    }
                    className={`flex h-[58px] shrink-0 items-center gap-2 rounded-full border px-2.5 pr-5 transition-all duration-300 ${
                      selected
                        ? "border-[#FF5A00] bg-[#FFB800] shadow-md"
                        : "border-gray-100 bg-white shadow-sm"
                    }`}
                  >
                    <span
                      className={`flex h-11 w-11 items-center justify-center overflow-hidden rounded-full ${
                        selected
                          ? "ring-2 ring-white"
                          : ""
                      }`}
                    >
                      <img
                        src={
                          categoryImages[
                            category
                          ] ||
                          categoryImages.All
                        }
                        alt={category}
                        className="h-full w-full object-cover"
                      />
                    </span>

                    <span
                      className={`text-[13px] font-extrabold ${
                        selected
                          ? "text-gray-900"
                          : "text-gray-600"
                      }`}
                    >
                      {category}
                    </span>
                  </motion.button>
                );
              }
            )}

          </div>
        </section>

        {/* ====================================================
            ALL CATEGORY ONLY — REELS STYLE
            ==================================================== */}

        {activeCategory === "All" && (
          <section className="mt-5">

            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-extrabold text-gray-900">
                Explore
              </h2>

              <button
                type="button"
                onClick={() =>
                  navigate("/explore-reels")
                }
                className="text-xs font-bold text-[#FF5A00]"
              >
                See All
              </button>
            </div>

            <div className="no-scrollbar flex gap-4 overflow-x-auto pb-2">

              {reels.map((item) => (
                <button
                  type="button"
                  key={item.id}
                  className="flex w-[72px] shrink-0 flex-col items-center gap-2"
                >
                  <span className="h-[68px] w-[68px] rounded-full bg-gradient-to-br from-[#FF5A00] via-[#FFB800] to-[#FFE2C9] p-[3px]">
                    <span className="block h-full w-full overflow-hidden rounded-full border-2 border-white">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-full w-full object-cover"
                      />
                    </span>
                  </span>

                  <span className="w-full truncate text-center text-[10px] font-bold text-gray-600">
                    {item.name}
                  </span>
                </button>
              ))}

            </div>
          </section>
        )}

        {/* ====================================================
            POPULAR DISHES
            ==================================================== */}

        <section className="mt-7">

          <div className="mb-5 flex items-center justify-between">

            <h2 className="text-xl font-extrabold text-gray-900">
              Popular Dishes
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

          {popularDishes.length > 0 ? (
            <div className="no-scrollbar flex gap-4 overflow-x-auto pb-3">
              {popularDishes.map((item) => (
                <PopularDishCard
                  key={item.id}
                  item={item}
                />
              ))}
            </div>
          ) : (
            <div className="rounded-3xl bg-white p-8 text-center shadow-sm">
              <p className="text-sm font-semibold text-gray-400">
                No dishes available in this category.
              </p>
            </div>
          )}
        </section>

        {/* ====================================================
            FEATURED
            ==================================================== */}

        <section className="mt-9">

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

          {featuredItems.length > 0 ? (
            <div className="grid grid-cols-2 gap-4">
              {featuredItems.map((item) => (
                <FeaturedCard
                  key={item.id}
                  item={item}
                />
              ))}
            </div>
          ) : (
            <div className="rounded-3xl bg-white p-8 text-center shadow-sm">
              <p className="text-sm font-semibold text-gray-400">
                No featured items available.
              </p>
            </div>
          )}

        </section>

        {/* ====================================================
            RESTAURANTS
            ==================================================== */}

        <section className="mt-10">

          <div className="mb-5 flex items-center justify-between">

            <h2 className="text-xl font-extrabold text-gray-900">
              Popular Restaurants
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

          {visibleRestaurants.length > 0 ? (
            <div className="no-scrollbar flex gap-4 overflow-x-auto pb-4">

              {visibleRestaurants.map(
                (restaurant) => (
                  <RestaurantCard
                    key={restaurant.id}
                    restaurant={restaurant}
                  />
                )
              )}

            </div>
          ) : (
            <div className="rounded-[28px] border border-gray-100 bg-white p-8 text-center shadow-sm">
              <p className="text-sm font-bold text-gray-500">
                No restaurants available in this category.
              </p>
            </div>
          )}

        </section>

        {/* ====================================================
            PEOPLE LOOKING FOR
            ONLY ON ALL
            ==================================================== */}

        {activeCategory === "All" && (
          <section className="mt-10">

            <div className="mb-5 flex items-center justify-between">

              <h2 className="text-xl font-extrabold text-gray-900">
                People are looking for
              </h2>

            </div>

            <div className="space-y-4">

              {[
                {
                  id: "people-1",
                  dish: "Spicy Fresh Crab",
                  restaurant: "Waroenk Kita",
                  price: 550,
                  image:
                    "https://images.unsplash.com/photo-1551248429-40975aa4de74?w=500&q=80",
                },
                {
                  id: "people-2",
                  dish: "Chicken Burger",
                  restaurant: "Burger House",
                  price: 280,
                  image:
                    "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&q=80",
                },
              ].map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between rounded-[24px] border border-gray-100 bg-white p-4 shadow-sm"
                >

                  <div className="flex min-w-0 items-center gap-4">

                    <img
                      src={item.image}
                      alt={item.dish}
                      className="h-16 w-16 rounded-2xl object-cover"
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

                    </div>

                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      handleAddToCart(item)
                    }
                    className={`ml-3 flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-white shadow-md ${
                      addedItemId === item.id
                        ? "bg-green-500"
                        : "bg-[#FF5A00]"
                    }`}
                    aria-label={`Add ${item.dish} to cart`}
                  >
                    {addedItemId === item.id ? (
                      <Check size={19} />
                    ) : (
                      <ShoppingCart
                        size={19}
                      />
                    )}
                  </button>

                </div>
              ))}

            </div>

          </section>
        )}



        {/* ====================================================
            FILTER
            ==================================================== */}

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
