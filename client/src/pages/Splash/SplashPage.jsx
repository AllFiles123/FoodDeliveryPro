import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

import { useAuth } from "../../context/AuthContext";

export default function SplashPage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (isAuthenticated) {
        // Logged-in user
        navigate("/home", {
          replace: true,
        });
      } else {
        // Logged-out user
        navigate("/login", {
          replace: true,
        });
      }
    }, 2600);

    return () => clearTimeout(timer);
  }, [navigate, isAuthenticated]);

  return (
    <div className="min-h-screen w-full overflow-hidden bg-[#fff8f1] flex items-center justify-center px-6">
      <motion.div
        initial={{
          opacity: 0,
          scale: 0.88,
        }}
        animate={{
          opacity: 1,
          scale: 1,
        }}
        transition={{
          duration: 0.7,
          ease: "easeOut",
        }}
        className="flex w-full max-w-sm flex-col items-center text-center"
      >
        {/* LOGO */}
        <motion.div
          initial={{
            opacity: 0,
            y: 20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.7,
          }}
          className="flex h-32 w-32 items-center justify-center rounded-[38px] bg-white shadow-[0_18px_45px_rgba(249,115,22,0.16)]"
        >
          <span className="text-6xl">🍔</span>
        </motion.div>

        {/* APP NAME */}
        <motion.h1
          initial={{
            opacity: 0,
            y: 15,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            delay: 0.15,
            duration: 0.6,
          }}
          className="mt-8 text-3xl font-extrabold tracking-tight text-slate-800"
        >
          Food Delivery Pro
        </motion.h1>

        {/* TAGLINE */}
        <motion.p
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
          transition={{
            delay: 0.3,
            duration: 0.6,
          }}
          className="mt-3 text-sm font-medium text-slate-400"
        >
          Fast • Fresh • Delicious
        </motion.p>

        {/* LOADING DOTS */}
        <div className="mt-10 flex items-center gap-2">
          {[0, 1, 2].map((item) => (
            <motion.span
              key={item}
              animate={{
                scale: [1, 1.35, 1],
                opacity: [0.45, 1, 0.45],
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                delay: item * 0.18,
              }}
              className="h-2.5 w-2.5 rounded-full bg-orange-400"
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
}
