import React from "react";
import type { TProduct } from "@/types/productDetail.types";
import { formatCurrency } from "@/lib/utils/currency.util";

type TProductBasicInfoProps = {
  product: TProduct;
};

export default function ProductBasicInfo({ product }: TProductBasicInfoProps) {
  return (
    <div className="inline-flex flex-col justify-start items-start gap-2">
      <div className="flex flex-col sm:flex-row justify-center items-start gap-2">
        <div
          className={`
      text-black text-lg/[22px] font-normal tracking-tight
      max-w-full
      break-words
      sm:max-w-[280px] sm:truncate sm:whitespace-nowrap sm:overflow-hidden
    `}
        >
          {product.name}
        </div>
        <div className="text-secondary-500 min-w-[50px] text-sm/[17px] font-bold tracking-tight">
          {product.cumulativeSales} sold
        </div>
      </div>
      <div className="text-black text-lg/[22px] font-extrabold tracking-tight">{formatCurrency(product.price)}</div>
    </div>
  );
}
