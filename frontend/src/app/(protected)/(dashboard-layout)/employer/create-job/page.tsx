"use client";

import AccessibilityOptionForm from "@/src/components/sections/jobs/createJob/AccessibilityOptionForm";
import BaseJobForm from "@/src/components/sections/jobs/createJob/BaseJobForm";
import SalaryDetailForm from "@/src/components/sections/jobs/createJob/SalaryDetailForm";
import Button from "@/src/components/ui/Button";
import { jobService } from "@/src/services/jobService";
import { Loader2, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

export default function CreateJobPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [categories, setCategories] = useState<any[]>([]);
  const [errorMsg, setErrorMsg] = useState("");
  const [disabilityTypes, setDisabilityTypes] = useState<any[]>([]);
  const [suitableDisabilityIds, setSuitableDisabilityIds] = useState<number[]>(
    [],
  );

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

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const types = await jobService.getDisabilityTypes();
        if (Array.isArray(types)) {
          setDisabilityTypes(types);
        }
      } catch (error) {
        console.error("Không thể tải danh mục khuyết tật:", error);
      }
    };
    loadInitialData();
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

  const handleCheckboxDis = (id: number) => {
    setSuitableDisabilityIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    try {
      const payload = {
        title: formData.title,
        categoryId: Number(formData.categoryId),
        type: formData.type,
        location: formData.location,
        salaryMin: formData.salaryMin ? Number(formData.salaryMin) : null,
        salaryMax: formData.salaryMax ? Number(formData.salaryMax) : null,
        salaryText: formData.salaryText || null,
        description: formData.description,
        requirements: formData.requirements,
        accessibilityFeatures: selectedAccessibility.join(", ") || null,
        suitableDisabilityIds: suitableDisabilityIds,
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
    <div className="max-w-4xl mx-auto py-6 text-slate-900 dark:text-white transition-colors duration-300">
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
        <BaseJobForm
          formData={formData}
          handleInputChange={handleInputChange}
          categories={categories}
          categoriesLoading={categoriesLoading}
        />

        {/* SECTION 2: ĐÃI NGỘ & MÔ TẢ */}
        <SalaryDetailForm
          formData={formData}
          handleInputChange={handleInputChange}
        />

        {/* SECTION 3: TRỢ NĂNG ĐẶC THÙ & PHÂN LOẠI ỨNG VIÊN */}
        <AccessibilityOptionForm
          selectedAccessibility={selectedAccessibility}
          handleCheckboxChange={handleCheckboxChange}
          disabilityTypes={disabilityTypes}
          suitableDisabilityIds={suitableDisabilityIds}
          handleCheckboxDis={handleCheckboxDis}
        />

        {/* ACTIONS BUTTONS */}
        <div className="flex items-center justify-end gap-4 pt-2">
          <Button
            type="button"
            variant="secondary"
            onClick={() => router.back()}
            className="w-fit px-6 py-3 normal-case font-bold"
          >
            Hủy bỏ
          </Button>
          <Button
            type="submit"
            disabled={loading || categoriesLoading}
            className="w-fit px-8 py-4 text-xs"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                Đăng tin tuyển dụng <Sparkles size={16} />
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
