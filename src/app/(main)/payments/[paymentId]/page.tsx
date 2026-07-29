"use client";

import { ArrowLeft, CreditCard, LockKeyhole, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCompletePayment, useFailPayment, usePayment } from "@/hooks/usePayment";
import { formatCurrency } from "@/lib/utils/currency.util";
import { ApiError } from "@/lib/api/api.errors";
import { paymentCardSchema, TPaymentCardFormData } from "@/lib/schemas/payment.schema";
import Toast from "@/components/common/Toast";
import InvalidPaymentState from "./_components/InvalidPaymentState";
import PaymentLoadingState from "./_components/PaymentLoadingState";
import PaymentPageState from "./_components/PaymentPageState";
import { SessionExpiredError } from "@/lib/api/auth.errors";
import { useEffect, useRef, useState } from "react";

const fieldClassName =
  "h-11 w-full rounded-md border border-primary-200 bg-white px-3 text-sm text-primary-950 outline-none transition placeholder:text-primary-400 focus-within:border-primary-700";

const SUCCESSFUL_DUMMY_CARD_NUMBER = "0000000000000000";
const FAILED_DUMMY_CARD_NUMBER = "1111111111111111";

const formatCardNumber = (value: string) => {
  return value
    .replace(/\D/g, "")
    .slice(0, 16)
    .replace(/(\d{4})(?=\d)/g, "$1 ");
};

const formatCardExpiry = (value: string) => {
  const digits = value.replace(/\D/g, "").slice(0, 4);

  if (digits.length <= 2) return digits;

  return `${digits.slice(0, 2)} / ${digits.slice(2)}`;
};

