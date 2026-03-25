import { TOrderNowResponse, TOrderRequestBody, TOrderResponse } from "@/types/order.types";
import { cookieFetch } from "./fetchClient.api";

// 관리자 구매내역 조회 API
export const getAdminOrders = async ({
  status,
  offset = 0,
  limit = 4,
  orderBy = "latest",
}: {
  status: "pending" | "approved";
  offset?: number;
  limit?: number;
  orderBy?: string;
}) => {
  const params = new URLSearchParams({
    status,
    offset: String(offset),
    limit: String(limit),
    orderBy,
  });
  return cookieFetch(`/admin/orders?${params.toString()}`);
};

// 구매 요청
export const createOrder = async ({ requestMessage, cartItemIds }: TOrderRequestBody): Promise<TOrderResponse> => {
  return cookieFetch("/orders", {
    method: "POST",
    body: JSON.stringify({ requestMessage, cartItemIds }),
  });
};

// 즉시 구매
export const orderNow = async (cartItemIds: number[]): Promise<TOrderNowResponse> => {
  return cookieFetch("/admin/orders/instant", {
    method: "POST",
    body: JSON.stringify({ cartItemIds }),
  });
};
