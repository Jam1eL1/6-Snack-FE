import {
  TAdminOrdersData,
  TAdminOrdersResponse,
  TOrderResponse,
  TOrderSort,
  TOrderWithoutStatus,
  TUpdateOrderStatusRequest,
  TUpdateOrderStatusResponse,
} from "@/types/order.types";
import { cookieFetch } from "./fetchClient.api";

type TGetPendingOrdersParams = {
  offset?: number;
  limit?: number;
  orderBy?: TOrderSort;
};

export const getPendingOrders = async ({
  offset = 0,
  limit = 10,
  orderBy = "latest",
}: TGetPendingOrdersParams): Promise<TAdminOrdersData> => {
  const page = Math.floor(offset / limit) + 1;
  const query = `?status=pending&page=${page}&limit=${limit}&orderBy=${orderBy}`;
  const response = await cookieFetch<TAdminOrdersResponse>(`/admin/orders${query}`);
  return response.data;
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
