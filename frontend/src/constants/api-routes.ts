export const API_ROUTES = {
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    COMPLETE_ONBOARDING: "/users/profile/edit", // Endpoint sau khi gom nhóm
  },
  USER: {
    GET_PROFILE: "/users/profile/me",
    UPDATE_PROFILE: "/users/profile/edit",
  },
  JOBS: {
    LIST: "/jobs",
    DETAIL: (id: string) => `/jobs/${id}`,
  },
} as const; // Dùng "as const" để biến các chuỗi này thành Read-Only (không thể bị sửa đổi ngầm)
