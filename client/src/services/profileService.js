import api from "./api";

const profileService = {
  async getFullProfile() {
    const response = await api.get("/profile-data");
    return response.data?.data || null;
  },

  async updateProfile(data) {
    const response = await api.put("/profile-data", data);
    return response.data?.data || null;
  },

  async updateAddresses(addresses) {
    const response = await api.put("/profile-data/addresses", {
      addresses
    });
    return response.data?.data || null;
  },

  async updatePaymentMethods(paymentMethods) {
    const response = await api.put("/profile-data/payments", {
      paymentMethods
    });
    return response.data?.data || null;
  },

  async updateNotifications(notifications) {
    const response = await api.put("/profile-data/notifications", {
      notifications
    });
    return response.data?.data || null;
  },

  async updateFavourites(favourites) {
    const response = await api.put("/profile-data/favourites", {
      favourites
    });
    return response.data?.data || null;
  }
};

export default profileService;
