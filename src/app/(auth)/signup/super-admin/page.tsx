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

// Define the Zod schema used by React Hook Form
const signUpSchema = z
  .object({
    email: z.string().email("Enter a valid email address."),
    name: z.string().min(1, "Enter your name."),
    companyName: z
      .string()
      .min(1, "Enter your company name.")
      .regex(
        /^[가-힣a-zA-Z\d().,_\- ]+$/,
        "Company name can contain Korean or English letters, numbers, spaces, and (), . , - _.",
      ),
    bizNumber: z.string().regex(/^[0-9]{10}$/, "Enter a 10-digit business registration number."),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters.")
      .regex(/[a-zA-Z]/, "Password must include a letter.")
      .regex(/[0-9]/, "Password must include a number.")
      .regex(/[^a-zA-Z0-9]/, "Password must include a special character."),
    passwordConfirm: z.string(),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: "Passwords do not match.",
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

  // Keep registration handlers for custom inputs
  const emailReg = register("email");
  const passwordReg = register("password");
  const passwordConfirmReg = register("passwordConfirm");
  const companyNameReg = register("companyName");
  const bizNumberReg = register("bizNumber");

  // Show a temporary toast
  const showToast = (message: string, variant: TToastVariant = "error") => {
    setToastMessage(message);
    setToastVariant(variant);
    setToastVisible(true);

    // Hide automatically after three seconds
    setTimeout(() => {
      setToastVisible(false);
    }, 3000);
  };

  // Create the company administrator account
  const onSubmit = async (data: TSignUpFormData) => {
    setIsLoading(true);
    try {
      await superAdminSignUp(data);
      // Continue to sign-in after account creation
      router.push("/signin");
    } catch {
      setIsLoading(false);
      showToast("Account creation failed. Please try again.", "error");
    }
  };

  return (
    <>
      {/* Toast */}
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
            <Link href="/" aria-label="Go to home">
              <SnackIconSvg className="w-[225.16px] h-[63.64px] sm:w-[344px] sm:h-[97.3px]" aria-label="Snack logo" />
            </Link>
          </div>
          <div className="sm:hidden">
            <div className="flex flex-col items-start justify-center gap-[10px]">
              <h1
                id="signup-heading"
                className="text-lg/[22px] sm:text-2xl/[30px] font-bold tracking-tight text-left align-middle"
              >
                Create a company administrator account
              </h1>
              <p
                className="text-primary-600 text-sm/[17px] sm:text-base/[20px] tracking-tight text-center align-middle"
                role="note"
              >
                * Team members can create accounts through invitation emails sent by their company administrator.
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
                Create a company administrator account
              </h1>
              <p
                className="text-primary-600 text-sm/[17px] sm:text-base/[20px] tracking-tight text-left align-middle"
                role="note"
              >
                * Team members can create accounts through invitation emails sent by their company administrator.
              </p>
            </div>
          </div>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col w-full mb-[8px] gap-[20px]"
            role="form"
            aria-label="Company administrator account form"
          >
            {/* Email */}
            <Input
              {...emailReg}
              ref={emailReg.ref}
              type="email"
              label="Email"
              placeholder="Enter your email address"
              error={errors.email?.message}
            />

            {/* Name */}
            <Input
              {...register("name")}
              ref={register("name").ref}
              type="text"
              label="Name"
              placeholder="Enter your name"
              error={errors.name?.message}
            />

            {/* Password */}
            <Input
              {...passwordReg}
              ref={passwordReg.ref}
              type="password"
              label="Password"
              placeholder="Enter your password"
              showPasswordToggle={true}
              error={errors.password?.message}
            />

            {/* Password confirmation */}
            <Input
              {...passwordConfirmReg}
              ref={passwordConfirmReg.ref}
              type="password"
              label="Confirm password"
              placeholder="Enter your password again"
              showPasswordToggle={true}
              error={errors.passwordConfirm?.message}
            />

            {/* Company name */}
            <Input
              {...companyNameReg}
              ref={companyNameReg.ref}
              type="text"
              label="Company name"
              placeholder="Enter your company name"
              error={errors.companyName?.message}
              isCompanyName={true}
            />

            {/* Business registration number */}
            <Input
              {...bizNumberReg}
              ref={bizNumberReg.ref}
              type="text"
              label="Business registration number"
              placeholder="Enter your business registration number"
              error={errors.bizNumber?.message}
              isBizNumber={true}
            />

            {/* Submit account creation */}
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
              aria-label={isSubmitting || isLoading ? "Creating account" : "Create account"}
            >
              {isSubmitting || isLoading ? (
                "Creating account..."
              ) : (
                "Create account"
              )}
            </button>
          </form>

          {/* validation message for screen readers */}
          {!isValid && (
            <div id="form-validation-message" className="sr-only" aria-live="polite">
              Complete all required fields.
            </div>
          )}

          {/* login link */}
          <nav aria-label="Account links" className="w-full flex justify-center">
            <p className="text-primary-500 text-base/[20px] tracking-tight text-center w-full">
              Already have an account?{" "}
              <Link href="/signin" aria-label="Go to sign in">
                <span className="text-primary-950 text-base/[20px] tracking-tight font-bold underline decoration-primary-950 underline-offset-2">
                  Sign in
                </span>
              </Link>
            </p>
          </nav>
        </section>
      </main>
    </>
  );
}
