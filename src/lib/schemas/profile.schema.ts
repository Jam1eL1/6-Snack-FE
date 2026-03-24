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
        message: "Password must include at least one letter.",
      })
      .refine((val) => !val || /[0-9]/.test(val), {
        message: "Password must include at least one number.",
      })
      .refine((val) => !val || /[^a-zA-Z0-9]/.test(val), {
        message: "Password must include at least one special character.",
      }),
    confirmPassword: z.string().optional(),
  })
  .refine(
    (data) => {
      // Only check password confirmation when a password has been entered.
      if (data.password && data.password.length > 0) {
        return data.password === data.confirmPassword;
      }
      return true;
    },
    {
      message: "Passwords do not match.",
      path: ["confirmPassword"],
    },
  )
  .refine(
    (data) => {
      // If the company field is provided, it must not be empty after trimming.
      if (data.company !== undefined) {
        return data.company.trim() !== "";
      }
      return true;
    },
    {
      message: "Please enter a company name.",
      path: ["company"],
    },
  );

// Type definition
export type TProfileFormData = z.infer<typeof profileSchema>;
