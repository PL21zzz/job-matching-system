import Card from "@/src/components/ui/Card";
import { DollarSign } from "lucide-react";

interface SalaryDetailFormProps {
  formData: any;
  handleInputChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void;
}

export default function SalaryDetailForm({
  formData,
  handleInputChange,
}: SalaryDetailFormProps) {
  return (
    <Card layoutClassName="p-8 space-y-6">
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
            className="w-full p-4 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-secondary outline-none text-sm font-bold text-slate-900 dark:text-white"
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
            className="w-full p-4 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-secondary outline-none text-sm font-bold text-slate-900 dark:text-white"
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
            className="w-full p-4 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-secondary outline-none text-sm font-bold text-slate-900 dark:text-white"
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
            className="w-full p-4 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-secondary outline-none text-sm font-bold text-slate-900 dark:text-white resize-none leading-relaxed"
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
            className="w-full p-4 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-secondary outline-none text-sm font-bold text-slate-900 dark:text-white resize-none leading-relaxed"
          />
        </div>
      </div>
    </Card>
  );
}
