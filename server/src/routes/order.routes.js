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



router.post(
  "/",
  authMiddleware,
  placeOrder
);



router.get(
  "/",
  authMiddleware,
  myOrders
);



// User order tracking
router.get(
  "/:id/track",
  authMiddleware,
  trackOrder
);



// Cancel order
router.patch(
  "/:id/cancel",
  authMiddleware,
  cancelMyOrder
);



// Update status
// Later admin panel এ ব্যবহার হবে
router.patch(
  "/:id/status",
  authMiddleware,
  changeOrderStatus
);



export default router;
