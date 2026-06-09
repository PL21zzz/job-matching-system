"use client";

import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import {
  ArrowLeft,
  Award,
  Briefcase,
  Code,
  Download,
  GraduationCap,
  Sparkles,
  Star,
  User,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useRef, useState } from "react";
import { AVAILABLE_TEMPLATES } from "../templates/CVTemplates";

export default function CVEditorPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const cvRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);

  const templateId =
    searchParams.get("templateId") || "template-canva-creative-1";
  const jobId = searchParams.get("jobId");

  const currentTemplate = AVAILABLE_TEMPLATES.find((t) => t.id === templateId);

  // 📝 Quản lý State tập trung đầy đủ tất cả các trường để hiển thị lên Form nhập liệu bên trái
  const [cvData, setCvData] = useState({
    fullName: "NGUYỄN TUÂN PHONG",
    jobTitle: "LẬP TRÌNH VIÊN FULL-STACK WEB",
    email: "tuanphong.dev@gmail.com",
    phone: "0935.987.654",
    address: "Đà Nẵng, Việt Nam",
    summary:
      "Đam mê nghiên cứu và phát triển phần mềm, xây dựng kiến trúc hệ thống web liền mạch, hiệu năng cao bằng Next.js và NestJS kết hợp giải quyết bài toán trợ năng kỹ thuật số, mang lại trải nghiệm bình đẳng cho người khuyết tật.",
    experienceBullets: [
      "Hiện thực hóa kiến trúc xác thực bảo mật đa tầng với tính năng JWT Refresh Token Rotation và hệ thống phân quyền RBAC dựa trên phân hệ cơ sở dữ liệu nâng cao.",
      "Cấu hình và tối ưu hóa hệ quản trị cơ sở dữ liệu PostgreSQL thông qua tầng Prisma ORM chặt chẽ, giảm độ trễ và tăng tốc độ xử lý truy vấn dữ liệu lên 25%.",
      "Phối hợp chặt chẽ với đội ngũ UI/UX để chuyển đổi mượt mà các file thiết kế đồ họa Figma phức tạp thành mã nguồn sạch, tối ưu hóa SEO và trợ năng WCAG.",
    ],
    education: [
      {
        school: "University of Information and Communication Technology",
        major: "Software Engineering",
        year: "2022 - 2026",
      },
    ],
    skills: [
      { name: "React / Next.js", level: 90 },
      { name: "Node.js / NestJS", level: 85 },
      { name: "PostgreSQL / Prisma", level: 80 },
    ],
    projects: [
      {
        name: "EQUITAS AI - Assistive Recruitment Platform (Đồ án tốt nghiệp)",
        tech: "Next.js, NestJS, PostgreSQL, Prisma, Docker, Gemini 1.5 Flash API",
        desc: "Xây dựng hệ sinh thái tuyển dụng trợ năng toàn diện hỗ trợ ứng viên khuyết tật tương tác touchless qua giọng nói. Tích hợp mô hình ngôn ngữ lớn LLM để tự động chuẩn hóa hồ sơ, gọt giũa metric CV theo đặc thù từng tin tuyển dụng.",
      },
    ],
    certifications: [
      "TOEIC Listening & Reading Certificate - Score: 750+",
      "AWS Certified Cloud Practitioner - Chứng chỉ Điện toán đám mây",
    ],
    awards: [
      "Giải Nhất - Cuộc thi Ý tưởng Khởi nghiệp Đổi mới Sáng tạo cấp Trường 2026",
      "Học bổng Khuyến khích Học tập dành cho Sinh viên có thành tích Xuất sắc",
    ],
  });

  // 🛠️ CÁC HÀM XỬ LÝ SỰ KIỆN THAY ĐỔI DỮ LIỆU (EVENT HANDLERS)
  const handleInputChange = (field: string, value: string) => {
    setCvData((prev) => ({ ...prev, [field]: value }));
  };

  const handleBulletChange = (index: number, value: string) => {
    const updatedBullets = [...cvData.experienceBullets];
    updatedBullets[index] = value;
    setCvData((prev) => ({ ...prev, experienceBullets: updatedBullets }));
  };

  const handleEduChange = (index: number, field: string, value: string) => {
    const updatedEdu = [...cvData.education];
    updatedEdu[index] = { ...updatedEdu[index], [field]: value };
    setCvData((prev) => ({ ...prev, education: updatedEdu }));
  };

  const handleSkillChange = (
    index: number,
    field: string,
    value: string | number,
  ) => {
    const updatedSkills = [...cvData.skills];
    updatedSkills[index] = { ...updatedSkills[index], [field]: value };
    setCvData((prev) => ({ ...prev, skills: updatedSkills }));
  };

  const handleProjectChange = (index: number, field: string, value: string) => {
    const updatedProjects = [...cvData.projects];
    updatedProjects[index] = { ...updatedProjects[index], [field]: value };
    setCvData((prev) => ({ ...prev, projects: updatedProjects }));
  };

  const handleCertChange = (index: number, value: string) => {
    const updatedCerts = [...cvData.certifications];
    updatedCerts[index] = value;
    setCvData((prev) => ({ ...prev, certifications: updatedCerts }));
  };

  const handleAwardChange = (index: number, value: string) => {
    const updatedAwards = [...cvData.awards];
    updatedAwards[index] = value;
    setCvData((prev) => ({ ...prev, awards: updatedAwards }));
  };

  // 🖨️ Hàm xuất PDF chất lượng cao
  const handleExportPDF = async () => {
    if (!cvRef.current) return;
    setIsExporting(true);
    try {
      const canvas = await html2canvas(cvRef.current, {
        scale: 2.5,
        useCORS: true,
        logging: false,
      });
      const imgData = canvas.toDataURL("image/jpeg", 1.0);
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "px",
        format: [794, 1123],
      });
      pdf.addImage(imgData, "JPEG", 0, 0, 794, 1123);
      pdf.save(`CV_${cvData.fullName.replace(/\s+/g, "_")}.pdf`);
    } catch (error) {
      console.error(error);
    } finally {
      setIsExporting(false);
    }
  };

  if (!currentTemplate) {
    return (
      <div className="p-12 text-center text-red-500 font-bold">
        Mẫu CV không tồn tại!
      </div>
    );
  }

  const SelectedTemplateComponent = currentTemplate.Component;

  return (
    <div className="h-screen bg-slate-900 flex flex-col text-slate-100 overflow-hidden">
      {/* CONTROL TOP BAR */}
      <header className="bg-slate-800 border-b border-slate-700 px-6 py-3 flex justify-between items-center z-50 shrink-0 shadow-md">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push(`/resumes/templates?jobId=${jobId}`)}
            className="p-2 rounded-xl border border-slate-700 hover:bg-slate-700 transition text-slate-300"
          >
            <ArrowLeft size={16} />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xs font-black uppercase tracking-wider text-white">
                Canva Studio Workspace
              </h2>
              <span className="bg-blue-500/20 text-blue-400 text-[9px] font-black uppercase px-2 py-0.5 rounded flex items-center gap-1">
                <Sparkles size={8} /> Form & Preview Mode
              </span>
            </div>
          </div>
        </div>

        <button
          onClick={handleExportPDF}
          disabled={isExporting}
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-black uppercase text-[10px] tracking-wider px-4 py-2 rounded-xl transition"
        >
          <Download size={14} />
          {isExporting ? "Đang xuất..." : "Tải xuống PDF"}
        </button>
      </header>

      {/* WORKSPACE AREA */}
      <div className="flex-1 flex overflow-hidden">
        {/* =========================================================================
            📝 KHỐI TRÁI: Form nhập liệu đầy đủ tất cả các trường (Đã bổ sung đầy đủ)
            ========================================================================= */}
        <div className="w-105 xl:w-115 bg-slate-800 border-r border-slate-700 flex flex-col overflow-y-auto p-5 space-y-5 shrink-0 select-text custom-scrollbar">
          <div className="pb-1 border-b border-slate-700">
            <h4 className="text-sm font-black text-white uppercase tracking-tight">
              Trình chỉnh sửa nội dung
            </h4>
            <p className="text-[11px] text-slate-400 font-medium mt-0.5">
              Mọi thay đổi nhỏ nhất sẽ được đồng bộ ngay sang trang giấy A4 bên
              phải
            </p>
          </div>

          {/* 1. Thông tin cá nhân */}
          <div className="space-y-3 bg-slate-850/40 p-4 rounded-xl border border-slate-700/60">
            <h3 className="text-[11px] font-black text-slate-200 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-700 pb-1.5">
              <User size={12} className="text-blue-400" /> Thông tin cá nhân
            </h3>
            <div className="space-y-1">
              <label className="text-[9px] uppercase font-bold text-slate-400">
                Họ và tên
              </label>
              <input
                type="text"
                value={cvData.fullName}
                onChange={(e) => handleInputChange("fullName", e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500 font-semibold"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[9px] uppercase font-bold text-slate-400">
                Vị trí ứng tuyển
              </label>
              <input
                type="text"
                value={cvData.jobTitle}
                onChange={(e) => handleInputChange("jobTitle", e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500 font-semibold"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <label className="text-[9px] uppercase font-bold text-slate-400">
                  Email
                </label>
                <input
                  type="email"
                  value={cvData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[9px] uppercase font-bold text-slate-400">
                  Số điện thoại
                </label>
                <input
                  type="text"
                  value={cvData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-[9px] uppercase font-bold text-slate-400">
                Địa chỉ cư trú
              </label>
              <input
                type="text"
                value={cvData.address}
                onChange={(e) => handleInputChange("address", e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* 2. Tóm tắt giới thiệu */}
          <div className="space-y-2 bg-slate-850/40 p-4 rounded-xl border border-slate-700/60">
            <label className="text-[11px] font-black text-slate-200 uppercase tracking-wider block">
              Giới thiệu bản thân
            </label>
            <textarea
              rows={3}
              value={cvData.summary}
              onChange={(e) => handleInputChange("summary", e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-xs text-slate-300 focus:outline-none focus:border-blue-500 resize-none leading-relaxed"
            />
          </div>

          {/* 3. Kinh nghiệm làm việc */}
          <div className="space-y-3 bg-slate-850/40 p-4 rounded-xl border border-slate-700/60">
            <h3 className="text-[11px] font-black text-slate-200 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-700 pb-1.5">
              <Briefcase size={12} className="text-blue-400" /> Kinh nghiệm làm
              việc
            </h3>
            {cvData.experienceBullets.map((bullet, index) => (
              <div key={index} className="space-y-1">
                <label className="text-[9px] font-bold text-slate-400">
                  Dòng mô tả {index + 1}
                </label>
                <textarea
                  rows={2}
                  value={bullet}
                  onChange={(e) => handleBulletChange(index, e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-slate-300 focus:outline-none focus:border-blue-500 resize-none"
                />
              </div>
            ))}
          </div>

          {/* 🚀 4. NEW FORM FIELD: Dự án trọng tâm (Key Projects) */}
          <div className="space-y-3 bg-slate-850/40 p-4 rounded-xl border border-slate-700/60">
            <h3 className="text-[11px] font-black text-slate-200 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-700 pb-1.5">
              <Code size={12} className="text-blue-400" /> Dự án kỹ thuật trọng
              tâm
            </h3>
            {cvData.projects.map((proj, index) => (
              <div
                key={index}
                className="space-y-2 border-b border-slate-700/40 pb-2 last:border-0 last:pb-0"
              >
                <div className="space-y-1">
                  <label className="text-[9px] uppercase font-bold text-slate-400">
                    Tên dự án
                  </label>
                  <input
                    type="text"
                    value={proj.name}
                    onChange={(e) =>
                      handleProjectChange(index, "name", e.target.value)
                    }
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500 font-semibold"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] uppercase font-bold text-slate-400">
                    Công nghệ áp dụng (Techstack)
                  </label>
                  <input
                    type="text"
                    value={proj.tech}
                    onChange={(e) =>
                      handleProjectChange(index, "tech", e.target.value)
                    }
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-cyan-400 focus:outline-none focus:border-blue-500 font-semibold"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] uppercase font-bold text-slate-400">
                    Mô tả chi tiết tính năng
                  </label>
                  <textarea
                    rows={3}
                    value={proj.desc}
                    onChange={(e) =>
                      handleProjectChange(index, "desc", e.target.value)
                    }
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-slate-300 focus:outline-none focus:border-blue-500 resize-none leading-relaxed"
                  />
                </div>
              </div>
            ))}
          </div>

          {/* 5. Trình độ học vấn */}
          <div className="space-y-3 bg-slate-850/40 p-4 rounded-xl border border-slate-700/60">
            <h3 className="text-[11px] font-black text-slate-200 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-700 pb-1.5">
              <GraduationCap size={12} className="text-blue-400" /> Lịch sử học
              vấn
            </h3>
            {cvData.education.map((edu, index) => (
              <div key={index} className="space-y-2">
                <div className="space-y-1">
                  <label className="text-[9px] uppercase font-bold text-slate-400">
                    Tên trường đại học
                  </label>
                  <input
                    type="text"
                    value={edu.school}
                    onChange={(e) =>
                      handleEduChange(index, "school", e.target.value)
                    }
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500 font-bold"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="text-[9px] uppercase font-bold text-slate-400">
                      Ngành học
                    </label>
                    <input
                      type="text"
                      value={edu.major}
                      onChange={(e) =>
                        handleEduChange(index, "major", e.target.value)
                      }
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] uppercase font-bold text-slate-400">
                      Niên khóa
                    </label>
                    <input
                      type="text"
                      value={edu.year}
                      onChange={(e) =>
                        handleEduChange(index, "year", e.target.value)
                      }
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* 6. Kỹ năng chuyên môn */}
          <div className="space-y-3 bg-slate-850/40 p-4 rounded-xl border border-slate-700/60">
            <h3 className="text-[11px] font-black text-slate-200 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-700 pb-1.5">
              <Star size={12} className="text-blue-400" /> Kỹ năng chuyên môn
            </h3>
            {cvData.skills.map((skill, index) => (
              <div key={index} className="space-y-1">
                <div className="flex justify-between text-[11px] font-bold text-slate-300">
                  <input
                    type="text"
                    value={skill.name}
                    onChange={(e) =>
                      handleSkillChange(index, "name", e.target.value)
                    }
                    className="bg-transparent border-b border-transparent hover:border-slate-700 focus:border-blue-500 focus:outline-none text-xs text-slate-200 font-semibold w-2/3"
                  />
                  <span className="text-cyan-400 font-bold">
                    {skill.level}%
                  </span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="100"
                  step="10"
                  value={skill.level}
                  onChange={(e) =>
                    handleSkillChange(index, "level", parseInt(e.target.value))
                  }
                  className="w-full accent-cyan-400 h-1 bg-slate-900 rounded-lg cursor-pointer"
                />
              </div>
            ))}
          </div>

          {/* 🚀 7. NEW FORM FIELD: Chứng chỉ (Certifications) */}
          <div className="space-y-3 bg-slate-850/40 p-4 rounded-xl border border-slate-700/60">
            <h3 className="text-[11px] font-black text-slate-200 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-700 pb-1.5">
              <Award size={12} className="text-blue-400" /> Chứng chỉ đạt được
            </h3>
            {cvData.certifications.map((cert, index) => (
              <div key={index} className="space-y-1">
                <label className="text-[9px] font-bold text-slate-400">
                  Chứng chỉ {index + 1}
                </label>
                <input
                  type="text"
                  value={cert}
                  onChange={(e) => handleCertChange(index, e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500 font-medium"
                />
              </div>
            ))}
          </div>

          {/* 🚀 8. NEW FORM FIELD: Giải thưởng (Honors & Awards) */}
          <div className="space-y-3 bg-slate-850/40 p-4 rounded-xl border border-slate-700/60">
            <h3 className="text-[11px] font-black text-slate-200 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-700 pb-1.5">
              <Award size={12} className="text-amber-400" /> Danh hiệu & Giải
              thưởng
            </h3>
            {cvData.awards.map((award, index) => (
              <div key={index} className="space-y-1">
                <label className="text-[9px] font-bold text-slate-400">
                  Giải thưởng {index + 1}
                </label>
                <input
                  type="text"
                  value={award}
                  onChange={(e) => handleAwardChange(index, e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500 font-medium"
                />
              </div>
            ))}
          </div>
        </div>

        {/* 👁️ BÊN PHẢI: Tờ giấy CV A4 Live Preview */}
        <div className="flex-1 bg-slate-950 p-6 xl:p-10 overflow-y-auto flex justify-center items-start">
          <div className="shadow-2xl shadow-black/60 bg-white rounded-none shrink-0 overflow-hidden">
            <div ref={cvRef}>
              <SelectedTemplateComponent {...cvData} isDemo={false} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
