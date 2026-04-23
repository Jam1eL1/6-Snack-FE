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
  approver: string | null;
  adminMessage: string | null;
  requestMessage: string | null;
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
  data: TUpdateOrderStatusResponse;
};

export type TPendingOrderResponse = {
  orders: TOrderSummary[];
  meta: { totalCount: number; itemsPerPage: number; currentPage: number; totalPages: number };
};

export type TAdminOrdersResponse = TPendingOrderResponse;

export type TUpdateOrderStatusRequest = {
  orderId: string;
  status: "APPROVED" | "REJECTED";
  adminMessage?: string;
};

export type TUpdateOrderStatusResponse = {
  id: string;
  companyId: number;
  userId: string;
  approver: string | null;
  adminMessage: string | null;
  requestMessage: string | null;
  deliveryFee: number;
  productsPriceTotal: number;
  createdAt: string;
  updatedAt: string;
  status: "PENDING" | "APPROVED" | "REJECTED" | "CANCELED" | "INSTANT_APPROVED";
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
