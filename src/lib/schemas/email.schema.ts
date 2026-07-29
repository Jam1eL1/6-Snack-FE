import { z } from "zod";

// Email validation schema
export const emailSchema = z
  .string()
  .nonempty({ message: "Enter your email address." })
  .email({ message: "Enter a valid email address." });

// Validate an email address
export const validateEmail = (email: string): { isValid: boolean; error?: string } => {
  const result = emailSchema.safeParse(email);

  if (result.success) {
    return { isValid: true };
  } else {
    return {
      isValid: false,
      error: result.error.issues[0]?.message || "Enter a valid email address.",
    };
  }
};
