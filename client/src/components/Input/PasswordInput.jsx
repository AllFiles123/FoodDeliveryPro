import { useState, forwardRef } from "react";
import { Eye, EyeOff, Lock } from "lucide-react";
import { motion } from "framer-motion";

const PasswordInput = forwardRef(
  (
    {
      label,
      name,
      value,
      onChange,
      onBlur,
      placeholder = "Enter your password",
      error,
      disabled = false,
      required = false,
      autoComplete = "current-password",
      className = "",
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = useState(false);

    return (
      <div className={`w-full ${className}`}>
        {label && (
          <label
            htmlFor={name}
            className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200"
          >
            {label}
            {required && <span className="ml-1 text-red-500">*</span>}
          </label>
        )}

        <div className="relative">
          <Lock
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <motion.input
            ref={ref}
            id={name}
            name={name}
            type={showPassword ? "text" : "password"}
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            placeholder={placeholder}
            disabled={disabled}
            autoComplete={autoComplete}
            whileFocus={{ scale: 1.01 }}
            transition={{ duration: 0.2 }}
            className={`
              w-full
              rounded-2xl
              border
              py-3.5
              pl-11
              pr-12
              outline-none
              transition-all
              duration-300
              backdrop-blur-xl
              bg-white/70
              dark:bg-slate-900/70
              ${
                error
                  ? "border-red-500 focus:ring-2 focus:ring-red-500/30"
                  : "border-slate-300 dark:border-slate-700 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/30"
              }
              text-slate-800
              dark:text-white
              placeholder:text-slate-400
              disabled:opacity-60
              disabled:cursor-not-allowed
            `}
          />

          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-orange-500 transition-colors"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>

        {error && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-2 text-sm text-red-500"
          >
            {error}
          </motion.p>
        )}
      </div>
    );
  }
);

PasswordInput.displayName = "PasswordInput";

export default PasswordInput;