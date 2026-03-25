import { TGetCartItemsParams, TGetCartItemsResponse } from "@/types/cart.types";
import { cookieFetch } from "./fetchClient.api";

// 장바구니 조회
export const getCartItems = async (params: TGetCartItemsParams = {}): Promise<TGetCartItemsResponse> => {
  const queryString = new URLSearchParams(params);

  return cookieFetch(`/cart?${queryString.toString()}`);
};

// 장바구니 상품 선택 / 해제
export const toggleCheckItem = async (cartItemId: number, isChecked: boolean): Promise<void> => {
  return cookieFetch(`/cart/${cartItemId}/check`, {
    method: "PATCH",
    body: JSON.stringify({ isChecked }),
  });
};

// 장바구니 전체 선택 / 전체 해제
export const toggleCheckAllItems = async (isChecked: boolean): Promise<void> => {
  return cookieFetch("/cart/check", {
    method: "PATCH",
    body: JSON.stringify({ isChecked }),
  });
};

// 장바구니 선택된 상품 삭제
export const deleteSelectedItems = async (cartItemIds: number[]): Promise<void> => {
  return cookieFetch("/cart", {
    method: "DELETE",
    body: JSON.stringify({ itemIds: cartItemIds }),
  });
};

// 장바구니 수량 선택
export const updateItemQuantity = async (cartItemId: number, quantity: number): Promise<void> => {
  return cookieFetch(`/cart/${cartItemId}/quantity`, {
    method: "PATCH",
    body: JSON.stringify({ quantity }),
  });
};
