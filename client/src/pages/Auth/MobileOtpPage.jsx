import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, MessageCircle, Smartphone } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

export default function MobileOtpPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const phone = location.state?.phone || "";
  const name = location.state?.name || "";
  const age = location.state?.age || "";

  const [method, setMethod] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const sendOtp = () => {
    if (!method) return;

    setLoading(true);

    setTimeout(() => {
      setLoading(false);
    }, 700);
  };

  const verifyOtp = () => {
    if (otp.length !== 6) return;

    /*
     * Backend SMS/WhatsApp verification will be connected here.
     */
    console.log({
      name,
      age,
      phone,
      method,
      otp,
    });
  };

  return (
    <div className="min-h-screen bg-[#fff8f1] px-5 py-5">
      <div className="mx-auto flex min-h-[calc(100vh-40px)] w-full max-w-[460px] flex-col">

        <button
          type="button"
          onClick={() => navigate(-1)}
          className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-slate-800 shadow-sm active:scale-95"
        >
          <ArrowLeft size={21} />
        </button>

        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-12"
        >
          <div className="flex h-16 w-16 items-center justify-center rounded-[22px] bg-orange-100 text-orange-500">
            <Smartphone size={29} />
          </div>

          <h1 className="mt-7 text-[30px] font-bold tracking-tight text-slate-900">
            Verify your number
          </h1>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            Choose where you'd like to receive your verification code.
          </p>

          <div className="mt-8 space-y-3">

            <button
              type="button"
              onClick={() => setMethod("sms")}
              className={`flex w-full items-center gap-4 rounded-2xl border p-4 text-left transition ${
                method === "sms"
                  ? "border-orange-500 bg-orange-50 ring-2 ring-orange-100"
                  : "border-[#eee1d6] bg-white"
              }`}
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-100 text-orange-500">
                <Smartphone size={21} />
              </div>

              <div className="flex-1">
                <p className="text-sm font-bold text-slate-800">
                  SMS
                </p>
                <p className="mt-0.5 text-xs text-slate-400">
                  Receive code by text message
                </p>
              </div>

              <div
                className={`h-5 w-5 rounded-full border-2 ${
                  method === "sms"
                    ? "border-orange-500 bg-orange-500"
                    : "border-slate-300"
                }`}
              />
            </button>

            <button
              type="button"
              onClick={() => setMethod("whatsapp")}
              className={`flex w-full items-center gap-4 rounded-2xl border p-4 text-left transition ${
                method === "whatsapp"
                  ? "border-orange-500 bg-orange-50 ring-2 ring-orange-100"
                  : "border-[#eee1d6] bg-white"
              }`}
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-100 text-orange-500">
                <MessageCircle size={21} />
              </div>

              <div className="flex-1">
                <p className="text-sm font-bold text-slate-800">
                  WhatsApp
                </p>
                <p className="mt-0.5 text-xs text-slate-400">
                  Receive code on WhatsApp
                </p>
              </div>

              <div
                className={`h-5 w-5 rounded-full border-2 ${
                  method === "whatsapp"
                    ? "border-orange-500 bg-orange-500"
                    : "border-slate-300"
                }`}
              />
            </button>

          </div>

          <div className="mt-7 rounded-2xl bg-white p-5 shadow-sm">
            <p className="text-xs font-semibold text-slate-400">
              MOBILE NUMBER
            </p>

            <p className="mt-1 text-base font-bold text-slate-800">
              {phone || "Your mobile number"}
            </p>
          </div>

          <button
            type="button"
            disabled={!method || loading}
            onClick={sendOtp}
            className="mt-7 flex h-[57px] w-full items-center justify-center rounded-2xl bg-orange-500 text-[15px] font-bold text-white shadow-[0_10px_25px_rgba(249,115,22,0.25)] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Sending code..." : "Send verification code"}
          </button>

          <div className="mt-8">
            <p className="text-center text-sm font-semibold text-slate-700">
              Enter the 6-digit code
            </p>

            <input
              value={otp}
              onChange={(e) =>
                setOtp(
                  e.target.value
                    .replace(/\D/g, "")
                    .slice(0, 6)
                )
              }
              inputMode="numeric"
              maxLength={6}
              placeholder="000000"
              className="mt-4 h-16 w-full rounded-2xl border border-[#eee1d6] bg-white text-center text-2xl font-bold tracking-[0.45em] text-slate-800 outline-none focus:border-orange-400 focus:ring-4 focus:ring-orange-100"
            />

            <button
              type="button"
              disabled={otp.length !== 6}
              onClick={verifyOtp}
              className="mt-4 w-full rounded-2xl bg-orange-500 py-4 text-sm font-bold text-white disabled:opacity-40"
            >
              Verify & Create Account
            </button>
          </div>

        </motion.div>
      </div>
    </div>
  );
}
