import api from "./api";

const restaurantService = {
  getRestaurants: async () => {
    const response =
      await api.get("/restaurants");

    return response.data;
  },

  getRestaurantById: async (id) => {
    const response =
      await api.get(
        `/restaurants/${id}`
      );

    return response.data;
  },

  getFoodsByRestaurantId: async (
    restaurantId
  ) => {
    const response =
      await api.get(
        `/foods/restaurant/${restaurantId}`
      );

    return response.data;
  },

  getFeaturedFoodsByRestaurantId: async (
    restaurantId
  ) => {
    const response =
      await api.get(
        `/restaurants/${restaurantId}/featured`
      );

    return response.data;
  },

  search: async (query) => {
    const response =
      await api.get("/search", {
        params: { q: query },
      });

    return response.data;
  },

  getTopSearchFoodsByRestaurantId: async (
    restaurantId
  ) => {
    const response =
      await api.get(
        `/search/restaurant/${restaurantId}/top`
      );

    return response.data;
  },

  trackSearch: async ({
    query,
    restaurantId,
    foodId,
  }) => {
    const response =
      await api.post(
        "/search/track",
        {
          query,
          restaurantId,
          foodId,
        }
      );

    return response.data;
  },
};

export default restaurantService;
