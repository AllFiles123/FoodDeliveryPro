import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useParams } from "react-router-dom";

import restaurantService from "../../services/restaurantService";
import RestaurantHeader from "./components/RestaurantHeader";
import FoodCard from "./components/FoodCard";
import FlyToCartAnimation from "../../components/animations/FlyToCartAnimation";

import { useCart } from "../../context/CartContext";
import { useToast } from "../../context/ToastContext";

export default function RestaurantDetailsPage() {

  const { id } = useParams();

  const {
    addToCart
  } = useCart();

  const {
    showToast
  } = useToast();

  const [restaurant,setRestaurant] = useState(null);

  const [foods,setFoods] = useState([]);

  const [loading,setLoading] = useState(true);

  const [flyAnimation,setFlyAnimation] = useState(false);

  const [flyImage,setFlyImage] = useState("");

  const [flyStart,setFlyStart] = useState({
    x:0,
    y:0
  });

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

  const handleAddToCart = (food,event)=>{

    if(event){

      const rect =
        event.currentTarget.getBoundingClientRect();

      setFlyImage(food.image || "");

      setFlyStart({

        x:rect.left + rect.width/2,

        y:rect.top + rect.height/2

      });

      setFlyAnimation(true);

      setTimeout(()=>{

        setFlyAnimation(false);

      },1000);

    }

    addToCart({

      id:food.id,

      name:food.name,

      price:food.price,

      image:food.image || "",

      description:food.description,

      rating:food.rating,

      restaurantId:id,

      restaurantName:restaurant?.name

    });

    showToast(
      "Added to cart 🛒",
      "success"
    );

  };

  if(loading){

    return(

      <div className="min-h-screen bg-gray-50 flex items-center justify-center">

        <motion.p

          animate={{
            opacity:[0.3,1,0.3]
          }}

          transition={{
            repeat:Infinity,
            duration:1
          }}

          className="text-primary text-xl font-semibold"

        >

          Loading Restaurant...

        </motion.p>

      </div>

    );

  }

  if(!restaurant){

    return(

      <div className="min-h-screen bg-gray-50 flex items-center justify-center">

        <p className="text-slate-800">

          Restaurant not found

        </p>

      </div>

    );

  }

  return(

    <div className="min-h-screen bg-gray-50 px-5 py-8">

      <motion.div

        initial={{
          opacity:0,
          y:40
        }}

        animate={{
          opacity:1,
          y:0
        }}

        transition={{
          duration:0.5
        }}

        className="mx-auto max-w-5xl"

      >

        <RestaurantHeader
          restaurant={restaurant}
        />

        <h2 className="mt-10 text-2xl font-bold text-slate-800">

          Food Menu 🍔

        </h2>

        <div className="mt-6 grid gap-6 sm:grid-cols-2">

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

              >

                <FoodCard

                  food={food}

                  onAdd={(food,event)=>
                    handleAddToCart(food,event)
                  }

                />

              </motion.div>

            ))
          }

        </div>

      </motion.div>

      <FlyToCartAnimation

        show={flyAnimation}

        image={flyImage}

        start={flyStart}

      />

    </div>

  );

}
