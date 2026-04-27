import { useMutation, useQueryClient } from "@tanstack/react-query";
import { cancelOrder } from "@/lib/api/orderHistory.api";

export const useCancelOrder = ({
  onSuccess,
  onError,
}: {
  onSuccess: (orderId: string) => void;
  onError?: (error: Error) => void;
}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (orderId: string) => cancelOrder(orderId),
    onSuccess: (_, orderId) => {
      onSuccess(orderId);
      queryClient.invalidateQueries({ queryKey: ["my-orders"] });
    },
    onError: (error) => {
      onError?.(error);
    },
  });
};
