import { useState } from "react";
import { motion } from "framer-motion";

export default function PasswordInput({
  name,
  value,
  onChange,
  placeholder = "Password",
  autoComplete = "current-password",
  disabled = false,
  className = "",
}) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="relative">
      <input
        type={showPassword ? "text" : "password"}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        autoComplete={autoComplete}
        disabled={disabled}
        className={`w-full rounded-2xl border border-white/20 bg-white/10 px-4 py-4 pr-14 text-white placeholder:text-white/50 outline-none transition-all duration-300 focus:border-orange-400 focus:ring-2 focus:ring-orange-500/30 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      />

      <motion.button
        whileTap={{ scale: 0.85 }}
        type="button"
        disabled={disabled}
        onClick={() => setShowPassword((prev) => !prev)}
        aria-label="Toggle password visibility"
        className="absolute right-4 top-1/2 -translate-y-1/2 text-xl text-white/70 transition hover:text-white disabled:opacity-50"
      >
        {showPassword ? "🙈" : "👁️"}
      </motion.button>
    </div>
  );
}
