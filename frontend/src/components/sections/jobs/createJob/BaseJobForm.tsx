import Card from "@/src/components/ui/Card";
import { Briefcase, MapPin } from "lucide-react";

interface BaseJobFormProps {
  formData: any;
  handleInputChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => void;
  categories: any[];
  categoriesLoading: boolean;
}

export default function BaseJobForm({
  formData,
  handleInputChange,
  categories,
  categoriesLoading,
}: BaseJobFormProps) {
  return (
    <Card layoutClassName="p-8 space-y-6">
      <h3 className="font-extrabold text-lg flex items-center gap-2 text-primary">
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
            className="w-full p-4 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-secondary outline-none text-sm font-bold focus:border-primary text-slate-900 dark:text-white"
          />
        </div>

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
            className="w-full p-4 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-secondary outline-none text-sm font-bold focus:border-primary text-slate-900 dark:text-white disabled:opacity-50 cursor-pointer"
          >
            <option value="">
              {categoriesLoading
                ? "Đang tải danh mục..."
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
            className="w-full p-4 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-secondary outline-none text-sm font-bold focus:border-primary text-slate-900 dark:text-white cursor-pointer"
          >
            <option value="FULL_TIME">Toàn thời gian (FULL_TIME)</option>
            <option value="PART_TIME">Bán thời gian (PART_TIME)</option>
            <option value="REMOTE">Làm việc từ xa (REMOTE)</option>
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
              className="w-full pl-12 pr-4 p-4 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-secondary outline-none text-sm font-bold focus:border-primary text-slate-900 dark:text-white"
            />
          </div>
        </div>
      </div>
    </Card>
  );
}
