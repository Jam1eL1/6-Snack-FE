import React, { useState, useRef, useEffect } from "react";
import ArrowIconSvg from "@/components/svg/ArrowIconSvg";
import { TInviteMemberModalProps, TUserRole } from "@/types/inviteMemberModal.types";
import { useModal } from "@/providers/ModalProvider";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateUserRole } from "@/lib/api/superAdmin.api";
import { queryKeys } from "@/lib/queryKeys";
import Button from "@/components/ui/Button";
import Input from "@/components/common/Input";
import Toast from "@/components/common/Toast";
import { TToastVariant } from "@/types/toast.types";
import { emailSchema } from "@/lib/schemas/email.schema";
import { SessionExpiredError } from "@/lib/api/auth.errors";

const roleLabels: Record<TUserRole, string> = {
  USER: "User",
  ADMIN: "Admin",
};

export default function InviteMemberModal({
  onCancel,
  onSubmit,
  mode = "invite",
  defaultValues,
}: TInviteMemberModalProps) {
  const { closeModal } = useModal();
  const queryClient = useQueryClient();
  const [name, setName] = useState<string>(defaultValues?.name ?? "");
  const [email, setEmail] = useState<string>(defaultValues?.email ?? "");
  const [selectedRole, setSelectedRole] = useState<TUserRole>(defaultValues?.role ?? "USER");
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [emailError, setEmailError] = useState<string>("");
  const [nameError, setNameError] = useState<string>("");

  // Toast state
  const [toastVisible, setToastVisible] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string>("");
  const [toastVariant, setToastVariant] = useState<TToastVariant>("success");
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Toast helper
  const showToast = (message: string, variant: TToastVariant) => {
    // Clear the existing timer if one is already running.
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    setToastMessage(message);
    setToastVariant(variant);
    setToastVisible(true);
    timerRef.current = setTimeout(() => setToastVisible(false), 3000);
  };

  // Clear the timer when the component unmounts.
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  // Role update mutation
  const updateRoleMutation = useMutation({
    mutationFn: ({ userId, role }: { userId: string; role: TUserRole }) => updateUserRole(userId, role),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.companyUsers.all });
      onSubmit?.({ name, email, role: selectedRole });
      closeModal();
    },
    onError: (error) => {
      if (error instanceof SessionExpiredError) return;
      const errorMessage = error instanceof Error ? error.message : "Failed to update role.";
      showToast(errorMessage, "error");
    },
  });

  const handleSubmit = async () => {
    if (mode === "edit") {
      if (!defaultValues) {
        showToast("Default values are missing.", "error");
        return;
      }

      updateRoleMutation.mutate({
        userId: defaultValues.id,
        role: selectedRole,
      });
    } else {
      // Name validation
      if (!name.trim()) {
        setNameError("Please enter a name.");
        showToast("Please enter a name.", "error");
        return;
      }
      setNameError("");

      // Email validation
      const emailValidation = emailSchema.safeParse(email);
      if (!emailValidation.success) {
        setEmailError("Please enter a valid email.");
        showToast("Please enter a valid email.", "error");
        return;
      }
      setEmailError("");

      onSubmit?.({ name, email, role: selectedRole });
      closeModal();
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      closeModal();
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-white overflow-auto shadow-[0px_0px_40px_0px_rgba(0,0,0,0.10)] sm:w-[600px] sm:h-[490px] sm:top-1/2 sm:left-1/2 sm:translate-[-50%] sm:py-[40px] sm:px-[60px]">
        <div className="flex justify-center items-center h-[54px] py-[16px] px-[8px] sm:p-0 sm:h-auto">
          <p className="flex justify-center items-center w-[375px] font-bold text-[18px]/[22px] tracking-tight text-[#1f1f1f]">
            {mode === "edit" ? "Update Role" : "Invite Member"}
          </p>
        </div>

        <div className="flex flex-col items-center p-[24px] pt-[20px] pb-[100px] sm:p-0 sm:pt-[32px] sm:pb-0">
          <div className="flex flex-col w-full gap-[32px] mb-[20px] sm:max-w-[480px] sm:mb-0">
            <div className="flex flex-col justify-start items-start gap-5">
              <Input
                label="Name"
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  // Live name validation
                  if (e.target.value.trim() === "") {
                    setNameError("Please enter a name.");
                  } else {
                    setNameError("");
                  }
                }}
                placeholder="Please enter a name"
                readOnly={mode === "edit"}
                error={nameError}
              />

              <Input
                label="Email"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  // Live email validation
                  if (e.target.value) {
                    const emailValidation = emailSchema.safeParse(e.target.value);
                    if (!emailValidation.success) {
                      setEmailError("Please enter a valid email.");
                    } else {
                      setEmailError("");
                    }
                  } else {
                    setEmailError("");
                  }
                }}
                placeholder="Please enter an email"
                readOnly={mode === "edit"}
                error={emailError}
              />
            </div>

            <div className="flex flex-col justify-center items-start gap-3">
              <p className="font-bold text-[16px]/[20px] tracking-tight text-primary-950">Role</p>
              <div className="relative w-full">
                <div
                  data-active={isDropdownOpen ? "on" : "off"}
                  className="w-full h-11 px-4 py-2.5 bg-white outline-1 outline-primary-100 inline-flex justify-between items-center cursor-pointer"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                >
                  <div className="justify-start text-primary-950 text-base font-normal">{roleLabels[selectedRole]}</div>
                  <div className="w-[6px] h-[6px] flex items-center justify-center">
                    <ArrowIconSvg direction={isDropdownOpen ? "up" : "down"} className="text-primary-950" />
                  </div>
                </div>

                {isDropdownOpen && (
                  <div className="absolute top-full left-0 w-full bg-white border border-primary-100 z-10">
                    {Object.entries(roleLabels).map(([role, label]) => (
                      <div
                        key={role}
                        className="px-4 py-2.5 hover:bg-primary-50 cursor-pointer text-primary-950 text-base font-normal"
                        onClick={() => {
                          setSelectedRole(role as TUserRole);
                          setIsDropdownOpen(false);
                        }}
                      >
                        {label}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-center items-center w-full pt-[384px] gap-[20px] sm:pt-0 sm:max-w-[480px] sm:mt-8">
            <Button
              onClick={handleCancel}
              type="white"
              label="Cancel"
              className="flex justify-center items-center w-full min-w-[155px] sm:max-w-[230px] h-[64px] py-[12px] px-[16px] font-bold"
            />
            <Button
              onClick={handleSubmit}
              type={updateRoleMutation.isPending ? "grayDisabled" : "black"}
              label={updateRoleMutation.isPending ? "Processing..." : mode === "edit" ? "Update Role" : "Invite"}
              className="flex justify-center items-center w-full  min-w-[155px] sm:max-w-[230px] h-[64px] py-[12px] px-[16px] font-bold"
              disabled={updateRoleMutation.isPending}
            />
          </div>
        </div>
      </div>

      {toastVisible && <Toast text={toastMessage} variant={toastVariant} isVisible={toastVisible} />}
    </>
  );
}
