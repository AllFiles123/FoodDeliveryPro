import { motion } from "framer-motion";

function AuthCard({ children, className = "" }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: 0.5,
        ease: "easeOut",
      }}
      className={`
        w-full
        max-w-md
        rounded-3xl
        border
        border-white/20
        bg-white/10
        dark:bg-slate-900/30
        backdrop-blur-2xl
        shadow-2xl
        shadow-orange-500/10
        p-6
        md:p-8
        ${className}
      `}
    >
      {children}
    </motion.div>
  );
}

export default AuthCard;