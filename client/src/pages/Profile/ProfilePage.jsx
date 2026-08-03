import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

import profileService from "../../services/profileService";

import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";

import PrimaryButton from "../../components/buttons/PrimaryButton";
import PrimaryInput from "../../components/inputs/PrimaryInput";


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


  const [formData,setFormData] = useState({
    fullName:"",
    phone:"",
  });


  const [loading,setLoading] = useState(false);
  const [pageLoading,setPageLoading] = useState(true);
  const [editMode,setEditMode] = useState(false);



  useEffect(()=>{

    let ignore = false;


    const loadProfile = async()=>{


      try{


        const response =
        await profileService.getProfile();



        if(!ignore && response.user){


          login(
            response.user,
            localStorage.getItem("token")
          );


          setFormData({

            fullName:
            response.user.fullName || "",


            phone:
            response.user.phone || "",

          });


        }


      }
      catch(error){


        console.error(
          "Profile Load Error:",
          error
        );


      }
      finally{


        if(!ignore){

          setPageLoading(false);

        }


      }


    };


    loadProfile();



    return ()=>{

      ignore = true;

    };


  },[]);





  useEffect(()=>{


    if(user && !formData.fullName){


      setFormData({

        fullName:user.fullName || "",

        phone:user.phone || "",

      });


    }


  },[user]);





  const handleChange=(e)=>{

    const {
      name,
      value
    }=e.target;


    setFormData((prev)=>({

      ...prev,

      [name]:value,

    }));


  };





  const handleUpdate=async()=>{


    setLoading(true);


    try{


      const response =
      await profileService.updateProfile(formData);



      login(

        response.user,

        localStorage.getItem("token")

      );


      showToast(
        "Profile updated successfully",
        "success"
      );


      setEditMode(false);



    }
    catch(error){


      showToast(
        "Profile update failed",
        "error"
      );


    }
    finally{


      setLoading(false);


    }


  };





  const handleLogout=()=>{


    logout();


    showToast(
      "Logout Successful",
      "success"
    );


    navigate("/login",{
      replace:true,
    });


  };






  if(pageLoading){


    return (

      <div className="min-h-screen bg-slate-950 flex items-center justify-center">

        <motion.p

          animate={{
            opacity:[0.3,1,0.3]
          }}

          transition={{
            repeat:Infinity,
            duration:1.2
          }}

          className="text-white text-xl"

        >

          Loading Profile...

        </motion.p>


      </div>

    );


  }






  return (


    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-orange-600 px-6 py-10">


      <motion.div

        initial={{
          opacity:0,
          y:40
        }}

        animate={{
          opacity:1,
          y:0
        }}

        transition={{
          duration:0.6
        }}

        className="mx-auto max-w-md rounded-3xl border border-white/20 bg-white/10 p-8 backdrop-blur-xl shadow-2xl"

      >


        <h1 className="text-center text-3xl font-bold text-white">

          My Profile 👤

        </h1>



        <div className="mt-8 space-y-5">


          <PrimaryInput
            name="fullName"
            placeholder="Full Name"
            value={formData.fullName}
            onChange={handleChange}
            disabled={!editMode}
          />



          <PrimaryInput
            name="phone"
            placeholder="Phone Number"
            value={formData.phone}
            onChange={handleChange}
            disabled={!editMode}
          />



          <div className="rounded-xl bg-white/10 p-4 text-white">

            <p>Email</p>

            <p className="text-white/70">

              {user?.email}

            </p>

          </div>



          {
            editMode ? (

              <PrimaryButton
                type="button"
                disabled={loading}
                onClick={handleUpdate}
              >

                {
                  loading
                  ? "Updating..."
                  : "Save Changes"
                }

              </PrimaryButton>


            ) : (

              <PrimaryButton
                type="button"
                onClick={()=>setEditMode(true)}
              >

                Edit Profile

              </PrimaryButton>

            )

          }



          <button

            onClick={handleLogout}

            className="flex w-full items-center justify-center gap-2 rounded-full bg-red-500 py-4 font-bold text-white transition hover:bg-red-600"

          >

            <LogOut size={20}/>

            Logout

          </button>



        </div>


      </motion.div>


    </div>


  );


}
