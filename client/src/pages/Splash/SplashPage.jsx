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
        navigate("/home", {
          replace: true,
        });
      } else {
        navigate("/login", {
          replace: true,
        });
      }
    }, 2600);

    return () => clearTimeout(timer);
  }, [navigate, isAuthenticated]);

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#fff8f1]">

      {/* SOFT ORANGE GLOW */}
      <div className="absolute -left-28 -top-28 h-72 w-72 rounded-full bg-[#ffe2c4] opacity-70 blur-3xl" />

      <div className="absolute -bottom-28 -right-28 h-80 w-80 rounded-full bg-[#ffd7ad] opacity-60 blur-3xl" />

      <div className="relative flex min-h-screen flex-col items-center justify-center px-6">

        <motion.div
          initial={{
            opacity: 0,
            scale: 0.75,
            y: 20,
          }}
          animate={{
            opacity: 1,
            scale: 1,
            y: 0,
          }}
          transition={{
            duration: 0.8,
            ease: "easeOut",
          }}
          className="flex flex-col items-center"
        >

          {/* LOGO */}
          <motion.div
            animate={{
              y: [0, -7, 0],
            }}
            transition={{
              duration: 2.8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="relative flex h-32 w-32 items-center justify-center rounded-[38px] bg-white shadow-[0_22px_60px_rgba(242,154,82,0.22)]"
          >

            <div className="absolute inset-3 rounded-[30px] bg-[#fff1e4]" />

            <span className="relative z-10 text-[58px]">
              🍔
            </span>

          </motion.div>

          {/* NAME */}
          <motion.div
            initial={{
              opacity: 0,
              y: 15,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              delay: 0.2,
              duration: 0.6,
            }}
            className="mt-8 text-center"
          >

            <h1 className="text-[31px] font-extrabold tracking-[-1px] text-slate-800">
              Food Delivery Pro
            </h1>

            <p className="mt-2 text-[14px] font-medium text-slate-400">
              Fast • Fresh • Delicious
            </p>

          </motion.div>

          {/* LOADING */}
          <div className="mt-10 flex items-center gap-2">
            {[0, 1, 2].map((item) => (
              <motion.span
                key={item}
                animate={{
                  scale: [1, 1.35, 1],
                  opacity: [0.35, 1, 0.35],
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  delay: item * 0.18,
                }}
                className="h-2.5 w-2.5 rounded-full bg-[#f29a52]"
              />
            ))}
          </div>

        </motion.div>

        {/* FOOTER */}
        <motion.p
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
          transition={{
            delay: 0.7,
            duration: 0.6,
          }}
          className="absolute bottom-8 text-[11px] font-semibold tracking-[2px] text-[#d98a4b]"
        >
          MADE FOR FOOD LOVERS
        </motion.p>

      </div>
    </div>
  );
}
