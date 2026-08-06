import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Search, MapPin, Star, SlidersHorizontal } from "lucide-react";
import FilterBottomSheet from "../../components/FilterBottomSheet/FilterBottomSheet";
import { useNavigate } from "react-router-dom";

import restaurantService from "../../services/restaurantService";


export default function HomePage() {


  const navigate = useNavigate();


  const categories = [
    { name:"Pizza", emoji:"🍕" },
    { name:"Burger", emoji:"🍔" },
    { name:"Chicken", emoji:"🍗" },
    { name:"Dessert", emoji:"🍰" },
    { name:"Drinks", emoji:"🥤" },
  ];



  const [restaurants,setRestaurants] = useState([]);

  const [showFilter,setShowFilter] = useState(false);

  const [filters,setFilters] = useState({
    category:"",
    rating:0,
    minPrice:"",
    maxPrice:"",
    deliveryTime:""
  });




  useEffect(()=>{


    const loadRestaurants = async()=>{


      try{


        const response =
          await restaurantService.getRestaurants();


        setRestaurants(
          response.restaurants?.slice(0,3) || []
        );


      }catch(error){


        console.error(error);


      }


    };


    loadRestaurants();


  },[]);







  const filteredRestaurants = restaurants.filter((item)=>{

    if(filters.rating && Number(item.rating) < Number(filters.rating))
      return false;

    if(filters.category && item.category !== filters.category)
      return false;

    if(filters.minPrice && Number(item.price || 0) < Number(filters.minPrice))
      return false;

    if(filters.maxPrice && Number(item.price || 0) > Number(filters.maxPrice))
      return false;

    return true;

  });


  return (

    <div className="min-h-screen bg-white px-5 py-6">



      <motion.div

        initial={{
          opacity:0,
          y:-20
        }}

        animate={{
          opacity:1,
          y:0
        }}

        className="flex items-center justify-between"

      >

        <div>

          <p className="text-sm text-gray-500">
            Deliver to
          </p>


          <div className="flex items-center gap-1">

            <MapPin
              size={18}
              className="text-orange-500"
            />

            <h2 className="font-bold">
              Your Location
            </h2>

          </div>

        </div>



        <div className="h-12 w-12 rounded-full bg-orange-100 flex items-center justify-center">

          👤

        </div>


      </motion.div>






      <motion.div

        initial={{
          opacity:0,
          scale:0.9
        }}

        animate={{
          opacity:1,
          scale:1
        }}

        className="mt-8 rounded-3xl bg-orange-500 p-6 text-white"

      >

        <h1 className="text-3xl font-bold">

          Delicious Food
          <br/>
          Delivered Fast

        </h1>


        <button

          onClick={()=>navigate("/restaurants")}

          className="mt-5 rounded-full bg-white px-6 py-3 font-semibold text-orange-500"

        >

          Order Now

        </button>


      </motion.div>







      <div className="mt-6 flex items-center gap-3">

        <div className="flex-1 flex items-center gap-3 rounded-2xl bg-gray-100 px-4 py-3">

          <Search size={22} className="text-gray-500"/>

          <input
            placeholder="Search food or restaurant..."
            className="w-full bg-transparent outline-none"
          />

        </div>


        <button
          onClick={()=>setShowFilter(true)}
          className="
          h-12
          w-12
          rounded-2xl
          bg-orange-500
          text-white
          flex
          items-center
          justify-center
          shadow-md
          "
        >
          <SlidersHorizontal size={22}/>
        </button>

      </div>







      <section className="mt-8">


        <h2 className="text-xl font-bold">

          Categories

        </h2>



        <div className="mt-4 flex gap-4 overflow-x-auto">


        {
          categories.map((item,index)=>(


            <motion.div

              key={index}

              whileTap={{
                scale:0.9
              }}

              className="min-w-[90px] rounded-2xl bg-orange-50 p-4 text-center"

            >

              <div className="text-3xl">
                {item.emoji}
              </div>


              <p className="text-sm font-semibold">

                {item.name}

              </p>


            </motion.div>


          ))
        }


        </div>


      </section>









      <section className="mt-8">


        <div className="flex justify-between">


          <h2 className="text-xl font-bold">

            Popular Restaurants

          </h2>


          <button

            onClick={()=>navigate("/restaurants")}

            className="text-orange-500 font-semibold"

          >

            See All

          </button>


        </div>





        <div className="mt-5 space-y-5">


        {
          restaurants.map((restaurant)=>(


            <motion.div

              key={restaurant.id}

              whileTap={{
                scale:0.97
              }}

              onClick={()=>navigate(`/restaurants/${restaurant.id}`)}

              className="cursor-pointer overflow-hidden rounded-3xl border border-gray-100 shadow-lg"

            >


              <div className="h-48 bg-gradient-to-br from-orange-300 to-orange-500 flex items-center justify-center text-7xl">

                🍽️

              </div>




              <div className="p-4">


                <h3 className="text-lg font-bold">

                  {restaurant.name}

                </h3>


                <div className="mt-2 flex gap-4 text-sm">


                  <span className="flex items-center gap-1">

                    <Star size={16} className="fill-orange-400 text-orange-400"/>

                    {restaurant.rating}

                  </span>


                  <span>
                    🚴 {restaurant.deliveryTime}
                  </span>


                </div>


              </div>


            </motion.div>


          ))
        }


        </div>


      </section>




    </div>


    

  );

}
