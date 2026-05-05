"use client";

import { twMerge } from "tailwind-merge";

type TProfileSubmitButtonProps = {
  isFormValid: boolean;
  isSubmitting: boolean;
};

export default function ProfileSubmitButton({ isFormValid, isSubmitting }: TProfileSubmitButtonProps) {
  const isDisabled = !isFormValid || isSubmitting;

  return (
    <button
      type="submit"
      className={twMerge(
        "self-stretch h-16 p-4 rounded-[2px] inline-flex justify-center items-center text-base",
        isDisabled ? "bg-primary-100 text-primary-300 cursor-default" : "bg-primary-950 text-white cursor-pointer",
      )}
      disabled={isDisabled}
      aria-label={isSubmitting ? "Updating profile information" : "Save profile changes"}
      aria-describedby={!isFormValid ? "submit-button-description" : undefined}
    >
      {isSubmitting ? "Updating..." : "Submit"}
    </button>
  );
}
