import api from "@/src/lib/axios";

export const authService = {
  getProfileMe: async (): Promise<any> => {
    const response = await api.get("/users/profile/me");
    return response.data?.data || response.data || response;
  },

  updateProfile: async (payload: any): Promise<any> => {
    return api.patch("/users/profile/edit", payload);
  },
};
