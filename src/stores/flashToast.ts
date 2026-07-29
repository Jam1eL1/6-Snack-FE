// /stores/flashToast.ts
import { create } from "zustand";
import type { TToastVariant } from "@/types/toast.types";

type FlashToastState = {
  message?: string;
  variant?: TToastVariant; // "success" | "error"
  setFlash: (message: string, variant?: TToastVariant) => void;
  consume: () => { message?: string; variant?: TToastVariant };
};

export const useFlashToast = create<FlashToastState>((set, get) => ({
  message: undefined,
  variant: "success",
  setFlash: (message, variant = "success") => set({ message, variant }),
  consume: () => {
    const { message, variant } = get();
    set({ message: undefined }); // Consume the message once.
    return { message, variant };
  },
}));
