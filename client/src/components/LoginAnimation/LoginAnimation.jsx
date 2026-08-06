import { motion } from "framer-motion";
import Ghost from "./Ghost";
import { useLoginAnimation } from "../../context/LoginAnimationContext";

export default function LoginAnimation() {
  const { coverEyes, sad, success } = useLoginAnimation();

  return (
    <motion.div
      className="mb-8 flex items-center justify-center overflow-hidden"
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
    >
      <Ghost
        coverEyes={coverEyes}
        sad={sad}
        success={success}
      />
    </motion.div>
  );
}
