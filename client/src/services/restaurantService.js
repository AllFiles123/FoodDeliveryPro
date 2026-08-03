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



  getFoodsByRestaurantId: async (restaurantId) => {

    const response =
      await api.get(
        `/foods/restaurant/${restaurantId}`
      );


    return response.data;

  },


};


export default restaurantService;
