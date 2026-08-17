import {
  getFullProfile,
  updateProfileData,
  replaceAddresses,
  replacePaymentMethods,
  replaceNotifications,
  replaceFavourites
} from "../models/profileData.model.js";

export async function getFullProfileController(req, res) {
  try {
    const profile = await getFullProfile(req.user.id);

    res.json({
      success: true,
      data: profile
    });
  } catch (error) {
    console.error("Get full profile error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to load profile"
    });
  }
}

export async function updateFullProfileController(req, res) {
  try {
    const profile = await updateProfileData(
      req.user.id,
      req.body || {}
    );

    res.json({
      success: true,
      message: "Profile updated successfully",
      data: profile
    });
  } catch (error) {
    console.error("Update full profile error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update profile"
    });
  }
}

export async function updateAddressesController(req, res) {
  try {
    const profile = await replaceAddresses(
      req.user.id,
      Array.isArray(req.body?.addresses)
        ? req.body.addresses
        : []
    );

    res.json({
      success: true,
      data: profile
    });
  } catch (error) {
    console.error("Update addresses error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update addresses"
    });
  }
}

export async function updatePaymentsController(req, res) {
  try {
    const profile = await replacePaymentMethods(
      req.user.id,
      Array.isArray(req.body?.paymentMethods)
        ? req.body.paymentMethods
        : []
    );

    res.json({
      success: true,
      data: profile
    });
  } catch (error) {
    console.error("Update payments error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update payment methods"
    });
  }
}

export async function updateNotificationsController(req, res) {
  try {
    const profile = await replaceNotifications(
      req.user.id,
      Array.isArray(req.body?.notifications)
        ? req.body.notifications
        : []
    );

    res.json({
      success: true,
      data: profile
    });
  } catch (error) {
    console.error("Update notifications error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update notifications"
    });
  }
}

export async function updateFavouritesController(req, res) {
  try {
    const profile = await replaceFavourites(
      req.user.id,
      Array.isArray(req.body?.favourites)
        ? req.body.favourites
        : []
    );

    res.json({
      success: true,
      data: profile
    });
  } catch (error) {
    console.error("Update favourites error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update favourites"
    });
  }
}
