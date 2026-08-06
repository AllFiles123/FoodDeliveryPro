import { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";

import PrimaryInput from "../../components/inputs/PrimaryInput";
import PasswordInput from "../../components/inputs/PasswordInput";
import PrimaryButton from "../../components/buttons/PrimaryButton";

import authService from "../../services/authService";
import { useToast } from "../../context/ToastContext";
import { useAuth } from "../../context/AuthContext";


export default function SignupPage() {


  const navigate = useNavigate();


  const { showToast } = useToast();
  const { login } = useAuth();



  const [formData,setFormData] = useState({

    fullName:"",
    email:"",
    phone:"",
    password:"",
    confirmPassword:"",

  });



  const [errors,setErrors] = useState({});



  const [loading,setLoading] = useState(false);



  const handleChange = (e)=>{

    const {name,value}=e.target;


    setFormData((prev)=>({

      ...prev,

      [name]:value,

    }));


    setErrors((prev)=>({

      ...prev,

      [name]:"",

    }));

  };




  const validateForm = ()=>{


    const newErrors={};



    if(!formData.fullName.trim()){

      newErrors.fullName="Full name is required";

    }



    if(!formData.email.trim()){

      newErrors.email="Email is required";

    }
    else if(
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)
    ){

      newErrors.email="Please enter a valid email";

    }



    if(!formData.phone.trim()){

      newErrors.phone="Phone number is required";

    }



    if(!formData.password.trim()){

      newErrors.password="Password is required";

    }
    else if(formData.password.length < 6){

      newErrors.password="Password must be at least 6 characters";

    }



    if(!formData.confirmPassword.trim()){

      newErrors.confirmPassword="Confirm password is required";

    }
    else if(
      formData.password !== formData.confirmPassword
    ){

      newErrors.confirmPassword="Passwords do not match";

    }



    setErrors(newErrors);


    return Object.keys(newErrors).length===0;


  };





  const getPasswordStrength=()=>{


    if(formData.password.length>=10)
      return "Strong";


    if(formData.password.length>=7)
      return "Medium";


    if(formData.password.length>0)
      return "Weak";


    return "";


  };





  const handleSubmit = async(e)=>{


    e.preventDefault();



    if(!validateForm()) return;



    setLoading(true);



    try{


      const response =
      await authService.signup({

        fullName:formData.fullName,

        email:formData.email,

        phone:formData.phone,

        password:formData.password,

      });




      login(

        response.user || {

          fullName:formData.fullName,

          email:formData.email,

          phone:formData.phone,

        },

        response.token

      );




      showToast(

        "Account Created Successfully",

        "success"

      );




      navigate("/home",{

        replace:true,

      });



    }
    catch(error){


      showToast(

        error?.response?.data?.message ||

        "Signup Failed",

        "error"

      );


      console.log(

        "Signup Error:",

        error

      );


    }
    finally{


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

        className="w-full max-w-md rounded-3xl border border-white/20 bg-white/10 backdrop-blur-xl shadow-2xl p-8"

      >


        <h1 className="text-3xl font-bold text-center text-white">

          Create Account

        </h1>



        <p className="mt-2 text-center text-white/70">

          Join Food Delivery Pro

        </p>





        <form

          onSubmit={handleSubmit}

          className="mt-8 space-y-4"

        >



          <PrimaryInput

            name="fullName"

            placeholder="Full Name"

            value={formData.fullName}

            onChange={handleChange}

          />



          {errors.fullName && (

            <p className="text-sm text-red-300">

              {errors.fullName}

            </p>

          )}




          <PrimaryInput

            type="email"

            name="email"

            placeholder="Email Address"

            value={formData.email}

            onChange={handleChange}

          />



          {errors.email && (

            <p className="text-sm text-red-300">

              {errors.email}

            </p>

          )}




          <PrimaryInput

            type="tel"

            name="phone"

            placeholder="Phone Number"

            value={formData.phone}

            onChange={handleChange}

          />



          {errors.phone && (

            <p className="text-sm text-red-300">

              {errors.phone}

            </p>

          )}




          <PasswordInput

            name="password"

            placeholder="Password"

            value={formData.password}

            onChange={handleChange}

          />



          {formData.password && (

            <p className="text-xs text-primary">

              Password Strength: {getPasswordStrength()}

            </p>

          )}




          <PasswordInput

            name="confirmPassword"

            placeholder="Confirm Password"

            value={formData.confirmPassword}

            onChange={handleChange}

          />



          {errors.confirmPassword && (

            <p className="text-sm text-red-300">

              {errors.confirmPassword}

            </p>

          )}




          <PrimaryButton

            type="submit"

            disabled={loading}

          >

            {

              loading

              ? "Creating Account..."

              : "Create Account"

            }


          </PrimaryButton>





          <p className="pt-4 text-center text-white">


            Already have an account?{" "}



            <Link

              to="/login"

              className="font-semibold text-primary transition hover:text-primary"

            >

              Login

            </Link>


          </p>



        </form>


      </motion.div>


    </div>


  );


}
