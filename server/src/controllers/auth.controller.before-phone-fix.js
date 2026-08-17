import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import {
  getDatabase,
  saveDatabase,
} from "../database/database.js";

import {
  createUser,
  getUserByEmail,
} from "../models/user.model.js";


const JWT_SECRET =
  process.env.JWT_SECRET || "fooddelivery_secret";



export async function signup(req, res) {

  try {

    const {
      fullName,
      email,
      phone,
      password,
    } = req.body;


    if (!fullName || !email || !phone || !password) {

      return res.status(400).json({
        success:false,
        message:"All fields are required",
      });

    }


    const existingUser =
      getUserByEmail(email);


    if (existingUser) {

      return res.status(409).json({
        success:false,
        message:"Email already registered",
      });

    }


    const hashedPassword =
      await bcrypt.hash(password,10);


    const user =
      createUser({
        fullName,
        email,
        phone,
        password:hashedPassword,
      });



    const token =
      jwt.sign(
        {
          id:user.id,
          email:user.email,
        },
        JWT_SECRET,
        {
          expiresIn:"7d",
        }
      );


    return res.status(201).json({
      success:true,
      message:"Account created successfully",
      token,
      user:{
        id:user.id,
        fullName:user.fullName,
        email:user.email,
        phone:user.phone,
        role:user.role,
      },
    });


  } catch(error){

    console.error(error);

    return res.status(500).json({
      success:false,
      message:"Signup failed",
    });

  }

}




export async function login(req,res){

  try{

    const {
      email,
      password,
    } = req.body;


    const user =
      getUserByEmail(email);



    if(!user){

      return res.status(404).json({
        success:false,
        message:"User not found",
      });

    }



    const isMatch =
      await bcrypt.compare(
        password,
        user.password
      );


    if(!isMatch){

      return res.status(401).json({
        success:false,
        message:"Invalid password",
      });

    }



    const token =
      jwt.sign(
        {
          id:user.id,
          email:user.email,
        },
        JWT_SECRET,
        {
          expiresIn:"7d",
        }
      );



    return res.json({

      success:true,
      message:"Login successful",

      token,

      user:{
        id:user.id,
        fullName:user.fullName,
        email:user.email,
        phone:user.phone,
        role:user.role,
      },

    });



  }catch(error){

    console.error(error);

    return res.status(500).json({
      success:false,
      message:"Login failed",
    });

  }

}





export async function forgotPassword(req,res){

  try{

    const {email}=req.body;


    const user =
      getUserByEmail(email);


    if(!user){

      return res.status(404).json({
        success:false,
        message:"User not found",
      });

    }


    const otp =
      Math.floor(
        100000 + Math.random()*900000
      ).toString();



    console.log("==================================");
    console.log("🔐 Password Reset OTP:",otp);
    console.log("📧 Email:",email);
    console.log("==================================");



    const expiresAt =
      new Date(
        Date.now()+10*60*1000
      ).toISOString();



    const db =
      getDatabase();



    db.run(
      `
      INSERT INTO password_resets
      (
        userId,
        otp,
        expiresAt
      )
      VALUES(?,?,?)
      `,
      [
        user.id,
        otp,
        expiresAt,
      ]
    );


    saveDatabase();



    return res.json({
      success:true,
      message:"OTP generated successfully",
      otp,
    });



  }catch(error){

    console.error(error);

    return res.status(500).json({
      success:false,
      message:"Forgot password failed",
    });

  }

}





export async function verifyOtp(req,res){

  try{

    const {
      email,
      otp,
    }=req.body;



    const user =
      getUserByEmail(email);



    if(!user){

      return res.status(404).json({
        success:false,
        message:"User not found",
      });

    }



    const db =
      getDatabase();



    const result =
      db.exec(
      `
      SELECT *
      FROM password_resets
      WHERE userId=?
      AND otp=?
      ORDER BY id DESC
      LIMIT 1
      `,
      [
        user.id,
        otp,
      ]
    );



    if(!result.length ||
       !result[0].values.length){

      return res.status(400).json({
        success:false,
        message:"Invalid OTP",
      });

    }



    return res.json({
      success:true,
      message:"OTP verified successfully",
    });



  }catch(error){

    console.error(error);

    return res.status(500).json({
      success:false,
      message:"OTP verification failed",
    });

  }

}





export async function resetPassword(req,res){

  try{

    const {
      email,
      password,
    }=req.body;



    const hashedPassword =
      await bcrypt.hash(
        password,
        10
      );



    const db =
      getDatabase();



    db.run(
      `
      UPDATE users
      SET password=?
      WHERE email=?
      `,
      [
        hashedPassword,
        email,
      ]
    );


    saveDatabase();



    return res.json({
      success:true,
      message:"Password updated successfully",
    });



  }catch(error){

    console.error(error);

    return res.status(500).json({
      success:false,
      message:"Reset password failed",
    });

  }

}
