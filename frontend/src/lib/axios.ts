import axios from "axios";
import { clearLegacyAuthStorage } from "./auth-storage";

const baseURL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

const api = axios.create({
  baseURL,
  withCredentials: true,
  timeout: 30000,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

api.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    const originalRequest = error.config;
    const isAuthRequest =
      originalRequest?.url?.includes("/auth/login") ||
      originalRequest?.url?.includes("/auth/register") ||
      originalRequest?.url?.includes("/auth/refresh");

    if (
      error.response?.status === 401 &&
      !originalRequest?._retry &&
      !isAuthRequest &&
      typeof window !== "undefined"
    ) {
      originalRequest._retry = true;
      try {
        const refreshToken = localStorage.getItem("refresh_token");
        const res: any = await axios.post(
          `${baseURL}/auth/refresh`,
          {},
          {
            withCredentials: true,
            headers: refreshToken
              ? { Authorization: `Bearer ${refreshToken}` }
              : {},
          },
        );

        const newAccessToken = res.data?.access_token || res?.access_token;
        const newRefreshToken = res.data?.refresh_token || res?.refresh_token;

        if (newAccessToken) {
          localStorage.setItem("access_token", newAccessToken);
        }
        if (newRefreshToken) {
          localStorage.setItem("refresh_token", newRefreshToken);
        }

        if (newAccessToken && originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        }
        return api(originalRequest);
      } catch {
        clearLegacyAuthStorage();
        if (
          window.location.pathname !== "/login" &&
          window.location.pathname !== "/register"
        ) {
          window.location.href = "/login";
        }
      }
    }

    return Promise.reject(
      error.response?.data?.message || error.message || "Da co loi xay ra",
    );
  },
);

export default api;
