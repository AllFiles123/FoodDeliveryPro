import { Router } from "express";

import {
  getSettings,
  updateSettings,
} from "../controllers/settings.controller.js";

import {
  authMiddleware,
} from "../middleware/auth.middleware.js";

const router = Router();

router.get("/", authMiddleware, getSettings);

router.put("/", authMiddleware, updateSettings);

export default router;
