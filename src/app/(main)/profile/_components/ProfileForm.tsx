"use client";

import { useEffect, useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { updatePassword, updateCompanyInfo, TUpdateCompanyInfoRequest } from "@/lib/api/profile.api";
import { profileSchema, TProfileFormData } from "@/lib/schemas/profile.schema";
import { useAuth } from "@/providers/AuthProvider";
import { Role, TUser } from "@/types/auth.types";
import ProfileField from "./ProfileField";
import ProfilePasswordSection from "./ProfilePasswordSection";
import ProfileSubmitButton from "./ProfileSubmitButton";
import Toast from "@/components/common/Toast";

export default function ProfileForm() {
  const { user } = useAuth();
  const typedUser = user as TUser | null;
  const queryClient = useQueryClient();
  const router = useRouter();

  // Toast 상태
  const [toastVisible, setToastVisible] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string>("");
  const [toastVariant, setToastVariant] = useState<"success" | "error">("success");
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // 성공 후 버튼 비활성화 상태
  const [isSuccess, setIsSuccess] = useState(false);

  // 리액트 훅 폼 설정
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isValid },
    reset,
  } = useForm<TProfileFormData>({
    resolver: zodResolver(profileSchema),
    mode: "onChange",
  });

  // 폼 값들 감시
  const company = watch("company");
  const password = watch("password");

  // register 함수 반환값 분리
  const companyRegister = register("company");

  // 변경사항 확인
  const hasCompanyChanged = Boolean(
    typedUser?.role === Role.SUPER_ADMIN && company?.trim() !== (typedUser?.company?.name || ""),
  );
  const hasPasswordChanged = Boolean(password && password.length > 0);

  const hasAnyChanges = hasCompanyChanged || hasPasswordChanged;

  // 폼 유효성 검사
  const isFormValid = Boolean(hasAnyChanges && isValid);

  // Toast 표시 함수
  const showToast = (message: string, variant: "success" | "error") => {
    // 기존 타이머가 있다면 클리어
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    setToastMessage(message);
    setToastVariant(variant);
    setToastVisible(true);
    timerRef.current = setTimeout(() => setToastVisible(false), 3000);
  };

  // Profile 업데이트 Mutation
  const updateProfile = useMutation({
    mutationFn: async (data: TProfileFormData) => {
      if (!user) {
        throw new Error("사용자 정보를 찾을 수 없습니다.");
      }

      if (user.role === Role.SUPER_ADMIN) {
        const payload: TUpdateCompanyInfoRequest = {};

        if (hasCompanyChanged) {
          payload.companyName = data.company?.trim();
        }
        if (data.password) {
          payload.passwordData = {
            newPassword: data.password,
            newPasswordConfirm: data.password,
          };
        }
        await updateCompanyInfo(user.id, payload);
      } else {
        if (data.password) {
          return await updatePassword(user.id, data.password);
        }
      }
    },
    onSuccess: (data, variables) => {
      // 성공 상태 설정
      setIsSuccess(true);

      // 성공 시 처리
      if (typedUser?.role === Role.SUPER_ADMIN) {
        if (hasCompanyChanged && !variables.password) {
          showToast("회사명이 변경되었습니다.", "success");
        } else if (variables.password) {
          showToast("정보가 변경되었습니다.", "success");
        }
      } else {
        if (variables.password) {
          showToast("비밀번호가 변경되었습니다.", "success");
        }
      }

      // 폼 초기화
      setValue("password", "");
      setValue("confirmPassword", "");

      // 캐시 무효화
      queryClient.invalidateQueries({ queryKey: ["user"] });

      setTimeout(() => {
        router.push("/products");
      }, 1000);
    },
    onError: (error: Error) => {
      const errorMessage = error.message || "업데이트 실패";
      showToast(errorMessage, "error");
    },
  });

  // 유저 정보 로드 및 폼 초기화
  useEffect(() => {
    if (typedUser) {
      reset({
        company: typedUser?.company?.name || "",
        password: "",
        confirmPassword: "",
      });
    }
  }, [typedUser, reset]);

  // 타이머 언마운트 시 클린업
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  // 권한 라벨 함수
  const getRoleLabel = (role: Role | null) => {
    switch (role) {
      case Role.USER:
        return "일반 유저";
      case Role.ADMIN:
        return "관리자";
      case Role.SUPER_ADMIN:
        return "최고 관리자";
      default:
        return "";
    }
  };

  // 제출 핸들러
  const onSubmit = async (data: TProfileFormData) => {
    if (!isFormValid) {
      showToast("입력 정보를 확인해주세요.", "error");
      return;
    }

    updateProfile.mutate(data);
  };

  return (
    <main aria-label="프로필 변경 페이지" className="w-full sm:w-auto">
      {toastVisible && <Toast text={toastMessage} variant={toastVariant} isVisible={toastVisible} />}

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full sm:w-[600px] py-10 sm:px-14 sm:rounded-sm sm:shadow-[0px_0px_40px_0px_rgba(0,0,0,0.10)] sm:outline-offset-[-1px] inline-flex flex-col justify-center items-start gap-5"
        aria-label="프로필 정보 변경 폼"
        noValidate
      >
        <header>
          <h1 className="text-center justify-center text-xl font-bold font-suit">내 프로필 변경</h1>
        </header>

        <section className="self-stretch flex flex-col justify-start items-center gap-6" aria-label="프로필 정보">
          <div className="self-stretch flex flex-col justify-start items-start gap-7">
            <div className="self-stretch flex flex-col justify-start items-start gap-8">
              <fieldset className="self-stretch flex flex-col justify-start items-start gap-5" aria-label="기본 정보">
                <legend className="sr-only">기본 정보</legend>

                {/* 기업명 */}
                <ProfileField
                  label="기업명"
                  value={company !== undefined ? company : typedUser?.company?.name || ""}
                  isEditable={typedUser?.role === Role.SUPER_ADMIN}
                  role={typedUser?.role}
                  type={typedUser?.role === Role.SUPER_ADMIN ? "input" : "display"}
                  error={errors.company?.message}
                  {...companyRegister}
                />

                {/* 권한 */}
                <ProfileField label="권한" value={getRoleLabel(typedUser?.role as Role)} type="display" />

                {/* 이름 */}
                <ProfileField label="이름" value={typedUser?.name || ""} type="display" />

                {/* 이메일 */}
                <ProfileField label="이메일" value={typedUser?.email || ""} type="display" />

                {/* 비밀번호 섹션 */}
                <ProfilePasswordSection
                  passwordRegister={register("password")}
                  confirmPasswordRegister={register("confirmPassword")}
                  passwordError={errors.password?.message}
                  confirmPasswordError={errors.confirmPassword?.message}
                />
              </fieldset>
            </div>

            {/* 제출 버튼 */}
            <ProfileSubmitButton
              isFormValid={isFormValid && !isSuccess}
              isSubmitting={updateProfile.isPending}
              onSubmit={handleSubmit(onSubmit)}
            />
          </div>
        </section>
      </form>
    </main>
  );
}
