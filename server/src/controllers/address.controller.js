import {
  getAddressesByUser,
  createAddress,
  deleteAddress,
} from "../models/address.model.js";


export async function getAddresses(req, res) {

  try {

    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const addresses = await getAddressesByUser(userId);

    return res.json({
      success: true,
      addresses,
    });

  } catch (error) {

    console.error("❌ Get addresses error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to get addresses",
    });

  }

}


export async function addAddress(req, res) {

  try {

    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const address = String(req.body?.address || "").trim();

    if (!address) {
      return res.status(400).json({
        success: false,
        message: "Address is required",
      });
    }

    const result = await createAddress({
      userId,
      label: req.body?.label,
      address,
      city: req.body?.city,
      phone: req.body?.phone,
      isDefault: req.body?.isDefault,
    });

    return res.status(201).json({
      success: true,
      message: "Address added successfully",
      address: result,
    });

  } catch (error) {

    console.error("❌ Add address error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to add address",
    });

  }

}


export async function removeAddress(req, res) {

  try {

    const userId = req.user?.id;
    const id = req.params.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const result = await deleteAddress(id, userId);

    if (!result) {
      return res.status(404).json({
        success: false,
        message: "Address not found",
      });
    }

    return res.json({
      success: true,
      message: "Address removed successfully",
    });

  } catch (error) {

    console.error("❌ Remove address error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to remove address",
    });

  }

}
