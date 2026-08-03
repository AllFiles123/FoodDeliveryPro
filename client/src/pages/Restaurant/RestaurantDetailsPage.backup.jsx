import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useParams } from "react-router-dom";

import restaurantService from "../../services/restaurantService";


export default function RestaurantDetailsPage() {


  const { id } = useParams();


  const [restaurant,setRestaurant] = useState(null);

  const [loading,setLoading] = useState(true);



  useEffect(()=>{


    const loadRestaurant = async()=>{


      try{


        const response =
          await restaurantService.getRestaurantById(id);


        setRestaurant(
          response.restaurant
        );


      }catch(error){


        console.error(error);


      }finally{


        setLoading(false);


      }


    };


    loadRestaurant();


  },[id]);




  if(loading){


    return (

      <div className="min-h-screen bg-slate-950 flex items-center justify-center">

        <p className="text-white text-xl">
          Loading Restaurant...
        </p>

      </div>

    );


  }




  if(!restaurant){


    return (

      <div className="min-h-screen bg-slate-950 flex items-center justify-center">

        <p className="text-white">
          Restaurant not found
        </p>

      </div>

    );

  }




  return (

    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-orange-600 px-5 py-8">


      <motion.div

        initial={{
          opacity:0,
          y:40
        }}

        animate={{
          opacity:1,
          y:0
        }}

        className="mx-auto max-w-4xl rounded-3xl border border-white/20 bg-white/10 backdrop-blur-xl p-6 shadow-2xl"

      >


        <div className="h-56 rounded-3xl bg-white/10 flex items-center justify-center text-7xl">

          🍽️

        </div>



        <h1 className="mt-6 text-3xl font-bold text-white">

          {restaurant.name}

        </h1>



        <p className="mt-2 text-white/70">

          {restaurant.description}

        </p>




        <div className="mt-5 space-y-2 text-white">


          <p>
            ⭐ {restaurant.rating}
          </p>


          <p>
            🚚 {restaurant.deliveryTime}
          </p>


          <p>
            📍 {restaurant.location}
          </p>


          <p>
            🍴 {restaurant.category}
          </p>


        </div>




        <div className="mt-8 grid grid-cols-3 gap-3">


          {
            ["Popular","Menu","Reviews"].map((tab)=>(

              <button

                key={tab}

                className="rounded-xl bg-white/10 py-3 text-white transition hover:bg-orange-500"

              >

                {tab}

              </button>

            ))
          }


        </div>



        <div className="mt-8">


          <h2 className="text-2xl font-bold text-white">

            Food Menu 🍔

          </h2>



          <div className="mt-5 rounded-2xl bg-white/10 p-5 text-white">


            <h3 className="text-xl font-semibold">
              Coming Soon
            </h3>


            <p className="text-white/70">
              Food items will appear here.
            </p>


          </div>


        </div>


      </motion.div>


    </div>

  );

}
