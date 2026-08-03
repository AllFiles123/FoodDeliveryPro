import { AnimatePresence, motion } from "framer-motion";

export default function Toast({
  message,
  type = "success",
  show = false,
}) {
  const styles = {
    success: "bg-emerald-500",
    error: "bg-red-500",
    warning: "bg-yellow-500",
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          transition={{ duration: 0.3 }}
          className={`
            fixed
            top-5
            left-1/2
            -translate-x-1/2
            z-50
            rounded-xl
            px-5
            py-3
            text-white
            shadow-xl
            ${styles[type]}
          `}
        >
          {message}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
