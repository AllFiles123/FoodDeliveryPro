import { motion } from "framer-motion";
import { Plus, Check, Star } from "lucide-react";
import { useState, useRef } from "react";
import { useCart } from "../../../context/CartContext";

export default function FoodCard({ food, onAdd }) {

  const { cart } = useCart();

  const imageRef = useRef(null);

  const [added,setAdded] = useState(false);

  const isAdded = cart.some(
    (item)=>item.id===food.id
  );

  return (

    <motion.div

      whileHover={{y:-6}}

      whileTap={{scale:0.98}}

      className="overflow-hidden rounded-3xl border border-gray-200 bg-gray-50 shadow-lg"

    >
      <div className="h-40 overflow-hidden bg-gray-100">

        {
          food.image ? (

            <img

              ref={imageRef}

              src={food.image}

              alt={food.name}

              className="h-full w-full object-cover"

            />

          ) : (

            <div className="flex h-full items-center justify-center text-6xl">
              🍕
            </div>

          )
        }

      </div>

      <div className="p-4">

        <div className="flex items-center justify-between">

          <h3 className="text-lg font-bold text-slate-800">

            {food.name}

          </h3>

          <div className="flex items-center gap-1 rounded-full bg-gray-100 px-2 py-1">

            <Star
              size={14}
              className="fill-primary text-primary"
            />

            <span className="text-xs font-semibold text-primary">

              {food.rating}

            </span>

          </div>

        </div>
        <p className="mt-2 line-clamp-2 text-sm text-gray-500">

          {food.description}

        </p>

        <div className="mt-5 flex items-center justify-between">

          <span className="text-xl font-bold text-primary">

            ৳ {food.price}

          </span>

          <motion.button

            whileTap={{scale:0.9}}

            whileHover={{scale:1.05}}

            onClick={(event)=>{

              setAdded(true);

              onAdd?.({

                ...food,

                image:food.image || ""

              },event);

            }}

            className={`flex items-center gap-2 rounded-full px-4 py-2 font-semibold text-white shadow-md transition-all duration-300 ${
              (added || isAdded)
              ? "bg-green-500 shadow-green-300"
              : "bg-primary"
            }`}

          >

            {
              (added || isAdded)
              ? <Check size={18}/>
              : <Plus size={18}/>
            }

            {
              (added || isAdded)
              ? "✓ Added"
              : "Add"
            }

          </motion.button>

        </div>

      </div>

    </motion.div>

  );

}
