import { useQuery } from "@tanstack/react-query";
import { getProductById } from "@/lib/api/product.api";
import type { TProduct } from "@/types/productDetail.types";

export const useProductDetail = (productId: number) => {
  return useQuery<TProduct>({
    queryKey: ["product", productId],
    queryFn: () => getProductById(productId),
    enabled: !!productId, // productId 있을 때만 실행
  });
};
