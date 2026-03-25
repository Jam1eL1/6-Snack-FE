"use client";

import Button from "@/components/ui/Button";
import { TButtonType } from "@/types/button.types";

type TProfileSubmitButtonProps = {
  isFormValid: boolean;
  isSubmitting: boolean;
  onSubmit: () => void;
};

export default function ProfileSubmitButton({ isFormValid, isSubmitting, onSubmit }: TProfileSubmitButtonProps) {
  const buttonType: TButtonType = isFormValid ? "black" : "grayDisabled";

  return (
    <Button
      type={buttonType}
      label={isSubmitting ? "Updating..." : "Submit"}
      className={`self-stretch h-16 p-4 ${!isFormValid ? "bg-primary-100 text-primary-300" : ""}`}
      disabled={!isFormValid || isSubmitting}
      onClick={onSubmit}
      aria-label={isSubmitting ? "Updating profile information" : "Save profile changes"}
      aria-describedby={!isFormValid ? "submit-button-description" : undefined}
    />
  );
}
