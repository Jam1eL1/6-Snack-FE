"use client";

import React, { ChangeEvent, useState } from "react";
import TextArea from "@/components/common/TextArea";
import OrderItem from "./OrderItem";
import Button from "@/components/ui/Button";
import ArrowIconSvg from "@/components/svg/ArrowIconSvg";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getCartItems } from "@/lib/api/cart.api";
import { TGetCartItemsParams, TGetCartItemsResponse } from "@/types/cart.types";
import { useRouter } from "next/navigation";
import { createOrder } from "@/lib/api/order.api";
import { queryKeys } from "@/lib/queryKeys";
import clsx from "clsx";
import { TCreateOrderData } from "@/types/order.types";

type TOrderPageContentProps = {
  cartItemId?: string;
};

export default function OrderPageContent({ cartItemId }: TOrderPageContentProps) {
  const [isDisabled, setIsDisabled] = useState<boolean>(false);
  const [requestMessage, setRequestMessage] = useState<string>("");
  const router = useRouter();

  const params: TGetCartItemsParams = {
    ...(cartItemId ? { cartItemId } : { isChecked: "true" }),
  };

  const {
    data: cartItems,
    isPending,
    error,
  } = useQuery<TGetCartItemsResponse, Error, TGetCartItemsResponse>({
    queryKey: queryKeys.cartItems.order(cartItemId),
    queryFn: () => getCartItems(params),
  });
  const queryClient = useQueryClient();
  // Submit the purchase request
  const { mutate: orderRequest } = useMutation<
    TCreateOrderData,
    Error,
    { requestMessage?: string; cartItemIds: number[] }
  >({
    mutationFn: ({ requestMessage, cartItemIds }) => createOrder({ requestMessage, cartItemIds }),
    onSuccess: (order) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.cartItems.all,
      });
      router.push(`/cart/order-confirmed/${order.id}`);
    },
    onError: () => setIsDisabled(true),
  });

  const cartItemIds = cartItems?.cart.map((item) => item.id) ?? [];

  const handleValueChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setRequestMessage(e.target.value);
  };

  if (error) {
    return <div role="alert">Something went wrong: {error.message}</div>;
  }

  return (
    <div className="flex flex-col justify-center items-center w-full">
      <div className="w-full max-w-[1200px] md:px-[24px] sm:pb-[36px]">
        <section className="flex flex-col gap-[40px] mt-[20px] sm:gap-[70px] sm:mt-[60px] md:mt-[80px]">
          <div className="flex flex-col justify-center items-center gap-[10px] font-bold text-[16px]/[20px] tracking-tight sm:flex-row sm:gap-[20px] sm:text-[18px]/[22px]">
            <p className="text-primary-300">1. Shopping Cart</p>
            <ArrowIconSvg direction="right" className="hidden sm:block relative w-[24px] h-[24px] text-primary-300" />
            <h2 className="text-primary-950">2. Order</h2>
            <ArrowIconSvg direction="right" className="hidden sm:block relative w-[24px] h-[24px] text-primary-300" />
            <p className="text-primary-300">3. Order Confirmed</p>
          </div>
        </section>

        <OrderItem isPending={isPending} cartItems={cartItems} />

        <div className="flex flex-col justify-center items-start mt-[40px] gap-[14px] sm:gap-[20px]">
          <label htmlFor="textarea" className="font-bold text-[16px]/[20px] tracking-tight text-primary-950">
            Request Message
          </label>
          <TextArea
            value={requestMessage}
            onChange={handleValueChange}
            className="p-[16px] placeholder:text-[#929292] placeholder:text-[16px]/[26px] placeholder:tracking-tight placeholder:font-normal rounded-[2px] w-full sm:p-[24px] sm:w-full md:w-full"
          />
        </div>

        <div className="flex justify-center items-center mt-[24px] gap-[16px] sm:mt-[50px] sm:gap-[20px]">
          <Button
            onClick={() => router.push("/cart")}
            className="w-full max-w-[300px] h-[64px] font-bold text-[16px]/[20px] tracking-tight"
            type="white"
            label="Cancel"
          />
          <Button
            onClick={() => {
              setIsDisabled(true);
              orderRequest({ requestMessage, cartItemIds });
            }}
            aria-live="polite"
            disabled={isDisabled}
            type="black"
            label={isDisabled ? "Please wait..." : "Submit Request"}
            className={clsx(
              "w-full max-w-[300px] h-[64px] font-bold text-[16px]/[20px] tracking-tight",
              isDisabled && "text-primary-300 bg-primary-100 cursor-default text-[14px]/[17px] sm:text-[16px]/[20px]",
            )}
          />
        </div>
      </div>
    </div>
  );
}
