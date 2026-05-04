import React from "react";
import { useRouter } from "next/navigation";
import Mobile from "./Mobile";
import Button from "../ui/Button";
import { formatDate } from "@/lib/utils/formatDate.util";
import { formatPrice } from "@/lib/utils/formatPrice.util";
import { TOrderSummary } from "@/types/order.types";

type TRequestListProps = {
  orderRequests: TOrderSummary[];
  onClickReject: (order: TOrderSummary) => void;
  onClickApprove: (order: TOrderSummary) => void;
};

export default function RequestList({ orderRequests, onClickReject, onClickApprove }: TRequestListProps) {
  const router = useRouter();

  const handleProductNameClick = (orderId: string, status: string) => {
    router.push(`/order-manage/${orderId}?status=${status}`);
  };

  return (
    <section aria-label="Order request list" role="region">
      {/* Desktop table header */}
      <header className="flex justify-center w-full" role="banner" aria-label="Order request list header">
        <div
          className="hidden sm:flex justify-between items-center w-full max-w-[1352px] h-[100px] border-b border-neutral-200 md:px-[40px]"
          role="row"
          aria-label="Table header"
        >
          <div
            className="font-bold text-primary-500 text-base w-[100px] md:w-[142px]"
            role="columnheader"
            aria-label="Request date"
          >
            Request Date
          </div>
          <div
            className="font-bold text-primary-500 text-base w-[140px] md:w-[360px]"
            role="columnheader"
            aria-label="Product information"
          >
            Product
          </div>
          <div
            className="font-bold text-primary-500 text-base w-[100px] md:w-[142px]"
            role="columnheader"
            aria-label="Order amount"
          >
            Order Amount
          </div>
          <div
            className="font-bold text-primary-500 text-base w-[108px] md:w-[134px]"
            role="columnheader"
            aria-label="Requester"
          >
            Requester
          </div>
          <div
            className="font-bold text-primary-500 text-base w-[168px] h-[40px] flex items-center"
            role="columnheader"
            aria-label="Actions"
          >
            Actions
          </div>
        </div>
      </header>

      <main role="main" aria-label="Order request list body">
        {orderRequests.map((request) => (
          <article
            key={request.id}
            className="border-b-[1px] border-primary-100"
            role="article"
            aria-label={`${request.productName} order request`}
          >
            {/* Mobile view */}
            <Mobile>
              <div className="border-b-[1px] border-primary-100">
                <div className="flex flex-col min-w-[327px] h-[144px] gap-[20px] my-[24px]">
                  <header className="flex flex-col justify-center gap-[10px]">
                    <div className="flex justify-between items-center pr-[4px]">
                      <time
                        className="font-bold text-[14px]/[17px] tracking-tight"
                        dateTime={request.createdAt}
                        aria-label="Request date"
                      >
                        {formatDate(request.createdAt)}
                      </time>
                      <div className="flex gap-[6px] items-center">
                        <div
                          className="flex justify-center items-center w-[24px] h-[24px] rounded-full py-[6px] px-[5.5px] bg-primary-50 font-medium text-[10px]/[12px] tracking-tight"
                          role="img"
                          aria-label={`${request.requester}'s profile image`}
                        >
                          {request.requester.slice(0, 1)}
                        </div>
                        <span
                          className="font-normal text-[14px]/[17px] tracking-tight text-primary-950 truncate"
                          aria-label="Requester"
                        >
                          {request.requester}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col gap-[8px]">
                      <button
                        className="font-normal text-[14px]/[17px] tracking-tight text-blue-600 cursor-pointer hover:text-blue-800 truncate text-left inline-block w-fit"
                        onClick={() => handleProductNameClick(request.id, request.status.toLowerCase())}
                        aria-label={`View ${request.productName} details`}
                      >
                        {request.productName}
                      </button>
                      <div
                        className="font-extrabold text-[20px]/[25px] tracking-tight text-primary-950"
                        aria-label="Order amount"
                      >
                        ${formatPrice(request.productsPriceTotal + request.deliveryFee)}
                      </div>
                    </div>
                  </header>
                  <footer className="w-full justify-between flex gap-[8px]">
                    <Button
                      type="white"
                      label="Reject"
                      onClick={() => onClickReject(request)}
                      className="w-full flex justify-center items-center border-[1px] border-primary-300 min-w-[160px] h-[40px] py-[10px] px-[20px] font-normal text-[16px]/[20px] tracking-tight"
                      aria-label={`Reject ${request.productName} order request`}
                    />
                    <Button
                      type="black"
                      label="Approve"
                      onClick={() => onClickApprove(request)}
                      className="w-full flex justify-center items-center min-w-[160px] h-[40px] py-[10px] px-[20px] font-normal text-[16px]/[20px] tracking-tight"
                      aria-label={`Approve ${request.productName} order request`}
                    />
                  </footer>
                </div>
              </div>
            </Mobile>

            {/* Desktop view */}
            <div className="flex justify-center w-full">
              <div
                className="hidden sm:flex justify-between items-center w-full max-w-[1352px] h-24 md:px-[40px] border-b border-neutral-200"
                role="row"
                aria-label="Order request row"
              >
                <div
                  className="font-normal text-[16px]/[20px] tracking-tight text-primary-950 w-[100px] md:w-[142px]"
                  role="cell"
                  aria-label="Request date"
                >
                  {formatDate(request.createdAt)}
                </div>
                <button
                  className="font-normal flex text-[16px]/[20px] tracking-tight text-blue-600 w-[145px] md:w-[360px] truncate cursor-pointer hover:text-blue-800"
                  onClick={() => handleProductNameClick(request.id, request.status.toLowerCase())}
                  role="cell"
                  aria-label="Product information"
                >
                  {request.productName}
                </button>
                <div
                  className="font-normal text-[16px]/[20px] tracking-tight text-primary-950 w-[100px] md:w-[142px]"
                  role="cell"
                  aria-label="Order amount"
                >
                  ${formatPrice(request.productsPriceTotal + request.deliveryFee)}
                </div>
                <div className="flex justify-center items-center gap-[12px]" role="cell" aria-label="Requester">
                  <div
                    className="flex justify-center items-center w-[32px] h-[32px] rounded-full py-[10px] px-[9.5px] bg-primary-50 font-medium text-[10px]/[12px] tracking-tight"
                    role="img"
                    aria-label={`${request.requester}'s profile image`}
                  >
                    {request.requester.slice(0, 1)}
                  </div>
                  <span className="font-normal text-[16px]/[20px] tracking-tight text-primary-950 w-[64px] md:w-[90px] truncate">
                    {request.requester}
                  </span>
                </div>
                <div className="flex justify-center items-center gap-[8px]" role="cell" aria-label="Actions">
                  <Button
                    type="white"
                    label="Reject"
                    onClick={() => onClickReject(request)}
                    className="flex justify-center items-center border-[1px] border-primary-300 w-[80px] h-[40px] py-[10px] px-[20px] font-normal text-[16px]/[20px] tracking-tight"
                    aria-label={`Reject ${request.productName} order request`}
                  />
                  <Button
                    type="black"
                    label="Approve"
                    onClick={() => onClickApprove(request)}
                    className="flex justify-center items-center w-[80px] h-[40px] py-[10px] px-[20px] font-normal text-[16px]/[20px] tracking-tight"
                    aria-label={`Approve ${request.productName} order request`}
                  />
                </div>
              </div>
            </div>
          </article>
        ))}
      </main>
    </section>
  );
}
