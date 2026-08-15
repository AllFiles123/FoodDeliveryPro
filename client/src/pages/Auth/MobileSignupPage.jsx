import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, UserRound, CalendarDays, Phone } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function MobileSignupPage() {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [data, setData] = useState({
    name: "",
    age: "",
    phone: "",
  });

  const update = (key, value) => {
    setData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const next = () => {
    if (step === 1 && !data.name.trim()) return;
    if (step === 2 && (!data.age || Number(data.age) < 13)) return;
    if (step === 3 && !/^[0-9]{10,15}$/.test(data.phone)) return;

    if (step < 3) {
      setStep((prev) => prev + 1);
    } else {
      // Real SMS/WhatsApp OTP backend will be connected here.
      navigate("/otp", {
        state: {
          type: "mobile-signup",
          name: data.name,
          age: data.age,
          phone: data.phone,
        },
      });
    }
  };

  const back = () => {
    if (step > 1) {
      setStep((prev) => prev - 1);
    } else {
      navigate("/signup");
    }
  };

  const steps = [
    {
      title: "What's your name?",
      subtitle: "Tell us your name to get started.",
      icon: UserRound,
      label: "Full name",
      placeholder: "Enter your full name",
      key: "name",
      type: "text",
    },
    {
      title: "How old are you?",
      subtitle: "This helps us personalize your experience.",
      icon: CalendarDays,
      label: "Age",
      placeholder: "Enter your age",
      key: "age",
      type: "number",
    },
    {
      title: "What's your mobile number?",
      subtitle: "We'll use this number to verify your account.",
      icon: Phone,
      label: "Mobile number",
      placeholder: "Enter your mobile number",
      key: "phone",
      type: "tel",
    },
  ];

  const current = steps[step - 1];
  const Icon = current.icon;

  return (
    <div className="min-h-screen bg-[#fff8f1] px-5 py-5">
      <div className="mx-auto flex min-h-[calc(100vh-40px)] w-full max-w-[460px] flex-col">

        {/* BACK */}
        <button
          type="button"
          onClick={back}
          className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-slate-800 shadow-sm active:scale-95"
        >
          <ArrowLeft size={21} />
        </button>

        {/* PROGRESS */}
        <div className="mt-7 flex gap-2">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className={`h-1.5 flex-1 rounded-full transition-all ${
                item <= step
                  ? "bg-orange-500"
                  : "bg-orange-100"
              }`}
            />
          ))}
        </div>

        {/* CONTENT */}
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 25 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="mt-12 flex flex-1 flex-col"
        >

          <div className="flex h-16 w-16 items-center justify-center rounded-[22px] bg-orange-100 text-orange-500">
            <Icon size={29} strokeWidth={2} />
          </div>

          <h1 className="mt-7 text-[30px] font-bold tracking-tight text-slate-900">
            {current.title}
          </h1>

          <p className="mt-2 max-w-[350px] text-sm leading-6 text-slate-500">
            {current.subtitle}
          </p>

          <div className="mt-9">
            <label className="mb-2.5 block text-sm font-bold text-slate-800">
              {current.label}
            </label>

            <input
              type={current.type}
              inputMode={
                current.type === "number" ||
                current.type === "tel"
                  ? "numeric"
                  : undefined
              }
              value={data[current.key]}
              onChange={(e) =>
                update(current.key, e.target.value)
              }
              placeholder={current.placeholder}
              autoFocus
              className="h-[58px] w-full rounded-2xl border border-[#eee1d6] bg-white px-4 text-[15px] text-slate-800 outline-none placeholder:text-slate-400 transition focus:border-orange-400 focus:ring-4 focus:ring-orange-100"
            />
          </div>

          {/* BUTTON */}
          <div className="mt-auto pt-10">
            <motion.button
              type="button"
              onClick={next}
              whileTap={{ scale: 0.98 }}
              className="flex h-[57px] w-full items-center justify-center rounded-2xl bg-orange-500 text-[15px] font-bold text-white shadow-[0_10px_25px_rgba(249,115,22,0.25)] transition hover:bg-orange-600"
            >
              {step === 3 ? "Continue" : "Continue"}
            </motion.button>

            <p className="mt-4 pb-3 text-center text-xs text-slate-400">
              Step {step} of 3
            </p>
          </div>

        </motion.div>
      </div>
    </div>
  );
}
