import api from "@/src/lib/axios";

const baseURL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export const authService = {
  getProfileMe: async (): Promise<any> => {
    const response = await api.get("/users/profile/me");
    return response.data?.data || response.data || response;
  },

  getProfileMeSafe: async (): Promise<any | null> => {
    try {
      const response: any = await api.get("/users/profile/me");
      return response.data?.data || response.data || response;
    } catch {
      return null;
    }
  },

  getProfileOptional: async (): Promise<any | null> => {
    try {
      const response: any = await api.get("/users/profile/me");
      return response.data?.data || response.data || response;
    } catch {
      return null;
    }
  },

  logout: async (): Promise<any> => {
    try {
      await api.post("/auth/logout");
    } finally {
      if (typeof window !== "undefined") {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
      }
    }
  },

  updateProfile: async (payload: any): Promise<any> => {
    return api.patch("/users/profile/edit", payload);
  },
};
