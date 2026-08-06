import {useState,useEffect} from "react";
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
ChevronRight,
Wallet,
Building2,
Smartphone,
Upload
} from "lucide-react";

import {useAuth} from "../../context/AuthContext";
import {useToast} from "../../context/ToastContext";


export default function ProfilePage(){

const {user}=useAuth();

const {showToast}=useToast();


const [screen,setScreen]=useState("profile");


const [profileImage,setProfileImage]=useState(
localStorage.getItem("profileImage") ||
user?.profileImage ||
""
);


const [formData,setFormData]=useState({

fullName:user?.fullName || "David Warner",

email:user?.email || "davidwarner@gmail.com",

phone:user?.phone || "+8801XXXXXXXXX",

address:"",

about:""

});


useEffect(()=>{

const img=
localStorage.getItem("profileImage");

if(img){
setProfileImage(img);
}

},[]);



const handleImage=(e)=>{

const file=e.target.files[0];

if(!file)return;


const url=URL.createObjectURL(file);

setProfileImage(url);

localStorage.setItem(
"profileImage",
url
);

showToast("Profile photo updated");

};



const handleChange=(e)=>{

setFormData({

...formData,

[e.target.name]:e.target.value

});

};



const paymentMethods=[

{
title:"bKash",
subtitle:"Mobile Banking",
icon:Wallet
},

{
title:"Nagad",
subtitle:"Digital Payment",
icon:Wallet
},

{
title:"Rocket",
subtitle:"DBBL Mobile Banking",
icon:Wallet
},

{
title:"Upay",
subtitle:"United Commercial Bank",
icon:Wallet
},

{
title:"Bank Account",
subtitle:"Add bank account",
icon:Building2
},

{
title:"Credit/Debit Card",
subtitle:"Visa or Mastercard",
icon:CreditCard
},

{
title:"UPI",
subtitle:"Unified Payment Interface",
icon:Smartphone
}

];



const mainMenu=[

["Profile Details",User,"details"],

["My Orders",Package],

["My Addresses",MapPin],

["Payment Methods",CreditCard,"payment"],

["Saved Cards",CreditCard]

];


const settingMenu=[

["Notifications",Bell],

["Dark Mode",Moon],

["Help & Support",HelpCircle]

];


const openScreen=(value)=>{

setScreen(value);

};



return (

<div className="
min-h-screen
pb-28
bg-gradient-to-br
from-pink-100
via-orange-100
to-green-100
p-5
"
>
{/* HEADER */}

<div className="
flex
items-center
justify-between
mb-6
">

<ArrowLeft size={24}/>

<h1 className="
text-xl
font-bold
">
Profile
</h1>

<Settings size={24}/>

</div>




{/* PROFILE SCREEN */}

{
screen==="profile" &&

<>

<div className="
rounded-3xl
bg-white/70
backdrop-blur-xl
border
border-white
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

src={
profileImage ||
"/default-avatar.png"
}

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

{formData.fullName}

</h2>


<p className="
text-gray-500
text-sm
truncate
max-w-[180px]
">

{formData.email}

</p>


</div>


</div>


<Pencil size={20}/>

</div>




<div className="
mt-6
space-y-5
">


<div className="
rounded-3xl
bg-white/70
backdrop-blur-xl
shadow-lg
p-4
">


{

mainMenu.map(([title,Icon,target])=>(


<button

key={title}

onClick={()=>target && openScreen(target)}

className="
w-full
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

<span>
{title}
</span>

</div>


<ChevronRight size={20}/>


</button>


))

}


</div>



<div className="
rounded-3xl
bg-white/70
backdrop-blur-xl
shadow-lg
p-4
">


{

settingMenu.map(([title,Icon])=>(

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

<span>
{title}
</span>

</div>


<ChevronRight size={20}/>


</div>


))

}


</div>




<div className="
rounded-3xl
bg-white/70
backdrop-blur-xl
shadow-lg
p-4
mb-6
">


<div className="
flex
items-center
gap-4
py-4
text-red-500
">

<LogOut size={22}/>

<span>
Logout
</span>


</div>


</div>


</div>


</>

}
{
screen==="details" &&

<>

<div className="
flex
items-center
gap-3
mb-6
">

<button
onClick={()=>setScreen("profile")}
>
<ArrowLeft/>
</button>

<h1 className="
text-xl
font-bold
">
Profile Details
</h1>

</div>



<div className="
rounded-3xl
bg-white/70
backdrop-blur-xl
shadow-lg
p-5
">


<div className="
flex
flex-col
items-center
mb-6
">


<img

src={
profileImage ||
"/default-avatar.png"
}

className="
h-28
w-28
rounded-full
object-cover
"

/>


<label className="
mt-3
text-orange-600
font-semibold
cursor-pointer
">


<Upload
size={18}
className="inline mr-2"
/>

Change Photo


<input

type="file"

hidden

accept="image/*"

onChange={handleImage}

/>


</label>


</div>



<input

name="fullName"

value={formData.fullName}

onChange={handleChange}

className="
w-full
rounded-2xl
border
p-4
mb-3
bg-white
"

/>


<input

name="email"

value={formData.email}

onChange={handleChange}

className="
w-full
rounded-2xl
border
p-4
mb-3
bg-white
"

/>


<input

name="phone"

value={formData.phone}

onChange={handleChange}

className="
w-full
rounded-2xl
border
p-4
mb-3
bg-white
"

/>



<textarea

name="address"

value={formData.address}

onChange={handleChange}

placeholder="Address"

className="
w-full
rounded-2xl
border
p-4
mb-3
bg-white
h-28
"

/>



<textarea

name="about"

value={formData.about}

onChange={handleChange}

placeholder="About yourself"

className="
w-full
rounded-2xl
border
p-4
mb-4
bg-white
h-28
"

/>



<button

onClick={()=>showToast("Profile Saved")}

className="
w-full
bg-black
text-white
rounded-2xl
py-4
font-bold
"

>

Save Changes

</button>


</div>


</>

}
{
screen==="payment" &&

<>

<div className="
flex
items-center
gap-3
mb-6
">

<button
onClick={()=>setScreen("profile")}
>
<ArrowLeft/>
</button>


<h1 className="
text-xl
font-bold
">
Payment Methods
</h1>


</div>



<div className="
rounded-3xl
bg-white/70
backdrop-blur-xl
shadow-lg
p-5
">


{

paymentMethods.map((item,index)=>{

const Icon=item.icon;


return(

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


<div className="
h-12
w-12
rounded-2xl
bg-orange-100
flex
items-center
justify-center
">

<Icon size={22}/>

</div>


<div>

<h3 className="
font-semibold
">

{item.title}

</h3>


<p className="
text-sm
text-gray-500
">

{item.subtitle}

</p>


</div>


</div>


<ChevronRight
size={20}
/>


</div>


)


})


}


</div>


</>

}


</div>

);

}


