import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useParams } from "react-router-dom";

import restaurantService from "../../services/restaurantService";
import RestaurantHeader from "./components/RestaurantHeader";
import FoodCard from "./components/FoodCard";


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

        <p className="text-slate-800">
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


        <RestaurantHeader
          restaurant={restaurant}
        />



        <h2 className="mt-10 text-2xl font-bold text-slate-800">

          Food Menu 🍔

        </h2>





        <div className="mt-5 grid gap-5 sm:grid-cols-2">


        {
          foods.map((food)=>(
            <FoodCard
              key={food.id}
              food={food}
              onAdd={(item)=>{
                console.log("Add To Cart:", item);
              }}
            />
          ))
        }


        </div>



      </motion.div>


    </div>

  );

}
