import {
  getProfileData,
  updateProfileData,
  addAddress,
  updateAddress,
  deleteAddress,
  addPaymentMethod,
  deletePaymentMethod,
  markNotificationRead,
} from "../models/profile.model.js";

export async function getProfile(req, res) {
  try {
    const data = await getProfileData(req.user.id);

    res.json({
      success: true,
      ...data,
    });
  } catch (error) {
    console.error("Get profile error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to get profile",
    });
  }
}

export async function updateProfile(req, res) {
  try {
    const data = await updateProfileData(
      req.user.id,
      req.body || {}
    );

    res.json({
      success: true,
      message: "Profile updated successfully",
      ...data,
    });
  } catch (error) {
    console.error("Update profile error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update profile",
    });
  }
}

export async function createAddress(req, res) {
  try {
    if (!req.body?.address) {
      return res.status(400).json({
        success: false,
        message: "Address is required",
      });
    }

    const address = await addAddress(
      req.user.id,
      req.body
    );

    res.status(201).json({
      success: true,
      address,
    });
  } catch (error) {
    console.error("Create address error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create address",
    });
  }
}

export async function editAddress(req, res) {
  try {
    const address = await updateAddress(
      req.user.id,
      req.params.id,
      req.body || {}
    );

    if (!address) {
      return res.status(404).json({
        success: false,
        message: "Address not found",
      });
    }

    res.json({
      success: true,
      address,
    });
  } catch (error) {
    console.error("Update address error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update address",
    });
  }
}

export async function removeAddress(req, res) {
  try {
    const address = await deleteAddress(
      req.user.id,
      req.params.id
    );

    if (!address) {
      return res.status(404).json({
        success: false,
        message: "Address not found",
      });
    }

    res.json({
      success: true,
      message: "Address deleted successfully",
    });
  } catch (error) {
    console.error("Delete address error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete address",
    });
  }
}

export async function createPaymentMethod(req, res) {
  try {
    const payment = await addPaymentMethod(
      req.user.id,
      req.body || {}
    );

    res.status(201).json({
      success: true,
      payment,
    });
  } catch (error) {
    console.error("Create payment method error:", error);

    res.status(400).json({
      success: false,
      message: error.message || "Failed to create payment method",
    });
  }
}

export async function removePaymentMethod(req, res) {
  try {
    const payment = await deletePaymentMethod(
      req.user.id,
      req.params.id
    );

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: "Payment method not found",
      });
    }

    res.json({
      success: true,
      message: "Payment method deleted successfully",
    });
  } catch (error) {
    console.error("Delete payment method error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete payment method",
    });
  }
}

export async function readNotification(req, res) {
  try {
    const notification = await markNotificationRead(
      req.user.id,
      req.params.id
    );

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found",
      });
    }

    res.json({
      success: true,
      notification,
    });
  } catch (error) {
    console.error("Read notification error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update notification",
    });
  }
}
