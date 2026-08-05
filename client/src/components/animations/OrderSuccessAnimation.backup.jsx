import { motion } from "framer-motion";

export default function OrderSuccessAnimation(){

  return (

    <motion.div

      initial={{
        scale:0,
        opacity:0
      }}

      animate={{
        scale:1,
        opacity:1
      }}

      transition={{
        duration:0.5
      }}

      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40"

    >

      <motion.div

        animate={{
          scale:[1,1.1,1]
        }}

        transition={{
          repeat:Infinity,
          duration:1
        }}

        className="rounded-full bg-green-500 p-8 text-6xl text-white shadow-2xl"

      >

        ✓

      </motion.div>

    </motion.div>

  );

}
