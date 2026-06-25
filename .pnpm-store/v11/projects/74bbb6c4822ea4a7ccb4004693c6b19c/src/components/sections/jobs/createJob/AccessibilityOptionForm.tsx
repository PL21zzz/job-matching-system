import EmployerAccessibilityChecklist from "@/src/components/accessibility/EmployerAccessibilityChecklist";
import Card from "@/src/components/ui/Card";
import { DISABILITY_SUPPORT_GROUPS } from "@/src/constants/disability-support";
import { Accessibility, CheckCircle2 } from "lucide-react";

interface AccessibilityOptionFormProps {
  categoryHelperText?: string;
  categoryName?: string;
  employerAccessibilityOptions: string[];
  suitableDisabilityIds: number[];
  selectedAccommodationsByType: Record<number, string[]>;
  handleToggleEmployerAccessibilityOption: (value: string) => void;
  handleToggleDisability: (id: number) => void;
  handleToggleAccommodation: (disabilityTypeId: number, value: string) => void;
  visibleAccommodationsByType?: Record<number, string[]>;
}

export default function AccessibilityOptionForm({
  categoryHelperText,
  categoryName,
  employerAccessibilityOptions,
  suitableDisabilityIds,
  selectedAccommodationsByType,
  handleToggleEmployerAccessibilityOption,
  handleToggleDisability,
  handleToggleAccommodation,
  visibleAccommodationsByType = {},
}: AccessibilityOptionFormProps) {
  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <Card layoutClassName="p-6 sm:p-8 space-y-5 border border-slate-200 dark:border-white/10">
        <EmployerAccessibilityChecklist
          title="Tiện ích hạ tầng của doanh nghiệp"
          helperText="Đây là các điều kiện hạ tầng hoặc môi trường làm việc sẵn có của doanh nghiệp. Chúng thuộc cấp doanh nghiệp, không phải là trợ năng bắt buộc riêng cho từng nhiệm vụ của công việc."
          selectedOptions={employerAccessibilityOptions}
          onToggle={handleToggleEmployerAccessibilityOption}
        />
      </Card>

      <Card layoutClassName="p-6 sm:p-8 space-y-4 border-2 border-primary/20">
        <div className="flex items-center gap-2 text-primary">
          <Accessibility size={18} />
          <h3 className="text-lg font-extrabold">
            Trợ năng bắt buộc theo từng vị trí công việc
          </h3>
        </div>

        <p className="text-sm leading-7 text-slate-500 dark:text-slate-400">
          Phần này mô tả những hỗ trợ trực tiếp để ứng viên thực hiện công việc
          cụ thể. Nó khác với tiện ích hạ tầng ở trên. Ví dụ: giao tiếp bằng văn
          bản, checklist công việc rõ ràng, không bắt buộc gọi điện, hay tài
          liệu tương thích screen reader.
        </p>

        {categoryName ? (
          <div className="rounded-2xl border border-primary/20 bg-primary/5 p-4 text-sm font-semibold leading-relaxed text-slate-700 dark:text-slate-200">
            <span className="font-black text-primary">Category đang chọn:</span>{" "}
            {categoryName}
            {categoryHelperText ? (
              <>
                <br />
                <span className="mt-2 inline-block text-slate-600 dark:text-slate-300">
                  {categoryHelperText}
                </span>
              </>
            ) : null}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-200 p-4 text-sm text-slate-500 dark:border-white/10 dark:text-slate-400">
            Hãy chọn category trước để hệ thống gợi ý các trợ năng phù hợp hơn
            với tính chất công việc.
          </div>
        )}
      </Card>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        {DISABILITY_SUPPORT_GROUPS.map((group) => {
          const active = suitableDisabilityIds.includes(group.id);
          const chosen = selectedAccommodationsByType[group.id] || [];
          const visibleItems =
            visibleAccommodationsByType[group.id]?.length
              ? visibleAccommodationsByType[group.id]
              : group.accommodations;

          return (
            <div
              key={group.id}
              className={`rounded-3xl border p-6 transition-all ${
                active
                  ? "border-primary/40 bg-primary/5 shadow-lg shadow-primary/5"
                  : "border-slate-200 bg-white dark:border-white/10 dark:bg-surface"
              }`}
            >
              <button
                type="button"
                onClick={() => handleToggleDisability(group.id)}
                className="w-full text-left"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.25em] text-slate-400">
                      Nhóm hỗ trợ
                    </p>
                    <h4 className="mt-2 text-xl font-black text-slate-900 dark:text-white">
                      {group.label}
                    </h4>
                    <p className="mt-2 text-sm leading-7 text-slate-500 dark:text-slate-400">
                      {group.description}
                    </p>
                  </div>

                  <div
                    className={`mt-1 flex h-6 w-6 items-center justify-center rounded-full border ${
                      active
                        ? "border-primary bg-primary text-white"
                        : "border-slate-300 dark:border-white/15"
                    }`}
                  >
                    {active && <CheckCircle2 size={14} />}
                  </div>
                </div>
              </button>

              <div className="mt-5 space-y-3">
                {visibleItems.map((item) => {
                  const checked = chosen.includes(item);

                  return (
                    <label
                      key={item}
                      className={`flex items-start gap-3 rounded-2xl border p-4 transition-all ${
                        active
                          ? "cursor-pointer border-slate-200 bg-white/80 hover:border-primary/40 dark:border-white/10 dark:bg-secondary/70"
                          : "cursor-not-allowed border-slate-100 bg-slate-50/70 opacity-60 dark:border-white/5 dark:bg-slate-900/40"
                      }`}
                    >
                      <input
                        type="checkbox"
                        disabled={!active}
                        checked={checked}
                        onChange={() =>
                          handleToggleAccommodation(group.id, item)
                        }
                        className="mt-1 h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary"
                      />
                      <div>
                        <p className="text-sm font-bold text-slate-700 dark:text-slate-200">
                          {item}
                        </p>
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
