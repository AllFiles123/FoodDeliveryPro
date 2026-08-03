import { Router } from "express";

import {
  placeOrder,
  myOrders,
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



export default router;
