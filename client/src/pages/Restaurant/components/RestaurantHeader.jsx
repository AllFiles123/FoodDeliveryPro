import { motion } from "framer-motion";
import { Heart, Share2, Star, MapPin, Clock } from "lucide-react";

export default function RestaurantHeader({ restaurant }) {

  if (!restaurant) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
      className="overflow-hidden rounded-[30px] bg-background shadow-xl border border-border"
    >

      <div className="relative h-56 w-full bg-gradient-to-r from-primary to-primary">

        <div className="absolute right-4 top-4 flex gap-3">

          <button className="flex h-11 w-11 items-center justify-center rounded-full bg-background shadow-lg">
            <Heart size={20} className="text-primary" />
          </button>

          <button className="flex h-11 w-11 items-center justify-center rounded-full bg-background shadow-lg">
            <Share2 size={20} className="text-primary" />
          </button>

        </div>

        <div className="absolute -bottom-12 left-6 flex h-24 w-24 items-center justify-center rounded-full border-4 border-white bg-background text-5xl shadow-xl">
          🍽️
        </div>

      </div>


      <div className="px-6 pb-6 pt-16">

        <h1 className="text-3xl font-bold text-text">
          {restaurant.name}
        </h1>


        <p className="mt-3 text-textSecondary">
          {restaurant.description}
        </p>


        <div className="mt-6 flex flex-wrap gap-3">

          <div className="flex items-center gap-2 rounded-full bg-surface px-4 py-2">
            <Star size={18} className="fill-primary text-primary" />
            <span className="font-semibold text-primary">
              {restaurant.rating}
            </span>
          </div>


          <div className="flex items-center gap-2 rounded-full bg-background px-4 py-2">
            <Clock size={18} className="text-primary" />
            <span className="text-text">
              {restaurant.deliveryTime}
            </span>
          </div>


          <div className="flex items-center gap-2 rounded-full bg-background px-4 py-2">
            <MapPin size={18} className="text-primary" />
            <span className="text-text">
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
