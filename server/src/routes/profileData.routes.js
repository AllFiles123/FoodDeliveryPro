import { Router } from "express";

import {
  getFullProfileController,
  updateFullProfileController,
  updateAddressesController,
  updatePaymentsController,
  updateNotificationsController,
  updateFavouritesController
} from "../controllers/profileData.controller.js";

import { authMiddleware } from "../middleware/auth.middleware.js";

const router = Router();

router.get("/", authMiddleware, getFullProfileController);

router.put("/", authMiddleware, updateFullProfileController);

router.put(
  "/addresses",
  authMiddleware,
  updateAddressesController
);

router.put(
  "/payments",
  authMiddleware,
  updatePaymentsController
);

router.put(
  "/notifications",
  authMiddleware,
  updateNotificationsController
);

router.put(
  "/favourites",
  authMiddleware,
  updateFavouritesController
);

export default router;
