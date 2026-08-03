import { forwardRef } from "react";
import { motion } from "framer-motion";

const TextInput = forwardRef(
  (
    {
      label,
      type = "text",
      name,
      value,
      onChange,
      onBlur,
      placeholder,
      error,
      disabled = false,
      required = false,
      autoComplete = "off",
      className = "",
    },
    ref
  ) => {
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

        <motion.input
          ref={ref}
          id={name}
          name={name}
          type={type}
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
            px-4
            py-3.5
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

TextInput.displayName = "TextInput";

export default TextInput;