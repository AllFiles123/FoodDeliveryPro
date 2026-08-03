import express from "express";

import {
  createFoodController,
  getRestaurantFoods,
  getSingleFood,
} from "../controllers/food.controller.js";


const router = express.Router();



router.get(
  "/restaurant/:restaurantId",
  getRestaurantFoods
);



router.get(
  "/:id",
  getSingleFood
);



router.post(
  "/",
  createFoodController
);



export default router;
