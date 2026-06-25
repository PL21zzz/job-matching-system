"use client";

import { cvService } from "@/src/services/cvService";
import {
  ArrowLeft,
  Download,
  Eye,
  FileText,
  Loader2,
  PencilLine,
  Sparkles,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { AVAILABLE_TEMPLATES } from "../templates/CVTemplates";
import CVFormSidebar from "./components/CVFormSidebar";
import CVPreviewArea from "./components/CVPreviewArea";

export default function CVEditorPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const cvRef = useRef<HTMLDivElement>(null);

  const [isExporting, setIsExporting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingStatus, setLoadingStatus] = useState(
    "Đang lấy hồ sơ cá nhân và khởi tạo bản CV nháp...",
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
    portfolioUrl: "",
    disabilityType: "",
    summary: "",
    experienceTitle: "",
    experienceCompany: "",
    experienceDuration: "",
    experienceBullets: ["", "", ""],
    education: [
      {
        school: "",
        major: "",
        year: "",
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
        alert("Thiếu jobId để tạo CV theo công việc.");
        router.push("/resumes/templates");
        return;
      }

      try {
        setIsLoading(true);
        setLoadingStatus("Đang đồng bộ hồ sơ cá nhân...");
        const profile = await cvService.getProfileForCvInit();

        let updatedData = { ...cvData };
        if (profile) {
          updatedData.fullName = profile.fullName || "";
          updatedData.email = profile.email || "";
          updatedData.phone = profile.phone || "";
          updatedData.address = profile.address || "";
          updatedData.disabilityType = profile.disabilityType || "";
        }

        setLoadingStatus("AI đang đọc JD và dựng bản CV nháp tối ưu...");
        const aiResult = await cvService.generateCvWithAi(jobId, templateId);

        if (aiResult) {
          setCvData({
            ...updatedData,
            jobTitle: aiResult.jobTitle || "",
            summary: aiResult.summary || "",
            experienceTitle: aiResult.jobTitle || "",
            experienceCompany: "Kinh nghiệm liên quan",
            experienceDuration: "Có thể chỉnh trực tiếp",
            experienceBullets:
              aiResult.experienceBullets?.length > 0
                ? aiResult.experienceBullets
                : ["", "", ""],
            projects:
              aiResult.projects?.length > 0
                ? aiResult.projects
                : [{ name: "", tech: "", desc: "" }],
            skills:
              aiResult.skills?.length > 0
                ? aiResult.skills
                : [
                    { name: "", level: 80 },
                    { name: "", level: 80 },
                    { name: "", level: 80 },
                  ],
            certifications:
              aiResult.certifications?.length > 0
                ? aiResult.certifications
                : ["", ""],
            awards: aiResult.awards?.length > 0 ? aiResult.awards : ["", ""],
          });
        }
      } catch (error) {
        console.error("Lỗi khởi tạo dữ liệu CV:", error);
        alert(`Không thể sinh CV tự động: ${error}`);
      } finally {
        setIsLoading(false);
      }
    }

    initCVData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  if (!currentTemplate) {
    return (
      <div className="p-12 text-center font-bold text-red-500">
        Mẫu CV không tồn tại.
      </div>
    );
  }

  const SelectedTemplateComponent = currentTemplate.Component;

  if (isLoading) {
    return (
      <div className="flex h-screen w-screen flex-col items-center justify-center space-y-4 bg-slate-950 text-slate-100">
        <div className="relative flex items-center justify-center">
          <Loader2 className="animate-spin text-cyan-500" size={48} />
          <Sparkles className="absolute animate-pulse text-amber-400" size={18} />
        </div>
        <div className="space-y-1 text-center">
          <h3 className="text-sm font-black uppercase tracking-widest text-white">
            Equitas AI Resume Studio
          </h3>
          <p className="animate-pulse text-xs font-medium text-slate-400">
            {loadingStatus}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-slate-950 text-slate-100">
      <header className="sticky top-0 z-50 shrink-0 border-b border-slate-800 bg-slate-900/90 px-4 py-4 shadow-lg backdrop-blur-md print:hidden sm:px-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3 sm:gap-4">
            <button
              onClick={() => router.push(`/resumes/templates?jobId=${jobId}`)}
              className="flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-700 bg-slate-800/60 text-slate-300 transition hover:bg-slate-700 hover:text-white"
            >
              <ArrowLeft size={16} />
            </button>

            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2.5">
                <h2 className="text-sm font-black tracking-tight text-white sm:text-base">
                  Trình chỉnh CV theo job
                </h2>
                <span className="inline-flex items-center gap-1 rounded-full border border-cyan-500/20 bg-cyan-500/10 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-cyan-300">
                  <Sparkles size={10} />
                  AI draft ready
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-400 sm:text-xs">
                <span className="inline-flex items-center gap-1 rounded-full border border-slate-700 bg-slate-800/70 px-2.5 py-1">
                  <FileText size={12} />
                  {currentTemplate.name}
                </span>
                <span className="inline-flex items-center gap-1 rounded-full border border-slate-700 bg-slate-800/70 px-2.5 py-1">
                  <PencilLine size={12} />
                  Bấm trực tiếp vào CV để sửa
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden items-center gap-2 rounded-2xl border border-slate-800 bg-slate-900 px-3 py-2 text-xs text-slate-400 xl:flex">
              <Eye size={14} className="text-cyan-400" />
              Chế độ xem A4 thật
            </div>

            <button
              onClick={handleExportPDF}
              disabled={isExporting}
              className="inline-flex items-center gap-2.5 rounded-2xl border border-cyan-400/20 bg-linear-to-r from-cyan-500 to-blue-600 px-5 py-3 text-[11px] font-black uppercase tracking-[0.16em] text-white shadow-lg shadow-cyan-950/40 transition hover:from-cyan-400 hover:to-blue-500 disabled:opacity-50"
            >
              {isExporting ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  <span>Đang mở in PDF</span>
                </>
              ) : (
                <>
                  <Download size={14} />
                  <span>Tải PDF</span>
                </>
              )}
            </button>
          </div>
        </div>
      </header>

      <div className="flex flex-1 flex-col xl:flex-row">
        <div className="print:hidden xl:sticky xl:top-[92px] xl:h-[calc(100vh-92px)] xl:w-[360px] xl:shrink-0">
          <CVFormSidebar
            cvData={cvData}
            onChange={handleInputChange}
            onSkillChange={handleSkillChange}
          />
        </div>

        <CVPreviewArea
          cvRef={cvRef}
          SelectedTemplateComponent={SelectedTemplateComponent}
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
    </div>
  );
}
