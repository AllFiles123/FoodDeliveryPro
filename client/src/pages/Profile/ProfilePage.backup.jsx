import { useEffect, useState } from "react";
import { motion } from "framer-motion";

import profileService from "../../services/profileService";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";

import PrimaryButton from "../../components/buttons/PrimaryButton";
import PrimaryInput from "../../components/inputs/PrimaryInput";


export default function ProfilePage() {

  const { user, login } = useAuth();
  const { showToast } = useToast();


  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
  });


  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);



  useEffect(() => {

    if (user) {

      setFormData({
        fullName: user.fullName || "",
        phone: user.phone || "",
      });

    }

  }, [user]);




  const handleChange = (e) => {

    const {
      name,
      value,
    } = e.target;


    setFormData((prev)=>({
      ...prev,
      [name]: value,
    }));

  };




  const handleUpdate = async () => {

    setLoading(true);

    try {

      const response =
        await profileService.updateProfile(
          formData
        );


      login(
        response.user,
        localStorage.getItem("token")
      );


      showToast(
        "Profile updated successfully",
        "success"
      );


      setEditMode(false);


    } catch(error) {

      showToast(
        "Profile update failed",
        "error"
      );

    } finally {

      setLoading(false);

    }

  };



  return (

    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-orange-600 px-6 py-10">


      <motion.div

        initial={{
          opacity:0,
          y:40,
        }}

        animate={{
          opacity:1,
          y:0,
        }}

        transition={{
          duration:0.6,
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

            <p>
              Email
            </p>

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
                onClick={() => setEditMode(true)}
              >
                Edit Profile
              </PrimaryButton>

            )
          }


        </div>


      </motion.div>


    </div>

  );

}
