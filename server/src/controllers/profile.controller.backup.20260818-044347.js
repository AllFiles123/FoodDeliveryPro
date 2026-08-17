import {
  getUserById,
  updateUserProfile,
} from "../models/user.model.js";

export async function getProfile(req, res) {
  try {
    const user = await getUserById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.json({
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
    const { fullName, phone } = req.body;

    if (!fullName || !phone) {
      return res.status(400).json({
        success: false,
        message: "Full name and phone are required",
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

    return res.json({
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
