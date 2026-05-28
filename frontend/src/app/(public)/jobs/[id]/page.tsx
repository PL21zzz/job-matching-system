"use client";

// 1. Import thêm 'use' từ react
import {
  Accessibility,
  ArrowRight,
  Briefcase,
  Building2,
  Calendar,
  ChevronLeft,
  MapPin,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { use, useState } from "react";

interface JobDetailPageProps {
  // 2. Chuyển kiểu dữ liệu params thành một Promise chứa id
  params: Promise<{
    id: string;
  }>;
}

export default function JobDetailPage({ params }: JobDetailPageProps) {
  // 3. Sử dụng hàm use() để giải nén lấy id một cách an toàn
  const unwrappedParams = use(params);
  const jobId = unwrappedParams.id;

  // 4. Cập nhật lại state khởi tạo ban đầu, truyền biến jobId vừa giải nén vào đây
  const [job, setJob] = useState<any>({
    id: jobId, // 👈 Thay params.id cũ bằng biến jobId mới
    title: "Senior Frontend Engineer",
    location: "District 1, Ho Chi Minh City (Remote Friendly)",
    type: "Toàn thời gian",
    salaryText: "25 - 45 TRIỆU VND",
    createdAt: "24/12/2026",
    description: `Chúng tôi đang tìm kiếm một Senior Frontend Engineer xuất sắc để dẫn dắt việc xây dựng các giao diện người dùng hiện đại cho nền tảng EquitableAI. Bạn sẽ làm việc chặt chẽ với đội ngũ thiết kế và kỹ sư AI để tạo ra những trải nghiệm mượt mà, dễ tiếp cận và đầy cảm hứng cho hàng triệu người dùng trên toàn cầu.`,
    requirements: [
      "Phát triển các tính năng UI phức tạp sử dụng React, Next.js và Tailwind CSS.",
      "Tối ưu hóa hiệu suất render và khả năng phản hồi của ứng dụng trên nhiều thiết bị.",
      "Đảm bảo các tiêu chuẩn về Web Accessibility (WCAG 2.1) được thực hiện nghiêm ngặt.",
      "Hợp tác chặt chẽ với đội ngũ backend để tích hợp các API real-time và AI models.",
    ],
    candidateRequirements: [
      "Ít nhất 5 năm kinh nghiệm làm việc chuyên sâu với JavaScript/TypeScript và React.",
      "Kiến thức vững chắc về kiến trúc Frontend, state management (Zustand/Redux) và SSR/SSG.",
      "Có kinh nghiệm thực tiễn trong việc tối ưu hóa Core Web Vitals.",
      "Đam mê việc tạo ra các sản phẩm công nghệ có tác động xã hội và tính hòa nhập cao.",
      "Kỹ năng giải quyết vấn đề độc lập và khả năng dẫn dắt nhóm là một lợi thế lớn.",
    ],
    accessibilityFeatures: "Lối đi xe lăn, Thang máy rộng, Ngôn ngữ ký hiệu",
    suitableDisabilities: [
      { id: 1, name: "Khuyết tật vận động" },
      { id: 3, name: "Khuyết tật thính giác" },
    ],
    employer: {
      companyName: "TECH GLOBAL INC.",
      size: "500-1000 nhân viên",
      address:
        "Tòa nhà Bitexco, Số 2 Hải Triều, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh",
      description:
        "Tech Global Inc. là tập đoàn công nghệ tiên phong trong việc cung cấp các giải pháp phần mềm doanh nghiệp và ứng dụng trí tuệ nhân tạo hướng tới sự phát triển bền vững và hòa nhập xã hội.",
    },
  });

  const [aiMatchScore, setAiMatchScore] = useState<number>(95);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-secondary text-slate-900 dark:text-slate-100 transition-colors duration-300">
      <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8 space-y-8">
        {/* BREADCRUMB & BACK ACTION */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
            <Link href="/jobs" className="hover:text-primary transition-colors">
              Trang chủ
            </Link>
            <span>/</span>
            <Link href="/jobs" className="hover:text-primary transition-colors">
              Việc làm
            </Link>
            <span>/</span>
            <span className="text-slate-900 dark:text-white font-bold truncate max-w-50 sm:max-w-none">
              {job.title}
            </span>
          </div>

          <Link
            href="/jobs"
            className="flex items-center gap-1 text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-primary dark:hover:text-primary transition-colors"
          >
            <ChevronLeft size={14} /> Quay lại danh sách
          </Link>
        </div>

        {/* MAIN TWO-COLUMN CONTAINER */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* LEFT COLUMN: CHI TIẾT NỘI DUNG (BIẾM 2/3 CHIỀU RỘNG) */}
          <div className="lg:col-span-2 space-y-8">
            {/* COMPONENT 1: JOB HERO BLOCK */}
            <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#0b0f19] border border-slate-200/60 dark:border-white/5 shadow-sm space-y-6 group">
              <div className="flex flex-col sm:flex-row items-start gap-6">
                {/* Logo fallback hình khối Stitch */}
                <div className="w-20 h-20 shrink-0 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-white/10 flex items-center justify-center font-black text-primary text-xl shadow-inner select-none">
                  {job.employer?.companyName?.substring(0, 2).toUpperCase() ||
                    "TG"}
                </div>

                <div className="space-y-3 flex-1">
                  <div className="flex flex-wrap gap-2 items-center">
                    <span className="px-2.5 py-0.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
                      <Sparkles size={10} /> AI Match: {aiMatchScore}%
                    </span>
                    <span className="px-2.5 py-0.5 rounded-lg bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-wider">
                      {job.employer?.companyName}
                    </span>
                  </div>

                  <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-slate-900 dark:text-white leading-tight">
                    {job.title}
                  </h1>

                  <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-xs font-bold text-slate-500 dark:text-slate-400">
                    <span className="flex items-center gap-1.5">
                      <MapPin size={14} className="text-slate-400" />{" "}
                      {job.location}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Briefcase size={14} className="text-slate-400" />{" "}
                      {job.type}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* COMPONENT 2: ĐẶC QUYỀN TRỢ NĂNG & HÒA NHẬP VỊ TRÍ NÀY */}
            <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#0b0f19] border border-slate-200/60 dark:border-white/5 shadow-sm space-y-6">
              <h4 className="text-xs font-black uppercase tracking-wider text-primary flex items-center gap-2">
                <Accessibility size={16} className="text-primary" /> Đặc quyền
                trợ năng & hòa nhập vị trí này
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Khối bento nhỏ 1: Nhóm ưu tiên */}
                <div className="p-5 rounded-2xl bg-slate-50 dark:bg-[#121824] border border-slate-100 dark:border-white/2 space-y-3">
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500 block">
                    Nhóm khuyết tật được ưu tiên
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {job.suitableDisabilities?.map((disability: any) => (
                      <span
                        key={disability.id}
                        className="px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-bold"
                      >
                        🤝 {disability.name}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Khối bento nhỏ 2: Hạ tầng phản ánh */}
                <div className="p-5 rounded-2xl bg-slate-50 dark:bg-[#121824] border border-slate-100 dark:border-white/2 space-y-3">
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500 block">
                    Tiện ích hạ tầng văn phòng
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {job.accessibilityFeatures
                      ?.split(", ")
                      .map((tag: string) => (
                        <span
                          key={tag}
                          className="px-3 py-1.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400 text-xs font-bold"
                        >
                          ♿ {tag}
                        </span>
                      ))}
                  </div>
                </div>
              </div>
            </div>

            {/* COMPONENT 3: CHI TIẾT CÔNG VIỆC */}
            <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#0b0f19] border border-slate-200/60 dark:border-white/5 shadow-sm space-y-6">
              <div className="h-8 flex items-center border-l-4 border-primary pl-3">
                <h3 className="text-xl font-black uppercase tracking-tight text-slate-900 dark:text-white">
                  Chi tiết công việc
                </h3>
              </div>

              {/* Mô tả công việc */}
              <div className="space-y-3">
                <h4 className="text-sm font-black uppercase tracking-wider text-slate-800 dark:text-slate-200">
                  Mô tả công việc
                </h4>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-300 leading-relaxed text-justify">
                  {job.description}
                </p>
              </div>

              {/* Công việc cụ thể */}
              <div className="space-y-3 pt-2">
                <h4 className="text-sm font-black uppercase tracking-wider text-slate-800 dark:text-slate-200">
                  Nhiệm vụ chính
                </h4>
                <ul className="space-y-2.5">
                  {job.requirements?.map((req: string, index: number) => (
                    <li
                      key={index}
                      className="flex items-start gap-3 text-sm font-medium text-slate-600 dark:text-slate-300 leading-relaxed"
                    >
                      <span className="text-primary font-black mt-0.5">•</span>
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Yêu cầu ứng viên */}
              <div className="space-y-3 pt-2">
                <h4 className="text-sm font-black uppercase tracking-wider text-slate-800 dark:text-slate-200">
                  Yêu cầu ứng viên
                </h4>
                <ul className="space-y-2.5">
                  {job.candidateRequirements?.map(
                    (req: string, index: number) => (
                      <li
                        key={index}
                        className="flex items-start gap-3 text-sm font-medium text-slate-600 dark:text-slate-300 leading-relaxed"
                      >
                        <span className="text-primary font-black mt-0.5">
                          •
                        </span>
                        <span>{req}</span>
                      </li>
                    ),
                  )}
                </ul>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: STICKY SIDEBAR ACTIONS (CHIẾM 1/3 CHIỀU RỘNG) */}
          <div className="space-y-6 lg:sticky lg:top-24">
            {/* SIDEBAR BOX 1: ACTION CARD */}
            <div className="p-6 rounded-3xl bg-white dark:bg-[#0b0f19] border border-slate-200/60 dark:border-white/5 shadow-xl space-y-6">
              <div className="space-y-1">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500 block">
                  Mức lương đề xuất
                </span>
                <p className="text-2xl sm:text-3xl font-black text-[#25B5BA] italic tracking-tight">
                  {job.salaryText}
                </p>
              </div>

              <button className="w-full py-4 px-4 rounded-xl bg-[#25B5BA] hover:bg-[#1da0a5] text-white font-black uppercase text-sm tracking-wider flex items-center justify-center gap-2 transition-all duration-300 shadow-lg shadow-[#25B5BA]/20 hover:scale-[1.02] active:scale-[0.98]">
                Ứng tuyển ngay <ArrowRight size={16} />
              </button>

              <div className="pt-2 border-t border-slate-100 dark:border-white/5 flex items-center justify-between text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                <span className="flex items-center gap-1">
                  <Calendar size={12} /> Hạn cuối nộp đơn:
                </span>
                <span className="text-slate-700 dark:text-slate-300 font-black">
                  {job.createdAt}
                </span>
              </div>
            </div>

            {/* SIDEBAR BOX 2: VỀ NHÀ TUYỂN DỤNG */}
            <div className="p-6 rounded-3xl bg-white dark:bg-[#0b0f19] border border-slate-200/60 dark:border-white/5 shadow-sm space-y-4">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Về nhà tuyển dụng
              </h4>

              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Building2 size={16} className="text-primary" />
                  <span className="font-black text-sm text-slate-900 dark:text-white uppercase tracking-tight">
                    {job.employer?.companyName}
                  </span>
                </div>

                <p className="text-xs font-medium text-slate-500 dark:text-slate-400 leading-relaxed text-justify">
                  {job.employer?.description}
                </p>

                <div className="pt-3 border-t border-slate-100 dark:border-white/5 flex gap-2 text-xs font-bold text-slate-500 dark:text-slate-400">
                  <MapPin
                    size={16}
                    className="shrink-0 text-slate-400 mt-0.5"
                  />
                  <span className="leading-normal">
                    {job.employer?.address}
                  </span>
                </div>
              </div>
            </div>

            {/* SIDEBAR BOX 3: AI INSIGHTS */}
            <div className="p-5 rounded-2xl bg-linear-to-br from-primary/5 to-transparent border border-primary/10 space-y-2.5">
              <div className="flex items-center gap-1.5 text-xs font-black uppercase text-primary tracking-wider">
                <Sparkles size={14} /> AI Insights
              </div>
              <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 leading-relaxed">
                Hồ sơ của bạn phù hợp hoàn toàn với các yêu cầu kỹ thuật của vị
                trí này. Đặc biệt là kinh nghiệm chuyên sâu với React &
                Accessibility.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
