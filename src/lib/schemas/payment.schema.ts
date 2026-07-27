import { z } from "zod";

const isValidExpiryDate = (value: string) => {
  const [monthValue, yearValue] = value.split("/").map((part) => part.trim());
  const month = Number(monthValue);
  const year = 2000 + Number(yearValue);
  const now = new Date();
  const currentMonth = now.getMonth() + 1;
  const currentYear = now.getFullYear();

  return year > currentYear || (year === currentYear && month >= currentMonth);
};

export const paymentCardSchema = z.object({
  cardholderName: z
    .string()
    .trim()
    .min(1, "Enter the name shown on the card.")
    .regex(/^[a-zA-Z\s'-]+$/, "Cardholder name can only contain letters, spaces, hyphens, and apostrophes."),
  cardNumber: z.string().refine((value) => /^\d{16}$/.test(value.replace(/\s/g, "")), "Enter a 16-digit card number."),
  cardExpiry: z
    .string()
    .regex(/^(0[1-9]|1[0-2])\s\/\s\d{2}$/, "Enter the expiration date as MM / YY.")
    .refine(isValidExpiryDate, "The expiration date must not be in the past."),
  cardCvc: z.string().regex(/^\d{3}$/, "Enter a 3-digit CVC."),
});

export type TPaymentCardFormData = z.infer<typeof paymentCardSchema>;
