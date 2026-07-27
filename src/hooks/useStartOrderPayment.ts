import { startOrderPayment } from "@/lib/api/orderManage.api";
import { ApiError } from "@/lib/api/api.errors";
import { queryKeys } from "@/lib/queryKeys";
import { TStartOrderPaymentData } from "@/types/order.types";
import { useMutation, useQueryClient } from "@tanstack/react-query";

type TUseStartOrderPaymentOptions = {
  onStartOrderPaymentSuccess?: (data: TStartOrderPaymentData) => void;
  onStartOrderPaymentError?: (error: Error) => void;
};

// Start Payment
export const useStartOrderPayment = ({
  onStartOrderPaymentSuccess,
  onStartOrderPaymentError,
}: TUseStartOrderPaymentOptions = {}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (orderId: string) => startOrderPayment(orderId),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.adminOrders.all,
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.adminOrders.detail(data.orderId, "pending"),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.pendingOrders.all,
      });
      onStartOrderPaymentSuccess?.(data);
    },
    onError: (error, orderId) => {
      if (error instanceof ApiError && error.status === 409) {
        queryClient.invalidateQueries({
          queryKey: queryKeys.adminOrders.all,
        });
        queryClient.invalidateQueries({
          queryKey: queryKeys.adminOrders.detail(orderId, "pending"),
        });
        queryClient.invalidateQueries({
          queryKey: queryKeys.pendingOrders.all,
        });
      }
      onStartOrderPaymentError?.(error);
    },
  });
};
