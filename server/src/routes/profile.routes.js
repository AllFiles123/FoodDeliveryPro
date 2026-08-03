import { Router } from "express";

import {
  getProfile,
  updateProfile,
} from "../controllers/profile.controller.js";

import {
  authMiddleware,
} from "../middleware/auth.middleware.js";


const router = Router();


router.get(
  "/",
  authMiddleware,
  getProfile
);


router.put(
  "/",
  authMiddleware,
  updateProfile
);


export default router;
