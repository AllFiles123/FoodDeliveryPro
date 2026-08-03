import { motion } from "framer-motion";

function PrimaryButton({
  children,
  type = "button",
  onClick,
  disabled = false,
  className = "",
}) {
  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      whileTap={!disabled ? { scale: 0.96 } : {}}
      whileHover={!disabled ? { scale: 1.02 } : {}}
      transition={{ duration: 0.2 }}
      className={`
        relative
        overflow-hidden
        w-full
        rounded-2xl
        px-5
        py-3.5
        font-semibold
        text-white
        bg-gradient-to-r
        from-orange-500
        via-amber-500
        to-yellow-500
        shadow-lg
        shadow-orange-500/30
        hover:shadow-xl
        hover:shadow-orange-500/40
        transition-all
        duration-300
        disabled:cursor-not-allowed
        disabled:opacity-60
        ${className}
      `}
    >
      <span className="relative z-10 flex items-center justify-center gap-2">
        {children}
      </span>

      {!disabled && (
        <span
          className="
          absolute
          inset-0
          bg-white/20
          opacity-0
          transition
          duration-300
          hover:opacity-100
          "
        />
      )}
    </motion.button>
  );
}

export default PrimaryButton;
