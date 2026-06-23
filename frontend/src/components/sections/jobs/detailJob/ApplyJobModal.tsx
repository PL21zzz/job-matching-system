"use client";

import Button from "@/src/components/ui/Button";
import { jobService } from "@/src/services/jobService";
import {
  CheckCircle2,
  FileText,
  Loader2,
  Sparkles,
  UploadCloud,
  X,
} from "lucide-react";
import { useState } from "react";

interface ApplyJobModalProps {
  isOpen: boolean;
  onClose: () => void;
  job: any;
}

export default function ApplyJobModal({
  isOpen,
  onClose,
  job,
}: ApplyJobModalProps) {
  const [coverLetter, setCoverLetter] = useState<string>("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isAiGenerating, setIsAiGenerating] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitSuccess, setSubmitSuccess] = useState<boolean>(false);

  if (!isOpen) return null;

  // 🪄 Gọi Gemini 2.5 Flash bốc tách dữ liệu viết hộ Cover Letter
  const handleGenerateAiCover = async () => {
    try {
      setIsAiGenerating(true);
      const res = await jobService.generateCoverLetterAi(job.id);
      if (res && res.coverLetter) {
        setCoverLetter(res.coverLetter);
      }
    } catch (error) {
      console.error("Lỗi khi gọi AI sinh Cover Letter:", error);
      alert("Hệ thống AI bận, không thể viết thư hộ sếp lúc này!");
    } finally {
      setIsAiGenerating(false);
    }
  };

  const handleSubmitApplication = async () => {
    if (!selectedFile) {
      alert("Vui lòng chọn hoặc tải tệp tin CV (.pdf, .docx) của bạn lên!");
      return;
    }
    if (!coverLetter.trim()) {
      alert("Vui lòng nhập nội dung thư xin việc hoặc sử dụng AI viết hộ!");
      return;
    }

    try {
      setIsSubmitting(true);

      // 🌟 KHỞI TẠO FORMDATA ĐỂ ĐÓNG GÓI FILE VẬT LÝ BIẾN THÀNH STREAM BITS
      const formData = new FormData();
      formData.append("file", selectedFile); // Khớp với cái tên '@UploadedFile('file')' tí nữa viết bên Backend
      formData.append("jobId", job.id);
      formData.append("coverLetter", coverLetter);

      // Bắn thẳng gói dữ liệu hỗn hợp sang NestJS
      await jobService.applyJob(formData);

      setSubmitSuccess(true);
    } catch (error: any) {
      console.error("Lỗi nộp đơn ứng tuyển:", error);
      alert(
        error.response?.data?.message ||
          "Ứng tuyển thất bại. Vui lòng thử lại!",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay backdrop */}
      <div
        className="absolute inset-0 bg-slate-950/60 backdrop-blur-xs"
        onClick={onClose}
      />

      {/* Main Modal Box */}
      <div className="relative w-full max-w-2xl max-h-[94vh] bg-white dark:bg-secondary rounded-2xl sm:rounded-3xl border border-slate-200 dark:border-white/5 shadow-2xl overflow-hidden transform transition-all duration-300 animate-in fade-in zoom-in-95">
        {/* HEADER */}
        <div className="px-4 sm:px-6 py-4 border-b border-slate-100 dark:border-border-subtle flex items-center justify-between select-none">
          <div>
            <h3 className="text-base font-black uppercase tracking-tight text-slate-900 dark:text-white">
              Nộp đơn ứng tuyển vị trí
            </h3>
            <p className="text-xs font-bold text-primary italic truncate max-w-112.5">
              {job.title} — {job.employer?.companyName}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-surface transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* BODY */}
        <div className="p-4 sm:p-6 space-y-5 max-h-[78vh] overflow-y-auto">
          {submitSuccess ? (
            /* THÀNH CÔNG */
            <div className="py-8 flex flex-col items-center justify-center text-center space-y-3 select-none">
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 rounded-full animate-bounce">
                <CheckCircle2 size={40} />
              </div>
              <h4 className="text-lg font-black uppercase text-slate-900 dark:text-white tracking-tight">
                Ứng tuyển thành công!
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium max-w-sm leading-relaxed">
                Hồ sơ và thư xin việc được may đo riêng đã được chuyển thẳng tới
                hệ thống quản lý của Nhà tuyển dụng.
              </p>
              <div className="pt-4">
                <Button onClick={onClose}>Đóng cửa sổ</Button>
              </div>
            </div>
          ) : (
            /* ĐIỀN ĐƠN */
            <>
              {/* KHU VỰC TẢI CV TỪ MÁY TÍNH LÊN (THAY THẾ TĨNH) */}
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500 block select-none">
                  Tải hồ sơ CV lên từ máy tính
                </label>

                <label className="flex flex-col items-center justify-center p-6 bg-slate-50 dark:bg-surface border-2 border-dashed border-slate-200 dark:border-white/5 rounded-2xl cursor-pointer hover:bg-slate-100/50 dark:hover:bg-slate-800/30 transition-all group">
                  <input
                    type="file"
                    accept=".pdf,.txt"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setSelectedFile(e.target.files[0]);
                      }
                    }}
                  />
                  <div className="flex flex-col items-center space-y-2 text-center select-none">
                    {selectedFile ? (
                      <>
                        <div className="p-2.5 bg-emerald-500/10 text-emerald-500 rounded-xl">
                          <FileText size={24} />
                        </div>
                        <div>
                          <p className="text-xs font-black text-slate-900 dark:text-white truncate max-w-112.5">
                            {selectedFile.name}
                          </p>
                          <p className="text-[9px] text-emerald-500 font-black uppercase tracking-wider mt-0.5">
                            {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                            — Click để thay đổi
                          </p>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="p-2.5 bg-slate-200/60 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-xl group-hover:scale-105 transition-transform">
                          <UploadCloud size={24} />
                        </div>
                        <div>
                          <p className="text-xs font-black text-slate-700 dark:text-slate-300">
                            Chọn hoặc kéo thả tệp tin CV vào đây
                          </p>
                          <p className="text-[9px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider mt-0.5">
                            Chấp nhận PDF hoặc TXT, tối đa 5MB
                          </p>
                        </div>
                      </>
                    )}
                  </div>
                </label>
              </div>

              {/* KHU VỰC THƯ XIN VIỆC */}
              <div className="space-y-2">
                <div className="flex items-center justify-between select-none">
                  <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500 block">
                    Thư ứng tuyển
                  </label>

                  <button
                    type="button"
                    disabled={isAiGenerating || isSubmitting}
                    onClick={handleGenerateAiCover}
                    className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider bg-primary/10 hover:bg-primary/20 disabled:opacity-50 text-primary border border-primary/20 px-3 py-1.5 rounded-xl transition shadow-xs"
                  >
                    {isAiGenerating ? (
                      <>
                        <Loader2 size={12} className="animate-spin" />
                        <span>Đang viết thư...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles size={12} className="animate-pulse" />
                        <span>AI Viết hộ thư xin việc</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="relative">
                  <textarea
                    rows={7}
                    value={coverLetter}
                    onChange={(e) => setCoverLetter(e.target.value)}
                    disabled={isSubmitting}
                    placeholder="Nhập tâm thư của bạn gửi tới nhà tuyển dụng hoặc click nút phía trên để Trí tuệ nhân tạo Gemini bẻ lái kịch bản trợ năng chuyên nghiệp giúp bạn..."
                    className="w-full text-xs font-medium p-4 bg-slate-50 dark:bg-surface border border-slate-200 dark:border-white/5 focus:border-primary focus:ring-1 focus:ring-primary rounded-2xl text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 resize-none outline-hidden transition leading-relaxed scrollbar-thin"
                  />
                </div>
              </div>

              {/* FOOTER ACTIONS */}
              <div className="pt-3 border-t border-slate-100 dark:border-border-subtle flex flex-col-reverse sm:flex-row sm:justify-end gap-3 select-none">
                <Button
                  variant="secondary"
                  onClick={onClose}
                  disabled={isSubmitting}
                >
                  Hủy bỏ
                </Button>
                <Button
                  onClick={handleSubmitApplication}
                  disabled={isSubmitting || isAiGenerating}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={14} className="animate-spin" /> Đang nộp
                      đơn...
                    </>
                  ) : (
                    "Xác nhận ứng tuyển"
                  )}
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
