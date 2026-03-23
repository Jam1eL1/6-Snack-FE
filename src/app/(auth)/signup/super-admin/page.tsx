"use client";
import React, { useState } from "react";
import SnackIconSvg from "@/components/svg/SnackIconSvg";
import Link from "next/link";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import clsx from "clsx";
import { superAdminSignUp } from "@/lib/api/superAdmin.api";
import Input from "@/components/common/Input";
import Toast from "@/components/common/Toast";
import { TToastVariant } from "@/types/toast.types";

// 리액트 훅폼에 연결할 zod 스키마 정의
const signUpSchema = z
  .object({
    email: z.string().email("유효한 이메일을 입력해주세요."),
    name: z.string().min(1, "이름을 입력해주세요."),
    companyName: z
      .string()
      .min(1, "회사명을 입력해주세요.")
      .regex(/^[가-힣a-zA-Z\d().,_\- ]+$/, "회사명에는 한글, 영문, 숫자, (, ), ., -, _만 사용할 수 있습니다."),
    bizNumber: z.string().regex(/^[0-9]{10}$/, "사업자 번호 10자리를 입력해주세요."),
    password: z
      .string()
      .min(8, "8자 이상 입력해주세요.")
      .regex(/[a-zA-Z]/, "비밀번호는 영문자를 포함해야 합니다.")
      .regex(/[0-9]/, "비밀번호는 숫자를 포함해야 합니다.")
      .regex(/[^a-zA-Z0-9]/, "비밀번호는 특수문자를 포함해야 합니다."),
    passwordConfirm: z.string(),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: "비밀번호가 일치하지 않습니다.",
    path: ["passwordConfirm"],
  });

type TSignUpFormData = z.infer<typeof signUpSchema>;

