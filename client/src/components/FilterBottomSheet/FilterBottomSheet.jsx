import { useState } from "react";
import {
  X,
  RotateCcw,
  Pizza,
  Store,
  Pill,
  CupSoda,
  Star,
  DollarSign
} from "lucide-react";
import { motion } from "framer-motion";


export default function FilterBottomSheet({
  open,
  onClose,
  onApply
}) {

  const [min,setMin] = useState(20);
  const [max,setMax] = useState(80);


  const bars = [
    22,35,15,45,30,50,28,40,18,48,
    32,20,55,38,25,45,30,15,50,35,
    28,42,18,52,33,45,25,40,20,55,
    30,48,22,35,50,28,18,45,32,55,
    25,40,20,35,48,30,18,50,38,28
  ];


  if(!open) return null;


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

      initial={{y:"100%"}}
      animate={{y:0}}

      className="
      bg-white
      w-full
      rounded-t-[32px]
      px-6
      pt-4
      pb-32
      max-h-[90vh]
      overflow-y-auto
      "

      >


        <div className="
        w-12
        h-1.5
        bg-gray-300
        rounded-full
        mx-auto
        mb-6
        "/>


        <div className="
        flex
        justify-between
        items-center
        ">

          <button
          onClick={onClose}
          className="
          w-11
          h-11
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
          className="
          w-11
          h-11
          rounded-full
          bg-gray-100
          flex
          items-center
          justify-center
          "
          >
            <RotateCcw/>
          </button>


        </div>



        {/* Categories */}

        <section className="mt-8">

          <h3 className="
          font-bold
          text-lg
          mb-4
          ">
          Categories
          </h3>


          <div className="
          grid
          grid-cols-4
          gap-3
          ">

          {
            [
              [Pizza,"Meals"],
              [Store,"Shops"],
              [Pill,"Drugs"],
              [CupSoda,"Drinks"]
            ].map(([Icon,name])=>(

              <div key={name}
              className="text-center">

                <div className="
                bg-gray-100
                rounded-2xl
                h-16
                flex
                items-center
                justify-center
                ">

                  <Icon size={26}/>

                </div>

                <p className="text-sm mt-2">
                  {name}
                </p>

              </div>

            ))
          }

          </div>

        </section>





        {/* Price */}

        <section className="mt-8">

        <h3 className="
        font-bold
        text-lg
        mb-4
        ">
        Price Range
        </h3>



        <div className="
        h-16
        flex
        items-end
        gap-[2px]
        ">


        {
          bars.map((height,index)=>(

            <div

            key={index}

            style={{
              height:`${height}px`,
              backgroundColor:
              index >= min/2 &&
              index <= max/2
              ?
              "#FF5C00"
              :
              "#E5E7EB"
            }}

            className="
            w-[3px]
            rounded-full
            transition-all
            duration-300
            "

            />

          ))
        }


        </div>



        <div className="
        mt-5
        relative
        h-8
        ">


          <input
          type="range"
          min="0"
          max="100"
          value={min}
          onChange={(e)=>
          setMin(Number(e.target.value))
          }
          className="
          absolute
          w-full
          accent-[#FF5C00]
          "
          />


          <input
          type="range"
          min="0"
          max="100"
          value={max}
          onChange={(e)=>
          setMax(Number(e.target.value))
          }
          className="
          absolute
          w-full
          accent-[#FF5C00]
          "
          />


        </div>



        <div className="
        flex
        gap-4
        mt-4
        ">


          <div className="
          flex-1
          bg-gray-100
          rounded-xl
          px-4
          py-3
          flex
          gap-2
          items-center
          ">

            <DollarSign size={18}/>

            <input
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
          gap-2
          items-center
          ">

            <DollarSign size={18}/>

            <input
            placeholder="Max"
            className="bg-transparent outline-none w-full"
            />

          </div>


        </div>


        </section>






        {/* Rating */}

        <section className="mt-8">

        <h3 className="
        font-bold
        text-lg
        mb-4
        ">
        Rating
        </h3>


        <div className="flex gap-3">

        {
          ["5.0","4.0","3.0","2.0"].map(rate=>(

            <button
            key={rate}
            className="
            rounded-full
            border
            px-4
            py-2
            flex
            items-center
            gap-1
            "
            >

              <Star
              size={16}
              fill="yellow"
              className="text-yellow-400"
              />

              {rate}

            </button>

          ))
        }

        </div>

        </section>


      </motion.div>



      <button

      onClick={onApply}

      className="
      fixed
      bottom-6
      left-6
      right-6
      bg-[#FF5C00]
      text-white
      font-bold
      py-4
      rounded-full
      "

      >
        Show 2,500+ Items
      </button>



    </div>

  );

}
