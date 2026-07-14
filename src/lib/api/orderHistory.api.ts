import { TOrderItem } from "@/types/myOrderList.types";
import {
  TCancelOrderData,
  TCancelOrderResponse,
  TGetMyOrdersResponse,
  TMyOrderDetail,
  TMyOrderDetailResponse,
} from "@/types/order.types";
import { cookieFetch } from "./fetchClient.api";

export const getMyOrders = async (): Promise<TOrderItem[]> => {
  const response = await cookieFetch<TGetMyOrdersResponse>("/orders");
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
  });

  return response.data;
};
