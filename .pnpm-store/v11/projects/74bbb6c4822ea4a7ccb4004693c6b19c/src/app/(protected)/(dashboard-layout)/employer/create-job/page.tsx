"use client";

import AccessibilityOptionForm from "@/src/components/sections/jobs/createJob/AccessibilityOptionForm";
import BaseJobForm from "@/src/components/sections/jobs/createJob/BaseJobForm";
import SalaryDetailForm from "@/src/components/sections/jobs/createJob/SalaryDetailForm";
import Button from "@/src/components/ui/Button";
import { getCategoryAccessibilityPreset } from "@/src/constants/category-accessibility";
import { DISABILITY_SUPPORT_GROUPS } from "@/src/constants/disability-support";
import { parseSelectedAccessibilityOptions } from "@/src/lib/employer-accessibility";
import { serializeJobAccessibility } from "@/src/lib/job-accessibility";
import { authService } from "@/src/services/authService";
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
  const [suitableDisabilityIds, setSuitableDisabilityIds] = useState<number[]>(
    [],
  );
  const [employerAccessibilityOptions, setEmployerAccessibilityOptions] =
    useState<string[]>([]);
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
    const loadInitialData = async () => {
      try {
        const [categoryData, profileData] = await Promise.all([
          jobService.getCategories(),
          authService.getProfileMe(),
        ]);

        setCategories(categoryData || []);
        setEmployerAccessibilityOptions(
          parseSelectedAccessibilityOptions(
            profileData?.employerProfile?.accessibilityFeatures,
          ),
        );
      } catch (error) {
        toast.error("Không thể tải dữ liệu ban đầu cho form tuyển dụng.");
      } finally {
        setCategoriesLoading(false);
      }
    };

    loadInitialData();
  }, []);

  const selectedCategory = categories.find(
    (category) => String(category.id) === String(formData.categoryId),
  );

  const categoryPreset = getCategoryAccessibilityPreset(selectedCategory?.name);

  const visibleAccommodationsByType = DISABILITY_SUPPORT_GROUPS.reduce<
    Record<number, string[]>
  >((acc, group) => {
    acc[group.id] =
      categoryPreset?.disabilityPresets[group.id]?.length
        ? categoryPreset.disabilityPresets[group.id]
        : group.accommodations;
    return acc;
  }, {});

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

  const handleToggleEmployerAccessibilityOption = (value: string) => {
    setEmployerAccessibilityOptions((prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value],
    );
  };

  useEffect(() => {
    if (!categoryPreset) {
      return;
    }

    setSelectedAccommodationsByType((prev) => {
      const next: Record<number, string[]> = {};

      for (const group of DISABILITY_SUPPORT_GROUPS) {
        const allowed = visibleAccommodationsByType[group.id] || [];
        const current = prev[group.id] || [];
        next[group.id] = current.filter((item) => allowed.includes(item));
      }

      return next;
    });
  }, [formData.categoryId]);

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
        {
          officeFacilities: employerAccessibilityOptions,
        },
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
      setErrorMsg(
        typeof error === "string"
          ? error
          : "Đã xảy ra lỗi khi đăng tin tuyển dụng.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-5xl py-6 text-slate-900 transition-colors duration-300 dark:text-white">
      <div className="mb-8">
        <p className="mb-1 text-xs font-medium text-slate-400 dark:text-gray-500">
          Nhà tuyển dụng / Đăng tin mới
        </p>
        <h1 className="text-3xl font-black uppercase tracking-tight text-slate-900 dark:text-white">
          Tạo bài đăng tuyển dụng
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Vị trí sẽ được chuẩn hóa theo 4 nhóm khuyết tật mục tiêu để AI và bộ
          lọc tìm việc hiểu đúng ngay từ đầu.
        </p>
      </div>

      {errorMsg && (
        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-bold text-red-600 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-400">
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
          categoryName={selectedCategory?.name}
          categoryHelperText={categoryPreset?.helperText}
          employerAccessibilityOptions={employerAccessibilityOptions}
          suitableDisabilityIds={suitableDisabilityIds}
          selectedAccommodationsByType={selectedAccommodationsByType}
          handleToggleEmployerAccessibilityOption={
            handleToggleEmployerAccessibilityOption
          }
          handleToggleDisability={handleToggleDisability}
          handleToggleAccommodation={handleToggleAccommodation}
          visibleAccommodationsByType={visibleAccommodationsByType}
        />

        <div className="flex items-center justify-end gap-4 pt-2">
          <Button
            type="button"
            variant="secondary"
            onClick={() => router.back()}
            className="w-fit px-6 py-3 font-bold normal-case"
          >
            Hủy bỏ
          </Button>

          <Button
            type="submit"
            disabled={loading || categoriesLoading}
            className="w-fit px-8 py-4 text-xs"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
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
