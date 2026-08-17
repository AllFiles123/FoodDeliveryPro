import express from "express";

import {
  trackSearch,
  searchAll,
  getRestaurantTopSearches,
  getGlobalTopSearches,
} from "../controllers/search.controller.js";

const router = express.Router();

router.get(
  "/",
  searchAll
);

router.get(
  "/top-queries",
  getGlobalTopSearches
);

router.get(
  "/top",
  getGlobalTopSearches
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
