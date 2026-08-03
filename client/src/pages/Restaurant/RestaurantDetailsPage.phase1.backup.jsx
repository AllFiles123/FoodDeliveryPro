import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useParams } from "react-router-dom";

import restaurantService from "../../services/restaurantService";


export default function RestaurantDetailsPage() {


  const { id } = useParams();


  const [restaurant,setRestaurant] = useState(null);

  const [foods,setFoods] = useState([]);

  const [loading,setLoading] = useState(true);



  useEffect(()=>{


    const loadData = async()=>{


      try{


        const restaurantResponse =
          await restaurantService.getRestaurantById(id);


        const foodResponse =
          await restaurantService.getFoodsByRestaurantId(id);



        setRestaurant(
          restaurantResponse.restaurant
        );


        setFoods(
          foodResponse.foods || []
        );



      }catch(error){

        console.error(error);

      }finally{

        setLoading(false);

      }


    };


    loadData();


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

    <div className="min-h-screen bg-[#FFF8F3] px-5 py-8">


      <motion.div

        initial={{
          opacity:0,
          y:40
        }}

        animate={{
          opacity:1,
          y:0
        }}

        className="mx-auto max-w-5xl rounded-[28px] bg-white p-6 shadow-xl border border-orange-100"

      >


        <div className="h-56 rounded-3xl bg-white/10 flex items-center justify-center text-7xl">

          🍽️

        </div>



        <h1 className="mt-6 text-3xl font-bold text-gray-900">

          {restaurant.name}

        </h1>



        <p className="mt-2 text-gray-600">

          {restaurant.description}

        </p>



        <div className="mt-5 space-y-2 text-white">

          <p>⭐ {restaurant.rating}</p>

          <p>🚚 {restaurant.deliveryTime}</p>

          <p>📍 {restaurant.location}</p>

          <p>🍴 {restaurant.category}</p>

        </div>





        <h2 className="mt-10 text-2xl font-bold text-white">

          Food Menu 🍔

        </h2>





        <div className="mt-5 grid gap-5 sm:grid-cols-2">


        {
          foods.map((food,index)=>(


            <motion.div

              key={food.id}

              initial={{
                opacity:0,
                y:30
              }}

              animate={{
                opacity:1,
                y:0
              }}

              transition={{
                delay:index*0.1
              }}


              className="rounded-3xl border border-white/20 bg-white/10 p-5 text-white backdrop-blur-xl"

            >


              <div className="h-32 rounded-2xl bg-white/10 flex items-center justify-center text-5xl">

                🍕

              </div>



              <h3 className="mt-4 text-xl font-bold">

                {food.name}

              </h3>



              <p className="mt-2 text-gray-600">

                {food.description}

              </p>



              <div className="mt-3 flex justify-between">

                <span>
                  ⭐ {food.rating}
                </span>


                <span className="font-bold">

                  ৳ {food.price}

                </span>


              </div>



              <button className="mt-4 w-full rounded-xl bg-orange-500 py-3 font-bold text-white transition hover:scale-105">

                Add To Cart 🛒

              </button>


            </motion.div>


          ))
        }


        </div>



      </motion.div>


    </div>

  );

}
