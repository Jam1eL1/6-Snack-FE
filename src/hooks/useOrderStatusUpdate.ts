import { updateOrderStatus } from "@/lib/api/orderManage.api";
import { queryKeys } from "@/lib/queryKeys";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useOrderStatusUpdate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateOrderStatus,
    onSuccess: () => {
      // 주문 목록 캐시 무효화 함 (주문목록 페이지로 이동시 바로 업데이트 된것 보여줌))
      queryClient.invalidateQueries({ queryKey: queryKeys.adminOrders.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.adminOrders.detailPrefix });
      queryClient.invalidateQueries({ queryKey: queryKeys.pendingOrders.all });
    },
  });
};
