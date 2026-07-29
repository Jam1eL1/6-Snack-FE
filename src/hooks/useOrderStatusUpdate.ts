import { updateOrderStatus } from "@/lib/api/orderManage.api";
import { queryKeys } from "@/lib/queryKeys";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useOrderStatusUpdate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateOrderStatus,
    onSuccess: () => {
      // Invalidate order caches so lists show the updated status immediately.
      queryClient.invalidateQueries({ queryKey: queryKeys.adminOrders.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.adminOrders.detailPrefix });
      queryClient.invalidateQueries({ queryKey: queryKeys.pendingOrders.all });
    },
  });
};
