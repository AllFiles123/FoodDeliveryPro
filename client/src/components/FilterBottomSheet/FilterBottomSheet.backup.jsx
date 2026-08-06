import {
X,
Trash2,
Utensils,
Store,
Pill,
CupSoda,
Star,
DollarSign
} from "lucide-react";


export default function FilterBottomSheet({
open,
onClose,
filters,
setFilters,
onApply
}){


if(!open) return null;


const categories=[
["Meals",Utensils],
["Shops",Store],
["Drugs",Pill],
["Drinks",CupSoda]
];


const ratings=[
5,
4,
3,
2
];


return(

<div className="
fixed
inset-0
bg-black/30
z-50
flex
items-end
">


<div className="
w-full
bg-white
rounded-t-[32px]
px-6
pt-4
pb-8
max-h-[90vh]
overflow-y-auto
">


<div className="
flex
justify-center
mb-4
">

<div className="
h-1.5
w-14
rounded-full
bg-gray-300
"/>

</div>


<div className="
flex
items-center
justify-between
mb-6
">


<button
onClick={onClose}
className="
h-10
w-10
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
font-bold
text-xl
">

Filters

</h2>


<button
className="
h-10
w-10
rounded-full
bg-gray-100
flex
items-center
justify-center
"
>

<Trash2 size={20}/>

</button>


</div>


<h3 className="
font-bold
mb-3
">

Categories

</h3>


<div className="
grid
grid-cols-4
gap-3
mb-6
">

{
categories.map(([name,Icon])=>(

<button
key={name}
className="
rounded-2xl
bg-gray-50
p-3
text-center
"
>

<Icon
size={24}
className="mx-auto mb-2 text-orange-500"
/>

<p className="text-xs">
{name}
</p>


</button>

))
}

</div>


<h3 className="
font-bold
mb-3
">

Price Range

</h3>


<div className="
h-20
flex
items-end
gap-1
mb-3
">

{
[20,35,55,70,45,80,60].map((h,i)=>(

<div
key={i}
style={{height:`${h}%`}}
className="
flex-1
bg-orange-500
rounded-t
"
/>

))
}

</div>


<input
type="range"
className="
w-full
accent-orange-500
mb-4
"
/>


<div className="
grid
grid-cols-2
gap-3
mb-6
">

<div className="
border
rounded-xl
p-3
flex
items-center
gap-2
">

<DollarSign size={16}/>

<input
placeholder="Min"
className="outline-none w-full"
/>

</div>


<div className="
border
rounded-xl
p-3
flex
items-center
gap-2
">

<DollarSign size={16}/>

<input
placeholder="Max"
className="outline-none w-full"
/>

</div>

</div>


<h3 className="
font-bold
mb-3
">

Rating

</h3>


<div className="
flex
gap-3
mb-6
">

{
ratings.map(r=>(

<button
key={r}
className="
px-4
py-2
rounded-full
border
flex
items-center
gap-1
"
>

<Star
size={16}
className="text-yellow-400 fill-yellow-400"
/>

{r}.0

</button>

))
}

</div>



<h3 className="
font-bold
mb-3
">

Delivery Time

</h3>


<button
onClick={onApply}
className="
w-full
rounded-full
bg-orange-500
text-white
py-4
font-bold
"
>

Show 2,500+ Items

</button>


</div>


</div>

)

}

