import { motion } from "framer-motion";
import {
  CheckCircle,
  PackageCheck,
  Clock3,
  ArrowRight,
} from "lucide-react";

export default function OrderSuccessAnimation({ onClose }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 px-5"
    >
      <motion.div
        initial={{ scale: 0.8, y: 40, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        transition={{
          type: "spring",
          stiffness: 160,
          damping: 18,
        }}
        className="relative w-full max-w-md overflow-hidden rounded-[32px] bg-white p-8 shadow-[0_25px_70px_rgba(0,0,0,0.18)]"
      >
        <motion.div
          animate={{
            scale: [1, 1.08, 1],
          }}
          transition={{
            repeat: Infinity,
            duration: 2,
          }}
          className="mx-auto flex h-28 w-28 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary shadow-xl"
        >
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white">
            <CheckCircle
              size={52}
              className="text-primary"
            />
          </div>
        </motion.div>

        <h2 className="mt-7 text-center text-3xl font-extrabold text-slate-800">
          Order Confirmed
        </h2>

        <p className="mt-3 text-center text-sm leading-6 text-slate-500">
          Your order has been received successfully.
          Our restaurant has already started preparing it.
        </p>

        <div className="mt-7 rounded-2xl bg-gray-50 p-5 space-y-4">
          <div className="flex items-center gap-3">
            <PackageCheck
              size={22}
              className="text-primary"
            />
            <span className="text-sm font-medium">
              Restaurant accepted your order
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Clock3
              size={22}
              className="text-primary"
            />
            <span className="text-sm font-medium">
              Estimated delivery 30–40 minutes
            </span>
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onClose}
          className="mt-8 flex w-full items-center justify-center gap-2 rounded-2xl bg-primary py-4 font-bold text-white shadow-lg"
        >
          Track My Order
          <ArrowRight size={20} />
        </motion.button>
      </motion.div>
    </motion.div>
  );
}
