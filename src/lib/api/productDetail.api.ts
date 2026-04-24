import type { TProduct } from "@/types/productDetail.types";
import { cookieFetch } from "./fetchClient.api";

/**
 * @JJOBO
 * 1. Consider consolidating this into product.api.ts
 */

export async function getProductById(productId: number): Promise<TProduct> {
  return cookieFetch<TProduct>(`/products/${productId}`);
}