export default function PaymentPage() {
  const params = useParams<{ paymentId: string }>();
  const router = useRouter();
  const paymentId = Number(params.paymentId);

  const { data: payment, isLoading, error } = usePayment(paymentId);
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isValid },
  } = useForm<TPaymentCardFormData>({
    resolver: zodResolver(paymentCardSchema),
    mode: "onChange",
    defaultValues: {
      cardholderName: "",
      cardNumber: "",
      cardExpiry: "",
      cardCvc: "",
    },
  });
  const [toast, setToast] = useState<{
    isVisible: boolean;
    text: string;
    variant: "success" | "error";
  }>({
    isVisible: false,
    text: "",
    variant: "error",
  });
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showToast = (text: string, variant: "success" | "error") => {
    if (toastTimerRef.current) {
      clearTimeout(toastTimerRef.current);
    }

    setToast({ isVisible: true, text, variant });
    toastTimerRef.current = setTimeout(() => {
      setToast((currentToast) => ({
        ...currentToast,
        isVisible: false,
      }));
      toastTimerRef.current = null;
    }, 3000);
  };

  useEffect(() => {
    return () => {
      if (toastTimerRef.current) {
        clearTimeout(toastTimerRef.current);
      }
    };
  }, []);

  const handlePaymentMutationError = (error: Error, fallbackMessage: string) => {
    if (error instanceof SessionExpiredError) return;

    if (error instanceof ApiError && error.status === 409) {
      showToast("Another admin is currently processing this order.", "error");
      return;
    }

    showToast(fallbackMessage, "error");
  };

  const completePaymentMutation = useCompletePayment({
    onCompletePaymentSuccess: () => {
      router.push("/order-history");
    },
    onCompletePaymentError: (error) => {
      handlePaymentMutationError(error, "Payment could not be completed.");
    },
  });
  const failPaymentMutation = useFailPayment({
    onFailPaymentError: (error) => {
      handlePaymentMutationError(error, "Payment failure could not be recorded.");
    },
  });
  const isValidPaymentId = paymentId > 0 && Number.isInteger(paymentId);
  const paymentToast = <Toast text={toast.text} variant={toast.variant} isVisible={toast.isVisible} />;

  if (!isValidPaymentId) {
    return <InvalidPaymentState onReturnToOrders={() => router.push("/order-manage")} />;
  }

  const populateTestCard = (cardNumber: string) => {
    const expiryDate = new Date();
    expiryDate.setFullYear(expiryDate.getFullYear() + 2);
    const expiryInput = `${String(expiryDate.getMonth() + 1).padStart(2, "0")} / ${String(
      expiryDate.getFullYear(),
    ).slice(-2)}`;
    const cvcInput = String(Math.floor(Math.random() * 900) + 100);
    const cardFormData: TPaymentCardFormData = {
      cardholderName: "Test User",
      cardNumber,
      cardExpiry: expiryInput,
      cardCvc: cvcInput,
    };
    setValue("cardholderName", cardFormData.cardholderName, {
      shouldDirty: true,
      shouldValidate: true,
    });

    setValue("cardNumber", cardFormData.cardNumber, {
      shouldDirty: true,
      shouldValidate: true,
    });

    setValue("cardExpiry", cardFormData.cardExpiry, {
      shouldDirty: true,
      shouldValidate: true,
    });

    setValue("cardCvc", cardFormData.cardCvc, {
      shouldDirty: true,
      shouldValidate: true,
    });
  };
  const handleValidSubmit = (formData: TPaymentCardFormData) => {
    const normalizedCardNumber = formData.cardNumber.replace(/\s/g, "");

    if (normalizedCardNumber === SUCCESSFUL_DUMMY_CARD_NUMBER) {
      completePaymentMutation.mutate(paymentId);
      return;
    }

    if (normalizedCardNumber === FAILED_DUMMY_CARD_NUMBER) {
      failPaymentMutation.mutate({
        paymentId,
        body: {
          failureReason: "Dummy payment was declined.",
        },
      });
      return;
    }

    showToast("Use one of the dummy card numbers shown below.", "error");
  };

  const isProcessingPayment = completePaymentMutation.isPending || failPaymentMutation.isPending;

  if (isLoading) {
    return <PaymentLoadingState />;
  }

  if (error) {
    const isNotFound = error instanceof ApiError && error.status === 404;

    return (
      <>
        {paymentToast}
        <PaymentPageState
          eyebrow={isNotFound ? "Payment Not Found" : "Unable to Load Payment"}
          title={isNotFound ? "This payment could not be found" : "Something went wrong"}
          description={
            isNotFound
              ? "Go to Manage Orders and select a purchase request to start or resume payment."
              : "The payment could not be loaded. Go to Manage Orders and try again."
          }
          actionLabel="Go to Manage Orders"
          onAction={() => router.push("/order-manage")}
        />
      </>
    );
  }

  if (!payment) {
    return (
      <>
        {paymentToast}
        <PaymentPageState
          eyebrow="Payment Not Found"
          title="Payment data is unavailable"
          description="Go to Manage Orders and select a purchase request to start or resume payment."
          actionLabel="Go to Manage Orders"
          onAction={() => router.push("/order-manage")}
        />
      </>
    );
  }

  if (payment.status === "PAID") {
    return (
      <>
        {paymentToast}
        <PaymentPageState
          eyebrow="Payment Complete"
          title="Payment completed successfully"
          description="The order has been approved and the payment is complete."
          actionLabel="View Order History"
          onAction={() => router.push("/order-history")}
          variant="success"
        />
      </>
    );
  }
  if (payment.status === "FAILED") {
    return (
      <>
        {paymentToast}
        <PaymentPageState
          eyebrow="Payment Failed"
          title="This payment attempt was unsuccessful"
          description="Return to Manage Orders and select Approve to try the payment again."
          actionLabel="Return to Manage Orders"
          onAction={() => router.push("/order-manage")}
        />
      </>
    );
  }

  const canProcessPayment =
    payment.status === "PENDING" &&
    payment.order.status === "PENDING" &&
    payment.claim.isActive &&
    payment.claim.isMine;

  if (!canProcessPayment) {
    return (
      <>
        {paymentToast}
        <PaymentPageState
          eyebrow="Payment Unavailable"
          title="This payment can no longer be processed here"
          description="Go to Manage Orders and select Approve to continue."
          actionLabel="Go to Manage Orders"
          onAction={() => router.push("/order-manage")}
        />
      </>
    );
  }

  return (
    <main className="min-h-screen bg-primary-25 px-4 py-8 sm:px-6 sm:py-12">
      {paymentToast}
      <div className="mx-auto w-full max-w-[1040px]">
        <Link
          href={`/order-manage/${payment.orderId}`}
          className="mb-6 inline-flex cursor-pointer items-center gap-2 text-sm font-medium text-primary-600 transition hover:text-primary-950"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          Back
        </Link>

        <div className="overflow-hidden rounded-xl border border-primary-100 bg-white shadow-[0_12px_40px_rgba(34,34,34,0.08)]">
          <div className="grid md:grid-cols-[0.9fr_1.1fr]">
            <aside className="flex flex-col justify-between bg-primary-950 p-6 text-white sm:p-10">
              <div>
                <div className="mb-10 flex items-center gap-2">
                  <div className="flex size-9 items-center justify-center rounded-md bg-white/10">
                    <CreditCard className="size-5" aria-hidden="true" />
                  </div>
                  <span className="text-sm font-bold tracking-wide">Snack Payment</span>
                </div>

                <p className="text-sm text-primary-300">Amount due</p>
                <p className="mt-2 text-4xl font-bold tracking-tight">{formatCurrency(payment.amount)}</p>

                <dl className="mt-10 space-y-4 border-t border-white/15 pt-6 text-sm">
                  <div className="flex items-start justify-between gap-4">
                    <dt className="text-primary-300">Order Name</dt>
                    <dd className="max-w-[220px] font-medium">{payment.order.productName}</dd>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <dt className="text-primary-300">Payment reference</dt>
                    <dd className="font-medium">#{payment.id}</dd>
                  </div>
                </dl>
              </div>

              <div className="mt-12 flex items-start gap-3 rounded-lg bg-white/5 p-4">
                <ShieldCheck className="mt-0.5 size-5 shrink-0 text-primary-200" aria-hidden="true" />
                <div>
                  <p className="text-sm font-semibold">Practice checkout</p>
                  <p className="mt-1 text-xs leading-5 text-primary-300">
                    This is a simulated payment page. Do not enter real card information.
                  </p>
                </div>
              </div>
            </aside>

            <section className="p-6 sm:p-10" aria-labelledby="payment-form-title">
              <div className="mb-8">
                <h1 className="text-2xl font-bold tracking-tight text-primary-950">Payment Details</h1>
                <p className="mt-2 text-sm leading-6 text-primary-500">
                  Please enter card details to finish approving this order.
                </p>
              </div>

              <form onSubmit={handleSubmit(handleValidSubmit)} className="space-y-5" noValidate>
                <div className="space-y-2">
                  <label htmlFor="cardholder-name" className="block text-sm font-semibold text-primary-800">
                    Name on card
                  </label>
                  <input
                    {...register("cardholderName")}
                    id="cardholder-name"
                    type="text"
                    autoComplete="off"
                    aria-invalid={Boolean(errors.cardholderName)}
                    aria-describedby={errors.cardholderName ? "cardholder-name-error" : undefined}
                    className={fieldClassName}
                  />
                  {errors.cardholderName && (
                    <p id="cardholder-name-error" className="text-xs text-error-500">
                      {errors.cardholderName.message}
                    </p>
                  )}
                </div>

                <fieldset className="space-y-2">
                  <legend className="text-sm font-semibold text-primary-800">Card information</legend>
                  <div
                    className={`overflow-hidden rounded-md border bg-white focus-within:border-primary-700 ${
                      errors.cardNumber || errors.cardExpiry || errors.cardCvc
                        ? "border-error-500"
                        : "border-primary-200"
                    }`}
                  >
                    <div className="relative">
                      <CreditCard
                        className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-primary-400"
                        aria-hidden="true"
                      />
                      <label htmlFor="card-number" className="sr-only">
                        Card number
                      </label>
                      <input
                        {...register("cardNumber")}
                        id="card-number"
                        type="text"
                        inputMode="numeric"
                        autoComplete="off"
                        maxLength={19}
                        placeholder="0000 0000 0000 0000"
                        aria-invalid={Boolean(errors.cardNumber)}
                        aria-describedby={errors.cardNumber ? "card-number-error" : undefined}
                        onChange={(event) => {
                          setValue("cardNumber", formatCardNumber(event.target.value), {
                            shouldDirty: true,
                            shouldValidate: true,
                          });
                        }}
                        className="h-11 w-full px-10 text-sm text-primary-950 outline-none placeholder:text-primary-400"
                      />
                    </div>

                    <div className="grid grid-cols-2 border-t border-primary-200">
                      <div className="border-r border-primary-200">
                        <label htmlFor="card-expiry" className="sr-only">
                          Expiration date
                        </label>
                        <input
                          {...register("cardExpiry")}
                          id="card-expiry"
                          type="text"
                          inputMode="numeric"
                          autoComplete="off"
                          maxLength={7}
                          placeholder="MM / YY"
                          aria-invalid={Boolean(errors.cardExpiry)}
                          aria-describedby={errors.cardExpiry ? "card-expiry-error" : undefined}
                          onChange={(event) => {
                            setValue("cardExpiry", formatCardExpiry(event.target.value), {
                              shouldDirty: true,
                              shouldValidate: true,
                            });
                          }}
                          className="h-11 w-full px-3 text-sm text-primary-950 outline-none placeholder:text-primary-400"
                        />
                      </div>
                      <div className="relative">
                        <label htmlFor="card-cvc" className="sr-only">
                          Security code
                        </label>
                        <input
                          {...register("cardCvc")}
                          id="card-cvc"
                          type="text"
                          inputMode="numeric"
                          autoComplete="off"
                          maxLength={3}
                          placeholder="CVC"
                          aria-invalid={Boolean(errors.cardCvc)}
                          aria-describedby={errors.cardCvc ? "card-cvc-error" : undefined}
                          onChange={(event) => {
                            setValue("cardCvc", event.target.value.replace(/\D/g, "").slice(0, 3), {
                              shouldDirty: true,
                              shouldValidate: true,
                            });
                          }}
                          className="h-11 w-full px-3 pr-10 text-sm text-primary-950 outline-none placeholder:text-primary-400"
                        />
                        <LockKeyhole
                          className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-primary-400"
                          aria-hidden="true"
                        />
                      </div>
                    </div>
                  </div>
                  {errors.cardNumber && (
                    <p id="card-number-error" className="text-xs text-error-500">
                      {errors.cardNumber.message}
                    </p>
                  )}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      {errors.cardExpiry && (
                        <p id="card-expiry-error" className="text-xs text-error-500">
                          {errors.cardExpiry.message}
                        </p>
                      )}
                    </div>
                    <div>
                      {errors.cardCvc && (
                        <p id="card-cvc-error" className="text-xs text-error-500">
                          {errors.cardCvc.message}
                        </p>
                      )}
                    </div>
                  </div>
                </fieldset>

                <div className="rounded-md border border-secondary-500/20 bg-secondary-100 px-4 py-3">
                  <div className="space-y-1 text-xs leading-5 text-primary-700">
                    <p className="pb-1">Autofill the form with details for a successful or declined test payment.</p>
                    <div className="flex flex-col items-start justify-between gap-1 sm:flex-row sm:items-center sm:gap-3">
                      <strong>Successful payment:</strong>
                      <button
                        type="button"
                        onClick={() => populateTestCard(SUCCESSFUL_DUMMY_CARD_NUMBER)}
                        className="inline-flex min-w-[190px] cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-md border border-primary-200 bg-white px-3 py-2 font-semibold text-primary-900 shadow-xs transition hover:border-primary-500 hover:bg-secondary-200"
                        aria-label="Autofill successful payment details"
                      >
                        <CreditCard className="size-4" aria-hidden="true" />
                        Autofill card details
                      </button>
                    </div>
                    <div className="flex flex-col items-start justify-between gap-1 sm:flex-row sm:items-center sm:gap-3">
                      <strong>Declined payment:</strong>
                      <button
                        type="button"
                        onClick={() => populateTestCard(FAILED_DUMMY_CARD_NUMBER)}
                        className="inline-flex min-w-[190px] cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-md border border-primary-200 bg-white px-3 py-2 font-semibold text-primary-900 shadow-xs transition hover:border-primary-500 hover:bg-secondary-200 "
                        aria-label="Autofill declined payment details"
                      >
                        <CreditCard className="size-4" aria-hidden="true" />
                        Autofill card details
                      </button>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={!isValid || isProcessingPayment}
                  className="flex h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-md bg-primary-950 px-4 text-sm font-bold text-white transition hover:bg-primary-800 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-primary-200 disabled:text-primary-400"
                >
                  <LockKeyhole className="size-4" aria-hidden="true" />
                  {isProcessingPayment ? "Processing..." : "Complete payment"}
                </button>
              </form>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}
