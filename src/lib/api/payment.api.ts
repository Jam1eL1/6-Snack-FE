import {
  TClaimPaymentResponse,
  TCompletePaymentResponse,
  TFailPaymentBody,
  TFailPaymentResponse,
  TGetPaymentResponse,
  TPaymentDetail,
  TRetryPaymentResponse,
} from "@/types/payment.types";
import { cookieFetch } from "./fetchClient.api";
// GET  /admin/payments/:paymentId

export const getPayment = async (paymentId: number): Promise<TPaymentDetail> => {
  const response = await cookieFetch<TGetPaymentResponse>(`/admin/payments/${paymentId}`);
  return response.data;
};
// POST /admin/payments/:paymentId/claim

export const claimPayment = async (paymentId: number): Promise<TPaymentDetail> => {
  const response = await cookieFetch<TClaimPaymentResponse>(`/admin/payments/${paymentId}/claim`, {
    method: "POST",
  });
  return response.data;
};
// POST /admin/payments/:paymentId/retry
export const retryPayment = async (paymentId: number): Promise<TPaymentDetail> => {
  const response = await cookieFetch<TRetryPaymentResponse>(`/admin/payments/${paymentId}/retry`, {
    method: "POST",
  });
  return response.data;
};
// POST /admin/payments/:paymentId/fail
export const failPayment = async (paymentId: number, body: TFailPaymentBody): Promise<TPaymentDetail> => {
  const response = await cookieFetch<TFailPaymentResponse>(`/admin/payments/${paymentId}/fail`, {
    method: "POST",
    body: JSON.stringify(body),
  });
  return response.data;
};

// POST /admin/payments/:paymentId/complete
export const completePayment = async (paymentId: number): Promise<TPaymentDetail> => {
  const response = await cookieFetch<TCompletePaymentResponse>(`/admin/payments/${paymentId}/complete`, {
    method: "POST",
  });
  return response.data;
};
