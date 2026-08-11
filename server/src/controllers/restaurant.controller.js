import {
  createRestaurant,
  getRestaurants,
  getRestaurantById,
} from "../models/restaurant.model.js";

import {
  getBestSellingFoodsByRestaurantId,
} from "../models/restaurantStats.model.js";

export async function createRestaurantController(req, res) {
  try {
    const restaurant =
      createRestaurant(req.body);

    return res.status(201).json({
      success: true,
      message: "Restaurant created successfully",
      restaurant,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to create restaurant",
    });
  }
}

export async function getAllRestaurants(req, res) {
  try {
    const restaurants =
      getRestaurants();

    return res.json({
      success: true,
      restaurants,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to get restaurants",
    });
  }
}

export async function getSingleRestaurant(req, res) {
  try {
    const restaurant =
      getRestaurantById(
        req.params.id
      );

    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: "Restaurant not found",
      });
    }

    return res.json({
      success: true,
      restaurant,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to get restaurant",
    });
  }
}

export async function getRestaurantFeaturedFoods(
  req,
  res
) {
  try {
    const foods =
      getBestSellingFoodsByRestaurantId(
        req.params.id
      );

    return res.json({
      success: true,
      foods,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to get featured foods",
    });
  }
}
