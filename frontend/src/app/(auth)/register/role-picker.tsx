import { Briefcase, User } from "lucide-react";

interface RolePickerProps {
  onSelect: (role: "Candidate" | "Employer") => void;
}

export const RolePicker = ({ onSelect }: RolePickerProps) => (
  <div className="animate-in fade-in slide-in-from-right duration-500">
    <h2 className="text-3xl font-extrabold text-gray-950 mb-2 tracking-tighter">
      Bạn là ai?
    </h2>
    <p className="text-gray-500 mb-8">
      Chọn vai trò để bắt đầu hành trình của bạn.
    </p>
    <div className="grid grid-cols-1 gap-4">
      <button
        onClick={() => onSelect("Candidate")}
        className="p-6 border-2 rounded-2xl flex items-center gap-4 transition-all hover:border-primary hover:bg-primary/5 group bg-white"
      >
        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
          <User size={24} />
        </div>
        <div className="text-left">
          <p className="font-bold text-gray-900 text-lg">Ứng viên</p>
          <p className="text-sm text-gray-500">
            Tôi đang tìm kiếm cơ hội việc làm
          </p>
        </div>
      </button>
      <button
        onClick={() => onSelect("Employer")}
        className="p-6 border-2 rounded-2xl flex items-center gap-4 transition-all hover:border-primary hover:bg-primary/5 group bg-white"
      >
        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
          <Briefcase size={24} />
        </div>
        <div className="text-left">
          <p className="font-bold text-gray-900 text-lg">Nhà tuyển dụng</p>
          <p className="text-sm text-gray-500">
            Tôi muốn đăng tin và tìm nhân tài
          </p>
        </div>
      </button>
    </div>
  </div>
);
