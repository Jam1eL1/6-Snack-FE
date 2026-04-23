import { TAdminOrdersResponse, TOrderNowResponse, TOrderRequestBody, TOrderResponse } from "@/types/order.types";
import { cookieFetch } from "./fetchClient.api";

// Retrieve admin order history
export const getAdminOrders = ({
  status,
  offset = 0,
  limit = 4,
  orderBy = "latest",
}: {
  status: "pending" | "approved";
  offset?: number;
  limit?: number;
  orderBy?: string;
}): Promise<TAdminOrdersResponse> => {
  const params = new URLSearchParams({
    status,
    offset: String(offset),
    limit: String(limit),
    orderBy,
  });
  return cookieFetch<TAdminOrdersResponse>(`/admin/orders?${params.toString()}`);
};

export const createOrder = ({ requestMessage, cartItemIds }: TOrderRequestBody): Promise<TOrderResponse> => {
  return cookieFetch<TOrderResponse>("/orders", {
    method: "POST",
    body: JSON.stringify({ requestMessage, cartItemIds }),
  });
};

// Instant purchase from cart - admins only
export const orderNow = (cartItemIds: number[]): Promise<TOrderNowResponse> => {
  return cookieFetch<TOrderNowResponse>("/admin/orders/instant", {
    method: "POST",
    body: JSON.stringify({ cartItemIds }),
  });
};
