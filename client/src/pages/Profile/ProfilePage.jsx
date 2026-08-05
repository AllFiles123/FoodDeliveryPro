import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
  Smartphone,
  Gift,
  Users,
  CheckCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import profileService from "../../services/profileService";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";


export default function ProfilePage() {

  const navigate = useNavigate();

  const { user, login, logout } = useAuth();
  const { showToast } = useToast();


  const [currentScreen,setCurrentScreen] = useState("profile");
  const [pageLoading,setPageLoading] = useState(true);


  useEffect(()=>{

    const loadProfile = async()=>{

      try{

        const response = await profileService.getProfile();

        if(response.user){

          login(
            response.user,
            localStorage.getItem("token")
          );

        }

      }
      catch(error){

        console.log(error);

      }
      finally{

        setPageLoading(false);

      }

    };


    loadProfile();

  },[]);



  const handleLogout=()=>{

    logout();

    showToast(
      "Logout Successful",
      "success"
    );

    navigate("/login");

  };



  const menuCard=[
    {
      title:"Profile Details",
      icon:User,
      action:"details"
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
      icon:CreditCard,
      action:"payment"
    },
    {
      title:"Saved Cards",
      icon:CreditCard
    }
  ];



  const settingsCard=[
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
  ];



  const ListCard=({items})=>(

    <div className="
      rounded-[24px]
      bg-white/70
      backdrop-blur-xl
      shadow-lg
      border
      border-white/40
      overflow-hidden
    ">

      {
        items.map((item,index)=>{

          const Icon=item.icon;

          return(

            <button
              key={index}
              onClick={()=>item.action && setCurrentScreen(item.action)}
              className="
                w-full
                flex
                items-center
                justify-between
                px-5
                py-5
                border-b
                last:border-none
                border-slate-200/60
              "
            >

              <div className="flex items-center gap-4">

                <Icon
                  size={22}
                  strokeWidth={1.7}
                  className="text-slate-700"
                />

                <span className="text-slate-800 font-medium">
                  {item.title}
                </span>

              </div>


              <ChevronRight
                size={20}
                className="text-slate-400"
              />

            </button>

          );

        })
      }

    </div>

  );



  const ProfileScreen=()=>(
    
    <div className="space-y-6">


      <Header title="Profile"/>



      <div className="
        rounded-[24px]
        bg-white/70
        backdrop-blur-xl
        border
        border-white/40
        shadow-lg
        p-5
        flex
        items-center
        gap-4
      ">


        <img
          src="https://i.pravatar.cc/150"
          className="w-20 h-20 rounded-full object-cover"
        />


        <div className="flex-1">

          <h2 className="font-bold text-lg">
            {user?.fullName || "David Warner"}
          </h2>

          <p className="text-sm text-gray-500">
            {user?.email || "davidwarner@gmail.com"}
          </p>

        </div>


        <Pencil size={20}/>


      </div>


      <ListCard items={menuCard}/>

      <ListCard items={settingsCard}/>



      <button
        onClick={handleLogout}
        className="
        rounded-[24px]
        bg-white/70
        backdrop-blur-xl
        shadow-lg
        border
        border-white/40
        w-full
        p-5
        flex
        justify-between
        text-red-500
        font-semibold
        "
      >

        <span className="flex gap-4">
          <LogOut size={22}/>
          Logout
        </span>

        <ChevronRight/>

      </button>


    </div>

  );



  const Header=({title})=>(

    <div className="flex items-center justify-between">

      <button
        onClick={()=>setCurrentScreen("profile")}
        className="p-3 rounded-full bg-white/70 shadow"
      >
        <ArrowLeft/>
      </button>


      <h1 className="font-bold text-xl">
        {title}
      </h1>


      {
        title==="Profile"
        ?
        <button className="p-3 rounded-full bg-white/70 shadow">
          <Settings/>
        </button>
        :
        <div className="w-12"/>
      }


    </div>

  );



  const DetailsScreen=()=>(
    
    <div className="space-y-6">


      <Header title="Personal Information"/>


      <div className="
      bg-white/70
      backdrop-blur-xl
      rounded-[24px]
      p-6
      text-center
      shadow
      ">


        <div className="relative inline-block">

          <img
            src="https://i.pravatar.cc/200"
            className="w-32 h-32 rounded-full mx-auto"
          />

          <CheckCircle
            className="absolute right-1 bottom-2 text-orange-500 bg-white rounded-full"
          />

        </div>


        <p className="mt-3 font-semibold">
          Change your photo
        </p>


      </div>



      <input
        className="inputBox"
        placeholder="Name: Sophia Williams"
      />


      <div className="flex gap-3">

        <input
          className="inputBox"
          placeholder="sophia@gmail.com"
        />

        <input
          className="inputBox"
          placeholder="+8801XXXXXXXXX"
        />

      </div>


      <textarea
        className="inputBox h-28"
        placeholder="Type your address here"
      />


      <textarea
        className="inputBox h-32"
        placeholder="Write something about yourself"
      />


      <button
        className="
        w-full
        bg-black
        text-white
        rounded-2xl
        py-5
        font-bold
        "
      >

        Save Changes

      </button>


    </div>

  );



  const PaymentScreen=()=>{

    const payments=[
      ["Credit/Debit Card",CreditCard],
      ["UPI",Smartphone],
      ["Google Pay",Smartphone],
      ["PhonePay",Smartphone],
      ["Paytm",Smartphone],
      ["Living Menu Wallet",Wallet],
      ["Redeem gift card",Gift],
      ["Invite friends to earn credits",Users]
    ];


    return (

      <div className="space-y-6">

        <Header title="Payment"/>


        <p className="font-bold text-gray-500">
          Add Payment Method
        </p>


        <div className="
        rounded-[24px]
        bg-white/70
        backdrop-blur-xl
        shadow
        overflow-hidden
        ">

        {
          payments.map(([name,Icon],i)=>(

            <div
            key={i}
            className="
            flex
            justify-between
            items-center
            p-5
            border-b
            last:border-none
            "
            >

              <span className="flex gap-4 items-center">

                <Icon size={22}/>

                {name}

              </span>


              {
                name==="Living Menu Wallet"
                ?
                <span>
                  ৳52.09
                </span>
                :
                <ChevronRight/>
              }


            </div>

          ))
        }

        </div>


      </div>

    );

  };



  if(pageLoading){

    return null;

  }



  return (

    <div className="
      fixed
      inset-0
      overflow-hidden
      bg-gradient-to-br
      from-[#FDE7E7]
      via-[#FFF3E0]
      to-[#E7F5E9]
    ">


      <div className="
        relative
        h-full
        overflow-y-auto
        px-5
        py-8
      ">


      <motion.div

        initial={{
          opacity:0
        }}

        animate={{
          opacity:1
        }}

        className="max-w-md mx-auto pb-28"

      >


        <AnimatePresence mode="wait">

        {
          currentScreen==="profile"
          &&
          <ProfileScreen/>
        }


        {
          currentScreen==="details"
          &&
          <DetailsScreen/>
        }


        {
          currentScreen==="payment"
          &&
          <PaymentScreen/>
        }


        </AnimatePresence>


      </motion.div>


      </div>


    </div>

  );

}
