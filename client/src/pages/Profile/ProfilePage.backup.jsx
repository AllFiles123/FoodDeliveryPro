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
  Upload,
  SmartphoneNfc,
  Landmark,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import profileService from "../../services/profileService";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";


export default function ProfilePage(){

  const navigate = useNavigate();

  const {
    user,
    login,
    logout
  } = useAuth();


  const {
    showToast
  } = useToast();



  const [screen,setScreen]=useState("profile");

  const [profileImage,setProfileImage]=useState(
    user?.image || ""
  );


  const [formData,setFormData]=useState({

    name:
    user?.fullName || "Sophia Williams",

    email:
    user?.email || "sophia@gmail.com",

    phone:
    "+8801XXXXXXXXX",

    address:"",

    about:""

  });



  const [pageLoading,setPageLoading]=useState(true);



  useEffect(()=>{


    const loadProfile=async()=>{


      try{


        const response =
        await profileService.getProfile();



        if(response.user){


          login(
            response.user,
            localStorage.getItem("token")
          );


          setFormData((prev)=>({

            ...prev,

            name:
            response.user.fullName || prev.name,

            email:
            response.user.email || prev.email

          }));


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




  const handleImageChange=(e)=>{


    const file=e.target.files[0];


    if(file){


      setProfileImage(
        URL.createObjectURL(file)
      );


    }


  };




  const handleChange=(e)=>{


    setFormData({

      ...formData,

      [e.target.name]:
      e.target.value

    });


  };




  const handleLogout=()=>{


    logout();


    showToast(
      "Logout Successful",
      "success"
    );


    navigate(
      "/login",
      {
        replace:true
      }
    );


  };



  if(pageLoading){

    return null;

  }



  const Header=({title})=>(

    <div className="
      flex
      items-center
      justify-between
      mb-6
    ">


      <button

        onClick={()=>
          setScreen("profile")
        }

        className="
          bg-white/70
          rounded-full
          p-3
          shadow
        "

      >

        <ArrowLeft size={22}/>

      </button>



      <h1 className="
        font-bold
        text-xl
      ">

        {title}

      </h1>



      {
        title==="Profile"
        ?

        <button
          className="
          bg-white/70
          rounded-full
          p-3
          shadow
          "
        >

          <Settings size={22}/>

        </button>

        :

        <div className="w-12"/>

      }


    </div>

  );



  const GlassCard=({children})=>(

    <div className="
      bg-white/70
      backdrop-blur-xl
      border
      border-white/50
      shadow-lg
      rounded-[24px]
    ">

      {children}

    </div>

  );
  const MenuItem=({
    icon:Icon,
    title,
    onClick,
    danger
  })=>(

    <button

      onClick={onClick}

      className="
        w-full
        flex
        items-center
        justify-between
        py-4
        px-5
        border-b
        border-black/5
        last:border-none
      "

    >

      <div className="flex items-center gap-4">

        <Icon
          size={21}
          strokeWidth={1.7}
          className={
            danger
            ?
            "text-red-500"
            :
            "text-gray-700"
          }
        />

        <span
          className={
            danger
            ?
            "text-red-500 font-medium"
            :
            "text-gray-800"
          }
        >

          {title}

        </span>

      </div>


      <ChevronRight
        size={20}
        className="text-gray-400"
      />


    </button>

  );




  const ProfileScreen=()=>(
    
    <>


      <Header title="Profile"/>



      <GlassCard>

        <div className="
          flex
          items-center
          gap-4
          p-5
        ">


          <img

            src={
              profileImage ||
              "https://i.pravatar.cc/150"
            }

            className="
              w-20
              h-20
              rounded-full
              object-cover
            "

          />



          <div className="flex-1">


            <h2 className="
              font-bold
              text-lg
            ">

              David Warner

            </h2>


            <p className="
              text-gray-500
              text-sm
            ">

              davidwarner@gmail.com

            </p>


          </div>



          <Pencil size={20}/>



        </div>


      </GlassCard>



      <div className="h-5"/>



      <GlassCard>

        <MenuItem

          icon={User}

          title="Profile Details"

          onClick={()=>
            setScreen("details")
          }

        />


        <MenuItem

          icon={Package}

          title="My Orders"

        />


        <MenuItem

          icon={MapPin}

          title="My Addresses"

        />


        <MenuItem

          icon={CreditCard}

          title="Payment Methods"

          onClick={()=>
            setScreen("payment")
          }

        />


        <MenuItem

          icon={CreditCard}

          title="Saved Cards"

        />


      </GlassCard>




      <div className="h-5"/>



      <GlassCard>


        <MenuItem

          icon={Bell}

          title="Notifications"

        />


        <MenuItem

          icon={Moon}

          title="Dark Mode"

        />


        <MenuItem

          icon={HelpCircle}

          title="Help & Support"

        />


      </GlassCard>




      <div className="h-5"/>



      <GlassCard>

        <MenuItem

          icon={LogOut}

          title="Logout"

          danger

          onClick={handleLogout}

        />


      </GlassCard>


    </>

  );





  const DetailsScreen=()=>(
    
    <>

      <Header title="Personal Information"/>



      <GlassCard>

        <div className="
          flex
          flex-col
          items-center
          p-6
        ">


          <div className="relative">


            <img

              src={
                profileImage ||
                "https://i.pravatar.cc/200"
              }

              className="
                w-32
                h-32
                rounded-full
                object-cover
              "

            />


            <label className="
              absolute
              bottom-0
              right-0
              bg-orange-500
              text-white
              p-2
              rounded-full
            ">

              <Upload size={18}/>


              <input

                type="file"

                accept="image/*"

                hidden

                onChange={handleImageChange}

              />

            </label>


          </div>



          <p className="
            mt-4
            font-medium
          ">

            Change your photo

          </p>


          <CheckCircle

            className="text-orange-500 mt-2"

            size={20}

          />


        </div>


      </GlassCard>
      <GlassCard>

        <div className="
          p-5
          space-y-4
        ">


          <div>

            <label className="
              text-sm
              text-gray-500
            ">

              Name

            </label>

            <input

              name="name"

              value={formData.name}

              onChange={handleChange}

              className="
                w-full
                mt-2
                rounded-2xl
                border
                border-gray-200
                bg-white
                px-4
                py-3
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
                  mt-2
                  rounded-2xl
                  border
                  px-3
                  py-3
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
                  mt-2
                  rounded-2xl
                  border
                  px-3
                  py-3
                "

              />

            </div>


          </div>





          <div>

            <label className="text-sm text-gray-500">

              Delivery Address

            </label>


            <textarea

              name="address"

              value={formData.address}

              onChange={handleChange}

              placeholder="Type your address here"

              className="
                w-full
                mt-2
                h-28
                rounded-2xl
                border
                p-4
                resize-none
              "

            />


          </div>




          <div>

            <label className="text-sm text-gray-500">

              About Me

            </label>


            <textarea

              name="about"

              value={formData.about}

              onChange={handleChange}

              placeholder="Write something about yourself"

              className="
                w-full
                mt-2
                h-28
                rounded-2xl
                border
                p-4
                resize-none
              "

            />


          </div>




          <button

            className="
              w-full
              rounded-2xl
              bg-black
              text-white
              py-4
              font-semibold
            "

          >

            Save Changes

          </button>


        </div>

      </GlassCard>


    </>

  );





  const PaymentScreen=()=>{


    const payments=[

      ["Credit/Debit Card",CreditCard],
      ["bKash",Smartphone],
      ["Nagad",Smartphone],
      ["Rocket",Wallet],
      ["Upay",Wallet],
      ["Bank Account",Landmark],
      ["UPI",SmartphoneNfc],
      ["Google Pay",Wallet],
      ["PhonePay",Wallet],
      ["Paytm",Wallet],
      ["Living Menu Wallet  ৳52.09",Wallet],
      ["Redeem gift card",Gift],
      ["Invite friends to earn credits",Users],

    ];



    return (

      <>

        <Header title="Payment"/>



        <p className="
          text-gray-500
          font-bold
          text-sm
          mb-3
        ">

          Add Payment Method

        </p>



        <GlassCard>


          {
            payments.map(
              ([name,Icon],index)=>(


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
                  border-black/5
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

                    strokeWidth={1.7}

                  />


                  <span>

                    {name}

                  </span>


                </div>



                <ChevronRight

                  size={20}

                  className="text-gray-400"

                />


              </button>


            ))}


        </GlassCard>


      </>

    );


  };





  return (

    <div className="
      min-h-screen
      bg-gradient-to-br
      from-[#FDE7E7]
      via-[#FFF3E0]
      to-[#E7F5E9]
      p-5
      font-sans
    ">


      <AnimatePresence mode="wait">


        <motion.div

          key={screen}

          initial={{
            opacity:0,
            x:30
          }}

          animate={{
            opacity:1,
            x:0
          }}

          transition={{
            duration:.3
          }}

          className="
            max-w-md
            mx-auto
          "

        >


          {
            screen==="profile"
            &&
            <ProfileScreen/>
          }


          {
            screen==="details"
            &&
            <DetailsScreen/>
          }


          {
            screen==="payment"
            &&
            <PaymentScreen/>
          }


        </motion.div>


      </AnimatePresence>


    </div>

  );


}
