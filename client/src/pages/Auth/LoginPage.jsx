import { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";

import PrimaryInput from "../../components/inputs/PrimaryInput";
import PasswordInput from "../../components/inputs/PasswordInput";
import PrimaryButton from "../../components/buttons/PrimaryButton";

import authService from "../../services/authService";
import { useToast } from "../../context/ToastContext";
import { useAuth } from "../../context/AuthContext";
import LoginAnimation from "../../components/LoginAnimation/LoginAnimation";


export default function LoginPage() {

  const navigate = useNavigate();

  const { showToast } = useToast();
  const { login } = useAuth();
  const {
    setCoverEyes,
    setSad,
    setSuccess,
    reset,
  } = useLoginAnimation();


  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });


  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });


  const [loading, setLoading] = useState(false);



  const handleChange = (e) => {

    const { name, value } = e.target;


    setFormData((prev)=>({
      ...prev,
      [name]: value,
    }));


    setErrors((prev)=>({
      ...prev,
      [name]: "",
    }));

  };



  const validateForm = () => {

    const newErrors = {};


    if(!formData.email.trim()){

      newErrors.email = "Email is required";

    }
    else if(
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)
    ){

      newErrors.email = "Please enter a valid email";

    }



    if(!formData.password.trim()){

      newErrors.password = "Password is required";

    }
    else if(formData.password.length < 6){

      newErrors.password =
      "Password must be at least 6 characters";

    }


    setErrors(newErrors);


    return Object.keys(newErrors).length === 0;

  };




  const handleSubmit = async (e)=>{

    e.preventDefault();


    if(!validateForm()) return;


    setLoading(true);



    try{


      const response =
      await authService.login(formData);



      login(
        {
          id: response.user?.id || null,

          fullName:
            response.user?.fullName || "",

          email:
            response.user?.email || formData.email,

          phone:
            response.user?.phone || "",

          role:
            response.user?.role || "user",
        },

        response.token
      );



      setCoverEyes(false);
      setSad(false);

      showToast(
        "Login Successful",
        "success"
      );



      navigate("/home", {
        replace:true,
      });



    }
    catch(error){
      setCoverEyes(false);
      setSuccess(false);
      setSad(true);




      showToast(
        error?.response?.data?.message ||
        "Login Failed",
        "error"
      );


      console.log(
        "Login Error:",
        error
      );


    }
    finally{
      setTimeout(() => {
        reset();
      }, 1200);


      setLoading(false);

    }


  };



  return (

    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-primary flex items-center justify-center px-6 py-10">


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

        className="w-full max-w-md rounded-3xl border border-white/20 bg-white/10 p-8 shadow-2xl backdrop-blur-xl"

      >


        <LoginAnimation />

        <h1 className="text-center text-3xl font-bold text-white">
          Welcome Back 👋
        </h1>


        <p className="mt-2 text-center text-white/70">
          Login to your account
        </p>



        <form
          onSubmit={handleSubmit}
          className="mt-8 space-y-4"
        >


          <PrimaryInput
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            onFocus={() => {
              reset();
              setCoverEyes(true);
            }}
            onBlur={() => {
              setCoverEyes(false);
            }}
          />


          {errors.email && (
            <p className="text-sm text-red-300">
              {errors.email}
            </p>
          )}



          <PasswordInput
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            onFocus={() => {
              reset();
              setCoverEyes(true);
            }}
            onBlur={() => {
              setCoverEyes(false);
            }}
          />


          {errors.password && (
            <p className="text-sm text-red-300">
              {errors.password}
            </p>
          )}



          <PrimaryButton
            type="submit"
            disabled={loading}
          >

            {
              loading
              ? "Logging In..."
              : "Login"
            }

          </PrimaryButton>



          <Link
            to="/forgot-password"
            className="block text-center text-sm text-white/80 transition hover:text-primary"
          >
            Forgot Password?
          </Link>



          <p className="pt-4 text-center text-white">

            Don't have an account?{" "}

            <Link
              to="/signup"
              className="font-semibold text-primary transition hover:text-primary"
            >
              Sign Up
            </Link>

          </p>


        </form>


      </motion.div>


    </div>

  );

}
