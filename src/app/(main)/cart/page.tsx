"use client";

import React, { useEffect, useRef, useState } from "react";
import CartItem from "./_components/CartItem";
import Button from "@/components/ui/Button";
import Link from "next/link";
import ArrowIconSvg from "@/components/svg/ArrowIconSvg";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getCartItems } from "@/lib/api/cart.api";
import { useAuth } from "@/providers/AuthProvider";
import { TGetCartItemsResponse } from "@/types/cart.types";
import { useRouter } from "next/navigation";
import Toast from "@/components/common/Toast";
import { createOrder } from "@/lib/api/order.api";
import { TCreateOrderData } from "@/types/order.types";
import { useDeviceType } from "@/hooks/useDeviceType";
import clsx from "clsx";
import { formatPrice } from "@/lib/utils/formatPrice.util";
import { queryKeys } from "@/lib/queryKeys";
import { useOrderStore } from "@/stores/orderStore";

export default function CartPage() {
  const [isDisabled, setIsDisabled] = useState<boolean>(false);
  const [isToastVisible, setIsToastVisible] = useState<boolean>(false);
  const { isMobile } = useDeviceType();
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const { user } = useAuth();
  const router = useRouter();

  // Zustand로 Order 정보 저장
  const setOrder = useOrderStore((state) => state.setOrder);

  const {
    data: cartItems,
    isPending,
    error,
  } = useQuery<TGetCartItemsResponse, Error, TGetCartItemsResponse>({
    queryKey: queryKeys.cartItems.all,
    queryFn: () => getCartItems(),
  });

  const { mutate: orderRequest } = useMutation<TCreateOrderData, Error, number[]>({
    mutationFn: (cartItemIds) => createOrder({ cartItemIds }),
    onSuccess: (order) => {
      setOrder(order);

      router.push("/checkout");
    },
    onError: () => setIsDisabled(false),
  });

  // budget 예외 처리
  const { currentMonthBudget = 0, currentMonthExpense = 0 } = cartItems?.budget ?? {};

  // 장바구니 선택한 상품의 총 가격: number
  const selectedTotalPrice = cartItems?.cart
    .filter((item) => item.isChecked === true)
    .reduce((totalPrice, item) => totalPrice + item.product.price * item.quantity, 0);

  // 구매 가능 여부: boolean
  const canPurchase =
    currentMonthBudget - currentMonthExpense - (selectedTotalPrice ? selectedTotalPrice + 3000 : 0) >= 0;

  // 남은 예산: number
  const remainingBudget = cartItems?.budget ? currentMonthBudget - currentMonthExpense : 0;

  // 장바구니 선택한 상품 IDs: number[]
  const checkedCartItemIds = cartItems?.cart.filter((item) => item.isChecked).map((item) => item.id) ?? [];

  // 타이머 언마운트 시 클린업
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  const handleRequestOrder = () => {
    const isBudgetExceeded = user?.role !== "USER" && !canPurchase;

    // 아무 상품도 선택하지 않았거나, 예산 초과할 때
    if (checkedCartItemIds.length === 0 || isBudgetExceeded) {
      setIsToastVisible(true);

      if (timerRef.current) clearTimeout(timerRef.current);

      timerRef.current = setTimeout(() => {
        setIsToastVisible(false);
        timerRef.current = null;
      }, 3000);

      return;
    }

    // USER일 때
    if (user?.role === "USER") return router.push("/cart/order");

    // Order 생성 API
    setIsDisabled(true);
    orderRequest(checkedCartItemIds);
  };

  if (error) {
    return <div>에러 발생 : {error.message}</div>;
  }

  return (
    <div className="flex flex-col justify-center items-center w-full">
      {checkedCartItemIds.length === 0 ? (
        <Toast text="1개 이상의 상품을 선택하세요." isVisible={isToastVisible} />
      ) : (
        <Toast
          text={
            isMobile ? (
              "예산이 부족합니다."
            ) : (
              <>
                <p>예산이 부족합니다.&nbsp;</p>
                <p>수량을 줄이거나 항목을 제거해주세요.</p>
              </>
            )
          }
          isVisible={isToastVisible}
          budget={remainingBudget}
        />
      )}

      <div className="z-2 w-full max-w-[1200px] md:px-[24px]">
        <div className="flex flex-col gap-[40px] mt-[20px] sm:gap-[70px] sm:mt-[60px] sm:pb-[36px] md:mt-[80px]">
          <section className="flex flex-col justify-center items-center gap-[10px] font-bold text-[16px]/[20px] tracking-tight sm:flex-row sm:gap-[20px] sm:text-[18px]/[22px]">
            <h2 className="text-primary-950">1. Shopping Cart</h2>
            {user?.role === "USER" && (
              <>
                <ArrowIconSvg
                  direction="right"
                  className="hidden sm:block relative w-[24px] h-[24px] text-primary-300"
                />
                <p className="text-primary-300">2. Order</p>
              </>
            )}
            <ArrowIconSvg direction="right" className="hidden sm:block relative w-[24px] h-[24px] text-primary-300" />
            <p className="text-primary-300">{user?.role === "USER" ? "3. Order Confirmed" : "2. Order Confirmed"}</p>
          </section>

          <CartItem
            cartItems={cartItems}
            isPending={isPending}
            canPurchase={canPurchase}
            checkedCartItemIds={checkedCartItemIds}
            isDisabled={isDisabled}
            setIsDisabled={setIsDisabled}
            orderRequest={orderRequest}
          />

          <section className="flex flex-col justify-center items-start gap-[30px] sm:flex-row sm:justify-between sm:items-center sm:gap-[40px] md:gap-[60px]">
            <section className="flex flex-col w-full gap-[14px]">
              <div className="flex justify-start items-center gap-[4px]">
                <p className="font-bold text-[24px]/[30px] tracking-tight text-primary-950 sm:text-[30px]/[37px]">
                  총 주문금액
                </p>
                <p className="font-extrabold text-[24px]/[30px] tracking-tight text-primary-950 sm:text-[30px]/[37px]">
                  {formatPrice(selectedTotalPrice ? selectedTotalPrice + 3000 : 0)}원
                </p>
              </div>
              <div className="flex flex-col gap-[6px]">
                <p className="font-normal text-[16px]/[20px] tracking-tight text-[#6b6b6b]">
                  주문 상품은 {formatPrice(selectedTotalPrice)}원
                </p>
                <p className="font-normal text-[16px]/[20px] tracking-tight text-[#6b6b6b] mb-[6px] sm:mb-[10px]">
                  배송비는 3,000원입니다.
                </p>
              </div>
              {user?.role !== "USER" && (
                <>
                  <div className="outline-1 outline-primary-100"></div>
                  <div className="flex justify-start items-center gap-[4px] mt-[2px] sm:mt-[6px]">
                    <p className="font-bold text-[18px]/[22px] tracking-tight text-primary-700">남은 예산 금액</p>
                    <p className="font-extrabold text-[18px]/[22px] tracking-tight text-primary-700">
                      {formatPrice(remainingBudget)}원
                    </p>
                  </div>
                </>
              )}
            </section>

            <section className="flex flex-col justify-center items-center w-full gap-[20px] sm:max-w-[300px]">
              <Link aria-label="상품 리스트 페이지로 이동" href="/products" className="w-full">
                <Button
                  type="white"
                  disabled={isDisabled}
                  label="계속 쇼핑하기"
                  className="w-full h-[64px] font-bold tracking-tight text-primary-950"
                />
              </Link>
              <Button
                onClick={handleRequestOrder}
                disabled={isDisabled}
                type="black"
                label={isDisabled ? "잠시만 기다려주세요..." : user?.role !== "USER" ? "구매하기" : "구매 요청"}
                className={clsx(
                  isDisabled && "text-primary-300 bg-primary-100 cursor-default",
                  "w-full h-[64px] font-bold tracking-tight",
                )}
              />
            </section>
          </section>
        </div>
      </div>
    </div>
  );
}
