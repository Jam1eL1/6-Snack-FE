import { z } from "zod";

export const inviteSignupSchema = z
  .object({
    password: z
      .string()
      .min(8, "Please enter at least 8 characters.")
      .regex(/[a-zA-Z]/, "The password must include English letters.")
      .regex(/[0-9]/, "The password must include numbers.")
      .regex(/[^a-zA-Z0-9]/, "The password must include special characters."),
    passwordConfirm: z.string(),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: "The passwords do not match.",
    path: ["passwordConfirm"],
  });

export type TInviteSignUpFormData = z.infer<typeof inviteSignupSchema>;
