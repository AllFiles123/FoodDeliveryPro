import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  X,
  RotateCcw,
  Pizza,
  Store,
  Pill,
  CupSoda,
  Star,
} from "lucide-react";

export default function FilterBottomSheet({
  open,
  onClose,
  filters,
  setFilters,
  onApply,
}) {
  const [left, setLeft] = useState(
    filters?.minPrice
      ? Math.min(Number(filters.minPrice) / 10, 100)
      : 0
  );

  const [right, setRight] = useState(
    filters?.maxPrice
      ? Math.min(Number(filters.maxPrice) / 10, 100)
      : 100
  );

  const [selectedCategory, setSelectedCategory] = useState(
    filters?.category || ""
  );

  const [selectedRating, setSelectedRating] = useState(
    filters?.rating || 0
  );

  const [selectedDelivery, setSelectedDelivery] = useState(
    filters?.deliveryTime || ""
  );

  useEffect(() => {
    document.body.style.overflow = open
      ? "hidden"
      : "auto";

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [open]);

  const bars = useMemo(
    () =>
      [
        28, 38, 46, 34, 54, 66, 42, 72, 58, 44,
        63, 78, 52, 69, 82, 58, 43, 75, 61, 49,
        35, 55, 70, 84, 48, 66, 78, 58, 40, 73,
        88, 63, 45, 77, 56, 41, 69, 82, 61, 48,
        35, 57, 75, 66, 44, 82, 60, 39, 71, 52,
      ],
    []
  );

  const categories = [
    {
      title: "Meals",
      icon: Pizza,
    },
    {
      title: "Shops",
      icon: Store,
    },
    {
      title: "Drugs",
      icon: Pill,
    },
    {
      title: "Drinks",
      icon: CupSoda,
    },
  ];

  const applyFilters = () => {
    setFilters({
      ...filters,
      category: selectedCategory,
      rating: selectedRating,
      minPrice: Math.round(left * 10),
      maxPrice: Math.round(right * 10),
      deliveryTime: selectedDelivery,
    });

    onApply();
  };

  const resetFilters = () => {
    setLeft(0);
    setRight(100);
    setSelectedCategory("");
    setSelectedRating(0);
    setSelectedDelivery("");

    setFilters({
      category: "",
      rating: 0,
      minPrice: "",
      maxPrice: "",
      deliveryTime: "",
      nearMe: false,
    });
  };

  if (!open) return null;

  return (
    <AnimatePresence>

      <motion.div
        className="fixed inset-0 z-[99999] bg-black/45"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >

        <motion.div
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{
            duration: 0.3,
            ease: "easeOut",
          }}
          className="
            absolute
            bottom-0
            left-0
            right-0
            max-h-[92vh]
            overflow-y-auto
            rounded-t-[32px]
            bg-white
            px-6
            pt-4
            pb-32
          "
        >

          {/* Drag Handle */}

          <div className="mb-5 flex justify-center">

            <div className="h-1.5 w-14 rounded-full bg-gray-200" />

          </div>

          {/* Header */}

          <div className="flex items-center justify-between">

            <button
              type="button"
              onClick={onClose}
              className="
                flex
                h-12
                w-12
                items-center
                justify-center
                rounded-full
                bg-gray-100
                active:scale-90
                transition
              "
            >
              <X size={22} />
            </button>

            <h2 className="text-2xl font-extrabold text-gray-900">
              Filters
            </h2>

            <button
              type="button"
              onClick={resetFilters}
              className="
                flex
                h-12
                w-12
                items-center
                justify-center
                rounded-full
                bg-gray-100
                active:scale-90
                transition
              "
            >
              <RotateCcw size={20} />
            </button>

          </div>

          {/* Categories */}

          <section className="mt-10">

            <h3 className="mb-6 text-[20px] font-extrabold text-gray-900">
              Categories
            </h3>

            <div className="grid grid-cols-4 gap-4">

              {categories.map((item) => {

                const Icon = item.icon;

                const active =
                  selectedCategory === item.title;

                return (
                  <button
                    type="button"
                    key={item.title}
                    onClick={() =>
                      setSelectedCategory(
                        active ? "" : item.title
                      )
                    }
                    className="group flex flex-col items-center"
                  >

                    <div
                      className={`
                        h-[78px]
                        w-[78px]
                        rounded-[22px]
                        flex
                        items-center
                        justify-center
                        transition-all
                        duration-200
                        ${
                          active
                            ? "bg-[#FF5A00]/10 ring-2 ring-[#FF5A00]"
                            : "bg-gray-50"
                        }
                      `}
                    >

                      <Icon
                        size={31}
                        strokeWidth={1.8}
                        className={
                          active
                            ? "text-[#FF5A00]"
                            : "text-gray-900"
                        }
                      />

                    </div>

                    <span
                      className={`
                        mt-3
                        text-[14px]
                        font-semibold
                        ${
                          active
                            ? "text-[#FF5A00]"
                            : "text-gray-900"
                        }
                      `}
                    >
                      {item.title}
                    </span>

                  </button>
                );
              })}

            </div>

          </section>

          {/* Price Range */}

          <section className="mt-10">

            <h3 className="mb-6 text-xl font-extrabold text-gray-900">
              Price Range
            </h3>

            {/* Histogram */}

            <div className="mt-2 flex h-[75px] items-end justify-between gap-[3px] px-1">

              {bars.map((height, index) => {

                const active =
                  index >=
                    Math.round(left / 2) &&
                  index <=
                    Math.round(right / 2);

                return (
                  <div
                    key={index}
                    className={`
                      flex-1
                      max-w-[4px]
                      rounded-t-full
                      transition-colors
                      duration-200
                      ${
                        active
                          ? "bg-[#FF5A00]"
                          : "bg-gray-200"
                      }
                    `}
                    style={{
                      height: `${height}%`,
                    }}
                  />
                );
              })}

            </div>

            {/* Slider */}

            <div className="relative mt-5 h-10">

              <div className="absolute top-[18px] h-[3px] w-full rounded-full bg-gray-200" />

              <div
                className="absolute top-[17px] h-[4px] rounded-full bg-[#FF5A00]"
                style={{
                  left: `${left}%`,
                  width: `${right - left}%`,
                }}
              />

              {/* Left */}

              <input
                type="range"
                min="0"
                max="100"
                value={left}
                onChange={(e) => {
                  const value = Number(
                    e.target.value
                  );

                  if (value < right) {
                    setLeft(value);
                  }
                }}
                className="
                  absolute
                  top-0
                  w-full
                  appearance-none
                  bg-transparent
                  pointer-events-none
                  [&::-webkit-slider-thumb]:pointer-events-auto
                  [&::-webkit-slider-thumb]:appearance-none
                  [&::-webkit-slider-thumb]:h-7
                  [&::-webkit-slider-thumb]:w-7
                  [&::-webkit-slider-thumb]:rounded-full
                  [&::-webkit-slider-thumb]:bg-white
                  [&::-webkit-slider-thumb]:border-[3px]
                  [&::-webkit-slider-thumb]:border-[#FF5A00]
                  [&::-webkit-slider-thumb]:shadow-lg
                "
              />

              {/* Right */}

              <input
                type="range"
                min="0"
                max="100"
                value={right}
                onChange={(e) => {
                  const value = Number(
                    e.target.value
                  );

                  if (value > left) {
                    setRight(value);
                  }
                }}
                className="
                  absolute
                  top-0
                  w-full
                  appearance-none
                  bg-transparent
                  pointer-events-none
                  [&::-webkit-slider-thumb]:pointer-events-auto
                  [&::-webkit-slider-thumb]:appearance-none
                  [&::-webkit-slider-thumb]:h-7
                  [&::-webkit-slider-thumb]:w-7
                  [&::-webkit-slider-thumb]:rounded-full
                  [&::-webkit-slider-thumb]:bg-white
                  [&::-webkit-slider-thumb]:border-[3px]
                  [&::-webkit-slider-thumb]:border-[#FF5A00]
                  [&::-webkit-slider-thumb]:shadow-lg
                "
              />

            </div>

            {/* Min / Max */}

            <div className="mt-7 grid grid-cols-2 gap-4">

              <div className="flex items-center rounded-xl bg-gray-100 px-4 h-16">

                <span className="mr-3 font-extrabold text-gray-700">
                  ৳
                </span>

                <div>

                  <p className="text-[10px] text-gray-400 font-bold">
                    Min
                  </p>

                  <input
                    readOnly
                    value={Math.round(left * 10)}
                    className="w-full bg-transparent outline-none text-lg font-bold text-gray-900"
                  />

                </div>

              </div>

              <div className="flex items-center rounded-xl bg-gray-100 px-4 h-16">

                <span className="mr-3 font-extrabold text-gray-700">
                  ৳
                </span>

                <div>

                  <p className="text-[10px] text-gray-400 font-bold">
                    Max
                  </p>

                  <input
                    readOnly
                    value={Math.round(right * 10)}
                    className="w-full bg-transparent outline-none text-lg font-bold text-gray-900"
                  />

                </div>

              </div>

            </div>

          </section>

          {/* Rating */}

          <section className="mt-10">

            <h3 className="mb-5 text-xl font-extrabold text-gray-900">
              Rating
            </h3>

            <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-1">

              {[5, 4, 3, 2].map((item) => {

                const active =
                  selectedRating === item;

                return (
                  <button
                    type="button"
                    key={item}
                    onClick={() =>
                      setSelectedRating(
                        active ? 0 : item
                      )
                    }
                    className={`
                      flex
                      h-12
                      items-center
                      gap-2
                      rounded-full
                      px-5
                      transition
                      active:scale-95
                      ${
                        active
                          ? "bg-[#FF5A00]/10 ring-1 ring-[#FF5A00] text-[#FF5A00]"
                          : "bg-gray-100 text-gray-900"
                      }
                    `}
                  >

                    <Star
                      size={18}
                      className={
                        active
                          ? "fill-[#FF5A00] text-[#FF5A00]"
                          : "fill-yellow-400 text-yellow-400"
                      }
                    />

                    <span className="font-bold">
                      {item}.0
                    </span>

                  </button>
                );
              })}

            </div>

          </section>

          {/* Delivery Time */}

          <section className="mt-10">

            <h3 className="mb-5 text-xl font-extrabold text-gray-900">
              Delivery Time
            </h3>

            <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-1">

              {[
                "Under 15 min",
                "Under 30 min",
                "Under 45 min",
                "Under 60 min",
              ].map((item) => {

                const active =
                  selectedDelivery === item;

                return (
                  <button
                    type="button"
                    key={item}
                    onClick={() =>
                      setSelectedDelivery(
                        active ? "" : item
                      )
                    }
                    className={`
                      whitespace-nowrap
                      rounded-full
                      px-5
                      py-3
                      font-semibold
                      transition
                      active:scale-95
                      ${
                        active
                          ? "bg-[#FF5A00] text-white shadow-md"
                          : "bg-gray-100 text-gray-700"
                      }
                    `}
                  >
                    {item}
                  </button>
                );
              })}

            </div>

          </section>

          {/* Apply Button */}

          <div className="fixed bottom-0 left-0 right-0 z-[100000] bg-white/95 backdrop-blur-md px-5 py-4 border-t border-gray-100">

            <button
              type="button"
              onClick={applyFilters}
              className="
                h-[58px]
                w-full
                rounded-full
                bg-[#FF5A00]
                shadow-xl
                text-lg
                font-extrabold
                text-white
                active:scale-[0.98]
                transition
              "
            >
              Show 2,500+ Items
            </button>

          </div>

        </motion.div>

      </motion.div>

    </AnimatePresence>
  );
}
