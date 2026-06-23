import Card from "@/src/components/ui/Card";
import { DISABILITY_SUPPORT_GROUPS } from "@/src/constants/disability-support";
import { Accessibility, CheckCircle2 } from "lucide-react";

interface AccessibilityOptionFormProps {
  suitableDisabilityIds: number[];
  selectedAccommodationsByType: Record<number, string[]>;
  handleToggleDisability: (id: number) => void;
  handleToggleAccommodation: (disabilityTypeId: number, value: string) => void;
}

export default function AccessibilityOptionForm({
  suitableDisabilityIds,
  selectedAccommodationsByType,
  handleToggleDisability,
  handleToggleAccommodation,
}: AccessibilityOptionFormProps) {
  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <Card layoutClassName="p-6 sm:p-8 space-y-4 border-2 border-primary/20">
        <div className="flex items-center gap-2 text-primary">
          <Accessibility size={18} />
          <h3 className="text-lg font-extrabold">
            Trợ năng bắt buộc theo 4 nhóm khuyết tật
          </h3>
        </div>
        <p className="text-sm text-slate-500 dark:text-slate-400 leading-7">
          Employer cần chọn nhóm ứng viên phù hợp và đánh dấu rõ accommodation mà
          vị trí này thực sự hỗ trợ. Dữ liệu này sẽ được dùng chung cho bộ lọc tìm
          việc, AI assistant và gợi ý matching.
        </p>
      </Card>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {DISABILITY_SUPPORT_GROUPS.map((group) => {
          const active = suitableDisabilityIds.includes(group.id);
          const chosen = selectedAccommodationsByType[group.id] || [];

          return (
            <div
              key={group.id}
              className={`rounded-3xl border p-6 transition-all ${
                active
                  ? "border-primary/40 bg-primary/5 shadow-lg shadow-primary/5"
                  : "border-slate-200 dark:border-white/10 bg-white dark:bg-surface"
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
                {group.accommodations.map((item) => {
                  const checked = chosen.includes(item);
                  return (
                    <label
                      key={item}
                      className={`flex items-start gap-3 rounded-2xl border p-4 transition-all ${
                        active
                          ? "cursor-pointer border-slate-200 dark:border-white/10 bg-white/80 dark:bg-secondary/70 hover:border-primary/40"
                          : "cursor-not-allowed border-slate-100 dark:border-white/5 bg-slate-50/70 dark:bg-slate-900/40 opacity-60"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        disabled={!active}
                        onChange={() =>
                          handleToggleAccommodation(group.id, item)
                        }
                        className="mt-1 h-4 w-4 accent-primary"
                      />
                      <span className="text-sm font-medium leading-6 text-slate-700 dark:text-slate-200">
                        {item}
                      </span>
                    </label>
                  );
                })}
              </div>

              <p className="mt-4 text-xs text-slate-400 dark:text-slate-500">
                {active
                  ? `Đã chọn ${chosen.length} accommodation cho nhóm này.`
                  : "Bật nhóm này trước rồi mới chọn accommodation."}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
