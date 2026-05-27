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
    queryKey: queryKeys.adminOrders.list(status), // offset, limit, orderBy 제거하여 캐시 활용
    queryFn: () => getAdminOrders({ status, offset: 0, limit: 100, orderBy: "latest" }), // 모든 데이터를 한 번에 가져옴
    staleTime: 5 * 60 * 1000, // 5분간 캐시된 데이터 사용
    gcTime: 10 * 60 * 1000, // 10분간 메모리에 보관
  });
};
