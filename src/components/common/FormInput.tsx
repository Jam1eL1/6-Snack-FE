"use client";

import React from "react";
import { useFormContext } from "react-hook-form";
import { twMerge } from "tailwind-merge";

type TFormInputProps = {
  name: string;
  label?: string;
  placeholder?: string;
  type?: "text" | "email" | "password" | "number";
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
  className?: string;
  containerClassName?: string;
  toLowerCase?: boolean;
};

export default function FormInput({
  name,
  label,
  placeholder,
  type = "text",
  inputMode,
  className,
  containerClassName,
  toLowerCase = false,
}: TFormInputProps) {
  const {
    register,
    formState: { errors, touchedFields },
    watch,
  } = useFormContext();

  const value = watch(name);
  const hasValue = Boolean(value);
  const error = errors[name]?.message as string;
  const isTouched = touchedFields[name];
  const shouldShowError = error && (isTouched || hasValue);

  return (
    <div className={twMerge("flex flex-col w-full gap-1", containerClassName)}>
      <div
        className={twMerge(
          "relative flex flex-col h-[56px] py-2 px-1 gap-1 border-b-1",
          shouldShowError ? "border-error-500" : "border-primary-600",
          hasValue ? "justify-end" : "justify-center",
        )}
      >
        {/* Label */}
        {label && (
          <label
            htmlFor={name}
            className={twMerge(
              "absolute left-1 top-2 font-normal text-xs tracking-tight text-primary-600 transition-all duration-300",
              hasValue ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0",
            )}
          >
            {label}
          </label>
        )}

        {/* Input */}
        <input
          {...register(name, {
            onChange: (e) => {
              if (toLowerCase) {
                e.target.value = e.target.value.toLowerCase();
              }
            },
          })}
          id={name}
          type={type}
          inputMode={inputMode}
          placeholder={placeholder}
          className={twMerge(
            "w-full font-normal text-base text-primary-950 outline-none placeholder:font-normal placeholder:text-base placeholder:tracking-tight placeholder:text-primary-500",
            className,
          )}
        />
      </div>

      {/* Error Message */}
      {shouldShowError && <p className="font-normal text-xs tracking-tight text-error-500">{error}</p>}
    </div>
  );
}
