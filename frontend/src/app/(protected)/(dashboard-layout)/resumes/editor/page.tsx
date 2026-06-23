// /src/app/(protected)/(dashboard-layout)/resumes/editor/page.tsx
"use client";

import { cvService } from "@/src/services/cvService";
import { ArrowLeft, Download, Loader2, Sparkles } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { AVAILABLE_TEMPLATES } from "../templates/CVTemplates";
import CVFormSidebar from "./components/CVFormSidebar";
import CVPreviewArea from "./components/CVPreviewArea";

export default function CVEditorPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // 🚀 TRẢ LẠI REF ĐỂ TRUYỀN XUỐNG FILE CON
  const cvRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingStatus, setLoadingStatus] = useState(
    "Đang bốc dữ liệu cá nhân từ hệ thống...",
  );

  const templateId =
    searchParams.get("templateId") || "template-canva-creative-1";
  const jobId = searchParams.get("jobId");

  const currentTemplate = AVAILABLE_TEMPLATES.find((t) => t.id === templateId);

  const [cvData, setCvData] = useState({
    fullName: "",
    jobTitle: "",
    email: "",
    phone: "",
    address: "",
    disabilityType: "",
    summary: "",
    experienceBullets: ["", "", ""],
    education: [
      {
        school: "University of Information and Communication Technology",
        major: "Software Engineering",
        year: "2022 - 2026",
      },
    ],
    skills: [
      { name: "", level: 80 },
      { name: "", level: 80 },
      { name: "", level: 80 },
    ],
    projects: [{ name: "", tech: "", desc: "" }],
    certifications: ["", ""],
    awards: ["", ""],
  });

  useEffect(() => {
    async function initCVData() {
      if (!jobId) {
        alert(
          "Thiếu tham số jobId công việc để trí tuệ nhân tạo (AI) bẻ lái CV!",
        );
        router.push("/resumes/templates");
        return;
      }
      try {
        setIsLoading(true);
        setLoadingStatus("Đang đồng bộ hồ sơ cá nhân và loại khuyết tật...");
        const profile = await cvService.getProfileForCvInit();

        let updatedData = { ...cvData };
        if (profile) {
          updatedData.fullName = profile.fullName;
          updatedData.email = profile.email;
          updatedData.phone = profile.phone || "Chưa cập nhật SĐT";
          updatedData.address = profile.address || "Chưa cập nhật địa chỉ";
          updatedData.disabilityType = profile.disabilityType || "";
        }

        setLoadingStatus(
          "Trí tuệ nhân tạo Gemini đang bóc tách JD và thiết kế CV tối ưu...",
        );
        const aiResult = await cvService.generateCvWithAi(jobId, templateId);

        if (aiResult) {
          setCvData({
            ...updatedData,
            jobTitle: aiResult.jobTitle,
            summary: aiResult.summary,
            experienceBullets: aiResult.experienceBullets,
            projects: aiResult.projects,
            skills: aiResult.skills,
            certifications: aiResult.certifications,
            awards: aiResult.awards,
          });
        }
      } catch (error) {
        console.error("Lỗi khởi tạo luồng dữ liệu CV:", error);
        alert(`Không thể sinh CV tự động: ${error}`);
      } finally {
        setIsLoading(false);
      }
    }
    initCVData();
  }, [jobId, templateId]);

  const handleExportPDF = () => {
    setIsExporting(true);
    try {
      window.print();
    } catch (error) {
      console.error("Lỗi kích hoạt luồng in:", error);
      alert("Không thể mở trình xuất PDF của hệ thống.");
    } finally {
      setIsExporting(false);
    }
  };

  const handleInputChange = (field: string, value: string) =>
    setCvData((prev) => ({ ...prev, [field]: value }));
  const handleBulletChange = (index: number, value: string) => {
    const updated = [...cvData.experienceBullets];
    updated[index] = value;
    setCvData((prev) => ({ ...prev, experienceBullets: updated }));
  };
  const handleEduChange = (index: number, field: string, value: string) => {
    const updated = [...cvData.education];
    updated[index] = { ...updated[index], [field]: value };
    setCvData((prev) => ({ ...prev, education: updated }));
  };
  const handleSkillChange = (
    index: number,
    field: string,
    value: string | number,
  ) => {
    const updated = [...cvData.skills];
    updated[index] = { ...updated[index], [field]: value };
    setCvData((prev) => ({ ...prev, skills: updated }));
  };
  const handleProjectChange = (index: number, field: string, value: string) => {
    const updated = [...cvData.projects];
    updated[index] = { ...updated[index], [field]: value };
    setCvData((prev) => ({ ...prev, projects: updated }));
  };
  const handleCertChange = (index: number, value: string) => {
    const updated = [...cvData.certifications];
    updated[index] = value;
    setCvData((prev) => ({ ...prev, certifications: updated }));
  };
  const handleAwardChange = (index: number, value: string) => {
    const updated = [...cvData.awards];
    updated[index] = value;
    setCvData((prev) => ({ ...prev, awards: updated }));
  };

  if (!currentTemplate)
    return (
      <div className="p-12 text-center text-red-500 font-bold">
        Mẫu CV không tồn tại!
      </div>
    );
  const SelectedTemplateComponent = currentTemplate.Component;

  if (isLoading) {
    return (
      <div className="h-screen w-screen bg-slate-950 flex flex-col justify-center items-center text-slate-100 space-y-4">
        <div className="relative flex items-center justify-center">
          <Loader2 className="text-blue-500 animate-spin" size={48} />
          <Sparkles
            className="text-amber-400 absolute animate-pulse"
            size={18}
          />
        </div>
        <div className="text-center space-y-1">
          <h3 className="text-sm font-black uppercase tracking-widest text-white">
            Equitas AI Studio Engine
          </h3>
          <p className="text-xs text-slate-400 font-medium animate-pulse">
            {loadingStatus}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen lg:h-screen bg-slate-900 flex flex-col text-slate-100 lg:overflow-hidden">
      <header className="bg-slate-800/90 backdrop-blur-md border-b border-slate-700/60 px-4 sm:px-6 py-3 flex flex-wrap gap-3 justify-between items-center z-50 shrink-0 shadow-lg print:hidden">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push(`/resumes/templates?jobId=${jobId}`)}
            className="p-2 rounded-xl border border-slate-700 bg-slate-800/50 hover:bg-slate-700 hover:text-white transition text-slate-300"
          >
            <ArrowLeft size={16} />
          </button>
          <div>
            <div className="flex items-center gap-2.5">
              <h2 className="text-xs font-black uppercase tracking-widest text-white">
                Canva Studio Workspace
              </h2>
              <span className="hidden sm:flex bg-blue-500/20 border border-blue-500/30 text-blue-400 text-[9px] font-black uppercase px-2.5 py-0.5 rounded-full items-center gap-1 shadow-sm">
                <Sparkles size={8} /> Gemini 2.5 Active
              </span>
            </div>
          </div>
        </div>

        <button
          onClick={handleExportPDF}
          disabled={isExporting}
          className="inline-flex items-center gap-2 bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:opacity-50 text-white font-black uppercase text-[11px] tracking-wider px-5 py-2.5 rounded-xl transition shadow-md border border-blue-400/20"
        >
          {isExporting ? (
            <>
              <Loader2 size={14} className="animate-spin" />
              <span>Đang xuất...</span>
            </>
          ) : (
            <>
              <Download size={14} />
              <span className="hidden sm:inline">Tải xuống PDF</span>
            </>
          )}
        </button>
      </header>

      {/* WORKSPACE REGION */}
      <div className="flex-1 flex flex-col lg:flex-row lg:overflow-hidden">
        <div className="print:hidden flex w-full lg:h-full lg:w-auto lg:shrink-0">
          <CVFormSidebar
            cvData={cvData}
            onChange={handleInputChange}
            onBulletChange={handleBulletChange}
            onProjectChange={handleProjectChange}
            onEduChange={handleEduChange}
            onSkillChange={handleSkillChange}
            onCertChange={handleCertChange}
            onAwardChange={handleAwardChange}
          />
        </div>

        <CVPreviewArea
          cvRef={cvRef}
          SelectedTemplateComponent={SelectedTemplateComponent}
          cvData={cvData}
        />
      </div>
    </div>
  );
}
