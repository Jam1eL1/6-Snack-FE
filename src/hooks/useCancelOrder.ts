import { useMutation, useQueryClient } from "@tanstack/react-query";
import { cancelOrder } from "@/lib/api/orderHistory.api";
import { queryKeys } from "@/lib/queryKeys";

export const useCancelOrder = ({
  onCancelSuccess,
  onCancelError,
}: {
  onCancelSuccess?: (orderId: string) => void;
  onCancelError?: (error: Error) => void;
} = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (orderId: string) => cancelOrder(orderId),
    onSuccess: (_, orderId) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.myOrders.all });
      onCancelSuccess?.(orderId);
    },
    onError: (error) => {
      onCancelError?.(error);
    },
  });
};
