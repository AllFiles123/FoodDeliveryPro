import { useEffect, useState } from "react";
import { motion } from "framer-motion";

import restaurantService from "../../services/restaurantService";



export default function RestaurantListPage() {


  const [restaurants, setRestaurants] = useState([]);

  const [loading, setLoading] = useState(true);



  useEffect(() => {


    const loadRestaurants = async () => {


      try {


        const response =
        console.log("Restaurant API Response:", response);
          await restaurantService.getRestaurants();


        setRestaurants(
          response.restaurants || []
        );


      } catch(error) {


        console.error(
          error
        );


      } finally {


        setLoading(false);


      }


    };


    loadRestaurants();


  }, []);





  if(loading){


    return (

      <div className="min-h-screen bg-slate-950 flex items-center justify-center">

        <motion.p

          animate={{
            opacity:[0.3,1,0.3],
          }}

          transition={{
            repeat:Infinity,
            duration:1,
          }}

          className="text-white text-xl"
        >
          Loading Restaurants...
        </motion.p>

      </div>

    );


  }





  return (

    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-orange-600 px-6 py-10">


      <div className="mx-auto max-w-6xl">


        <motion.h1

          initial={{
            opacity:0,
            y:-20,
          }}

          animate={{
            opacity:1,
            y:0,
          }}

          className="mb-8 text-center text-3xl font-bold text-white"
        >

          Explore Restaurants 🍽️

        </motion.h1>




        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">


          {
            restaurants.map((restaurant,index)=>(


              <motion.div

                key={restaurant.id}

                initial={{
                  opacity:0,
                  y:40,
                }}

                animate={{
                  opacity:1,
                  y:0,
                }}

                transition={{
                  delay:index*0.1,
                }}


                className="rounded-3xl border border-white/20 bg-white/10 p-5 backdrop-blur-xl shadow-2xl"

              >


                <div className="h-40 rounded-2xl bg-white/10 flex items-center justify-center text-5xl">

                  🍴

                </div>



                <h2 className="mt-5 text-xl font-bold text-white">

                  {restaurant.name}

                </h2>



                <p className="mt-2 text-sm text-white/70">

                  {restaurant.description}

                </p>



                <div className="mt-4 space-y-2 text-white/80">


                  <p>
                    ⭐ {restaurant.rating}
                  </p>


                  <p>
                    🚚 {restaurant.deliveryTime}
                  </p>


                  <p>
                    📍 {restaurant.location}
                  </p>


                </div>



              </motion.div>


            ))

          }


        </div>


      </div>


    </div>

  );

}
