"use client";

import { ACCESSIBILITY_OPTIONS } from "@/src/constants/jobs";
import { jobService } from "@/src/services/jobService";
import {
  Accessibility,
  Briefcase,
  DollarSign,
  Loader2,
  MapPin,
  Sparkles,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

export default function CreateJobPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [categoriesLoading, setCategoriesLoading] = useState(true); // Loading riêng cho ô ngành nghề
  const [categories, setCategories] = useState<any[]>([]); // Lưu ngành nghề từ DB
  const [errorMsg, setErrorMsg] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    categoryId: "",
    type: "FULL_TIME",
    location: "",
    salaryMin: "",
    salaryMax: "",
    salaryText: "",
    description: "",
    requirements: "",
  });

  const [selectedAccessibility, setSelectedAccessibility] = useState<string[]>(
    [],
  );

  // 🔥 Khởi tạo: Gọi API bốc danh mục ngành nghề xịn từ Database
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await jobService.getCategories();
        setCategories(data || []);
      } catch (error) {
        console.error("Lỗi lấy danh mục ngành nghề:", error);
        toast.error("Không thể tải danh sách ngành nghề hệ thống.");
      } finally {
        setCategoriesLoading(false);
      }
    };
    loadCategories();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (option: string) => {
    setSelectedAccessibility((prev) =>
      prev.includes(option)
        ? prev.filter((item) => item !== option)
        : [...prev, option],
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    try {
      const payload = {
        title: formData.title,
        categoryId: Number(formData.categoryId), // Ép kiểu về số nguyên khớp DTO ở Backend
        type: formData.type,
        location: formData.location,
        salaryMin: formData.salaryMin ? Number(formData.salaryMin) : null,
        salaryMax: formData.salaryMax ? Number(formData.salaryMax) : null,
        salaryText: formData.salaryText || null,
        description: formData.description,
        requirements: formData.requirements,
        accessibilityFeatures: selectedAccessibility.join(", ") || null,
      };

      await jobService.createJob(payload);
      toast.success("Đăng tin tuyển dụng thành công! 🔥");
      router.push("/jobs");
    } catch (error: any) {
      setErrorMsg(error?.message || "Đã xảy ra lỗi khi đăng tin tuyển dụng.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-6 text-slate-900 dark:text-white">
      <div className="mb-8">
        <p className="text-xs font-medium text-slate-400 dark:text-gray-500 mb-1">
          Nhà tuyển dụng / Đăng tin mới
        </p>
        <h1 className="text-3xl font-black uppercase tracking-tight text-slate-900 dark:text-white">
          TẠO BÀI ĐĂNG TUYỂN DỤNG
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Hệ thống tự động đồng bộ hóa danh mục ngành nghề thời gian thực.
        </p>
      </div>

      {errorMsg && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 rounded-xl text-sm font-bold text-red-600 dark:text-red-400">
          ⚠ {errorMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* SECTION 1: CƠ BẢN */}
        <div className="p-8 rounded-3xl bg-slate-50/50 dark:bg-surface border border-slate-100 dark:border-white/5 space-y-6">
          <h3 className="font-extrabold text-lg flex items-center gap-2 text-[#25B5BA]">
            <Briefcase size={18} /> Thông tin công việc cơ bản
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2 md:col-span-2">
              <label className="text-xs font-black uppercase tracking-wider text-slate-400">
                Tiêu đề công việc *
              </label>
              <input
                type="text"
                name="title"
                required
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Ví dụ: Lập trình viên ReactJS, Thiết kế đồ họa..."
                className="w-full p-4 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-secondary outline-none text-sm focus:border-[#25B5BA]"
              />
            </div>

            {/* O SELECT ĐÃ ĐƯỢC CHUYỂN THÀNH DATA ĐỘNG KHỚP PRISMA SCHEMA */}
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-wider text-slate-400">
                Ngành nghề tuyển dụng *
              </label>
              <select
                name="categoryId"
                required
                value={formData.categoryId}
                onChange={handleInputChange}
                disabled={categoriesLoading}
                className="w-full p-4 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-secondary outline-none text-sm font-bold focus:border-[#25B5BA] disabled:opacity-50"
              >
                <option value="">
                  {categoriesLoading
                    ? " đang tải danh mục..."
                    : "-- Chọn ngành nghề --"}
                </option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-wider text-slate-400">
                Hình thức làm việc
              </label>
              <select
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                className="w-full p-4 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-secondary outline-none text-sm font-bold focus:border-[#25B5BA]"
              >
                <option value="FULL_TIME">FULL_TIME</option>
                <option value="PART_TIME">PART_TIME</option>
                <option value="REMOTE">REMOTE</option>
              </select>
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-xs font-black uppercase tracking-wider text-slate-400">
                Địa điểm làm việc *
              </label>
              <div className="relative">
                <MapPin
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  size={18}
                />
                <input
                  type="text"
                  name="location"
                  required
                  value={formData.location}
                  onChange={handleInputChange}
                  placeholder="Ví dụ: Hải Châu, Đà Nẵng"
                  className="w-full pl-12 pr-4 p-4 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-secondary outline-none text-sm focus:border-[#25B5BA]"
                />
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 2: ĐÃI NGỘ & MÔ TẢ */}
        <div className="p-8 rounded-3xl bg-slate-50/50 dark:bg-surface border border-slate-100 dark:border-white/5 space-y-6">
          <h3 className="font-extrabold text-lg flex items-center gap-2 text-purple-500">
            <DollarSign size={18} /> Đãi ngộ & Nội dung chi tiết
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-wider text-slate-400">
                Lương tối thiểu (VND)
              </label>
              <input
                type="number"
                name="salaryMin"
                value={formData.salaryMin}
                onChange={handleInputChange}
                className="w-full p-4 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-secondary outline-none text-sm"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-wider text-slate-400">
                Lương tối đa (VND)
              </label>
              <input
                type="number"
                name="salaryMax"
                value={formData.salaryMax}
                onChange={handleInputChange}
                className="w-full p-4 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-secondary outline-none text-sm"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-wider text-slate-400">
                Chuỗi hiển thị nhanh
              </label>
              <input
                type="text"
                name="salaryText"
                value={formData.salaryText}
                onChange={handleInputChange}
                placeholder="Thỏa thuận, 15-20tr..."
                className="w-full p-4 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-secondary outline-none text-sm"
              />
            </div>
            <div className="space-y-2 md:col-span-3">
              <label className="text-xs font-black uppercase tracking-wider text-slate-400">
                Mô tả công việc *
              </label>
              <textarea
                name="description"
                required
                rows={5}
                value={formData.description}
                onChange={handleInputChange}
                className="w-full p-4 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-secondary outline-none text-sm resize-none"
              />
            </div>
            <div className="space-y-2 md:col-span-3">
              <label className="text-xs font-black uppercase tracking-wider text-slate-400">
                Yêu cầu ứng viên *
              </label>
              <textarea
                name="requirements"
                required
                rows={5}
                value={formData.requirements}
                onChange={handleInputChange}
                className="w-full p-4 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-secondary outline-none text-sm resize-none"
              />
            </div>
          </div>
        </div>

        {/* SECTION 3: TRỢ NĂNG ĐẶC THÙ */}
        <div className="p-8 rounded-3xl bg-slate-50/50 dark:bg-surface border-2 border-[#25B5BA]/30 shadow-xl space-y-6">
          <h3 className="font-extrabold text-lg flex items-center gap-2 text-[#25B5BA]">
            <Accessibility size={18} /> Hạ tầng trợ năng hỗ trợ người khuyết tật
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {ACCESSIBILITY_OPTIONS.map((option) => {
              const isChecked = selectedAccessibility.includes(option);
              return (
                <div
                  key={option}
                  onClick={() => handleCheckboxChange(option)}
                  className="flex items-center gap-3 p-4 rounded-xl border bg-white dark:bg-secondary cursor-pointer group transition-all select-none hover:border-[#25B5BA]"
                >
                  <div
                    className={`w-5 h-5 border-2 rounded-md flex items-center justify-center ${isChecked ? "border-[#25B5BA] bg-[#25B5BA]/10" : "border-slate-200 dark:border-white/10"}`}
                  >
                    <div
                      className={`w-2 h-2 bg-[#25B5BA] rounded-sm ${isChecked ? "opacity-100" : "opacity-0"}`}
                    />
                  </div>
                  <span
                    className={`text-sm font-bold ${isChecked ? "text-[#25B5BA]" : "text-slate-600 dark:text-gray-400"}`}
                  >
                    {option}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* ACTIONS */}
        <div className="flex items-center justify-end gap-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-3 font-bold text-slate-400 hover:text-white"
          >
            Hủy bỏ
          </button>
          <button
            type="submit"
            disabled={loading || categoriesLoading}
            className="px-8 py-4 rounded-2xl bg-[#25B5BA] hover:bg-[#1da0a5] text-white font-black text-sm transition-all shadow-lg flex items-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                Đăng tin tuyển dụng <Sparkles size={16} />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
