
import { motion } from "framer-motion";
import { CheckCircle, Package, Clock } from "lucide-react";

export default function OrderSuccessAnimation({ onClose }) {

  return (

    <motion.div
      initial={{opacity:0}}
      animate={{opacity:1}}
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 px-5"
    >

      <motion.div
        initial={{scale:0.7,y:40}}
        animate={{scale:1,y:0}}
        transition={{
          type:"spring",
          stiffness:120
        }}
        className="w-full max-w-md rounded-3xl bg-white p-8 text-center shadow-2xl"
      >

        <motion.div
          animate={{
            scale:[1,1.15,1]
          }}
          transition={{
            repeat:Infinity,
            duration:1.5
          }}
          className="mx-auto mb-5 flex h-24 w-24 items-center justify-center rounded-full bg-orange-500 text-white"
        >
          <CheckCircle size={55}/>
        </motion.div>


        <h2 className="text-3xl font-bold text-gray-800">
          Order Confirmed 🎉
        </h2>


        <p className="mt-3 text-gray-500">
          Your delicious food is being prepared.
        </p>


        <div className="mt-6 space-y-3 rounded-2xl bg-orange-50 p-4 text-left">

          <div className="flex items-center gap-3">
            <Package className="text-orange-500"/>
            <span>Restaurant is preparing your order</span>
          </div>

          <div className="flex items-center gap-3">
            <Clock className="text-orange-500"/>
            <span>Estimated delivery: 30-40 minutes</span>
          </div>

        </div>


        <button
          onClick={onClose}
          className="mt-6 w-full rounded-xl bg-orange-500 py-3 font-semibold text-white"
        >
          Track My Order
        </button>


      </motion.div>

    </motion.div>

  );
}
