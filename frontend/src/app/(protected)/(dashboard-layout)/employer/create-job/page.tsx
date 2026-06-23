"use client";

import AccessibilityOptionForm from "@/src/components/sections/jobs/createJob/AccessibilityOptionForm";
import BaseJobForm from "@/src/components/sections/jobs/createJob/BaseJobForm";
import SalaryDetailForm from "@/src/components/sections/jobs/createJob/SalaryDetailForm";
import Button from "@/src/components/ui/Button";
import { DISABILITY_SUPPORT_GROUPS } from "@/src/constants/disability-support";
import { serializeJobAccessibility } from "@/src/lib/job-accessibility";
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
  const [suitableDisabilityIds, setSuitableDisabilityIds] = useState<number[]>([]);
  const [selectedAccommodationsByType, setSelectedAccommodationsByType] =
    useState<Record<number, string[]>>({});

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

  const handleToggleDisability = (id: number) => {
    setSuitableDisabilityIds((prev) => {
      const exists = prev.includes(id);
      if (exists) {
        setSelectedAccommodationsByType((current) => ({
          ...current,
          [id]: [],
        }));
        return prev.filter((item) => item !== id);
      }

      return [...prev, id];
    });
  };

  const handleToggleAccommodation = (disabilityTypeId: number, value: string) => {
    setSelectedAccommodationsByType((prev) => {
      const current = prev[disabilityTypeId] || [];
      const next = current.includes(value)
        ? current.filter((item) => item !== value)
        : [...current, value];

      return {
        ...prev,
        [disabilityTypeId]: next,
      };
    });
  };

  const validateAccessibility = () => {
    if (!suitableDisabilityIds.length) {
      return "Bạn cần chọn ít nhất 1 trong 4 nhóm khuyết tật mục tiêu.";
    }

    for (const disabilityTypeId of suitableDisabilityIds) {
      const selected = selectedAccommodationsByType[disabilityTypeId] || [];
      if (!selected.length) {
        const label =
          DISABILITY_SUPPORT_GROUPS.find((item) => item.id === disabilityTypeId)
            ?.label || `Nhóm ${disabilityTypeId}`;
        return `Nhóm "${label}" cần có ít nhất 1 accommodation cụ thể.`;
      }
    }

    return "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    const accessibilityError = validateAccessibility();
    if (accessibilityError) {
      setErrorMsg(accessibilityError);
      return;
    }

    setLoading(true);

    try {
      const accessibilityFeatures = serializeJobAccessibility(
        suitableDisabilityIds.map((id) => ({
          disabilityTypeId: id,
          disabilityTypeName:
            DISABILITY_SUPPORT_GROUPS.find((item) => item.id === id)?.label,
          accommodations: selectedAccommodationsByType[id] || [],
        })),
      );

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
        accessibilityFeatures,
        suitableDisabilityIds,
      };

      await jobService.createJob(payload);
      toast.success("Đăng tin tuyển dụng thành công!");
      router.push("/jobs");
    } catch (error: any) {
      setErrorMsg(error?.message || "Đã xảy ra lỗi khi đăng tin tuyển dụng.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-6 text-slate-900 dark:text-white transition-colors duration-300">
      <div className="mb-8">
        <p className="text-xs font-medium text-slate-400 dark:text-gray-500 mb-1">
          Nhà tuyển dụng / Đăng tin mới
        </p>
        <h1 className="text-3xl font-black uppercase tracking-tight text-slate-900 dark:text-white">
          Tạo bài đăng tuyển dụng
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Vị trí sẽ được chuẩn hóa theo 4 nhóm khuyết tật mục tiêu để AI và bộ
          lọc tìm việc hiểu đúng ngay từ đầu.
        </p>
      </div>

      {errorMsg && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 rounded-xl text-sm font-bold text-red-600 dark:text-red-400">
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        <BaseJobForm
          formData={formData}
          handleInputChange={handleInputChange}
          categories={categories}
          categoriesLoading={categoriesLoading}
        />

        <SalaryDetailForm
          formData={formData}
          handleInputChange={handleInputChange}
        />

        <AccessibilityOptionForm
          suitableDisabilityIds={suitableDisabilityIds}
          selectedAccommodationsByType={selectedAccommodationsByType}
          handleToggleDisability={handleToggleDisability}
          handleToggleAccommodation={handleToggleAccommodation}
        />

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
