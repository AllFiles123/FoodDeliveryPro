import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, MapPin, ShoppingBag, UtensilsCrossed } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const slides = [
  {
    id: 1,
    title: "Delicious food",
    description:
      "Discover delicious meals and your favorite restaurants near you.",
    image:
      "https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=1000&q=85",
    icon: UtensilsCrossed,
  },
  {
    id: 2,
    title: "Find your favorite food",
    description:
      "Explore thousands of delicious dishes from restaurants around you.",
    image:
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1000&q=85",
    icon: UtensilsCrossed,
  },
  {
    id: 3,
    title: "Fast delivery",
    description:
      "Order your favorite food and get it delivered fresh to your doorstep.",
    image:
      "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=1000&q=85",
    icon: ShoppingBag,
  },
  {
    id: 4,
    title: "Order with ease",
    description:
      "Everything you love, just a few taps away. Let's get started!",
    image:
      "https://images.unsplash.com/photo-1547592180-85f173990554?w=1000&q=85",
    icon: MapPin,
  },
];

export default function SplashPage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const [currentSlide, setCurrentSlide] = useState(0);
  const [autoSlide, setAutoSlide] = useState(true);

  /*
   * Auto slide:
   * Slide 1 -> 2 -> 3 -> 4
   *
   * It stops automatically when the user
   * reaches the final screen.
   */
  useEffect(() => {
    if (!autoSlide) return;

    if (currentSlide >= slides.length - 1) {
      setAutoSlide(false);
      return;
    }

    const timer = setTimeout(() => {
      setCurrentSlide((prev) => prev + 1);
    }, 4200);

    return () => clearTimeout(timer);
  }, [currentSlide, autoSlide]);

  const goNext = () => {
    setAutoSlide(false);

    setCurrentSlide((prev) =>
      Math.min(prev + 1, slides.length - 1)
    );
  };

  const goPrevious = () => {
    setAutoSlide(false);

    setCurrentSlide((prev) =>
      Math.max(prev - 1, 0)
    );
  };

  const handleContinue = () => {
    /*
     * IMPORTANT:
     * Splash is only the app introduction.
     * It must never control Language/Location directly.
     */

    if (isAuthenticated) {
      navigate("/home", {
        replace: true,
      });

      return;
    }

    navigate("/login", {
      replace: true,
    });
  };

  const slide = slides[currentSlide];
  const Icon = slide.icon;

  return (
    <div className="min-h-screen w-full overflow-hidden bg-[#fffaf5] text-slate-900">

      <div className="mx-auto flex min-h-screen w-full max-w-[520px] flex-col px-5 pb-6 pt-6 sm:px-7">

        {/* =====================================================
            TOP BRAND
        ===================================================== */}

        <div className="flex items-center justify-center pt-1">

          <div className="flex items-center gap-2">

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#fff0e2] text-[#ed944c]">
              <Icon
                size={21}
                strokeWidth={2.2}
              />
            </div>

            <span className="text-[17px] font-extrabold tracking-[-0.3px] text-slate-800">
              Food Delivery Pro
            </span>

          </div>

        </div>


        {/* =====================================================
            SLIDE AREA
        ===================================================== */}

        <div className="relative flex flex-1 flex-col justify-center">

          <AnimatePresence mode="wait">

            <motion.div
              key={slide.id}
              initial={{
                opacity: 0,
                x: 35,
              }}
              animate={{
                opacity: 1,
                x: 0,
              }}
              exit={{
                opacity: 0,
                x: -35,
              }}
              transition={{
                duration: 0.45,
                ease: "easeOut",
              }}
              className="flex flex-col items-center"
            >

              {/* =================================================
                  IMAGE
              ================================================= */}

              <div className="relative w-full">

                {/* Soft background */}
                <div className="absolute left-1/2 top-1/2 h-[330px] w-[330px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#fff0e2] sm:h-[370px] sm:w-[370px]" />

                <div className="relative mx-auto flex h-[365px] w-full max-w-[410px] items-center justify-center sm:h-[405px]">

                  {/* Main image */}
                  <div className="relative h-[285px] w-[285px] overflow-hidden rounded-[42%] border-[8px] border-white bg-white shadow-[0_25px_60px_rgba(190,120,60,0.14)] sm:h-[315px] sm:w-[315px]">

                    <img
                      src={slide.image}
                      alt={slide.title}
                      className="h-full w-full object-cover"
                      draggable="false"
                    />

                  </div>


                  {/* Floating icon */}
                  <motion.div
                    animate={{
                      y: [0, -7, 0],
                    }}
                    transition={{
                      duration: 2.5,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className="absolute bottom-[30px] right-[12%] flex h-16 w-16 items-center justify-center rounded-2xl border-4 border-white bg-[#f5a15c] text-white shadow-[0_15px_30px_rgba(239,148,76,0.25)]"
                  >
                    <Icon
                      size={27}
                      strokeWidth={2.2}
                    />
                  </motion.div>

                </div>

              </div>


              {/* =================================================
                  TEXT
              ================================================= */}

              <div className="mt-2 px-5 text-center">

                <h1 className="text-[30px] font-extrabold leading-tight tracking-[-0.8px] text-slate-800 sm:text-[33px]">
                  {slide.title}
                </h1>

                <p className="mx-auto mt-3 max-w-[370px] text-[14px] leading-6 text-slate-500 sm:text-[15px]">
                  {slide.description}
                </p>

              </div>

            </motion.div>

          </AnimatePresence>

        </div>


        {/* =====================================================
            DOTS
        ===================================================== */}

        <div className="flex items-center justify-center gap-2 pb-5">

          {slides.map((item, index) => (

            <button
              key={item.id}
              type="button"
              aria-label={`Go to slide ${index + 1}`}
              onClick={() => {
                setAutoSlide(false);
                setCurrentSlide(index);
              }}
              className={`h-2 rounded-full transition-all duration-300 ${
                currentSlide === index
                  ? "w-7 bg-[#f29a52]"
                  : "w-2 bg-[#f1c7a2]"
              }`}
            />

          ))}

        </div>


        {/* =====================================================
            NAVIGATION
        ===================================================== */}

        <div className="min-h-[58px]">

          {/* SLIDE 1 */}
          {currentSlide === 0 && (

            <button
              type="button"
              onClick={goNext}
              className="flex min-h-[56px] w-full items-center justify-center gap-2 rounded-2xl bg-[#f29a52] px-5 text-[16px] font-bold text-white shadow-[0_12px_28px_rgba(242,154,82,0.22)] transition active:scale-[0.98]"
            >
              Next
              <ChevronRight size={20} />
            </button>

          )}


          {/* SLIDE 2 + 3 */}
          {(currentSlide === 1 || currentSlide === 2) && (

            <div className="grid grid-cols-2 gap-3">

              <button
                type="button"
                onClick={goPrevious}
                className="flex min-h-[56px] items-center justify-center gap-2 rounded-2xl border border-[#f4c49e] bg-white px-4 text-[15px] font-bold text-[#df8037] transition active:scale-[0.98]"
              >
                <ChevronLeft size={19} />
                Previous
              </button>

              <button
                type="button"
                onClick={goNext}
                className="flex min-h-[56px] items-center justify-center gap-2 rounded-2xl bg-[#f29a52] px-4 text-[15px] font-bold text-white shadow-[0_12px_28px_rgba(242,154,82,0.22)] transition active:scale-[0.98]"
              >
                Next
                <ChevronRight size={19} />
              </button>

            </div>

          )}


          {/* SLIDE 4 */}
          {currentSlide === 3 && (

            <button
              type="button"
              onClick={handleContinue}
              className="flex min-h-[56px] w-full items-center justify-center gap-2 rounded-2xl bg-[#f29a52] px-5 text-[16px] font-bold text-white shadow-[0_12px_28px_rgba(242,154,82,0.22)] transition active:scale-[0.98]"
            >
              Continue
              <ChevronRight size={20} />
            </button>

          )}

        </div>


        {/* =====================================================
            SMALL FOOTER
        ===================================================== */}

        <p className="pt-4 text-center text-[11px] font-medium text-slate-400">
          Fresh food • Fast delivery • Easy ordering
        </p>

      </div>

    </div>
  );
}
