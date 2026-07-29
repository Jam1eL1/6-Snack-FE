"use client";

import clsx from "clsx";
import Input from "@/components/common/Input";
import useSuperAdminSignUp from "../_hooks/useSuperAdminSignUp";

const SuperAdminSignUpForm = () => {
  const {
    form: {
      register,
      handleSubmit,
      formState: { errors, isSubmitting, isValid },
    },
    submit,
  } = useSuperAdminSignUp();

  const emailRegistration = register("email");
  const nameRegistration = register("name");
  const passwordRegistration = register("password");
  const passwordConfirmRegistration = register("passwordConfirm");
  const companyNameRegistration = register("companyName");
  const businessNumberRegistration = register("bizNumber");

  return (
    <>
      <form
        onSubmit={handleSubmit(submit)}
        className="flex w-full flex-col gap-5"
        aria-label="Company administrator account form"
      >
        <Input
          {...emailRegistration}
          id="email"
          type="email"
          label="Email"
          placeholder="Enter your email address"
          error={errors.email?.message}
        />

        <Input
          {...nameRegistration}
          id="name"
          type="text"
          label="Name"
          placeholder="Enter your name"
          error={errors.name?.message}
        />

        <Input
          {...passwordRegistration}
          id="password"
          type="password"
          label="Password"
          placeholder="Enter your password"
          showPasswordToggle
          error={errors.password?.message}
        />

        <Input
          {...passwordConfirmRegistration}
          id="passwordConfirm"
          type="password"
          label="Confirm password"
          placeholder="Enter your password again"
          showPasswordToggle
          error={errors.passwordConfirm?.message}
        />

        <Input
          {...companyNameRegistration}
          id="companyName"
          type="text"
          label="Company name"
          placeholder="Enter your company name"
          isCompanyName
          error={errors.companyName?.message}
        />

        <Input
          {...businessNumberRegistration}
          id="bizNumber"
          type="text"
          inputMode="numeric"
          label="Business registration number"
          placeholder="Enter your business registration number"
          isBizNumber
          error={errors.bizNumber?.message}
        />

        <button
          type="submit"
          className={clsx(
            "mt-2 inline-flex h-16 w-full items-center justify-center rounded-[2px] text-base font-bold transition-colors",
            isValid && !isSubmitting
              ? "cursor-pointer bg-primary-950 text-primary-50 hover:bg-primary-900"
              : "cursor-default bg-primary-100 text-primary-300",
          )}
          disabled={!isValid || isSubmitting}
          aria-describedby={!isValid ? "form-validation-message" : undefined}
        >
          {isSubmitting ? "Creating account..." : "Create account"}
        </button>

        {!isValid && (
          <p id="form-validation-message" className="sr-only" aria-live="polite">
            Complete all required fields.
          </p>
        )}
      </form>
    </>
  );
};

export default SuperAdminSignUpForm;
