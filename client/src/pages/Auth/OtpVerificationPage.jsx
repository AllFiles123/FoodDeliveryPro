import { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";

import PrimaryButton from "../../components/buttons/PrimaryButton";

import authService from "../../services/authService";
import { useToast } from "../../context/ToastContext";


export default function OtpVerificationPage() {

  const navigate = useNavigate();

  const { showToast } = useToast();


  const [otp, setOtp] = useState("");

  const [error, setError] = useState("");

  const [loading, setLoading] = useState(false);



  const handleOtpChange = (e) => {

    const value = e.target.value;


    if (/^[0-9]*$/.test(value) && value.length <= 6) {

      setOtp(value);

      setError("");

    }

  };



  const handleSubmit = async (e) => {

    e.preventDefault();


    if (otp.length !== 6) {

      setError("Please enter a valid 6 digit OTP");

      return;

    }


    setLoading(true);


    try {


      const email =
        localStorage.getItem("resetEmail");


      const response =
        await authService.verifyOtp({
          email,
          otp,
        });



      showToast(
        "OTP Verified Successfully",
        "success"
      );


      console.log(
        "OTP Response:",
        response
      );


      navigate("/reset-password", {
  state: {
    email,
  },
});


    } catch(error) {


      showToast(
        error?.response?.data?.message ||
        "OTP Verification Failed",
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
          OTP Verification
        </h1>



        <p className="mt-2 text-center text-white/70">
          Enter the 6-digit OTP
        </p>



        <form
          onSubmit={handleSubmit}
          className="mt-8 space-y-5"
        >


          <input

            type="text"

            value={otp}

            onChange={handleOtpChange}

            maxLength="6"

            placeholder="Enter OTP"

            className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-center text-2xl tracking-[0.5em] text-white outline-none placeholder:text-white/40"

          />



          {error && (

            <p className="text-center text-sm text-red-300">

              {error}

            </p>

          )}



          <PrimaryButton
            type="submit"
            disabled={loading}
          >

            {
              loading
              ? "Verifying..."
              : "Verify OTP"
            }

          </PrimaryButton>


        </form>



        <p className="mt-6 text-center">

          <Link

            to="/login"

            className="font-semibold text-primary"

          >

            Back to Login

          </Link>


        </p>


      </motion.div>


    </div>

  );

}
