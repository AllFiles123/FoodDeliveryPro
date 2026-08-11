import {
  createSearchLog,
  searchRestaurantsAndFoods,
  getTopSearchFoodsByRestaurantId,
} from "../models/search.model.js";

export async function trackSearch(req, res) {
  try {
    const {
      query,
      restaurantId,
      foodId,
    } = req.body;

    if (!query || !String(query).trim()) {
      return res.status(400).json({
        success: false,
        message: "Search query is required",
      });
    }

    createSearchLog({
      userId: req.user?.id || null,
      query,
      restaurantId,
      foodId,
    });

    return res.status(201).json({
      success: true,
      message: "Search tracked",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to track search",
    });
  }
}

export async function searchAll(req, res) {
  try {
    const query = String(
      req.query.q || ""
    ).trim();

    if (!query) {
      return res.json({
        success: true,
        query: "",
        restaurants: [],
        foods: [],
      });
    }

    const results =
      searchRestaurantsAndFoods(query);

    createSearchLog({
      userId: req.user?.id || null,
      query,
    });

    return res.json({
      success: true,
      query,
      ...results,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Search failed",
    });
  }
}

export async function getRestaurantTopSearches(
  req,
  res
) {
  try {
    const foods =
      getTopSearchFoodsByRestaurantId(
        req.params.restaurantId
      );

    return res.json({
      success: true,
      foods,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to get top search items",
    });
  }
}
