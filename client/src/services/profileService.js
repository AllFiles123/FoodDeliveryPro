import api from "./api";

const profileService = {
  getProfile: async () => {
    const response = await api.get("/profile");
    return response.data;
  },

  updateProfile: async (data) => {
    const response = await api.put("/profile", data);
    return response.data;
  },

  addAddress: async (data) => {
    const response = await api.post("/profile/addresses", data);
    return response.data;
  },

  updateAddress: async (id, data) => {
    const response = await api.put(`/profile/addresses/${id}`, data);
    return response.data;
  },

  deleteAddress: async (id) => {
    const response = await api.delete(`/profile/addresses/${id}`);
    return response.data;
  },

  addPaymentMethod: async (data) => {
    const response = await api.post("/profile/payment-methods", data);
    return response.data;
  },

  deletePaymentMethod: async (id) => {
    const response = await api.delete(`/profile/payment-methods/${id}`);
    return response.data;
  },

  markNotificationRead: async (id) => {
    const response = await api.patch(`/profile/notifications/${id}/read`);
    return response.data;
  },
};

export default profileService;
