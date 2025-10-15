import { z } from "zod";

export const signupSchema = z
  .object({
    name: z.string().min(1, "Please enter your name."),
    id: z.string().email("Invalid email address.").min(1, "Please enter your email."),
    password: z
      .string()
      .min(1, "Please enter your password.")
      .min(8, "Password must be at least 8 characters long.")
      .regex(/[a-zA-Z]/, "Must include English letters.")
      .regex(/[0-9]/, "Must include numbers.")
      .regex(/[^a-zA-Z0-9]/, "Must include special characters."),
    passwordConfirm: z.string().min(1, "Please enter your password again."),
    companyName: z.string().min(1, "Please enter company name."),
    companyNumber: z.string().regex(/^\d{10}$/, "Please enter 10-digit business registration number."),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: "Passwords do not match.",
    path: ["passwordConfirm"],
  });
