import { useMutation, useQueryClient } from "@tanstack/react-query";
import { cancelOrder } from "@/lib/api/cancelOrder.api";

export const useCancelOrder = (onSuccessCallback: (orderId: number) => void) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (orderId: number) => cancelOrder(orderId),
    onSuccess: (_, orderId) => {
      onSuccessCallback(orderId);
      queryClient.invalidateQueries({ queryKey: ["my-orders"] });
    },
    onError: () => {
      alert("요청 취소 실패");
    },
  });
};
