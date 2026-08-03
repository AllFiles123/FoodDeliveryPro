import { motion } from "framer-motion";

function AuthHeader({
  title,
  subtitle,
  emoji = "🍔",
}) {
  return (
    <div className="mb-8 text-center">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{
          duration: 0.5,
          type: "spring",
          stiffness: 180,
        }}
        className="mb-4 inline-flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 text-4xl shadow-xl shadow-orange-500/30"
      >
        {emoji}
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-3xl font-bold text-slate-800 dark:text-white"
      >
        {title}
      </motion.h1>

      {subtitle && (
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400"
        >
          {subtitle}
        </motion.p>
      )}
    </div>
  );
}

export default AuthHeader;