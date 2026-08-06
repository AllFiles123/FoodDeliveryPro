import { useState } from "react";
import { motion } from "framer-motion";
import {
  MapPin,
  CreditCard,
  Truck,
  User,
  Phone,
  ChevronDown,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import { useCart } from "../../context/CartContext";
import orderService from "../../services/orderService";
import OrderSuccessAnimation from "../../components/animations/OrderSuccessAnimation";


const dhakaZones = [
  "Uttara",
  "Mohammadpur",
  "Dhanmondi",
  "Mirpur",
  "Gulshan",
  "Banani",
  "Bashundhara",
  "Motijheel",
  "Farmgate",
  "Other Dhaka Areas",
];


const divisions = {
  Dhaka: {
    Gazipur: [
      "Tongi",
      "Gazipur Sadar",
      "Kaliakair",
    ],
    Dhaka: [
      "Savar",
      "Keraniganj",
      "Dohar",
    ],
    Narayanganj: [
      "Narayanganj Sadar",
      "Rupganj",
    ],
  },

  Chattogram: {
    Chattogram: [
      "Pahartali",
      "Panchlaish",
      "Kotwali",
    ],
    CoxsBazar: [
      "Coxs Bazar Sadar",
      "Teknaf",
    ],
  },

  Rajshahi: {
    Rajshahi: [
      "Rajshahi Sadar",
      "Paba",
    ],
  },

};



export default function CheckoutPage() {


  const navigate = useNavigate();


  const {
    cart,
    totalPrice,
    clearCart,
  } = useCart();




  const [customerName,setCustomerName] =
    useState("");

  const [customerPhone,setCustomerPhone] =
    useState("");



  const [deliveryType,setDeliveryType] =
    useState("Dhaka Inside");



  const [zone,setZone] =
    useState("");



  const [division,setDivision] =
    useState("");

  const [district,setDistrict] =
    useState("");

  const [upazila,setUpazila] =
    useState("");



  const [fullAddress,setFullAddress] =
    useState("");



  const [paymentMethod,setPaymentMethod] =
    useState("Cash on Delivery");



  const [loading,setLoading] =
    useState(false);

  const [showSuccess,setShowSuccess] =
    useState(false);



  const deliveryCharge =
    deliveryType === "Dhaka Inside"
      ? 60
      : 120;



  const vat =
    Math.round(totalPrice * 0.05);



  const discount = 0;



  const grandTotal =
    totalPrice +
    deliveryCharge +
    vat -
    discount;



  const districts =
    division
      ? Object.keys(divisions[division])
      : [];



  const upazilas =
    division && district
      ? divisions[division][district]
      : [];
  const handleOrder = async()=>{


    if(cart.length === 0){

      alert("Your cart is empty");

      return;

    }



    if(!customerName || !customerPhone){

      alert("Please enter customer information");

      return;

    }



    if(
      deliveryType === "Dhaka Inside" &&
      (!zone || !fullAddress)
    ){

      alert("Please complete delivery address");

      return;

    }



    if(
      deliveryType === "Outside Dhaka" &&
      (
        !division ||
        !district ||
        !upazila ||
        !fullAddress
      )
    ){

      alert("Please complete location information");

      return;

    }



    try{


      setLoading(true);



      await orderService.createOrder({


        items:cart.map(item=>({

          id:item.id,

          name:item.name,

          image:item.image || "",

          price:item.price,

          quantity:item.qty || 1,

        })),


        restaurantName:
          cart[0]?.restaurantName || "",


        customerName,

        customerPhone,


        deliveryType,


        zone,


        division,

        district,

        upazila,


        fullAddress,



        subtotal:totalPrice,


        vat,


        discount,



        totalAmount:grandTotal,


        paymentMethod,



        paymentStatus:
          paymentMethod === "Cash on Delivery"
            ? "Pending"
            : "Paid",



        orderStatus:
          "Pending",



        address:fullAddress,


        deliveryCharge,


      });




      clearCart();



      setShowSuccess(true);





    }catch(error){


      console.error(error);


      alert(
        "Order failed"
      );



    }finally{


      setLoading(false);


    }


  };





  return (

    <>

    {showSuccess && (
      <OrderSuccessAnimation
        onClose={() => navigate("/orders")}
      />
    )}

    <div className="min-h-screen bg-gray-50 px-5 py-8 pb-32">


      <motion.div

        initial={{
          opacity:0,
          y:20
        }}

        animate={{
          opacity:1,
          y:0
        }}

        className="mx-auto max-w-3xl"

      >


        <h1 className="text-3xl font-bold text-slate-800">
          Checkout
        </h1>


        <p className="mt-2 text-gray-500">
          Complete your order
        </p>




        <div className="mt-6 rounded-3xl bg-gray-50 p-5 shadow-lg border border-gray-200">


          <div className="flex items-center gap-3">

            <User className="text-primary"/>

            <h2 className="font-bold text-lg">
              Customer Information
            </h2>

          </div>



          <input

            value={customerName}

            onChange={(e)=>setCustomerName(e.target.value)}

            placeholder="Full Name"

            className="mt-4 w-full rounded-xl border p-3 outline-none"

          />



          <div className="mt-3 flex items-center rounded-xl border px-3">


            <Phone
              size={18}
              className="text-primary"
            />


            <input

              value={customerPhone}

              onChange={(e)=>setCustomerPhone(e.target.value)}

              placeholder="Phone Number"

              className="w-full p-3 outline-none"

            />


          </div>


        </div>
        <div className="mt-5 rounded-3xl bg-gray-50 p-5 shadow-lg border border-gray-200">


          <div className="flex items-center gap-3">

            <MapPin className="text-primary"/>

            <h2 className="font-bold text-lg">
              Delivery Address
            </h2>

          </div>




          <div className="mt-4 grid grid-cols-2 gap-3">


            {
              [
                "Dhaka Inside",
                "Outside Dhaka"
              ].map((type)=>(


                <button


                  key={type}


                  onClick={()=>{


                    setDeliveryType(type);

                    setZone("");

                    setDivision("");

                    setDistrict("");

                    setUpazila("");

                  }}



                  className={`rounded-xl p-3 font-semibold border ${
                    
                    deliveryType===type

                    ? "bg-primary text-white"

                    : "bg-gray-50 text-slate-700"

                  }`}


                >


                  {type}


                </button>


              ))
            }


          </div>





          {
            deliveryType==="Dhaka Inside"

            &&

            <div className="mt-5">


              <label className="font-semibold">
                Select Zone
              </label>


              <div className="mt-3 relative">


                <select

                  value={zone}

                  onChange={(e)=>setZone(e.target.value)}

                  className="w-full rounded-xl border p-3 appearance-none"

                >

                  <option value="">
                    Select Dhaka Zone
                  </option>


                  {
                    dhakaZones.map(item=>(

                      <option
                        key={item}
                        value={item}
                      >

                        {item}

                      </option>

                    ))
                  }


                </select>


                <ChevronDown

                  className="absolute right-3 top-3 text-gray-500"

                />


              </div>


            </div>

          }







          {
            deliveryType==="Outside Dhaka"

            &&

            <div className="mt-5 space-y-3">



              <select

                value={division}

                onChange={(e)=>{

                  setDivision(e.target.value);

                  setDistrict("");

                  setUpazila("");

                }}

                className="w-full rounded-xl border p-3"

              >

                <option value="">
                  Select Division
                </option>


                {
                  Object.keys(divisions).map(item=>(

                    <option
                      key={item}
                      value={item}
                    >

                      {item}

                    </option>

                  ))
                }


              </select>





              <select

                value={district}

                disabled={!division}

                onChange={(e)=>{

                  setDistrict(e.target.value);

                  setUpazila("");

                }}

                className="w-full rounded-xl border p-3"

              >

                <option value="">
                  Select District
                </option>


                {
                  districts.map(item=>(

                    <option
                      key={item}
                      value={item}
                    >

                      {item}

                    </option>

                  ))
                }


              </select>






              <select

                value={upazila}

                disabled={!district}

                onChange={(e)=>setUpazila(e.target.value)}

                className="w-full rounded-xl border p-3"

              >

                <option value="">
                  Select Upazila
                </option>


                {
                  upazilas.map(item=>(

                    <option
                      key={item}
                      value={item}
                    >

                      {item}

                    </option>

                  ))
                }


              </select>



            </div>

          }






          <textarea


            value={fullAddress}


            onChange={(e)=>setFullAddress(e.target.value)}


            placeholder="House/Road/Block/Nearby Location"


            className="mt-5 w-full rounded-xl border p-3 min-h-28"


          />



        </div>
        <div className="mt-5 rounded-3xl bg-gray-50 p-5 shadow-lg border border-gray-200">


          <div className="flex items-center gap-3">

            <CreditCard className="text-primary"/>

            <h2 className="font-bold text-lg">
              Payment Method
            </h2>

          </div>




          <div className="mt-4 space-y-3">


            {
              [
                "Cash on Delivery",
                "bKash",
                "Nagad",
                "Card Payment"

              ].map((method)=>(


                <button


                  key={method}


                  onClick={()=>setPaymentMethod(method)}


                  className={`w-full rounded-2xl border p-4 text-left font-semibold transition ${
                    
                    paymentMethod===method

                    ? "border-primary bg-gray-50 text-primary"

                    : "bg-gray-50"

                  }`}


                >


                  {method}


                </button>


              ))
            }


          </div>


        </div>








        <div className="mt-5 rounded-3xl bg-gray-50 p-5 shadow-lg border border-gray-200">


          <h2 className="font-bold text-lg">
            Order Summary
          </h2>




          <div className="mt-4 space-y-4">


            {
              cart.map((item)=>(


                <div

                  key={item.id}

                  className="flex justify-between items-center"

                >


                  <div>


                    <p className="font-semibold">
                      {item.name}
                    </p>


                    <p className="text-sm text-gray-500">

                      Qty: {item.qty}

                    </p>


                  </div>



                  <p className="font-bold text-text">

                    ৳ {item.price * item.qty}

                  </p>


                </div>


              ))
            }


          </div>





          <div className="my-5 border-t"></div>




          <div className="space-y-2">


            <div className="flex justify-between">

              <span>
                Subtotal
              </span>

              <span>
                ৳ {totalPrice}
              </span>

            </div>




            <div className="flex justify-between">

              <span>
                Delivery Charge
              </span>

              <span>
                ৳ {deliveryCharge}
              </span>

            </div>




            <div className="flex justify-between">

              <span>
                VAT
              </span>

              <span>
                ৳ {vat}
              </span>

            </div>




            <div className="flex justify-between">

              <span>
                Discount
              </span>

              <span>
                - ৳ {discount}
              </span>

            </div>



            <div className="my-3 border-t"></div>




            <div className="flex justify-between text-xl font-bold">

              <span>
                Total
              </span>


              <span className="text-text">

                ৳ {grandTotal}

              </span>


            </div>



          </div>



        </div>








        <motion.button


          whileTap={{
            scale:0.96
          }}


          onClick={handleOrder}


          disabled={loading}


          className="mt-6 flex w-full items-center justify-center gap-3 rounded-full bg-primary py-4 font-bold text-white shadow-lg disabled:opacity-60"


        >


          <Truck size={22}/>



          {
            loading

            ? "Placing Order..."

            : "Place Order"

          }


        </motion.button>



      </motion.div>


    </div>

    </>

  );


}

