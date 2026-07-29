"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { superAdminSignUp } from "@/lib/api/superAdmin.api";
import { superAdminSignUpSchema, TSuperAdminSignUpFormData } from "@/lib/schemas/superAdminSignUp.schema";
import { useFlashToast } from "@/stores/flashToast";

const useSuperAdminSignUp = () => {
  const router = useRouter();
  const setFlash = useFlashToast((state) => state.setFlash);

  const form = useForm<TSuperAdminSignUpFormData>({
    resolver: zodResolver(superAdminSignUpSchema),
    mode: "onChange",
  });

  const submit = async (data: TSuperAdminSignUpFormData) => {
    try {
      await superAdminSignUp(data);
      router.push("/signin");
    } catch {
      setFlash("Account creation failed. Please try again.", "error");
    }
  };

  return {
    form,
    submit,
  };
};

export default useSuperAdminSignUp;
