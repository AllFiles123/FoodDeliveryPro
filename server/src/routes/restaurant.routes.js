import express from "express";

import {
  createRestaurantController,
  getAllRestaurants,
  getSingleRestaurant,
  getRestaurantFeaturedFoods,
} from "../controllers/restaurant.controller.js";

const router = express.Router();

router.get(
  "/",
  getAllRestaurants
);

router.get(
  "/:id/featured",
  getRestaurantFeaturedFoods
);

router.get(
  "/:id",
  getSingleRestaurant
);

router.post(
  "/",
  createRestaurantController
);

export default router;
