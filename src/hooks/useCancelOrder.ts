import { useMutation, useQueryClient } from "@tanstack/react-query";
import { cancelOrder } from "@/lib/api/orderHistory.api";
import { MY_ORDERS_QUERY_KEY } from "./useMyOrders";

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
      queryClient.invalidateQueries({ queryKey: MY_ORDERS_QUERY_KEY });
      onCancelSuccess?.(orderId);
    },
    onError: (error) => {
      onCancelError?.(error);
    },
  });
};
