import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

import logo from "../../assets/kshudha-lagche-logo.svg";
import biryani from "../../assets/onboarding/biryani.svg";
import burger from "../../assets/onboarding/burger.svg";
import rider from "../../assets/onboarding/rider.svg";

const slides = [
  {
    type: "welcome",
    title: "আপনার বিশ্বস্ত মাধ্যম",
    subtitle: "ক্ষুধা লাগছে-তে আপনাকে স্বাগতম",
  },
  {
    image: biryani,
    title: "মজাদার খাবার",
    description:
      "আপনার পছন্দের রেস্টুরেন্ট থেকে সেরা খাবার অর্ডার করুন।",
  },
  {
    image: burger,
    title: "আপনার পছন্দের খাবার",
    description:
      "বার্গার, বিরিয়ানি, পিজ্জা ও আরও অনেক কিছু এক জায়গায়।",
  },
  {
    image: rider,
    title: "দ্রুত ও নিরাপদ ডেলিভারি",
    description:
      "আপনার খাবার যত দ্রুত সম্ভব নিরাপদে পৌঁছে যাবে আপনার দরজায়।",
  },
];

export default function OnboardingPage() {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    if (currentSlide >= slides.length - 1) {
      return;
    }

    const timer = setTimeout(
      () => {
        setCurrentSlide((prev) => prev + 1);
      },
      currentSlide === 0 ? 5000 : 4000
    );

    return () => clearTimeout(timer);
  }, [currentSlide]);

  const handleGetStarted = () => {
    navigate("/login-choice");
  };

  const slide = slides[currentSlide];

  return (
    <div className="min-h-screen w-full overflow-hidden bg-white text-[#172033]">
      <div className="mx-auto flex min-h-screen w-full max-w-[520px] flex-col px-5 pb-6 pt-5 sm:px-7">

        {/* LOGO */}
        <div className="flex justify-center">
          <img
            src={logo}
            alt="ক্ষুধা লাগছে"
            className="h-[82px] w-[82px] object-contain"
          />
        </div>

        {/* SLIDE AREA */}
        <div className="relative flex flex-1 items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, x: 45 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -45 }}
              transition={{ duration: 0.4 }}
              className="flex w-full flex-col items-center text-center"
            >
              {slide.type === "welcome" ? (
                <>
                  {/* WELCOME LOGO */}
                  <div className="relative mb-5 flex h-[270px] w-[270px] items-center justify-center">
                    <div className="absolute h-[250px] w-[250px] rounded-full bg-[#FFF4E8]" />

                    <motion.div
                      animate={{ y: [0, -7, 0] }}
                      transition={{
                        duration: 2.5,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                      className="relative z-10 flex h-[205px] w-[205px] items-center justify-center rounded-full bg-white shadow-[0_18px_45px_rgba(244,81,30,0.12)]"
                    >
                      <img
                        src={logo}
                        alt=""
                        className="h-[180px] w-[180px] object-contain"
                      />
                    </motion.div>
                  </div>

                  {/* WELCOME TEXT */}
                  <h1 className="text-[27px] font-extrabold leading-[1.25]">
                    {slide.title}
                    <br />
                    <span className="text-[#F4511E]">
                      {slide.subtitle}
                    </span>
                  </h1>

                  {/* ONE HORIZONTAL LINE */}
                  <div className="mt-5 flex w-full items-center justify-center gap-3 whitespace-nowrap text-[14px] font-bold text-slate-700">
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
                <>
                  {/* FOOD / RIDER IMAGE */}
                  <div className="relative mb-5 flex h-[390px] w-full items-center justify-center">
                    <div className="absolute h-[330px] w-[330px] rounded-full bg-[#FFF4E8]" />

                    <motion.img
                      src={slide.image}
                      alt={slide.title}
                      animate={{
                        y: [0, -8, 0],
                        rotate: [-1, 1, -1],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                      className="relative z-10 h-[340px] w-[340px] object-contain drop-shadow-[0_20px_30px_rgba(120,70,30,0.15)]"
                    />
                  </div>

                  {/* SLIDE TEXT */}
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
                  ? "w-7 bg-[#F4511E]"
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
