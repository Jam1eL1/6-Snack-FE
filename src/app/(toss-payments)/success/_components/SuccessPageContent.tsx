"use client";

import React, { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { getOrderDetailWithoutStatus } from "@/lib/api/orderManage.api";
import CheckIconSvg from "@/components/svg/CheckIconSvg";

type TSuccessPageContentProps = {
  orderId?: string;
  amount?: string;
  paymentKey?: string;
};

export default function SuccessPageContent({ orderId, amount, paymentKey }: TSuccessPageContentProps) {
  const [success, setSuccess] = useState<boolean>(false);
  const router = useRouter();
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

  const { data: order, isPending } = useQuery({
    queryKey: ["order", orderId],
    queryFn: () => getOrderDetailWithoutStatus(orderId ?? ""),
    enabled: !!orderId,
  });

  const hasConfirmed = useRef<boolean>(false);

  useEffect(() => {
    // Prevent duplicate confirmation requests.
    if (hasConfirmed.current) return;

    if (!order) return;

    // Compare the query param amount with the DB amount to prevent tampering.
    if (String(order.productsPriceTotal + order.deliveryFee) !== amount) {
      router.push("/fail?message=가격 정보가 일치하지 않습니다.&code=400");
      return;
    }

    const requestData = {
      orderId,
      amount,
      paymentKey,
    };

    async function confirm() {
      hasConfirmed.current = true; // Prevent duplicate submission.

      const response = await fetch(`${apiBaseUrl}/payments/confirm`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
        credentials: "include",
        cache: "no-store",
      });

      const json = await response.json();

      if (!response.ok) {
        router.replace(`/fail?message=${json.message}&code=${json.code}`);
        return;
      }

      setSuccess(true);
    }

    confirm();
  }, [order, amount, orderId, paymentKey, router, apiBaseUrl]);

  if (isPending || !success) {
    return (
      <div role="status" aria-label="로딩 중" className="flex justify-center items-center h-screen -mb-[24px]">
        <div className="size-[20px] border-[3px] border-t-[3px] border-blue-500 border-t-primary-100 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col justify-center items-center h-screen gap-[28px] -mb-[24px]">
      <CheckIconSvg stroke="white" bgColor="#3182F6" className="w-15 h-15 cursor-default sm:w-30 sm:h-30" />
      <section className="flex flex-col w-full gap-[38px] text-center justify-center items-center">
        <h2 className="font-bold text-[22px]/[30px] sm:text-[30px]/[36px]">결제를 완료했어요</h2>
        <button
          role="구매 완료 페이지로 이동"
          onClick={() => {
            if (order?.status === "APPROVED") {
              router.push("/order-manage");
            } else if (order?.status === "INSTANT_APPROVED") {
              router.push(`/cart/order-confirmed/${order?.id}`);
            }
          }}
          className="outline-none bg-blue-500 text-white text-[18px]/[30px] w-full max-w-[285px] rounded-[12px] h-[56px] font-bold cursor-pointer sm:max-w-[360px] sm:h-[64px]"
        >
          닫기
        </button>
      </section>
    </div>
  );
}
