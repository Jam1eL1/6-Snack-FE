import { useRetryPayment } from "@/hooks/usePayment";
import { useStartOrderPayment } from "@/hooks/useStartOrderPayment";
import { getOrderPaymentAction } from "@/lib/utils/getOrderPaymentAction.util";
import type { TAdminOrderPaymentFields } from "@/types/order.types";

type TProcessOrderPaymentOrder = TAdminOrderPaymentFields & {
  id: string;
};

type TUseProcessOrderPaymentOptions = {
  onPaymentReady?: (paymentId: number) => void;
  onPaymentBlocked?: () => void;
  onPaymentAlreadyPaid?: () => void;
  onProcessOrderPaymentError?: (error: Error) => void;
};

export const useProcessOrderPayment = ({
  onPaymentReady,
  onPaymentBlocked,
  onPaymentAlreadyPaid,
  onProcessOrderPaymentError,
}: TUseProcessOrderPaymentOptions = {}) => {
  const startOrderPaymentMutation = useStartOrderPayment({
    onStartOrderPaymentSuccess: (data) => {
      onPaymentReady?.(data.paymentId);
    },
    onStartOrderPaymentError: onProcessOrderPaymentError,
  });
  const retryPaymentMutation = useRetryPayment({
    onRetryPaymentSuccess: (payment) => {
      onPaymentReady?.(payment.id);
    },
    onRetryPaymentError: onProcessOrderPaymentError,
  });

  const processOrderPayment = (order: TProcessOrderPaymentOrder) => {
    const action = getOrderPaymentAction({
      payment: order.payment,
      paymentClaim: order.paymentClaim,
    });

    if (action === "START") {
      startOrderPaymentMutation.mutate(order.id);
      return;
    }

    if (action === "RETRY") {
      if (!order.payment) {
        onProcessOrderPaymentError?.(new Error("Payment not found."));
        return;
      }

      retryPaymentMutation.mutate(order.payment.id);
      return;
    }

    if (action === "OPEN") {
      if (!order.payment) {
        onProcessOrderPaymentError?.(new Error("Payment not found."));
        return;
      }

      onPaymentReady?.(order.payment.id);
      return;
    }

    if (action === "BLOCKED") {
      onPaymentBlocked?.();
      return;
    }

    onPaymentAlreadyPaid?.();
  };

  return {
    processOrderPayment,
    isPending: startOrderPaymentMutation.isPending || retryPaymentMutation.isPending,
  };
};
