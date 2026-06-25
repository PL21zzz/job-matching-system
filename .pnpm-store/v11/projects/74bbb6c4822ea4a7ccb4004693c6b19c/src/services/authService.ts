import api from "@/src/lib/axios";

const baseURL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export const authService = {
  getProfileMe: async (): Promise<any> => {
    const response = await api.get("/users/profile/me");
    return response.data?.data || response.data || response;
  },

  getProfileMeSafe: async (): Promise<any | null> => {
    const tryFetchProfile = async () =>
      fetch(`${baseURL}/users/profile/me`, {
        credentials: "include",
      });

    let response = await tryFetchProfile();

    if (response.status === 401) {
      const refreshResponse = await fetch(`${baseURL}/auth/refresh`, {
        method: "POST",
        credentials: "include",
      });

      if (refreshResponse.ok) {
        response = await tryFetchProfile();
      }
    }

    if (!response.ok) {
      return null;
    }

    return response.json();
  },

  getProfileOptional: async (): Promise<any | null> => {
    const response = await fetch(`${baseURL}/users/profile/me`, {
      credentials: "include",
    });
    return response.ok ? response.json() : null;
  },

  logout: async (): Promise<any> => {
    return api.post("/auth/logout");
  },

  updateProfile: async (payload: any): Promise<any> => {
    return api.patch("/users/profile/edit", payload);
  },
};
