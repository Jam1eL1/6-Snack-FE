import { z } from "zod";

// Zod schema, validation
export const signInSchema = z.object({
  email: z.string().nonempty({ message: "Please enter your email." }).email({ message: "Invalid email address." }),
  password: z
    .string()
    .nonempty({ message: "Please enter your password." })
    .min(8, { message: "Password must be at least 8 characters." })
    .regex(/^(?=.*[a-zA-Z])(?=.*\d)(?=.*[^a-zA-Z0-9]).+$/, "Invalid password."),
});

// Type definition
export type TSignInFormData = z.infer<typeof signInSchema>;
