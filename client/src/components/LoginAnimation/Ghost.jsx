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
      mouseX.set(
        Math.max(-6, Math.min(6, (e.clientX - window.innerWidth / 2) / 42))
      );
      mouseY.set(
        Math.max(-6, Math.min(6, (e.clientY - window.innerHeight / 2) / 42))
      );
    };

    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);

  const eyeX = useTransform(mouseX, (v) => v);
  const eyeY = useTransform(mouseY, (v) => v);

  return (
    <motion.div
      className="relative mx-auto h-[290px] w-[255px]"
      animate={{
        y: success ? [-10, -34, -10] : [-8, 8, -8],
        rotate: sad ? [-2, 2, -2] : [0, 1, 0, -1, 0],
        scale: success ? [1, 1.05, 1] : 1,
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
          scale: success ? [1, 0.55, 1] : [1, 0.82, 1],
          opacity: [0.22, 0.08, 0.22],
        }}
        transition={{
          duration: 2.5,
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

          <filter id="ghostShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow
              dx="0"
              dy="5"
              stdDeviation="5"
              floodOpacity="0.12"
            />
          </filter>
        </defs>

        <path
          filter="url(#ghostShadow)"
          fill="url(#ghostFill)"
          stroke="#d1d5db"
          strokeWidth="2"
          d="
            M120 18
            C58 18 28 66 28 126
            V198
            C40 184 54 184 66 198
            C78 212 90 184 102 198
            C114 212 126 184 138 198
            C150 212 162 184 174 198
            C186 212 198 184 212 198
            V126
            C212 66 182 18 120 18
            Z
          "
        />

        <motion.g
          animate={coverEyes ? { opacity: 0 } : { opacity: 1}}
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

          <circle cx="96" cy="104" r="3" fill="#ffffff" />
          <circle cx="152" cy="104" r="3" fill="#ffffff" />
        </motion.g>
        <motion.path
          d={
            sad
              ? "M98 156 Q120 176 142 156"
              : success
              ? "M94 150 Q120 170 146 150"
              : "M100 154 Q120 146 140 154"
          }
          fill="none"
          stroke="#111827"
          strokeWidth="5"
          strokeLinecap="round"
        />

        <motion.g
          animate={
            coverEyes
              ? { y: -36, rotate: 6 }
              : { y: 0, rotate: 0 }
          }
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
        {success && (
          <motion.circle
            cx="120"
            cy="78"
            r="8"
            fill="#fde68a"
            animate={{
              r: [8, 14, 8],
              opacity: [0.4, 1, 0.4],
            }}
            transition={{
              duration: 1.2,
              repeat: Infinity,
            }}
          />
        )}
      </svg>
    </motion.div>
  );
}

