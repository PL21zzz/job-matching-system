import api from "@/src/lib/axios";

export interface Story {
  id: string;
  title?: string;
  content: string;
  authorName: string;
  authorRole: string;
  avatarUrl?: string;
  status: "DRAFT" | "PUBLISHED";
  createdAt: string;
}

export const storyService = {
  list: (): Promise<Story[]> => api.get("/stories"),
  mine: (): Promise<Story[]> => api.get("/stories/mine"),
  create: (data: Partial<Story>) => api.post("/stories", data),
  update: (id: string, data: Partial<Story>) => api.patch(`/stories/${id}`, data),
  remove: (id: string) => api.delete(`/stories/${id}`),
};
