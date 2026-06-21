import { jwtDecode } from "jwt-decode";
import { create } from "zustand";

interface AuthState {
  user: any | null;
  isAuthenticated: boolean;
  isHydrated: boolean; // Cờ chặn bảo vệ App khi đang nạp token
  setAuth: (user: any) => void;
  syncAuth: () => void; // Hàm đồng bộ tối cao khi F5
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isHydrated: false, // Ban đầu chưa nạp xong token thì bằng false

  setAuth: (user) => set({ user, isAuthenticated: true, isHydrated: true }),

  // 🚀 CHÍ MẠNG: Hàm cứu cánh cho sếp khi F5
  syncAuth: () => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("access_token");
      if (token) {
        try {
          const decodedUser: any = jwtDecode(token);

          // Kiểm tra hạn Token phòng hờ token rác làm sập app
          if (decodedUser.exp && decodedUser.exp * 1000 > Date.now()) {
            set({ user: decodedUser, isAuthenticated: true, isHydrated: true });
            return;
          }
        } catch (e) {
          console.error("Token lỗi không decode được:", e);
        }
      }
      // Nếu không có token hoặc token lỗi/hết hạn thì giải phóng loading để app chạy tiếp
      set({ user: null, isAuthenticated: false, isHydrated: true });
    }
  },

  logout: () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    set({ user: null, isAuthenticated: false, isHydrated: true });
  },
}));
