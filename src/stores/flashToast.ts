// /stores/flashToast.ts
import { create } from "zustand";
import type { TToastVariant } from "@/types/toast.types";

type FlashToastState = {
  message?: string;
  variant?: TToastVariant; // "success" | "error"
  budget?: number;
  setFlash: (message: string, variant?: TToastVariant, budget?: number) => void;
  consume: () => { message?: string; variant?: TToastVariant; budget?: number };
};

export const useFlashToast = create<FlashToastState>((set, get) => ({
  message: undefined,
  variant: "success",
  budget: undefined,
  setFlash: (message, variant = "success", budget) => set({ message, variant, budget }),
  consume: () => {
    const { message, variant, budget } = get();
    set({ message: undefined, budget: undefined }); // Consume the message once.
    return { message, variant, budget };
  },
}));
