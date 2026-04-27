"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import axiosInstance from "../../../lib/axios";
import { RegisterInput, registerSchema } from "../../../types/auth.schema";
import { RegisterForm } from "./register-form";
import { RolePicker } from "./role-picker";

export default function RegisterPage() {
  const [step, setStep] = useState(1);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: { role: "Candidate" },
  });

  const onSubmit = async (data: RegisterInput) => {
    try {
      const response = await axiosInstance.post("/auth/register", {
        ...data,
        companyName: data.role === "Employer" ? data.companyName : undefined,
      });

      if (response.status === 201 || response.status === 200) {
        toast.success("Đăng ký thành công!");
        localStorage.setItem("register_email", data.email);
        router.push("/verify-otp");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Đăng ký thất bại");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {step === 1 ? (
        <RolePicker
          onSelect={(role) => {
            setValue("role", role);
            setStep(2);
          }}
        />
      ) : (
        <RegisterForm
          register={register}
          errors={errors}
          isSubmitting={isSubmitting}
          onBack={() => setStep(1)}
          selectedRole={watch("role")}
        />
      )}
    </form>
  );
}
