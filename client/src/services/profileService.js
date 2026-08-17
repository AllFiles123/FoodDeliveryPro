import api from "./api";

const profileService = {
  async getProfile() {
    const response = await api.get("/profile");
    return response.data;
  },

  async updateProfile(data) {
    const response = await api.put("/profile", data);
    return response.data;
  },

  async addAddress(data) {
    const response = await api.post("/profile/addresses", data);
    return response.data;
  },

  async updateAddress(id, data) {
    const response = await api.put(`/profile/addresses/${id}`, data);
    return response.data;
  },

  async deleteAddress(id) {
    const response = await api.delete(`/profile/addresses/${id}`);
    return response.data;
  },

  async addPaymentMethod(data) {
    const response = await api.post("/profile/payment-methods", data);
    return response.data;
  },

  async deletePaymentMethod(id) {
    const response = await api.delete(`/profile/payment-methods/${id}`);
    return response.data;
  },

  async markNotificationRead(id) {
    const response = await api.patch(`/profile/notifications/${id}/read`);
    return response.data;
  },
};

export default profileService;
