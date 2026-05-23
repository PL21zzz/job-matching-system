"use client";

import api from "@/src/lib/axios";
import { ArrowLeft, Image as ImageIcon, Save, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

export default function ProfileEditPage() {
  const router = useRouter();
  const [role, setRole] = useState<"Candidate" | "Employer" | null>(null);
  const [loading, setLoading] = useState(false);

  const [fullName, setFullName] = useState("");
  const [candidateData, setCandidateData] = useState({
    dob: "",
    phone: "",
    address: "",
  });
  const [employerData, setEmployerData] = useState({
    companyName: "",
    taxCode: "",
    address: "",
    description: "",
    accessibilityFeatures: "",
  });

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
      try {
        const payload = JSON.parse(window.atob(token.split(".")[1]));
        setRole(payload.role);
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const bodyData =
      role === "Candidate"
        ? { fullName, ...candidateData }
        : { ...employerData };

    try {
      const response = await api.patch("/users/profile/edit", bodyData);
      if (response.status === 200 || response.status === 201) {
        toast.success("Cập nhật hồ sơ thành công!");
        router.push("/profile");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Lỗi lưu dữ liệu.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-secondary text-slate-900 dark:text-white py-12 px-4 transition-colors duration-300">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Top Actions Nav */}
        <div className="flex items-center justify-between">
          <a
            href="/profile"
            className="flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-primary transition-all uppercase tracking-wider"
          >
            <ArrowLeft size={14} /> Quay lại tổng quan
          </a>
          <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-widest">
            <Sparkles size={10} /> Chỉnh sửa profile
          </div>
        </div>

        {/* Main Box */}
        <form
          onSubmit={handleSave}
          className="p-8 md:p-12 rounded-4xl bg-slate-50 dark:bg-surface border border-slate-200 dark:border-border-subtle shadow-2xl space-y-8 relative"
        >
          {/* Badge phân loại giả lập trên đỉnh form */}
          <div className="flex justify-center">
            <div className="inline-flex bg-white dark:bg-secondary p-1 rounded-xl border border-slate-200 dark:border-border-subtle text-[10px] font-black uppercase tracking-wider">
              <span
                className={`px-4 py-1.5 rounded-lg ${role === "Candidate" ? "bg-primary text-white dark:text-secondary font-black" : "text-slate-400"}`}
              >
                Ứng viên
              </span>
              <span
                className={`px-4 py-1.5 rounded-lg ${role === "Employer" ? "bg-primary text-white dark:text-secondary font-black" : "text-slate-400"}`}
              >
                Nhà tuyển dụng
              </span>
            </div>
          </div>

          <h2 className="text-xl md:text-2xl font-black uppercase tracking-tight text-center">
            Cập nhật thông tin hồ sơ
          </h2>

          {role === "Candidate" ? (
            <div className="space-y-5">
              <div className="space-y-2">
                <label className="text-[11px] font-black uppercase tracking-wider text-slate-400">
                  Họ và tên
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Nhập đầy đủ họ tên của bạn"
                  className="w-full p-4 rounded-xl border border-slate-200 dark:border-border-subtle bg-white dark:bg-secondary outline-none text-sm font-bold focus:border-primary transition-all text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600"
                  required
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className="text-[11px] font-black uppercase tracking-wider text-slate-400">
                    Ngày sinh
                  </label>
                  <input
                    type="date"
                    value={candidateData.dob}
                    onChange={(e) =>
                      setCandidateData({
                        ...candidateData,
                        dob: e.target.value,
                      })
                    }
                    className="w-full p-4 rounded-xl border border-slate-200 dark:border-border-subtle bg-white dark:bg-secondary outline-none text-sm font-bold focus:border-primary transition-all text-slate-900 dark:text-white"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-black uppercase tracking-wider text-slate-400">
                    Số điện thoại
                  </label>
                  <input
                    type="tel"
                    value={candidateData.phone}
                    onChange={(e) =>
                      setCandidateData({
                        ...candidateData,
                        phone: e.target.value,
                      })
                    }
                    placeholder="0xxx xxx xxx"
                    className="w-full p-4 rounded-xl border border-slate-200 dark:border-border-subtle bg-white dark:bg-secondary outline-none text-sm font-bold focus:border-primary transition-all text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-black uppercase tracking-wider text-slate-400">
                  Địa chỉ liên hệ
                </label>
                <input
                  type="text"
                  value={candidateData.address}
                  onChange={(e) =>
                    setCandidateData({
                      ...candidateData,
                      address: e.target.value,
                    })
                  }
                  placeholder="Địa chỉ thường trú hoặc tạm trú"
                  className="w-full p-4 rounded-xl border border-slate-200 dark:border-border-subtle bg-white dark:bg-secondary outline-none text-sm font-bold focus:border-primary transition-all text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600"
                />
              </div>
            </div>
          ) : (
            <div className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className="text-[11px] font-black uppercase tracking-wider text-slate-400">
                    Tên doanh nghiệp / công ty
                  </label>
                  <input
                    type="text"
                    value={employerData.companyName}
                    onChange={(e) =>
                      setEmployerData({
                        ...employerData,
                        companyName: e.target.value,
                      })
                    }
                    placeholder="Nhập tên doanh nghiệp"
                    className="w-full p-4 rounded-xl border border-slate-200 dark:border-border-subtle bg-white dark:bg-secondary outline-none text-sm font-bold focus:border-primary transition-all text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-black uppercase tracking-wider text-slate-400">
                    Mã số thuế
                  </label>
                  <input
                    type="text"
                    value={employerData.taxCode}
                    onChange={(e) =>
                      setEmployerData({
                        ...employerData,
                        taxCode: e.target.value,
                      })
                    }
                    placeholder="Mã số doanh nghiệp"
                    className="w-full p-4 rounded-xl border border-slate-200 dark:border-border-subtle bg-white dark:bg-secondary outline-none text-sm font-bold focus:border-primary transition-all text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-black uppercase tracking-wider text-slate-400">
                  Địa chỉ văn phòng
                </label>
                <input
                  type="text"
                  value={employerData.address}
                  onChange={(e) =>
                    setEmployerData({
                      ...employerData,
                      address: e.target.value,
                    })
                  }
                  placeholder="Địa chỉ trụ sở chính"
                  className="w-full p-4 rounded-xl border border-slate-200 dark:border-border-subtle bg-white dark:bg-secondary outline-none text-sm font-bold focus:border-primary transition-all text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-black uppercase tracking-wider text-slate-400">
                  Mô tả tóm tắt hoạt động
                </label>
                <textarea
                  rows={3}
                  value={employerData.description}
                  onChange={(e) =>
                    setEmployerData({
                      ...employerData,
                      description: e.target.value,
                    })
                  }
                  placeholder="Giới thiệu sơ lược lịch sử và định hướng doanh nghiệp..."
                  className="w-full p-4 rounded-xl border border-slate-200 dark:border-border-subtle bg-white dark:bg-secondary outline-none text-sm font-bold focus:border-primary transition-all text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 resize-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-black uppercase tracking-wider text-slate-400">
                  Tiện ích trợ năng hạ tầng văn phòng hiện có
                </label>
                <input
                  type="text"
                  value={employerData.accessibilityFeatures}
                  onChange={(e) =>
                    setEmployerData({
                      ...employerData,
                      accessibilityFeatures: e.target.value,
                    })
                  }
                  placeholder="Ví dụ: Lối đi xe lăn, Thang máy hỗ trợ âm thanh..."
                  className="w-full p-4 rounded-xl border border-slate-200 dark:border-border-subtle bg-white dark:bg-secondary outline-none text-sm font-bold focus:border-primary transition-all text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600"
                />
              </div>
            </div>
          )}

          {/* Khối File tĩnh đính kèm mô phỏng */}
          <div className="p-5 rounded-xl border border-slate-200 dark:border-border-subtle bg-white dark:bg-secondary flex items-center gap-4">
            <div className="w-12 h-12 bg-slate-100 dark:bg-white/5 rounded-lg flex items-center justify-center text-slate-400">
              <ImageIcon size={20} />
            </div>
            <div>
              <p className="text-xs font-black uppercase tracking-wide">
                Ảnh đại diện hồ sơ
              </p>
              <p className="text-[10px] text-slate-500 font-bold mt-1">
                Hệ thống tự động đồng bộ hóa hình ảnh gốc từ tài khoản Google
                định danh của sếp.
              </p>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={loading}
              className="bg-primary hover:bg-primary-hover text-white dark:text-secondary font-black py-3.5 px-8 rounded-xl text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-primary/10 transition-all active:scale-95"
            >
              <Save size={14} /> {loading ? "Đang lưu..." : "Lưu thay đổi"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
