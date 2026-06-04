"use client";

import { authService } from "@/src/services/authService";
import { jobService } from "@/src/services/jobService";
import { ArrowLeft, Image as ImageIcon, Save, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

import CandidateEditForm from "@/src/components/sections/profile/edit/CandidateEditForm";
import EmployerEditForm from "@/src/components/sections/profile/edit/EmployerEditForm";
import Button from "@/src/components/ui/Button";
import Card from "@/src/components/ui/Card";

export default function ProfileEditPage() {
  const router = useRouter();
  const [role, setRole] = useState<"Candidate" | "Employer" | null>(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  const [disabilityTypes, setDisabilityTypes] = useState<any[]>([]);
  const [fullName, setFullName] = useState("");

  const [candidateData, setCandidateData] = useState({
    dob: "",
    phone: "",
    address: "",
    disabilityTypeId: "",
    customDisabilityName: "",
  });

  const [employerData, setEmployerData] = useState({
    companyName: "",
    taxCode: "",
    address: "",
    description: "",
    accessibilityFeatures: "",
  });

  useEffect(() => {
    const fetchCurrentProfile = async () => {
      const token = localStorage.getItem("access_token");
      if (!token) {
        setFetching(false);
        return;
      }

      let userRole: "Candidate" | "Employer" | null = null;
      try {
        const payload = JSON.parse(window.atob(token.split(".")[1]));
        setRole(payload.role);
        userRole = payload.role;
      } catch (e) {
        console.error("Lỗi giải mã token:", e);
      }

      try {
        const [typesResponse, profileResponse] = await Promise.all([
          jobService.getDisabilityTypes(),
          authService.getProfileMe(),
        ]);

        const typesData = Array.isArray(typesResponse)
          ? typesResponse
          : (typesResponse as any).data || [];
        if (Array.isArray(typesData)) {
          setDisabilityTypes(typesData);
        }

        const data = profileResponse?.data || profileResponse;
        if (data) {
          setFullName(data.fullName || "");

          if (userRole === "Candidate" && data.candidateProfile) {
            const rawDate = data.candidateProfile.dob;
            const formattedDate = rawDate
              ? new Date(rawDate).toISOString().split("T")[0]
              : "";

            setCandidateData({
              dob: formattedDate,
              phone: data.candidateProfile.phone || "",
              address: data.candidateProfile.address || "",
              disabilityTypeId: data.candidateProfile.disabilityTypeId
                ? String(data.candidateProfile.disabilityTypeId)
                : "",
              customDisabilityName: "",
            });
          } else if (userRole === "Employer" && data.employerProfile) {
            setEmployerData({
              companyName: data.employerProfile.companyName || "",
              taxCode: data.employerProfile.taxCode || "",
              address: data.employerProfile.address || "",
              description: data.employerProfile.description || "",
              accessibilityFeatures:
                data.employerProfile.accessibilityFeatures || "",
            });
          }
        }
      } catch (error) {
        console.error("Lỗi nạp dữ liệu qua Service:", error);
        toast.error("Không thể tải thông tin hồ sơ hiện tại.");
      } finally {
        setFetching(false);
      }
    };

    fetchCurrentProfile();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const bodyData =
      role === "Candidate"
        ? {
            fullName,
            dob: candidateData.dob
              ? new Date(candidateData.dob).toISOString()
              : null,
            phone: candidateData.phone,
            address: candidateData.address,
            disabilityTypeId:
              candidateData.disabilityTypeId === "custom"
                ? "custom"
                : Number(candidateData.disabilityTypeId),
            customDisabilityName:
              candidateData.disabilityTypeId === "custom"
                ? candidateData.customDisabilityName
                : null,
          }
        : { ...employerData };

    try {
      const response = await authService.updateProfile(bodyData);
      if (response.status === 200 || response.status === 201 || response) {
        toast.success("Cập nhật hồ sơ thành công!");
        router.push("/profile");
        router.refresh();
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Lỗi lưu dữ liệu.");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-secondary">
        <p className="text-xs font-bold tracking-widest text-slate-400 uppercase animate-pulse">
          Đang đồng bộ dữ liệu cũ...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-secondary text-slate-900 dark:text-white py-16 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Top Actions Nav */}
        <div className="flex items-center justify-between px-1">
          <a
            href="/profile"
            className="flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-primary transition-all uppercase tracking-wider"
          >
            <ArrowLeft size={14} /> Quay lại
          </a>
          <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-widest">
            <Sparkles size={10} /> Chỉnh sửa profile
          </div>
        </div>

        {/* Main Form Box sử dụng component Card */}
        <Card layoutClassName="p-8 md:p-12 space-y-8">
          <form onSubmit={handleSave} className="space-y-8">
            {/* Badge vai trò định dạng phẳng */}
            <div className="flex justify-center">
              <div className="inline-flex bg-white dark:bg-secondary p-1 rounded-xl border border-slate-200 dark:border-border-subtle text-[10px] font-black uppercase tracking-wider">
                <span
                  className={`px-4 py-1.5 rounded-lg transition-colors ${role === "Candidate" ? "bg-primary text-white dark:text-secondary font-black" : "text-slate-400"}`}
                >
                  Ứng viên
                </span>
                <span
                  className={`px-4 py-1.5 rounded-lg transition-colors ${role === "Employer" ? "bg-primary text-white dark:text-secondary font-black" : "text-slate-400"}`}
                >
                  Nhà tuyển dụng
                </span>
              </div>
            </div>

            <h2 className="text-xl md:text-2xl font-black uppercase tracking-tight text-center">
              Cập nhật thông tin hồ sơ
            </h2>

            {/* Hoán đổi Form động theo vai trò */}
            {role === "Candidate" ? (
              <CandidateEditForm
                fullName={fullName}
                setFullName={setFullName}
                candidateData={candidateData}
                setCandidateData={setCandidateData}
                disabilityTypes={disabilityTypes}
              />
            ) : (
              <EmployerEditForm
                employerData={employerData}
                setEmployerData={setEmployerData}
              />
            )}

            {/* Khối Ảnh định danh */}
            <div className="p-5 rounded-2xl border border-slate-200 dark:border-border-subtle bg-white dark:bg-secondary flex items-center gap-4">
              <div className="w-12 h-12 bg-slate-100 dark:bg-white/5 rounded-xl flex items-center justify-center text-slate-400 shrink-0">
                <ImageIcon size={20} />
              </div>
              <div>
                <p className="text-xs font-black uppercase tracking-wide">
                  Ảnh đại diện hồ sơ định danh
                </p>
                <p className="text-[10px] text-slate-500 font-bold mt-1 leading-relaxed">
                  Hệ thống tự động bảo mật và đồng bộ hóa hình ảnh từ tài khoản
                  Google liên kết của sếp.
                </p>
              </div>
            </div>

            {/* Cụm nút Lưu thay đổi qua component Button */}
            <div className="flex justify-end pt-2">
              <Button
                type="submit"
                disabled={loading}
                className="w-fit py-3.5 px-8 text-xs"
              >
                <Save size={14} />{" "}
                {loading ? "Đang cập nhật DB..." : "Lưu thay đổi hồ sơ"}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
