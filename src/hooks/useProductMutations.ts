import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createProduct, getProducts } from "@/lib/api/product.api";

// Product creation mutation
export const useCreateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createProduct,
    onSuccess: () => {
      // Invalidate the product list query so it refetches.
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
};

// Product list query
export const useGetProducts = (params?: {
  category?: number;
  sort?: "latest" | "popular" | "low" | "high";
  cursor?: number;
  limit?: number;
}) => {
  return useQuery({
    queryKey: ["products", params],
    queryFn: () => getProducts(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};
