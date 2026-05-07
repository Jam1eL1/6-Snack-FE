"use client";

import { useEffect, useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { profileSchema, TProfileFormData } from "@/lib/schemas/profile.schema";
import { useAuth } from "@/providers/AuthProvider";
import { Role } from "@/types/auth.types";
import ProfileInfoField from "./ProfileInfoField";
import ProfilePasswordFields from "./ProfilePasswordFields";
import ProfileSubmitButton from "./ProfileSubmitButton";
import Toast from "@/components/common/Toast";
import { useUpdateCompanyInfo, useUpdatePassword } from "@/hooks/useUpdateProfile";
import { SessionExpiredError } from "@/lib/api/auth.errors";
import { TUpdateCompanyInfoRequest, TUpdatePasswordRequest } from "@/lib/api/profile.api";

export default function ProfileForm() {
  const { user } = useAuth();

  // Toast state
  const [toastVisible, setToastVisible] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string>("");
  const [toastVariant, setToastVariant] = useState<"success" | "error">("success");
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // React Hook Form setup
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

  // Watch form values
  const company = watch("company");
  const password = watch("password");
  const confirmPassword = watch("confirmPassword");

  // Extract the company field registration props
  const companyRegister = register("company");

  // Track whether any values actually changed
  const hasCompanyChanged = Boolean(user?.role === Role.SUPER_ADMIN && company?.trim() !== (user?.company?.name || ""));
  const hasPasswordChanged = Boolean(password && password.length > 0);

  const hasAnyChanges = hasCompanyChanged || hasPasswordChanged;

  // Form validity
  const isFormValid = Boolean(hasAnyChanges && isValid);

  // Show a toast message
  const showToast = (message: string, variant: "success" | "error") => {
    // Clear the previous timer before showing a new toast.
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    setToastMessage(message);
    setToastVariant(variant);
    setToastVisible(true);
    timerRef.current = setTimeout(() => setToastVisible(false), 3000);
  };

  // Mutation for company info update as super admin
  const updateCompanyInfoMutation = useUpdateCompanyInfo({
    onUpdateCompanyInfoSuccess: () => {
      if (hasCompanyChanged && hasPasswordChanged) {
        showToast("Your information has been updated successfully.", "success");
        setValue("password", "");
        setValue("confirmPassword", "");
        return;
      }

      if (hasCompanyChanged) {
        showToast("Company name has been updated successfully.", "success");
        return;
      }
      if (hasPasswordChanged) {
        showToast("Password has been updated successfully.", "success");
        setValue("password", "");
        setValue("confirmPassword", "");
      }
    },
    onUpdateCompanyInfoError: (error) => {
      if (error instanceof SessionExpiredError) return;
      showToast("Failed to update company information", "error");
    },
  });

  // Mutation for password update for non super admin users
  const updatePasswordMutation = useUpdatePassword({
    onUpdatePasswordSuccess: () => {
      if (hasPasswordChanged) {
        showToast("Password updated successfully.", "success");
        setValue("password", "");
        setValue("confirmPassword", "");
      }
    },
    onUpdatePasswordError: (error) => {
      if (error instanceof SessionExpiredError) return;
      showToast("Failed to update password", "error");
    },
  });

  // Mutation related vars
  const isProfileUpdating = updateCompanyInfoMutation.isPending || updatePasswordMutation.isPending;

  // Load user data into the form when it becomes available.
  useEffect(() => {
    if (user) {
      reset({
        company: user.company?.name || "",
        password: "",
        confirmPassword: "",
      });
    }
  }, [user, reset]);

  // Clean up the toast timer on unmount.
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  // Convert enum roles into display labels.
  const getRoleLabel = (role?: Role | null) => {
    switch (role) {
      case Role.USER:
        return "User";
      case Role.ADMIN:
        return "Admin";
      case Role.SUPER_ADMIN:
        return "Super Admin";
      default:
        return "";
    }
  };

  const onSubmit = (data: TProfileFormData) => {
    if (!isFormValid) {
      showToast("Please review your input and try again.", "error");
      return;
    }

    if (!user) {
      showToast("User information could not be found.", "error");
      return;
    }

    if (user?.role === Role.SUPER_ADMIN) {
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
      updateCompanyInfoMutation.mutate({ userId: user.id, payload });
      return;
    } else {
      if (data.password) {
        const payload: TUpdatePasswordRequest = {
          newPassword: data.password,
          newPasswordConfirm: data.password,
        };
        updatePasswordMutation.mutate({ userId: user.id, payload });
        return;
      }
    }
  };

  return (
    <main aria-label="Profile settings page" className="w-full sm:w-auto">
      {toastVisible && <Toast text={toastMessage} variant={toastVariant} isVisible={toastVisible} />}

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full sm:w-[600px] py-10 sm:px-14 sm:rounded-sm sm:shadow-[0px_0px_40px_0px_rgba(0,0,0,0.10)] sm:outline-offset-[-1px] inline-flex flex-col justify-center items-start gap-5"
        aria-label="Profile update form"
        noValidate
      >
        <header>
          <h1 className="text-center justify-center text-xl font-bold font-suit">Update Profile</h1>
        </header>

        <section
          className="self-stretch flex flex-col justify-start items-center gap-6"
          aria-label="Profile information"
        >
          <div className="self-stretch flex flex-col justify-start items-start gap-7">
            <div className="self-stretch flex flex-col justify-start items-start gap-8">
              <fieldset
                className="self-stretch flex flex-col justify-start items-start gap-5"
                aria-label="Basic information"
              >
                <legend className="sr-only">Basic information</legend>

                {/* Company */}
                <ProfileInfoField
                  label="Company"
                  value={company !== undefined ? company : user?.company?.name || ""}
                  isEditable={user?.role === Role.SUPER_ADMIN}
                  role={user?.role}
                  type={user?.role === Role.SUPER_ADMIN ? "input" : "display"}
                  error={errors.company?.message}
                  {...companyRegister}
                />

                {/* Role */}
                <ProfileInfoField label="Role" value={getRoleLabel(user?.role)} type="display" />

                {/* Name */}
                <ProfileInfoField label="Name" value={user?.name || ""} type="display" />

                {/* Email */}
                <ProfileInfoField label="Email" value={user?.email || ""} type="display" />

                {/* Password section */}
                <ProfilePasswordFields
                  passwordRegister={register("password")}
                  confirmPasswordRegister={register("confirmPassword")}
                  passwordValue={password}
                  confirmPasswordValue={confirmPassword}
                  passwordError={errors.password?.message}
                  confirmPasswordError={errors.confirmPassword?.message}
                />
              </fieldset>
            </div>

            {/* Submit button */}
            <ProfileSubmitButton isFormValid={isFormValid} isSubmitting={isProfileUpdating} />
          </div>
        </section>
      </form>
    </main>
  );
}
