import api from "./api";

const profileService = {
  async getProfile() {
    const response = await api.get("/profile");
    return response.data;
  },

  async updateProfile(data) {
    const response = await api.put("/profile", {
      fullName: data?.fullName?.trim?.() || "",
      phone: data?.phone?.trim?.() || "",
    });

    return response.data;
  },
};

export default profileService;
