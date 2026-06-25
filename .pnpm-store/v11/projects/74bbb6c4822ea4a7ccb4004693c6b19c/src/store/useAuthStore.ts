import { create } from "zustand";
import { authService } from "../services/authService";
import { clearLegacyAuthStorage } from "../lib/auth-storage";

interface AuthState {
  user: any | null;
  isAuthenticated: boolean;
  isHydrated: boolean;
  setAuth: (user: any) => void;
  syncAuth: () => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isHydrated: false,
  setAuth: (user) => set({ user, isAuthenticated: true, isHydrated: true }),
  syncAuth: async () => {
    try {
      const user = await authService.getProfileMeSafe();
      if (user) {
        set({ user, isAuthenticated: true, isHydrated: true });
        return;
      }

      clearLegacyAuthStorage();
      set({ user: null, isAuthenticated: false, isHydrated: true });
    } catch {
      clearLegacyAuthStorage();
      set({ user: null, isAuthenticated: false, isHydrated: true });
    }
  },
  logout: () => {
    clearLegacyAuthStorage();
    set({ user: null, isAuthenticated: false, isHydrated: true });
  },
}));
