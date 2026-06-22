"use client";

import Card from "@/src/components/ui/Card";
import api from "@/src/lib/axios";
import {
  Ban,
  FileText,
  Loader2,
  Mail,
  Sparkles,
  UserCheck,
} from "lucide-react";
import { useState } from "react";
import { toast } from "react-hot-toast";

interface CandidateApplicationsListProps {
  applications: any[];
  onRefreshData: () => void;
}

export default function CandidateApplicationsList({
  applications,
  onRefreshData,
}: CandidateApplicationsListProps) {
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  // 🚀 ĐỤC CỔNG GỌI API THỜI GIAN THỰC ĐỂ DUYỆT / TỪ CHỐI
  const handleUpdateStatus = async (
    applicationId: string,
    nextStatus: "REVIEWING" | "INTERVIEW" | "ACCEPTED" | "REJECTED",
  ) => {
    try {
      setActionLoadingId(applicationId);
      // Bắn lệnh cập nhật trạng thái chuẩn chỉ xuống Docker PostgreSQL
      await api.patch(`/jobs/applications/${applicationId}/status`, {
        status: nextStatus,
      });

      toast.success(
        nextStatus === "REVIEWING"
          ? "Đã tiếp nhận hồ sơ ứng viên! 🚀"
          : "Đã từ chối hồ sơ đơn.",
      );
      onRefreshData(); // Gọi hàm cha để reload lại toàn bộ dữ liệu sạch
    } catch (error: any) {
      console.error("Lỗi cập nhật trạng thái đơn:", error);
      toast.error(
        error.response?.data?.message || "Không thể xử lý hành động.",
      );
    } finally {
      setActionLoadingId(null);
    }
  };

  if (applications.length === 0) {
    return (
      <Card layoutClassName="p-12 text-center text-xs font-bold text-slate-400 dark:text-slate-500 rounded-3xl bg-slate-900/40 border border-white/5">
        Vị trí công việc này chưa nhận được đơn ứng tuyển nào.
      </Card>
    );
  }

  return (
    <div className="space-y-6 max-h-[72vh] overflow-y-auto pr-2 scrollbar-thin">
      {applications.map((app) => (
        <div
          key={app.id}
          className="p-6 bg-slate-900/60 backdrop-blur-md rounded-4xl border border-white/5 shadow-xl space-y-6 transition-all duration-300"
        >
          {/* DÒNG 1: THÔNG TIN HỒ SƠ ỨNG VIÊN (CĂN CHỈNH THOÁNG ĐÃNG) */}
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4 pb-4 border-b border-white/5">
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h4 className="font-black text-base text-white uppercase tracking-tight">
                  {app.candidate?.user?.fullName || "Ứng viên ẩn danh"}
                </h4>
                {app.status === "APPLIED" ? (
                  <span className="bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[8px] font-black uppercase px-2 py-0.5 rounded-md tracking-wider">
                    Chưa duyệt
                  </span>
                ) : (
                  <span className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[8px] font-black uppercase px-2 py-0.5 rounded-md tracking-wider">
                    {app.status}
                  </span>
                )}
              </div>
              <p className="text-xs font-medium text-slate-400 flex items-center gap-1.5">
                <Mail size={12} className="text-slate-500" />{" "}
                {app.candidate?.user?.email}
              </p>
            </div>

            {/* PHÂN KHU TRỢ NĂNG & MATCH SCORE */}
            <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
              <span className="bg-primary/10 border border-primary/20 text-primary font-black uppercase text-[9px] px-2.5 py-1 rounded-xl tracking-wider">
                ♿ {app.candidate?.disabilityType?.name || "Trợ năng chung"}
              </span>
              <div className="border border-white/5 bg-slate-950/40 px-3 py-1 rounded-xl flex items-center gap-1.5 shadow-sm">
                <Sparkles size={11} className="text-tertiary animate-pulse" />
                <span className="text-[10px] font-black text-tertiary">
                  MATCH {app.matchScore}%
                </span>
              </div>
            </div>
          </div>

          {/* DÒNG 2: THƯ XIN VIỆC (COVER LETTER CHUẨN ĐÉT) */}
          <div className="space-y-2">
            <span className="text-[9px] font-black uppercase tracking-wider text-slate-500 block">
              Thư ứng tuyển (Cover Letter)
            </span>
            <div className="p-4 bg-slate-950/40 border border-white/5 rounded-2xl text-xs font-medium text-slate-300 leading-relaxed text-justify max-h-35 overflow-y-auto scrollbar-thin">
              {app.coverLetter || "Ứng viên không đính kèm thư ứng tuyển."}
            </div>
          </div>

          {/* DÒNG 3: FILE CV ĐÍNH KÈM (XỬ LÝ DỨT ĐIỂM LỖI CHỒNG CHỮ TRÊN ẢNH) */}
          <div className="flex items-center justify-between gap-4 p-4 bg-slate-950/30 border border-white/5 rounded-2xl">
            <div className="flex items-center gap-3 min-w-0">
              <div className="p-2.5 bg-white/5 text-slate-400 rounded-xl shrink-0">
                <FileText size={18} />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-black text-slate-200 truncate uppercase tracking-tight">
                  Hồ sơ CV ứng viên đính kèm
                </p>
                <p className="text-[9px] text-slate-500 font-bold uppercase mt-0.5">
                  Định dạng tệp tin: PDF/DOCX
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                if (app?.cvUrl) {
                  window.open(app.cvUrl, "_blank");
                } else {
                  alert("Không tìm thấy file CV của ứng viên này!");
                }
              }}
              className="py-1.5 px-3.5 border border-dashed border-white/10 hover:border-primary text-slate-300 hover:text-primary rounded-xl text-[10px] font-black uppercase tracking-wider transition duration-200 shrink-0"
            >
              Xem bản cứng
            </button>
          </div>

          {/* DÒNG 4: HÀNH ĐỘNG DUYỆT ĐƠN (XỬ LÝ STEPPER ĐỘNG CHUẨN NGHIỆP VỤ) */}
          {app.status !== "ACCEPTED" && app.status !== "REJECTED" && (
            <div className="pt-2 flex justify-end gap-3 select-none">
              {/* NÚT TỪ CHỐI: Luôn xuất hiện ở mọi bước nếu chưa kết thúc quy trình */}
              <button
                type="button"
                disabled={actionLoadingId !== null}
                onClick={() => handleUpdateStatus(app.id, "REJECTED")}
                className="inline-flex items-center gap-1 py-2 px-4 text-[10px] font-black uppercase text-rose-400 border border-rose-500/20 hover:bg-rose-500/10 transition rounded-xl cursor-pointer"
              >
                <Ban size={12} /> Từ chối hồ sơ
              </button>

              {/* NÚT TIẾN ĐỘ ĐỘNG THEO TRẠNG THÁI HIỆN TẠI */}
              {app.status === "APPLIED" && (
                <button
                  type="button"
                  disabled={actionLoadingId !== null}
                  onClick={() => handleUpdateStatus(app.id, "REVIEWING")}
                  className="inline-flex items-center gap-1.5 bg-primary hover:bg-primary-hover text-white py-2 px-5 text-[10px] font-black uppercase tracking-wider rounded-xl transition shadow-md active:scale-95 cursor-pointer"
                >
                  {actionLoadingId === app.id ? (
                    <Loader2 className="w-3 h-3 animate-spin" />
                  ) : (
                    <>
                      <UserCheck size={12} /> Tiếp nhận hồ sơ
                    </>
                  )}
                </button>
              )}

              {app.status === "REVIEWING" && (
                <button
                  type="button"
                  disabled={actionLoadingId !== null}
                  onClick={() => handleUpdateStatus(app.id, "INTERVIEW")}
                  className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white py-2 px-5 text-[10px] font-black uppercase tracking-wider rounded-xl transition shadow-md active:scale-95 cursor-pointer"
                >
                  {actionLoadingId === app.id ? (
                    <Loader2 className="w-3 h-3 animate-spin" />
                  ) : (
                    <>
                      <Sparkles size={12} /> Mời phỏng vấn ➔
                    </>
                  )}
                </button>
              )}

              {app.status === "INTERVIEW" && (
                <button
                  type="button"
                  disabled={actionLoadingId !== null}
                  onClick={() => handleUpdateStatus(app.id, "ACCEPTED")}
                  className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white py-2 px-5 text-[10px] font-black uppercase tracking-wider rounded-xl transition shadow-md active:scale-95 cursor-pointer"
                >
                  {actionLoadingId === app.id ? (
                    <Loader2 className="w-3 h-3 animate-spin" />
                  ) : (
                    <>
                      <UserCheck size={12} /> Chấp nhận tuyển dụng 🎉
                    </>
                  )}
                </button>
              )}
            </div>
          )}

          {/* HIỂN THỊ TRẠNG THÁI KẾT THÚC (NẾU ĐÃ CHỐT ĐƠN) */}
          {app.status === "ACCEPTED" && (
            <div className="text-right text-xs font-black text-emerald-400 uppercase tracking-wider select-none">
              ✓ Quy trình hoàn tất: Đã tiếp nhận vào công ty
            </div>
          )}
          {app.status === "REJECTED" && (
            <div className="text-right text-xs font-black text-rose-500 uppercase tracking-wider select-none">
              ✕ Hồ sơ không phù hợp với tiêu chí tuyển dụng
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
