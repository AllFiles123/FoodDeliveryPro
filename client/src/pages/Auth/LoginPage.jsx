import { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Eye,
  EyeOff,
  Check,
  Smartphone,
} from "lucide-react";

import authService from "../../services/authService";
import { useToast } from "../../context/ToastContext";
import { useAuth } from "../../context/AuthContext";
import logo from "../../assets/kshudha-lagche-logo.png";

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5">
      <path
        fill="#4285F4"
        d="M21.35 12.27c0-.72-.06-1.42-.18-2.09H12v3.96h5.24a4.48 4.48 0 0 1-1.94 2.94v2.45h3.14c1.84-1.7 2.91-4.2 2.91-7.26Z"
      />
      <path
        fill="#34A853"
        d="M12 21.75c2.63 0 4.84-.87 6.45-2.36l-3.14-2.45c-.87.58-1.98.92-3.31.92-2.54 0-4.7-1.72-5.47-4.03H3.29v2.53A9.75 9.75 0 0 0 12 21.75Z"
      />
      <path
        fill="#FBBC05"
        d="M6.53 13.83A5.86 5.86 0 0 1 6.22 12c0-.64.11-1.26.31-1.83V7.64H3.29A9.75 9.75 0 0 0 2.25 12c0 1.57.38 3.05 1.04 4.36l3.24-2.53Z"
      />
      <path
        fill="#EA4335"
        d="M12 6.14c1.43 0 2.71.49 3.72 1.46l2.79-2.79C16.84 3.22 14.63 2.25 12 2.25a9.75 9.75 0 0 0-8.71 5.39l3.24 2.53C7.3 7.86 9.46 6.14 12 6.14Z"
      />
    </svg>
  );
}

function AppleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current">
      <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.81 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.53 4.07ZM12.03 7.25C11.88 5.02 13.69 3.18 15.77 3c.29 2.58-2.34 4.5-3.74 4.25Z" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current">
      <path d="M13.5 21v-8h2.75l.41-3H13.5V8.08c0-.87.24-1.46 1.5-1.46h1.78V3.94c-.31-.04-1.37-.13-2.6-.13-2.58 0-4.35 1.58-4.35 4.49V10H7v3h2.83v8h3.67Z" />
    </svg>
  );
}

