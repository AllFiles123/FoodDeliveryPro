import {
  getPaymentMethodsByUser,
  createPaymentMethod,
  deletePaymentMethod,
} from "../models/payment.model.js";


export async function getPayments(req, res) {

  try {

    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const payments = await getPaymentMethodsByUser(userId);

    return res.json({
      success: true,
      payments,
    });

  } catch (error) {

    console.error("❌ Get payments error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to get payment methods",
    });

  }

}


export async function addPayment(req, res) {

  try {

    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const result = await createPaymentMethod({
      userId,
      type: req.body?.type,
      cardHolder: req.body?.cardHolder,
      lastFour: req.body?.lastFour,
      brand: req.body?.brand,
      isDefault: req.body?.isDefault,
    });

    return res.status(201).json({
      success: true,
      message: "Payment method added successfully",
      payment: result,
    });

  } catch (error) {

    console.error("❌ Add payment error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to add payment method",
    });

  }

}


export async function removePayment(req, res) {

  try {

    const userId = req.user?.id;
    const id = req.params.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const result = await deletePaymentMethod(id, userId);

    if (!result) {
      return res.status(404).json({
        success: false,
        message: "Payment method not found",
      });
    }

    return res.json({
      success: true,
      message: "Payment method removed successfully",
    });

  } catch (error) {

    console.error("❌ Remove payment error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to remove payment method",
    });

  }

}
