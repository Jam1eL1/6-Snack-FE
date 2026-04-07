import { TAdminOrdersResponse, TOrderNowResponse, TOrderRequestBody, TOrderResponse } from "@/types/order.types";
import { cookieFetch } from "./fetchClient.api";

// 관리자 구매내역 조회 API
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

// 구매 요청
export const createOrder = ({ requestMessage, cartItemIds }: TOrderRequestBody): Promise<TOrderResponse> => {
  return cookieFetch<TOrderResponse>("/orders", {
    method: "POST",
    body: JSON.stringify({ requestMessage, cartItemIds }),
  });
};

// 즉시 구매
export const orderNow = (cartItemIds: number[]): Promise<TOrderNowResponse> => {
  return cookieFetch<TOrderNowResponse>("/admin/orders/instant", {
    method: "POST",
    body: JSON.stringify({ cartItemIds }),
  });
};
