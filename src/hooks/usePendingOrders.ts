import { useQuery } from "@tanstack/react-query";
import { getPendingOrders } from "@/lib/api/orderManage.api";
import { queryKeys } from "@/lib/queryKeys";
import { TOrderSummary } from "@/types/order.types";

type TUsePendingOrdersParams = {
  offset: number;
  limit: number;
  orderBy: string;
};

type TPendingOrdersResponse = {
  orders: TOrderSummary[];
  meta: {
    totalCount: number;
    currentPage: number;
    totalPages: number;
  };
};

export const usePendingOrders = ({ offset, limit, orderBy }: TUsePendingOrdersParams) => {
  return useQuery<TPendingOrdersResponse>({
    queryKey: queryKeys.pendingOrders.list({ offset, limit, orderBy }),
    queryFn: () => getPendingOrders({ offset, limit, orderBy }),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};
