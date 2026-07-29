"use client";

import React from "react";
import clsx from "clsx";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Image from "next/image";
import img_logo from "@/assets/images/img_logo.webp";
import { adminSignUp } from "@/app/actions/adminSignUp";
import { signupSchema } from "@/lib/schemas/signup.schema";

type TSignUpForm = z.infer<typeof signupSchema>;

const SignUpForm = () => {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<TSignUpForm>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = async (data: TSignUpForm) => {
    // Map client fields to the backend form fields
    const formData = new FormData();
    formData.append("email", data.id);
    formData.append("name", data.name);
    formData.append("password", data.password);
    formData.append("confirmPassword", data.passwordConfirm);
    formData.append("companyName", data.companyName);
    formData.append("bizNumber", data.companyNumber);

    try {
      // Submit through the server action
      const result = await adminSignUp(formData);

      if (result?.error) {
        alert(`Account creation failed: ${result.error}`);

        // Map known backend errors to their fields
        if (result.error.includes("This email is already registered.")) {
          setError("id", { type: "manual", message: "This email is already registered." });
        } else if (result.error.includes("business registration number is already registered")) {
          setError("companyNumber", {
            type: "manual",
            message: "This business registration number is already registered.",
          });
        }
      } else {
        // The server action handles the redirect
        alert("Account created successfully.");
      }
    } catch (error) {
      if (error instanceof Error) {
        alert(`Unexpected error: ${error.message}`);
      } else {
        alert("An unexpected error occurred.");
      }
    }
  };

  const formFields = [
    { id: "name", label: "Enter the company administrator's name", type: "text", name: "name" },
    { id: "id", label: "Enter your email address", type: "email", name: "id" },
    { id: "password", label: "Enter your password", type: "password", name: "password" },
    {
      id: "passwordConfirm",
      label: "Enter your password again",
      type: "password",
      name: "passwordConfirm",
    },
    { id: "companyName", label: "Enter your company name", type: "text", name: "companyName" },
    {
      id: "companyNumber",
      label: "Enter your business registration number",
      type: "text",
      name: "companyNumber",
    },
  ];

  return (
    <div>
      <div className="flex justify-center items-center h-16">
        <Image src={img_logo} alt="Snack logo" width={344} height={97} priority />
      </div>
      <div
        className={clsx(
          "w-150",
          "h-183.5",
          "pt-10",
          "pr-15",
          "pb-10",
          "pl-15",
          "rounded-[2px]",
          "bg-[--color-white]",
          "shadow-[0px_0px_40px_0px_#0000001A]",
          "flex",
          "flex-col",
          "gap-5",
        )}
      >
        <div className="flex flex-col gap-2.5">
          <h2
            className={clsx(
              "font-suit",
              "font-bold",
              "text-6",
              "leading-tight",
              "tracking-tighter",
              "text-left",
              "align-middle",
            )}
          >
            Create a company administrator account
          </h2>
          <p
            className={clsx(
              "font-suit",
              "font-normal",
              "text-4",
              "leading-tight",
              "tracking-tighter",
              "text-left",
              "align-middle",
            )}
          >
            * Team members can create accounts through invitation emails sent by their company administrator.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
          {formFields.map((field) => (
            <div key={field.id}>
              <label htmlFor={field.id} className="sr-only">
                {field.label}
              </label>
              <input
                type={field.type}
                id={field.id}
                placeholder={field.label}
                {...register(field.name as keyof TSignUpForm)}
                className={clsx(
                  "w-full",
                  "p-3",
                  "border",
                  "border-[--color-primary-200]",
                  "rounded-md",
                  "focus:outline-none",
                  "focus:ring-2",
                  "focus:ring-[--color-secondary-500]",
                  "placeholder-[--color-primary-400]",
                  "text-[--color-primary-900]",
                  "text-base",
                  errors[field.name as keyof TSignUpForm] && "border-red-500",
                )}
              />
              {errors[field.name as keyof TSignUpForm] && (
                <p className="text-red-500 text-sm mt-1">{errors[field.name as keyof TSignUpForm]?.message}</p>
              )}
            </div>
          ))}

          <button
            type="submit"
            disabled={isSubmitting}
            className={clsx(
              "w-full",
              "py-4",
              "bg-[--color-primary-950]",
              "text-[--color-white]",
              "font-semibold",
              "rounded-md",
              "hover:bg-[--color-primary-800]",
              "transition-colors",
              "duration-200",
              isSubmitting && "opacity-70 cursor-not-allowed",
            )}
          >
            {isSubmitting ? "Creating account..." : "Create account"}
          </button>
        </form>

        <p className={clsx("text-center", "mt-6", "text-sm", "text-[--color-primary-700]")}>
          Already have an account?{" "}
          <a
            href="/signin"
            className={clsx(
              "text-[--color-primary-950]",
              "font-semibold",
              "underline",
              "hover:text-[--color-primary-700]",
            )}
          >
            Sign in
          </a>
        </p>
      </div>
    </div>
  );
};

export default SignUpForm;
