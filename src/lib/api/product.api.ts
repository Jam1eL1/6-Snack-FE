import { TMyProductsParams, TMyProductsResponse, TProduct } from "@/types/product.types";
import { cookieFetch } from "./fetchClient.api";

type TGetProductsResponse = {
  items: TProduct[];
  nextCursor?: number;
};

type TCreateProductResponse = {
  id: number;
  name: string;
  price: number;
  imageUrl: string;
  linkUrl: string;
  categoryId: number;
  creatorId: string;
  createdAt: string;
  updatedAt: string;
};

// 상품 목록 조회
export const getProducts = async (params?: {
  category?: number;
  sort?: "latest" | "popular" | "low" | "high";
  cursor?: number;
  limit?: number;
}): Promise<TGetProductsResponse> => {
  const searchParams = new URLSearchParams();

  if (params?.category) searchParams.append("category", params.category.toString());
  if (params?.sort) searchParams.append("sort", params.sort);
  if (params?.cursor) searchParams.append("cursor", params.cursor.toString());
  if (params?.limit) searchParams.append("limit", params.limit.toString());

  const queryString = searchParams.toString();
  const url = queryString ? `/products?${queryString}` : "/products";

  return cookieFetch<TGetProductsResponse>(url);
};

// 내가 등록한 상품 조회
export const getMyProducts = async (params: TMyProductsParams): Promise<TMyProductsResponse> => {
  const queryString = new URLSearchParams(params);

  return cookieFetch<TMyProductsResponse>(`/my/products?${queryString.toString()}`);
};

// 상품 생성
export const createProduct = (formData: FormData): Promise<TCreateProductResponse> => {
  return cookieFetch<TCreateProductResponse>("/products", {
    method: "POST",
    body: formData,
  });
};
