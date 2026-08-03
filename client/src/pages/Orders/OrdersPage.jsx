import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ClipboardList } from "lucide-react";

import orderService from "../../services/orderService";


export default function OrdersPage() {


  const [orders,setOrders] = useState([]);

  const [loading,setLoading] = useState(true);



  useEffect(()=>{


    const loadOrders = async()=>{


      try{


        const response =
          await orderService.getMyOrders();


        setOrders(
          response.orders || []
        );


      }catch(error){


        console.error(error);


      }finally{


        setLoading(false);


      }


    };


    loadOrders();


  },[]);





  if(loading){

    return (

      <div className="min-h-screen bg-[#FFF8F3] flex items-center justify-center">

        <p className="text-orange-500 font-semibold">
          Loading Orders...
        </p>

      </div>

    );

  }





  return (

    <div className="min-h-screen bg-[#FFF8F3] px-5 py-8 pb-28">


      <h1 className="text-3xl font-bold text-slate-800">
        My Orders
      </h1>



      {
        orders.length === 0 ? (


          <motion.div

            initial={{opacity:0,y:30}}

            animate={{opacity:1,y:0}}

            className="mt-8 rounded-3xl bg-white p-8 text-center shadow-xl"

          >

            <ClipboardList
              size={70}
              className="mx-auto text-orange-500"
            />


            <p className="mt-5 text-orange-600 font-semibold">
              No orders yet 🍔
            </p>


          </motion.div>



        ) : (


          <div className="mt-6 space-y-5">


            {
              orders.map((order)=>(


                <motion.div

                  key={order.id}

                  initial={{opacity:0,y:20}}

                  animate={{opacity:1,y:0}}

                  className="rounded-3xl bg-white p-5 shadow-lg border border-orange-100"

                >


                  <h2 className="font-bold text-lg">
                    Order #{order.id}
                  </h2>


                  <p className="mt-2 text-gray-600">
                    Payment: {order.paymentMethod}
                  </p>


                  <p className="text-gray-600">
                    Address: {order.address}
                  </p>


                  <p className="mt-3 font-bold text-orange-500">
                    Total: ৳{order.totalAmount}
                  </p>


                </motion.div>


              ))
            }


          </div>


        )

      }


    </div>

  );

}
