import express from "express";

import {
  trackSearch,
  searchAll,
  getRestaurantTopSearches,
} from "../controllers/search.controller.js";

const router = express.Router();

router.get(
  "/",
  searchAll
);

router.post(
  "/track",
  trackSearch
);

router.get(
  "/restaurant/:restaurantId/top",
  getRestaurantTopSearches
);

export default router;
