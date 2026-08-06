import { motion } from "framer-motion";
import {
X,
Trash2,
Pizza,
Grape,
Pill,
Milk,
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
}){

const [min,setMin]=useState(filters?.minPrice || 0);
const [max,setMax]=useState(filters?.maxPrice || 1000);
const [rating,setRating]=useState(0);
const [delivery,setDelivery]=useState("");
const [near,setNear]=useState(false);

if(!open) return null;


const bars=[20,40,70,35,90,55,80,45,65,30];


return (

<div className="fixed inset-0 z-50 bg-black/40 flex items-end">


<motion.div

initial={{y:"100%"}}
animate={{y:0}}

className="
w-full
bg-white
rounded-t-[32px]
px-6
py-5
space-y-6
max-h-[90vh]
overflow-y-auto
"

>


<div className="flex justify-center">
<div className="h-1.5 w-14 bg-gray-300 rounded-full"/>
</div>



<div className="flex justify-between items-center">

<button
onClick={onClose}
className="h-11 w-11 rounded-full bg-gray-100 flex items-center justify-center">
<X/>
</button>


<h2 className="text-xl font-bold">
Filters
</h2>


<button
className="h-11 w-11 rounded-full bg-gray-100 flex items-center justify-center">
<Trash2/>
</button>


</div>




<div className="space-y-3">

<h3 className="text-lg font-bold">
Categories
</h3>


<div className="grid grid-cols-4 gap-3">

{[
[Pizza,"Meals"],
[Grape,"Shops"],
[Pill,"Drugs"],
[Milk,"Drinks"]
].map(([Icon,name])=>(

<div
key={name}
className="bg-gray-100 rounded-2xl p-3 text-center">

<div className="
h-12 w-12 mx-auto
bg-gray-200
rounded-xl
flex items-center justify-center">

<Icon/>

</div>

<p className="text-sm mt-2">
{name}
</p>

</div>

))}

</div>

</div>




<div className="space-y-4">

<h3 className="text-lg font-bold">
Price Range
</h3>


<div className="
h-28
flex
items-end
gap-2">

{bars.map((b,i)=>(

<div
key={i}
className="flex-1 bg-[#FF5C00] rounded-t-lg"
style={{
height:`${Math.max(10,b*(max/1000))}%`
}}
/>

))}

</div>


<input

type="range"
min="0"
max="1000"
value={max}
onChange={(e)=>setMax(e.target.value)}

className="
w-full
accent-[#FF5C00]
"

/>



<div className="grid grid-cols-2 gap-3">


<div className="
bg-gray-100
rounded-xl
p-3
flex
gap-2">

<DollarSign size={18}/>

<input
value={min}
onChange={(e)=>setMin(e.target.value)}
placeholder="Min"
className="bg-transparent outline-none w-full"
/>

</div>



<div className="
bg-gray-100
rounded-xl
p-3
flex
gap-2">

<DollarSign size={18}/>

<input
value={max}
onChange={(e)=>setMax(e.target.value)}
placeholder="Max"
className="bg-transparent outline-none w-full"
/>

</div>


</div>

</div>





<div>

<h3 className="text-lg font-bold mb-3">
Rating
</h3>


<div className="flex gap-3">

{[5,4,3,2].map(r=>(

<button
key={r}
onClick={()=>setRating(r)}
className="
px-4
py-2
rounded-full
bg-gray-100
flex
items-center
gap-1">

<Star
size={16}
fill="#FFC107"
/>

{r}.0

</button>

))}

</div>

</div>





<div>

<h3 className="text-lg font-bold mb-3">
Delivery Time
</h3>


<div className="flex gap-3 overflow-x-auto">


{[
"Under 15 min",
"Under 30 min",
"Under 45 min"
].map(t=>(

<button
key={t}
onClick={()=>setDelivery(t)}
className="
px-5 py-2
rounded-full
bg-gray-100
whitespace-nowrap">

{t}

</button>

))}


</div>

</div>





<div className="
flex
justify-between
items-center">


<div className="flex gap-2 items-center">

<MapPin/>

<span className="font-bold">
Near Me
</span>

</div>



<button
onClick={()=>setNear(!near)}
className={`
w-12 h-7 rounded-full
${near?"bg-[#FF5C00]":"bg-gray-300"}
`}>

<div className={`
h-5 w-5 bg-white rounded-full transition
${near?"translate-x-6":"translate-x-1"}
`}/>

</button>


</div>





<button

onClick={()=>{

setFilters({
...filters,
minPrice:min,
maxPrice:max,
rating,
deliveryTime:delivery,
near
});

onApply();

}}

className="
w-full
bg-[#FF5C00]
text-white
font-bold
py-4
rounded-full">

Show 2,500+ Items

</button>


</motion.div>

</div>

)

}