export default function LoginPage() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { login } = useAuth();

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [agree, setAgree] = useState(true);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const validateForm = () => {
    const nextErrors = {};

    const email = formData.email.trim();

    if (!email) {
      nextErrors.email = "Email is required";
    } else if (
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email)
    ) {
      nextErrors.email = "Please enter a valid email";
    }

    if (!formData.password.trim()) {
      nextErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      nextErrors.password = "Password must be at least 6 characters";
    }

    setErrors(nextErrors);

    if (!agree) {
      showToast(
        "Please agree to the Terms and Privacy Policy",
        "error"
      );
      return false;
    }

    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading || !validateForm()) return;

    setLoading(true);

    try {
      const response = await authService.login({
        email: formData.email.trim(),
        password: formData.password,
      });

      if (!response?.token || !response?.user) {
        throw new Error("Invalid login response");
      }

      const user = {
        id: response.user.id || null,
        fullName: response.user.fullName || "",
        email: response.user.email || formData.email.trim(),
        phone: response.user.phone || "",
        role: response.user.role || "user",
      };

      login(user, response.token);

      showToast(
        response.message || "Login successful",
        "success"
      );

      const userKey = user.id || user.email;
      const setupKey = `initialSetupCompleted_${userKey}`;
      const hasCompletedSetup =
        localStorage.getItem(setupKey) === "true";

      navigate(hasCompletedSetup ? "/home" : "/language", {
        replace: true,
      });
    } catch (error) {
      console.error("Login Error:", error);

      showToast(
        error?.response?.data?.message ||
          error?.message ||
          "Login failed. Please try again.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  const socialLogin = (provider) => {
    showToast(
      `${provider} login will be connected with the backend later.`,
      "info"
    );
  };

  return (
    <div className="min-h-screen w-full bg-[#FFF8F2] text-[#202124]">
      <div className="mx-auto flex min-h-screen w-full max-w-[520px] flex-col px-5 pb-7 pt-5 sm:px-7">

        {/* BACK */}
        <button
          type="button"
          onClick={() => navigate(-1)}
          aria-label="Back"
          className="flex h-10 w-10 items-center justify-center rounded-full text-slate-800 active:scale-95"
        >
          <ArrowLeft size={22} strokeWidth={2.3} />
        </button>

        {/* LOGO */}
        <div className="mt-5 flex justify-center">
          <img
            src={logo}
            alt="ক্ষুধা লাগছে"
            className="h-[82px] w-[82px] object-contain"
          />
        </div>

        {/* TITLE */}
        <div className="mt-4 text-center">
          <h1 className="text-[29px] font-extrabold tracking-[-0.7px] text-slate-900">
            Welcome back
          </h1>

          <p className="mx-auto mt-2 max-w-[330px] text-[13px] leading-5 text-slate-500">
            Log in to continue enjoying delicious food.
          </p>
        </div>

        {/* LOGIN / SIGNUP */}
        <div className="mt-7 rounded-full bg-[#FFE9D8] p-1.5">
          <div className="grid grid-cols-2 gap-1">
            <div className="flex h-[48px] items-center justify-center rounded-full bg-[#F97316] text-sm font-bold text-white shadow-[0_7px_18px_rgba(249,115,22,0.22)]">
              Log in
            </div>

            <Link
              to="/signup"
              className="flex h-[48px] items-center justify-center rounded-full text-sm font-semibold text-slate-600 active:scale-[0.98]"
            >
              Sign up
            </Link>
          </div>
        </div>

        {/* FORM */}
        <form
          onSubmit={handleSubmit}
          className="mt-7 flex flex-col"
        >
          <label className="mb-2.5 text-sm font-bold text-slate-800">
            Email address
          </label>

          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
            autoComplete="email"
            disabled={loading}
            className={`h-[54px] w-full rounded-2xl border bg-white px-4 text-sm outline-none transition placeholder:text-slate-400 ${
              errors.email
                ? "border-red-400"
                : "border-[#EDE1D7] focus:border-[#F97316] focus:ring-4 focus:ring-orange-100"
            }`}
          />

          {errors.email && (
            <p className="mt-1.5 text-xs text-red-500">
              {errors.email}
            </p>
          )}

          <div className="mt-5 flex items-center justify-between">
            <label className="text-sm font-bold text-slate-800">
              Password
            </label>

            <Link
              to="/forgot-password"
              className="text-xs font-bold text-[#EA6A0A]"
            >
              Forgot Password?
            </Link>
          </div>

          <div className="relative mt-2.5">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              autoComplete="current-password"
              disabled={loading}
              className={`h-[54px] w-full rounded-2xl border bg-white px-4 pr-12 text-sm outline-none transition placeholder:text-slate-400 ${
                errors.password
                  ? "border-red-400"
                  : "border-[#EDE1D7] focus:border-[#F97316] focus:ring-4 focus:ring-orange-100"
              }`}
            />

            <button
              type="button"
              onClick={() => setShowPassword((value) => !value)}
              className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full text-slate-400"
            >
              {showPassword ? (
                <EyeOff size={19} />
              ) : (
                <Eye size={19} />
              )}
            </button>
          </div>

          {errors.password && (
            <p className="mt-1.5 text-xs text-red-500">
              {errors.password}
            </p>
          )}

          {/* TERMS */}
          <div className="mt-5 flex items-start gap-2.5">
            <button
              type="button"
              onClick={() => setAgree((value) => !value)}
              className={`mt-0.5 flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-[5px] border ${
                agree
                  ? "border-[#F97316] bg-[#F97316] text-white"
                  : "border-slate-300 bg-white"
              }`}
            >
              {agree && <Check size={13} strokeWidth={3} />}
            </button>

            <p className="text-[11px] leading-5 text-slate-500">
              I agree with{" "}
              <span className="font-semibold text-[#EA6A0A]">
                Terms
              </span>
              ,{" "}
              <span className="font-semibold text-[#EA6A0A]">
                Privacy Policy
              </span>
              .
            </p>
          </div>

          <motion.button
            type="submit"
            disabled={loading}
            whileTap={{ scale: 0.98 }}
            className="mt-6 flex h-[55px] w-full items-center justify-center rounded-2xl bg-[#F97316] text-[15px] font-bold text-white shadow-[0_10px_25px_rgba(249,115,22,0.24)] disabled:opacity-60"
          >
            {loading ? "Logging in..." : "Log in"}
          </motion.button>
        </form>

        {/* SOCIAL */}
        <div className="mt-7 flex items-center gap-3">
          <div className="h-px flex-1 bg-[#EDE1D7]" />
          <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
            Or continue with
          </span>
          <div className="h-px flex-1 bg-[#EDE1D7]" />
        </div>

        <div className="mt-4 grid grid-cols-4 gap-3">
          <button
            type="button"
            onClick={() => socialLogin("Google")}
            aria-label="Login with Google"
            className="flex h-[52px] items-center justify-center rounded-2xl border border-[#EDE1D7] bg-white active:scale-95"
          >
            <GoogleIcon />
          </button>

          <button
            type="button"
            onClick={() => socialLogin("Apple")}
            aria-label="Login with Apple"
            className="flex h-[52px] items-center justify-center rounded-2xl border border-[#EDE1D7] bg-white text-slate-900 active:scale-95"
          >
            <AppleIcon />
          </button>

          <button
            type="button"
            onClick={() => socialLogin("Facebook")}
            aria-label="Login with Facebook"
            className="flex h-[52px] items-center justify-center rounded-2xl border border-[#EDE1D7] bg-white text-[#1877F2] active:scale-95"
          >
            <FacebookIcon />
          </button>

          {/* MOBILE NUMBER */}
          <button
            type="button"
            onClick={() => navigate("/signup/mobile")}
            aria-label="Login with mobile number"
            className="flex h-[52px] items-center justify-center rounded-2xl border border-[#FFD2B5] bg-white text-[#F97316] shadow-[0_5px_15px_rgba(249,115,22,0.08)] active:scale-95"
          >
            <Smartphone size={21} strokeWidth={2.3} />
          </button>
        </div>

        <p className="mt-7 pb-2 text-center text-sm text-slate-500">
          Don't have an account?{" "}
          <Link
            to="/signup"
            className="font-bold text-[#EA6A0A]"
          >
            Sign up
          </Link>
        </p>

      </div>
    </div>
  );
}
