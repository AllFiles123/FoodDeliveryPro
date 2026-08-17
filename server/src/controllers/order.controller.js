import {
  createOrder,
  getOrdersByUser,
  cancelOrder,
  updateOrderStatus,
  getOrderById,
} from "../models/order.model.js";


export async function placeOrder(req, res) {
  try {
    const {
      items,
      totalAmount,
      paymentMethod,
      address,
      deliveryCharge,
      customerName,
      customerPhone,
      deliveryType,
      zone,
      division,
      district,
      upazila,
      area,
      fullAddress,
      subtotal,
      vat,
      discount,
      restaurantName,
      orderStatus,
      status,
      trackingStatus,
      trackingHistory,
    } = req.body;


    if (
      !items ||
      !Array.isArray(items) ||
      items.length === 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Cart is empty",
      });
    }


    if (!customerName || !customerPhone) {
      return res.status(400).json({
        success: false,
        message: "Customer information required",
      });
    }


    if (!paymentMethod) {
      return res.status(400).json({
        success: false,
        message: "Payment method required",
      });
    }


    if (!address && !fullAddress) {
      return res.status(400).json({
        success: false,
        message: "Delivery address required",
      });
    }


    console.log("REQ USER =", req.user);
    console.log("REQ USER ID =", req.user?.id);


    const order = await createOrder({
      userId: req.user.id,
      items,
      totalAmount,
      paymentMethod,
      address: address || fullAddress,
      deliveryCharge,
      customerName,
      customerPhone,
      deliveryType,
      zone,
      division,
      district,
      upazila,
      area,
      fullAddress,
      subtotal,
      vat,
      discount,
      restaurantName: restaurantName || "",
      status: status || orderStatus || "Pending",
      orderStatus: orderStatus || status || "Pending",
      trackingStatus: trackingStatus || orderStatus || status || "Pending",
      trackingHistory: trackingHistory || [
        {
          status: orderStatus || status || "Pending",
          time: new Date().toISOString(),
        },
      ],
      paymentStatus:
        paymentMethod === "Cash on Delivery"
          ? "Pending"
          : "Paid",
    });


    return res.status(201).json({
      success: true,
      message: "Order placed successfully",
      order,
    });


  } catch (error) {
    console.error(error);


    return res.status(500).json({
      success: false,
      message: "Order failed",
    });
  }
}


export async function myOrders(req, res) {
  try {
    console.log("===== MY ORDERS DEBUG =====");
    console.log("REQ USER:", req.user);
    console.log("REQ USER ID:", req.user?.id);
    console.log("REQ USER ID TYPE:", typeof req.user?.id);

    const orders = await getOrdersByUser(
      req.user.id
    );

    console.log("ORDERS FOUND:", orders.length);


    return res.json({
      success: true,
      orders,
    });


  } catch (error) {
    console.error(error);


    return res.status(500).json({
      success: false,
      message: "Failed to load orders",
    });
  }
}


export async function cancelMyOrder(req, res) {
  try {
    const result = await cancelOrder(
      req.params.id,
      req.user.id
    );


    if (!result) {
      return res.status(400).json({
        success: false,
        message:
          "Order not found or cannot be cancelled",
      });
    }


    return res.json({
      success: true,
      message: "Order cancelled successfully",
      order: result,
    });


  } catch (error) {
    console.error(error);


    return res.status(500).json({
      success: false,
      message: "Cancel order failed",
    });
  }
}


export async function trackOrder(req, res) {
  try {
    const order = await getOrderById(
      req.params.id,
      req.user.id
    );


    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }


    return res.json({
      success: true,
      order,
    });


  } catch (error) {
    console.error(error);


    return res.status(500).json({
      success: false,
      message: "Tracking failed",
    });
  }
}


export async function changeOrderStatus(req, res) {
  try {
    const { status } = req.body;


    if (!status) {
      return res.status(400).json({
        success: false,
        message: "Status required",
      });
    }


    const result =
      await updateOrderStatus(
        req.params.id,
        status
      );


    if (!result) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }


    return res.json({
      success: true,
      message: "Order status updated successfully",
      order: result,
    });


  } catch (error) {
    console.error(error);


    return res.status(500).json({
      success: false,
      message: "Status update failed",
    });
  }
}
