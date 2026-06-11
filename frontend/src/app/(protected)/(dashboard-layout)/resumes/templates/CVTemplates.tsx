"use client";

import { CreativeWaveTemplate } from "./components/CreativeWave";
import { MinimalistElegantTemplate } from "./components/MinimalistElegant";
import { ModernCreativeTemplate } from "./components/ModernCreative";

export interface CVDataProps {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  jobTitle: string;
  summary: string;
  experienceBullets: string[];
  education: { school: string; major: string; year: string }[];
  skills: { name: string; level: number }[];
  projects?: { name: string; tech: string; desc: string }[];
  certifications?: string[];
  awards?: string[];
  isDemo?: boolean;
  disabilityType?: string;
}

export const AVAILABLE_TEMPLATES = [
  {
    id: "template-canva-creative-1",
    name: "Mẫu Canva Đen Trắng Giãn Đều",
    Component: CreativeWaveTemplate,
  },
  {
    id: "template-canva-elegant-2",
    name: "Mẫu Canva Thanh Lịch Tối Giản",
    Component: MinimalistElegantTemplate,
  },
  {
    id: "template-canva-retro-3",
    name: "Mẫu Canva Hiện Đại Trẻ Trung",
    Component: ModernCreativeTemplate,
  },
];
