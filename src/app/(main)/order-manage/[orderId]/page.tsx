"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import ArrowIconSvg from "@/components/svg/ArrowIconSvg";
import { useOrderDetail } from "@/hooks/useOrderDetail";
import Button from "@/components/ui/Button";
import Image from "next/image";
import { formatDate } from "@/lib/utils/formatDate.util";
import { formatCurrency } from "@/lib/utils/currency.util";
import { useOrderStatusUpdate } from "@/hooks/useOrderStatusUpdate";
import { useModal } from "@/providers/ModalProvider";
import OrderActionModal from "../_components/OrderActionModal";
import OrderDetailSkeleton from "./_components/OrderDetailSkeleton";
import { useProcessOrderPayment } from "@/hooks/useProcessOrderPayment";
import { isOrderPaymentProcessingByAnotherAdmin } from "@/lib/utils/getOrderPaymentAction.util";
import { SessionExpiredError } from "@/lib/api/auth.errors";
import { useFlashToast } from "@/stores/flashToast";

export default function OrderManageDetailPage() {
  const params = useParams<{ orderId: string }>();
  const router = useRouter();
  const orderId: string = params.orderId;

  const { data: orderRequest, isLoading, error } = useOrderDetail(orderId);
  const updateOrderMutation = useOrderStatusUpdate();
  const { openModal } = useModal();
  const setFlash = useFlashToast((state) => state.setFlash);

  const [isItemsExpanded, setIsItemsExpanded] = useState<boolean>(true);

  const { processOrderPayment, isPending: isPaymentPending } = useProcessOrderPayment({
    onPaymentReady: (paymentId) => {
      router.push(`/payments/${paymentId}`);
    },
    onPaymentBlocked: () => {
      setFlash("Another admin is currently processing this order.", "error");
    },
    onPaymentAlreadyPaid: () => {
      setFlash("This order has already been paid.", "error");
    },
    onProcessOrderPaymentError: (error) => {
      if (error instanceof SessionExpiredError) return;

      setFlash(error.message || "Failed to process payment.", "error");
    },
  });

  const handleApprove = () => {
    if (budgetAfterPurchase < 0 && remainingBudget !== undefined) {
      setFlash("Insufficient budget.", "error", remainingBudget);
      return;
    }

    if (!orderRequest) return;

    processOrderPayment(orderRequest);
  };

  const handleReject = async () => {
    try {
      await updateOrderMutation.mutateAsync({
        orderId: orderId,
        status: "REJECTED",
      });

      openModal(
        <OrderActionModal
          modalTitle="Request Rejected"
          modalDescription="Request has been rejected<br />Check other requests from the list"
          leftButtonText="Go Home"
          rightButtonText="View Purchase Request History"
          onLeftClick={() => {
            router.push("/products");
          }}
          onRightClick={() => {
            router.push("/order-manage");
          }}
        />,
      );
    } catch {
      setFlash("Failed to process rejection.", "error");
    }
  };

  if (isLoading) {
    return <OrderDetailSkeleton />;
  }

  if (error || !orderRequest) {
    return (
      <main className="min-h-screen bg-white flex items-center justify-center" role="main" aria-live="assertive">
        <div className="text-base sm:text-lg md:text-xl text-red-600">
          {error instanceof Error ? error.message : "Order history not found."}
        </div>
      </main>
    );
  }

  const productsPriceTotal = orderRequest.productsPriceTotal;
  const shippingFee = orderRequest.deliveryFee;
  const finalTotal = productsPriceTotal + shippingFee;
  const currentMonthBudget = orderRequest.budget.currentMonthBudget || 0;
  const currentMonthExpense = orderRequest.budget.currentMonthExpense || 0;
  const remainingBudget = currentMonthBudget - currentMonthExpense;
  const budgetAfterPurchase = remainingBudget - finalTotal;
  const isProcessingByAnotherAdmin = isOrderPaymentProcessingByAnotherAdmin({
    payment: orderRequest.payment,
    paymentClaim: orderRequest.paymentClaim,
  });

  return (
    <div className="min-h-screen bg-white">
      <main
        className="w-full max-w-[1200px] mx-auto pt-[30px] md:pt-[60px] flex flex-col justify-start items-start gap-[30px]"
        role="main"
      >
        <header>
          <h1 className="self-stretch justify-center text-lg/[22px] font-bold">Purchase Request Details</h1>
        </header>

        <section
          className="self-stretch flex flex-col justify-start items-start gap-5"
          aria-labelledby="items-section-title"
        >
          <button
            className="inline-flex justify-start items-center gap-1.5 cursor-pointer z-10"
            onClick={() => setIsItemsExpanded(!isItemsExpanded)}
            aria-expanded={isItemsExpanded}
            aria-controls="items-content"
            aria-label={`Requested items ${orderRequest.products?.length || 0} ${isItemsExpanded ? "collapse" : "expand"}`}
          >
            <div className="justify-center text-primary-950 text-base/[20px] tracking-tight font-bold">
              Requested Items
            </div>
            <div className="justify-center  text-primary-950 text-base/[20px] tracking-tight  font-normal">
              Total {orderRequest.products?.length || 0} items
            </div>
            <ArrowIconSvg
              direction={isItemsExpanded ? "up" : "down"}
              className="w-5 h-5 text-primary-950"
              aria-hidden="true"
            />
          </button>
          <div
            id="items-content"
            aria-hidden={!isItemsExpanded}
            className="w-full rounded-sm sm:shadow-[0px_0px_10px_0px_rgba(0,0,0,0.12)]"
          >
            {isItemsExpanded && (
              <div
                className="flex flex-col w-full sm:pt-[20px] sm:px-[20px] sm:pb-[30px] gap-[20px] sm:gap-0"
                role="list"
                aria-label="Order item list"
              >
                {orderRequest.products?.map((item) => (
                  <div
                    key={item.id}
                    className="flex w-full items-center gap-3 sm:gap-5 border-b pb-[20px] sm:pt-[20px] sm:pr-[20px] border-primary-100"
                    role="listitem"
                  >
                    <div className="w-[72px] sm:w-[140px] h-[72px] sm:h-[140px] bg-primary-50 rounded-xs sm:bg-white flex justify-center items-center flex-shrink-0">
                      {typeof item.imageUrl === "string" && (
                        <div className="relative w-[75%] h-[75%]">
                          <Image
                            src={item.imageUrl}
                            alt={`${item.productName} product image`}
                            fill
                            className="object-contain"
                          />
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col w-full justify-center items-start gap-[12px] sm:gap-[30px]">
                      <div className="flex flex-col justify-center items-start gap-1 sm:gap-[10px]">
                        <p className="text-primary-950 text-sm/[17px] tracking-tight sm:text-base/[20px] sm:font-medium">
                          {item.productName}
                        </p>
                        <div className="text-primary-950 text-sm/[17px] tracking-tight sm:text-base/[20px] font-bold">
                          {formatCurrency(item.price)}
                        </div>
                      </div>

                      <div className="flex w-full items-center justify-between">
                        <div className=" text-primary-500 text-[13px]/[16px] sm:text-base/[20px] tracking-tight font-bold">
                          Quantity {item.quantity}
                        </div>
                        <div className="sm:hidden text-center  text-primary-700 text-base/[20px] tracking-tight font-extrabold">
                          {formatCurrency(item.price * item.quantity)}
                        </div>
                      </div>
                    </div>
                    <div className="hidden sm:block text-center  text-primary-700 text-xl/[32px] tracking-tight font-extrabold whitespace-nowrap">
                      {formatCurrency(item.price * item.quantity)}
                    </div>
                  </div>
                ))}

                <div
                  className="w-full flex flex-col gap-4 sm:gap-2.5 sm:pt-[20px] sm:px-[20px]"
                  role="region"
                  aria-label="Order amount information"
                >
                  <div className="flex justify-between items-center">
                    <div className="text-primary-700 tracking-tight text-sm/[17px] sm:text-base/[20px] font-bold">
                      Order Amount
                    </div>
                    <div className="text-primary-700 tracking-tight text-sm/[17px] sm:text-base/[20px] font-bold">
                      {formatCurrency(productsPriceTotal)}
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="text-primary-700 tracking-tight text-sm/[17px] sm:text-base/[20px] font-bold">
                      Shipping Fee
                    </div>
                    <div className="text-primary-700 tracking-tight text-sm/[17px] sm:text-base/[20px] font-bold">
                      {formatCurrency(shippingFee)}
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="text-primary-950 text-lg/[22px] tracking-tight font-bold">Total Order Amount</div>
                    <div className="text-primary-950 text-lg/[22px] sm:text-[24px]/[30px] tracking-tight font-extrabold">
                      {formatCurrency(finalTotal)}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        <section className="self-stretch flex flex-col justify-start items-start" aria-labelledby="request-info-title">
          <div className="self-stretch px-2 py-3 sm:py-3.5 border-b border-primary-950 inline-flex justify-start items-center gap-2">
            <h2
              id="request-info-title"
              className="text-center justify-center tracking-tight text-primary-950 text-sm/[17px] sm:text-base/[20px] font-extrabold"
            >
              Request Information
            </h2>
          </div>
          <div
            className="self-stretch flex flex-col justify-center items-start sm:flex-row sm:justify-start sm:items-stretch "
            role="region"
            aria-label="Request details information"
          >
            <div className="self-stretch inline-flex justify-start items-center sm:flex-1">
              <div className="flex w-[140px] h-[50px] p-2 border-r border-b border-primary-100 justify-start items-center text-sm/[17px] tracking-tight sm:text-base/[20px] text-primary-950">
                Requester
              </div>
              <div className="flex-1 h-[50px] px-2 sm:px-5 py-2 border-b border-primary-100 flex justify-start items-center sm:border-r">
                <div className="text-center justify-center text-primary-900 text-sm font-bold sm:text-base tracking-tight ">
                  {orderRequest.requester || "-"}
                </div>
              </div>
            </div>
            <div className="self-stretch inline-flex justify-start items-center sm:flex-1">
              <div className="flex w-[140px] h-[50px] p-2 border-r border-b border-primary-100 text-primary-950 justify-start items-center text-sm/[17px] tracking-tight sm:text-base/[20px]">
                Request Date
              </div>
              <div className="flex-1 h-[50px] px-2 sm:px-5 py-2 border-b border-primary-100 flex justify-start items-center">
                <div className="text-center justify-center text-primary-900 text-sm sm:text-base font-bold tracking-tight">
                  {orderRequest.createdAt ? formatDate(orderRequest.createdAt) : "-"}
                </div>
              </div>
            </div>
          </div>
          <div className="self-stretch flex flex-col justify-center items-start">
            <div className="self-stretch inline-flex justify-start items-center">
              <div className="flex w-[140px] h-[50px] py-4 px-2 sm:py-5 text-primary-950 border-r border-b border-primary-100 justify-start items-center text-sm/[17px] tracking-tight sm:text-base/[20px]">
                Request Message
              </div>
              <div className="flex-1 h-[50px] py-4 px-2 sm:px-5 border-b border-primary-100 flex justify-start items-center">
                <div className="text-start justify-center text-primary-900 text-sm sm:text-base font-bold tracking-tight">
                  {orderRequest.requestMessage || "-"}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="self-stretch flex flex-col justify-start items-start" aria-labelledby="budget-info-title">
          <div className="self-stretch px-2 py-3 sm:py-3.5 border-b border-primary-950 inline-flex justify-start items-center gap-2">
            <h2
              id="budget-info-title"
              className="text-center justify-center tracking-tight text-primary-950 text-sm/[17px] sm:text-base/[20px] font-extrabold"
            >
              Budget Information
            </h2>
          </div>
          <div
            className="self-stretch flex flex-col justify-center items-start"
            role="region"
            aria-label="Budget details information"
          >
            <div className="self-stretch inline-flex justify-start items-center">
              <div className="flex w-[140px] h-[50px] p-2 border-r border-b border-primary-100 justify-start items-center text-sm/[17px] tracking-tight sm:text-base/[20px]">
                This Month&apos;s Expenses
              </div>
              <div className="flex-1 h-[50px] px-2 sm:px-4 py-2 border-b border-primary-100 flex justify-start items-center">
                <div className="text-center justify-center text-primary-900 text-sm sm:text-base font-bold">
                  {formatCurrency(currentMonthExpense)}
                </div>
              </div>
            </div>
            <div className="self-stretch inline-flex justify-start items-center">
              <div className="flex w-[140px] h-[50px] p-2 border-r border-b border-primary-100 justify-start items-center text-sm/[17px] tracking-tight sm:text-base/[20px]">
                Remaining Budget This Month
              </div>
              <div className="flex-1 h-[50px] px-2 sm:px-4 py-2 border-b border-primary-100 flex justify-start items-center">
                <div className="text-center justify-center text-primary-900 text-sm sm:text-base font-bold">
                  {formatCurrency(remainingBudget)}
                </div>
              </div>
            </div>
          </div>
          <div className="self-stretch flex flex-col justify-center items-start">
            <div className="self-stretch inline-flex justify-start items-center">
              <div className="flex w-[140px] h-[50px] p-2 border-r border-b border-primary-100 justify-start items-center text-sm/[17px] tracking-tight sm:text-base/[20px]">
                Budget After Purchase
              </div>
              <div className="flex-1 h-[50px] px-2 sm:px-4 py-2 border-b border-primary-100 flex justify-start items-center">
                <div className="text-start justify-center text-primary-900 text-sm sm:text-base font-bold">
                  {formatCurrency(budgetAfterPurchase)}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <section
        className="flex w-full justify-center gap-4 sm:gap-5 py-6 md:py-0 mt-[20px] md:mt-[70px] md:items-center"
        role="region"
        aria-label="Order request action buttons"
      >
        <Button
          type="white"
          label={updateOrderMutation.isPending ? "Processing..." : "Reject Request"}
          className="w-full h-16 disabled:cursor-not-allowed md:max-w-[300px]"
          onClick={handleReject}
          disabled={updateOrderMutation.isPending || isProcessingByAnotherAdmin}
          aria-label={updateOrderMutation.isPending ? "Processing" : "Reject purchase request"}
        />
        <Button
          type="primary"
          label={isPaymentPending || isProcessingByAnotherAdmin ? "Processing..." : "Approve Request"}
          className="w-full h-16 disabled:cursor-not-allowed md:max-w-[300px]"
          onClick={handleApprove}
          disabled={isPaymentPending || isProcessingByAnotherAdmin}
          aria-label={isPaymentPending || isProcessingByAnotherAdmin ? "Processing" : "Approve purchase request"}
        />
      </section>
    </div>
  );
}
