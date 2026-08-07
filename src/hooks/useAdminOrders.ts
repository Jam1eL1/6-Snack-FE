import { useQuery } from "@tanstack/react-query";
import { getAdminOrders } from "@/lib/api/order.api";
import { queryKeys } from "@/lib/queryKeys";
import type { TAdminOrdersQueryParams } from "@/types/order.types";

export const useAdminOrders = (params: TAdminOrdersQueryParams) => {
  return useQuery({
    queryKey: queryKeys.adminOrders.list(params),
    queryFn: () => getAdminOrders(params),
    staleTime: 5 * 60 * 1000, // Keep cached data fresh for five minutes.
    gcTime: 10 * 60 * 1000, // Retain inactive data for ten minutes.
  });
};
