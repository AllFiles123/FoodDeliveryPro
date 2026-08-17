import {
  getUserById,
  updateUserProfile,
} from "../models/user.model.js";

export async function getProfile(req, res) {
  try {
    if (!req.user?.id) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const user = await getUserById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("❌ Get profile error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to get profile",
    });
  }
}

export async function updateProfile(req, res) {
  try {
    if (!req.user?.id) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const fullName =
      typeof req.body?.fullName === "string"
        ? req.body.fullName.trim()
        : "";

    const phone =
      typeof req.body?.phone === "string"
        ? req.body.phone.trim()
        : "";

    if (!fullName) {
      return res.status(400).json({
        success: false,
        message: "Full name is required",
      });
    }

    if (!phone) {
      return res.status(400).json({
        success: false,
        message: "Phone number is required",
      });
    }

    const user = await updateUserProfile({
      id: req.user.id,
      fullName,
      phone,
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user,
    });
  } catch (error) {
    console.error("❌ Update profile error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update profile",
    });
  }
}
