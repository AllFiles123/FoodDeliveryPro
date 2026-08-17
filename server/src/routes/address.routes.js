import { Router } from "express";

import {
  getAddresses,
  addAddress,
  removeAddress,
} from "../controllers/address.controller.js";

import {
  authMiddleware,
} from "../middleware/auth.middleware.js";

const router = Router();

router.get("/", authMiddleware, getAddresses);

router.post("/", authMiddleware, addAddress);

router.delete("/:id", authMiddleware, removeAddress);

export default router;
