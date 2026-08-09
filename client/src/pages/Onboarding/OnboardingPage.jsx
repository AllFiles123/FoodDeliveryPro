import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, MapPin, ShoppingBag, Utensils, Truck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const slides = [
  {
    title: "Your favorite food,\njust a few taps away",
    description:
      "Discover delicious meals from restaurants around you and enjoy them at your doorstep.",
    icon: ShoppingBag,
    emoji: "🍔",
  },
  {
    title: "Discover delicious\nfood near you",
    description:
      "Explore restaurants, browse menus and find exactly what you're craving.",
    icon: Utensils,
    emoji: "🍕",
  },
  {
    title: "Order with ease",
    description:
      "Choose your favorite meals, customize your order and checkout quickly.",
    icon: MapPin,
    emoji: "🍜",
  },
  {
    title: "Fast delivery,\nfresh food",
    description:
      "Track your order and enjoy your favorite food wherever you are.",
    icon: Truck,
    emoji: "🍱",
  },
];

export default function OnboardingPage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const [currentSlide, setCurrentSlide] = useState(0);

  /*
   * Slide 1 automatically moves to Slide 2.
   * User still has full control after that.
   */
  useEffect(() => {
    if (currentSlide !== 0) return;

    const timer = setTimeout(() => {
      setCurrentSlide(1);
    }, 3500);

    return () => clearTimeout(timer);
  }, [currentSlide]);

  const nextSlide = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide((prev) => prev + 1);
    }
  };

  const previousSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide((prev) => prev - 1);
    }
  };

  const handleContinue = () => {
    /*
     * Existing user:
     * onboarding -> Home
     *
     * New user:
     * onboarding -> Login
     *
     * Existing Login -> Language -> Location -> Home
     * flow remains unchanged.
     */
    if (isAuthenticated) {
      navigate("/home", {
        replace: true,
      });
    } else {
      navigate("/login", {
        replace: true,
      });
    }
  };

  const slide = slides[currentSlide];
  const Icon = slide.icon;

  return (
    <div className="min-h-screen w-full overflow-hidden bg-white text-slate-900">
      <div className="mx-auto flex min-h-screen w-full max-w-[520px] flex-col px-5 pb-6 pt-7 sm:px-7">

        {/* TOP BRAND */}
        <div className="flex items-center justify-center">
          <div className="text-center">
            <p className="text-[12px] font-bold tracking-[2.5px] text-[#e58a43]">
              FOOD DELIVERY PRO
            </p>
          </div>
        </div>

        {/* SLIDE AREA */}
        <div className="relative flex flex-1 items-center justify-center py-5">

          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{
                opacity: 0,
                x: 45,
              }}
              animate={{
                opacity: 1,
                x: 0,
              }}
              exit={{
                opacity: 0,
                x: -45,
              }}
              transition={{
                duration: 0.35,
                ease: "easeOut",
              }}
              className="flex w-full flex-col items-center text-center"
            >

              {/* IMAGE / ILLUSTRATION AREA */}
              <div className="relative flex h-[390px] w-full items-center justify-center sm:h-[430px]">

                {/* soft orange shape */}
                <div className="absolute h-[285px] w-[285px] rounded-[42%] bg-[#fff2e6]" />

                {/* decorative circles */}
                <div className="absolute left-[15%] top-[18%] h-9 w-9 rounded-full bg-[#fff0df]" />
                <div className="absolute right-[16%] top-[24%] h-6 w-6 rounded-full bg-[#ffe5cd]" />
                <div className="absolute bottom-[20%] left-[18%] h-5 w-5 rounded-full bg-[#ffead7]" />

                {/* central illustration */}
                <div className="relative flex h-[260px] w-[260px] items-center justify-center rounded-[45%] bg-[#fff8f1]">

                  {/* food icons */}
                  <motion.div
                    animate={{
                      y: [0, -7, 0],
                    }}
                    transition={{
                      duration: 2.5,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className="absolute left-2 top-10 flex h-20 w-20 rotate-[-10deg] items-center justify-center rounded-3xl bg-white text-[43px] shadow-[0_14px_35px_rgba(190,120,65,0.12)]"
                  >
                    {slide.emoji}
                  </motion.div>

                  <motion.div
                    animate={{
                      y: [0, 7, 0],
                    }}
                    transition={{
                      duration: 2.8,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className="absolute bottom-5 right-2 flex h-20 w-20 rotate-[8deg] items-center justify-center rounded-3xl bg-white text-[40px] shadow-[0_14px_35px_rgba(190,120,65,0.12)]"
                  >
                    🍟
                  </motion.div>

                  {/* person / main object */}
                  <div className="relative z-10 flex h-40 w-40 flex-col items-center justify-center rounded-full bg-[#ffe6d2]">
                    <div className="text-[65px]">
                      🧑‍🍳
                    </div>

                    <div className="absolute -bottom-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#f29a52] text-white shadow-[0_12px_25px_rgba(242,154,82,0.28)]">
                      <Icon size={27} strokeWidth={2.2} />
                    </div>
                  </div>

                </div>
              </div>

              {/* TEXT */}
              <div className="px-3">
                <h1 className="whitespace-pre-line text-[29px] font-extrabold leading-[1.13] tracking-[-0.8px] text-slate-800 sm:text-[32px]">
                  {slide.title}
                </h1>

                <p className="mx-auto mt-4 max-w-[390px] text-[14px] leading-6 text-slate-500 sm:text-[15px]">
                  {slide.description}
                </p>
              </div>

            </motion.div>
          </AnimatePresence>
        </div>

        {/* DOTS */}
        <div className="mb-5 flex items-center justify-center gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
              type="button"
              onClick={() => setCurrentSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
              className={`h-2 rounded-full transition-all duration-300 ${
                currentSlide === index
                  ? "w-7 bg-[#f29a52]"
                  : "w-2 bg-[#f3d7bf]"
              }`}
            />
          ))}
        </div>

        {/* NAVIGATION */}
        <div className="flex min-h-[56px] items-center justify-between gap-3">

          {/* PREVIOUS */}
          {currentSlide > 0 ? (
            <button
              type="button"
              onClick={previousSlide}
              className="flex min-h-[54px] flex-1 items-center justify-center gap-2 rounded-2xl border border-[#f3c9a5] bg-white px-4 text-sm font-bold text-[#df8138] transition active:scale-[0.98]"
            >
              <ArrowLeft size={18} />
              Previous
            </button>
          ) : (
            <div className="flex-1" />
          )}

          {/* NEXT / CONTINUE */}
          {currentSlide < slides.length - 1 ? (
            <button
              type="button"
              onClick={nextSlide}
              className="flex min-h-[54px] flex-1 items-center justify-center gap-2 rounded-2xl bg-[#f29a52] px-4 text-sm font-bold text-white shadow-[0_10px_25px_rgba(242,154,82,0.22)] transition active:scale-[0.98]"
            >
              Next
              <ArrowRight size={18} />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleContinue}
              className="flex min-h-[54px] flex-1 items-center justify-center gap-2 rounded-2xl bg-[#f29a52] px-4 text-sm font-bold text-white shadow-[0_10px_25px_rgba(242,154,82,0.22)] transition active:scale-[0.98]"
            >
              Continue
              <ArrowRight size={18} />
            </button>
          )}

        </div>

      </div>
    </div>
  );
}
