import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Mail, LockKeyhole } from "lucide-react";

import authService from "../../services/authService";
import { useToast } from "../../context/ToastContext";
import { useAuth } from "../../context/AuthContext";

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
          email: response.user?.email || formData.email,
          phone: response.user?.phone || "",
          role: response.user?.role || "user",
        },
        response.token
      );

      showToast("Login Successful", "success");

      navigate("/home", { replace: true });
    } catch (error) {
      showToast(
        error?.response?.data?.message || "Login Failed",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  const socialLoginPlaceholder = (provider) => {
    showToast(
      `${provider} login will be connected with backend later.`,
      "info"
    );
  };

  return (
    <div className="min-h-screen bg-[#fff8f1] px-4 py-6 sm:px-6 sm:py-10">
      <div className="mx-auto flex min-h-[calc(100vh-3rem)] w-full max-w-[440px] items-center justify-center sm:min-h-[calc(100vh-5rem)]">

        <div className="w-full rounded-[30px] bg-[#fffdf9] px-5 py-6 shadow-[0_18px_55px_rgba(194,112,40,0.12)] sm:px-9 sm:py-8">

          <div className="text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-100 text-orange-500">
              <span className="text-2xl">🍽</span>
            </div>

            <h1 className="mt-4 text-2xl font-bold tracking-tight text-slate-800">
              Food Delivery Pro
            </h1>

            <p className="mt-1 text-sm text-slate-400">
              Delicious food, delivered simply.
            </p>
          </div>

          <div className="mt-7 grid grid-cols-2 rounded-2xl bg-orange-50 p-1.5">
            <div className="rounded-xl bg-orange-500 px-4 py-3 text-center text-sm font-semibold text-white shadow-sm">
              Log in
            </div>

            <Link
              to="/signup"
              className="rounded-xl px-4 py-3 text-center text-sm font-semibold text-slate-500 transition hover:text-orange-500"
            >
              Sign up
            </Link>
          </div>

          <div className="mt-7">
            <h2 className="text-xl font-bold text-slate-800">
              Welcome back
            </h2>

            <p className="mt-1 text-sm leading-6 text-slate-400">
              Sign in to continue to your account.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="mt-6 space-y-4"
          >
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Email address
              </label>

              <div className="relative">
                <Mail
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  autoComplete="email"
                  className={`w-full rounded-2xl border bg-white py-4 pl-11 pr-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 ${
                    errors.email
                      ? "border-red-300 focus:ring-4 focus:ring-red-100"
                      : "border-orange-100 focus:border-orange-400 focus:ring-4 focus:ring-orange-100"
                  }`}
                />
              </div>

              {errors.email && (
                <p className="mt-2 px-1 text-xs font-medium text-red-500">
                  {errors.email}
                </p>
              )}
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Password
              </label>

              <div className="relative">
                <LockKeyhole
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  className={`w-full rounded-2xl border bg-white py-4 pl-11 pr-12 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 ${
                    errors.password
                      ? "border-red-300 focus:ring-4 focus:ring-red-100"
                      : "border-orange-100 focus:border-orange-400 focus:ring-4 focus:ring-orange-100"
                  }`}
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword((value) => !value)
                  }
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-orange-500"
                >
                  {showPassword ? (
                    <EyeOff size={19} />
                  ) : (
                    <Eye size={19} />
                  )}
                </button>
              </div>

              {errors.password && (
                <p className="mt-2 px-1 text-xs font-medium text-red-500">
                  {errors.password}
                </p>
              )}
            </div>

            <div className="flex justify-end">
              <Link
                to="/forgot-password"
                className="text-sm font-semibold text-orange-500 transition hover:text-orange-600"
              >
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-2xl bg-orange-500 py-4 text-sm font-bold text-white shadow-[0_10px_25px_rgba(249,115,22,0.22)] transition hover:bg-orange-600 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Logging in..." : "Log in"}
            </button>
          </form>

          <div className="my-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-orange-100" />
            <span className="text-xs font-medium text-slate-400">
              OR CONTINUE WITH
            </span>
            <div className="h-px flex-1 bg-orange-100" />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <button
              type="button"
              onClick={() => socialLoginPlaceholder("Google")}
              className="flex h-12 items-center justify-center rounded-2xl border border-orange-100 bg-white text-slate-700 transition hover:border-orange-300 hover:bg-orange-50 active:scale-95"
              aria-label="Continue with Google"
            >
              <GoogleIcon />
            </button>

            <button
              type="button"
              onClick={() => socialLoginPlaceholder("Apple")}
              className="flex h-12 items-center justify-center rounded-2xl border border-orange-100 bg-white text-slate-800 transition hover:border-orange-300 hover:bg-orange-50 active:scale-95"
              aria-label="Continue with Apple"
            >
              <AppleIcon />
            </button>

            <button
              type="button"
              onClick={() => socialLoginPlaceholder("Facebook")}
              className="flex h-12 items-center justify-center rounded-2xl border border-orange-100 bg-white text-[#1877F2] transition hover:border-orange-300 hover:bg-orange-50 active:scale-95"
              aria-label="Continue with Facebook"
            >
              <FacebookIcon />
            </button>
          </div>

          <p className="mt-7 text-center text-sm text-slate-500">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="font-bold text-orange-500 hover:text-orange-600"
            >
              Sign up
            </Link>
          </p>

        </div>
      </div>
    </div>
  );
}
