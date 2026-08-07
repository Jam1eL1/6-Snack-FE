"use client";

import DogSpinner from "@/components/common/DogSpinner";
import Dropdown from "@/components/common/DropDown";
import NoContent from "@/components/common/NoContent";
import Pagination from "@/components/common/Pagination";
import { useOrderHistory } from "@/hooks/useOrderHistory";
import { formatCurrency } from "@/lib/utils/currency.util";
import { toOrderHistoryRow } from "@/lib/utils/orderHistory.util";
import type { TOrderSort } from "@/types/order.types";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function OrderHistoryPage() {
  const ITEMS_PER_PAGE = 4;

  const [currentPage, setCurrentPage] = useState(1);
  const [orderBy, setOrderBy] = useState<TOrderSort>("latest");
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  const { ordersQuery, budgetQuery } = useOrderHistory({ offset, limit: ITEMS_PER_PAGE, orderBy });
  const orders = ordersQuery.data?.orders ?? [];
  const totalPages = ordersQuery.data?.meta.totalPages ?? 0;
  const budget = budgetQuery.data;
  const router = useRouter();

  const SORT_MAP = {
    Newest: "latest",
    "Price: Low": "priceLow",
    "Price: High": "priceHigh",
  } as const;

  const rows = orders.map(toOrderHistoryRow);
  const isLoading = ordersQuery.isPending || budgetQuery.isPending;
  const isError = ordersQuery.isError || budgetQuery.isError;
  if (isLoading) {
    return (
      <div className="flex min-h-80 items-center justify-center">
        <DogSpinner />
      </div>
    );
  }

  if (isError || !budget) {
    return (
      <p role="alert" className="py-10 text-center text-red-600">
        Unable to load purchase history.
      </p>
    );
  }
  const yearlyDifference = budget.currentYearTotalExpense - budget.previousYearTotalExpense;

  const yearlyComparison = yearlyDifference > 0 ? "more" : yearlyDifference < 0 ? "less" : "equal";
  const hasMonthlyBudget = budget.currentMonthBudget > 0;
  const spendingPercent = hasMonthlyBudget
    ? Math.round((budget.currentMonthExpense / budget.currentMonthBudget) * 100)
    : 0;

  const progressWidth = Math.min(Math.max(spendingPercent, 0), 100);
  const isOverBudget = spendingPercent > 100;

  return (
    <main className="w-full flex flex-col gap-4 sm:gap-7.5 md:gap-10 pt-6 sm:pt-7.5 md:pt-15 pb-20">
      <header className="flex justify-between items-center w-full">
        <h1 className="text-[18px]/[22px] font-bold text-primary-950">Purchase History</h1>
        <Dropdown
          placeholder="Sort"
          options={Object.keys(SORT_MAP)}
          onChange={(option) => {
            setOrderBy(SORT_MAP[option as keyof typeof SORT_MAP]);
            setCurrentPage(1);
          }}
        />
      </header>

      <div className="grid w-full grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-5 md:gap-7.5">
        <div className="min-w-0 flex flex-col gap-5 md:gap-2 p-5 md:py-7.5 md:pl-7.5 md:pr-10 rounded bg-primary-50 min-h-[156px]">
          <div className="flex flex-col gap-2.5">
            <h2 className="text-base font-bold text-left sm:text-[18px]/[22px] text-primary-950 ">
              Current Month Budget
            </h2>
            <p className="text-lg sm:text-2xl text-left font-extrabold ">{formatCurrency(budget.currentMonthBudget)}</p>
          </div>

          <p className="text-sm sm:text-base text-primary-600 ">
            Last month&apos;s budget was <br />
            {formatCurrency(budget.previousMonthBudget)}.
          </p>
        </div>

        <div className="min-w-0 flex flex-col gap-4 md:gap-2 p-5 md:py-7.5 md:pl-7.5 md:pr-10 rounded bg-primary-50 min-h-[156px]">
          <div className="flex flex-col gap-2.5">
            <h2 className="text-base font-bold text-left sm:text-[18px]/[22px] text-primary-950 ">
              Current Month Spending
            </h2>
            <p className="text-lg sm:text-2xl text-left font-extrabold ">
              {formatCurrency(budget.currentMonthExpense)}
            </p>
          </div>
          <p className="text-sm sm:text-base text-primary-600 ">
            Last Month: {formatCurrency(budget.previousMonthExpense)}
          </p>
          <div className="flex w-full items-center gap-1 sm:gap-2.5">
            <div
              role="progressbar"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={progressWidth}
              aria-valuetext={hasMonthlyBudget ? `${spendingPercent}% of monthly budget spent` : "No monthly budget"}
              className="h-1.5 flex-1 overflow-hidden rounded-md bg-primary-200"
            >
              <div
                className={`h-full rounded-md ${isOverBudget ? "bg-red-500" : "bg-secondary-500"}`}
                style={{ width: `${progressWidth}%` }}
              />
            </div>

            <span className="shrink-0 text-sm text-primary-800">
              {hasMonthlyBudget ? `${spendingPercent}%` : "No budget"}
            </span>
          </div>
        </div>

        <div className="col-span-2 min-w-0 sm:col-span-1 min-h-[156px] flex flex-col justify-between p-5 md:py-7.5 md:pl-7.5 md:pr-10 rounded bg-primary-50">
          <div className="flex flex-col gap-2.5">
            <h2 className="text-base font-bold text-left sm:text-[18px]/[22px] text-primary-950">
              Total Spending This Year
            </h2>

            <p className="text-lg sm:text-2xl text-left font-extrabold ">
              {formatCurrency(budget.currentYearTotalExpense)}
            </p>
          </div>
          {yearlyComparison === "equal" ? (
            <p className="text-sm sm:text-base text-primary-600">You spent the same as last year.</p>
          ) : (
            <p className="text-sm sm:text-base text-primary-600">
              You spent {formatCurrency(Math.abs(yearlyDifference))} {yearlyComparison} than last year.
            </p>
          )}
        </div>
      </div>

      {/* outer div - Order (receipt) list - need to use map to represent each data */}
      <div className="w-full">
        {orders.length === 0 ? (
          <NoContent
            title="No purchase history"
            subText1="No approved purchases were found."
            buttonText="Browse Products"
            onClick={() => router.push("/products")}
          />
        ) : (
          <>
            {/* Mobile and Tablet version - use title and grid box*/}
            <div className="md:hidden">
              {rows.map((row) => {
                const fields = [
                  { label: "Request Date", value: row.requestDate },
                  { label: "Requested By", value: row.requester },
                  { label: "Approval Date", value: row.approvalDate },
                  { label: "Approver", value: row.approver },
                ];
                return (
                  <article key={row.id} className="flex flex-col pb-2.5 sm:pb-5">
                    <div className="flex justify-between border-b border-primary-300 py-3.5">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/order-history/${row.id}?status=approved`}
                          className="text-blue-600  hover:text-blue-800 hover:underline text-base font-bold"
                        >
                          {row.productName}
                        </Link>
                      </div>
                      <p className="text-base text-primary-950 font-extrabold">{row.orderTotal}</p>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-[150px_1fr_150px_1fr]">
                      {fields.map((f, index) => (
                        <div key={f.label} className="contents">
                          <span className="text-sm text-primary-950 border-r border-b border-primary-100 p-2">
                            {f.label}
                          </span>
                          <span
                            className={`text-sm font-bold text-primary-900 border-b border-primary-100 px-4 py-2 ${index === 0 || index === 2 ? "sm:border-r" : ""}`}
                          >
                            {f.value}
                          </span>
                        </div>
                      ))}
                    </div>
                  </article>
                );
              })}
            </div>

            {/* desktop table here - default hidden then md:block */}
            <table className="hidden md:table w-full table-fixed">
              <thead>
                <tr className="font-bold text-base text-primary-500 border-primary-100 border-t border-b  text-center">
                  {["Request Date", "Requested By", "Product", "Order Total", "Approval Date", "Approver"].map((h) => (
                    <th key={h} className="py-5">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => {
                  const cells = [
                    { key: "requestDate", content: row.requestDate },
                    { key: "requester", content: row.requester },
                    {
                      key: "product",
                      content: (
                        <Link
                          href={`/order-history/${row.id}?status=approved`}
                          className="text-blue-600 hover:text-blue-800 hover:underline"
                        >
                          {row.productName}
                        </Link>
                      ),
                    },
                    { key: "total", content: row.orderTotal },
                    { key: "approvalDate", content: row.approvalDate },
                    { key: "approver", content: row.approver },
                  ];
                  return (
                    <tr key={row.id} className="text-base text-primary-950 text-center border-b border-primary-100">
                      {cells.map((cell) => (
                        <td key={cell.key} className="py-10">
                          {cell.content}
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 0 && <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />}
    </main>
  );
}
