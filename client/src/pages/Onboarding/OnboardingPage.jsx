import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

import logo from "../../assets/kshudha-lagche-logo.png";

const slides = [
  {
    type: "welcome",
  },
  {
    image:
      "https://images.unsplash.com/photo-1563379926898-05f4575a45d8?auto=format&fit=crop&w=900&q=90",
    title: "মজাদার খাবার",
    description:
      "আপনার পছন্দের রেস্টুরেন্ট থেকে সেরা খাবার অর্ডার করুন।",
  },
  {
    image:
      "https://images.unsplash.com/photo-1571091718767-18b5b1457add?auto=format&fit=crop&w=900&q=90",
    title: "আপনার পছন্দের খাবার",
    description:
      "বার্গার, বিরিয়ানি, পিজ্জা ও আরও অনেক মজার খাবার এক জায়গায়।",
  },
  {
    image:
      "https://images.unsplash.com/photo-1526367790999-0150786686a2?auto=format&fit=crop&w=900&q=90",
    title: "দ্রুত ও নিরাপদ ডেলিভারি",
    description:
      "আপনার খাবার দ্রুত ও নিরাপদে পৌঁছে যাবে আপনার দরজায়।",
  },
];

export default function OnboardingPage() {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    if (currentSlide >= slides.length - 1) return;

    const timer = setTimeout(() => {
      setCurrentSlide((prev) => prev + 1);
    }, currentSlide === 0 ? 5000 : 4000);

    return () => clearTimeout(timer);
  }, [currentSlide]);

  const handleGetStarted = () => {
    navigate("/login-choice");
  };

  const slide = slides[currentSlide];

  return (
    <div className="min-h-screen w-full overflow-hidden bg-white text-slate-900">
      <div className="mx-auto flex min-h-screen w-full max-w-[520px] flex-col px-5 pb-6 pt-5 sm:px-7">

        {/* LOGO */}
        <div className="flex justify-center">
          <img
            src={logo}
            alt="ক্ষুধা লাগছে"
            className="h-[105px] w-[105px] object-contain"
          />
        </div>

        {/* SLIDES */}
        <div className="relative flex flex-1 items-center justify-center">
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
                duration: 0.45,
                ease: "easeOut",
              }}
              className="flex w-full flex-col items-center text-center"
            >

              {/* ================================
                  FIRST SLIDE
              ================================= */}
              {slide.type === "welcome" ? (
                <>
                  <div className="relative mb-6 flex h-[320px] w-full items-center justify-center">

                    <div className="absolute h-[300px] w-[300px] rounded-full bg-[#FFF5EC]" />

                    <motion.div
                      animate={{
                        y: [0, -8, 0],
                      }}
                      transition={{
                        duration: 2.8,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                      className="relative z-10 flex h-[255px] w-[255px] items-center justify-center rounded-full bg-white shadow-[0_18px_45px_rgba(0,0,0,0.08)]"
                    >
                      <img
                        src={logo}
                        alt="ক্ষুধা লাগছে"
                        className="h-[225px] w-[225px] object-contain"
                      />
                    </motion.div>
                  </div>

                  <h1 className="text-[28px] font-extrabold leading-[1.25]">
                    আপনার বিশ্বস্ত মাধ্যম
                  </h1>

                  <h2 className="mt-2 text-[22px] font-bold text-[#F4511E]">
                    ক্ষুধা লাগছে-তে আপনাকে স্বাগতম
                  </h2>

                  {/* SAME LINE */}
                  <div className="mt-6 flex w-full items-center justify-center gap-3 whitespace-nowrap text-[14px] font-bold text-slate-700">
                    <span>
                      <span className="mr-1 text-[#F4511E]">*</span>
                      বিশ্বস্ত
                    </span>

                    <span>
                      <span className="mr-1 text-[#F4511E]">*</span>
                      সহজ
                    </span>

                    <span>
                      <span className="mr-1 text-[#F4511E]">*</span>
                      দ্রুত
                    </span>

                    <span>
                      <span className="mr-1 text-[#F4511E]">*</span>
                      নিরাপদ
                    </span>
                  </div>
                </>
              ) : (
                /* ================================
                   FOOD / RIDER SLIDES
                ================================= */
                <>
                  <div className="relative mb-6 flex h-[400px] w-full items-center justify-center">

                    <div className="absolute h-[330px] w-[330px] rounded-full bg-[#FFF5EC]" />

                    <motion.img
                      src={slide.image}
                      alt={slide.title}
                      animate={{
                        y: [0, -8, 0],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                      className="relative z-10 h-[360px] w-[360px] rounded-[35px] object-cover shadow-[0_20px_40px_rgba(0,0,0,0.12)]"
                    />
                  </div>

                  <h1 className="text-[29px] font-extrabold leading-[1.2]">
                    {slide.title}
                  </h1>

                  <p className="mx-auto mt-4 max-w-[390px] text-[14px] leading-6 text-slate-500">
                    {slide.description}
                  </p>
                </>
              )}

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
              aria-label={`Slide ${index + 1}`}
              className={`h-2 rounded-full transition-all duration-300 ${
                currentSlide === index
                  ? "w-8 bg-[#F4511E]"
                  : "w-2 bg-[#FFDCC5]"
              }`}
            />
          ))}
        </div>

        {/* GET STARTED */}
        <button
          type="button"
          onClick={handleGetStarted}
          className="flex min-h-[58px] w-full items-center justify-center gap-3 rounded-full bg-gradient-to-r from-[#FFB52E] to-[#F4511E] text-[16px] font-extrabold text-white shadow-[0_12px_30px_rgba(244,81,30,0.22)] transition active:scale-[0.98]"
        >
          Get Started
          <ArrowRight size={20} strokeWidth={2.5} />
        </button>

      </div>
    </div>
  );
}
