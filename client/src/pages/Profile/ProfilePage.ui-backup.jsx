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

const mainMenu=[
  ["Profile Details",User],
  ["My Orders",Package],
  ["My Addresses",MapPin],
  ["Payment Methods",CreditCard],
  ["Saved Cards",CreditCard]
];

const settingMenu=[
  ["Notifications",Bell],
  ["Dark Mode",Moon],
  ["Help & Support",HelpCircle]
];


const MenuCard=({items})=>(
<div className="
rounded-3xl
bg-white/70
backdrop-blur-xl
border
border-white/50
shadow-lg
p-4
">

{
items.map(([title,Icon])=>(

<div
key={title}
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

<Icon size={22}/>

<span className="
font-medium
">
{title}
</span>

</div>


<ChevronRight
size={20}
className="text-textSecondary"
/>

</div>

))
}

</div>
);



return(

<div className="
min-h-screen
bg-gradient-to-br
from-pink-100
via-orange-100
to-green-100
p-5
font-sans
">


<div className="
flex
items-center
justify-between
mb-6
">

<ArrowLeft/>

<h1 className="
text-xl
font-bold
">
Profile
</h1>

<Settings/>

</div>



<div className="
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
">


<div className="
flex
items-center
gap-4
min-w-0
">

<img
src="/default-avatar.png"
className="
h-20
w-20
rounded-full
object-cover
"
/>


<div className="
min-w-0
">

<h2 className="
font-bold
text-lg
truncate
">
David Warner
</h2>


<p className="
text-textSecondary
text-sm
truncate
max-w-[180px]
">
davidwarner@gmail.com
</p>


</div>

</div>


<Pencil size={20}/>


</div>




<div className="
mt-6
space-y-5
">


<MenuCard items={mainMenu}/>

<MenuCard items={settingMenu}/>


<MenuCard
items={[
["Logout",LogOut]
]}
/>


</div>



</div>

);

}
