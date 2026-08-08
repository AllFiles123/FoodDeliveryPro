import { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import {
  Mail,
  KeyRound,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";

import PrimaryInput from "../../components/inputs/PrimaryInput";
import PrimaryButton from "../../components/buttons/PrimaryButton";

import authService from "../../services/authService";
import { useToast } from "../../context/ToastContext";
import LoginAnimation from "../../components/LoginAnimation/LoginAnimation";

export default function ForgotPasswordPage() {
  const navigate = useNavigate();

  const { showToast } = useToast();

  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const validateEmail = () => {
    if (!email.trim()) {
      setError("Email is required");
      return false;
    }

    const emailRegex =
      /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

    if (!emailRegex.test(email)) {
      setError("Please enter a valid email");
      return false;
    }

    setError("");

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateEmail()) return;

    setLoading(true);

    try {
      const response =
        await authService.forgotPassword({
          email,
        });

      showToast(
        "OTP sent successfully",
        "success"
      );

      console.log("OTP:", response.otp);

      localStorage.setItem(
        "resetEmail",
        email
      );

      navigate("/otp");
    } catch (error) {
      showToast(
        error?.response?.data?.message ||
          "Failed to send OTP",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#eef2f7] px-4 py-8 sm:px-6">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-md items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 35, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.55 }}
          className="
            w-full
            rounded-[34px]
            bg-[#eef2f7]
            px-6
            py-8
            shadow-[18px_18px_40px_rgba(163,177,198,0.55),-18px_-18px_40px_rgba(255,255,255,0.95)]
            sm:px-9
            sm:py-10
          "
        >
          <div className="mb-4 flex items-center justify-center">
            <div
              className="
                flex h-11 w-11 items-center justify-center
                rounded-2xl
                bg-[#eef2f7]
                text-primary
                shadow-[6px_6px_12px_rgba(163,177,198,0.45),-6px_-6px_12px_rgba(255,255,255,0.9)]
              "
            >
              <KeyRound size={21} />
            </div>
          </div>

          <LoginAnimation />

          <div className="text-center">
            <h1 className="text-[29px] font-extrabold tracking-tight text-slate-800">
              Forgot Password?
            </h1>

            <p className="mx-auto mt-2 max-w-xs text-sm leading-6 text-slate-500">
              Enter your registered email and we'll
              send you an OTP to reset your password.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="mt-7 space-y-4"
          >
            <div className="relative">
              <Mail
                size={18}
                className="pointer-events-none absolute left-4 top-1/2 z-10 -translate-y-1/2 text-slate-400"
              />

              <PrimaryInput
                type="email"
                name="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError("");
                }}
                className="
                  !rounded-2xl
                  !border-0
                  !bg-[#eef2f7]
                  !py-4
                  !pl-12
                  !text-slate-800
                  !placeholder:text-slate-400
                  shadow-[inset_6px_6px_12px_rgba(163,177,198,0.38),inset_-6px_-6px_12px_rgba(255,255,255,0.9)]
                  focus:!ring-2
                  focus:!ring-primary/20
                "
              />
            </div>

            {error && (
              <p className="px-2 text-xs font-medium text-red-500">
                {error}
              </p>
            )}

            <PrimaryButton
              type="submit"
              disabled={loading}
              className="
                !rounded-2xl
                !border-0
                !bg-primary
                !py-4
                shadow-[8px_8px_16px_rgba(163,177,198,0.45),-5px_-5px_12px_rgba(255,255,255,0.75)]
              "
            >
              {loading ? (
                "Sending OTP..."
              ) : (
                <>
                  Send OTP
                  <ArrowRight size={18} />
                </>
              )}
            </PrimaryButton>
          </form>

          <div className="mt-7 flex justify-center">
            <Link
              to="/login"
              className="
                inline-flex
                items-center
                gap-2
                rounded-2xl
                bg-[#eef2f7]
                px-5
                py-3
                text-sm
                font-semibold
                text-slate-600
                shadow-[6px_6px_12px_rgba(163,177,198,0.4),-5px_-5px_10px_rgba(255,255,255,0.85)]
                transition
                hover:text-primary
                active:shadow-[inset_4px_4px_8px_rgba(163,177,198,0.35),inset_-4px_-4px_8px_rgba(255,255,255,0.8)]
              "
            >
              <ArrowLeft size={16} />
              Back to Login
            </Link>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
