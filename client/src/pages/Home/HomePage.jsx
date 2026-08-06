import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Search, MapPin, Star, SlidersHorizontal, Pizza, Hamburger, Drumstick, IceCreamBowl, CupSoda } from "lucide-react";
import FilterBottomSheet from "../../components/FilterBottomSheet/FilterBottomSheet";
import { useNavigate } from "react-router-dom";

import restaurantService from "../../services/restaurantService";


export default function HomePage() {


  const navigate = useNavigate();


  
const categories = [
  { name:"Pizza", icon:Pizza },
  { name:"Burger", icon:Beef },
  { name:"Chicken", icon:Beef },
  { name:"Dessert", icon:IceCreamCone },
  { name:"Drinks", icon:Coffee },
];




  const [restaurants,setRestaurants] = useState([]);

  const [showFilter,setShowFilter] = useState(false);

  useEffect(()=>{
    document.body.style.overflow = showFilter ? "hidden" : "auto";

    if(showFilter){
      document.body.classList.add("filter-open");
    }else{
      document.body.classList.remove("filter-open");
    }

  },[showFilter]);

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

    <div className="min-h-screen bg-background px-5 py-6">



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

          <p className="text-sm text-textSecondary">
            Deliver to
          </p>


          <div className="flex items-center gap-1">

            <MapPin
              size={18}
              className="text-primary"
            />

            <h2 className="font-bold">
              Your Location
            </h2>

          </div>

        </div>



        <div className="h-12 w-12 rounded-full bg-surface flex items-center justify-center">

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

        className="mt-8 rounded-3xl bg-primary p-6 text-white"

      >

        <h1 className="text-3xl font-bold">

          Delicious Food
          <br/>
          Delivered Fast

        </h1>


        <button

          onClick={()=>navigate("/restaurants")}

          className="mt-5 rounded-full bg-background px-6 py-3 font-semibold text-primary"

        >

          Order Now

        </button>


      </motion.div>







      <div className="mt-6 flex items-center gap-3">

        <div className="flex-1 flex items-center gap-3 rounded-2xl bg-surface px-4 py-3">

          <Search size={22} className="text-textSecondary"/>

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
          bg-primary
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


            <motion.button

              key={index}

              whileTap={{scale:.95}}

              className="
              min-w-[92px]
              rounded-3xl
              bg-background
              border
              border-border
              shadow-soft
              p-4
              flex
              flex-col
              items-center
              justify-center
              "

            >

              <div
                className="
                flex
                h-12
                w-12
                items-center
                justify-center
                rounded-2xl
                bg-surface
                "
              >

                <item.icon
                  size={24}
                  className="text-primary"
                  strokeWidth={2}
                />

              </div>

              <p
                className="
                mt-3
                text-sm
                font-semibold
                text-text
                "
              >

                {item.name}

              </p>

            </motion.button>


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

            className="text-primary font-semibold"

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

              className="cursor-pointer overflow-hidden rounded-3xl border border-border shadow-lg"

            >


              <div className="h-48 bg-gradient-to-br from-primary to-primary flex items-center justify-center text-7xl">

                🍽️

              </div>




              <div className="p-4">


                <h3 className="text-lg font-bold">

                  {restaurant.name}

                </h3>


                <div className="mt-2 flex gap-4 text-sm">


                  <span className="flex items-center gap-1">

                    <Star size={16} className="fill-primary text-primary"/>

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





      <FilterBottomSheet
        open={showFilter}
        onClose={()=>setShowFilter(false)}
        filters={filters}
        setFilters={setFilters}
        onApply={()=>setShowFilter(false)}
      />


    </div>


    

  );

}
