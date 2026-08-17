import { Router } from "express";

import {
  getProfile,
  updateProfile,
  createAddress,
  editAddress,
  removeAddress,
  createPaymentMethod,
  removePaymentMethod,
  readNotification,
} from "../controllers/profile.controller.js";

import {
  authMiddleware,
} from "../middleware/auth.middleware.js";

const router = Router();

router.use(authMiddleware);

router.get("/", getProfile);
router.put("/", updateProfile);

router.post("/addresses", createAddress);
router.put("/addresses/:id", editAddress);
router.delete("/addresses/:id", removeAddress);

router.post("/payment-methods", createPaymentMethod);
router.delete("/payment-methods/:id", removePaymentMethod);

router.patch("/notifications/:id/read", readNotification);

export default router;
