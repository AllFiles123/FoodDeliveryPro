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
      const x = (e.clientX - window.innerWidth / 2) / 35;
      const y = (e.clientY - window.innerHeight / 2) / 35;

      mouseX.set(Math.max(-6, Math.min(6, x)));
      mouseY.set(Math.max(-6, Math.min(6, y)));
    };

    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);

  const eyeX = useTransform(mouseX, (v) => v);
  const eyeY = useTransform(mouseY, (v) => v);

  const blink = {
    scaleY: [1, 1, 0.08, 1, 1],
  };

  return (
    <motion.div
      className="relative w-[255px] h-[270px]"
      animate={{
        y: success ? [-8, -36, -8] : [-8, 8, -8],
        rotate: sad ? [-2, 2, -2] : [0, 1, 0, -1, 0],
        scale: success ? [1, 1.05, 1] : 1,
      }}
      transition={{
        duration: success ? 0.8 : 3,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      <motion.div
        className="absolute bottom-1 left-1/2 h-5 w-28 -translate-x-1/2 rounded-full bg-black/15 blur-md"
        animate={{
          scale: success ? [1, 0.55, 1] : [1, 0.82, 1],
          opacity: [0.22, 0.06, 0.22],
        }}
        transition={{
          duration: 2.6,
          repeat: Infinity,
        }}
      />

      <svg
        viewBox="0 0 240 255"
        className="absolute inset-0 h-full w-full"
      >
        <path
          d="M120 20
             C62 20 30 60 30 120
             V205
             L48 187
             L67 205
             L86 187
             L105 205
             L120 190"
          fill="#fff"
          stroke="#E5E7EB"
          strokeWidth="2"
        />
