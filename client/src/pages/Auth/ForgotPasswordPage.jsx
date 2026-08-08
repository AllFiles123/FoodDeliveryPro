import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Mail, KeyRound } from "lucide-react";

import authService from "../../services/authService";
import { useToast } from "../../context/ToastContext";

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
    <div className="min-h-screen w-full bg-[#fff8f1] px-4 py-5 sm:px-6 sm:py-8 md:px-8">

      <div className="mx-auto flex min-h-[calc(100vh-2.5rem)] w-full max-w-[440px] items-center justify-center sm:min-h-[calc(100vh-4rem)]">

        <div className="w-full rounded-[28px] bg-[#fffdf9] px-5 py-6 shadow-[0_18px_55px_rgba(194,112,40,0.12)] sm:rounded-[30px] sm:px-8 sm:py-8 md:px-9 md:py-9">

          {/* Brand */}
          <div className="text-center">

            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-100 text-orange-500 sm:h-16 sm:w-16">
              <KeyRound
                size={25}
                strokeWidth={2}
              />
            </div>

            <h1 className="mt-4 text-xl font-bold tracking-tight text-slate-800 sm:text-2xl">
              Food Delivery Pro
            </h1>

            <p className="mt-1 text-xs text-slate-400 sm:text-sm">
              Delicious food, delivered simply.
            </p>

          </div>

          {/* Back to Login */}
          <Link
            to="/login"
            className="mt-6 inline-flex items-center gap-2 rounded-lg py-1 text-sm font-semibold text-slate-500 transition-colors hover:text-orange-500 sm:mt-7"
          >
            <ArrowLeft size={17} />
            Back to login
          </Link>

          {/* Heading */}
          <div className="mt-6 sm:mt-7">

            <h2 className="text-xl font-bold text-slate-800 sm:text-2xl">
              Forgot password?
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-400">
              Enter the email address linked to your
              account and we'll send you an OTP to
              continue.
            </p>

          </div>

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="mt-6 space-y-5 sm:mt-7"
          >

            <div>

              <label
                htmlFor="forgot-email"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Email address
              </label>

              <div className="relative">

                <Mail
                  size={18}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  id="forgot-email"
                  type="email"
                  name="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError("");
                  }}
                  onBlur={validateEmail}
                  placeholder="Enter your email"
                  autoComplete="email"
                  inputMode="email"
                  className={`w-full rounded-2xl border bg-white py-3.5 pl-11 pr-4 text-sm text-slate-800 outline-none transition-all sm:py-4 ${
                    error
                      ? "border-red-300 focus:border-red-400 focus:ring-4 focus:ring-red-100"
                      : "border-orange-100 focus:border-orange-400 focus:ring-4 focus:ring-orange-100"
                  }`}
                />

              </div>

              {error && (
                <p className="mt-2 px-1 text-xs font-medium text-red-500">
                  {error}
                </p>
              )}

            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-2xl bg-orange-500 py-3.5 text-sm font-bold text-white shadow-[0_10px_25px_rgba(249,115,22,0.22)] transition-all hover:bg-orange-600 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 sm:py-4"
            >
              {loading
                ? "Sending OTP..."
                : "Send OTP"}
            </button>

          </form>

          {/* Footer */}
          <p className="mt-7 text-center text-sm text-slate-500">
            Remember your password?{" "}
            <Link
              to="/login"
              className="font-bold text-orange-500 transition-colors hover:text-orange-600"
            >
              Log in
            </Link>
          </p>

        </div>

      </div>

    </div>
  );
}
