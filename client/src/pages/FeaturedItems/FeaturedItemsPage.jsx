import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, Star } from "lucide-react";
import { motion } from "framer-motion";

export default function FeaturedItemsPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const items = location.state?.items || [];
  const category = location.state?.category || "All";

  return (
    <div className="min-h-screen bg-[#FDFDFD] pb-24">
      <header className="sticky top-0 z-30 border-b border-gray-100 bg-white/95 px-5 py-4 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100"
          >
            <ArrowLeft size={19} />
          </button>

          <div>
            <h1 className="text-xl font-extrabold">
              Featured Items
            </h1>
            <p className="text-[11px] font-semibold text-gray-400">
              {category}
            </p>
          </div>
        </div>
      </header>

      <main className="grid grid-cols-2 gap-4 px-5 pt-5">
        {items.map((item, index) => (
          <motion.button
            key={item.id || index}
            whileTap={{ scale: 0.97 }}
            onClick={() =>
              navigate(`/food/${item.id}`, {
                state: { food: item },
              })
            }
            className="overflow-hidden rounded-[24px] bg-white text-left shadow-md"
          >
            <div className="relative h-[145px]">
              <img
                src={
                  item.image ||
                  item.imageUrl ||
                  "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&q=80"
                }
                alt={item.name || item.title}
                className="h-full w-full object-cover"
              />

              <span className="absolute left-3 top-3 rounded-full bg-[#FF5A00] px-2.5 py-1 text-[9px] font-extrabold text-white">
                FEATURED
              </span>

              <span className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-white px-2 py-1 text-[10px] font-bold">
                <Star
                  size={11}
                  className="fill-yellow-400 text-yellow-400"
                />
                {item.rating || "4.5"}
              </span>
            </div>

            <div className="p-3">
              <h2 className="line-clamp-1 text-[14px] font-extrabold">
                {item.name || item.title || "Featured Item"}
              </h2>

              <p className="mt-1 text-[10px] font-semibold text-gray-400">
                {item.deliveryTime || item.time || "20-30 mins"}
              </p>

              <p className="mt-2 text-[16px] font-extrabold text-[#FF5A00]">
                ৳{Number(item.price || 0)}
              </p>
            </div>
          </motion.button>
        ))}

        {!items.length && (
          <div className="col-span-2 rounded-[26px] bg-white p-10 text-center">
            <p className="text-sm font-bold text-gray-400">
              No featured items available.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
