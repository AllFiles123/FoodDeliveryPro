import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  ArrowLeft,
  Clock3,
  Star,
  MapPin,
  Utensils,
  Store,
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import restaurantService from "../../services/restaurantService";

export default function SearchPage() {
  const navigate = useNavigate();

  const [query, setQuery] = useState("");
  const [results, setResults] = useState({
    restaurants: [],
    foods: [],
  });
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const recentSearches = [
    "Burger",
    "Pizza",
    "Chicken",
    "Coffee",
    "Fried Rice",
  ];

  const popular = [
    "Pizza",
    "Burger",
    "Chicken",
    "Biryani",
    "Pasta",
    "Coffee",
    "Dessert",
    "Drinks",
  ];

  useEffect(() => {
    const value = query.trim();

    if (!value) {
      setResults({
        restaurants: [],
        foods: [],
      });
      setHasSearched(false);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        setLoading(true);

        const data =
          await restaurantService.search(value);

        setResults({
          restaurants:
            data?.restaurants || [],
          foods:
            data?.foods || [],
        });

        setHasSearched(true);
      } catch (error) {
        console.error("Search failed:", error);

        setResults({
          restaurants: [],
          foods: [],
        });

        setHasSearched(true);
      } finally {
        setLoading(false);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [query]);

  const handleSearchValue = (value) => {
    setQuery(value);
  };

  const clearSearch = () => {
    setQuery("");
    setHasSearched(false);
  };

  const openFood = (food) => {
    navigate(`/food/${food.id}`, {
      state: {
        food,
      },
    });
  };

  const openRestaurant = (restaurant) => {
    navigate(`/restaurants/${restaurant.id}`);
  };

  const showResults =
    query.trim().length > 0;

  return (
    <div className="min-h-screen bg-[#FDFDFD] px-5 py-6 pb-28">

      <div className="flex items-center gap-3">

        <button
          type="button"
          onClick={() => navigate("/home")}
          className="h-11 w-11 flex-shrink-0 rounded-full bg-gray-100 flex items-center justify-center text-primary active:scale-90 transition"
          aria-label="Back"
        >
          <ArrowLeft size={20} />
        </button>

        <div className="flex flex-1 items-center rounded-2xl border border-gray-200 bg-white px-4 py-3 shadow-sm">

          <Search
            size={20}
            className="text-primary flex-shrink-0"
          />

          <input
            autoFocus
            type="text"
            value={query}
            onChange={(e) =>
              setQuery(e.target.value)
            }
            placeholder="Search foods or restaurants..."
            className="ml-3 w-full bg-transparent text-sm text-slate-800 outline-none placeholder:text-gray-400"
          />

          {query && (
            <button
              type="button"
              onClick={clearSearch}
              className="ml-2 h-7 w-7 flex items-center justify-center rounded-full bg-gray-100 text-gray-500"
              aria-label="Clear search"
            >
              <X size={15} />
            </button>
          )}

        </div>

      </div>

      <AnimatePresence mode="wait">

        {!showResults ? (
          <motion.div
            key="discover"
            initial={{
              opacity: 0,
              y: 15,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
              y: -10,
            }}
            className="mt-8"
          >

            <h2 className="text-xl font-extrabold text-gray-900">
              Recent Searches
            </h2>

            <div className="mt-4 space-y-3">

              {recentSearches.map(
                (item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() =>
                      handleSearchValue(item)
                    }
                    className="w-full flex items-center gap-3 rounded-2xl bg-white border border-gray-100 p-4 text-left shadow-sm active:scale-[0.99] transition"
                  >
                    <Clock3
                      size={18}
                      className="text-primary"
                    />

                    <span className="font-medium text-gray-900">
                      {item}
                    </span>
                  </button>
                )
              )}

            </div>

            <h2 className="mt-10 text-xl font-extrabold text-gray-900">
              Popular Searches
            </h2>

            <div className="mt-4 flex flex-wrap gap-3">

              {popular.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() =>
                    handleSearchValue(item)
                  }
                  className="rounded-full border border-gray-200 bg-white px-5 py-2.5 font-semibold text-primary transition hover:bg-primary hover:text-white active:scale-95"
                >
                  {item}
                </button>
              ))}

            </div>

          </motion.div>
        ) : (
          <motion.div
            key="results"
            initial={{
              opacity: 0,
              y: 15,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            className="mt-8"
          >

            <div className="flex items-center justify-between">

              <div>
                <h2 className="text-xl font-extrabold text-gray-900">
                  Search Results
                </h2>

                <p className="mt-1 text-xs text-gray-400">
                  Results for "{query}"
                </p>
              </div>

              {loading && (
                <div className="h-5 w-5 rounded-full border-2 border-gray-200 border-t-primary animate-spin" />
              )}

            </div>

            {!loading &&
              hasSearched &&
              results.restaurants.length === 0 &&
              results.foods.length === 0 && (
                <div className="mt-10 rounded-3xl bg-white border border-gray-100 p-8 text-center shadow-sm">

                  <div className="mx-auto h-16 w-16 rounded-full bg-orange-50 flex items-center justify-center text-primary">
                    <Search size={28} />
                  </div>

                  <h3 className="mt-4 font-extrabold text-slate-800">
                    No results found
                  </h3>

                  <p className="mt-2 text-sm text-gray-400">
                    Try searching for another food or restaurant.
                  </p>

                </div>
              )}

            {results.restaurants.length > 0 && (
              <section className="mt-6">

                <div className="flex items-center gap-2 mb-4">
                  <Store
                    size={18}
                    className="text-primary"
                  />

                  <h3 className="font-extrabold text-slate-800">
                    Restaurants
                  </h3>
                </div>

                <div className="space-y-3">

                  {results.restaurants.map(
                    (restaurant) => (
                      <motion.button
                        key={restaurant.id}
                        type="button"
                        whileTap={{
                          scale: 0.98,
                        }}
                        onClick={() =>
                          openRestaurant(
                            restaurant
                          )
                        }
                        className="w-full flex items-center gap-4 rounded-3xl bg-white border border-gray-100 p-3 text-left shadow-sm"
                      >

                        <div className="h-20 w-20 flex-shrink-0 rounded-2xl overflow-hidden bg-orange-50">

                          {restaurant.image ? (
                            <img
                              src={
                                restaurant.image
                              }
                              alt={
                                restaurant.name
                              }
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="h-full w-full flex items-center justify-center text-primary">
                              <Store
                                size={26}
                              />
                            </div>
                          )}

                        </div>

                        <div className="min-w-0 flex-1">

                          <h4 className="font-extrabold text-slate-800 truncate">
                            {restaurant.name}
                          </h4>

                          <div className="mt-1 flex items-center gap-1">

                            <Star
                              size={13}
                              className="fill-yellow-400 text-yellow-400"
                            />

                            <span className="text-xs font-bold text-gray-500">
                              {restaurant.rating ||
                                "4.5"}
                            </span>

                          </div>

                          <div className="mt-2 flex items-center gap-1 text-[11px] text-gray-400">

                            <MapPin
                              size={12}
                            />

                            <span className="truncate">
                              {restaurant.location ||
                                restaurant.address ||
                                "Dhaka"}
                            </span>

                          </div>

                        </div>

                      </motion.button>
                    )
                  )}

                </div>

              </section>
            )}

            {results.foods.length > 0 && (
              <section className="mt-8">

                <div className="flex items-center gap-2 mb-4">
                  <Utensils
                    size={18}
                    className="text-primary"
                  />

                  <h3 className="font-extrabold text-slate-800">
                    Foods
                  </h3>
                </div>

                <div className="grid grid-cols-2 gap-4">

                  {results.foods.map(
                    (food) => (
                      <motion.button
                        key={food.id}
                        type="button"
                        whileTap={{
                          scale: 0.97,
                        }}
                        onClick={() =>
                          openFood(food)
                        }
                        className="overflow-hidden rounded-3xl bg-white border border-gray-100 shadow-sm text-left"
                      >

                        <div className="h-32 bg-orange-50 overflow-hidden">

                          {food.image ? (
                            <img
                              src={food.image}
                              alt={food.name}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="h-full w-full flex items-center justify-center text-primary">
                              <Utensils
                                size={28}
                              />
                            </div>
                          )}

                        </div>

                        <div className="p-3">

                          <h4 className="font-extrabold text-sm text-slate-800 line-clamp-1">
                            {food.name}
                          </h4>

                          <p className="mt-1 text-[10px] text-gray-400 line-clamp-1">
                            {food.restaurantName ||
                              "Restaurant"}
                          </p>

                          <div className="mt-2 flex items-center justify-between">

                            <span className="font-extrabold text-primary text-sm">
                              ৳ {food.price}
                            </span>

                            <span className="flex items-center gap-1 text-[10px] font-bold text-gray-500">
                              <Star
                                size={11}
                                className="fill-yellow-400 text-yellow-400"
                              />
                              {food.rating ||
                                "4.5"}
                            </span>

                          </div>

                        </div>

                      </motion.button>
                    )
                  )}

                </div>

              </section>
            )}

          </motion.div>
        )}

      </AnimatePresence>

    </div>
  );
}
