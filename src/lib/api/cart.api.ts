import { TAddToCartResponse, TGetCartItemsParams, TGetCartItemsResponse } from "@/types/cart.types";
import { cookieFetch } from "./fetchClient.api";

export const addToCart = (productId: number, quantity: number): Promise<TAddToCartResponse> => {
  return cookieFetch<TAddToCartResponse>("/cart", {
    method: "POST",
    body: JSON.stringify({ productId, quantity }),
  });
};

// Fetch cart items
export const getCartItems = async (params: TGetCartItemsParams = {}): Promise<TGetCartItemsResponse> => {
  const queryString = new URLSearchParams(params).toString();

  return cookieFetch<TGetCartItemsResponse>(queryString ? `/cart?${queryString}` : "/cart");
};

// Select or deselect a cart item
export const toggleCheckItem = async (cartItemId: number, isChecked: boolean): Promise<void> => {
  return cookieFetch<void>(`/cart/${cartItemId}/check`, {
    method: "PATCH",
    body: JSON.stringify({ isChecked }),
  });
};

// Select or deselect all cart items
export const toggleCheckAllItems = async (isChecked: boolean): Promise<void> => {
  return cookieFetch<void>("/cart/check", {
    method: "PATCH",
    body: JSON.stringify({ isChecked }),
  });
};

// Delete selected cart items
export const deleteSelectedItems = async (cartItemIds: number[]): Promise<void> => {
  return cookieFetch<void>("/cart", {
    method: "DELETE",
    body: JSON.stringify({ itemIds: cartItemIds }),
  });
};

// Update cart item quantity
export const updateItemQuantity = async (cartItemId: number, quantity: number): Promise<void> => {
  return cookieFetch<void>(`/cart/${cartItemId}/quantity`, {
    method: "PATCH",
    body: JSON.stringify({ quantity }),
  });
};
