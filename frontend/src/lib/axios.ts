import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// 1. Request Interceptor: Kiểm tra an toàn môi trường Client trước khi bốc Token
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("access_token");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// 2. Response Interceptor: Xử lý dữ liệu sạch + Âm thầm Refresh Token nâng cao
api.interceptors.response.use(
  (res) => {
    // Trả ra luôn dữ liệu sạch từ Backend (bỏ qua bọc vỏ của Axios)
    return res.data;
  },
  async (error) => {
    const originalRequest = error.config;

    // Nếu không có error.response hoặc request lỗi mạng, quăng lỗi luôn
    if (!error.response) {
      return Promise.reject(error.message || "Lỗi kết nối mạng!");
    }

    const isAuthRequest =
      originalRequest.url?.includes("/auth/login") ||
      originalRequest.url?.includes("/auth/register") ||
      originalRequest.url?.includes("/auth/forgot-password");

    // Khớp lỗi 401 Unauthorized và chưa từng thử re-try, không phải request auth gốc
    if (
      error.response.status === 401 &&
      !originalRequest._retry &&
      !isAuthRequest &&
      typeof window !== "undefined"
    ) {
      originalRequest._retry = true;
      try {
        const rt = localStorage.getItem("refresh_token");
        if (!rt) throw new Error("No refresh token stored");

        // Gọi instance axios gốc (không dùng api instance này để tránh lặp vô hạn)
        const res = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"}/auth/refresh`,
          {},
          { headers: { Authorization: `Bearer ${rt}` } },
        );

        // Đổi token thành công -> Lưu bộ mới vào tủ
        const { access_token, refresh_token } = res.data; // Backend bốc ra tùy cấu trúc của sếp nhé
        localStorage.setItem("access_token", access_token);
        localStorage.setItem("refresh_token", refresh_token);

        // Đính token mới vào request cũ và thực thi lại hành động của người dùng
        originalRequest.headers.Authorization = `Bearer ${access_token}`;
        return axios(originalRequest).then((r) => r.data); // Ép trả dữ liệu sạch tương thích luôn
      } catch (err) {
        // Refresh thất bại (hết hạn cả hai) -> Lau sạch tủ đồ, đá về login
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");

        if (window.location.pathname !== "/login") {
          window.location.href = "/login";
        }
        return Promise.reject(
          "Phiên làm việc đã hết hạn hoàn toàn, vui lòng đăng nhập lại!",
        );
      }
    }

    // Trả về chuỗi lỗi sạch đã bóc tách từ backend cho component dễ hiển thị
    const backendMessage = error.response?.data?.message || "Đã có lỗi xảy ra";
    return Promise.reject(backendMessage);
  },
);

export default api;
