import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Pencil,
  User,
  CreditCard,
  Smartphone,
  Wallet,
  Building2,
  ChevronRight,
  Upload,
  Heart,
  Bell,
  MapPin,
  ShoppingBag,
  Gift,
  Globe,
  Settings,
  Shield,
  Star,
  LogOut,
  HelpCircle
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import profileService from "../../services/profileService";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";


export default function ProfilePage(){

  const navigate = useNavigate();

  const {
    user,
    login
  } = useAuth();

  const {
    showToast
  } = useToast();


  const [screen,setScreen] = useState("profile");

  const [loading,setLoading] = useState(false);

  const [profileImage,setProfileImage] = useState(
    localStorage.getItem("profileImage") ||
    user?.profileImage ||
    ""
);


  const [formData,setFormData] = useState({

    fullName:user?.fullName || "Sophia Williams",

    email:user?.email || "sophia@gmail.com",

    phone:user?.phone || "+8801XXXXXXXXX",

    address:"",

    about:""

  });



  useEffect(()=>{

    const load = async()=>{

      try{

        const response =
        await profileService.getProfile();


        if(response.user){

          login(
            response.user,
            localStorage.getItem("token")
          );


          setFormData(prev=>({

            ...prev,

            fullName:
            response.user.fullName || prev.fullName,

            email:
            response.user.email || prev.email,

            phone:
            response.user.phone || prev.phone,

          }));


          const savedImage=
          localStorage.getItem("profileImage");

          setProfileImage(
            savedImage ||
            response.user.profileImage ||
            ""
          );

        }


      }catch(error){

        console.log(error);

      }

    };


    load();


  },[]);



  const handleChange=(e)=>{

    setFormData({

      ...formData,

      [e.target.name]:e.target.value

    });

  };



  const handleImage=(e)=>{

    const file=e.target.files[0];

    if(!file)return;


    setProfileImage(
      URL.createObjectURL(file)
    );

  };



  const saveProfile=async()=>{

    setLoading(true);

    try{

      const response =
      await profileService.updateProfile({

        ...formData,

        profileImage

      });


      login(
        response.user,
        localStorage.getItem("token")
      );


      showToast(
        "Profile updated successfully",
        "success"
      );


    }catch(error){

      showToast(
        "Update failed",
        "error"
      );

    }
    finally{

      setLoading(false);

    }

  };
  const paymentItems = [

    {
      title:"Credit/Debit Card",
      icon:CreditCard
    },

    {
      title:"bKash",
      icon:Smartphone
    },

    {
      title:"Nagad",
      icon:Smartphone
    },

    {
      title:"Rocket",
      icon:Wallet
    },

    {
      title:"Upay",
      icon:Wallet
    },

    {
      title:"Bank Account",
      icon:Building2
    },

    {
      title:"Google Pay",
      icon:Smartphone
    },

    {
      title:"PhonePay",
      icon:Smartphone
    },

    {
      title:"Paytm",
      icon:Wallet
    },

    {
      title:"Living Menu Wallet",
      icon:Wallet,
      balance:"৳52.09"
    },

    {
      title:"Redeem gift card",
      icon:CreditCard
    },

    {
      title:"Invite friends to earn credits",
      icon:User
    }

  ];



  

const profileMenus=[

{title:"My Orders",icon:ShoppingBag},
{title:"Favorites",icon:Heart},
{title:"Saved Addresses",icon:MapPin},
{title:"Notifications",icon:Bell},
{title:"Offers & Coupons",icon:Gift},
{title:"Language",icon:Globe},
{title:"Help & Support",icon:HelpCircle},
{title:"Settings",icon:Settings},
{title:"Privacy Policy",icon:Shield},
{title:"Rate App",icon:Star},
{title:"Logout",icon:LogOut,danger:true}

];


return (

    <div className="
      min-h-screen
      bg-gradient-to-br
      from-[#FDE7E7]
      via-[#FFF3E0]
      to-[#E7F5E9]
      font-sans
      pb-28
    ">


    <motion.div

      initial={{
        opacity:0,
        y:20
      }}

      animate={{
        opacity:1,
        y:0
      }}

      className="
        mx-auto
        max-w-md
        px-5
        pt-6
      "

    >



{
screen==="profile" && (

<>


<h1 className="
text-3xl
font-bold
text-gray-900
">

Profile

</h1>



<div className="
mt-8
rounded-3xl
bg-white
p-6
shadow-lg
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
border-4
border-white
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

onClick={()=>{
setScreen("details");
window.history.replaceState({},"","/profile/details");
}}

className="
mt-6
flex
w-full
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

onClick={()=>{
setScreen("payment");
window.history.replaceState({},"","/profile/payment");
}}

className="
mt-3
flex
w-full
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


<div className="
mt-5
rounded-3xl
bg-white
shadow-xl
overflow-hidden
">

{

profileMenus.map((item,index)=>{

const Icon=item.icon;

return(

<button

key={index}

className="
w-full
flex
items-center
justify-between
px-5
py-4
border-b
last:border-b-0
hover:bg-gray-50
transition
"

>

<div className="
flex
items-center
gap-4
">

<div className="
h-10
w-10
rounded-full
bg-gray-100
flex
items-center
justify-center
">

<Icon

size={20}

className={
item.danger
?
"text-red-500"
:
"text-gray-700"
}

/>

</div>

<span

className={
item.danger
?
"font-semibold text-red-500"
:
"font-semibold text-gray-800"
}

>

{item.title}

</span>

</div>

<ChevronRight
size={18}
className="text-gray-400"
/>

</button>

);

})

}

</div>


</div>


</>

)

}




{
screen==="details" && (

<>


<div className="
flex
items-center
gap-3
mb-6
">


<button
onClick={()=>{
setScreen("profile");
window.history.replaceState({},"","/profile");
}}
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
shadow-lg
">


<div className="
relative
mx-auto
h-32
w-32
">


<img

src={
profileImage ||
"/default-avatar.png"
}

className="
h-full
w-full
rounded-full
object-cover
"

/>


<label className="
absolute
bottom-0
right-0
flex
h-10
w-10
items-center
justify-center
rounded-full
bg-orange-500
text-white
cursor-pointer
">


<Upload size={18}/>


<input

type="file"

accept="image/*"

onChange={handleImage}

className="hidden"

/>


</label>


</div>



<p className="
mt-3
text-center
font-semibold
text-orange-600
">

Change your photo

</p>
<div className="
mt-6
space-y-4
">


<input

name="fullName"

value={formData.fullName}

onChange={handleChange}

placeholder="Name"

className="
w-full
rounded-2xl
border
p-4
outline-none
"

/>



<div className="
grid
grid-cols-2
gap-3
">


<input

name="email"

value={formData.email}

onChange={handleChange}

placeholder="Email"

className="
rounded-2xl
border
p-4
outline-none
"

/>


<input

name="phone"

value={formData.phone}

onChange={handleChange}

placeholder="Phone"

className="
rounded-2xl
border
p-4
outline-none
"

/>


</div>



<textarea

name="address"

value={formData.address}

onChange={handleChange}

placeholder="Type your address here"

className="
h-28
w-full
rounded-2xl
border
p-4
outline-none
"

/>



<textarea

name="about"

value={formData.about}

onChange={handleChange}

placeholder="Write something about yourself"

className="
h-32
w-full
rounded-2xl
border
p-4
outline-none
"

/>



<button

onClick={saveProfile}

disabled={loading}

className="
mt-3
w-full
rounded-2xl
bg-black
p-4
font-bold
text-white
"

>

{
loading
?
"Saving..."
:
"Save Changes"
}

</button>


</div>


</div>


</>

)

}





{
screen==="payment" && (

<>


<div className="
flex
items-center
gap-3
mb-6
">


<button

onClick={()=>{
setScreen("profile");
window.history.replaceState({},"","/profile");
}}

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
shadow-lg
">


<p className="
mb-4
text-sm
font-bold
text-gray-500
">

Add Payment Method

</p>



<div className="
divide-y
">


{
paymentItems.map((item,index)=>{


const Icon=item.icon;


return(

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
flex
h-10
w-10
items-center
justify-center
rounded-full
bg-gray-100
">


<Icon size={20}/>


</div>



<span className="
font-medium
">

{item.title}

</span>


</div>



<div className="
flex
items-center
gap-3
">


{
item.balance &&

<span className="
font-semibold
text-green-600
">

{item.balance}

</span>

}


<ChevronRight size={18}/>


</div>



</div>


)


})

}


</div>


</div>


</>

)

}



</motion.div>


</div>


);


}
