"use client";

import { authService } from "@/src/services/authService";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    authService
      .getProfileMe()
      .then((user) => {
        const role = user?.role?.name || user?.role;
        const normalizedRole = String(role || "").toLowerCase();

        const candidateOnlyPaths = [
          "/resumes",
          "/stories/manage",
        ];
        const employerOnlyPaths = ["/employer/create-job", "/employer/manage-jobs"];
        const adminOnlyPaths = ["/admin"];

        if (!role && pathname !== "/onboarding") {
          router.replace("/onboarding");
          return;
        }
        if (role && pathname === "/onboarding") {
          router.replace("/");
          return;
        }
        if (
          candidateOnlyPaths.some((path) => pathname.startsWith(path)) &&
          normalizedRole !== "candidate"
        ) {
          toast.error("Khu vực này chỉ dành cho ứng viên.");
          router.replace("/");
          return;
        }

        if (
          employerOnlyPaths.some((path) => pathname.startsWith(path)) &&
          normalizedRole !== "employer"
        ) {
          toast.error("Khu vực này chỉ dành cho nhà tuyển dụng.");
          router.replace("/");
          return;
        }

        if (
          adminOnlyPaths.some((path) => pathname.startsWith(path)) &&
          normalizedRole !== "admin"
        ) {
          toast.error("Khu vực này chỉ dành cho quản trị viên.");
          router.replace("/");
          return;
        }
        setIsVerified(true);
      })
      .catch(() => router.replace("/login"));
  }, [pathname, router]);

  if (!isVerified) {
    return (
      <div className="min-h-screen grid place-items-center bg-white dark:bg-secondary">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-primary" />
      </div>
    );
  }

  return <>{children}</>;
}
