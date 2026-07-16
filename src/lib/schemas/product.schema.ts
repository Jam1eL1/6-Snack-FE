import { z } from "zod";

export const productRegistrationSchema = z.object({
  productName: z
    .string()
    .min(1, "Please enter product name")
    .max(15, "Product name must be 15 characters or less")
    .regex(/^[a-zA-Z0-9가-힣ㄱ-ㅎㅏ-ㅣ\s]+$/, "Special characters cannot be used"),
  price: z
    .string()
    .min(1, "Please enter price")
    .regex(/^\d+(\.\d{1,2})?$/, "Enter a valid CAD amount with no more than two decimal places")
    .refine((val) => val === "" || Number(val) > 0, "Price must be greater than 0")
    .refine((val) => val === "" || Number(val) <= 1000000, "Price must be 1,000,000 or less"),
  productLink: z
    .string()
    .min(1, "Please enter product link")
    .refine((val) => {
      if (val === "") return true;
      // Check if it starts with http:// or https://
      if (!val.startsWith("http://") && !val.startsWith("https://")) {
        return false;
      }
      // Check if . is included in the part after // (domain validation)
      const afterProtocol = val.substring(val.indexOf("//") + 2);
      if (!afterProtocol.includes(".")) {
        return false;
      }
      try {
        new URL(val);
        return true;
      } catch {
        return false;
      }
    }, "Please enter correct URL format (e.g., https://example.com)"),
  parentCategory: z.string().min(1, "Please select main category"),
  childrenCategory: z.string().min(1, "Please select subcategory"),
  imageFile: z
    .union([
      z.instanceof(File, { message: "Please upload image" }),
      z.null().refine(() => false, { message: "Please upload image" }),
    ])
    .refine((file) => file && file.size > 0, "Please upload image")
    .refine((file) => file && file.size <= 5 * 1024 * 1024, "File size must be 5MB or less")
    .refine(
      (file) => file && ["image/jpeg", "image/png", "image/webp", "image/avif"].includes(file.type),
      "Only JPG, PNG, WEBP, AVIF formats are supported",
    ),
});

export type ProductRegistrationFormData = z.infer<typeof productRegistrationSchema>;
