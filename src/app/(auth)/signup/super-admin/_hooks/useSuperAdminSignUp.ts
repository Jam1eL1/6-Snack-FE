"use client";

import { useEffect, useRef, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { superAdminSignUp } from "@/lib/api/superAdmin.api";
import { superAdminSignUpSchema, TSuperAdminSignUpFormData } from "@/lib/schemas/superAdminSignUp.schema";
import { TToastVariant } from "@/types/toast.types";

const TOAST_DURATION_MS = 3000;

const useSuperAdminSignUp = () => {
  const router = useRouter();
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [toastMessage, setToastMessage] = useState("");
  const [toastVariant, setToastVariant] = useState<TToastVariant>("error");
  const [isToastVisible, setIsToastVisible] = useState(false);

  const form = useForm<TSuperAdminSignUpFormData>({
    resolver: zodResolver(superAdminSignUpSchema),
    mode: "onChange",
  });

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  const showToast = (message: string, variant: TToastVariant = "error") => {
    setToastMessage(message);
    setToastVariant(variant);
    setIsToastVisible(true);

    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    timerRef.current = setTimeout(() => {
      setIsToastVisible(false);
      timerRef.current = null;
    }, TOAST_DURATION_MS);
  };

  const submit = async (data: TSuperAdminSignUpFormData) => {
    try {
      await superAdminSignUp(data);
      router.push("/signin");
    } catch {
      showToast("Account creation failed. Please try again.");
    }
  };

  return {
    form,
    submit,
    toast: {
      isVisible: isToastVisible,
      message: toastMessage,
      variant: toastVariant,
    },
  };
};

export default useSuperAdminSignUp;
