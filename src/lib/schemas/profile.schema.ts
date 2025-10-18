import { z } from "zod";

// Zod schema for profile update
export const profileSchema = z
  .object({
    company: z.string().optional(),
    password: z
      .string()
      .optional()
      .refine((val) => !val || val.length >= 1, {
        message: "Please enter your password.",
      })
      .refine((val) => !val || val.length >= 8, {
        message: "Password must be at least 8 characters long.",
      })
      .refine((val) => !val || /[a-zA-Z]/.test(val), {
        message: "Must include English letters.",
      })
      .refine((val) => !val || /[0-9]/.test(val), {
        message: "Must include numbers.",
      })
      .refine((val) => !val || /[^a-zA-Z0-9]/.test(val), {
        message: "Must include special characters.",
      }),
    confirmPassword: z.string().optional(),
  })
  .refine(
    (data) => {
      // 비밀번호가 입력된 경우에만 확인 비밀번호와 일치하는지 검사
      if (data.password && data.password.length > 0) {
        return data.password === data.confirmPassword;
      }
      return true;
    },
    {
      message: "비밀번호가 일치하지 않습니다.",
      path: ["confirmPassword"],
    },
  )
  .refine(
    (data) => {
      // 회사명이 변경된 경우 공백이 아니어야 함
      if (data.company !== undefined) {
        return data.company.trim() !== "";
      }
      return true;
    },
    {
      message: "회사명을 입력해주세요.",
      path: ["company"],
    },
  );

// 타입 정의
export type TProfileFormData = z.infer<typeof profileSchema>;
