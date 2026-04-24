import { TAddFavoriteProductResponse, TGetFavoriteProductResponse, TMyFavoritesParams } from "@/types/favorite.types";
import { cookieFetch } from "./fetchClient.api";

export const getFavorites = async (params: TMyFavoritesParams): Promise<TGetFavoriteProductResponse> => {
  const queryString = new URLSearchParams(params);

  return cookieFetch<TGetFavoriteProductResponse>(`/favorites?${queryString.toString()}`);
};

export const createFavorite = async (productId: string): Promise<TAddFavoriteProductResponse> => {
  return cookieFetch<TAddFavoriteProductResponse>(`/favorites/${productId}`, {
    method: "POST",
  });
};

export const deleteFavorite = async (productId: string): Promise<void> => {
  return cookieFetch<void>(`/favorites/${productId}`, {
    method: "DELETE",
  });
};
