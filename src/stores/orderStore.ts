import { TCheckoutOrder } from "@/types/order.types";
import { create } from "zustand";

type TOrderState = {
  order: TCheckoutOrder | null;
  setOrder: (order: TCheckoutOrder) => void;
};

export const useOrderStore = create<TOrderState>((set) => ({
  order: null,
  setOrder: (order) => set({ order }),
}));
