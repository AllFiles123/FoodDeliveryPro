import { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import {
  Mail,
  LockKeyhole,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";

import PrimaryInput from "../../components/inputs/PrimaryInput";
import PasswordInput from "../../components/inputs/PasswordInput";
import PrimaryButton from "../../components/buttons/PrimaryButton";

import authService from "../../services/authService";
import { useToast } from "../../context/ToastContext";
import { useAuth } from "../../context/AuthContext";
import LoginAnimation from "../../components/LoginAnimation/LoginAnimation";
import { useLoginAnimation } from "../../context/LoginAnimationContext";

export default function LoginPage() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { login } = useAuth();

  const {
    setCoverEyes,
    setSad,
    setSuccess,
    reset,
  } = useLoginAnimation();

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

      login(
        {
          id: response.user?.id || null,
          fullName: response.user?.fullName || "",
          email:
            response.user?.email || formData.email,
          phone: response.user?.phone || "",
          role: response.user?.role || "user",
        },
        response.token
      );

      setCoverEyes(false);
      setSad(false);
      setSuccess(true);

      showToast("Login Successful", "success");

      navigate("/home", { replace: true });
    } catch (error) {
      setCoverEyes(false);
      setSuccess(false);
      setSad(true);

      showToast(
        error?.response?.data?.message ||
          "Login Failed",
        "error"
      );
    } finally {
      setTimeout(reset, 1200);
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
            py-7
            shadow-[18px_18px_40px_rgba(163,177,198,0.55),-18px_-18px_40px_rgba(255,255,255,0.95)]
            sm:px-9
            sm:py-9
          "
        >
          <div className="mb-5 flex items-center justify-center">
            <div
              className="
                flex h-11 w-11 items-center justify-center
                rounded-2xl
                bg-[#eef2f7]
                text-primary
                shadow-[6px_6px_12px_rgba(163,177,198,0.45),-6px_-6px_12px_rgba(255,255,255,0.9)]
              "
            >
              <ShieldCheck size={21} strokeWidth={2.2} />
            </div>
          </div>

          <LoginAnimation />

          <div className="text-center">
            <h1 className="text-[29px] font-extrabold tracking-tight text-slate-800">
              Welcome Back
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Sign in to continue your food journey
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
                value={formData.email}
                onChange={handleChange}
                onFocus={() => {
                  reset();
                  setCoverEyes(false);
                }}
                onBlur={() => {
                  setCoverEyes(false);
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
                  focus:!border-0
                  focus:!ring-2
                  focus:!ring-primary/20
                "
              />
            </div>

            {errors.email && (
              <p className="px-2 text-xs font-medium text-red-500">
                {errors.email}
              </p>
            )}

            <div className="relative">
              <LockKeyhole
                size={18}
                className="pointer-events-none absolute left-4 top-1/2 z-20 -translate-y-1/2 text-slate-400"
              />

              <PasswordInput
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                onFocus={() => {
                  reset();
                  setCoverEyes(true);
                }}
                onBlur={() => {
                  setCoverEyes(false);
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
                  focus:!border-0
                  focus:!ring-2
                  focus:!ring-primary/20
                "
              />
            </div>

            {errors.password && (
              <p className="px-2 text-xs font-medium text-red-500">
                {errors.password}
              </p>
            )}

            <div className="flex justify-end px-1">
              <Link
                to="/forgot-password"
                className="text-sm font-semibold text-primary transition hover:opacity-70"
              >
                Forgot Password?
              </Link>
            </div>

            <PrimaryButton
              type="submit"
              disabled={loading}
              className="
                !rounded-2xl
                !border-0
                !bg-primary
                !py-4
                !text-white
                shadow-[8px_8px_16px_rgba(163,177,198,0.45),-5px_-5px_12px_rgba(255,255,255,0.75)]
                hover:!shadow-[5px_5px_12px_rgba(163,177,198,0.4)]
              "
            >
              {loading ? (
                "Logging In..."
              ) : (
                <>
                  Login
                  <ArrowRight size={18} />
                </>
              )}
            </PrimaryButton>
          </form>

          <div className="my-7 flex items-center gap-3">
            <div className="h-px flex-1 bg-slate-300" />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
              New here?
            </span>
            <div className="h-px flex-1 bg-slate-300" />
          </div>

          <p className="text-center text-sm text-slate-500">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="font-bold text-primary transition hover:opacity-70"
            >
              Create Account
            </Link>
          </p>
        </motion.div>
      </div>
    </main>
  );
}
