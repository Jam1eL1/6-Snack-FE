import { TOrderResponse, TOrderSummary, TOrderWithoutStatus } from "@/types/order.types";
import { cookieFetch } from "./fetchClient.api";

export const getPendingOrders = async ({
  offset = 0,
  limit = 10,
  orderBy = "latest",
}: {
  offset?: number;
  limit?: number;
  orderBy?: string;
}): Promise<{ orders: TOrderSummary[]; meta: { totalCount: number; currentPage: number; totalPages: number } }> => {
  const page = Math.floor(offset / limit) + 1;
  const query = `?status=pending&page=${page}&limit=${limit}&orderBy=${orderBy}`;
  const res = (await cookieFetch(`/admin/orders${query}`)) as {
    orders: TOrderSummary[];
    meta: { totalCount: number; currentPage: number; totalPages: number };
  };
  return res;
};

export const getPendingOrderDetail = async (orderId: string): Promise<TOrderResponse> => {
  const res = await cookieFetch(`/admin/orders/${orderId}?status=pending`);
  return res as TOrderResponse;
};

export const getOrderDetailWithoutStatus = async (orderId: string): Promise<TOrderWithoutStatus> => {
  const res = await cookieFetch(`/admin/orders/${orderId}`);
  return res as TOrderWithoutStatus;
};

export const updateOrderStatus = async ({
  orderId,
  status,
  adminMessage,
}: {
  orderId: string;
  status: "APPROVED" | "REJECTED";
  adminMessage?: string;
}) => {
  const res = await cookieFetch(`/admin/orders/${orderId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ status, adminMessage }),
  });

  return res;
};
