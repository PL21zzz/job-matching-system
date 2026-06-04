import Card from "@/src/components/ui/Card";
import { ACCESSIBILITY_OPTIONS } from "@/src/constants/jobs";
import { Accessibility } from "lucide-react";

interface AccessibilityOptionFormProps {
  selectedAccessibility: string[];
  handleCheckboxChange: (option: string) => void;
  disabilityTypes: any[];
  suitableDisabilityIds: number[];
  handleCheckboxDis: (id: number) => void;
}

export default function AccessibilityOptionForm({
  selectedAccessibility,
  handleCheckboxChange,
  disabilityTypes,
  suitableDisabilityIds,
  handleCheckboxDis,
}: AccessibilityOptionFormProps) {
  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Khối tùy chọn tiện ích hạ tầng */}
      <div className="p-8 rounded-3xl bg-slate-50/50 dark:bg-surface border-2 border-primary/30 shadow-xl space-y-6">
        <h3 className="font-extrabold text-lg flex items-center gap-2 text-primary">
          <Accessibility size={18} /> Hạ tầng trợ năng hỗ trợ người khuyết tật
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {ACCESSIBILITY_OPTIONS.map((option) => {
            const isChecked = selectedAccessibility.includes(option);
            return (
              <div
                key={option}
                onClick={() => handleCheckboxChange(option)}
                className="flex items-center gap-3 p-4 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-secondary cursor-pointer group transition-all select-none hover:border-primary"
              >
                <div
                  className={`w-5 h-5 border-2 rounded-md flex items-center justify-center ${isChecked ? "border-primary bg-primary/10" : "border-slate-200 dark:border-white/10"}`}
                >
                  <div
                    className={`w-2 h-2 bg-primary rounded-sm ${isChecked ? "opacity-100" : "opacity-0"}`}
                  />
                </div>
                <span
                  className={`text-sm font-bold ${isChecked ? "text-primary" : "text-slate-600 dark:text-gray-400"}`}
                >
                  {option}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Khối phân loại nhóm khuyết tật phù hợp */}
      <Card layoutClassName="p-6 space-y-4">
        <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-primary">
          Nhóm ứng viên khuyết tật phù hợp với vị trí này *
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          {disabilityTypes.map((type) => (
            <label
              key={type.id}
              className="flex items-center gap-3 p-4 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-secondary cursor-pointer hover:border-primary/40 transition-all select-none"
            >
              <input
                type="checkbox"
                checked={suitableDisabilityIds.includes(type.id)}
                onChange={() => handleCheckboxDis(type.id)}
                className="w-4 h-4 rounded border-slate-300 dark:border-white/10 text-primary focus:ring-primary accent-primary cursor-pointer"
              />
              <div className="text-left">
                <p className="text-xs font-bold text-slate-900 dark:text-white leading-none">
                  {type.name}
                </p>
                <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium mt-1 leading-normal">
                  {type.description}
                </p>
              </div>
            </label>
          ))}
        </div>
        <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium italic">
          * Lưu ý: Việc lựa chọn chính xác nhóm khuyết tật giúp hệ thống AI
          Matchmaker điều hướng tin tuyển dụng đến đúng phân vùng màn hình hiển
          thị của ứng viên phù hợp.
        </p>
      </Card>
    </div>
  );
}
