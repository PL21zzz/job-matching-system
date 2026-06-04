interface EmployerEditFormProps {
  employerData: any;
  setEmployerData: (data: any) => void;
}

export default function EmployerEditForm({
  employerData,
  setEmployerData,
}: EmployerEditFormProps) {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
            className="w-full p-4 rounded-xl border border-slate-200 dark:border-border-subtle bg-white dark:bg-secondary outline-none text-sm font-bold focus:border-primary transition-all text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600"
          />
        </div>
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
            className="w-full p-4 rounded-xl border border-slate-200 dark:border-border-subtle bg-white dark:bg-secondary outline-none text-sm font-bold focus:border-primary transition-all text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600"
          />
        </div>
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
          className="w-full p-4 rounded-xl border border-slate-200 dark:border-border-subtle bg-white dark:bg-secondary outline-none text-sm font-bold focus:border-primary transition-all text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600"
        />
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
          placeholder="Giới thiệu sơ lược định hướng doanh nghiệp tuyển dụng hòa nhập..."
          className="w-full p-4 rounded-xl border border-slate-200 dark:border-border-subtle bg-white dark:bg-secondary outline-none text-sm font-bold focus:border-primary transition-all text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 resize-none leading-relaxed"
        />
      </div>

      <div className="space-y-2">
        <label className="text-[11px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">
          Tiện ích trợ năng hạ tầng văn phòng hiện có
        </label>
        <input
          type="text"
          value={employerData.accessibilityFeatures}
          onChange={(e) =>
            setEmployerData({
              ...employerData,
              accessibilityFeatures: e.target.value,
            })
          }
          placeholder="Ví dụ: Lối đi xe lăn sẵn có, Thang máy hỗ trợ âm thanh..."
          className="w-full p-4 rounded-xl border border-slate-200 dark:border-border-subtle bg-white dark:bg-secondary outline-none text-sm font-bold focus:border-primary transition-all text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600"
        />
      </div>
    </div>
  );
}
