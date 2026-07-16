"use client";

import { useState } from "react";
import Image from "next/image";
import ArrowIconSvg from "@/components/svg/ArrowIconSvg";
import { formatCurrency } from "@/lib/utils/currency.util";

type TProduct = {
  id: number;
  productName: string;
  price: number;
  quantity: number;
  imageUrl?: string;
};

type TReceipt = {
  id: number;
  productName: string;
  price: number;
  quantity: number;
  imageUrl?: string;
  productId: number;
};

type TOrderItemsSectionProps = {
  products?: TProduct[];
  receipts?: TReceipt[];
  title?: string;
  productsPriceTotal: number;
  shippingFee: number;
};

export default function OrderItemsSection({
  products,
  receipts,
  title = "Purchased Items",
  productsPriceTotal,
  shippingFee,
}: TOrderItemsSectionProps) {
  const [isItemsExpanded, setIsItemsExpanded] = useState<boolean>(true);

  const items = products || receipts || [];
  const finalTotal: number = productsPriceTotal + shippingFee;

  return (
    <div className="self-stretch flex flex-col justify-start items-start gap-10">
      <div className="self-stretch flex flex-col justify-start items-start gap-[15px]">
        <div
          className="inline-flex justify-start items-start gap-1.5 cursor-pointer"
          onClick={() => setIsItemsExpanded(!isItemsExpanded)}
        >
          <div className="justify-center text-primary-950 text-base font-bold">
            {title}
          </div>
          <div className="justify-center text-primary-950 text-base font-normal">
            {items.length} items
          </div>
          <ArrowIconSvg direction={isItemsExpanded ? "up" : "down"} className="w-5 h-5 text-primary-950 relative z-[110]" />
        </div>

        {isItemsExpanded && (
          <div className="self-stretch bg-white rounded-sm sm:shadow-[0px_2px_8px_0px_rgba(0,0,0,0.1)] md:shadow-[0px_2px_8px_0px_rgba(0,0,0,0.1)] flex flex-col justify-start items-start gap-5 sm:px-5 sm:pt-5 sm:pb-[30px] md:px-[60px] md:py-[40px]">
            {/* Items List */}
            <div className="self-stretch flex flex-col justify-start items-start gap-[16px] sm:gap-0">
              {items.map((item: TProduct | TReceipt) => (
                <div
                  key={item.id}
                  className="self-stretch border-b border-primary-200 inline-flex justify-between items-center pb-[8px] sm:pb-0 sm:pr-5"
                >
                  <div className="flex gap-5 flex-1 sm:flex sm:justify-start sm:items-center sm:gap-5">
                    <div className="w-[72px] sm:w-[140px] h-[72px] sm:h-[140px] bg-primary-50 rounded-xs sm:bg-white flex justify-center items-center flex-shrink-0">
                      {item.imageUrl && (
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
                    <div className="flex-1 inline-flex flex-col items-start gap-2 sm:justify-start sm:inline-flex sm:flex-col sm:justify-start sm:items-start sm:gap-3">
                      <div className="flex flex-col justify-center items-start gap-1 sm:justify-start sm:gap-2.5">
                        <div className="text-center justify-center text-primary-950 text-sm sm:text-base font-medium">
                          {item.productName}
                        </div>
                        <div className="justify-start text-primary-950 text-sm sm:text-base font-bold">
                          {formatCurrency(item.price)}
                        </div>
                      </div>
                      <div className="flex justify-between items-center w-full sm:justify-start sm:flex sm:justify-start">
                        <div className="justify-center text-primary-500 text-[13px] sm:text-base font-bold">
                          Quantity {item.quantity}
                        </div>
                        <div className="text-center justify-center text-primary-700 text-base font-bold sm:hidden">
                          {formatCurrency(item.price * item.quantity)}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="hidden sm:block text-center justify-center text-primary-700 text-[20px] font-extrabold">
                    {formatCurrency(item.price * item.quantity)}
                  </div>
                </div>
              ))}
            </div>

            {/* Order Amount Info */}
            <div className="self-stretch flex flex-col gap-3 sm:gap-[7px] sm:px-5">
              <div className="flex justify-between items-center">
                <div className="text-center justify-center text-primary-700 text-sm sm:text-base font-bold">
                  Order Amount
                </div>
                <div className="text-center justify-center text-primary-700 text-sm sm:text-base font-bold">
                  {formatCurrency(productsPriceTotal)}
                </div>
              </div>
              <div className="flex justify-between items-center">
                <div className="text-center justify-center text-primary-700 text-sm sm:text-base font-bold">
                  Shipping Fee
                </div>
                <div className="text-center justify-center text-primary-700 text-sm sm:text-base font-bold">
                  {formatCurrency(shippingFee)}
                </div>
              </div>
              <div className="flex justify-between items-center">
                <div className="text-center justify-center text-primary-950 text-lg sm:text-lg font-bold">
                  Total
                </div>
                <div className="text-center justify-center text-primary-950 text-lg sm:text-2xl font-bold sm:font-extrabold">
                  {formatCurrency(finalTotal)}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 
