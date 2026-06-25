import api from "@/src/lib/axios";

export interface CareerAssistantHistoryItem {
  role: "user" | "assistant";
  content: string;
}

export interface CareerAssistantRequest {
  message: string;
  profileSummary?: string;
  accessibilityNeeds?: string;
  preferredLocation?: string;
  history?: CareerAssistantHistoryItem[];
}

export interface CareerAssistantSuggestedJob {
  id: string;
  title: string;
  location: string;
  type: string;
  salaryText?: string | null;
  accessibilityFeatures?: string | null;
  categoryName: string;
  companyName?: string | null;
  suitableDisabilities: string[];
  reasons: string[];
  detailPath: string;
}

export interface CareerAssistantResponse {
  transcript: string;
  answer: string;
  audioUrl?: string | null;
  source: string;
  suggestedJobs: CareerAssistantSuggestedJob[];
  followUpPrompts: string[];
}

export const careerAssistantService = {
  chat: async (
    payload: CareerAssistantRequest,
  ): Promise<CareerAssistantResponse> => {
    return api.post("/career-assistant/chat", payload, {
      timeout: 30000,
    });
  },
};
