import {
  TAdminOrdersData,
  TAdminOrdersResponse,
  TCreateOrderData,
  TCreateOrderResponse,
  TOrderNowResponse,
  TOrderRequestBody,
  TOrderSort,
} from "@/types/order.types";
import { cookieFetch } from "./fetchClient.api";

// Retrieve admin order history
type TGetAdminOrdersParams = {
  status: "pending" | "approved";
  offset?: number;
  limit?: number;
  orderBy?: TOrderSort;
};
export const getAdminOrders = async ({
  status,
  offset = 0,
  limit = 4,
  orderBy = "latest",
}: TGetAdminOrdersParams): Promise<TAdminOrdersData> => {
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
export const orderNow = (cartItemIds: number[]): Promise<TOrderNowResponse> => {
  return cookieFetch<TOrderNowResponse>("/admin/orders/instant", {
    method: "POST",
    body: JSON.stringify({ cartItemIds }),
  });
};
