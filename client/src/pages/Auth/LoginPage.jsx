import { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Eye,
  EyeOff,
  Check,
  Apple,
} from "lucide-react";

import authService from "../../services/authService";
import { useToast } from "../../context/ToastContext";
import { useAuth } from "../../context/AuthContext";

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

  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

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

    if (!formData.email.trim()) {
      nextErrors.email = "Email is required";
    } else if (
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(
        formData.email
      )
    ) {
      nextErrors.email = "Please enter a valid email";
    }

    if (!formData.password.trim()) {
      nextErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      nextErrors.password =
        "Password must be at least 6 characters";
    }

    if (!agree) {
      showToast(
        "Please agree to the Terms and Privacy Policy",
        "error"
      );
      return false;
    }

    setErrors(nextErrors);

    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);

    try {
      const response = await authService.login(formData);

      const user = {
        id: response.user?.id || null,
        fullName: response.user?.fullName || "",
        email:
          response.user?.email ||
          formData.email,
        phone: response.user?.phone || "",
        role: response.user?.role || "user",
      };

      login(user, response.token);

      /*
       * First-login setup remains user-specific.
       * Existing account setup logic is preserved.
       */
      const userKey =
        user.id || user.email;

      const setupKey =
        `initialSetupCompleted_${userKey}`;

      const hasCompletedSetup =
        localStorage.getItem(setupKey) === "true";

      showToast(
        "Login Successful",
        "success"
      );

      if (hasCompletedSetup) {
        navigate("/home", {
          replace: true,
        });
      } else {
        navigate("/language", {
          replace: true,
        });
      }

    } catch (error) {
      showToast(
        error?.response?.data?.message ||
          "Login Failed",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#fffaf5] text-slate-900">

      <div className="mx-auto flex min-h-screen w-full max-w-[520px] flex-col px-5 pb-6 pt-5 sm:px-7">

        {/* =====================================================
            TOP BAR
            NO LOGO HERE
        ===================================================== */}
        <div className="flex h-10 items-center">

          <button
            type="button"
            onClick={() => navigate(-1)}
            aria-label="Back"
            className="flex h-10 w-10 items-center justify-center rounded-full text-slate-800 transition active:scale-95"
          >
            <ArrowLeft
              size={22}
              strokeWidth={2.2}
            />
          </button>

        </div>


        {/* =====================================================
            LOGIN / SIGN UP TABS
        ===================================================== */}
        <div className="mt-7 rounded-full bg-[#fff0e4] p-1.5">

          <div className="grid grid-cols-2 gap-1">

            {/* LOGIN ACTIVE */}
            <button
              type="button"
              className="h-[50px] rounded-full bg-[#f29a52] text-sm font-bold text-white shadow-[0_6px_18px_rgba(242,154,82,0.20)]"
            >
              Log in
            </button>

            {/* SIGN UP */}
            <Link
              to="/signup"
              className="flex h-[50px] items-center justify-center rounded-full text-sm font-semibold text-slate-700 transition active:scale-[0.98]"
            >
              Sign up
            </Link>

          </div>

        </div>


        {/* =====================================================
            HEADER
        ===================================================== */}
        <div className="mt-8">

          <h1 className="text-[29px] font-bold tracking-[-0.7px] text-slate-900 sm:text-[32px]">
            Welcome back
          </h1>

          <p className="mt-2 text-[13px] leading-5 text-slate-500 sm:text-sm">
            Don't worry if it happens. Please enter the email
            associated with your account.
          </p>

        </div>


        {/* =====================================================
            FORM
        ===================================================== */}
        <form
          onSubmit={handleSubmit}
          className="mt-7 flex flex-col"
        >

          {/* EMAIL */}
          <div>

            <label className="mb-2.5 block text-sm font-bold text-slate-800">
              Email address
            </label>

            <div
              className={`flex h-[54px] items-center rounded-2xl border bg-white px-4 transition ${
                errors.email
                  ? "border-red-400"
                  : "border-[#eee6df] focus-within:border-[#f2a05b]"
              }`}
            >

              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                autoComplete="email"
                className="min-w-0 flex-1 bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400"
              />

            </div>

            {errors.email && (
              <p className="mt-1.5 text-xs font-medium text-red-500">
                {errors.email}
              </p>
            )}

          </div>


          {/* PASSWORD */}
          <div className="mt-5">

            <label className="mb-2.5 block text-sm font-bold text-slate-800">
              Password
            </label>

            <div
              className={`flex h-[54px] items-center rounded-2xl border bg-white px-4 transition ${
                errors.password
                  ? "border-red-400"
                  : "border-[#eee6df] focus-within:border-[#f2a05b]"
              }`}
            >

              <input
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                autoComplete="current-password"
                className="min-w-0 flex-1 bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400"
              />

              <button
                type="button"
                onClick={() =>
                  setShowPassword(
                    (prev) => !prev
                  )
                }
                aria-label={
                  showPassword
                    ? "Hide password"
                    : "Show password"
                }
                className="ml-2 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-slate-500 transition active:scale-90"
              >
                {showPassword ? (
                  <EyeOff
                    size={19}
                    strokeWidth={2}
                  />
                ) : (
                  <Eye
                    size={19}
                    strokeWidth={2}
                  />
                )}
              </button>

            </div>

            {errors.password && (
              <p className="mt-1.5 text-xs font-medium text-red-500">
                {errors.password}
              </p>
            )}

          </div>


          {/* TERMS */}
          <div className="mt-5 flex items-start gap-2.5">

            <button
              type="button"
              onClick={() =>
                setAgree((prev) => !prev)
              }
              aria-label="Agree to terms"
              className={`mt-0.5 flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-[5px] border transition ${
                agree
                  ? "border-[#f29a52] bg-[#f29a52] text-white"
                  : "border-slate-300 bg-white"
              }`}
            >
              {agree && (
                <Check
                  size={13}
                  strokeWidth={3}
                />
              )}
            </button>

            <p className="text-[12px] leading-5 text-slate-500">
              I agree with{" "}
              <button
                type="button"
                className="font-semibold text-[#e8863b]"
              >
                Terms
              </button>
              ,{" "}
              <button
                type="button"
                className="font-semibold text-[#e8863b]"
              >
                Privacy Policy
              </button>
              .
            </p>

          </div>


          {/* FORGOT PASSWORD */}
          <div className="mt-4 flex justify-end">

            <Link
              to="/forgot-password"
              className="text-sm font-semibold text-[#df7c32] transition active:opacity-70"
            >
              Forgot Password?
            </Link>

          </div>


          {/* LOGIN BUTTON */}
          <motion.button
            type="submit"
            disabled={loading}
            whileTap={{
              scale: 0.98,
            }}
            className="mt-6 flex h-[55px] w-full items-center justify-center rounded-2xl bg-[#f29a52] text-[15px] font-bold text-white shadow-[0_9px_24px_rgba(242,154,82,0.24)] transition hover:bg-[#ed8e42] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading
              ? "Logging in..."
              : "Log in"}
          </motion.button>


          {/* ===================================================
              DIVIDER
          =================================================== */}
          <div className="mt-7 flex items-center gap-3">

            <div className="h-px flex-1 bg-[#eee5de]" />

            <span className="text-[11px] font-medium text-slate-400">
              or Continue with
            </span>

            <div className="h-px flex-1 bg-[#eee5de]" />

          </div>


          {/* ===================================================
              SOCIAL BUTTONS
          =================================================== */}
          <div className="mt-4 grid grid-cols-2 gap-3">

            {/* GOOGLE */}
            <button
              type="button"
              className="flex h-[50px] items-center justify-center gap-2 rounded-2xl border border-[#eee6df] bg-white text-sm font-semibold text-slate-700 transition hover:border-[#f5c59d] hover:bg-[#fffaf6] active:scale-[0.98]"
            >
              <span className="text-[17px] font-bold">
                G
              </span>
              Google
            </button>


            {/* APPLE */}
            <button
              type="button"
              className="flex h-[50px] items-center justify-center gap-2 rounded-2xl border border-[#eee6df] bg-white text-sm font-semibold text-slate-700 transition hover:border-[#f5c59d] hover:bg-[#fffaf6] active:scale-[0.98]"
            >
              <Apple
                size={18}
                fill="currentColor"
              />
              Apple
            </button>

          </div>


          {/* ===================================================
              SIGN UP
          =================================================== */}
          <p className="mt-7 pb-3 text-center text-sm text-slate-500">

            Already have an account?{" "}

            <Link
              to="/signup"
              className="font-bold text-[#df7c32] transition hover:text-[#c96820]"
            >
              Sign up
            </Link>

          </p>

        </form>

      </div>

    </div>
  );
}
