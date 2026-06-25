export enum JobType {
  FULL_TIME = "FULL_TIME",
  PART_TIME = "PART_TIME",
  REMOTE = "REMOTE",
}

export enum JobStatus {
  OPEN = "OPEN",
  CLOSED = "CLOSED",
}

export interface Category {
  id: number;
  name: string;
}

export interface Employer {
  id: string;
  companyName: string;
  logoUrl?: string; // Để hiển thị avatar công ty trên Card
}

export interface Job {
  id: string;
  title: string;
  description: string;
  requirements: string;
  salaryMin: number | null;
  salaryMax: number | null;
  salaryText: string | null;
  location: string;
  type: JobType;
  status: JobStatus;
  accessibilityFeatures: string | null;
  createdAt: string;
  updatedAt: string;

  employer: Employer;
  category: Category;
}
