"use client";

import ChevronLeftIcon from "@/assets/icons/ic_chevron_left.svg";
import ChevronRightIcon from "@/assets/icons/ic_chevron_right.svg";
import Dropdown from "@/components/common/DropDown";
import NoContent from "@/components/common/NoContent";
import { useOrderHistory } from "@/hooks/useOrderHistory";
import { formatCurrency } from "@/lib/utils/currency.util";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";

type TBudgetData = {
  currentMonthBudget: number;
  previousMonthBudget: number;
  currentMonthExpense: number;
  previousMonthExpense: number;
  currentYearTotalExpense: number;
  previousYearTotalExpense: number;
};

const getProductTypeCount = (productName?: string) => {
  if (!productName) return 1;
  const match = productName.match(/and (\d+) more$/);
  return match ? Number(match[1]) + 1 : 1;
};

const OrderHistoryPage = () => {
  const router = useRouter();
  const { budgetData, currentItems, totalPages, currentPage, handlePageChange, setSortBy, formatNumber } =
    useOrderHistory("latest");

  const [isHoveredMobile, setIsHoveredMobile] = useState(false);
  const [isHoveredTablet, setIsHoveredTablet] = useState(false);
  const [isHoveredDesktop, setIsHoveredDesktop] = useState(false);

  const safeBudgetData = budgetData as TBudgetData | undefined;

  const BudgetHoverBox = ({
    className = "",
    budgetData,
  }: {
    className?: string;
    budgetData: TBudgetData | undefined;
  }) => (
    <div className={`p-6 bg-primary-800 rounded flex flex-col justify-center items-start gap-2 shadow-lg ${className}`}>
      <div className="inline-flex justify-start items-center gap-2">
        <div className="justify-center text-white text-base font-extrabold">Remaining Budget This Month:</div>
        <div className="justify-center text-white text-base font-extrabold">
          {budgetData
            ? formatNumber(budgetData.currentMonthBudget - budgetData.currentMonthExpense)
            : "Loading data..."}
        </div>
      </div>
      <div className="inline-flex justify-start items-center gap-1">
        <div className="justify-center text-white text-sm font-normal">Remaining Budget Last Month:</div>
        <div className="justify-center text-white text-sm font-normal">
          {budgetData
            ? formatNumber(budgetData.previousMonthBudget - budgetData.previousMonthExpense)
            : "Loading data..."}
        </div>
      </div>
      <div className="justify-center text-white text-sm font-normal">
        You spent{" "}
        {budgetData
          ? formatCurrency(Math.abs(budgetData.currentMonthExpense - budgetData.previousMonthExpense))
          : formatCurrency(0)}{" "}
        {budgetData && budgetData.currentMonthExpense - budgetData.previousMonthExpense > 0
          ? "more"
          : "less"}{" "}
        than last month.
      </div>
    </div>
  );

  const handleProductClick = (orderId: string) => {
    if (orderId) {
      router.push(`/order-history/${orderId}?status=approved`);
    }
  };

  const percent =
    safeBudgetData && safeBudgetData.currentMonthBudget > 0
      ? Math.round((safeBudgetData.currentMonthExpense / safeBudgetData.currentMonthBudget) * 100)
      : 0;

  const emptyOrdersContent = (
    <div className="flex flex-col justify-center items-center w-full pb-20">
      <NoContent
        title="No purchase history"
        subText1="You haven't made any purchases yet."
        subText2="Browse products and place your first order."
        buttonText="Browse Products"
        onClick={() => router.push("/products")}
        className="sm:mt-[10px] md:mt-[10px]"
      />
    </div>
  );

  return (
    <>
      {/* Mobile Layout */}
      <main
        className="min-h-screen w-full relative bg-white overflow-hidden sm:hidden"
        aria-label="Purchase history mobile view"
      >
        <header className="self-stretch flex justify-between items-center pt-6 pb-6" role="banner">
          <h1 className="text-primary-800 text-lg font-bold flex-shrink-0">Purchase History</h1>
          <nav aria-label="Sort options" className="flex-shrink-0">
            <div className="relative custom-sort-dropdown w-auto" role="region">
              <Dropdown
                options={["Newest", "Lowest Price", "Highest Price"]}
                onChange={(selectedOption: string) => {
                  if (selectedOption === "Newest") setSortBy("latest");
                  else if (selectedOption === "Lowest Price") setSortBy("priceLow");
                  else if (selectedOption === "Highest Price") setSortBy("priceHigh");
                }}
              />
            </div>
          </nav>
        </header>
        <section className="w-full flex flex-col gap-4 pb-2" aria-labelledby="budget-section-mobile">
          <h2 id="budget-section-mobile" className="sr-only">
            Budget Overview
          </h2>
          {/* Budget cards */}
          <div className="self-stretch relative flex flex-col justify-center items-start gap-4">
            <div className="self-stretch inline-flex justify-start items-start gap-4 min-w-0">
              <div className="flex-1 h-40 p-5 bg-primary-50 rounded inline-flex flex-col justify-start items-start gap-5 overflow-hidden min-w-0">
                <div className="self-stretch flex flex-col justify-start items-start gap-2.5">
                  <div className="self-stretch justify-center text-primary-800 text-base font-bold">
                    Current Month Budget
                  </div>
                  <div className="justify-center text-primary-800 text-lg font-extrabold">
                    {safeBudgetData ? formatNumber(safeBudgetData.currentMonthBudget) : formatCurrency(0)}
                  </div>
                </div>
                <div className="relative justify-center text-primary-600 text-sm font-normal">
                  Last month’s budget was{" "}
                  {safeBudgetData ? formatNumber(safeBudgetData.previousMonthBudget) : formatCurrency(0)}.
                </div>
              </div>
              <div
                className="flex-1 h-40 p-5 bg-primary-50 rounded inline-flex flex-col justify-start items-start gap-3 relative min-w-0"
                onMouseEnter={() => setIsHoveredMobile(true)}
                onMouseLeave={() => setIsHoveredMobile(false)}
                onTouchStart={() => setIsHoveredMobile(true)}
                onTouchEnd={() => setIsHoveredMobile(false)}
              >
                <div className="self-stretch flex flex-col justify-start items-start gap-2.5 overflow-hidden">
                  <div className="self-stretch justify-center text-primary-800 text-base font-bold">
                    Current Month Spending
                  </div>
                  <div className="justify-center text-primary-800 text-lg font-extrabold">
                    {safeBudgetData ? formatNumber(safeBudgetData.currentMonthExpense) : formatCurrency(0)}
                  </div>
                </div>
                <div className="justify-center text-primary-600 text-sm font-normal">
                  Last month: {safeBudgetData ? formatNumber(safeBudgetData.previousMonthExpense) : formatCurrency(0)}
                </div>
                <div className="self-stretch inline-flex justify-left items-center gap-1">
                  <div className="w-20 h-1.5 bg-primary-200 rounded-md overflow-hidden">
                    <div
                      className={`h-1.5 rounded-md ${percent > 100 ? "bg-red-500" : "bg-secondary-500"}`}
                      style={{ width: `${Math.max(1, percent)}%` }}
                    />
                  </div>
                  <div className="justify-center text-primary-800 text-xs font-normal">
                    {safeBudgetData && safeBudgetData.currentMonthBudget > 0
                      ? `${Math.max(1, Math.round((safeBudgetData.currentMonthExpense / safeBudgetData.currentMonthBudget) * 100))}%`
                      : "0%"}
                  </div>
                </div>
                {/* Mobile Hover Box */}
                {isHoveredMobile && (
                  <BudgetHoverBox
                    className="absolute w-69 left-1/2 transform -translate-x-1/2 ml-[-120px] top-37 z-50"
                    budgetData={safeBudgetData}
                  />
                )}
              </div>
            </div>
            <div className="self-stretch h-40 p-5 bg-primary-50 rounded flex flex-col justify-between items-start overflow-hidden">
              <div className="flex flex-col justify-start items-start gap-2.5">
                <div className="inline-flex justify-start items-center gap-3.5">
                  <div className="inline-flex flex-col justify-start items-start gap-2">
                    <div className="self-stretch justify-center text-primary-800 text-base font-bold">
                      Total Spending This Year
                    </div>
                  </div>
                </div>
                <div className="justify-center text-primary-800 text-lg font-extrabold">
                  {safeBudgetData ? formatNumber(safeBudgetData.currentYearTotalExpense) : formatCurrency(0)}
                </div>
              </div>
              <div className="self-stretch justify-center text-primary-600 text-sm font-normal leading-snug">
                You spent{" "}
                {safeBudgetData
                  ? formatCurrency(
                      Math.abs(safeBudgetData.currentYearTotalExpense - safeBudgetData.previousYearTotalExpense),
                    )
                  : formatCurrency(0)}
                <br />
                {safeBudgetData && safeBudgetData.currentYearTotalExpense - safeBudgetData.previousYearTotalExpense > 0
                  ? "more"
                  : "less"}{" "}
                than last year.
              </div>
            </div>

            {/* Mobile Budget Details Box */}
          </div>
        </section>
        <section className="w-full flex flex-col gap-2" aria-labelledby="purchase-list-mobile" role="list">
          <h2 id="purchase-list-mobile" className="sr-only">
            Purchase History List
          </h2>
          {/* Mobile Purchase List */}
          {currentItems.length > 0
            ? currentItems.map((item) => (
                <article
                  key={item.id}
                  className="self-stretch pb-2.5 flex flex-col justify-start items-start"
                  role="listitem"
                >
                  <div className="self-stretch py-3.5 border-b border-primary-200 inline-flex justify-between items-center">
                    <div className="flex justify-start items-center gap-2">
                      <button
                        onClick={() => handleProductClick(item.id)}
                        className="text-blue-600 cursor-pointer text-base font-bold bg-transparent border-none p-0 focus:outline-none whitespace-nowrap overflow-hidden text-ellipsis max-w-32"
                        type="button"
                        aria-label={`View details for ${item.item}`}
                      >
                        {item.item}
                      </button>
                    </div>
                    <div className="text-center justify-center text-primary-500 text-xs font-normal ml-[-100px]">
                      Total Quantity: {getProductTypeCount(item.productName)}
                    </div>
                    <div className="text-center justify-center text-primary-800 text-base font-extrabold">
                      {item.amount}
                    </div>
                  </div>
                  <div className="self-stretch flex flex-col justify-center items-start">
                    <div className="self-stretch inline-flex justify-start items-center">
                      <div className="w-36 h-12 p-2 border-r border-b border-primary-200 flex justify-start items-center gap-2">
                        <div className="text-center justify-center text-primary-800 text-sm font-normal">
                          Request Date
                        </div>
                      </div>
                      <div className="flex-1 h-12 px-4 py-2 border-b border-primary-200 flex justify-start items-center gap-2">
                        <div className="text-center justify-center text-primary-950 text-sm font-bold">
                          {item.requestDate}
                        </div>
                      </div>
                    </div>
                    <div className="self-stretch inline-flex justify-start items-center">
                      <div className="w-36 h-12 p-2 border-r border-b border-primary-200 flex justify-start items-center gap-2">
                        <div className="text-center justify-center text-primary-800 text-sm font-normal">
                          Requested By
                        </div>
                      </div>
                      <div className="flex-1 h-12 px-4 py-2 border-b border-primary-200 flex justify-start items-center gap-2">
                        <div className="text-center justify-center text-primary-950 text-sm font-bold">
                          {item.requester}
                        </div>
                        {item.status === "INSTANT_APPROVED" && (
                          <div className="px-1 py-1 bg-blue-50 rounded-[100px] flex justify-center items-center gap-1">
                            <div className="justify-center text-secondary-500 text-xs font-bold">
                              Instant Purchase
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="self-stretch flex flex-col justify-center items-start">
                    <div className="self-stretch inline-flex justify-start items-center">
                      <div className="w-36 self-stretch px-2 py-4 border-r border-b border-primary-200 flex justify-start items-start gap-2">
                        <div className="text-center justify-center text-primary-800 text-sm font-normal">
                          Approval Date
                        </div>
                      </div>
                      <div className="flex-1 self-stretch p-4 border-b border-primary-200 flex justify-start items-start gap-2">
                        <div className="text-center justify-center text-primary-950 text-sm font-bold">
                          {item.approvalDate}
                        </div>
                      </div>
                    </div>
                    <div className="self-stretch inline-flex justify-start items-start">
                      <div className="w-36 self-stretch px-2 py-4 border-r border-b border-primary-200 flex justify-start items-start gap-2">
                        <div className="text-center justify-center text-primary-800 text-sm font-normal">Approver</div>
                      </div>
                      <div className="flex-1 p-4 border-b border-primary-200 flex justify-start items-center gap-2">
                        <div className="flex-1 justify-center text-primary-950 text-sm font-bold leading-snug">
                          {item.manager}
                        </div>
                      </div>
                    </div>
                  </div>
                </article>
              ))
            : emptyOrdersContent}
        </section>
        <nav className="self-stretch h-10 flex justify-between items-center px-4" aria-label="Pagination">
          {/* Mobile Pagination */}
          <div className="text-primary-800 text-base font-normal">
            {currentPage} of {totalPages}
          </div>
          <div className="flex items-center gap-7">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="flex items-center gap-1.5 cursor-pointer disabled:cursor-default"
            >
              <div className="w-6 h-6 relative overflow-hidden">
                <Image src={ChevronLeftIcon} alt="Chevron Left" width={24} height={24} />
              </div>
              <div className="text-primary-800 text-base font-normal">Prev</div>
            </button>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="flex items-center gap-[5px] cursor-pointer disabled:cursor-default"
            >
              <div className="text-primary-800 text-base font-normal">Next</div>
              <div className="w-6 h-6 relative overflow-hidden">
                <Image src={ChevronRightIcon} alt="Chevron Right" width={24} height={24} />
              </div>
            </button>
          </div>
        </nav>
      </main>

      {/* Tablet Layout */}
      <main
        className="min-h-screen w-full relative bg-white overflow-hidden hidden sm:block md:hidden"
        aria-label="Purchase history tablet view"
      >
        <header className="self-stretch flex justify-between items-center pt-8 pb-6" role="banner">
          <h1 className="text-primary-800 text-lg font-bold flex-shrink-0">Purchase History</h1>
          <nav aria-label="Sort options" className="flex-shrink-0">
            <div className="relative custom-sort-dropdown w-auto" role="region">
              <Dropdown
                options={["Newest", "Lowest Price", "Highest Price"]}
                onChange={(selectedOption: string) => {
                  if (selectedOption === "Newest") setSortBy("latest");
                  else if (selectedOption === "Lowest Price") setSortBy("priceLow");
                  else if (selectedOption === "Highest Price") setSortBy("priceHigh");
                }}
              />
            </div>
          </nav>
        </header>
        <section className="w-full flex flex-col gap-5" aria-labelledby="budget-section-tablet">
          <h2 id="budget-section-tablet" className="sr-only">
            Budget Overview
          </h2>
          {/* Tablet Budget Cards */}
          <div className="self-stretch pb-5 inline-flex justify-start items-center gap-5">
            <div className="flex-1 min-w-0 self-stretch p-5 bg-primary-50 rounded inline-flex flex-col justify-between items-start overflow-hidden">
              <div className="self-stretch flex flex-col justify-start items-start gap-2.5">
                <div className="self-stretch justify-center text-primary-800 text-lg font-bold">
                  Current Month Budget
                </div>
                <div className="justify-center text-primary-800 text-2xl font-extrabold">
                  {safeBudgetData ? formatNumber(safeBudgetData.currentMonthBudget) : formatCurrency(0)}
                </div>
              </div>
              <div className="justify-center text-primary-600 text-base font-normal leading-relaxed">
                Last month’s budget was
                <br />
                {safeBudgetData ? formatNumber(safeBudgetData.previousMonthBudget) : formatCurrency(0)}.
              </div>
            </div>
            <div
              className="flex-1 min-w-0 self-stretch p-5 bg-primary-50 rounded inline-flex flex-col justify-between items-start relative"
              onMouseEnter={() => setIsHoveredTablet(true)}
              onMouseLeave={() => setIsHoveredTablet(false)}
              onTouchStart={() => setIsHoveredTablet(true)}
              onTouchEnd={() => setIsHoveredTablet(false)}
            >
              <div className="self-stretch flex flex-col justify-start items-start gap-2.5">
                <div className="self-stretch justify-center text-primary-800 text-lg font-bold">
                  Current Month Spending
                </div>
                <div className="justify-center text-primary-800 text-2xl font-extrabold">
                  {safeBudgetData ? formatNumber(safeBudgetData.currentMonthExpense) : formatCurrency(0)}
                </div>
              </div>
              <div className="justify-center text-primary-600 text-base font-normal">
                Last month: {safeBudgetData ? formatNumber(safeBudgetData.previousMonthExpense) : formatCurrency(0)}
              </div>
              <div className="self-stretch inline-flex justify-left items-center gap-2.5">
                <div className="w-36 h-1.5 bg-primary-200 rounded-md overflow-hidden">
                  <div
                    className={`h-1.5 rounded-md ${percent > 100 ? "bg-red-500" : "bg-secondary-500"}`}
                    style={{ width: `${Math.max(1, percent)}%` }}
                  />
                </div>
                <div className="justify-center text-primary-800 text-sm font-normal">
                  {safeBudgetData && safeBudgetData.currentMonthBudget > 0
                    ? `${Math.max(1, Math.round((safeBudgetData.currentMonthExpense / safeBudgetData.currentMonthBudget) * 100))}%`
                    : "0%"}
                </div>
              </div>
              {/* Tablet Hover Box */}
              {isHoveredTablet && (
                <BudgetHoverBox
                  className="absolute top-35 left-1/2 transform -translate-x-1/2 ml-[52px] mt-2 w-72 z-50"
                  budgetData={safeBudgetData}
                />
              )}
            </div>
            <div className="flex-1 min-w-0 self-stretch p-5 bg-primary-50 rounded inline-flex flex-col justify-between items-start overflow-hidden">
              <div className="flex flex-col justify-start items-start gap-2.5">
                <div className="inline-flex justify-start items-center gap-3.5">
                  <div className="inline-flex flex-col justify-start items-start gap-2">
                    <div className="self-stretch justify-center text-primary-800 text-lg font-bold">
                      Total Spending This Year
                    </div>
                  </div>
                </div>
                <div className="justify-center text-primary-800 text-2xl font-extrabold">
                  {safeBudgetData ? formatNumber(safeBudgetData.currentYearTotalExpense) : formatCurrency(0)}
                </div>
              </div>
              <div className="self-stretch justify-center text-primary-600 text-base font-normal leading-relaxed">
                You spent{" "}
                {safeBudgetData
                  ? formatCurrency(
                      Math.abs(safeBudgetData.currentYearTotalExpense - safeBudgetData.previousYearTotalExpense),
                    )
                  : formatCurrency(0)}
                <br />
                {safeBudgetData && safeBudgetData.currentYearTotalExpense - safeBudgetData.previousYearTotalExpense > 0
                  ? "more"
                  : "less"}{" "}
                than last year.
              </div>
            </div>
          </div>
        </section>
        <section className="w-full flex flex-col gap-2" aria-labelledby="purchase-list-tablet" role="list">
          <h2 id="purchase-list-tablet" className="sr-only">
            Purchase History List
          </h2>
          {/* Tablet Purchase List */}
          {currentItems.length > 0
            ? currentItems.map((item) => (
                <article
                  key={item.id}
                  className="self-stretch pb-5 flex flex-col justify-start items-start"
                  role="listitem"
                >
                  <div className="self-stretch py-3.5 border-b border-primary-200 inline-flex justify-between items-center">
                    <div className="flex justify-start items-center gap-2">
                      <button
                        onClick={() => handleProductClick(item.id)}
                        className="text-blue-600 cursor-pointer text-base font-bold bg-transparent border-none p-0 focus:outline-none whitespace-nowrap overflow-hidden text-ellipsis max-w-48"
                        type="button"
                      >
                        {item.item}
                      </button>
                      <div className="text-primary-500 text-xs font-normal ml-2">
                        Total Quantity: {getProductTypeCount(item.productName)}
                      </div>
                    </div>
                    <div className="text-center justify-center text-primary-800 text-base font-extrabold">
                      {item.amount}
                    </div>
                  </div>
                  <div className="self-stretch flex flex-col justify-center items-start">
                    <div className="self-stretch inline-flex justify-start items-center">
                      <div className="flex-1 flex justify-start items-center">
                        <div className="w-36 h-12 p-2 border-r border-b border-primary-200 flex justify-start items-center gap-2">
                          <div className="text-center justify-center text-primary-800 text-base font-normal">
                            Request Date
                          </div>
                        </div>
                        <div className="flex-1 h-12 px-5 py-2 border-r border-b border-primary-200 flex justify-start items-center gap-2">
                          <div className="text-center justify-center text-primary-950 text-base font-bold">
                            {item.requestDate}
                          </div>
                        </div>
                      </div>
                      <div className="flex-1 flex justify-start items-center">
                        <div className="w-36 h-12 px-5 py-2 border-r border-b border-primary-200 flex justify-start items-center gap-2">
                          <div className="text-center justify-center text-primary-800 text-base font-normal">
                            Requested By
                          </div>
                        </div>
                        <div className="flex-1 h-12 px-5 py-2 border-b border-primary-200 flex justify-start items-center gap-2">
                          <div className="flex justify-start items-center gap-2">
                            <div className="text-center justify-center text-primary-950 text-base font-bold">
                              {item.requester}
                            </div>
                            {item.status === "INSTANT_APPROVED" && (
                              <div className="px-1 py-1 bg-blue-50 rounded-[100px] flex justify-center items-center gap-1">
                                <div className="justify-center text-secondary-500 text-xs font-bold">
                                  Instant Purchase
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="self-stretch inline-flex justify-start items-center">
                      <div className="flex-1 flex justify-start items-center">
                        <div className="w-36 h-12 p-2 border-r border-b border-primary-200 flex justify-start items-center gap-2">
                          <div className="text-center justify-center text-primary-800 text-base font-normal">
                            Approval Date
                          </div>
                        </div>
                        <div className="flex-1 h-12 px-5 py-2 border-r border-b border-primary-200 flex justify-start items-center gap-2">
                          <div className="text-center justify-center text-primary-950 text-base font-bold">
                            {item.approvalDate}
                          </div>
                        </div>
                      </div>
                      <div className="flex-1 flex justify-start items-center">
                        <div className="w-36 h-12 px-5 py-2 border-r border-b border-primary-200 flex justify-start items-center gap-2">
                          <div className="text-center justify-center text-primary-800 text-base font-normal">
                            Approver
                          </div>
                        </div>
                        <div className="flex-1 h-12 px-5 py-2 border-b border-primary-200 flex justify-start items-center gap-2">
                          <div className="text-center justify-center text-primary-950 text-base font-bold">
                            {item.manager}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </article>
              ))
            : emptyOrdersContent}
        </section>
        <nav className="self-stretch h-10 flex justify-between items-center px-8" aria-label="Pagination">
          {/* Tablet Pagination */}
          <div className="text-primary-800 text-base font-normal">
            {currentPage} of {totalPages}
          </div>
          <div className="flex items-center gap-7">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="flex items-center gap-1.5 cursor-pointer disabled:cursor-default"
            >
              <div className="w-6 h-6 relative overflow-hidden">
                <Image src={ChevronLeftIcon} alt="Chevron Left" width={24} height={24} />
              </div>
              <div className="text-primary-800 text-base font-normal">Prev</div>
            </button>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="flex items-center gap-[5px] cursor-pointer disabled:cursor-default"
            >
              <div className="text-primary-800 text-base font-normal">Next</div>
              <div className="w-6 h-6 relative overflow-hidden">
                <Image src={ChevronRightIcon} alt="Chevron Right" width={24} height={24} />
              </div>
            </button>
          </div>
        </nav>
      </main>

      {/* Desktop Layout */}
      <main
        className="min-h-screen w-full relative bg-white overflow-hidden hidden md:block"
        aria-label="Purchase history desktop view"
      >
        <header className="self-stretch flex justify-between items-center pt-10 pb-8" role="banner">
          <h1 className="text-primary-800 text-lg font-bold flex-shrink-0">Purchase History</h1>
          <nav aria-label="Sort options" className="flex-shrink-0">
            <div className="relative custom-sort-dropdown w-auto" role="region">
              <Dropdown
                options={["Newest", "Lowest Price", "Highest Price"]}
                onChange={(selectedOption: string) => {
                  if (selectedOption === "Newest") setSortBy("latest");
                  else if (selectedOption === "Lowest Price") setSortBy("priceLow");
                  else if (selectedOption === "Highest Price") setSortBy("priceHigh");
                }}
              />
            </div>
          </nav>
        </header>
        <section className="w-full flex flex-col gap-7" aria-labelledby="budget-section-desktop">
          <h2 id="budget-section-desktop" className="sr-only">
            Budget Overview
          </h2>
          {/* Desktop Budget Cards */}
          <div className="self-stretch inline-flex justify-start items-center gap-7 pb-10">
            <div className="flex-1 min-w-0 self-stretch pl-7 pr-10 py-7 bg-primary-50 rounded inline-flex flex-col justify-center items-start gap-5 relative">
              <div className="self-stretch inline-flex justify-between items-start">
                <div className="justify-center text-primary-800 text-lg font-bold">Current Month Budget</div>
                <div className="justify-center text-primary-800 text-2xl font-extrabold">
                  {safeBudgetData ? formatNumber(safeBudgetData.currentMonthBudget) : formatCurrency(0)}
                </div>
              </div>
              <div className="flex flex-col justify-start items-start gap-2">
                <div className="justify-center text-primary-600 text-base font-normal leading-relaxed">
                  Last month’s budget was
                  <br />
                  {safeBudgetData ? formatNumber(safeBudgetData.previousMonthBudget) : formatCurrency(0)}.
                </div>
              </div>
            </div>
            <div
              className="flex-1 min-w-0 pl-7 pr-10 py-7 bg-primary-50 rounded inline-flex flex-col justify-start items-start gap-5 relative"
              onMouseEnter={() => setIsHoveredDesktop(true)}
              onMouseLeave={() => setIsHoveredDesktop(false)}
              onTouchStart={() => setIsHoveredDesktop(true)}
              onTouchEnd={() => setIsHoveredDesktop(false)}
            >
              <div className="self-stretch inline-flex justify-between items-start">
                <div className="flex justify-start items-center gap-3.5">
                  <div className="inline-flex flex-col justify-start items-start gap-2">
                    <div className="self-stretch justify-center text-primary-800 text-lg font-bold">
                      Current Month Spending
                    </div>
                    <div className="justify-center text-[16px] font-normal leading-normal tracking-[-0.4px] text-primary-600">
                      Last month:{" "}
                      {safeBudgetData ? formatNumber(safeBudgetData.previousMonthExpense) : formatCurrency(0)}
                    </div>
                  </div>
                </div>
                <div className="justify-center text-primary-800 text-2xl font-extrabold">
                  {safeBudgetData ? formatNumber(safeBudgetData.currentMonthExpense) : formatCurrency(0)}
                </div>
              </div>
              <div className="self-stretch inline-flex justify-left items-center gap-2.5">
                <div className="w-90 h-1.5 bg-primary-200 rounded-md overflow-hidden">
                  <div
                    className={`h-1.5 rounded-md ${percent > 100 ? "bg-red-500" : "bg-secondary-500"}`}
                    style={{ width: `${Math.max(1, percent)}%` }}
                  />
                </div>
                <div className="justify-center text-primary-800 text-sm font-normal">
                  {safeBudgetData && safeBudgetData.currentMonthBudget > 0
                    ? `${Math.max(1, Math.round((safeBudgetData.currentMonthExpense / safeBudgetData.currentMonthBudget) * 100))}%`
                    : "0%"}
                </div>
              </div>
              {/* Desktop Hover Box */}
              {isHoveredDesktop && (
                <BudgetHoverBox
                  className="absolute top-32 left-1/2 transform -translate-x-1/2 mt-2 w-72 z-50 ml-[-40px]"
                  budgetData={safeBudgetData}
                />
              )}
            </div>
            <div className="flex-1 min-w-0 self-stretch pl-7 pr-10 py-7 bg-primary-50 rounded inline-flex flex-col justify-center items-start gap-5 relative">
              <div className="self-stretch inline-flex justify-between items-center">
                <div className="flex justify-start items-center gap-3.5">
                  <div className="inline-flex flex-col justify-start items-start gap-2">
                    <div className="self-stretch justify-center text-primary-800 text-lg font-bold">
                      Total Spending This Year
                    </div>
                  </div>
                </div>
                <div className="justify-center text-primary-800 text-2xl font-extrabold">
                  {safeBudgetData ? formatNumber(safeBudgetData.currentYearTotalExpense) : formatCurrency(0)}
                </div>
              </div>
              <div className="justify-center text-primary-600 text-base font-normal leading-relaxed">
                You spent{" "}
                {safeBudgetData
                  ? formatCurrency(
                      Math.abs(safeBudgetData.currentYearTotalExpense - safeBudgetData.previousYearTotalExpense),
                    )
                  : formatCurrency(0)}{" "}
                {safeBudgetData && safeBudgetData.currentYearTotalExpense - safeBudgetData.previousYearTotalExpense > 0
                  ? "more"
                  : "less"}{" "}
                than last year.
              </div>
            </div>
          </div>
        </section>
        <section className="w-full flex flex-col gap-2 pb-5" aria-labelledby="purchase-list-desktop" role="list">
          <h2 id="purchase-list-desktop" className="sr-only">
            Purchase History List
          </h2>
          {/* Desktop Purchase List - Table Format */}
          <div className="self-stretch flex flex-col justify-start items-start">
            <div className="self-stretch px-10 py-5 border-t border-b border-primary-200 inline-flex justify-between items-center">
              <div className="w-32 justify-start text-primary-500 text-base font-bold">Request Date</div>
              <div className="w-32 justify-start text-primary-500 text-base font-bold">Requested By</div>
              <div className="w-44 justify-start text-primary-500 text-base font-bold">Product</div>
              <div className="w-32 justify-start text-primary-500 text-base font-bold">Order Total</div>
              <div className="flex justify-start items-center gap-2">
                <div className="w-32 justify-start text-primary-500 text-base font-bold">Approval Date</div>
              </div>
              <div className="w-24 justify-start text-primary-500 text-base font-bold">Approver</div>
            </div>
            <div className="self-stretch flex flex-col justify-start items-start">
              {currentItems.length > 0
                ? currentItems.map((item) => (
                    <div
                      key={item.id}
                      className="self-stretch h-24 px-10 border-b border-primary-200 inline-flex justify-between items-center"
                      role="listitem"
                    >
                      <div className="w-32 justify-start text-primary-800 text-base font-normal">
                        {item.requestDate}
                      </div>
                      <div className="w-32 flex justify-start items-center gap-2 whitespace-nowrap overflow-hidden text-ellipsis">
                        <div className="justify-start text-primary-800 text-base font-normal whitespace-nowrap overflow-hidden text-ellipsis">
                          {item.requester}
                        </div>
                        {item.status === "INSTANT_APPROVED" && (
                          <div className="px-2 py-1 bg-blue-50 rounded-[100px] flex justify-center items-center gap-1 whitespace-nowrap">
                            <div className="justify-center items-center text-center text-secondary-500 text-xs font-bold w-12 whitespace-nowrap overflow-hidden text-ellipsis">
                              Instant Purchase
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="w-44 inline-flex flex-col justify-center items-start gap-1">
                        <button
                          onClick={() => handleProductClick(item.id)}
                          className="text-blue-600 cursor-pointer text-base font-normal bg-transparent border-none p-0 focus:outline-none whitespace-nowrap overflow-hidden text-ellipsis max-w-44"
                          type="button"
                        >
                          {item.item}
                        </button>
                        <div className="justify-start text-primary-500 text-sm font-normal">
                          Total Quantity: {getProductTypeCount(item.productName)}
                        </div>
                      </div>
                      <div className="w-32 justify-start text-primary-800 text-base font-normal">
                        {item.amount}
                      </div>
                      <div className="flex justify-start items-center gap-5">
                        <div className="w-32 justify-start text-primary-800 text-base font-normal">
                          {item.approvalDate}
                        </div>
                      </div>
                      <div className="w-24 justify-start text-primary-800 text-base font-normal">{item.manager}</div>
                    </div>
                  ))
                : emptyOrdersContent}
            </div>
          </div>
        </section>
        <nav className="self-stretch h-10 flex justify-between items-center px-10" aria-label="Pagination">
          {/* Desktop Pagination */}
          <div className="flex items-center">
            <div className="text-center justify-start text-primary-800 text-base font-normal">
              {currentPage} of {totalPages}
            </div>
          </div>
          <div className="flex items-center gap-7">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="flex justify-start items-center gap-1.5 cursor-pointer disabled:cursor-default"
            >
              <div className="w-6 h-6 relative overflow-hidden">
                <Image src={ChevronLeftIcon} alt="Chevron Left" width={24} height={24} />
              </div>
              <div className="text-center justify-start text-primary-800 text-base font-normal">Prev</div>
            </button>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="flex justify-start items-center gap-[5px] cursor-pointer disabled:cursor-default"
            >
              <div className="text-center justify-start text-primary-800 text-base font-normal">Next</div>
              <div className="w-6 h-6 relative overflow-hidden">
                <Image src={ChevronRightIcon} alt="Chevron Right" width={24} height={24} />
              </div>
            </button>
          </div>
        </nav>
      </main>
    </>
  );
};

export default OrderHistoryPage;
