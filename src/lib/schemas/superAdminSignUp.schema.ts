import { z } from "zod";

export const superAdminSignUpSchema = z
  .object({
    email: z.string().email("Enter a valid email address."),
    name: z.string().min(1, "Enter your name."),
    companyName: z
      .string()
      .min(1, "Enter your company name.")
      .regex(
        /^[가-힣a-zA-Z\d().,_\- ]+$/,
        "Company name can contain Korean or English letters, numbers, spaces, and (), . , - _.",
      ),
    bizNumber: z.string().regex(/^[0-9]{10}$/, "Enter a 10-digit business registration number."),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters.")
      .regex(/[a-zA-Z]/, "Password must include a letter.")
      .regex(/[0-9]/, "Password must include a number.")
      .regex(/[^a-zA-Z0-9]/, "Password must include a special character."),
    passwordConfirm: z.string(),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: "Passwords do not match.",
    path: ["passwordConfirm"],
  });

export type TSuperAdminSignUpFormData = z.infer<typeof superAdminSignUpSchema>;
