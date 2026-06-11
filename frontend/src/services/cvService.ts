import api from "@/src/lib/axios";

export interface CvInitProfileResponse {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  disabilityType: string;
}

export interface CvAiGeneratedResponse {
  jobTitle: string;
  summary: string;
  experienceBullets: string[];
  projects: { name: string; tech: string; desc: string }[];
  skills: { name: string; level: number }[];
  certifications: string[];
  awards: string[];
}

export const cvService = {
  getProfileForCvInit: async (): Promise<CvInitProfileResponse> => {
    return api.get("/users/profile/cv-init");
  },

  generateCvWithAi: async (
    jobId: string,
    templateId: string,
  ): Promise<CvAiGeneratedResponse> => {
    return api.post(
      "/resumes/generate-ai",
      { jobId, templateId },
      { timeout: 30000 },
    );
  },
};
