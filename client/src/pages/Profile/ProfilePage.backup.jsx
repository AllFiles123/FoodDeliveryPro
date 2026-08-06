import { 
  ArrowLeft,
  Settings,
  Pencil,
  User,
  Package,
  MapPin,
  CreditCard,
  Bell,
  Moon,
  HelpCircle,
  LogOut,
  ChevronRight
} from "lucide-react";


export default function ProfilePage(){

return (

<div
className="
min-h-screen
bg-gradient-to-br
from-pink-100
via-orange-100
to-green-100
p-5
font-sans
"
>


{/* Header */}

<div
className="
flex
items-center
justify-between
mb-6
"
>

<button>
<ArrowLeft
size={24}
/>
</button>


<h1
className="
text-xl
font-bold
"
>
Profile
</h1>


<button>
<Settings
size={24}
/>
</button>


</div>



{/* User Card */}

<div
className="
rounded-3xl
bg-white/70
backdrop-blur-xl
border
border-white/50
shadow-lg
p-5
flex
items-center
justify-between
"
>


<div
className="
flex
items-center
gap-4
"
>


<img

src="/default-avatar.png"

className="
h-20
w-20
rounded-full
object-cover
border-4
border-white
shadow
"

/>


<div
className="
min-w-0
"
>

<h2
className="
font-bold
text-lg
truncate
"
>
David Warner
</h2>


<p
className="
text-gray-500
text-sm
truncate
max-w-[180px]
"
>
davidwarner@gmail.com
</p>


</div>


</div>


<button>

<Pencil
size={20}
/>

</button>


</div>


{/* Menu Sections */}


<div className="
mt-6
space-y-5
">


{/* Main Menu */}

<div className="
rounded-3xl
bg-white/70
backdrop-blur-xl
border
border-white/50
shadow-lg
p-4
">


{[
{
title:"Profile Details",
icon:User
},
{
title:"My Orders",
icon:Package
},
{
title:"My Addresses",
icon:MapPin
},
{
title:"Payment Methods",
icon:CreditCard
},
{
title:"Saved Cards",
icon:CreditCard
}

].map((item,index)=>{

const Icon=item.icon;

return (

<div
key={index}
className="
flex
items-center
justify-between
py-4
border-b
last:border-none
"
>


<div className="
flex
items-center
gap-4
">

<Icon
size={22}
/>

<span className="
font-medium
"
>
{item.title}
</span>

</div>


<ChevronRight
size={20}
className="text-gray-400"
/>


</div>

)

})}


</div>




{/* Settings */}

<div className="
rounded-3xl
bg-white/70
backdrop-blur-xl
border
border-white/50
shadow-lg
p-4
">


{[
{
title:"Notifications",
icon:Bell
},
{
title:"Dark Mode",
icon:Moon
},
{
title:"Help & Support",
icon:HelpCircle
}

].map((item,index)=>{

const Icon=item.icon;


return (

<div
key={index}
className="
flex
items-center
justify-between
py-4
border-b
last:border-none
"
>


<div className="
flex
items-center
gap-4
">

<Icon
size={22}
/>

<span className="
font-medium
">
{item.title}
</span>


</div>


<ChevronRight
size={20}
className="text-gray-400"
/>


</div>

)

})}


</div>





{/* Logout */}

<div className="
rounded-3xl
bg-white/70
backdrop-blur-xl
border
border-white/50
shadow-lg
p-4
">


<div className="
flex
items-center
justify-between
py-4
"
>


<div className="
flex
items-center
gap-4
text-red-500
">

<LogOut
size={22}
/>

<span className="
font-medium
">
Logout
</span>


</div>


<ChevronRight
size={20}
className="text-gray-400"
/>


</div>


</div>


</div></div>

);

}
