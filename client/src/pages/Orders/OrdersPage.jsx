import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown,
  ChevronUp,
  Phone,
  MapPin,
  CreditCard,
  XCircle,
  Clock,
  CheckCircle,
  Store,
  Bike,
} from "lucide-react";

import orderService from "../../services/orderService";


const trackingSteps = [
  "Order Placed",
  "Confirmed",
  "Preparing Food",
  "Rider Assigned",
  "Out for Delivery",
  "Delivered",
];


export default function OrdersPage(){

  const [orders,setOrders] = useState([]);
  const [loading,setLoading] = useState(true);
  const [open,setOpen] = useState(null);


  const loadOrders = async()=>{

    try{

      const response =
        await orderService.getMyOrders();

      setOrders(response.orders || []);

    }catch(error){

      console.error(error);

    }finally{

      setLoading(false);

    }

  };


  useEffect(()=>{

    loadOrders();

  },[]);



  const cancelOrder = async(id)=>{

    if(!confirm("Cancel this order?"))
      return;

    await orderService.cancelOrder(id);

    loadOrders();

  };



  if(loading){

    return(
      <div className="min-h-screen flex items-center justify-center bg-[#FFF8F3]">
        <p className="font-bold text-orange-500">
          Loading Orders...
        </p>
      </div>
    );

  }



  return(

    <div className="min-h-screen bg-[#FFF8F3] px-5 py-8 pb-32">


      <h1 className="text-3xl font-bold text-slate-800">
        My Orders
      </h1>



      <div className="mt-6 space-y-5">


      {
        orders.map(order=>{


          let items=[];

          try{

            items =
              typeof order.items==="string"
              ? JSON.parse(order.items)
              : order.items || [];

          }catch{

            items=[];

          }



          const activeStep =
            trackingSteps.indexOf(
              order.orderStatus
            );


          let trackingHistory=[];

          try{

            trackingHistory =
              JSON.parse(
                order.trackingHistory || "[]"
              );

          }catch{

            trackingHistory=[];

          }



          return(

          <motion.div

            key={order.id}

            initial={{
              opacity:0,
              y:20
            }}

            animate={{
              opacity:1,
              y:0
            }}

            className="rounded-3xl bg-white shadow-xl border border-orange-100 overflow-hidden"

          >



          <div className="p-5 flex justify-between items-center">


            <div>

              <div className="flex items-center gap-2">

                <Store size={20}
                  className="text-orange-500"
                />

                <h2 className="font-bold text-xl">
                  {order.restaurantName || "Food Restaurant"}
                </h2>

              </div>


              <p className="text-sm text-gray-500 mt-1">
                {order.orderNumber}
              </p>


              <p className="font-bold text-orange-500 mt-2">
                ৳ {order.totalAmount}
              </p>


              <span className="inline-block mt-2 rounded-full bg-orange-100 px-3 py-1 text-xs font-bold text-orange-600">
                {order.orderStatus}
              </span>


            </div>




            <button
              onClick={()=>
                setOpen(
                  open===order.id
                  ? null
                  : order.id
                )
              }
              className="text-orange-500"
            >

              {
                open===order.id
                ?
                <ChevronUp size={30}/>
                :
                <ChevronDown size={30}/>
              }

            </button>


          </div>






          <AnimatePresence>


          {
            open===order.id && (


            <motion.div

              initial={{
                height:0,
                opacity:0
              }}

              animate={{
                height:"auto",
                opacity:1
              }}

              exit={{
                height:0,
                opacity:0
              }}

              className="px-5 pb-5"

            >



            <div className="border-t pt-5">


              <h3 className="font-bold text-lg">
                Order Summary
              </h3>



              <div className="mt-4 space-y-3">

              {
                items.map(item=>(


                  <div
                    key={item.id}
                    className="flex items-center gap-3"
                  >

                    {
                      item.image ?

                      <img
                        src={item.image}
                        className="h-16 w-16 rounded-xl object-cover"
                      />

                      :

                      <div className="h-16 w-16 rounded-xl bg-orange-100 flex items-center justify-center text-2xl">
                        🍔
                      </div>

                    }



                    <div className="flex-1">

                      <p className="font-bold">
                        {item.name}
                      </p>

                      <p className="text-sm text-gray-500">
                        Qty: {item.qty}
                      </p>

                    </div>



                    <p className="font-bold text-orange-500">
                      ৳ {item.price * item.qty}
                    </p>


                  </div>

                  ))
                }



              </div>





              <div className="mt-5 border-t pt-4 space-y-2 text-sm">


                <p>
                  Subtotal: ৳ {order.subtotal}
                </p>

                <p>
                  Delivery: ৳ {order.deliveryCharge}
                </p>

                <p>
                  VAT: ৳ {order.vat}
                </p>

                <p className="font-bold text-lg">
                  Total: ৳ {order.totalAmount}
                </p>


              </div>






              <div className="mt-5 space-y-3">


                <p className="flex gap-2">
                  <Phone size={18}/>
                  {order.customerPhone || "No phone"}
                </p>


                <p className="flex gap-2">
                  <MapPin size={18}/>
                  {order.fullAddress || order.address}
                </p>


                <p className="flex gap-2">
                  <CreditCard size={18}/>
                  {order.paymentMethod}
                </p>


                <p className="flex gap-2">
                  <Clock size={18}/>
                  {order.estimatedDeliveryTime}
                </p>


              </div>



              <motion.div

                initial={{
                  opacity:0,
                  y:20
                }}

                animate={{
                  opacity:1,
                  y:0
                }}

                className="mt-6 rounded-2xl bg-orange-50 p-4"

              >

                <div className="flex items-center justify-between">

                  <div>

                    <p className="text-sm text-gray-500">
                      Estimated Delivery
                    </p>


                    <p className="font-bold text-orange-600">
                      {order.estimatedDeliveryTime || "30-45 minutes"}
                    </p>

                  </div>


                  <motion.div

                    animate={{
                      x:[0,8,0]
                    }}

                    transition={{
                      repeat:Infinity,
                      duration:1.5
                    }}

                    className="text-3xl"

                  >

                    🛵

                  </motion.div>


                </div>



                {
                  order.orderStatus==="Out for Delivery" &&

                  <p className="mt-3 text-sm font-semibold text-orange-600">

                    Your rider is on the way 🚴

                  </p>

                }


              </motion.div>






              <div className="mt-6">


                <h3 className="font-bold text-lg mb-4">
                  Live Tracking
                </h3>



                <div className="relative space-y-6 ml-2">


                  <div className="absolute left-2 top-3 bottom-3 w-1 bg-orange-100 rounded-full"></div>


                  {
                    trackingSteps.map((step,index)=>(


                      <motion.div

                        key={step}

                        initial={{
                          opacity:0,
                          x:-20
                        }}

                        animate={{
                          opacity:1,
                          x:0
                        }}

                        transition={{
                          delay:index*0.1
                        }}

                        className="relative flex items-center gap-4"

                      >


                        <motion.div

                          animate={
                            index===activeStep
                            ?
                            {
                              scale:[1,1.25,1]
                            }
                            :
                            {}
                          }

                          transition={{
                            repeat:Infinity,
                            duration:1.4
                          }}

                          className={`z-10 h-6 w-6 rounded-full flex items-center justify-center ${
                            index<=activeStep
                            ?
                            "bg-orange-500"
                            :
                            "bg-gray-300"
                          }`}

                        >

                          {
                            index < activeStep &&
                            <CheckCircle
                              size={16}
                              className="text-white"
                            />
                          }

                        </motion.div>



                        <div>

                          <p className={
                            index<=activeStep
                            ?
                            "font-bold text-orange-600"
                            :
                            "text-gray-400"
                          }>

                            {step}

                          </p>



                          {
                            index===activeStep &&

                            <motion.p

                              animate={{
                                opacity:[0.5,1,0.5]
                              }}

                              transition={{
                                repeat:Infinity,
                                duration:1.5
                              }}

                              className="text-xs text-orange-500"

                            >

                              Current delivery status

                            </motion.p>

                          }



                          {
                            trackingHistory.find(
                              history =>
                              history.status === step
                            ) &&

                            <p className="text-xs text-gray-400">

                              {
                                new Date(
                                  trackingHistory.find(
                                    history =>
                                    history.status === step
                                  ).time
                                ).toLocaleString()
                              }

                            </p>

                          }



                          {
                            step==="Out for Delivery" &&
                            index===activeStep &&

                            <motion.div

                              animate={{
                                x:[0,20,0]
                              }}

                              transition={{
                                repeat:Infinity,
                                duration:2
                              }}

                              className="text-xl"

                            >

                              🛵

                            </motion.div>

                          }


                        </div>


                      </motion.div>

                      ))
                    }





                </div>




                </div>


              </div>






              {
                order.orderStatus!=="Delivered" &&
                order.orderStatus!=="Cancelled" &&


                <button

                  onClick={()=>cancelOrder(order.id)}

                  className="mt-6 flex items-center gap-2 rounded-xl bg-red-500 px-5 py-3 text-white font-bold"

                >

                  <XCircle size={18}/>

                  Cancel Order

                </button>

              }





            </motion.div>

            )
          }


          </AnimatePresence>



          </motion.div>


          );


        })
      }


      </div>


    </div>

  );

}