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
  }, []);

  const eyeX = useTransform(mouseX, (v) => v);
  const eyeY = useTransform(mouseY, (v) => v);

  return (
    <motion.div
      className="relative w-[190px] h-[220px]"
      animate={{
        y: success ? [-8, -30, -8] : [-8, 8, -8],
        rotate: sad ? [-2, 2, -2] : 0,
      }}
      transition={{
        duration: success ? 0.6 : 3,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      <motion.div
        className="absolute bottom-0 left-1/2 h-5 w-24 -translate-x-1/2 rounded-full bg-black/15 blur-md"
        animate={{
          scale: success ? [1, .6, 1] : [1, .8, 1],
          opacity: [.18,.08,.18],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
        }}
      />

      <svg
        viewBox="0 0 200 220"
        className="absolute inset-0 w-full h-full"
      >
        <path
          d="M100 15
             C55 15 28 48 28 102
             V182
             L45 166
             L63 182
             L81 166
             L100 182
             L119 166
             L137 182
             L155 166
             L172 182
             V102
             C172 48 145 15 100 15Z"
          fill="#fff"
          stroke="#E5E7EB"
          strokeWidth="2"
        />

        <circle cx="74" cy="88" r="10" fill="white"/>
        <circle cx="126" cy="88" r="10" fill="white"/>

        <motion.circle
          cx="74"
          cy="88"
          r="4"
          fill="#111827"
          style={{ x: eyeX, y: eyeY }}
        />

        <motion.circle
          cx="126"
          cy="88"
          r="4"
          fill="#111827"
          style={{ x: eyeX, y: eyeY }}
        />

        <path
          d={
            sad
              ? "M74 126 Q100 108 126 126"
              : "M74 118 Q100 136 126 118"
          }
          stroke="#111827"
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
        />
      </svg>

      <motion.div
        className="absolute left-[24px] top-[86px] h-12 w-8 rounded-full border-2 border-gray-200 bg-white origin-right"
        animate={{
          rotate: coverEyes ? -65 : -12,
          x: coverEyes ? 32 : 0,
          y: coverEyes ? -10 : 0,
        }}
        transition={{ type: "spring", stiffness: 180 }}
      />

      <motion.div
        className="absolute right-[24px] top-[86px] h-12 w-8 rounded-full border-2 border-gray-200 bg-white origin-left"
        animate={{
          rotate: coverEyes ? 65 : 12,
          x: coverEyes ? -32 : 0,
          y: coverEyes ? -10 : 0,
        }}
        transition={{ type: "spring", stiffness: 180 }}
      />
    </motion.div>
  );
}
