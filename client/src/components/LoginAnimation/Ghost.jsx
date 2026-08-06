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
    const handleMouseMove = (e) => {
      mouseX.set(
        Math.max(-5, Math.min(5, (e.clientX - window.innerWidth / 2) / 40))
      );

      mouseY.set(
        Math.max(-5, Math.min(5, (e.clientY - window.innerHeight / 2) / 40))
      );
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () =>
      window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const eyeX = useTransform(mouseX, (v) => v);
  const eyeY = useTransform(mouseY, (v) => v);

  return (
    <motion.div
      className="relative mx-auto h-[300px] w-[250px]"
      animate={{
        y: success ? [-10, -30, -10] : [-8, 8, -8],
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
        className="absolute bottom-1 left-1/2 h-5 w-28 -translate-x-1/2 rounded-full bg-black/20 blur-md"
        animate={{
          scale: [1, 0.82, 1],
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

          <filter id="ghostShadow">
            <feDropShadow
              dx="0"
              dy="6"
              stdDeviation="6"
              floodOpacity="0.15"
            />
          </filter>
        </defs>
        <path
          filter="url(#ghostShadow)"
          fill="url(#ghostFill)"
          stroke="#dbe3eb"
          strokeWidth="2"
          d="
            M120 20
            C62 20 28 66 28 126
            V196
            C42 182 56 182 70 196
            C82 210 94 182 106 196
            C118 210 130 182 142 196
            C154 210 166 182 178 196
            C190 210 202 182 212 196
            V126
            C212 66 178 20 120 20
            Z
          "
        />

        <ellipse
          cx="120"
          cy="72"
          rx="46"
          ry="24"
          fill="#ffffff"
          opacity="0.35"
        />

        <motion.g animate={{ opacity: coverEyes ? 0 : 1 }}>
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

          <circle cx="96" cy="104" r="3" fill="#fff" />
          <circle cx="152" cy="104" r="3" fill="#fff" />
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
          transition={{ duration: 0.25 }}
        />

        <motion.g
          animate={
            coverEyes
              ? { y: -34, rotate: 6 }
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
          <motion.g
            animate={{
              scale: [1, 1.15, 1],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 1.2,
              repeat: Infinity,
            }}
          >
            <circle cx="120" cy="76" r="8" fill="#fde68a" />
            <circle cx="104" cy="90" r="3" fill="#facc15" />
            <circle cx="136" cy="90" r="3" fill="#facc15" />
          </motion.g>
        )}
      </svg>
    </motion.div>
  );
}

