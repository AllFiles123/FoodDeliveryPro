import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, Heart, Plus, ShoppingCart } from "lucide-react";
import { motion } from "framer-motion";
import { useCart } from "../../context/CartContext";

export default function PopularItemsPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { addToCart } = useCart();

  const items = location.state?.items || [];
  const category = location.state?.category || "Popular Items";

  const formatPrice = (price) =>
    `৳${Number(
      String(price || 0).replace(/[৳$,\s]/g, "")
    ) || 0}`;

  const handleAdd = (item) => {
    addToCart({
      ...item,
      name: item.name || item.title || "Food Item",
      title: item.title || item.name || "Food Item",
      price: Number(item.price || 0),
      image: item.image || item.imageUrl || "",
    });
  };

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
            <h1 className="text-xl font-extrabold text-gray-900">
              Popular Items
            </h1>
            <p className="text-[11px] font-semibold text-gray-400">
              {category}
            </p>
          </div>
        </div>
      </header>

      <main className="px-5 pt-5">
        {items.length ? (
          <div className="grid grid-cols-2 gap-4">
            {items.map((item, index) => (
              <motion.div
                key={item.id || index}
                whileTap={{ scale: 0.97 }}
                className="overflow-hidden rounded-[24px] bg-white shadow-[0_8px_25px_rgba(0,0,0,0.07)]"
              >
                <button
                  type="button"
                  onClick={() =>
                    navigate(`/food/${item.id}`, {
                      state: { food: item },
                    })
                  }
                  className="block w-full text-left"
                >
                  <div className="relative h-[145px]">
                    <img
                      src={
                        item.image ||
                        item.imageUrl ||
                        "https://images.unsplash.com/photo-1547592180-85f173990554?w=800&q=80"
                      }
                      alt={item.name || item.title}
                      className="h-full w-full object-cover"
                    />

                    <span className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/95">
                      <Heart size={15} />
                    </span>
                  </div>

                  <div className="p-3">
                    <h2 className="line-clamp-1 text-[14px] font-extrabold text-gray-900">
                      {item.name || item.title || "Food Item"}
                    </h2>

                    <p className="mt-1 text-[10px] font-semibold text-gray-400">
                      {item.calorie || item.calories || "100 Kal"}
                    </p>

                    <p className="mt-2 text-[16px] font-extrabold text-[#FF5A00]">
                      {formatPrice(item.price)}
                    </p>
                  </div>
                </button>

                <button
                  onClick={() => handleAdd(item)}
                  className="mx-3 mb-3 flex h-9 w-[calc(100%-24px)] items-center justify-center gap-2 rounded-xl bg-[#FF5A00] text-white"
                >
                  <Plus size={16} />
                  Add
                </button>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="rounded-[26px] bg-white p-10 text-center shadow-sm">
            <ShoppingCart
              size={34}
              className="mx-auto mb-3 text-gray-300"
            />
            <p className="text-sm font-bold text-gray-400">
              No popular items available.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
