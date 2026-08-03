import { useState } from "react";
import { motion } from "framer-motion";
import { Search, ArrowLeft, Clock } from "lucide-react";
import { Link } from "react-router-dom";

export default function SearchPage() {
  const [query, setQuery] = useState("");

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

  return (
    <div className="min-h-screen bg-white px-5 py-6 pb-24">

      <div className="flex items-center gap-3">

        <Link
          to="/home"
          className="rounded-full bg-orange-100 p-2"
        >
          <ArrowLeft
            size={20}
            className="text-orange-500"
          />
        </Link>

        <div className="flex flex-1 items-center rounded-2xl border border-orange-200 bg-orange-50 px-4 py-3">

          <Search
            size={20}
            className="text-orange-500"
          />

          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search foods or restaurants..."
            className="ml-3 w-full bg-transparent outline-none"
          />

        </div>

      </div>

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mt-8"
      >

        <h2 className="text-xl font-bold text-gray-900">
          Recent Searches
        </h2>

        <div className="mt-4 space-y-3">

          {recentSearches.map((item) => (

            <div
              key={item}
              className="flex items-center gap-3 rounded-2xl bg-orange-50 p-4"
            >

              <Clock
                size={18}
                className="text-orange-500"
              />

              <span className="font-medium text-gray-700">
                {item}
              </span>

            </div>

          ))}

        </div>
        <h2 className="mt-10 text-xl font-bold text-gray-900">
          Popular Searches
        </h2>

        <div className="mt-4 flex flex-wrap gap-3">

          {popular.map((item) => (

            <button
              key={item}
              className="rounded-full border border-orange-200 bg-white px-5 py-2 font-medium text-orange-600 transition hover:bg-orange-500 hover:text-white"
            >
              {item}
            </button>

          ))}

        </div>

      </motion.div>

    </div>
  );
}
