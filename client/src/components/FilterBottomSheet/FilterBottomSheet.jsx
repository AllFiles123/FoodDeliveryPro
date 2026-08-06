import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  X,
  RotateCcw,
  Pizza,
  Store,
  Pill,
  CupSoda,
  Star,
} from "lucide-react";

export default function FilterBottomSheet({
  open,
  onClose,
  filters,
  setFilters,
  onApply,
}) {

  const [left, setLeft] = useState(0);
  const [right, setRight] = useState(100);
  const [nearMe, setNearMe] = useState(false);

  const bars = useMemo(
    () =>
      Array.from({ length: 50 }, (_, i) => ({
        id: i,
        height: 12 + ((i * 17) % 40),
      })),
    []
  );

  const categories = [
    {
      title: "Meals",
      icon: Pizza,
    },
    {
      title: "Shops",
      icon: Store,
    },
    {
      title: "Drugs",
      icon: Pill,
    },
    {
      title: "Drinks",
      icon: CupSoda,
    },
  ];

  if (!open) return null;

  return (
    <AnimatePresence>

      <motion.div
        className="fixed inset-0 z-[999] bg-black/40"
        initial={{ opacity:0 }}
        animate={{ opacity:1 }}
        exit={{ opacity:0 }}
      >

        <motion.div
          initial={{ y:"100%" }}
          animate={{ y:0 }}
          exit={{ y:"100%" }}
          transition={{ duration:.30 }}
          className="absolute bottom-0 left-0 right-0 max-h-[88vh] overflow-y-auto rounded-t-[32px] bg-white px-6 pt-4 pb-40"
        >

          {/* Drag Handle */}

          <div className="mb-5 flex justify-center">

            <div className="h-1.5 w-14 rounded-full bg-border"/>

          </div>

          {/* Header */}

          <div className="flex items-center justify-between">

            <button
              onClick={onClose}
              className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100"
            >
              <X size={22}/>
            </button>

            <h2 className="text-2xl font-bold">
              Filters
            </h2>

            <button
              onClick={()=>{
                setLeft(0);
                setRight(100);
                setNearMe(false);
              }}
              className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100"
            >
              <RotateCcw size={20}/>
            </button>

          </div>

          {/* Categories */}

          <section className="mt-10">

            <h3 className="mb-6 text-[20px] font-bold text-gray-900">
              Categories
            </h3>

            <div className="grid grid-cols-4 gap-4">

              {[
                {title:"Meals",icon:Pizza},
                {title:"Shops",icon:Store},
                {title:"Drugs",icon:Pill},
                {title:"Drinks",icon:CupSoda},
              ].map((item)=>{

                const Icon=item.icon;

                return(

                  <button
                    key={item.title}
                    className="group flex flex-col items-center"
                  >

                    <div
                      className="
                      h-[78px]
                      w-[78px]
                      rounded-[22px]
                      bg-gray-50
                      flex
                      items-center
                      justify-center
                      transition-all
                      duration-200
                      group-active:scale-95
                      "
                    >

                      <Icon
                        size={30}
                        strokeWidth={1.8}
                        className="text-gray-900"
                      />

                    </div>

                    <span
                      className="
                      mt-3
                      text-[14px]
                      font-semibold
                      text-gray-900
                      "
                    >

                      {item.title}

                    </span>

                  </button>

                );

              })}

            </div>

          </section>

<section className="mt-10">

            <h3 className="mb-6 text-xl font-bold">

              Price Range

            </h3>

            <div className="mt-2 flex h-[58px] items-end justify-between">

              {bars.map((bar,index)=>{

                const active=
                  index>=Math.round(left/2) &&
                  index<=Math.round(right/2);

                return(

                  <div
                    key={bar.id}
                    className="w-[2px] rounded-full transition-colors duration-200"
                    style={{
                      height:bar.height,
                      backgroundColor:active?"var(--color-primary)":"var(--color-border)"
                    }}
                  />

                );

              })}

            </div>
            {/* Dual Range Slider */}

            <div className="relative mt-8 h-10">

              {/* Gray Track */}

              <div className="absolute top-[18px] h-[3px] w-full rounded-full bg-border"/>

              {/* Orange Track */}

              <div
                className="absolute top-4 h-1 rounded-full bg-[var(--color-primary)] shadow-sm"
                style={{
                  left:`${left}%`,
                  width:`${right-left}%`,
                }}
              />

              {/* Left Slider */}

              <input
                type="range"
                min="0"
                max="100"
                value={left}
                onChange={(e)=>{

                  const value=Number(e.target.value);

                  if(value<right){

                    setLeft(value);

                  }

                }}
                className="
                absolute
                w-full
                appearance-none
                bg-transparent
                pointer-events-none
                [&::-webkit-slider-thumb]:pointer-events-auto
                [&::-webkit-slider-thumb]:appearance-none
                [&::-webkit-slider-thumb]:h-7
                [&::-webkit-slider-thumb]:w-7
                [&::-webkit-slider-thumb]:rounded-full
                [&::-webkit-slider-thumb]:bg-white
                [&::-webkit-slider-thumb]:border-[3px]
                [&::-webkit-slider-thumb]:border-[var(--color-primary)]
                [&::-webkit-slider-thumb]:shadow-xl
                "
              />

              {/* Right Slider */}

              <input
                type="range"
                min="0"
                max="100"
                value={right}
                onChange={(e)=>{

                  const value=Number(e.target.value);

                  if(value>left){

                    setRight(value);

                  }

                }}
                className="
                absolute
                w-full
                appearance-none
                bg-transparent
                pointer-events-none
                [&::-webkit-slider-thumb]:pointer-events-auto
                [&::-webkit-slider-thumb]:appearance-none
                [&::-webkit-slider-thumb]:h-7
                [&::-webkit-slider-thumb]:w-7
                [&::-webkit-slider-thumb]:rounded-full
                [&::-webkit-slider-thumb]:bg-white
                [&::-webkit-slider-thumb]:border-[3px]
                [&::-webkit-slider-thumb]:border-[var(--color-primary)]
                [&::-webkit-slider-thumb]:shadow-xl
                "
              />

            </div>

            {/* Min Max */}

            <div className="mt-8 grid grid-cols-2 gap-4">

              <div className="flex items-center rounded-xl bg-gray-100 px-4 h-16">

                <span className="mr-3 font-bold text-gray-500">$</span>

                <input
                  readOnly
                  value={Math.round(left*10)}
                  className="w-full bg-transparent outline-none text-lg"
                />

              </div>

              <div className="flex items-center rounded-xl bg-gray-100 px-4 h-16">

                <span className="mr-3 font-bold text-gray-500">$</span>

                <input
                  readOnly
                  value={Math.round(right*10)}
                  className="w-full bg-transparent outline-none text-lg"
                />

              </div>

            </div>

          </section>
          {/* Rating */}

          <section className="mt-10">

            <h3 className="mb-5 text-xl font-bold">
              Rating
            </h3>

            <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-1">

              {[5,4,3,2].map((item)=>(

                <button
                  key={item}
                  className="flex h-12 items-center gap-2 rounded-full bg-gray-100 px-5 transition active:scale-95"
                >

                  <Star
                    size={18}
                    className="fill-yellow-400 text-yellow-400"
                  />

                  <span className="font-semibold">

                    {item}.0

                  </span>

                </button>

              ))}

            </div>

          </section>


          {/* Delivery Time */}

          <section className="mt-10">

            <h3 className="mb-5 text-xl font-bold">
              Delivery Time
            </h3>

            <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-1">

              {[
                "Under 15 min",
                "Under 30 min",
                "Under 45 min",
                "Under 60 min"
              ].map((item)=>(

                <button
                  key={item}
                  className="
                  whitespace-nowrap
                  rounded-full
                  bg-gray-100
                  px-5
                  py-3
                  font-medium
                  transition
                  active:scale-95
                  "
                >

                  {item}

                </button>

              ))}

            </div>

          </section>


          {/* Near Me */}

          <section className="mt-10">

            <div className="flex items-center justify-between">

              <div>

                <h3 className="text-xl font-bold">

                  Near Me

                </h3>

                <p className="mt-1 text-sm text-gray-500">

                  Show nearby restaurants

                </p>

              </div>

              <button
                onClick={()=>setNearMe(!nearMe)}
                className={`
                relative
                h-8
                w-14
                shadow-inner
                rounded-full
                transition
                ${nearMe ? "bg-[var(--color-primary)] shadow-sm" : "bg-border"}
                `}
              >

                <div
                  className={`
                  absolute
                  top-1
                  h-6
                  w-6
                  rounded-full
                  bg-white
                  shadow
                  transition-all
                  ${nearMe ? "left-7" : "left-1"}
                  `}
                />

              </button>

            </div>

          </section>


          {/* Bottom Button */}

          <div className="fixed bottom-6 left-5 right-5 z-[1000]">

            <button
              onClick={onApply}
              className="
              h-[58px]
              w-full
              rounded-full
              bg-[var(--color-primary)]
              shadow-2xl
              text-lg
              font-bold
              text-white
              shadow-xl
              active:scale-[0.98]
              "
            >

              Show 2,500+ Items

            </button>

          </div>

        </motion.div>

      </motion.div>

    </AnimatePresence>

  );

}
