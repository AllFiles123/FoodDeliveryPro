import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function OnboardingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-red-500 to-slate-900 flex flex-col justify-center items-center px-6">
      <motion.div
        initial={{ scale: 0.7, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="text-8xl"
      >
        🍕
      </motion.div>

      <motion.h1
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-white text-4xl font-bold mt-8 text-center"
      >
        Delicious Food
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-white/80 text-center mt-4 max-w-sm"
      >
        Discover restaurants, order your favorite meals and get them delivered
        fast to your doorstep.
      </motion.p>

      <motion.button
        whileTap={{ scale: 0.95 }}
        whileHover={{ scale: 1.05 }}
        onClick={() => navigate("/login")}
        className="mt-10 bg-white text-slate-900 px-8 py-4 rounded-full font-semibold shadow-xl"
      >
        Get Started
      </motion.button>
    </div>
  );
}
