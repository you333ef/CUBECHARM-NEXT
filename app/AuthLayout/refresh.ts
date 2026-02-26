import axios from "axios";
import { getToken } from "./tokenMemory";
import { refreshToken } from "./Token_Manager";

const baseUrl = "http://localhost:5000/api";

const api = axios.create({
  baseURL: baseUrl,
  withCredentials: true,
});

// ================= REQUEST =================
api.interceptors.request.use(
  (config) => {
    const accessToken = getToken();

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ================= RESPONSE =================
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      const newAccessToken = await refreshToken();

      if (!newAccessToken) {
        window.location.href = "/AuthLayout/Login";
        return Promise.reject(error);
      }

      originalRequest.headers.Authorization =
        `Bearer ${newAccessToken}`;

      return api(originalRequest);
    }

    return Promise.reject(error);
  }
);

export default api;