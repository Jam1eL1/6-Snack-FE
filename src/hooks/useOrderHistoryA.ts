import type { TOrderSort } from "@/types/order.types";
import { useBudgets } from "./useBudgets";
import { useAdminOrders } from "./useAdminOrders";

type TUseOrderHistoryParams = {
  offset: number;
  limit: number;
  orderBy: TOrderSort;
};
export const useOrderHistoryA = ({ offset, limit, orderBy }: TUseOrderHistoryParams) => {
  const ordersQuery = useAdminOrders({
    status: "approved",
    offset,
    limit,
    orderBy,
  });

  const budgetQuery = useBudgets();
  return {
    ordersQuery,
    budgetQuery,
  };
};
