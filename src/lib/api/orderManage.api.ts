import {
  TAdminOrderDetail,
  TAdminOrderDetailResponse,
  TAdminOrdersData,
  TAdminOrdersResponse,
  TOrderSort,
  TUpdateOrderStatusRequest,
  TUpdateOrderStatusData,
  TUpdateOrderStatusResponse,
  TStartOrderPaymentData,
  TStartOrderPaymentResponse,
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

export const getPendingOrderDetail = async (orderId: string): Promise<TAdminOrderDetail> => {
  const response = await cookieFetch<TAdminOrderDetailResponse>(`/admin/orders/${orderId}?status=pending`);
  return response.data;
};
export const getOrderDetailWithoutStatus = async (orderId: string): Promise<TAdminOrderDetail> => {
  const response = await cookieFetch<TAdminOrderDetailResponse>(`/admin/orders/${orderId}`);

  return response.data;
};

export const updateOrderStatus = async ({
  orderId,
  status,
  adminMessage,
}: TUpdateOrderStatusRequest): Promise<TUpdateOrderStatusData> => {
  const response = await cookieFetch<TUpdateOrderStatusResponse>(`/admin/orders/${orderId}`, {
    method: "PATCH",
    body: JSON.stringify({ status, adminMessage }),
  });

  return response.data;
};

// get order detail for admin
export const getOrderDetail = async (
  orderId: string,
  status: "pending" | "approved" = "pending",
): Promise<TAdminOrderDetail> => {
  const response = await cookieFetch<TAdminOrderDetailResponse>(`/admin/orders/${orderId}?status=${status}`);
  return response.data;
};

export const startOrderPayment = async (orderId: string): Promise<TStartOrderPaymentData> => {
  const response = await cookieFetch<TStartOrderPaymentResponse>(`/admin/orders/${orderId}/payment`, {
    method: "POST",
  });
  return response.data;
};
