"use client";

import React, { useEffect, useRef, useState } from "react";
import CartItem from "./_components/CartItem";
import Button from "@/components/ui/Button";
import Link from "next/link";
import ArrowIconSvg from "@/components/svg/ArrowIconSvg";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getCartItems } from "@/lib/api/cart.api";
import { useAuth } from "@/providers/AuthProvider";
import { TGetCartItemsResponse } from "@/types/cart.types";
import { useRouter } from "next/navigation";
import Toast from "@/components/common/Toast";
import { orderNow } from "@/lib/api/order.api";
import { TUpdateOrderStatusData } from "@/types/order.types";
import { useDeviceType } from "@/hooks/useDeviceType";
import clsx from "clsx";
import { formatCurrency } from "@/lib/utils/currency.util";
import { queryKeys } from "@/lib/queryKeys";
import { STANDARD_DELIVERY_FEE_CENTS } from "@/lib/constants/money";

export default function CartPage() {
  const [isDisabled, setIsDisabled] = useState<boolean>(false);
  const [isToastVisible, setIsToastVisible] = useState<boolean>(false);
  const { isMobile } = useDeviceType();
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const { user } = useAuth();
  const router = useRouter();
  const queryClient = useQueryClient();

  const {
    data: cartItems,
    isPending,
    error,
  } = useQuery<TGetCartItemsResponse, Error, TGetCartItemsResponse>({
    queryKey: queryKeys.cartItems.all,
    queryFn: () => getCartItems(),
  });

  const { mutate: orderRequest } = useMutation<TUpdateOrderStatusData, Error, number[]>({
    mutationFn: orderNow,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.cartItems.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.adminOrders.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.budgets.all });
      router.push("/order-history");
    },
    onError: () => setIsDisabled(false),
  });

  // Use safe defaults when budget data is unavailable
  const { currentMonthBudget = 0, currentMonthExpense = 0 } = cartItems?.budget ?? {};

  // Total price of selected cart items
  const selectedTotalPrice = cartItems?.cart
    .filter((item) => item.isChecked === true)
    .reduce((totalPrice, item) => totalPrice + item.product.price * item.quantity, 0);

  // Whether the selected items are within budget
  const canPurchase =
    currentMonthBudget -
      currentMonthExpense -
      (selectedTotalPrice ? selectedTotalPrice + STANDARD_DELIVERY_FEE_CENTS : 0) >=
    0;

  // Remaining budget
  const remainingBudget = cartItems?.budget ? currentMonthBudget - currentMonthExpense : 0;

  // Selected cart item IDs
  const checkedCartItemIds = cartItems?.cart.filter((item) => item.isChecked).map((item) => item.id) ?? [];

  // Clear the toast timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  const handleRequestOrder = () => {
    const isBudgetExceeded = user?.role !== "USER" && !canPurchase;

    // Stop when no items are selected or the purchase exceeds the budget
    if (checkedCartItemIds.length === 0 || isBudgetExceeded) {
      setIsToastVisible(true);

      if (timerRef.current) clearTimeout(timerRef.current);

      timerRef.current = setTimeout(() => {
        setIsToastVisible(false);
        timerRef.current = null;
      }, 3000);

      return;
    }

    // Regular users continue to the request page
    if (user?.role === "USER") return router.push("/cart/order");

    // Admins create an instant Order
    setIsDisabled(true);
    orderRequest(checkedCartItemIds);
  };

  if (error) {
    return <div>Something went wrong: {error.message}</div>;
  }

  return (
    <div className="flex flex-col justify-center items-center w-full">
      {checkedCartItemIds.length === 0 ? (
        <Toast text="Select at least one item." isVisible={isToastVisible} />
      ) : (
        <Toast
          text={
            isMobile ? (
              "Insufficient budget."
            ) : (
              <>
                <p>Insufficient budget.&nbsp;</p>
                <p>Reduce the quantity or remove an item.</p>
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
                  Order Total
                </p>
                <p className="font-extrabold text-[24px]/[30px] tracking-tight text-primary-950 sm:text-[30px]/[37px]">
                  {formatCurrency(selectedTotalPrice ? selectedTotalPrice + STANDARD_DELIVERY_FEE_CENTS : 0)}
                </p>
              </div>
              <div className="flex flex-col gap-[6px]">
                <p className="font-normal text-[16px]/[20px] tracking-tight text-[#6b6b6b]">
                  Items: {formatCurrency(selectedTotalPrice)}
                </p>
                <p className="font-normal text-[16px]/[20px] tracking-tight text-[#6b6b6b] mb-[6px] sm:mb-[10px]">
                  Shipping: {formatCurrency(STANDARD_DELIVERY_FEE_CENTS)}
                </p>
              </div>
              {user?.role !== "USER" && (
                <>
                  <div className="outline-1 outline-primary-100"></div>
                  <div className="flex justify-start items-center gap-[4px] mt-[2px] sm:mt-[6px]">
                    <p className="font-bold text-[18px]/[22px] tracking-tight text-primary-700">Remaining Budget</p>
                    <p className="font-extrabold text-[18px]/[22px] tracking-tight text-primary-700">
                      {formatCurrency(remainingBudget)}
                    </p>
                  </div>
                </>
              )}
            </section>

            <section className="flex flex-col justify-center items-center w-full gap-[20px] sm:max-w-[300px]">
              <Link aria-label="Go to the product list" href="/products" className="w-full">
                <Button
                  type="white"
                  disabled={isDisabled}
                  label="Continue Shopping"
                  className="w-full h-[64px] font-bold tracking-tight text-primary-950"
                />
              </Link>
              <Button
                onClick={handleRequestOrder}
                disabled={isDisabled}
                type="black"
                label={isDisabled ? "Please wait..." : user?.role !== "USER" ? "Buy Now" : "Submit Request"}
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
