import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Search,
  MapPin,
  Star,
  Heart,
  Plus,
  Clock3,
  SlidersHorizontal,
  ChevronRight,
  Pizza,
  Beef,
  Coffee,
  IceCream2,
  Salad
} from "lucide-react";

import { useNavigate } from "react-router-dom";
import FilterBottomSheet from "../../components/FilterBottomSheet/FilterBottomSheet";
import restaurantService from "../../services/restaurantService";

export default function HomePage() {

const navigate = useNavigate();

const [restaurants,setRestaurants]=useState([]);

const [showFilter,setShowFilter]=useState(false);

const [activeCategory,setActiveCategory]=useState(0);

const [filters,setFilters]=useState({
category:"",
rating:0,
minPrice:"",
maxPrice:"",
deliveryTime:""
});

const categories=[

{
name:"Pizza",
icon:Pizza
},

{
name:"Burger",
icon:Beef
},

{
name:"Coffee",
icon:Coffee
},

{
name:"Dessert",
icon:IceCream2
},

{
name:"Healthy",
icon:Salad
}

];

const featuredItems=[

{
id:1,
title:"Chicken Burger Deluxe",
rating:"4.8",
time:"20 min",
image:"https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=1200",
tags:["CHICKEN","BURGER"]
},

{
id:2,
title:"Italian Pizza",
rating:"4.9",
time:"25 min",
image:"https://images.unsplash.com/photo-1513104890138-7c749659a591?w=1200",
tags:["PIZZA","CHEESE"]
},

{
id:3,
title:"Premium Coffee",
rating:"4.7",
time:"15 min",
image:"https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=1200",
tags:["COFFEE"]
}

];
const popularDishes = [

{
id:1,
name:"Grilled Chicken",
calorie:"170 Kal",
price:"$12",
image:"https://images.unsplash.com/photo-1532550907401-a500c9a57435?w=800"
},

{
id:2,
name:"Beef Burger",
calorie:"240 Kal",
price:"$10",
image:"https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800"
},

{
id:3,
name:"Italian Pasta",
calorie:"180 Kal",
price:"$14",
image:"https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=800"
},

{
id:4,
name:"Healthy Salad",
calorie:"120 Kal",
price:"$9",
image:"https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800"
}

];

const peopleLookingFor=[

{
id:1,
dish:"Chicken Bowl",
restaurant:"Food House",
image:"https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?w=300"
},

{
id:2,
dish:"Cheese Burger",
restaurant:"Burger Point",
image:"https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=300"
},

{
id:3,
dish:"Italian Pizza",
restaurant:"Pizza Corner",
image:"https://images.unsplash.com/photo-1513104890138-7c749659a591?w=300"
},

{
id:4,
dish:"Premium Coffee",
restaurant:"Coffee Time",
image:"https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=300"
}

];

useEffect(()=>{

document.body.style.overflow=
showFilter ? "hidden":"auto";

return()=>{

document.body.style.overflow="auto";

};

},[showFilter]);

useEffect(()=>{

const loadRestaurants=async()=>{

try{

const response=
await restaurantService.getRestaurants();

setRestaurants(
response.restaurants || []
);

}catch(error){

console.error(error);

}

};

loadRestaurants();

},[]);

return(
<div className="min-h-screen bg-[#F7F8FC]">

<div className="mx-auto max-w-7xl px-5 py-6">

<motion.div
initial={{opacity:0,y:-20}}
animate={{opacity:1,y:0}}
className="flex items-center justify-between"
>

<div>

<p className="text-sm text-gray-500">

Deliver To

</p>

<div className="mt-1 flex items-center gap-2">

<MapPin
size={18}
className="text-primary"
/>

<h2 className="text-lg font-bold">

Your Location

</h2>

</div>

</div>

<div
className="
h-12
w-12
overflow-hidden
rounded-full
bg-white
shadow-md
"
>

<img
src="https://i.pravatar.cc/100"
alt=""
className="h-full w-full object-cover"
/>

</div>

</motion.div>

<div className="mt-7 flex gap-3">

<div
className="
flex-1
flex
items-center
gap-3
rounded-[24px]
bg-white
px-5
py-4
shadow-sm
"
>

<Search
size={20}
className="text-gray-400"
/>

<input
placeholder="Search food or restaurant..."
className="
w-full
bg-transparent
outline-none
"
/>

</div>

<button

onClick={()=>setShowFilter(true)}

className="
flex
h-14
w-14
items-center
justify-center
rounded-[22px]
bg-primary
text-white
shadow-lg
"

>

<SlidersHorizontal size={22}/>

</button>

</div>

<section className="mt-9">

<div className="flex gap-6 overflow-x-auto pb-2">


{categories.map((item,index)=>(

<motion.button
key={item.name}
whileTap={{scale:.95}}
onClick={()=>setActiveCategory(index)}
className="
min-w-[90px]
flex
flex-col
items-center
justify-center
"

>

<div
className={`
relative
flex
h-20
w-20
items-center
justify-center
rounded-full
bg-white
shadow-xl
transition-all
duration-300
${
activeCategory===index
?
"ring-2 ring-primary scale-105"
:
""
}
`}
>

<item.icon
size={34}
className="text-primary"
/>

</div>

<p className="mt-3 text-sm font-semibold text-gray-900">

{item.name}

</p>

<div
className={`
mt-2
h-1
rounded-full
bg-primary
transition-all
duration-300
${
activeCategory===index
?
"w-8"
:
"w-0"
}
`}
/>

</motion.button>

))}

</div>

</section>
<section className="mt-10">

<div className="mb-5 flex items-center justify-between">

<h2 className="text-xl font-bold">

Featured Items

</h2>

<button className="flex items-center gap-1 text-primary font-semibold">

See All

<ChevronRight size={16}/>

</button>

</div>

<div
className="
flex
gap-5
overflow-x-auto
pb-3
snap-x
snap-mandatory
"
>

{featuredItems.map((item)=>(

<motion.div

key={item.id}

whileHover={{y:-5}}

whileTap={{scale:.98}}

className="
min-w-[340px]
snap-start
overflow-hidden
rounded-[25px]
bg-white
shadow-lg
"

>

<img

src={item.image}

alt={item.title}

className="
h-52
w-full
object-cover
"

/>

<div className="p-5">

<div className="flex items-start justify-between">

<h3 className="text-lg font-bold leading-6">

{item.title}

</h3>

<div className="flex items-center gap-1">

<Star
size={16}
className="fill-yellow-400 text-yellow-400"
/>

<span className="font-semibold">

{item.rating}

</span>

</div>

</div>

<div className="mt-3 flex items-center gap-2 text-gray-500">

<Clock3 size={15}/>

<span className="text-sm">

{item.time}

</span>

</div>

<div className="mt-4 flex flex-wrap gap-2">

{item.tags.map((tag)=>(

<span

key={tag}

className="
rounded-full
bg-gray-100
px-3
py-1
text-[11px]
font-bold
tracking-wider
"

>

{tag}

</span>

))}

</div>

</div>

</motion.div>

))}

</div>

</section>
<section className="mt-10">

<div className="mb-5 flex items-center justify-between">

<h2 className="text-xl font-bold">

Popular Dishes

</h2>

<button
className="
flex
items-center
gap-1
font-semibold
text-primary
"
>

See All

<ChevronRight size={16}/>

</button>

</div>

<div className="grid grid-cols-2 gap-5">

{popularDishes.map((item)=>(

<motion.div

key={item.id}

whileHover={{y:-5}}

whileTap={{scale:.98}}

className="
overflow-hidden
rounded-[25px]
bg-white
shadow-lg
"

>

<div className="relative">

<img

src={item.image}

alt={item.name}

className="
h-48
w-full
object-cover
"

/>

<button

className="
absolute
right-4
top-4
flex
h-10
w-10
items-center
justify-center
rounded-full
bg-white
shadow-md
"

>

<Heart
size={18}
className="text-red-500"
/>

</button>

</div>

<div className="p-4">

<h3 className="font-bold">

{item.name}

</h3>

<p className="mt-2 text-sm text-gray-500">

{item.calorie}

</p>

<div className="mt-5 flex items-center justify-between">

<span className="text-lg font-bold text-primary">

{item.price}

</span>

<button

className="
flex
h-11
w-11
items-center
justify-center
rounded-xl
bg-primary
text-white
"

>

<Plus size={18}/>

</button>

</div>

</div>

</motion.div>

))}

</div>

</section>
<section className="mt-10">

<div className="mb-5 flex items-center justify-between">

<h2 className="text-xl font-bold">

People Looking For

</h2>

<button
className="
flex
items-center
gap-1
font-semibold
text-primary
"
>

See All

<ChevronRight size={16}/>

</button>

</div>

<div className="space-y-4">

{peopleLookingFor.map((item)=>(

<motion.div

key={item.id}

whileHover={{x:4}}

whileTap={{scale:.98}}

className="
flex
items-center
justify-between
rounded-[24px]
bg-white
p-4
shadow-md
"

>

<div className="flex items-center gap-4">

<img

src={item.image}

alt={item.dish}

className="
h-16
w-16
rounded-2xl
object-cover
"

/>

<div>

<h3 className="font-bold">

{item.dish}

</h3>

<p className="mt-1 text-sm text-gray-500">

{item.restaurant}

</p>

</div>

</div>

<button

className="
flex
h-12
w-12
items-center
justify-center
rounded-2xl
bg-primary
text-white
shadow
"

>

<Plus size={20}/>

</button>

</motion.div>

))}

</div>

</section>

<section className="mt-10">

<div className="mb-5 flex items-center justify-between">

<h2 className="text-xl font-bold">

Nearby Restaurants

</h2>

<button
onClick={()=>navigate("/restaurants")}
className="flex items-center gap-1 font-semibold text-primary"
>

See All

<ChevronRight size={16}/>

</button>

</div>

<div className="space-y-6">

{restaurants.map((restaurant)=>(

<motion.div

key={restaurant.id}

whileHover={{y:-5}}

whileTap={{scale:.98}}

onClick={()=>navigate(`/restaurants/${restaurant.id}`)}

className="
cursor-pointer
overflow-hidden
rounded-[25px]
bg-white
shadow-lg
"

>
<div className="relative">

<img

src={
restaurant.image ||
"https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200"
}

alt={restaurant.name}

className="
h-56
w-full
object-cover
"

/>

<div
className="
absolute
left-4
top-4
flex
items-center
gap-1
rounded-full
bg-white/90
px-3
py-2
backdrop-blur
shadow
"
>

<Star
size={15}
className="fill-yellow-400 text-yellow-400"
/>

<span className="font-semibold">

{restaurant.rating}

</span>

</div>

</div>

<div className="p-5">

<div className="flex items-start justify-between">

<div>

<h3 className="text-lg font-bold">

{restaurant.name}

</h3>

<p className="mt-2 text-sm text-gray-500">

{restaurant.category || "Restaurant"}

</p>

</div>

<div className="flex items-center gap-2 text-sm text-gray-500">

<Clock3 size={16}/>

<span>

{restaurant.deliveryTime}

</span>

</div>

</div>

</div>

</motion.div>

))}

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

</div>

);

}

