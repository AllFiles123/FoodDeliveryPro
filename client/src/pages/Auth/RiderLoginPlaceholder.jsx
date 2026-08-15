import { Bike, ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/kshudha-lagche-logo.svg";

export default function RiderLoginPlaceholder() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen w-full bg-white text-[#172033]">
      <div className="mx-auto flex min-h-screen w-full max-w-[520px] flex-col px-5 pb-6 pt-6">

        <button
          type="button"
          onClick={() => navigate("/login-choice")}
          className="flex h-11 w-11 items-center justify-center rounded-full border border-[#FFE1CD] bg-white text-[#F4511E] shadow-sm"
          aria-label="Back"
        >
          <ChevronLeft size={23} />
        </button>

        <div className="flex flex-1 flex-col items-center justify-center text-center">

          <img
            src={logo}
            alt="ক্ষুধা লাগছে"
            className="mb-7 h-[105px] w-[105px] object-contain"
          />

          <div className="mb-6 flex h-[105px] w-[105px] items-center justify-center rounded-full bg-[#FFF1E5]">
            <Bike
              size={52}
              strokeWidth={2}
              className="text-[#F4511E]"
            />
          </div>

          <h1 className="text-[28px] font-extrabold">
            Rider Login
          </h1>

          <p className="mt-3 max-w-[340px] text-[14px] leading-6 text-slate-500">
            Rider Login page শীঘ্রই আসছে।
            <br />
            এখন শুধু route প্রস্তুত রাখা হয়েছে।
          </p>

          <button
            type="button"
            onClick={() => navigate("/login-choice")}
            className="mt-8 min-h-[54px] w-full max-w-[360px] rounded-full bg-gradient-to-r from-[#FFB52E] to-[#F4511E] text-[15px] font-extrabold text-white shadow-[0_12px_30px_rgba(244,81,30,0.20)]"
          >
            Back to Login Options
          </button>

        </div>

        <p className="text-center text-[12px] text-slate-400">
          ক্ষুধা লাগছে • Food Delivery
        </p>

      </div>
    </div>
  );
}
