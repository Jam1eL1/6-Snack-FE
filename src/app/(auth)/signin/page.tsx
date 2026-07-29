"use client";

import React, { useEffect, useRef, useState } from "react";
import SnackIconSvg from "@/components/svg/SnackIconSvg";
import Button from "@/components/ui/Button";
import VisibilityOffIconSvg from "@/components/svg/VisibilityOffIconSvg";
import VisibilityOnIconSvg from "@/components/svg/VisibilityOnIconSvg";
import Link from "next/link";
import clsx from "clsx";
import { useAuth } from "@/providers/AuthProvider";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signInSchema, TSignInFormData } from "@/lib/schemas/signin.schema";
import FormErrorMessage from "./_components/FormErrorMessage";
import Toast from "@/components/common/Toast";

export default function LoginPage() {
  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);
  const [isDisabled, setIsDisabled] = useState<boolean>(false);
  const [isToastVisible, setIsToastVisible] = useState<boolean>(false);
  const [toastText, setToastText] = useState<string>("");

  const router = useRouter();
  const { signIn } = useAuth();

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const handlePasswordVisible = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  // React Hook Form
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<TSignInFormData>({
    resolver: zodResolver(signInSchema),
    mode: "onChange",
  });

  // Control floating labels
  const hasEmailValue = watch("email");
  const hasPasswordValue = watch("password");

  // Clear the toast timer when the page unmounts
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  // Submit sign-in credentials
  const onSubmit = async (body: TSignInFormData) => {
    const { email, password } = body;

    try {
      setIsDisabled(true);
      await signIn(email, password);

      router.push("/products");
    } catch (e) {
      if (e instanceof Error) {
        setIsToastVisible(true);

        if (e.message === "Email or password is incorrect.") {
          setToastText("Email or password is incorrect.");
        } else {
          setToastText("Sign-in failed. Please try again.");
        }

        if (timerRef.current) clearTimeout(timerRef.current);

        timerRef.current = setTimeout(() => {
          setIsToastVisible(false);
          timerRef.current = null;
        }, 3000);

        setIsDisabled(false);
      }
    }
  };

  return (
    <div className="flex justify-center">
      <div className="flex flex-col justify-center w-full max-w-[480px] pt-[48px] sm:max-w-[600px] sm:py-[160px]">
        <Toast text={toastText} isVisible={isToastVisible} />
        <nav className="z-1 flex justify-center w-full h-[140px] py-[38.18px] px-[50.92px] sm:h-auto sm:pb-0">
          <Link href="/">
            <SnackIconSvg className="w-[225.16px] h-[63.64px] sm:w-[344px] sm:h-[97.3px]" />
          </Link>
        </nav>
        <section className="flex flex-col justify-center max-w-[600px] sm:shadow-[0px_0px_40px_0px_rgba(0,0,0,0.1)] sm:h-[400px] sm:py-[40px] sm:px-[60px]">
          <h2 className="mb-[10px] font-bold text-[20px]/[25px] tracking-tight text-[#1f1f1f] sm:mb-[20px] sm:text-[24px]/[30px]">
            Sign in
          </h2>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col justify-center items-center w-full gap-[30px]"
          >
            <div className="flex flex-col justify-center items-center w-full gap-[20px]">
              <div className="flex flex-col w-full max-w-[480px] gap-[4px]">
                <div
                  className={clsx(
                    errors.email ? "border-error-500" : "border-primary-600",
                    hasEmailValue ? "justify-end" : "justify-center",
                    "relative flex flex-col h-[56px] py-[8px] pr-[24px] px-[4px] gap-[5px] border-b-1",
                  )}
                >
                  <label
                    htmlFor="email"
                    className={clsx(
                      hasEmailValue ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0",
                      "absolute left-[4px] top-[8px] font-normal text-[12px]/[15px] tracking-tight text-primary-600 transition-all duration-300",
                    )}
                  >
                    Email
                  </label>

                  <input
                    {...register("email")}
                    id="email"
                    type="email"
                    placeholder="Enter your email address"
                    className={clsx(
                      "z-10 w-full max-w-[480px] font-normal text-[16px]/[20px] tracking-tight text-primary-950 outline-none placeholder:font-normal placeholder:text-[16px]/[20px] placeholder:tracking-tight placeholder:text-primary-500",
                    )}
                  />
                </div>

                <FormErrorMessage message={errors.email?.message} />
              </div>

              <div className="relative flex flex-col w-full max-w-[480px] gap-[4px]">
                <div
                  className={clsx(
                    errors.password ? "border-error-500" : "border-primary-600",
                    hasPasswordValue ? "items-end" : " items-center",
                    "relative flex justify-between h-[56px] gap-[4px] py-[8px] px-[4px] border-b-1",
                  )}
                >
                  <div className="flex flex-col justify-center w-full gap-[5px]">
                    <label
                      htmlFor="password"
                      className={clsx(
                        hasPasswordValue ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0",
                        "absolute left-[4px] top-[8px] font-normal text-[12px]/[15px] tracking-tight text-primary-600 transition-all duration-300",
                      )}
                    >
                      Password
                    </label>

                    <input
                      {...register("password")}
                      id="password"
                      type={isPasswordVisible ? "text" : "password"}
                      placeholder="Enter your password"
                      className={clsx(
                        isPasswordVisible ? "tracking-tight" : "tracking-[0.25em]",
                        "z-10 w-full max-w-[480px] font-normal text-[16px]/[20px] text-primary-950 outline-none placeholder:font-normal placeholder:text-[16px]/[20px] placeholder:tracking-tight placeholder:text-primary-500",
                      )}
                    />
                  </div>

                  <button
                    type="button"
                    onClick={handlePasswordVisible}
                    className={clsx(
                      hasPasswordValue ? "opacity-100" : "opacity-0",
                      "mt-[24px] cursor-pointer transition-all duration-300",
                    )}
                  >
                    {isPasswordVisible ? <VisibilityOnIconSvg /> : <VisibilityOffIconSvg />}
                  </button>
                </div>

                <FormErrorMessage message={errors.password?.message} />
              </div>
            </div>

            <Button
              type="black"
              label={isDisabled ? "Signing in..." : "Sign in"}
              disabled={isDisabled}
              className={clsx(
                isDisabled && "text-primary-300 bg-primary-100 cursor-default",
                "w-full mb-[24px] font-bold text-[16px]/[20px] h-[64px]",
              )}
            />
          </form>

          <nav className="flex justify-center items-center gap-[4px]">
            <p className="font-normal text-[16px]/[20px] tracking-tight text-[#999999]">
              Are you a company administrator?{" "}
            </p>
            <Link href="/signup/super-admin">
              <p className="font-bold text-[16px]/[20px] tracking-tight text-primary-950 underline">
                Create account
              </p>
            </Link>
          </nav>
        </section>
      </div>
    </div>
  );
}
