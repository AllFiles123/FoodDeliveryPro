import { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";

import PrimaryInput from "../../components/inputs/PrimaryInput";
import PasswordInput from "../../components/inputs/PasswordInput";
import PrimaryButton from "../../components/buttons/PrimaryButton";

import authService from "../../services/authService";
import { useToast } from "../../context/ToastContext";
import { useAuth } from "../../context/AuthContext";

export default function LoginPage() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { login } = useAuth();

  const [loading, setLoading] = useState(false);

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
        email: response.user?.email || formData.email,
        phone: response.user?.phone || "",
        role: response.user?.role || "user",
      };

      login(user, response.token);

      /*
       * First-login setup is user specific.
       * This prevents one account's setup state from
       * affecting another account on the same device.
       */
      const userKey = user.id || user.email;

      const setupKey = `initialSetupCompleted_${userKey}`;

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
    <div className="min-h-screen w-full bg-[#fff8f1] px-4 py-6 sm:px-6 sm:py-8 md:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-3rem)] w-full max-w-md items-center justify-center">
        <motion.div
          initial={{
            opacity: 0,
            y: 25,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.45,
          }}
          className="w-full rounded-[28px] bg-white px-5 py-7 shadow-[0_18px_55px_rgba(194,112,40,0.12)] sm:rounded-[30px] sm:px-8 sm:py-9"
        >
          {/* BRAND */}
          <div className="text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-50 text-orange-500">
              <span className="text-2xl">🍽️</span>
            </div>

            <h1 className="mt-4 text-2xl font-bold tracking-tight text-slate-800 sm:text-3xl">
              Welcome Back
            </h1>

            <p className="mt-2 text-sm text-slate-400">
              Login to continue your food journey
            </p>
          </div>

          {/* FORM */}
          <form
            onSubmit={handleSubmit}
            className="mt-8 space-y-4"
          >
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Email address
              </label>

              <PrimaryInput
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                autoComplete="email"
                className="border-slate-200 bg-slate-50 text-slate-800 placeholder:text-slate-400 focus:border-orange-400 focus:ring-orange-100"
              />

              {errors.email && (
                <p className="mt-1.5 text-sm text-red-500">
                  {errors.email}
                </p>
              )}
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Password
              </label>

              <PasswordInput
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                autoComplete="current-password"
                className="border-slate-200 bg-slate-50 text-slate-800 placeholder:text-slate-400 focus:border-orange-400 focus:ring-orange-100"
              />

              {errors.password && (
                <p className="mt-1.5 text-sm text-red-500">
                  {errors.password}
                </p>
              )}
            </div>

            <div className="flex justify-end">
              <Link
                to="/forgot-password"
                className="text-sm font-semibold text-orange-500 transition hover:text-orange-600"
              >
                Forgot Password?
              </Link>
            </div>

            <PrimaryButton
              type="submit"
              disabled={loading}
              className="bg-gradient-to-r from-orange-400 via-orange-500 to-amber-400 shadow-orange-200"
            >
              {loading
                ? "Logging In..."
                : "Login"}
            </PrimaryButton>
          </form>

          {/* SOCIAL LOGIN PLACEHOLDERS */}
          <div className="mt-7">
            <div className="flex items-center gap-3">
              <div className="h-px flex-1 bg-slate-100" />

              <span className="text-xs font-medium uppercase tracking-widest text-slate-400">
                Or continue with
              </span>

              <div className="h-px flex-1 bg-slate-100" />
            </div>

            <div className="mt-4 grid grid-cols-3 gap-3">
              <button
                type="button"
                className="flex h-11 items-center justify-center rounded-xl border border-slate-200 bg-white text-sm font-bold text-slate-700 transition hover:border-orange-200 hover:bg-orange-50"
              >
                G
              </button>

              <button
                type="button"
                className="flex h-11 items-center justify-center rounded-xl border border-slate-200 bg-white text-sm font-bold text-slate-700 transition hover:border-orange-200 hover:bg-orange-50"
              >
                
              </button>

              <button
                type="button"
                className="flex h-11 items-center justify-center rounded-xl border border-slate-200 bg-white text-sm font-bold text-slate-700 transition hover:border-orange-200 hover:bg-orange-50"
              >
                f
              </button>
            </div>
          </div>

          {/* SIGNUP */}
          <p className="mt-7 text-center text-sm text-slate-500">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="font-bold text-orange-500 hover:text-orange-600"
            >
              Sign Up
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
