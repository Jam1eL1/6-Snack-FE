import { useMutation, useQueryClient } from "@tanstack/react-query";
import { cancelOrder } from "@/lib/api/orderHistory.api";

export const useCancelOrder = (onSuccessCallback: (orderId: string) => void) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (orderId: string) => cancelOrder(orderId),
    onSuccess: (_, orderId) => {
      onSuccessCallback(orderId);
      queryClient.invalidateQueries({ queryKey: ["my-orders"] });
    },
    onError: () => {
      alert("요청 취소 실패");
    },
  });
};
