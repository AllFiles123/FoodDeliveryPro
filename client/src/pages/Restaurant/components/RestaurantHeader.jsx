import { motion } from "framer-motion";
import {
  Heart,
  Share2,
  Star,
  MapPin,
  Clock,
} from "lucide-react";

import { useFavourite } from "../../../context/FavouriteContext";

export default function RestaurantHeader({ restaurant }) {
  const {
    isRestaurantFavourite,
    toggleRestaurantFavourite,
  } = useFavourite();

  if (!restaurant) return null;

  const isFavourite = isRestaurantFavourite(restaurant.id);

  const handleFavourite = (event) => {
    event.stopPropagation();
    toggleRestaurantFavourite(restaurant);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
      className="overflow-hidden rounded-[30px] bg-gray-50 shadow-xl border border-gray-200"
    >
      <div className="relative h-56 w-full bg-gradient-to-r from-primary to-primary">

        <div className="absolute right-4 top-4 flex gap-3">

          <button
            type="button"
            onClick={handleFavourite}
            aria-label={
              isFavourite
                ? "Remove restaurant from favourites"
                : "Add restaurant to favourites"
            }
            className={`flex h-11 w-11 items-center justify-center rounded-full bg-gray-50 shadow-lg transition-all active:scale-90 ${
              isFavourite
                ? "text-red-500"
                : "text-primary"
            }`}
          >
            <Heart
              size={20}
              fill={isFavourite ? "currentColor" : "none"}
            />
          </button>

          <button
            type="button"
            className="flex h-11 w-11 items-center justify-center rounded-full bg-gray-50 shadow-lg"
          >
            <Share2 size={20} className="text-primary" />
          </button>

        </div>

        <div className="absolute -bottom-12 left-6 flex h-24 w-24 items-center justify-center rounded-full border-4 border-white bg-gray-50 text-5xl shadow-xl">
          🍽️
        </div>

      </div>

      <div className="px-6 pb-6 pt-16">

        <h1 className="text-3xl font-bold text-gray-900">
          {restaurant.name}
        </h1>

        <p className="mt-3 text-gray-500">
          {restaurant.description}
        </p>

        <div className="mt-6 flex flex-wrap gap-3">

          <div className="flex items-center gap-2 rounded-full bg-gray-100 px-4 py-2">
            <Star
              size={18}
              className="fill-primary text-primary"
            />

            <span className="font-semibold text-primary">
              {restaurant.rating}
            </span>
          </div>

          <div className="flex items-center gap-2 rounded-full bg-gray-50 px-4 py-2">
            <Clock size={18} className="text-primary" />

            <span className="text-gray-900">
              {restaurant.deliveryTime}
            </span>
          </div>

          <div className="flex items-center gap-2 rounded-full bg-gray-50 px-4 py-2">
            <MapPin size={18} className="text-primary" />

            <span className="text-gray-900">
              {restaurant.location}
            </span>
          </div>

          <div className="rounded-full bg-primary px-5 py-2 font-semibold text-white">
            {restaurant.category}
          </div>

        </div>

      </div>
    </motion.div>
  );
}
