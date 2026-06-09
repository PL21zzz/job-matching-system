"use client";

import Card from "@/src/components/ui/Card";
import { Sparkles } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { AVAILABLE_TEMPLATES } from "./CVTemplates";

export default function SelectTemplatePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const jobId = searchParams.get("jobId");

  // ĐỒNG BỘ DỮ LIỆU ĐẦY ĐỦ 5 MỤC ĐỂ CARD PREVIEW HIỂN THỊ KÍN KHÍT TRANG A4
  const demoData = {
    fullName: "NGUYỄN TUÂN PHONG",
    jobTitle: "Lập Trình Viên Full-Stack Web",
    email: "phong.dev@gmail.com",
    phone: "0905.123.456",
    address: "Đà Nẵng, Việt Nam",
    summary:
      "Đam mê nghiên cứu và phát triển phần mềm, xây dựng kiến trúc web hiệu năng cao bằng Next.js, NestJS kết hợp giải quyết bài toán trợ năng công nghệ.",
    experienceBullets: [
      "Xây dựng và tối ưu hóa hệ thống giao diện người dùng sử dụng ReactJS và Tailwind CSS.",
      "Phối hợp với đội ngũ thiết kế chuyển đổi mượt mà file Figma thành mã nguồn sạch.",
      "Hiện thực hóa tiêu chuẩn trợ năng web giúp người khiếm thị tương tác hệ thống ổn định.",
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
        name: "EQUITAS AI - Assistive Platform",
        tech: "Next.js, NestJS, PostgreSQL, Gemini API",
        desc: "Hệ sinh thái tuyển dụng trợ năng hỗ trợ người khuyết tật tìm kiếm việc làm bình đẳng.",
      },
    ],
    certifications: [
      "TOEIC Listening & Reading - Score: 750+",
      "AWS Certified Cloud Practitioner",
    ],
    awards: [
      "Giải Nhất - Khởi nghiệp Đổi mới Sáng tạo cấp Trường 2026",
      "Học bổng Khuyến khích Học tập Xuất sắc",
    ],
  };

  const handleSelectTemplate = (templateId: string) => {
    router.push(`/resumes/editor?templateId=${templateId}&jobId=${jobId}`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-16 space-y-12 text-slate-900 dark:text-white bg-white dark:bg-secondary min-h-screen transition-colors duration-300">
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-wider">
          <Sparkles size={12} /> Canva Design Style
        </div>
        <h1 className="text-3xl font-black uppercase tracking-tight">
          Chọn Mẫu Thiết Kế CV Yêu Thích
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">
          Hệ thống hiển thị trực quan bản xem trước của từng mẫu thiết kế 2 cột
          cao cấp. Click vào mẫu bạn thích để tiến hành biên tập.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {AVAILABLE_TEMPLATES.map((tpl) => {
          const TemplateComponent = tpl.Component;
          return (
            <Card
              key={tpl.id}
              layoutClassName="p-4 space-y-4 group cursor-pointer border border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-surface rounded-3xl transition-transform duration-300 hover:-translate-y-1 shadow-sm hover:shadow-md"
              onClick={() => handleSelectTemplate(tpl.id)}
            >
              {/* Tỷ lệ vàng khung giấy A4 chuẩn (1:1.41) */}
              <div className="aspect-[1/1.41] w-full rounded-2xl overflow-hidden border border-slate-300 dark:border-white/10 relative shadow-md bg-white">
                <div className="w-full h-full pointer-events-none select-none origin-top">
                  <TemplateComponent {...demoData} isDemo={true} />
                </div>

                <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center p-4">
                  <div className="bg-primary text-white font-black uppercase text-[10px] tracking-wider px-4 py-2.5 rounded-xl shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                    Sử dụng mẫu này
                  </div>
                </div>
              </div>

              <h4 className="font-black text-xs text-center group-hover:text-primary transition-colors uppercase tracking-tight">
                {tpl.name}
              </h4>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
