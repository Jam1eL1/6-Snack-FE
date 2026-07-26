import { completePayment, failPayment, getPayment, retryPayment } from "@/lib/api/payment.api";
import { queryKeys } from "@/lib/queryKeys";
import { TFailPaymentBody, TPaymentDetail } from "@/types/payment.types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

type TUseRetryPaymentOptions = {
  onRetryPaymentSuccess?: (data: TPaymentDetail) => void;
  onRetryPaymentError?: (error: Error) => void;
};

type TUseFailPaymentOptions = {
  onFailPaymentSuccess?: (data: TPaymentDetail) => void;
  onFailPaymentError?: (error: Error) => void;
};

type TUseCompletePaymentOptions = {
  onCompletePaymentSuccess?: (data: TPaymentDetail) => void;
  onCompletePaymentError?: (error: Error) => void;
};

type TFailPaymentVariables = {
  paymentId: number;
  body: TFailPaymentBody;
};

// Get Payment
export const usePayment = (paymentId: number) => {
  const isValidPaymentId = Number.isInteger(paymentId) && paymentId > 0;
  return useQuery({
    queryKey: queryKeys.payments.detail(paymentId),
    queryFn: () => getPayment(paymentId),
    enabled: isValidPaymentId,
  });
};
// Retry Payment
export const useRetryPayment = ({ onRetryPaymentSuccess, onRetryPaymentError }: TUseRetryPaymentOptions = {}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (paymentId: number) => retryPayment(paymentId),
    onSuccess: (data) => {
      queryClient.setQueryData(queryKeys.payments.detail(data.id), data);
      queryClient.invalidateQueries({
        queryKey: queryKeys.adminOrders.all,
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.adminOrders.detail(data.orderId, "pending"),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.pendingOrders.all,
      });
      onRetryPaymentSuccess?.(data);
    },
    onError: (error) => {
      onRetryPaymentError?.(error);
    },
  });
};
// Fail Payment
export const useFailPayment = ({ onFailPaymentSuccess, onFailPaymentError }: TUseFailPaymentOptions = {}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ paymentId, body }: TFailPaymentVariables) => failPayment(paymentId, body),
    onSuccess: (data) => {
      queryClient.setQueryData(queryKeys.payments.detail(data.id), data);
      queryClient.invalidateQueries({
        queryKey: queryKeys.adminOrders.all,
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.adminOrders.detail(data.orderId, "pending"),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.pendingOrders.all,
      });
      onFailPaymentSuccess?.(data);
    },
    onError: (error) => {
      onFailPaymentError?.(error);
    },
  });
};
// Complete Payment
export const useCompletePayment = ({
  onCompletePaymentSuccess,
  onCompletePaymentError,
}: TUseCompletePaymentOptions = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (paymentId: number) => completePayment(paymentId),
    onSuccess: (data) => {
      queryClient.setQueryData(queryKeys.payments.detail(data.id), data);
      queryClient.invalidateQueries({
        queryKey: queryKeys.adminOrders.all,
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.adminOrders.detailPrefix,
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.pendingOrders.all,
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.myOrders.all,
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.budgets.all,
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.cartItems.all,
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.products.all,
      });
      onCompletePaymentSuccess?.(data);
    },
    onError: (error) => {
      onCompletePaymentError?.(error);
    },
  });
};
