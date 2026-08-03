import { motion, AnimatePresence } from "framer-motion";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { useCart } from "../../context/CartContext";


export default function CartPage() {


  const navigate = useNavigate();


  const {
    cart,
    increaseQty,
    decreaseQty,
    removeFromCart,
    totalPrice,
    totalItems
  } = useCart();





  if(cart.length === 0){


    return (

      <div className="min-h-screen bg-[#FFF8F3] flex items-center justify-center px-5">


        <motion.div

          initial={{
            opacity:0,
            scale:0.8
          }}

          animate={{
            opacity:1,
            scale:1
          }}

          className="text-center"

        >

          <div className="text-7xl">
            🛒
          </div>


          <h1 className="mt-5 text-2xl font-bold text-slate-800">
            Your Cart is Empty
          </h1>


          <button

            onClick={()=>navigate("/restaurants")}

            className="mt-6 rounded-xl bg-orange-500 px-6 py-3 font-semibold text-white"

          >

            Explore Food

          </button>


        </motion.div>


      </div>

    );

  }







  return (

    <div className="min-h-screen bg-[#FFF8F3] px-5 py-8">


      <div className="mx-auto max-w-3xl">


        <h1 className="text-3xl font-bold text-slate-800">

          My Cart 🛒

        </h1>


        <p className="mt-2 text-slate-500">

          {totalItems} items in your cart

        </p>




        <div className="mt-8 space-y-5">


          <AnimatePresence>


          {
            cart.map((item)=>(


              <motion.div


                key={item.id}


                layout


                initial={{
                  opacity:0,
                  x:-30
                }}

                animate={{
                  opacity:1,
                  x:0
                }}

                exit={{
                  opacity:0,
                  x:50
                }}


                className="rounded-3xl bg-white p-5 shadow-lg border border-orange-100"

              >


                <div className="flex justify-between gap-4">


                  <div>


                    <h2 className="text-xl font-bold text-slate-800">

                      {item.name}

                    </h2>


                    <p className="mt-1 text-orange-500 font-bold">

                      ৳ {item.price}

                    </p>


                  </div>



                  <button

                    onClick={()=>removeFromCart(item.id)}

                    className="text-red-500"

                  >

                    <Trash2 size={22}/>

                  </button>


                </div>





                <div className="mt-5 flex items-center justify-between">


                  <div className="flex items-center gap-3">


                    <button

                      onClick={()=>decreaseQty(item.id)}

                      className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-100 text-orange-600"

                    >

                      <Minus size={18}/>

                    </button>




                    <span className="font-bold text-lg">

                      {item.qty}

                    </span>




                    <button

                      onClick={()=>increaseQty(item.id)}

                      className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-500 text-white"

                    >

                      <Plus size={18}/>

                    </button>


                  </div>



                  <p className="font-bold text-slate-800">

                    ৳ {item.price * item.qty}

                  </p>


                </div>



              </motion.div>


            ))
          }


          </AnimatePresence>


        </div>






        <div className="mt-8 rounded-3xl bg-white p-6 shadow-lg border border-orange-100">


          <div className="flex justify-between text-lg">

            <span>
              Total
            </span>


            <span className="font-bold text-orange-500">

              ৳ {totalPrice}

            </span>


          </div>




          <button

            onClick={()=>navigate("/checkout")}

            className="mt-5 w-full rounded-xl bg-orange-500 py-4 font-bold text-white"

          >

            Proceed To Checkout

          </button>


        </div>



      </div>


    </div>

  );

}
