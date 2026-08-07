import type {
  TAdminOrdersData,
  TAdminOrdersQueryParams,
  TAdminOrdersResponse,
  TCreateOrderData,
  TCreateOrderResponse,
  TOrderNowResponse,
  TOrderRequestBody,
  TStartOrderPaymentData,
} from "@/types/order.types";
import { cookieFetch } from "./fetchClient.api";

export const getAdminOrders = async ({
  status,
  offset,
  limit,
  orderBy,
}: TAdminOrdersQueryParams): Promise<TAdminOrdersData> => {
  const page = Math.floor(offset / limit) + 1;
  const params = new URLSearchParams({
    status,
    page: String(page),
    limit: String(limit),
    orderBy,
  });
  const response = await cookieFetch<TAdminOrdersResponse>(`/admin/orders?${params.toString()}`);
  return response.data;
};

export const createOrder = async ({ requestMessage, cartItemIds }: TOrderRequestBody): Promise<TCreateOrderData> => {
  const response = await cookieFetch<TCreateOrderResponse>("/orders", {
    method: "POST",
    body: JSON.stringify({ requestMessage, cartItemIds }),
  });

  return response.data;
};

// Instant purchase from cart - admins only
export const orderNow = async (cartItemIds: number[]): Promise<TStartOrderPaymentData> => {
  const response = await cookieFetch<TOrderNowResponse>("/admin/orders/instant", {
    method: "POST",
    body: JSON.stringify({ cartItemIds }),
  });

  return response.data;
};
