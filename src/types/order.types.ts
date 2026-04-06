import { StaticImageData } from "next/image";

type TProducts = {
  id: number;
  productName: string;
  price: number;
  imageUrl: string | StaticImageData;
  quantity: number;
}[];

type TBudget = {
  currentMonthBudget: number;
  currentMonthExpense: number;
};

export type TOrderBase = {
  id: string;
  userId: string;
  approver: null;
  adminMessage: string;
  requestMessage: string;
  deliveryFee: number;
  productsPriceTotal: number;
  createdAt: string;
  updatedAt: string;
  status: string;
  requester: string;
};

export type TOrderSummary = TOrderBase & {
  productName: string;
};

export type TOrder = TOrderBase & {
  products: TProducts;
  budget: TBudget;
};

export type TOrderRequestBody = {
  requestMessage?: string;
  cartItemIds: number[];
};

export type TOrderNowBody = {
  cartItemIds: number[];
};

export type TOrderNowResponse = {
  message: string;
  data: {
    id: number;
    userId: string;
    approver: string;
    adminMessage: string | null;
    requestMessage: string | null;
    totalPrice: number;
    createdAt: string;
    updatedAt: string;
    status: string;
  };
};

export type TOrderResponse = TOrderBase & {
  companyId: number;
  requester: string;
  products: (TProducts[number] & {
    productId: number;
    orderId: string;
    createdAt: string;
  })[];
  budget: TBudget;
};

export type TOrderWithoutStatus = TOrderResponse;
