import { useQuery } from "@tanstack/react-query";
import { getAdminOrders } from "@/lib/api/order.api";
import { queryKeys } from "@/lib/queryKeys";

type TUseAdminOrdersParams = {
  status: "pending" | "approved";
  offset?: number;
  limit?: number;
  orderBy?: string;
};

export const useAdminOrders = ({ status }: TUseAdminOrdersParams) => {
  return useQuery({
    queryKey: queryKeys.adminOrders.list(status), // Exclude pagination and sorting to reuse the full cached list.
    queryFn: () => getAdminOrders({ status, offset: 0, limit: 100, orderBy: "latest" }), // Fetch the full list once.
    staleTime: 5 * 60 * 1000, // Keep cached data fresh for five minutes.
    gcTime: 10 * 60 * 1000, // Retain inactive data for ten minutes.
  });
};
