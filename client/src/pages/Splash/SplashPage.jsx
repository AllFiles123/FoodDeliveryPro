import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function SplashPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/onboarding");
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-orange-600 flex items-center justify-center">

      <motion.div
        initial={{ opacity: 0, scale: 0.6 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="flex flex-col items-center"
      >

        <motion.div
          animate={{ rotate: 360 }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "linear",
          }}
          className="w-32 h-32 rounded-full bg-white flex items-center justify-center shadow-2xl"
        >
          <span className="text-5xl">🍔</span>
        </motion.div>

        <h1 className="text-white text-4xl font-bold mt-8">
          Food Delivery Pro
        </h1>

        <p className="text-white/80 mt-3">
          Fast • Fresh • Delicious
        </p>

        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{
            duration: 1,
            repeat: Infinity,
          }}
          className="mt-10 w-5 h-5 rounded-full bg-white"
        />

      </motion.div>
    </div>
  );
}