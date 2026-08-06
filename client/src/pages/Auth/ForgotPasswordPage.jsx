import { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";

import PrimaryInput from "../../components/inputs/PrimaryInput";
import PrimaryButton from "../../components/buttons/PrimaryButton";

import authService from "../../services/authService";
import { useToast } from "../../context/ToastContext";


export default function ForgotPasswordPage() {

  const navigate = useNavigate();

  const { showToast } = useToast();


  const [email, setEmail] = useState("");

  const [error, setError] = useState("");

  const [loading, setLoading] = useState(false);



  const validateEmail = () => {

    if (!email.trim()) {

      setError("Email is required");

      return false;
    }


    const emailRegex =
      /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;


    if (!emailRegex.test(email)) {

      setError("Please enter a valid email");

      return false;
    }


    setError("");

    return true;

  };



  const handleSubmit = async (e) => {

    e.preventDefault();


    if (!validateEmail()) return;


    setLoading(true);


    try {

      const response =
        await authService.forgotPassword({
          email,
        });


      showToast(
        "OTP sent successfully",
        "success"
      );


      console.log(
        "OTP:",
        response.otp
      );


      localStorage.setItem(
        "resetEmail",
        email
      );


      navigate("/otp");


    } catch(error) {


      showToast(
        error?.response?.data?.message ||
        "Failed to send OTP",
        "error"
      );


    } finally {

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

        <h1 className="text-center text-3xl font-bold text-white">
          Forgot Password
        </h1>


        <p className="mt-2 text-center text-white/70">
          Enter your email to receive an OTP.
        </p>



        <form
          onSubmit={handleSubmit}
          className="mt-8 space-y-4"
        >


          <PrimaryInput

            type="email"

            name="email"

            placeholder="Email Address"

            value={email}

            onChange={(e)=>{

              setEmail(e.target.value);

              setError("");

            }}

          />



          {error && (

            <p className="text-sm text-red-300">
              {error}
            </p>

          )}



          <PrimaryButton
            type="submit"
            disabled={loading}
          >

            {
              loading
              ? "Sending OTP..."
              : "Send OTP"
            }

          </PrimaryButton>



        </form>



        <p className="mt-6 text-center text-white">

          Back to{" "}

          <Link
            to="/login"
            className="font-semibold text-primary"
          >

            Login

          </Link>

        </p>


      </motion.div>

    </div>

  );

}
