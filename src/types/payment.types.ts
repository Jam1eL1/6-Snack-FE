export type TPaymentStatus = "PENDING" | "PAID" | "FAILED";

export type TPaymentOrder = {
  id: string;
  companyId: number;
  userId: string;
  status: "PENDING" | "APPROVED" | "REJECTED" | "CANCELED" | "INSTANT_APPROVED";
  paymentAssigneeId: string | null;
  paymentClaimExpiresAt: string | null;
};

export type TPaymentClaim = {
  isActive: boolean;
  isMine: boolean;
};

export type TPaymentDetail = {
  id: number;
  orderId: string;
  authorizedPayerId: string;
  amount: number;
  status: TPaymentStatus;
  failureReason: string | null;
  createdAt: string;
  updatedAt: string;
  completedAt: string | null;
  order: TPaymentOrder;
  claim: TPaymentClaim;
};

export type TPaymentResponse = {
  message: string;
  data: TPaymentDetail;
};

export type TGetPaymentResponse = TPaymentResponse;

export type TClaimPaymentResponse = TPaymentResponse;

export type TRetryPaymentResponse = TPaymentResponse;

export type TCompletePaymentResponse = TPaymentResponse;

export type TFailPaymentBody = {
  failureReason: string;
};

export type TFailPaymentResponse = TPaymentResponse;
