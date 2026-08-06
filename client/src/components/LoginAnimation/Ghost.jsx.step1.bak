import { motion, useMotionValue, useTransform } from "framer-motion";
import { useEffect } from "react";

export default function Ghost({
  coverEyes = false,
  sad = false,
  success = false,
}) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  useEffect(() => {
    const move = (e) => {
      const x = (e.clientX - window.innerWidth / 2) / 40;
      const y = (e.clientY - window.innerHeight / 2) / 40;

      mouseX.set(Math.max(-5, Math.min(5, x)));
      mouseY.set(Math.max(-5, Math.min(5, y)));
    };

    window.addEventListener("mousemove", move);

    return () => window.removeEventListener("mousemove", move);
  }, [mouseX, mouseY]);

  const eyeX = useTransform(mouseX, (v) => v);
  const eyeY = useTransform(mouseY, (v) => v);

  return (
    <motion.div
      className="relative mx-auto h-[285px] w-[255px]"
      animate={{
        y: success ? [-8, -30, -8] : [-6, 8, -6],
        rotate: sad ? [-2, 2, -2] : [0, 1, 0, -1, 0],
      }}
      transition={{
        duration: success ? 0.9 : 3,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      <motion.div
        className="absolute bottom-2 left-1/2 h-5 w-28 -translate-x-1/2 rounded-full bg-black/20 blur-md"
        animate={{
          scale: [1, .82, 1],
          opacity: [.25, .08, .25],
        }}
        transition={{
          duration: 2.6,
          repeat: Infinity,
        }}
      />

      <svg
        viewBox="0 0 240 260"
        className="absolute inset-0 h-full w-full"
      >
        <defs>
          <linearGradient id="ghostBody" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="100%" stopColor="#eef2ff" />
          </linearGradient>
        </defs>

        <path
          d="
            M120 24
            C68 24 34 64 34 122
            V198
            C42 186 54 186 62 198
            C72 212 84 184 96 198
            C108 212 120 184 132 198
            C144 212 156 184 168 198
            C180 212 192 184 206 198
            V122
            C206 64 172 24 120 24 Z
          "
          fill="url(#ghostBody)"
          stroke="#d1d5db"
          strokeWidth="2"
        />

        <motion.g
          animate={coverEyes ? { opacity: 0 } : { opacity: 1 }}
        >
          <motion.circle
            cx="92"
            cy="110"
            r="12"
            fill="#111827"
            style={{ x: eyeX, y: eyeY }}
            animate={{ scaleY: [1, 1, 0.08, 1] }}
            transition={{
              repeat: Infinity,
              duration: 4,
              times: [0, 0.82, 0.86, 1],
            }}
          />

          <motion.circle
            cx="148"
            cy="110"
            r="12"
            fill="#111827"
            style={{ x: eyeX, y: eyeY }}
            animate={{ scaleY: [1, 1, 0.08, 1] }}
            transition={{
              repeat: Infinity,
              duration: 4,
              times: [0, 0.82, 0.86, 1],
            }}
          />
        </motion.g>
        <motion.path
          d={
            sad
              ? "M98 156 Q120 176 142 156"
              : success
              ? "M96 150 Q120 170 144 150"
              : "M100 154 Q120 146 140 154"
          }
          fill="none"
          stroke="#111827"
          strokeWidth="5"
          strokeLinecap="round"
          transition={{ duration: 0.25 }}
        />

        <motion.g
          animate={
            coverEyes
              ? { y: -34 }
              : { y: 0 }
          }
          transition={{ duration: 0.35 }}
        >
          <path
            d="M64 176 C74 158 88 146 100 138"
            fill="none"
            stroke="#ffffff"
            strokeWidth="12"
            strokeLinecap="round"
          />

          <path
            d="M176 176 C166 158 152 146 140 138"
            fill="none"
            stroke="#ffffff"
            strokeWidth="12"
            strokeLinecap="round"
          />
        </motion.g>

        {sad && (
          <>
            <motion.path
              d="M84 124 C82 138 84 150 90 160"
              fill="none"
              stroke="#60a5fa"
              strokeWidth="4"
              strokeLinecap="round"
              animate={{ opacity: [0.2, 1, 0.2] }}
              transition={{ duration: 1, repeat: Infinity }}
            />

            <motion.path
              d="M156 124 C158 138 156 150 150 160"
              fill="none"
              stroke="#60a5fa"
              strokeWidth="4"
              strokeLinecap="round"
              animate={{ opacity: [0.2, 1, 0.2] }}
              transition={{ duration: 1, repeat: Infinity }}
            />
          </>
        )}
      </svg>
    </motion.div>
  );
}
