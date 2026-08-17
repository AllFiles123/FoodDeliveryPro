import { Router } from "express";

import {
  placeOrder,
  myOrders,
  cancelMyOrder,
  trackOrder,
  changeOrderStatus,
} from "../controllers/order.controller.js";

import {
  authMiddleware,
} from "../middleware/auth.middleware.js";


const router = Router();


/*
  Place Order
  POST /api/orders
*/
router.post(
  "/",
  authMiddleware,
  placeOrder
);


/*
  My Orders
  GET /api/orders
*/
router.get(
  "/",
  authMiddleware,
  myOrders
);


/*
  Order Details
  GET /api/orders/:id
*/
router.get(
  "/:id",
  authMiddleware,
  trackOrder
);


/*
  Order Tracking
  GET /api/orders/:id/track
*/
router.get(
  "/:id/track",
  authMiddleware,
  trackOrder
);


/*
  Cancel Order
  PATCH /api/orders/:id/cancel
*/
router.patch(
  "/:id/cancel",
  authMiddleware,
  cancelMyOrder
);


/*
  Update Order Status
  PATCH /api/orders/:id/status

  Later admin/rider panel can use this.
*/
router.patch(
  "/:id/status",
  authMiddleware,
  changeOrderStatus
);


export default router;
