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
          const userRole = (data?.role?.name || data?.role || null) as
            | "Candidate"
            | "Employer"
            | null;

          setRole(userRole);
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
        : {
            fullName,
            ...employerData,
          };

    try {
      await authService.updateProfile(bodyData);
      toast.success("Cập nhật hồ sơ thành công!");
      router.push("/profile");
      router.refresh();
    } catch (error: any) {
      toast.error(typeof error === "string" ? error : "Lỗi lưu dữ liệu.");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white dark:bg-secondary">
        <p className="animate-pulse text-xs font-bold uppercase tracking-widest text-slate-400">
          Đang đồng bộ dữ liệu hồ sơ...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white px-4 py-16 text-slate-900 transition-colors duration-300 dark:bg-secondary dark:text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl space-y-8">
        <div className="flex items-center justify-between px-1">
          <a
            href="/profile"
            className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 transition-all hover:text-primary"
          >
            <ArrowLeft size={14} /> Quay lại
          </a>

          <div className="inline-flex items-center gap-1 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-primary">
            <Sparkles size={10} /> Chỉnh sửa profile
          </div>
        </div>

        <Card layoutClassName="p-8 md:p-12 space-y-8">
          <form onSubmit={handleSave} className="space-y-8">
            <div className="flex justify-center">
              <div className="inline-flex rounded-xl border border-slate-200 bg-white p-1 text-[10px] font-black uppercase tracking-wider dark:border-border-subtle dark:bg-secondary">
                <span
                  className={`rounded-lg px-4 py-1.5 transition-colors ${
                    role === "Candidate"
                      ? "bg-primary font-black text-white dark:text-secondary"
                      : "text-slate-400"
                  }`}
                >
                  Ứng viên
                </span>
                <span
                  className={`rounded-lg px-4 py-1.5 transition-colors ${
                    role === "Employer"
                      ? "bg-primary font-black text-white dark:text-secondary"
                      : "text-slate-400"
                  }`}
                >
                  Nhà tuyển dụng
                </span>
              </div>
            </div>

            <h2 className="text-center text-xl font-black uppercase tracking-tight md:text-2xl">
              Cập nhật thông tin hồ sơ
            </h2>

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
                fullName={fullName}
                setFullName={setFullName}
                employerData={employerData}
                setEmployerData={setEmployerData}
              />
            )}

            <div className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 dark:border-border-subtle dark:bg-secondary">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-400 dark:bg-white/5">
                <ImageIcon size={20} />
              </div>
              <div>
                <p className="text-xs font-black uppercase tracking-wide">
                  Ảnh đại diện hồ sơ định danh
                </p>
                <p className="mt-1 text-[10px] font-bold leading-relaxed text-slate-500">
                  Hiện tại hệ thống đang dùng avatar tự sinh theo tên tài khoản
                  để hiển thị đồng nhất trên navbar, profile và các khu vực liên
                  quan. Nếu bạn muốn, mình có thể làm tiếp tính năng upload ảnh
                  đại diện thật ở bước sau.
                </p>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <Button
                type="submit"
                disabled={loading}
                className="w-fit px-8 py-3.5 text-xs"
              >
                <Save size={14} />
                {loading ? "Đang cập nhật..." : "Lưu thay đổi hồ sơ"}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
