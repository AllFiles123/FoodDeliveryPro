import { motion } from "framer-motion";
import {
  X,
  Trash2,
  Pizza,
  Grape,
  Pill,
  CupSoda,
  Star,
  DollarSign,
  MapPin
} from "lucide-react";
import { useState } from "react";


export default function FilterBottomSheet({
  open,
  onClose,
  filters,
  setFilters,
  onApply
}) {

  const [min,setMin] = useState(filters?.minPrice || 0);
  const [max,setMax] = useState(filters?.maxPrice || 1000);
  const [nearMe,setNearMe] = useState(false);
  const [delivery,setDelivery] = useState("");


  if(!open) return null;


  const categories = [
    {
      name:"Meals",
      icon:<Pizza size={28}/>
    },
    {
      name:"Shops",
      icon:<Grape size={28}/>
    },
    {
      name:"Drugs",
      icon:<Pill size={28}/>
    },
    {
      name:"Drinks",
      icon:<CupSoda size={28}/>
    }
  ];


  const ratings=[5,4,3,2];


  const bars=[
    35,60,45,85,55,95,70,40,75,50,90,65
  ];


  const priceChange=(value,type)=>{

    if(type==="min"){
      setMin(value);
    }

    if(type==="max"){
      setMax(value);
    }

    setFilters({
      ...filters,
      minPrice:type==="min"?value:min,
      maxPrice:type==="max"?value:max
    });

  };



  const applyFilter=()=>{

    setFilters({
      ...filters,
      minPrice:min,
      maxPrice:max,
      deliveryTime:delivery,
      nearMe
    });

    onApply();

  };



  return (

    <div className="
    fixed
    inset-0
    z-50
    bg-black/40
    flex
    items-end
    ">


      <motion.div

      initial={{
        y:"100%"
      }}

      animate={{
        y:0
      }}

      transition={{
        type:"spring",
        damping:25
      }}

      className="
      w-full
      bg-white
      rounded-t-[32px]
      px-6
      pt-4
      pb-8
      max-h-[90vh]
      overflow-y-auto
      space-y-6
      "

      >


        <div className="
        w-12
        h-1.5
        bg-gray-300
        rounded-full
        mx-auto
        "/>



        <div className="
        flex
        items-center
        justify-between
        ">


          <button
          onClick={onClose}
          className="
          h-11
          w-11
          rounded-full
          bg-gray-100
          flex
          items-center
          justify-center
          "
          >

            <X/>

          </button>



          <h2 className="
          text-xl
          font-bold
          ">
            Filters
          </h2>



          <button

          onClick={()=>{
            setMin(0);
            setMax(1000);
          }}

          className="
          h-11
          w-11
          rounded-full
          bg-gray-100
          flex
          items-center
          justify-center
          "

          >

            <Trash2/>

          </button>


        </div>





        <section className="space-y-3">

          <h3 className="
          text-lg
          font-bold
          ">
            Categories
          </h3>


          <div className="
          grid
          grid-cols-4
          gap-3
          ">


          {
            categories.map((item,index)=>(

              <button

              key={index}

              className="
              rounded-2xl
              bg-gray-50
              p-3
              flex
              flex-col
              items-center
              gap-2
              "

              >

                <div className="
                h-12
                w-12
                rounded-xl
                bg-gray-200
                flex
                items-center
                justify-center
                text-orange-500
                ">

                  {item.icon}

                </div>


                <span className="
                text-xs
                font-semibold
                ">

                {item.name}

                </span>


              </button>


            ))
          }


          </div>


        </section>







        <section className="space-y-4">


          <h3 className="
          text-lg
          font-bold
          ">
            Price Range
          </h3>



          <div className="
          flex
          items-end
          gap-2
          h-28
          ">

          {
            bars.map((b,i)=>(

              <div
              key={i}
              className="
              flex-1
              bg-orange-500
              rounded-t-lg
              "
              style={{
                height:`${Math.max(20,b*(max-min)/1000)}%`
              }}
              />

            ))
          }

          </div>




          <input

          type="range"

          min="0"

          max="1000"

          value={min}

          onChange={(e)=>priceChange(Number(e.target.value),"min")}

          className="
          w-full
          accent-orange-500
          "

          />



          <input

          type="range"

          min="0"

          max="1000"

          value={max}

          onChange={(e)=>priceChange(Number(e.target.value),"max")}

          className="
          w-full
          accent-orange-500
          "

          />




          <div className="
          flex
          gap-3
          ">


            <div className="
            flex-1
            bg-gray-100
            rounded-xl
            px-4
            py-3
            flex
            items-center
            gap-2
            ">

              <DollarSign size={18}/>

              <input
              value={min}
              placeholder="Min"
              className="bg-transparent outline-none w-full"
              />

            </div>



            <div className="
            flex-1
            bg-gray-100
            rounded-xl
            px-4
            py-3
            flex
            items-center
            gap-2
            ">

              <DollarSign size={18}/>

              <input
              value={max}
              placeholder="Max"
              className="bg-transparent outline-none w-full"
              />

            </div>


          </div>


        </section>







        <section className="space-y-3">


        <h3 className="
        text-lg
        font-bold
        ">
        Rating
        </h3>


        <div className="
        flex
        gap-3
        ">


        {
          ratings.map(r=>(

            <button
            key={r}
            className="
            px-4
            py-2
            rounded-full
            bg-gray-100
            flex
            items-center
            gap-1
            "
            >

              <Star
              size={16}
              fill="gold"
              className="text-yellow-400"
              />

              {r}.0


            </button>

          ))
        }


        </div>


        </section>








        <section className="space-y-3">


        <h3 className="
        text-lg
        font-bold
        ">
        Delivery Time
        </h3>


        <div className="
        flex
        gap-3
        overflow-x-auto
        ">


        {
          ["Under 15 min","Under 30 min","Under 45 min"]
          .map(item=>(

            <button

            onClick={()=>setDelivery(item)}

            key={item}

            className={`
            px-5
            py-3
            rounded-full
            whitespace-nowrap
            ${
              delivery===item
              ?
              "bg-orange-500 text-white"
              :
              "bg-gray-100"
            }
            `}

            >

            {item}

            </button>


          ))
        }


        </div>


        </section>








        <section>

        <div className="
        flex
        items-center
        justify-between
        ">

          <div className="
          flex
          items-center
          gap-2
          font-bold
          ">

            <MapPin size={20}/>

            Near Me

          </div>



          <button

          onClick={()=>setNearMe(!nearMe)}

          className={`
          w-14
          h-7
          rounded-full
          p-1
          ${
            nearMe
            ?
            "bg-orange-500"
            :
            "bg-gray-300"
          }
          `}

          >

            <div className={`
            h-5
            w-5
            bg-white
            rounded-full
            transition
            ${
              nearMe
              ?
              "translate-x-7"
              :
              ""
            }
            `}/>


          </button>


        </div>


        </section>






        <button

        onClick={applyFilter}

        className="
        w-full
        bg-orange-500
        text-white
        py-4
        rounded-full
        font-bold
        text-lg
        "

        >

        Show 2,500+ Items

        </button>



      </motion.div>


    </div>

  );

}
