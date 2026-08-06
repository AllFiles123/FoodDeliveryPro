import { useState } from "react";
import {
  X,
  RotateCcw,
  Pizza,
  Store,
  Pill,
  CupSoda,
  Star
} from "lucide-react";
import { motion } from "framer-motion";


export default function FilterBottomSheet({
  open,
  onClose,
  onApply
}) {


  const [min,setMin] = useState(0);
  const [max,setMax] = useState(100);

  const [delivery,setDelivery] = useState("");

  const [nearMe,setNearMe] = useState(false);


  const bars = [
    20,35,15,45,30,50,25,40,18,48,
    32,22,55,38,28,45,35,18,50,30,
    25,42,20,52,35,48,28,40,22,55,
    30,45,20,38,50,25,18,46,32,55,
    28,40,22,35,48,30,20,50,38,28
  ];


  if(!open) return null;



  return (

    <div
    className="
    fixed
    inset-0
    z-50
    bg-black/40
    flex
    items-end
    "
    >


      <motion.div

      initial={{
        y:"100%"
      }}

      animate={{
        y:0
      }}

      className="
      bg-white
      w-full
      rounded-t-[32px]
      px-6
      pt-4
      pb-32
      max-h-[92vh]
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
        "
        />



        <div className="
        flex
        justify-between
        items-center
        "
        >

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
            <X size={20}/>
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
            <RotateCcw size={20}/>
          </button>


        </div>





        <section className="mt-8">


          <h3 className="
          text-lg
          font-bold
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


              <div
              key={name}
              className="text-center"
              >


                <div className="
                h-16
                rounded-2xl
                bg-gray-100
                flex
                items-center
                justify-center
                ">

                  <Icon
                  size={25}
                  strokeWidth={1.8}
                  />

                </div>


                <p className="text-sm mt-2">
                {name}
                </p>


              </div>


            ))
          }


          </div>


        </section>
        <section className="mt-8">

          <h3 className="
          text-lg
          font-bold
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
            bars.map((height,index)=>{

              const active =
              index >= Math.floor(min/2) &&
              index <= Math.floor(max/2);


              return (

                <div
                key={index}

                style={{
                  height:`${height}px`,
                  backgroundColor:
                  active
                  ?
                  "#FF5C00"
                  :
                  "#E5E7EB"
                }}

                className="
                w-[2px]
                rounded-full
                transition-all
                duration-300
                "
                />

              );

            })
          }


          </div>





          <div className="
          relative
          mt-6
          h-8
          ">


            <div className="
            absolute
            top-3
            left-0
            right-0
            h-1
            bg-gray-200
            rounded-full
            ">


              <div

              className="
              absolute
              h-1
              bg-[#FF5C00]
              rounded-full
              "

              style={{
                left:`${min}%`,
                width:`${max-min}%`
              }}

              />


            </div>



            <input

            type="range"

            min="0"

            max="100"

            value={min}

            onChange={(e)=>
              setMin(
                Math.min(
                  Number(e.target.value),
                  max-5
                )
              )
            }

            className="
            absolute
            w-full
            appearance-none
            bg-transparent
            z-20
            "

            />



            <input

            type="range"

            min="0"

            max="100"

            value={max}

            onChange={(e)=>
              setMax(
                Math.max(
                  Number(e.target.value),
                  min+5
                )
              )
            }

            className="
            absolute
            w-full
            appearance-none
            bg-transparent
            z-30
            "

            />


          </div>





          <div className="
          flex
          gap-4
          mt-5
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

              <span>
              $
              </span>


              <input
              placeholder="Min"
              className="
              bg-transparent
              outline-none
              w-full
              "
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


              <span>
              $
              </span>


              <input
              placeholder="Max"
              className="
              bg-transparent
              outline-none
              w-full
              "
              />

            </div>


          </div>


        </section>
        <section className="mt-8">


          <h3 className="
          text-lg
          font-bold
          mb-4
          ">
          Rating
          </h3>



          <div className="
          flex
          gap-3
          ">


          {
            ["5.0","4.0","3.0","2.0"].map(rate=>(

              <button

              key={rate}

              className="
              px-4
              py-2
              rounded-full
              bg-gray-100
              flex
              items-center
              gap-1
              ">

                <Star
                size={16}
                fill="#FACC15"
                className="text-yellow-400"
                />

                {rate}

              </button>

            ))
          }


          </div>


        </section>






        <section className="mt-8">


          <h3 className="
          text-lg
          font-bold
          mb-4
          ">
          Delivery Time
          </h3>


          <div className="
          flex
          gap-3
          overflow-x-auto
          ">


          {
            [
              "Under 15 min",
              "Under 30 min",
              "Under 45 min"
            ].map(item=>(


              <button

              key={item}

              onClick={()=>
                setDelivery(item)
              }

              className={`
              whitespace-nowrap
              px-5
              py-3
              rounded-full
              ${
                delivery===item
                ?
                "bg-[#FF5C00] text-white"
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







        <section className="mt-8">


          <div className="
          flex
          justify-between
          items-center
          ">


            <h3 className="
            text-lg
            font-bold
            ">
            Near Me
            </h3>



            <button

            onClick={()=>
              setNearMe(!nearMe)
            }

            className={`
            w-14
            h-8
            rounded-full
            p-1
            ${
              nearMe
              ?
              "bg-[#FF5C00]"
              :
              "bg-gray-300"
            }
            `}
            >


              <div

              className={`
              h-6
              w-6
              bg-white
              rounded-full
              transition
              ${
                nearMe
                ?
                "translate-x-6"
                :
                ""
              }
              `}
              />


            </button>


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
      z-[60]
      "

      >

      Show 2,500+ Items

      </button>



    </div>


  );

}

