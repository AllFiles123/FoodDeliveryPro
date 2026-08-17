import { Router } from "express";

import {
  getPayments,
  addPayment,
  removePayment,
} from "../controllers/payment.controller.js";

import {
  authMiddleware,
} from "../middleware/auth.middleware.js";

const router = Router();

router.get("/", authMiddleware, getPayments);

router.post("/", authMiddleware, addPayment);

router.delete("/:id", authMiddleware, removePayment);

export default router;
