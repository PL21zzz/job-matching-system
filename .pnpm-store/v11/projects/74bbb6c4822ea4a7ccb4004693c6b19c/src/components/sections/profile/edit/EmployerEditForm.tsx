import EmployerAccessibilityChecklist from "@/src/components/accessibility/EmployerAccessibilityChecklist";
import {
  parseSelectedAccessibilityOptions,
  serializeSelectedAccessibilityOptions,
} from "@/src/lib/employer-accessibility";

interface EmployerEditFormProps {
  fullName: string;
  setFullName: (value: string) => void;
  employerData: any;
  setEmployerData: (data: any) => void;
}

export default function EmployerEditForm({
  fullName,
  setFullName,
  employerData,
  setEmployerData,
}: EmployerEditFormProps) {
  const selectedAccessibilityOptions = parseSelectedAccessibilityOptions(
    employerData.accessibilityFeatures,
  );

  const handleToggleAccessibilityOption = (value: string) => {
    const next = selectedAccessibilityOptions.includes(value)
      ? selectedAccessibilityOptions.filter((item) => item !== value)
      : [...selectedAccessibilityOptions, value];

    setEmployerData({
      ...employerData,
      accessibilityFeatures: serializeSelectedAccessibilityOptions(next),
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <label className="text-[11px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Tên người đại diện / tài khoản
          </label>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Nhập tên người đại diện tuyển dụng"
            className="w-full rounded-xl border border-slate-200 bg-white p-4 text-sm font-bold text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-primary dark:border-border-subtle dark:bg-secondary dark:text-white dark:placeholder:text-slate-600"
          />
        </div>

        <div className="space-y-2">
          <label className="text-[11px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Tên doanh nghiệp / công ty
          </label>
          <input
            type="text"
            value={employerData.companyName}
            onChange={(e) =>
              setEmployerData({ ...employerData, companyName: e.target.value })
            }
            placeholder="Nhập tên doanh nghiệp pháp nhân"
            className="w-full rounded-xl border border-slate-200 bg-white p-4 text-sm font-bold text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-primary dark:border-border-subtle dark:bg-secondary dark:text-white dark:placeholder:text-slate-600"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <label className="text-[11px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Mã số thuế
          </label>
          <input
            type="text"
            value={employerData.taxCode}
            onChange={(e) =>
              setEmployerData({ ...employerData, taxCode: e.target.value })
            }
            placeholder="Mã số doanh nghiệp"
            className="w-full rounded-xl border border-slate-200 bg-white p-4 text-sm font-bold text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-primary dark:border-border-subtle dark:bg-secondary dark:text-white dark:placeholder:text-slate-600"
          />
        </div>

        <div className="space-y-2">
          <label className="text-[11px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Địa chỉ văn phòng
          </label>
          <input
            type="text"
            value={employerData.address}
            onChange={(e) =>
              setEmployerData({ ...employerData, address: e.target.value })
            }
            placeholder="Địa chỉ trụ sở văn phòng làm việc"
            className="w-full rounded-xl border border-slate-200 bg-white p-4 text-sm font-bold text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-primary dark:border-border-subtle dark:bg-secondary dark:text-white dark:placeholder:text-slate-600"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-[11px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">
          Mô tả tóm tắt hoạt động
        </label>
        <textarea
          rows={4}
          value={employerData.description}
          onChange={(e) =>
            setEmployerData({ ...employerData, description: e.target.value })
          }
          placeholder="Giới thiệu sơ lược về doanh nghiệp, văn hóa làm việc, định hướng tuyển dụng hòa nhập..."
          className="w-full resize-none rounded-xl border border-slate-200 bg-white p-4 text-sm font-bold leading-relaxed text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-primary dark:border-border-subtle dark:bg-secondary dark:text-white dark:placeholder:text-slate-600"
        />
      </div>

      <div className="space-y-2">
        <EmployerAccessibilityChecklist
          selectedOptions={selectedAccessibilityOptions}
          onToggle={handleToggleAccessibilityOption}
          helperText="Chọn những tiện ích hạ tầng doanh nghiệp đang có sẵn. Danh sách này sẽ được dùng lại khi đăng tin tuyển dụng để bạn không phải nhập lại từ đầu."
        />
      </div>
    </div>
  );
}
