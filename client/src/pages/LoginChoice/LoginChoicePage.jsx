import { motion } from "framer-motion";
import { ArrowRight, Bike, ChevronLeft, UserRound } from "lucide-react";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/kshudha-lagche-logo.png";

export default function LoginChoicePage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen w-full bg-white text-[#172033]">
      <div className="mx-auto flex min-h-screen w-full max-w-[520px] flex-col px-5 pb-6 pt-6 sm:px-7">

        <button
          type="button"
          onClick={() => navigate(-1)}
          className="flex h-11 w-11 items-center justify-center rounded-full border border-[#FFE1CD] bg-white text-[#F4511E] shadow-sm"
          aria-label="Back"
        >
          <ChevronLeft size={23} />
        </button>

        <div className="flex flex-1 flex-col items-center justify-center">
          <img
            src={logo}
            alt="ক্ষুধা লাগছে"
            className="mb-5 h-[100px] w-[100px] object-contain"
          />

          <h1 className="text-center text-[29px] font-extrabold leading-tight">
            আপনি কে?
          </h1>

          <p className="mt-3 text-center text-[14px] leading-6 text-slate-500">
            আপনার অ্যাকাউন্ট হিসেবে লগইন করুন
          </p>

          <div className="mt-9 grid w-full gap-4">

            {/* CUSTOMER */}
            <motion.button
              whileTap={{ scale: 0.98 }}
              type="button"
              onClick={() => navigate("/login")}
              className="flex w-full items-center gap-4 rounded-[28px] border-2 border-[#FFD2B5] bg-[#FFFBF7] p-5 text-left shadow-[0_10px_30px_rgba(244,81,30,0.08)]"
            >
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#FFB52E] to-[#F4511E] text-white">
                <UserRound size={31} strokeWidth={2.3} />
              </div>

              <div className="min-w-0 flex-1">
                <h2 className="text-[18px] font-extrabold">
                  Login as a Customer
                </h2>

                <p className="mt-1 text-[13px] text-slate-500">
                  খাবার অর্ডার করুন এবং উপভোগ করুন
                </p>
              </div>

              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#FFF0E5] text-[#F4511E]">
                <ArrowRight size={19} />
              </div>
            </motion.button>

            {/* RIDER */}
            <motion.button
              whileTap={{ scale: 0.98 }}
              type="button"
              onClick={() => navigate("/rider-login")}
              className="flex w-full items-center gap-4 rounded-[28px] border-2 border-[#D8E4F5] bg-[#F8FBFF] p-5 text-left shadow-[0_10px_30px_rgba(40,80,130,0.06)]"
            >
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-[#183B67] text-white">
                <Bike size={31} strokeWidth={2.3} />
              </div>

              <div className="min-w-0 flex-1">
                <h2 className="text-[18px] font-extrabold">
                  Login as a Rider
                </h2>

                <p className="mt-1 text-[13px] text-slate-500">
                  ডেলিভারি করে আয় করুন
                </p>
              </div>

              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#EAF2FC] text-[#183B67]">
                <ArrowRight size={19} />
              </div>
            </motion.button>

          </div>
        </div>

        <p className="text-center text-[12px] text-slate-400">
          ক্ষুধা লাগছে • Food Delivery
        </p>
      </div>
    </div>
  );
}