export default function SuperAdminSignUpPage() {
  const router = useRouter();

  const [toastVisible, setToastVisible] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string>("");
  const [toastVariant, setToastVariant] = useState<TToastVariant>("error");
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
  } = useForm<TSignUpFormData>({
    resolver: zodResolver(signUpSchema),
    mode: "onChange",
  });

  // register 결과 저장
  const emailReg = register("email");
  const passwordReg = register("password");
  const passwordConfirmReg = register("passwordConfirm");
  const companyNameReg = register("companyName");
  const bizNumberReg = register("bizNumber");

  // Toast를 보여주는 함수
  const showToast = (message: string, variant: TToastVariant = "error") => {
    setToastMessage(message);
    setToastVariant(variant);
    setToastVisible(true);

    // 3초 후 자동으로 숨김
    setTimeout(() => {
      setToastVisible(false);
    }, 3000);
  };

  // 회원가입 처리
  const onSubmit = async (data: TSignUpFormData) => {
    setIsLoading(true);
    try {
      await superAdminSignUp(data);
      // 성공 시 바로 로그인 페이지로 이동
      router.push("/login");
    } catch {
      setIsLoading(false);
      showToast("회원가입에 실패했습니다. 다시 시도해주세요.", "error");
    }
  };

  return (
    <>
      {/* Toast 컴포넌트 */}
      <div role="alert" aria-live="polite">
        <Toast text={toastMessage} variant={toastVariant} isVisible={toastVisible} />
      </div>

      {/* main content */}
      <main
        className="sm:relative flex flex-col items-center justify-center gap-[46px] sm:gap-0 pt-[48px] sm:pt-[160px]"
        role="main"
        aria-labelledby="signup-heading"
      >
        {/* header section */}
        <header
          className="sm:absolute sm:top-0 flex flex-col items-center justify-center w-full max-w-[480px] sm:max-w-[600px]"
          role="banner"
        >
          <div className="flex justify-center items-center w-full sm:max-w-[500px] h-[140px] sm:h-[214px] py-[38.18px] sm:py-[58.4px] px-[50.92px] sm:px-[77.86px]">
            <Link href="/" aria-label="홈으로 이동">
              <SnackIconSvg className="w-[225.16px] h-[63.64px] sm:w-[344px] sm:h-[97.3px]" aria-label="스낙 로고" />
            </Link>
          </div>
          <div className="sm:hidden">
            <div className="flex flex-col items-start justify-center gap-[10px]">
              <h1
                id="signup-heading"
                className="text-lg/[22px] sm:text-2xl/[30px] font-bold tracking-tight text-left align-middle"
              >
                기업 담당자 회원가입
              </h1>
              <p
                className="text-primary-600 text-sm/[17px] sm:text-base/[20px] tracking-tight text-center align-middle"
                role="note"
              >
                * 그룹 내 유저는 기업 담당자의 초대 메일을 통해 가입이 가능합니다.
              </p>
            </div>
          </div>
        </header>

        {/* signup form section */}
        <section
          className="sm:absolute sm:w-[600px] sm:top-[152.12px] flex flex-col w-full items-center justify-center sm:items-start sm:px-[60px] sm:py-[40px] sm:bg-white sm:rounded-xs sm:shadow-[0px_0px_40px_0px_rgba(0,0,0,0.10)]"
          aria-labelledby="signup-form-heading"
        >
          <div className="hidden sm:block sm:mb-[20px]">
            <div className="flex flex-col items-start justify-center gap-[10px]">
              <h1
                id="signup-form-heading"
                className="text-lg/[22px] sm:text-2xl/[30px] font-bold tracking-tight text-left align-middle"
              >
                기업 담당자 회원가입
              </h1>
              <p
                className="text-primary-600 text-sm/[17px] sm:text-base/[20px] tracking-tight text-left align-middle"
                role="note"
              >
                * 그룹 내 유저는 기업 담당자의 초대 메일을 통해 가입이 가능합니다.
              </p>
            </div>
          </div>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col w-full mb-[8px] gap-[20px]"
            role="form"
            aria-label="기업 담당자 회원가입 폼"
          >
            {/* 이메일 입력 필드 */}
            <Input
              {...emailReg}
              ref={emailReg.ref}
              type="email"
              label="이메일"
              placeholder="이메일을 입력해주세요."
              error={errors.email?.message}
            />

            {/* 이름 입력 필드 추가 */}
            <Input
              {...register("name")}
              ref={register("name").ref}
              type="text"
              label="이름"
              placeholder="이름을 입력해주세요."
              error={errors.name?.message}
            />

            {/* 비밀번호 input wrapper*/}
            <Input
              {...passwordReg}
              ref={passwordReg.ref}
              type="password"
              label="비밀번호"
              placeholder="비밀번호를 입력해주세요."
              showPasswordToggle={true}
              error={errors.password?.message}
            />

            {/* 비밀번호 확인 input wrapper*/}
            <Input
              {...passwordConfirmReg}
              ref={passwordConfirmReg.ref}
              type="password"
              label="비밀번호 확인"
              placeholder="비밀번호를 한 번 더 입력해주세요."
              showPasswordToggle={true}
              error={errors.passwordConfirm?.message}
            />

            {/* 회사명 입력 필드 */}
            <Input
              {...companyNameReg}
              ref={companyNameReg.ref}
              type="text"
              label="회사명"
              placeholder="회사명을 입력해주세요."
              error={errors.companyName?.message}
              isCompanyName={true}
            />

            {/* 사업자 번호 입력 필드 */}
            <Input
              {...bizNumberReg}
              ref={bizNumberReg.ref}
              type="text"
              label="사업자 번호"
              placeholder="사업자 번호를 입력해주세요."
              error={errors.bizNumber?.message}
              isBizNumber={true}
            />

            {/* 가입 버튼 - 직접 button 태그로 대체 */}
            <button
              type="submit"
              className={clsx(
                "w-full h-[64px] mb-[24px] rounded-[2px] inline-flex justify-center items-center text-base transition-all duration-200",
                isValid && !isSubmitting && !isLoading
                  ? "bg-primary-950 text-primary-50 hover:bg-primary-900 cursor-pointer"
                  : "bg-primary-100 text-primary-300 cursor-default",
                "font-bold",
              )}
              disabled={isSubmitting || !isValid || isLoading}
              aria-describedby={!isValid ? "form-validation-message" : undefined}
              aria-label={isSubmitting || isLoading ? "회원가입 처리 중" : "회원가입 하기"}
            >
              {isSubmitting || isLoading ? (
                "처리 중"
              ) : (
                "가입하기"
              )}
            </button>
          </form>

          {/* validation message for screen readers */}
          {!isValid && (
            <div id="form-validation-message" className="sr-only" aria-live="polite">
              필수 입력 항목을 모두 채워주세요
            </div>
          )}

          {/* login link */}
          <nav aria-label="계정 관련 링크" className="w-full flex justify-center">
            <p className="text-primary-500 text-base/[20px] tracking-tight text-center w-full">
              이미 계정이 있으신가요?
              <Link href="/login" aria-label="로그인 페이지로 이동">
                <span className="text-primary-950 text-base/[20px] tracking-tight font-bold underline decoration-primary-950 underline-offset-2">
                  로그인
                </span>
              </Link>
            </p>
          </nav>
        </section>
      </main>
    </>
  );
}
