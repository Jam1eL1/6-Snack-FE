import React from "react";
import Image from "next/image";
import { TGetCartItemsResponse } from "@/types/cart.types";
import { formatCurrency } from "@/lib/utils/currency.util";
import DogSpinner from "@/components/common/DogSpinner";
import { STANDARD_DELIVERY_FEE_CENTS } from "@/lib/constants/money";

type TOrderItemProps = {
  cartItems: TGetCartItemsResponse | undefined;
  isPending: boolean;
};

export default function OrderItem({ isPending, cartItems }: TOrderItemProps) {
  const totalPrice = cartItems?.cart.reduce((total, item) => total + item.product.price * item.quantity, 0);
  const itemCount = cartItems?.cart.length ?? 0;
  return (
    <>
      <div className="flex justify-start items-center gap-[6px] mt-[40px] sm:mt-[80px] sm:mb-[20px]">
        <p className="font-bold text-[16px]/[20px] tracking-tight text-primary-950">Requested Items</p>
        <p className="font-normal text-[16px]/[20px] tracking-tight text-primary-950">
          Total {itemCount} {itemCount <= 1 ? "item" : "items"}
        </p>
      </div>

      <div className="flex flex-col justify-center items-center w-full gap-[20px] sm:shadow-[0px_0px_10px_0px_rgba(0,0,0,0.12)] sm:py-[40px] sm:px-[30px] sm:rounded-[2px] md:px-[60px]">
        <div className="flex flex-col items-center w-full">
          {isPending ? (
            <div className="flex justify-center items-center py-[30px]">
              <DogSpinner />
            </div>
          ) : !cartItems?.cart.length ? (
            <div className="flex justify-center items-center h-[200px]">Invalid request.</div>
          ) : (
            cartItems.cart.map((item) => {
              return (
                <div
                  key={item.id}
                  className="flex justify-between items-center w-full py-[20px] border-b-1 border-primary-100"
                >
                  <div className="flex justify-start items-center w-full gap-[12px] sm:gap-[20px]">
                    <div className="flex justify-center items-center min-w-[72px] h-[72px] bg-primary-50 sm:min-w-[140px] sm:h-[140px] sm:bg-transparent">
                      <div className="relative w-[29px] h-[50px] sm:w-[59px] sm:h-[102px]">
                        <Image src={item.product.imageUrl} alt="Product" fill className="object-contain" />
                      </div>
                    </div>

                    <div className="flex flex-col justify-center items-center w-full gap-[12px] sm:flex-row sm:justify-between">
                      <div className="flex flex-col justify-center items-start w-full gap-[4px] sm:gap-[10px] sm:w-auto">
                        <p className="font-normal text-[14px]/[17px] tracking-tight text-primary-900 line-clamp-1 sm:font-medium sm:text-[16px]/[20px]">
                          {item.product.name}
                        </p>
                        <p className="font-bold text-[14px]/[17px] tracking-tight text-primary-950 sm:text-[16px]/[20px]">
                          {formatCurrency(item.product.price)}
                        </p>
                        <p className="hidden sm:block sm:font-bold sm:text-[16px]/[20px] sm:tracking-normal sm:text-primary-500 sm:mt-[20px]">
                          Quantity {item.quantity}
                        </p>
                      </div>

                      <div className="flex justify-between items-center w-full gap-[4px] sm:w-auto">
                        <p className="font-normal text-[13px]/[16px] tracking-tight text-[#6b6b6b] sm:hidden">
                          Quantity {item.quantity}
                        </p>
                        <p className="font-extrabold text-[16px]/[20px] tracking-tight text-primary-700 sm:min-w-[89px] sm:text-[20px]/[32px] sm:tracking-normal">
                          {formatCurrency(item.product.price * item.quantity)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        <div className="flex flex-col justify-center items-center w-full gap-[10px]">
          <div className="flex justify-between items-center w-full">
            <p className="font-bold text-[14px]/[17px] tracking-tight text-primary-700 sm:text-[16px]/[20px]">
              Order Amount
            </p>
            <p className="font-bold text-[14px]/[17px] tracking-tight text-primary-700 sm:text-[16px]/[20px]">
              {formatCurrency(totalPrice)}
            </p>
          </div>

          <div className="flex justify-between items-center w-full">
            <p className="font-bold text-[14px]/[17px] tracking-tight text-primary-700 sm:text-[16px]/[20px]">
              Shipping Fee
            </p>
            <p className="font-bold text-[14px]/[17px] tracking-tight text-primary-700 sm:text-[16px]/[20px]">
              {formatCurrency(STANDARD_DELIVERY_FEE_CENTS)}
            </p>
          </div>

          <div className="flex justify-between items-center w-full">
            <p className="font-bold text-[18px]/[22px] tracking-tight text-primary-950">Total Order Amount</p>
            <p className="font-extrabold text-[18px]/[22px] tracking-tight text-primary-950 sm:text-[24px]/[30px]">
              {formatCurrency(totalPrice ? totalPrice + STANDARD_DELIVERY_FEE_CENTS : 0)}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
