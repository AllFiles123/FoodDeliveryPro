import { useLocation, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ChevronRight,
  Store,
  Star,
} from "lucide-react";
import { motion } from "framer-motion";

export default function CategoryExplorePage() {
  const navigate = useNavigate();
  const location = useLocation();

  const {
    category = "All",
    popularItems = [],
    featuredItems = [],
    restaurants = [],
    brands = [],
  } = location.state || {};

  const go = (path, data) =>
    navigate(path, {
      state: {
        ...data,
        category,
      },
    });

  return (
    <div className="min-h-screen bg-[#FDFDFD] pb-24">
      <header className="sticky top-0 z-40 border-b border-gray-100 bg-white/95 px-5 py-4 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100"
          >
            <ArrowLeft size={19} />
          </button>

          <div>
            <h1 className="text-xl font-extrabold text-gray-900">
              {category === "All"
                ? "Explore"
                : `${category} Explore`}
            </h1>
            <p className="text-[11px] font-semibold text-gray-400">
              Everything you are looking for
            </p>
          </div>
        </div>
      </header>

      <main className="space-y-9 px-5 pt-6">

        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-extrabold">
              Popular Items
            </h2>

            <button
              onClick={() =>
                go("/popular-items", {
                  items: popularItems,
                })
              }
              className="text-xs font-extrabold text-[#FF5A00]"
            >
              See All
            </button>
          </div>

          <div className="no-scrollbar flex gap-3 overflow-x-auto">
            {popularItems.slice(0, 5).map((item, index) => (
              <motion.button
                key={item.id || index}
                whileTap={{ scale: 0.96 }}
                onClick={() =>
                  navigate(`/food/${item.id}`, {
                    state: { food: item },
                  })
                }
                className="min-w-[145px] overflow-hidden rounded-[22px] bg-white text-left shadow-sm"
              >
                <img
                  src={
                    item.image ||
                    item.imageUrl ||
                    "https://images.unsplash.com/photo-1547592180-85f173990554?w=500&q=80"
                  }
                  alt={item.name}
                  className="h-28 w-full object-cover"
                />

                <div className="p-3">
                  <p className="truncate text-[12px] font-extrabold">
                    {item.name || item.title}
                  </p>

                  <p className="mt-1 text-sm font-extrabold text-[#FF5A00]">
                    ৳{Number(item.price || 0)}
                  </p>
                </div>
              </motion.button>
            ))}
          </div>
        </section>

        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-extrabold">
              Featured Items
            </h2>

            <button
              onClick={() =>
                go("/featured-items", {
                  items: featuredItems,
                })
              }
              className="text-xs font-extrabold text-[#FF5A00]"
            >
              See All
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {featuredItems.slice(0, 4).map((item, index) => (
              <motion.button
                key={item.id || index}
                whileTap={{ scale: 0.97 }}
                onClick={() =>
                  navigate(`/food/${item.id}`, {
                    state: { food: item },
                  })
                }
                className="overflow-hidden rounded-[22px] bg-white text-left shadow-sm"
              >
                <div className="relative">
                  <img
                    src={
                      item.image ||
                      item.imageUrl ||
                      "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500&q=80"
                    }
                    alt={item.name}
                    className="h-32 w-full object-cover"
                  />

                  <span className="absolute left-2 top-2 rounded-full bg-[#FF5A00] px-2 py-1 text-[8px] font-black text-white">
                    FEATURED
                  </span>
                </div>

                <div className="p-3">
                  <p className="truncate text-[12px] font-extrabold">
                    {item.name || item.title}
                  </p>

                  <p className="mt-1 text-sm font-extrabold text-[#FF5A00]">
                    ৳{Number(item.price || 0)}
                  </p>
                </div>
              </motion.button>
            ))}
          </div>
        </section>

        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-extrabold">
              Top Search Restaurants
            </h2>

            <button
              onClick={() => navigate("/restaurants")}
              className="text-xs font-extrabold text-[#FF5A00]"
            >
              See All
            </button>
          </div>

          <div className="space-y-3">
            {restaurants.slice(0, 4).map((restaurant, index) => (
              <motion.button
                key={restaurant.id || index}
                whileTap={{ scale: 0.98 }}
                onClick={() =>
                  navigate(`/restaurants/${restaurant.id}`)
                }
                className="flex w-full items-center gap-3 rounded-[22px] bg-white p-3 text-left shadow-sm"
              >
                <img
                  src={
                    restaurant.image ||
                    "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=500&q=80"
                  }
                  alt={restaurant.name}
                  className="h-16 w-16 rounded-2xl object-cover"
                />

                <div className="min-w-0 flex-1">
                  <p className="truncate text-[14px] font-extrabold">
                    {restaurant.name}
                  </p>

                  <p className="mt-1 text-[10px] text-gray-400">
                    {restaurant.category || category}
                  </p>

                  <div className="mt-1 flex items-center gap-1 text-[10px] font-bold">
                    <Star
                      size={11}
                      className="fill-yellow-400 text-yellow-400"
                    />
                    {restaurant.rating || "4.5"}
                  </div>
                </div>

                <ChevronRight
                  size={18}
                  className="text-gray-400"
                />
              </motion.button>
            ))}
          </div>
        </section>

        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-extrabold">
              Top Choice Brands
            </h2>

            <button
              onClick={() =>
                go("/brands", {
                  brands,
                })
              }
              className="text-xs font-extrabold text-[#FF5A00]"
            >
              See All
            </button>
          </div>

          <div className="no-scrollbar flex gap-3 overflow-x-auto">
            {brands.slice(0, 5).map((brand, index) => (
              <motion.button
                key={brand.id || index}
                whileTap={{ scale: 0.96 }}
                onClick={() =>
                  brand.id
                    ? navigate(`/restaurants/${brand.id}`)
                    : null
                }
                className="min-w-[150px] rounded-[22px] bg-white p-4 text-left shadow-sm"
              >
                <div className="mb-3 flex h-14 w-14 items-center justify-center overflow-hidden rounded-2xl bg-gray-100">
                  {brand.image ? (
                    <img
                      src={brand.image}
                      alt={brand.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <Store
                      size={22}
                      className="text-[#FF5A00]"
                    />
                  )}
                </div>

                <p className="truncate text-[13px] font-extrabold">
                  {brand.name}
                </p>

                <p className="mt-1 text-[10px] font-semibold text-gray-400">
                  {brand.category || "Food Brand"}
                </p>
              </motion.button>
            ))}
          </div>
        </section>

      </main>
    </div>
  );
}
