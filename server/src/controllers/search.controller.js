import {
  createSearchLog,
  searchRestaurantsAndFoods,
  getTopSearchFoodsByRestaurantId,
  getGlobalTopSearchQueries,
  getGlobalTopSearchFoods,
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

    await createSearchLog({
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
    const searchQuery = String(
      req.query.q || ""
    ).trim();

    if (!searchQuery) {
      return res.json({
        success: true,
        query: "",
        restaurants: [],
        foods: [],
      });
    }

    const results =
      await searchRestaurantsAndFoods(searchQuery);

    await createSearchLog({
      userId: req.user?.id || null,
      query: searchQuery,
    });

    return res.json({
      success: true,
      query: searchQuery,
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
      await getTopSearchFoodsByRestaurantId(
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

export async function getGlobalTopSearches(
  req,
  res
) {
  try {
    const limit =
      Number(req.query.limit) || 10;

    const foods =
      await getGlobalTopSearchFoods(limit);

    return res.json({
      success: true,
      foods,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to get global top searches",
    });
  }
}
