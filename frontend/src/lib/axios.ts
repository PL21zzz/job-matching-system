import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000",
});

// Gắn Access Token vào Header (Giữ nguyên)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Xử lý Refresh Token tự động khi gặp lỗi 401
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;

    // Thì không cần tự động refresh token làm gì (vì lúc này đã đăng nhập đâu mà hết hạn)
    const isAuthRequest =
      originalRequest.url?.includes("/auth/login") ||
      originalRequest.url?.includes("/auth/register") ||
      originalRequest.url?.includes("/auth/forgot-password");

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !isAuthRequest
    ) {
      originalRequest._retry = true;
      try {
        const rt = localStorage.getItem("refresh_token");

        // Nếu không tìm thấy refresh_token trong máy thì văng lỗi luôn khỏi gọi API phí tài nguyên
        if (!rt) throw new Error("No refresh token");

        const res = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"}/auth/refresh`,
          {},
          {
            headers: { Authorization: `Bearer ${rt}` },
          },
        );

        localStorage.setItem("access_token", res.data.access_token);
        localStorage.setItem("refresh_token", res.data.refresh_token);

        return api(originalRequest);
      } catch (err) {
        localStorage.clear();

        // Nếu đang ở sẵn trang /login rồi thì TUYỆT ĐỐI không gọi window.location.href để tránh bị F5 trang vô hạn
        if (
          typeof window !== "undefined" &&
          window.location.pathname !== "/login"
        ) {
          window.location.href = "/login";
        }
        return Promise.reject(err);
      }
    }
    return Promise.reject(error);
  },
);

export default api;
