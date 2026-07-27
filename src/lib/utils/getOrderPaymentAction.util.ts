import type { TAdminOrderPaymentClaim, TAdminOrderPaymentSummary } from "@/types/order.types";

type TGetOrderPaymentActionParams = {
  payment: TAdminOrderPaymentSummary;
  paymentClaim: TAdminOrderPaymentClaim;
};

export type TOrderPaymentAction = "START" | "RETRY" | "OPEN" | "BLOCKED" | "PAID";

export const isOrderPaymentProcessingByAnotherAdmin = ({
  payment,
  paymentClaim,
}: TGetOrderPaymentActionParams) => {
  return payment?.status === "PENDING" && paymentClaim.status === "PROCESSING" && !paymentClaim.isMine;
};

export const getOrderPaymentAction = ({
  payment,
  paymentClaim,
}: TGetOrderPaymentActionParams): TOrderPaymentAction => {
  if (!payment) return "START";
  if (payment.status === "FAILED") return "RETRY";
  if (payment.status === "PAID") return "PAID";
  if (paymentClaim.status === "AVAILABLE") return "START";

  return paymentClaim.isMine ? "OPEN" : "BLOCKED";
};
