import { TOrderItem } from "@/types/myOrderList.types";
import { cookieFetch } from "./fetchClient.api";

// Type for fetching my order request details (actual API response shape)
export type TReceipt = {
  id: number;
  productId: number;
  orderId: string;
  productName: string;
  price: number;
  imageUrl: string;
  quantity: number;
  createdAt: string;
};

export type TOrderUser = {
  id: string;
  email: string;
  name: string;
  companyId: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  role: string;
};

export type TMyOrderDetail = {
  id: string;
  companyId: number;
  userId: string;
  approver: string | null;
  adminMessage: string | null;
  requestMessage: string | null;
  // totalPrice: number; // deprecated, replaced by productsPriceTotal
  productsPriceTotal: number;
  deliveryFee: number;
  createdAt: string;
  updatedAt: string;
  status: "PENDING" | "APPROVED" | "REJECTED" | "CANCELED" | "INSTANT_APPROVED";
  user: TOrderUser;
  receipts: TReceipt[];
};

export type TMyOrderDetailResponse = {
  message: string;
  data: TMyOrderDetail;
};

export type TBudget = {
  currentMonthBudget: number | null;
  currentMonthExpense: number | null;
};

export type TCancelOrderReceipt = {
  id: number;
  productName: string;
  price: number;
  imageUrl: string;
  quantity: number;
};

export type TCancelOrderData = {
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
  status: "CANCELED";
  receipts: TCancelOrderReceipt[];
};

export type TCancelOrderResponse = {
  message: string;
  data: TCancelOrderData;
};

export const getMyOrders = async (): Promise<TOrderItem[]> => {
  const response = await cookieFetch<{ data: TOrderItem[] }>("/orders");
  return response.data;
};

// Fetch my order request details
export const getMyOrderDetail = async (orderId: string): Promise<TMyOrderDetail> => {
  const response = await cookieFetch<TMyOrderDetailResponse>(`/orders/${orderId}`);
  return response.data;
};

// Cancel Order Request
export const cancelOrder = async (orderId: string): Promise<TCancelOrderData> => {
  const response = await cookieFetch<TCancelOrderResponse>(`/orders/${orderId}`, {
    method: "PATCH",
    body: JSON.stringify({
      status: "CANCELED",
    }),
  });

  return response.data;
};
