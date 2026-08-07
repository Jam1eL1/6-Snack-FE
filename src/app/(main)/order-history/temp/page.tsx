"use client";

import Dropdown from "@/components/common/DropDown";
import Pagination from "@/components/common/Pagination";
import { useOrderHistory } from "@/hooks/useOrderHistory";

export default function OrderHistoryTempPage() {
  const { budgetData, currentItems, totalPages, currentPage, handlePageChange, setSortBy, formatNumber } =
    useOrderHistory("latest");
  console.log("currentItems:", currentItems);
  console.log("first order:", currentItems[0]);

  const SORT_MAP = {
    Newest: "latest",
    "Price: Low": "priceLow",
    "Price: High": "priceHigh",
  } as const;

  const fields = [
    // TODO - replace values with mapped individual order
    { label: "Request Date", value: 1 },
    { label: "Requested By", value: 2 },
    { label: "Approval Date", value: 3 },
    { label: "Approver", value: 4 },
  ];

  return (
    <main className="w-full flex flex-col gap-4 sm:gap-7.5 md:gap-10 pt-6 sm:pt-7.5 md:pt-15 pb-20">
      <div className="flex justify-between w-full">
        <header className="flex items-center justify-between">
          <h1 className="text-[18px]/[22px] font-bold text-primary-950">Purchase History</h1>
        </header>
        {/* TODO add onChange callback */}
        <Dropdown
          placeholder="Sort"
          options={Object.keys(SORT_MAP)}
          onChange={(option) => setSortBy(SORT_MAP[option as keyof typeof SORT_MAP])}
        />
      </div>

      {/* This month budget three boxes */}
      <div className="grid w-full grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-5 md:gap-7.5">
        <div className="min-w-0 flex flex-col gap-5 md:gap-2 p-5 md:py-7.5 md:pl-7.5 md:pr-10 rounded bg-primary-50 min-h-[156px]">
          <div className="flex flex-col gap-2.5">
            <h2 className="text-base font-bold text-left sm:text-[18px]/[22px] text-primary-950 ">
              Current Month Budget
            </h2>
            {/* TODO - add this mo budget amt data */}
            <p className="text-lg sm:text-2xl text-left font-extrabold ">$2222{}</p>
          </div>
          {/* TODO - replace */}
          <p className="text-sm sm:text-base text-primary-600 ">
            Last month&apos;s budget <br />
            was
            {}.
          </p>
        </div>

        <div className="min-w-0 flex flex-col gap-4 md:gap-2 p-5 md:py-7.5 md:pl-7.5 md:pr-10 rounded bg-primary-50 min-h-[156px]">
          <div className="flex flex-col gap-2.5">
            <h2 className="text-base font-bold text-left sm:text-[18px]/[22px] text-primary-950 ">
              Current Month Spending
            </h2>
            {/* TODO :replace the below with actual data */}
            <p className="text-lg sm:text-2xl text-left font-extrabold ">$1,444</p>
          </div>
          {/* TODO add spent amount */}
          <p className="text-sm sm:text-base text-primary-600 ">Last Month:{}</p>
          {/* TODO ADD a progress bar base + current bar*/}
          {/* <div className="flex w-full items-center gap-1 sm:gap-2.5">
            <div
              role="progressbar"
              aria-valuenow={barPercent}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuetext={`${spendingPercent}% of monthly budget spent`}
              className="h-1.5 flex-1 overflow-hidden rounded-md bg-primary-200"
            >
              <div
                className={`h-full rounded-md ${spendingPercent > 100 ? "bg-red-500" : "bg-secondary-500"}`}
                style={{ width: `${barPercent}%` }}
              />
            </div>

            <span className="shrink-0 text-sm text-primary-800">{spendingPercent}%</span>
          </div> */}
        </div>

        <div className="col-span-2 min-w-0 sm:col-span-1 min-h-[156px] flex flex-col justify-center p-5 md:py-7.5 md:pl-7.5 md:pr-10 rounded bg-primary-50">
          <div className="flex flex-col gap-2.5">
            <h2 className="text-base font-bold text-left sm:text-[18px]/[22px] text-primary-950">
              Total Spending This Year
            </h2>
            {/* TODO :replace the below with actual data */}
            <p className="text-lg sm:text-2xl text-left font-extrabold ">$1,444</p>
          </div>
          {/* TODO - calculate {} and conditional to say more than / less than */}
          <p className="text-sm sm:text-base text-primary-600 ">You spent {} more than / less than last year.</p>
        </div>
      </div>

      {/* outer div - Order (receipt) list - need to use map to represent each data */}
      <div className="w-full">
        {/* If no order data to show, show NoContent component */}

        {/* Mobile and Tablet version - use title and grid box*/}
        <div className="flex flex-col pb-2.5 sm:pb-5 md:hidden">
          {/* title */}
          <div className="flex justify-between border-b border-primary-300 py-3.5">
            <div className="flex items-center gap-2">
              <h3 className="text-base text-primary-950 font-bold">order.title</h3>
              <span className="text-xs text-primary-500">order.totalQuantity</span>
            </div>
            <p className="text-base text-primary-950 font-extrabold">order.totalPrice</p>
          </div>
          {/* grid box  - md:hidden*/}
          <div className="grid grid-cols-2 sm:grid-cols-[150px_1fr_150px_1fr] md:hidden">
            {fields.map((f, index) => (
              <div key={f.label} className="contents">
                <span className="text-sm text-primary-950 border-r border-b border-primary-100 p-2">{f.label}</span>
                <span
                  className={`text-sm font-bold text-primary-900 border-b border-primary-100 px-4 py-2 sm:${index === 0 || index === 2 ? "border-r" : ""}`}
                >
                  {f.value}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* desktop table here - default hidden then md:block */}
        <table className="hidden md:table w-full table-fixed">
          <thead>
            <tr className="font-bold text-base text-primary-500">
              {["Request Date", "Requested By", "Product", "Order Total", "Approval Date", "Approver"].map((h) => (
                <th key={h} className="py-[10px] text-left">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              {/* {cells.map((cell, i) => (
                <td key={i} className="py-[10px]">
                  {cell}
                </td>
              ))} */}
            </tr>
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
    </main>
  );
}
