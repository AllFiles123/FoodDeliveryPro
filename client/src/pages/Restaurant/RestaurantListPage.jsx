import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Clock, MapPin, Star } from "lucide-react";

import restaurantService from "../../services/restaurantService";


export default function RestaurantListPage() {


  const navigate = useNavigate();


  const [restaurants,setRestaurants] = useState([]);

  const [loading,setLoading] = useState(true);




  useEffect(()=>{


    const loadRestaurants = async()=>{


      try{


        const response =
          await restaurantService.getRestaurants();


        console.log(
          "Restaurant API Response:",
          response
        );


        setRestaurants(
          response.restaurants || []
        );


      }catch(error){


        console.error(error);


      }finally{


        setLoading(false);


      }


    };


    loadRestaurants();


  },[]);







  if(loading){


    return (

      <div className="min-h-screen bg-[#FFF8F3] flex items-center justify-center">

        <motion.p

          animate={{
            opacity:[0.3,1,0.3]
          }}

          transition={{
            duration:1,
            repeat:Infinity
          }}

          className="text-xl font-bold text-orange-500"

        >

          Finding Restaurants 🍽️

        </motion.p>


      </div>

    );

  }







  return (

    <div className="min-h-screen bg-[#FFF8F3] px-5 py-8">


      <div className="mx-auto max-w-6xl">


        <motion.h1

          initial={{
            opacity:0,
            y:-30
          }}

          animate={{
            opacity:1,
            y:0
          }}

          className="text-3xl font-bold text-slate-800"

        >

          Popular Restaurants 🍴

        </motion.h1>



        <p className="mt-2 text-slate-500">

          Choose your favourite food

        </p>





        {
          restaurants.length === 0 && (

            <p className="mt-10 text-center text-slate-500">

              No restaurants available

            </p>

          )
        }






        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">


        {
          restaurants.map((restaurant,index)=>(


            <motion.div


              key={restaurant.id}


              initial={{
                opacity:0,
                y:40
              }}

              animate={{
                opacity:1,
                y:0
              }}

              transition={{
                delay:index*0.1
              }}


              whileTap={{
                scale:0.96
              }}


              onClick={()=>navigate(`/restaurants/${restaurant.id}`)}


              className="cursor-pointer overflow-hidden rounded-3xl bg-white shadow-xl border border-orange-100"

            >



              <div className="h-44 bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-7xl">

                🍽️

              </div>





              <div className="p-5">


                <h2 className="text-xl font-bold text-slate-800">

                  {restaurant.name}

                </h2>



                <p className="mt-2 line-clamp-2 text-sm text-slate-500">

                  {restaurant.description}

                </p>





                <div className="mt-5 space-y-3 text-sm text-slate-600">


                  <div className="flex items-center gap-2">

                    <Star size={16} className="text-orange-500 fill-orange-500"/>

                    {restaurant.rating}

                  </div>



                  <div className="flex items-center gap-2">

                    <Clock size={16} className="text-orange-500"/>

                    {restaurant.deliveryTime}

                  </div>



                  <div className="flex items-center gap-2">

                    <MapPin size={16} className="text-orange-500"/>

                    {restaurant.location}

                  </div>


                </div>





                <button

                  className="mt-6 w-full rounded-xl bg-orange-500 py-3 font-bold text-white"

                >

                  View Menu 🍔

                </button>


              </div>


            </motion.div>


          ))
        }


        </div>


      </div>


    </div>

  );

}
