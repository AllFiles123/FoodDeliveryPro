import { motion } from "framer-motion";
import { Plus, Star } from "lucide-react";

export default function FoodCard({ food, onAdd }) {
  return (
    <motion.div
      whileHover={{ y: -6 }}
      whileTap={{ scale: 0.98 }}
      className="overflow-hidden rounded-3xl border border-orange-100 bg-white shadow-lg"
    >
      <div className="flex h-40 items-center justify-center bg-gradient-to-br from-orange-100 to-orange-200 text-6xl">
        🍕
      </div>

      <div className="p-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-800">
            {food.name}
          </h3>

          <div className="flex items-center gap-1 rounded-full bg-orange-100 px-2 py-1">
            <Star
              size={14}
              className="fill-orange-500 text-orange-500"
            />
            <span className="text-xs font-semibold text-orange-600">
              {food.rating}
            </span>
          </div>
        </div>

        <p className="mt-2 line-clamp-2 text-sm text-slate-500">
          {food.description}
        </p>

        <div className="mt-5 flex items-center justify-between">
          <span className="text-xl font-bold text-orange-500">
            ৳ {food.price}
          </span>

          <motion.button
            whileTap={{ scale: 0.9 }}
            whileHover={{ scale: 1.05 }}
            onClick={() => onAdd?.(food)}
            className="flex items-center gap-2 rounded-full bg-orange-500 px-4 py-2 font-semibold text-white shadow-md"
          >
            <Plus size={18} />
            Add
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
