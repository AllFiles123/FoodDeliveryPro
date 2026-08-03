import { Router } from "express";

import {
  getProfile,
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


export default router;
