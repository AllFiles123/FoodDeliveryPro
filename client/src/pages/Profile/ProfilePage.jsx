import { useEffect, useState } from "react";
import { motion } from "framer-motion";
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
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import profileService from "../../services/profileService";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";


export default function ProfilePage() {

  const navigate = useNavigate();

  const {
    user,
    login,
    logout
  } = useAuth();

  const {
    showToast
  } = useToast();


  const [loading,setLoading] = useState(false);
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

        console.error(
          "Profile Load Error:",
          error
        );

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

    navigate("/login",{
      replace:true
    });

  };



  if(pageLoading){

    return (

      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-200 via-orange-100 to-green-200">

        <p className="text-slate-700 text-xl font-semibold">
          Loading Profile...
        </p>

      </div>

    );

  }



  const menuOne=[
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
  ];


  const menuTwo=[
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



  const renderMenu=(items)=>(
    
    <div className="rounded-[24px] bg-white/70 backdrop-blur-xl shadow-lg border border-white/40 overflow-hidden">

      {
        items.map((item,index)=>{

          const Icon=item.icon;

          return(

            <div
              key={index}
              className="flex items-center justify-between px-5 py-5 border-b border-slate-200/60 last:border-none"
            >

              <div className="flex items-center gap-4">

                <Icon
                  size={22}
                  className="text-slate-700"
                  strokeWidth={1.7}
                />

                <span className="text-slate-800 font-medium">
                  {item.title}
                </span>

              </div>


              <ChevronRight
                size={20}
                className="text-slate-400"
                strokeWidth={1.7}
              />

            </div>

          );

        })
      }

    </div>

  );



  return (

    <div className="min-h-screen px-5 py-8 bg-gradient-to-br from-pink-200 via-orange-100 to-green-200">


      <motion.div

        initial={{
          opacity:0,
          y:30
        }}

        animate={{
          opacity:1,
          y:0
        }}

        transition={{
          duration:.5
        }}

        className="max-w-md mx-auto space-y-6"

      >


        <div className="flex items-center justify-between">

          <button
            onClick={()=>navigate(-1)}
            className="p-3 rounded-full bg-white/70 backdrop-blur shadow"
          >

            <ArrowLeft size={22}/>

          </button>


          <h1 className="text-xl font-bold text-slate-800">
            Profile
          </h1>


          <button className="p-3 rounded-full bg-white/70 backdrop-blur shadow">

            <Settings size={22}/>

          </button>


        </div>



        <div className="rounded-[24px] bg-white/70 backdrop-blur-xl shadow-lg border border-white/40 p-5 flex items-center gap-4">


          <div className="w-20 h-20 rounded-full bg-slate-200 overflow-hidden">

            <img
              src="https://i.pravatar.cc/150"
              alt="profile"
              className="w-full h-full object-cover"
            />

          </div>


          <div className="flex-1">

            <h2 className="font-bold text-lg text-slate-900">
              {user?.fullName || "David Warner"}
            </h2>

            <p className="text-sm text-slate-500">
              {user?.email || "davidwarner@gmail.com"}
            </p>

          </div>


          <button>

            <Pencil
              size={20}
              className="text-slate-600"
            />

          </button>


        </div>



        {renderMenu(menuOne)}


        {renderMenu(menuTwo)}



        <button

          onClick={handleLogout}

          className="w-full rounded-[24px] bg-white/70 backdrop-blur-xl shadow-lg border border-white/40 p-5 flex items-center justify-between text-red-500 font-semibold"

        >

          <div className="flex items-center gap-4">

            <LogOut size={22}/>

            Logout

          </div>


          <ChevronRight size={20}/>


        </button>



      </motion.div>


    </div>

  );

}
