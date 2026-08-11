import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

export default function BrandsPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const brands = location.state?.brands || [];
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
              Top Choice Brands
            </h1>
            <p className="text-[11px] font-semibold text-gray-400">
              {category}
            </p>
          </div>
        </div>
      </header>

      <main className="space-y-3 px-5 pt-5">
        {brands.map((brand, index) => (
          <motion.button
            key={brand.id || index}
            whileTap={{ scale: 0.98 }}
            onClick={() =>
              brand.id
                ? navigate(`/restaurants/${brand.id}`)
                : null
            }
            className="flex w-full items-center gap-4 rounded-[22px] bg-white p-4 text-left shadow-sm"
          >
            <img
              src={
                brand.image ||
                brand.logo ||
                "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=300&q=80"
              }
              alt={brand.name}
              className="h-16 w-16 rounded-2xl object-cover"
            />

            <div className="min-w-0 flex-1">
              <h2 className="truncate text-[15px] font-extrabold text-gray-900">
                {brand.name || "Brand"}
              </h2>

              <p className="mt-1 text-[10px] font-semibold text-gray-400">
                {brand.category || "Food Brand"}
              </p>

              <p className="mt-1 text-[10px] font-bold text-[#FF5A00]">
                {brand.rating || "4.5"} rating
              </p>
            </div>

            <ChevronRight
              size={18}
              className="shrink-0 text-gray-400"
            />
          </motion.button>
        ))}

        {!brands.length && (
          <div className="rounded-[26px] bg-white p-10 text-center">
            <p className="text-sm font-bold text-gray-400">
              No brands available.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
