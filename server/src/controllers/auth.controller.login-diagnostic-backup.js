import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import { query } from "../database/postgres.js";

import {
  createUser,
  getUserByEmail,
} from "../models/user.model.js";

const JWT_SECRET =
  process.env.JWT_SECRET || "fooddelivery_secret";


function createToken(user) {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
    },
    JWT_SECRET,
    {
      expiresIn: "7d",
    }
  );
}


function publicUser(user) {
  return {
    id: user.id,
    fullName: user.fullName,
    email: user.email,
    phone: user.phone,
    role: user.role,
  };
}


/* =========================
   SIGNUP
========================= */

export async function signup(req, res) {
  try {
    const {
      fullName,
      email,
      password,
      phone,
    } = req.body;

    if (!fullName || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const normalizedEmail =
      String(email).trim().toLowerCase();

    const existingUser =
      await getUserByEmail(normalizedEmail);

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "Email already registered",
      });
    }

    const hashedPassword =
      await bcrypt.hash(password, 10);

    const user =
      await createUser({
        fullName: String(fullName).trim(),
        email: normalizedEmail,
        phone: phone || null,
        password: hashedPassword,
      });

    const token = createToken(user);

    return res.status(201).json({
      success: true,
      message: "Account created successfully",
      token,
      user: publicUser(user),
    });

  } catch (error) {
    console.error("Signup error:", error);

    return res.status(500).json({
      success: false,
      message: "Signup failed",
    });
  }
}


/* =========================
   LOGIN
========================= */

export async function login(req, res) {
  try {
    const {
      email,
      password,
    } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const normalizedEmail =
      String(email).trim().toLowerCase();

    const user =
      await getUserByEmail(normalizedEmail);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const isMatch =
      await bcrypt.compare(
        password,
        user.password
      );

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid password",
      });
    }

    const token = createToken(user);

    return res.json({
      success: true,
      message: "Login successful",
      token,
      user: publicUser(user),
    });

  } catch (error) {
    console.error("Login error:", error);

    return res.status(500).json({
      success: false,
      message: "Login failed",
    });
  }
}


/* =========================
   FORGOT PASSWORD
========================= */

export async function forgotPassword(req, res) {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    const normalizedEmail =
      String(email).trim().toLowerCase();

    const user =
      await getUserByEmail(normalizedEmail);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const otp =
      Math.floor(
        100000 + Math.random() * 900000
      ).toString();

    const expiresAt =
      new Date(
        Date.now() + 10 * 60 * 1000
      );

    await query(
      `
      INSERT INTO password_resets
      (
        "userId",
        otp,
        "expiresAt"
      )
      VALUES ($1, $2, $3)
      `,
      [
        user.id,
        otp,
        expiresAt,
      ]
    );

    console.log("==================================");
    console.log("🔐 Password Reset OTP:", otp);
    console.log("📧 Email:", normalizedEmail);
    console.log("==================================");

    return res.json({
      success: true,
      message: "OTP generated successfully",
      otp,
    });

  } catch (error) {
    console.error("Forgot password error:", error);

    return res.status(500).json({
      success: false,
      message: "Forgot password failed",
    });
  }
}


/* =========================
   VERIFY OTP
========================= */

export async function verifyOtp(req, res) {
  try {
    const {
      email,
      otp,
    } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: "Email and OTP are required",
      });
    }

    const normalizedEmail =
      String(email).trim().toLowerCase();

    const user =
      await getUserByEmail(normalizedEmail);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const result = await query(
      `
      SELECT *
      FROM password_resets
      WHERE "userId" = $1
        AND otp = $2
        AND "expiresAt" > CURRENT_TIMESTAMP
      ORDER BY id DESC
      LIMIT 1
      `,
      [
        user.id,
        String(otp).trim(),
      ]
    );

    if (!result.rows.length) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired OTP",
      });
    }

    return res.json({
      success: true,
      message: "OTP verified successfully",
    });

  } catch (error) {
    console.error("Verify OTP error:", error);

    return res.status(500).json({
      success: false,
      message: "OTP verification failed",
    });
  }
}


/* =========================
   RESET PASSWORD
========================= */

export async function resetPassword(req, res) {
  try {
    const {
      email,
      password,
    } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const normalizedEmail =
      String(email).trim().toLowerCase();

    const user =
      await getUserByEmail(normalizedEmail);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const hashedPassword =
      await bcrypt.hash(password, 10);

    await query(
      `
      UPDATE users
      SET
        password = $1,
        "updatedAt" = CURRENT_TIMESTAMP
      WHERE id = $2
      `,
      [
        hashedPassword,
        user.id,
      ]
    );

    await query(
      `
      DELETE FROM password_resets
      WHERE "userId" = $1
      `,
      [user.id]
    );

    return res.json({
      success: true,
      message: "Password updated successfully",
    });

  } catch (error) {
    console.error("Reset password error:", error);

    return res.status(500).json({
      success: false,
      message: "Reset password failed",
    });
  }
}
