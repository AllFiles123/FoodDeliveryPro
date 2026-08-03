import { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, CreditCard, Truck } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { useCart } from "../../context/CartContext";
import orderService from "../../services/orderService";


export default function CheckoutPage() {


  const navigate = useNavigate();


  const {
    cartItems,
    totalPrice,
    clearCart,
  } = useCart();



  const [address,setAddress] = useState(
    "House 12, Road 5, Dhaka"
  );


  const [paymentMethod,setPaymentMethod] =
    useState("Cash on Delivery");


  const [loading,setLoading] =
    useState(false);



  const deliveryFee =
    totalPrice > 0 ? 60 : 0;


  const vat =
    Math.round(totalPrice * 0.05);


  const total =
    totalPrice + deliveryFee + vat;




  const handleOrder = async()=>{


    try{


      setLoading(true);



      await orderService.createOrder({

        items:cartItems,

        totalAmount:total,

        paymentMethod,

        address,

        deliveryCharge:deliveryFee

      });



      alert("Order Placed Successfully 🎉");



      clearCart();



      navigate("/orders");



    }catch(error){


      console.error(error);

      alert("Order Failed");


    }finally{


      setLoading(false);


    }


  };




  return (

    <div className="min-h-screen bg-white px-5 py-6 pb-28">


      <motion.div

        initial={{opacity:0,y:20}}

        animate={{opacity:1,y:0}}

      >


        <h1 className="text-3xl font-bold text-gray-900">
          Checkout
        </h1>


        <p className="mt-1 text-gray-500">
          Confirm your order
        </p>




        <div className="mt-8 rounded-3xl border border-orange-100 bg-orange-50 p-5">


          <div className="flex items-center gap-3">

            <MapPin className="text-orange-500"/>

            <h2 className="font-bold">
              Delivery Address
            </h2>

          </div>



          <textarea

            value={address}

            onChange={(e)=>setAddress(e.target.value)}

            className="mt-4 w-full rounded-xl border p-3 outline-none"

          />

        </div>





        <div className="mt-5 rounded-3xl border border-orange-100 p-5 shadow-sm">


          <div className="flex items-center gap-3">

            <CreditCard className="text-orange-500"/>

            <h2 className="font-bold">
              Payment Method
            </h2>

          </div>




          <div className="mt-4 space-y-3">


            {
              [
                "Cash on Delivery",
                "bKash",
                "Nagad"
              ].map((item)=>(

                <label
                  key={item}
                  className="flex items-center gap-3 rounded-2xl border p-3"
                >

                  <input

                    type="radio"

                    name="payment"

                    checked={
                      paymentMethod===item
                    }

                    onChange={()=>
                      setPaymentMethod(item)
                    }

                  />

                  {item}

                </label>

              ))
            }


          </div>


        </div>





        <div className="mt-5 rounded-3xl bg-orange-50 p-5">


          <div className="flex justify-between">

            <span>Subtotal</span>

            <span>৳{totalPrice}</span>

          </div>


          <div className="mt-2 flex justify-between">

            <span>Delivery Fee</span>

            <span>৳{deliveryFee}</span>

          </div>


          <div className="mt-2 flex justify-between">

            <span>VAT</span>

            <span>৳{vat}</span>

          </div>


          <div className="my-4 border-t"></div>


          <div className="flex justify-between text-xl font-bold">

            <span>Total</span>

            <span className="text-orange-500">
              ৳{total}
            </span>

          </div>


        </div>





        <button

          onClick={handleOrder}

          disabled={loading}

          className="mt-8 flex w-full items-center justify-center gap-2 rounded-full bg-orange-500 py-4 font-bold text-white"

        >

          <Truck size={20}/>

          {
            loading
            ? "Placing Order..."
            : "Place Order"
          }


        </button>



      </motion.div>


    </div>

  );

}
