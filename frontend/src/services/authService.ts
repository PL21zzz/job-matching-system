import api from "@/src/lib/axios";

export const authService = {
  getProfileMe: (): Promise<any> => {
    return api.get("/users/profile/me");
  },
};
