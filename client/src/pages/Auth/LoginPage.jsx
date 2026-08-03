import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

import PrimaryInput from "../../components/inputs/PrimaryInput";
import PasswordInput from "../../components/inputs/PasswordInput";
import PrimaryButton from "../../components/buttons/PrimaryButton";

import authService from "../../services/authService";
import { useToast } from "../../context/ToastContext";
import { useAuth } from "../../context/AuthContext";

export default function LoginPage() {
  const { showToast } = useToast();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

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

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)
    ) {
      newErrors.email = "Please enter a valid email";
    }

    if (!formData.password.trim()) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);

    try {
      const response = await authService.login(formData);

      login(
        response.user || {
          email: formData.email,
        },
        response.token
      );

      showToast(
        "Login Successful",
        "success"
      );

      console.log(
        "Login Response:",
        response
      );

    } catch (error) {
      showToast(
        error?.response?.data?.message ||
        "Login Failed",
        "error"
      );

      console.log(
        "Login Error:",
        error
      );

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-orange-600 flex items-center justify-center px-6 py-10">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md rounded-3xl border border-white/20 bg-white/10 p-8 shadow-2xl backdrop-blur-xl"
      >
        <h1 className="text-center text-3xl font-bold text-white">
          Welcome Back 👋
        </h1>

        <p className="mt-2 text-center text-white/70">
          Login to your account
        </p>

        <form
          onSubmit={handleSubmit}
          className="mt-8 space-y-4"
        >
          <PrimaryInput
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
          />

          {errors.email && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-sm text-red-300"
            >
              {errors.email}
            </motion.p>
          )}

          <PasswordInput
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
          />

          {errors.password && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-sm text-red-300"
            >
              {errors.password}
            </motion.p>
          )}

          <PrimaryButton
            type="submit"
            disabled={loading}
          >
            {loading
              ? "Logging In..."
              : "Login"}
          </PrimaryButton>

          <Link
            to="/forgot-password"
            className="block text-center text-sm text-white/80 transition hover:text-orange-300"
          >
            Forgot Password?
          </Link>

          <p className="pt-4 text-center text-white">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="font-semibold text-orange-300 transition hover:text-orange-200"
            >
              Sign Up
            </Link>
          </p>

        </form>
      </motion.div>
    </div>
  );
}
