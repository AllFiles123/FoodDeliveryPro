import api from "./api";

const authService = {
  login: async (data) => {
    const response = await api.post("/auth/login", data);

    return response.data;
  },

  signup: async (data) => {
    const response = await api.post("/auth/signup", data);

    return response.data;
  },

  forgotPassword: async (data) => {
    const response = await api.post(
      "/auth/forgot-password",
      data
    );

    return response.data;
  },

  verifyOtp: async (data) => {
    const response = await api.post(
      "/auth/verify-otp",
      data
    );

    return response.data;
  },

  resendOtp: async (data) => {
    const response = await api.post(
      "/auth/resend-otp",
      data
    );

    return response.data;
  },
};

export default authService;
