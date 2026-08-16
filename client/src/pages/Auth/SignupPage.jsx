import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Eye,
  EyeOff,
  UserRound,
  Mail,
  LockKeyhole,
} from "lucide-react";

import authService from "../../services/authService";
import { useToast } from "../../context/ToastContext";
import { useAuth } from "../../context/AuthContext";
import logo from "../../assets/kshudha-lagche-logo.png";

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6">
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
    <svg viewBox="0 0 24 24" className="h-6 w-6 fill-current">
      <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.81 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.53 4.07ZM12.03 7.25C11.88 5.02 13.69 3.18 15.77 3c.29 2.58-2.34 4.5-3.74 4.25Z" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6 fill-current">
      <path d="M13.5 21v-8h2.75l.41-3H13.5V8.08c0-.87.24-1.46 1.5-1.46h1.78V3.94c-.31-.04-1.37-.13-2.6-.13-2.58 0-4.35 1.58-4.35 4.49V10H7v3h2.83v8h3.67Z" />
    </svg>
  );
}

function MobileIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-6 w-6 fill-none stroke-current"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="6" y="2.5" width="12" height="19" rx="2.5" />
      <path d="M10 5.5h4" />
      <path d="M11 18.5h2" />
    </svg>
  );
}

export default function SignupPage() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

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
    const newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(
        formData.email.trim()
      )
    ) {
      newErrors.email = "Please enter a valid email";
    }

    if (!formData.password.trim()) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password =
        "Password must be at least 6 characters";
    }

    if (!formData.confirmPassword.trim()) {
      newErrors.confirmPassword =
        "Confirm password is required";
    } else if (
      formData.password !== formData.confirmPassword
    ) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return;
    if (!validateForm()) return;

    setLoading(true);

    try {
      const response = await authService.signup({
        fullName: formData.fullName.trim(),
        email: formData.email.trim(),
        password: formData.password,
      });

      login(
        response.user || {
          fullName: formData.fullName.trim(),
          email: formData.email.trim(),
        },
        response.token
      );

      showToast(
        "Account Created Successfully",
        "success"
      );

      navigate("/home", {
        replace: true,
      });
    } catch (error) {
      console.error("Signup Error:", error);

      showToast(
        error?.response?.data?.message ||
          "Signup Failed",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  const socialSignup = (provider) => {
    showToast(
      `${provider} signup will be connected with backend later.`,
      "info"
    );
  };

  return (
    <div className="min-h-screen w-full bg-[#fffaf5] text-slate-900">

      <div className="mx-auto flex min-h-screen w-full max-w-[520px] flex-col px-5 pb-6 pt-5 sm:px-7">

        {/* BACK */}
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

        {/* LOGIN / SIGNUP */}
        <div className="mt-7 rounded-full bg-[#fff0e4] p-1.5">
          <div className="grid grid-cols-2 gap-1">

            <Link
              to="/login"
              className="flex h-[50px] items-center justify-center rounded-full text-sm font-semibold text-slate-700 transition active:scale-[0.98]"
            >
              Log in
            </Link>

            <div className="flex h-[50px] items-center justify-center rounded-full bg-[#f28a3d] text-sm font-bold text-white shadow-[0_6px_18px_rgba(242,138,61,0.22)]">
              Sign up
            </div>

          </div>
        </div>

        {/* LOGO */}
        <div className="mt-8 flex flex-col items-center">

          <div className="flex h-[86px] w-[86px] items-center justify-center rounded-[26px] bg-white shadow-[0_10px_30px_rgba(226,117,43,0.12)]">
            <img
              src={logo}
              alt="ক্ষুধা লাগছে"
              className="h-[68px] w-[68px] object-contain"
            />
          </div>

          <h1 className="mt-5 text-center text-[29px] font-bold tracking-[-0.7px] text-slate-900 sm:text-[32px]">
            Create your account
          </h1>

          <p className="mt-2 text-center text-[13px] leading-5 text-slate-500 sm:text-sm">
            Join us and enjoy delicious food delivered
            right to your door.
          </p>

        </div>

        {/* FORM */}
        <form
          onSubmit={handleSubmit}
          className="mt-7 flex flex-col"
        >

          {/* NAME */}
          <div>
            <label className="mb-2.5 block text-sm font-bold text-slate-800">
              Full name
            </label>

            <div
              className={`flex h-[54px] items-center rounded-2xl border bg-white px-4 transition ${
                errors.fullName
                  ? "border-red-400"
                  : "border-[#eee6df] focus-within:border-[#f2a05b]"
              }`}
            >
              <UserRound
                size={18}
                className="mr-3 shrink-0 text-slate-400"
              />

              <input
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Enter your full name"
                autoComplete="name"
                disabled={loading}
                className="min-w-0 flex-1 bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400 disabled:opacity-60"
              />
            </div>

            {errors.fullName && (
              <p className="mt-1.5 text-xs font-medium text-red-500">
                {errors.fullName}
              </p>
            )}
          </div>

          {/* EMAIL */}
          <div className="mt-5">
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
              <Mail
                size={18}
                className="mr-3 shrink-0 text-slate-400"
              />

              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                autoComplete="email"
                disabled={loading}
                className="min-w-0 flex-1 bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400 disabled:opacity-60"
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
              <LockKeyhole
                size={18}
                className="mr-3 shrink-0 text-slate-400"
              />

              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Create a password"
                autoComplete="new-password"
                disabled={loading}
                className="min-w-0 flex-1 bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400 disabled:opacity-60"
              />

              <button
                type="button"
                onClick={() =>
                  setShowPassword((value) => !value)
                }
                disabled={loading}
                className="ml-2 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-slate-400 transition active:scale-90 disabled:opacity-50"
              >
                {showPassword ? (
                  <EyeOff size={19} />
                ) : (
                  <Eye size={19} />
                )}
              </button>
            </div>

            {errors.password && (
              <p className="mt-1.5 text-xs font-medium text-red-500">
                {errors.password}
              </p>
            )}
          </div>

          {/* CONFIRM PASSWORD */}
          <div className="mt-5">
            <label className="mb-2.5 block text-sm font-bold text-slate-800">
              Confirm password
            </label>

            <div
              className={`flex h-[54px] items-center rounded-2xl border bg-white px-4 transition ${
                errors.confirmPassword
                  ? "border-red-400"
                  : "border-[#eee6df] focus-within:border-[#f2a05b]"
              }`}
            >
              <LockKeyhole
                size={18}
                className="mr-3 shrink-0 text-slate-400"
              />

              <input
                type={
                  showConfirmPassword
                    ? "text"
                    : "password"
                }
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm your password"
                autoComplete="new-password"
                disabled={loading}
                className="min-w-0 flex-1 bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400 disabled:opacity-60"
              />

              <button
                type="button"
                onClick={() =>
                  setShowConfirmPassword(
                    (value) => !value
                  )
                }
                disabled={loading}
                className="ml-2 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-slate-400 transition active:scale-90 disabled:opacity-50"
              >
                {showConfirmPassword ? (
                  <EyeOff size={19} />
                ) : (
                  <Eye size={19} />
                )}
              </button>
            </div>

            {errors.confirmPassword && (
              <p className="mt-1.5 text-xs font-medium text-red-500">
                {errors.confirmPassword}
              </p>
            )}
          </div>

          {/* CREATE ACCOUNT */}
          <button
            type="submit"
            disabled={loading}
            className="mt-6 flex h-[55px] w-full items-center justify-center rounded-2xl bg-[#f28a3d] text-[15px] font-bold text-white shadow-[0_9px_24px_rgba(242,138,61,0.24)] transition hover:bg-[#e97d30] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading
              ? "Creating account..."
              : "Create account"}
          </button>

        </form>

        {/* DIVIDER */}
        <div className="mt-7 flex items-center gap-3">
          <div className="h-px flex-1 bg-[#eee5de]" />

          <span className="text-[11px] font-medium text-slate-400">
            or Continue with
          </span>

          <div className="h-px flex-1 bg-[#eee5de]" />
        </div>

        {/* SOCIAL / MOBILE */}
        <div className="mt-4 grid grid-cols-4 gap-3">

          {/* GOOGLE */}
          <button
            type="button"
            onClick={() => socialSignup("Google")}
            aria-label="Sign up with Google"
            className="flex h-[54px] items-center justify-center rounded-2xl border border-[#eee6df] bg-white text-slate-700 transition hover:border-[#f5c59d] hover:bg-[#fffaf6] active:scale-95"
          >
            <GoogleIcon />
          </button>

          {/* APPLE */}
          <button
            type="button"
            onClick={() => socialSignup("Apple")}
            aria-label="Sign up with Apple"
            className="flex h-[54px] items-center justify-center rounded-2xl border border-[#eee6df] bg-white text-slate-800 transition hover:border-[#f5c59d] hover:bg-[#fffaf6] active:scale-95"
          >
            <AppleIcon />
          </button>

          {/* FACEBOOK */}
          <button
            type="button"
            onClick={() => socialSignup("Facebook")}
            aria-label="Sign up with Facebook"
            className="flex h-[54px] items-center justify-center rounded-2xl border border-[#eee6df] bg-white text-[#1877F2] transition hover:border-[#f5c59d] hover:bg-[#fffaf6] active:scale-95"
          >
            <FacebookIcon />
          </button>

          {/* MOBILE */}
          <button
            type="button"
            onClick={() => navigate("/signup/mobile")}
            aria-label="Sign up with mobile number"
            className="flex h-[54px] items-center justify-center rounded-2xl border border-[#eee6df] bg-white text-[#f28a3d] transition hover:border-[#f5c59d] hover:bg-[#fffaf6] active:scale-95"
          >
            <MobileIcon />
          </button>

        </div>

        {/* FOOTER */}
        <p className="mt-7 pb-3 text-center text-sm text-slate-500">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-bold text-[#df7c32] transition hover:text-[#c96820]"
          >
            Log in
          </Link>
        </p>

      </div>
    </div>
  );
}
