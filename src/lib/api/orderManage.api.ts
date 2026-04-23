import {
  TOrderResponse,
  TOrderWithoutStatus,
  TPendingOrderResponse,
  TUpdateOrderStatusRequest,
  TUpdateOrderStatusResponse,
} from "@/types/order.types";
import { cookieFetch } from "./fetchClient.api";

export const getPendingOrders = ({
  offset = 0,
  limit = 10,
  orderBy = "latest",
}: {
  offset?: number;
  limit?: number;
  orderBy?: string;
}): Promise<TPendingOrderResponse> => {
  const page = Math.floor(offset / limit) + 1;
  const query = `?status=pending&page=${page}&limit=${limit}&orderBy=${orderBy}`;
  return cookieFetch<TPendingOrderResponse>(`/admin/orders${query}`);
};

export const getPendingOrderDetail = (orderId: string): Promise<TOrderResponse> => {
  return cookieFetch<TOrderResponse>(`/admin/orders/${orderId}?status=pending`);
};
export const getOrderDetailWithoutStatus = (orderId: string): Promise<TOrderWithoutStatus> => {
  return cookieFetch<TOrderWithoutStatus>(`/admin/orders/${orderId}`);
};

export const updateOrderStatus = ({
  orderId,
  status,
  adminMessage,
}: TUpdateOrderStatusRequest): Promise<TUpdateOrderStatusResponse> => {
  return cookieFetch<TUpdateOrderStatusResponse>(`/admin/orders/${orderId}`, {
    method: "PATCH",
    body: JSON.stringify({ status, adminMessage }),
  });
};
