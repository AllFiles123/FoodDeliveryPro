import { useEffect, useState } from "react";
import { motion } from "framer-motion";

import {
  ArrowLeft,
  User,
  CreditCard,
  Wallet,
  Building2,
  Smartphone,
  Upload,
  ChevronRight,
  CheckCircle
} from "lucide-react";

import profileService from "../../services/profileService";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";


export default function ProfilePage(){

const {
 user,
 login
}=useAuth();


const {
 showToast
}=useToast();



const [screen,setScreen]=useState("profile");


const [profileImage,setProfileImage]=useState(
 user?.profileImage || ""
);

const handleImageUpload=(e)=>{
 const file=e.target.files[0];
 if(!file) return;

 const imageURL=URL.createObjectURL(file);
 setProfileImage(imageURL);
};



const [formData,setFormData]=useState({

fullName:user?.fullName || "Sophia Williams",

email:user?.email || "sophia@gmail.com",

phone:user?.phone || "+8801XXXXXXXXX",

address:"",

about:""

});



const handleChange=(e)=>{

setFormData({

...formData,

[e.target.name]:e.target.value

});

};







const paymentMethods=[

{
title:"bKash",
subtitle:"Mobile banking",
icon:Wallet
},

{
title:"Nagad",
subtitle:"Digital payment",
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
subtitle:"Add your bank account",
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
},

{
title:"Google Pay",
subtitle:"Fast payment",
icon:Smartphone
},

{
title:"PhonePe",
subtitle:"UPI payment",
icon:Smartphone
},

{
title:"Paytm",
subtitle:"Wallet payment",
icon:Wallet
},

{
title:"Living Menu Wallet",
subtitle:"Available balance",
balance:"৳52.09",
icon:Wallet
},

{
title:"Redeem Gift Card",
subtitle:"Use your gift card",
icon:CreditCard
},

{
title:"Invite Friends",
subtitle:"Earn credits",
icon:User
}

];
return (

<div
className="
min-h-screen
bg-fixed
bg-gradient-to-br
from-[#FDE7E7]
via-[#FFF3E0]
to-[#E7F5E9]
font-sans
"
>


<motion.div

initial={{opacity:0,y:20}}

animate={{opacity:1,y:0}}

className="
mx-auto
max-w-md
px-5
pt-6
pb-10
"

>


{
screen==="profile" &&

<>


<h1 className="
text-3xl
font-bold
mb-6
">

Profile

</h1>



<div className="
rounded-3xl
bg-white/90
p-6
shadow-xl
">


<div className="
flex
items-center
gap-5
">


<img

src={
profileImage ||
"/default-avatar.png"
}

className="
h-24
w-24
rounded-full
object-cover
shadow
"

/>



<div>

<h2 className="
text-xl
font-bold
">

{formData.fullName}

</h2>


<p className="
text-gray-500
">

{formData.email}

</p>


</div>


</div>





<button

onClick={()=>setScreen("details")}

className="
mt-6
w-full
flex
items-center
justify-between
rounded-2xl
bg-gray-100
p-4
font-semibold
"

>


<div className="
flex
items-center
gap-3
">

<User size={20}/>

Profile Details

</div>


<ChevronRight/>

</button>





<button

onClick={()=>setScreen("payment")}

className="
mt-3
w-full
flex
items-center
justify-between
rounded-2xl
bg-gray-100
p-4
font-semibold
"

>


<div className="
flex
items-center
gap-3
">

<CreditCard size={20}/>

Payment Methods

</div>


<ChevronRight/>

</button>



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
text-2xl
font-bold
">

Personal Information

</h1>


</div>





<div className="
rounded-3xl
bg-white
p-6
shadow-xl
">



<div className="
flex
flex-col
items-center
mb-6
">


<div
className="
relative
"
>


<img

src={
profileImage ||
"/default-avatar.png"
}

className="
h-32
w-32
rounded-full
object-cover
"

/>



<span
className="
absolute
bottom-1
right-1
rounded-full
bg-orange-500
p-1
text-white
"
>

<CheckCircle size={18}/>

</span>


</div>





<label
className="
mt-3
text-orange-600
font-semibold
cursor-pointer
"
>

<Upload
size={18}
className="inline mr-2"
/>

Change your photo


<input

type="file"

hidden

accept="image/*"

onChange={handleImageUpload}

/>


</label>


</div>





<div className="
space-y-4
">



<div>

<label className="text-sm text-gray-500">

Name

</label>


<input

name="fullName"

value={formData.fullName}

onChange={handleChange}

className="
w-full
rounded-2xl
bg-white
shadow-sm
border
border-gray-100
p-4
outline-none
focus:ring-2
focus:ring-orange-300
mt-1
outline-none
"

/>


</div>




<div className="
grid
grid-cols-2
gap-3
">


<div>

<label className="text-sm text-gray-500">

Email

</label>


<input

name="email"

value={formData.email}

onChange={handleChange}

className="
w-full
rounded-2xl
bg-white
shadow-sm
border
border-gray-100
p-4
outline-none
focus:ring-2
focus:ring-orange-300
mt-1
text-sm
"

/>


</div>




<div>

<label className="text-sm text-gray-500">

Phone

</label>


<input

name="phone"

value={formData.phone}

onChange={handleChange}

className="
w-full
rounded-2xl
bg-white
shadow-sm
border
border-gray-100
p-4
outline-none
focus:ring-2
focus:ring-orange-300
mt-1
text-sm
"

/>


</div>



</div>





<textarea

name="address"

value={formData.address}

onChange={handleChange}

placeholder="Type your address here"

className="
w-full
h-28
rounded-2xl
bg-white
shadow-sm
border
border-gray-100
p-4
outline-none
focus:ring-2
focus:ring-orange-300
"

/>





<textarea

name="about"

value={formData.about}

onChange={handleChange}

placeholder="Write something about yourself"

className="
w-full
h-32
rounded-2xl
bg-white
shadow-sm
border
border-gray-100
p-4
outline-none
focus:ring-2
focus:ring-orange-300
"

/>





<button

onClick={()=>showToast("Profile Saved")}

className="
w-full
rounded-2xl
bg-black
text-white
py-4
font-bold
"

>

Save Changes

</button>




</div>

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
text-2xl
font-bold
">

Payment

</h1>


</div>





<div className="
rounded-3xl
bg-white
p-5
shadow-xl
">


<h2 className="
text-sm
font-bold
text-gray-500
mb-4
">

Add Payment Method

</h2>




<div className="
divide-y
">


{

paymentMethods.map((item,index)=>{


const Icon=item.icon;


return (

<div

key={index}

className="
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
">


<div className="
h-11
w-11
rounded-full
bg-gray-100
flex
items-center
justify-center
">

<Icon size={21}/>

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




<div className="
flex
items-center
gap-3
">


{

item.balance &&

<span className="
font-bold
text-green-600
">

{item.balance}

</span>

}



<ChevronRight size={20}/>


</div>



</div>


)


})


}


</div>


</div>


</>

}


</motion.div>

</div>

);

}
