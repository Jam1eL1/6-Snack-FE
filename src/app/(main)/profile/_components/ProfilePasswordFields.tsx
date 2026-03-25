"use client";

import Input from "@/components/common/Input";
import { UseFormRegisterReturn } from "react-hook-form";

type TProfilePasswordFieldsProps = {
  passwordRegister: UseFormRegisterReturn;
  confirmPasswordRegister: UseFormRegisterReturn;
  passwordValue?: string;
  confirmPasswordValue?: string;
  passwordError?: string;
  confirmPasswordError?: string;
};

export default function ProfilePasswordFields({
  passwordRegister,
  confirmPasswordRegister,
  passwordValue,
  confirmPasswordValue,
  passwordError,
  confirmPasswordError,
}: TProfilePasswordFieldsProps) {
  return (
    <fieldset aria-label="Change password" className="space-y-4 w-full">
      <legend className="sr-only">Change password</legend>

      {/* Password */}
      <Input
        label="Password (Optional)"
        type="password"
        showPasswordToggle={true}
        error={passwordError}
        id="password"
        autoComplete="new-password"
        placeholder="Enter a new password (optional)"
        value={passwordValue || ""}
        aria-describedby={passwordError ? "password-error" : undefined}
        aria-invalid={passwordError ? "true" : "false"}
        {...passwordRegister}
      />

      {/* Confirm password */}
      <Input
        label="Confirm Password"
        type="password"
        showPasswordToggle={true}
        error={confirmPasswordError}
        id="confirmPassword"
        autoComplete="new-password"
        placeholder="Re-enter your password"
        value={confirmPasswordValue || ""}
        aria-describedby={confirmPasswordError ? "confirm-password-error" : undefined}
        aria-invalid={confirmPasswordError ? "true" : "false"}
        {...confirmPasswordRegister}
      />
    </fieldset>
  );
}
