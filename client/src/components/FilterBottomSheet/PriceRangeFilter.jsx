import { useState } from "react";
import { DollarSign } from "lucide-react";

export default function PriceRangeFilter({ onApply }) {

  const [min,setMin] = useState(20);
  const [max,setMax] = useState(75);

  const heights = [
    20,35,45,25,60,75,40,90,55,30,
    70,85,45,65,95,55,35,80,60,40,
    25,50,75,90,45,65,85,55,30,70,
    95,60,40,80,50,35,75,90,65,45,
    30,55,85,70,40,95,60,35,80,50
  ];

  return (
    <div className="min-h-screen bg-white px-6 pb-28">

      <h2 className="text-lg font-bold mb-5">
        Price Range
      </h2>

      <div className="h-32 flex items-end gap-[2px] mb-6">
        {
          heights.map((h,i)=>{

            const active =
              i >= Math.floor(min/2) &&
              i <= Math.floor(max/2);

            return (
              <div
                key={i}
                className={`
                w-[3px]
                rounded-t
                transition-all
                duration-300
                ${active ? "bg-[var(--color-primary)]" : "bg-border"}
                `}
                style={{
                  height:`${h}%`
                }}
              />
            )
          })
        }
      </div>


      <div className="relative h-8 mb-6">

        <div className="
        absolute
        top-3
        w-full
        h-2
        bg-border
        rounded-full
        ">

          <div
          className="
          absolute
          h-2
          bg-[var(--color-primary)]
          rounded-full
          "
          style={{
            left:`${min}%`,
            right:`${100-max}%`
          }}
          />

        </div>


        <input
        type="range"
        min="0"
        max="100"
        value={min}
        onChange={(e)=>setMin(Number(e.target.value))}
        className="absolute w-full accent-[var(--color-primary)]"
        />


        <input
        type="range"
        min="0"
        max="100"
        value={max}
        onChange={(e)=>setMax(Number(e.target.value))}
        className="absolute w-full accent-[var(--color-primary)]"
        />

      </div>



      <div className="flex gap-4">

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
          onChange={(e)=>setMin(Number(e.target.value))}
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
          onChange={(e)=>setMax(Number(e.target.value))}
          placeholder="Max"
          className="bg-transparent outline-none w-full"
          />

        </div>

      </div>



      <div className="
      fixed
      bottom-0
      left-0
      right-0
      bg-white
      px-6
      py-4
      ">

        <button
        onClick={onApply}
        className="
        w-full
        bg-[var(--color-primary)]
        text-white
        font-bold
        py-4
        rounded-full
        "
        >

        Show 2,500+ Items

        </button>

      </div>


    </div>
  );
}
