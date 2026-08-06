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
      const x = (e.clientX - window.innerWidth / 2) / 42;
      const y = (e.clientY - window.innerHeight / 2) / 42;

      mouseX.set(Math.max(-6, Math.min(6, x)));
      mouseY.set(Math.max(-6, Math.min(6, y)));
    };

    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, [mouseX, mouseY]);

  const eyeX = useTransform(mouseX, (v) => v);
  const eyeY = useTransform(mouseY, (v) => v);

  return (
    <motion.div
      className="relative mx-auto h-[290px] w-[255px]"
      animate={{
        y: success ? [-10, -34, -10] : [-8, 8, -8],
        rotate: sad ? [-2, 2, -2] : [0, 1, 0, -1, 0],
        scale: success ? [1, 1.04, 1] : 1,
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
          scale: success ? [1, .55, 1] : [1, .82, 1],
          opacity: [.22, .08, .22],
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
          <linearGradient id="ghostFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="100%" stopColor="#eef2ff" />
          </linearGradient>
        </defs>

        <path
          d="
            M120 22
            C64 22 34 66 34 124
            V196
            C44 184 56 184 66 196
            C76 210 88 184 100 196
            C112 210 124 184 136 196
            C148 210 160 184 172 196
            C184 210 196 184 206 196
            V124
            C206 66 176 22 120 22 Z
          "
          fill="url(#ghostFill)"
          stroke="#d1d5db"
          strokeWidth="2"
        />

        <motion.g
          animate={coverEyes ? { opacity: 0 } : { opacity: 1 }}
        >
          <motion.circle
            cx="92"
            cy="108"
            r="12"
            fill="#111827"
            style={{ x: eyeX, y: eyeY }}
            animate={{ scaleY: [1, 1, 0.08, 1] }}
            transition={{
              duration: 4,
              repeat: Infinity,
              times: [0, 0.82, 0.86, 1],
            }}
          />

          <motion.circle
            cx="148"
            cy="108"
            r="12"
            fill="#111827"
            style={{ x: eyeX, y: eyeY }}
            animate={{ scaleY: [1, 1, 0.08, 1] }}
            transition={{
              duration: 4,
              repeat: Infinity,
              times: [0, 0.82, 0.86, 1],
            }}
          />
        </motion.g>
        <motion.path
          d={
            sad
              ? "M98 156 Q120 176 142 156"
              : success
              ? "M95 150 Q120 170 145 150"
              : "M100 154 Q120 146 140 154"
          }
          fill="none"
          stroke="#111827"
          strokeWidth="5"
          strokeLinecap="round"
        />

        <motion.g
          animate={coverEyes ? { y: -36 } : { y: 0 }}
          transition={{ duration: 0.35 }}
        >
          <path
            d="M64 176 C76 158 90 146 102 138"
            fill="none"
            stroke="#ffffff"
            strokeWidth="12"
            strokeLinecap="round"
          />

          <path
            d="M176 176 C164 158 150 146 138 138"
            fill="none"
            stroke="#ffffff"
            strokeWidth="12"
            strokeLinecap="round"
          />
        </motion.g>

        {sad && (
          <>
            <motion.path
              d="M84 122 C82 136 84 150 90 160"
              fill="none"
              stroke="#60a5fa"
              strokeWidth="4"
              strokeLinecap="round"
              animate={{ opacity: [0.2, 1, 0.2] }}
              transition={{ duration: 1, repeat: Infinity }}
            />

            <motion.path
              d="M156 122 C158 136 156 150 150 160"
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
