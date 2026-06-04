import { Accessibility, ChevronDown } from "lucide-react";

interface CandidateEditFormProps {
  fullName: string;
  setFullName: (val: string) => void;
  candidateData: any;
  setCandidateData: (data: any) => void;
  disabilityTypes: any[];
}

export default function CandidateEditForm({
  fullName,
  setFullName,
  candidateData,
  setCandidateData,
  disabilityTypes,
}: CandidateEditFormProps) {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="space-y-2">
        <label className="text-[11px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">
          Họ và tên
        </label>
        <input
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          placeholder="Nhập đầy đủ họ tên của sếp"
          className="w-full p-4 rounded-xl border border-slate-200 dark:border-border-subtle bg-white dark:bg-secondary outline-none text-sm font-bold focus:border-primary transition-all text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600"
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-[11px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Ngày sinh
          </label>
          <input
            type="date"
            value={candidateData.dob}
            onChange={(e) =>
              setCandidateData({ ...candidateData, dob: e.target.value })
            }
            className="w-full p-4 rounded-xl border border-slate-200 dark:border-border-subtle bg-white dark:bg-secondary outline-none text-sm font-bold focus:border-primary transition-all text-slate-900 dark:text-white"
          />
        </div>
        <div className="space-y-2">
          <label className="text-[11px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Số điện thoại
          </label>
          <input
            type="tel"
            value={candidateData.phone}
            onChange={(e) =>
              setCandidateData({ ...candidateData, phone: e.target.value })
            }
            placeholder="0xxx xxx xxx"
            className="w-full p-4 rounded-xl border border-slate-200 dark:border-border-subtle bg-white dark:bg-secondary outline-none text-sm font-bold focus:border-primary transition-all text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-[11px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">
          Địa chỉ liên hệ
        </label>
        <input
          type="text"
          value={candidateData.address}
          onChange={(e) =>
            setCandidateData({ ...candidateData, address: e.target.value })
          }
          placeholder="Địa chỉ thường trú hoặc tạm trú"
          className="w-full p-4 rounded-xl border border-slate-200 dark:border-border-subtle bg-white dark:bg-secondary outline-none text-sm font-bold focus:border-primary transition-all text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600"
        />
      </div>

      <div className="p-6 rounded-2xl border border-slate-200 dark:border-border-subtle bg-white dark:bg-secondary space-y-4">
        <h4 className="text-xs font-black uppercase tracking-wider text-primary flex items-center gap-2">
          <Accessibility size={16} /> Cấu hình đặc thù trợ năng ứng viên
        </h4>

        <div className="space-y-2">
          <label className="text-[11px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Loại hình khuyết tật phù hợp với bạn *
          </label>

          <div className="relative w-full">
            <select
              required
              value={candidateData.disabilityTypeId}
              onChange={(e) =>
                setCandidateData({
                  ...candidateData,
                  disabilityTypeId: e.target.value,
                })
              }
              className="w-full p-4 pr-10 rounded-xl border border-slate-200 dark:border-border-subtle bg-white dark:bg-secondary outline-none text-sm font-bold focus:border-primary transition-all text-slate-900 dark:text-white appearance-none cursor-pointer"
            >
              <option value="" className="text-slate-400">
                -- Click để chọn loại hình khuyết tật --
              </option>
              {disabilityTypes.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.name}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-400">
              <ChevronDown size={18} />
            </div>
          </div>
          <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium italic mt-1">
            * Dữ liệu này được sử dụng trực tiếp để tối ưu hóa thuật toán gợi ý
            việc làm tự động AI Matchmaker.
          </p>
        </div>
      </div>
    </div>
  );
}
