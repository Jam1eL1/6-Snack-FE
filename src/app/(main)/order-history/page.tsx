"use client";

import ChevronLeftIcon from "@/assets/icons/ic_chevron_left.svg";
import ChevronRightIcon from "@/assets/icons/ic_chevron_right.svg";
import Dropdown from "@/components/common/DropDown";
import NoContent from "@/components/common/NoContent";
import { useOrderHistory } from "@/hooks/useOrderHistory";
import { formatPrice } from "@/lib/utils/formatPrice.util";
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
  const match = productName.match(/외 (\d+)건/);
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
        <div className="justify-center text-white text-base font-extrabold">이번 달 남은 예산:</div>
        <div className="justify-center text-white text-base font-extrabold">
          {budgetData
            ? formatNumber(budgetData.currentMonthBudget - budgetData.currentMonthExpense)
            : "데이터 로딩 중..."}
        </div>
      </div>
      <div className="inline-flex justify-start items-center gap-1">
        <div className="justify-center text-white text-sm font-normal">지난 달 남은 예산:</div>
        <div className="justify-center text-white text-sm font-normal">
          {budgetData
            ? formatNumber(budgetData.previousMonthBudget - budgetData.previousMonthExpense)
            : "데이터 로딩 중..."}
        </div>
      </div>
      <div className="justify-center text-white text-sm font-normal">
        지난 달보다{" "}
        {budgetData ? formatPrice(Math.abs(budgetData.currentMonthExpense - budgetData.previousMonthExpense)) : "0"}원{" "}
        {budgetData && budgetData.currentMonthExpense - budgetData.previousMonthExpense > 0
          ? "더 사용했어요"
          : "덜 사용했어요"}
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
        title="구매 내역이 없어요"
        subText1="아직 구매한 내역이 없습니다."
        subText2="상품을 둘러보고 첫 주문을 진행해 보세요."
        buttonText="상품 보러가기"
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
        aria-label="구매 내역 모바일 화면"
      >
        <header className="self-stretch flex justify-between items-center px-4 pt-6 pb-6" role="banner">
          <h1 className="text-primary-800 text-lg font-bold flex-shrink-0">구매 내역 확인</h1>
          <nav aria-label="정렬 옵션" className="flex-shrink-0">
            <div className="relative custom-sort-dropdown w-auto" role="region">
              <Dropdown
                options={["Newest", "Lowest Price", "Highest Price"]}
                onChange={(selectedOption: string) => {
                  if (selectedOption === "최신순") setSortBy("latest");
                  else if (selectedOption === "낮은 가격순") setSortBy("priceLow");
                  else if (selectedOption === "높은 가격순") setSortBy("priceHigh");
                }}
              />
            </div>
          </nav>
        </header>
        <section className="w-full flex flex-col gap-4 px-4 pb-2" aria-labelledby="budget-section-mobile">
          <h2 id="budget-section-mobile" className="sr-only">
            예산 현황
          </h2>
          {/* 예산 카드 */}
          <div className="self-stretch relative flex flex-col justify-center items-start gap-4">
            <div className="self-stretch inline-flex justify-start items-start gap-4 min-w-0">
              <div className="flex-1 h-40 p-5 bg-primary-50 rounded inline-flex flex-col justify-start items-start gap-5 overflow-hidden min-w-0">
                <div className="self-stretch flex flex-col justify-start items-start gap-2.5">
                  <div className="self-stretch justify-center text-primary-800 text-base font-bold">이번 달 예산</div>
                  <div className="justify-center text-primary-800 text-lg font-extrabold">
                    {safeBudgetData ? formatNumber(safeBudgetData.currentMonthBudget) : "0원"}
                  </div>
                </div>
                <div className="relative justify-center text-primary-600 text-sm font-normal">
                  지난 달 예산은 {safeBudgetData ? formatNumber(safeBudgetData.previousMonthBudget) : "0원"}이었어요
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
                  <div className="self-stretch justify-center text-primary-800 text-base font-bold">이번 달 지출액</div>
                  <div className="justify-center text-primary-800 text-lg font-extrabold">
                    {safeBudgetData ? formatNumber(safeBudgetData.currentMonthExpense) : "0원"}
                  </div>
                </div>
                <div className="justify-center text-primary-600 text-sm font-normal">
                  지난 달: {safeBudgetData ? formatNumber(safeBudgetData.previousMonthExpense) : "0원"}
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
                      올해 총 지출액
                    </div>
                  </div>
                </div>
                <div className="justify-center text-primary-800 text-lg font-extrabold">
                  {safeBudgetData ? formatNumber(safeBudgetData.currentYearTotalExpense) : "0원"}
                </div>
              </div>
              <div className="self-stretch justify-center text-primary-600 text-sm font-normal leading-snug">
                작년보다{" "}
                {safeBudgetData
                  ? formatPrice(
                      Math.abs(safeBudgetData.currentYearTotalExpense - safeBudgetData.previousYearTotalExpense),
                    )
                  : "0"}
                원<br />
                {safeBudgetData && safeBudgetData.currentYearTotalExpense - safeBudgetData.previousYearTotalExpense > 0
                  ? "더 지출했어요"
                  : "덜 지출했어요"}
              </div>
            </div>

            {/* Mobile Budget Details Box */}
          </div>
        </section>
        <section className="w-full flex flex-col gap-2 px-4" aria-labelledby="purchase-list-mobile" role="list">
          <h2 id="purchase-list-mobile" className="sr-only">
            구매 내역 목록
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
                        aria-label={`${item.item} 상세보기로 이동`}
                      >
                        {item.item}
                      </button>
                    </div>
                    <div className="text-center justify-center text-primary-500 text-xs font-normal ml-[-100px]">
                      총 수량 {getProductTypeCount(item.productName)}개
                    </div>
                    <div className="text-center justify-center text-primary-800 text-base font-extrabold">
                      {parseInt(item.amount.replace(/[^0-9]/g, "")).toLocaleString()}원
                    </div>
                  </div>
                  <div className="self-stretch flex flex-col justify-center items-start">
                    <div className="self-stretch inline-flex justify-start items-center">
                      <div className="w-36 h-12 p-2 border-r border-b border-primary-200 flex justify-start items-center gap-2">
                        <div className="text-center justify-center text-primary-800 text-sm font-normal">
                          구매 요청일
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
                        <div className="text-center justify-center text-primary-800 text-sm font-normal">요청인</div>
                      </div>
                      <div className="flex-1 h-12 px-4 py-2 border-b border-primary-200 flex justify-start items-center gap-2">
                        <div className="text-center justify-center text-primary-950 text-sm font-bold">
                          {item.requester}
                        </div>
                        {item.status === "INSTANT_APPROVED" && (
                          <div className="px-1 py-1 bg-blue-50 rounded-[100px] flex justify-center items-center gap-1">
                            <div className="justify-center text-secondary-500 text-xs font-bold">즉시 구매</div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="self-stretch flex flex-col justify-center items-start">
                    <div className="self-stretch inline-flex justify-start items-center">
                      <div className="w-36 self-stretch px-2 py-4 border-r border-b border-primary-200 flex justify-start items-start gap-2">
                        <div className="text-center justify-center text-primary-800 text-sm font-normal">
                          구매 승인일
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
                        <div className="text-center justify-center text-primary-800 text-sm font-normal">담당자</div>
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
        <nav className="self-stretch h-10 flex justify-between items-center px-4" aria-label="페이지 이동">
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
        aria-label="구매 내역 태블릿 화면"
      >
        <header className="self-stretch flex justify-between items-center pt-8 px-8 pb-6" role="banner">
          <h1 className="text-primary-800 text-lg font-bold flex-shrink-0">구매 내역 확인</h1>
          <nav aria-label="정렬 옵션" className="flex-shrink-0">
            <div className="relative custom-sort-dropdown w-auto" role="region">
              <Dropdown
                options={["Newest", "Lowest Price", "Highest Price"]}
                onChange={(selectedOption: string) => {
                  if (selectedOption === "최신순") setSortBy("latest");
                  else if (selectedOption === "낮은 가격순") setSortBy("priceLow");
                  else if (selectedOption === "높은 가격순") setSortBy("priceHigh");
                }}
              />
            </div>
          </nav>
        </header>
        <section className="w-full flex flex-col gap-5 px-8" aria-labelledby="budget-section-tablet">
          <h2 id="budget-section-tablet" className="sr-only">
            예산 현황
          </h2>
          {/* Tablet Budget Cards */}
          <div className="self-stretch pb-5 inline-flex justify-start items-center gap-5">
            <div className="flex-1 min-w-0 self-stretch p-5 bg-primary-50 rounded inline-flex flex-col justify-between items-start overflow-hidden">
              <div className="self-stretch flex flex-col justify-start items-start gap-2.5">
                <div className="self-stretch justify-center text-primary-800 text-lg font-bold">이번 달 예산</div>
                <div className="justify-center text-primary-800 text-2xl font-extrabold">
                  {safeBudgetData ? formatNumber(safeBudgetData.currentMonthBudget) : "0원"}
                </div>
              </div>
              <div className="justify-center text-primary-600 text-base font-normal leading-relaxed">
                지난 달 예산은
                <br />
                {safeBudgetData ? formatNumber(safeBudgetData.previousMonthBudget) : "0원"}이었어요
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
                <div className="self-stretch justify-center text-primary-800 text-lg font-bold">이번 달 지출액</div>
                <div className="justify-center text-primary-800 text-2xl font-extrabold">
                  {safeBudgetData ? formatNumber(safeBudgetData.currentMonthExpense) : "0원"}
                </div>
              </div>
              <div className="justify-center text-primary-600 text-base font-normal">
                지난 달: {safeBudgetData ? formatNumber(safeBudgetData.previousMonthExpense) : "0원"}
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
                    <div className="self-stretch justify-center text-primary-800 text-lg font-bold">올해 총 지출액</div>
                  </div>
                </div>
                <div className="justify-center text-primary-800 text-2xl font-extrabold">
                  {safeBudgetData ? formatNumber(safeBudgetData.currentYearTotalExpense) : "0원"}
                </div>
              </div>
              <div className="self-stretch justify-center text-primary-600 text-base font-normal leading-relaxed">
                작년보다{" "}
                {safeBudgetData
                  ? formatPrice(
                      Math.abs(safeBudgetData.currentYearTotalExpense - safeBudgetData.previousYearTotalExpense),
                    )
                  : "0"}
                원<br />
                {safeBudgetData && safeBudgetData.currentYearTotalExpense - safeBudgetData.previousYearTotalExpense > 0
                  ? "더 지출했어요"
                  : "덜 지출했어요"}
              </div>
            </div>
          </div>
        </section>
        <section className="w-full flex flex-col gap-2 px-8" aria-labelledby="purchase-list-tablet" role="list">
          <h2 id="purchase-list-tablet" className="sr-only">
            구매 내역 목록
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
                        총 수량 {getProductTypeCount(item.productName)}개
                      </div>
                    </div>
                    <div className="text-center justify-center text-primary-800 text-base font-extrabold">
                      {parseInt(item.amount.replace(/[^0-9]/g, "")).toLocaleString()}원
                    </div>
                  </div>
                  <div className="self-stretch flex flex-col justify-center items-start">
                    <div className="self-stretch inline-flex justify-start items-center">
                      <div className="flex-1 flex justify-start items-center">
                        <div className="w-36 h-12 p-2 border-r border-b border-primary-200 flex justify-start items-center gap-2">
                          <div className="text-center justify-center text-primary-800 text-base font-normal">
                            구매 요청일
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
                            요청인
                          </div>
                        </div>
                        <div className="flex-1 h-12 px-5 py-2 border-b border-primary-200 flex justify-start items-center gap-2">
                          <div className="flex justify-start items-center gap-2">
                            <div className="text-center justify-center text-primary-950 text-base font-bold">
                              {item.requester}
                            </div>
                            {item.status === "INSTANT_APPROVED" && (
                              <div className="px-1 py-1 bg-blue-50 rounded-[100px] flex justify-center items-center gap-1">
                                <div className="justify-center text-secondary-500 text-xs font-bold">즉시 구매</div>
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
                            구매 승인일
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
                            담당자
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
        <nav className="self-stretch h-10 flex justify-between items-center px-8" aria-label="페이지 이동">
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
        aria-label="구매 내역 데스크탑 화면"
      >
        <header className="self-stretch flex justify-between items-center pt-10 px-10 pb-8" role="banner">
          <h1 className="text-primary-800 text-lg font-bold flex-shrink-0">구매 내역 확인</h1>
          <nav aria-label="정렬 옵션" className="flex-shrink-0">
            <div className="relative custom-sort-dropdown w-auto" role="region">
              <Dropdown
                options={["Newest", "Lowest Price", "Highest Price"]}
                onChange={(selectedOption: string) => {
                  if (selectedOption === "최신순") setSortBy("latest");
                  else if (selectedOption === "낮은 가격순") setSortBy("priceLow");
                  else if (selectedOption === "높은 가격순") setSortBy("priceHigh");
                }}
              />
            </div>
          </nav>
        </header>
        <section className="w-full flex flex-col gap-7 px-10" aria-labelledby="budget-section-desktop">
          <h2 id="budget-section-desktop" className="sr-only">
            예산 현황
          </h2>
          {/* Desktop Budget Cards */}
          <div className="self-stretch inline-flex justify-start items-center gap-7 pb-10">
            <div className="flex-1 min-w-0 self-stretch pl-7 pr-10 py-7 bg-primary-50 rounded inline-flex flex-col justify-center items-start gap-5 relative">
              <div className="self-stretch inline-flex justify-between items-start">
                <div className="justify-center text-primary-800 text-lg font-bold">이번 달 예산</div>
                <div className="justify-center text-primary-800 text-2xl font-extrabold">
                  {safeBudgetData ? formatNumber(safeBudgetData.currentMonthBudget) : "0원"}
                </div>
              </div>
              <div className="flex flex-col justify-start items-start gap-2">
                <div className="justify-center text-primary-600 text-base font-normal leading-relaxed">
                  지난 달 예산은
                  <br />
                  {safeBudgetData ? formatNumber(safeBudgetData.previousMonthBudget) : "0원"}이었어요
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
                    <div className="self-stretch justify-center text-primary-800 text-lg font-bold">이번 달 지출액</div>
                    <div className="justify-center text-[16px] font-normal leading-normal tracking-[-0.4px] text-primary-600">
                      지난 달 지출액: {safeBudgetData ? formatNumber(safeBudgetData.previousMonthExpense) : "0원"}
                    </div>
                  </div>
                </div>
                <div className="justify-center text-primary-800 text-2xl font-extrabold">
                  {safeBudgetData ? formatNumber(safeBudgetData.currentMonthExpense) : "0원"}
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
                    <div className="self-stretch justify-center text-primary-800 text-lg font-bold">올해 총 지출액</div>
                  </div>
                </div>
                <div className="justify-center text-primary-800 text-2xl font-extrabold">
                  {safeBudgetData ? formatNumber(safeBudgetData.currentYearTotalExpense) : "0원"}
                </div>
              </div>
              <div className="justify-center text-primary-600 text-base font-normal leading-relaxed">
                올해 작년보다
                <br />
                {safeBudgetData
                  ? formatPrice(
                      Math.abs(safeBudgetData.currentYearTotalExpense - safeBudgetData.previousYearTotalExpense),
                    )
                  : "0"}
                원{" "}
                {safeBudgetData && safeBudgetData.currentYearTotalExpense - safeBudgetData.previousYearTotalExpense > 0
                  ? "더 지출했어요"
                  : "덜 지출했어요"}
              </div>
            </div>
          </div>
        </section>
        <section className="w-full flex flex-col gap-2 px-10 pb-5" aria-labelledby="purchase-list-desktop" role="list">
          <h2 id="purchase-list-desktop" className="sr-only">
            구매 내역 목록
          </h2>
          {/* Desktop Purchase List - Table Format */}
          <div className="self-stretch flex flex-col justify-start items-start">
            <div className="self-stretch px-10 py-5 border-t border-b border-primary-200 inline-flex justify-between items-center">
              <div className="w-32 justify-start text-primary-500 text-base font-bold">구매 요청일</div>
              <div className="w-32 justify-start text-primary-500 text-base font-bold">요청인</div>
              <div className="w-44 justify-start text-primary-500 text-base font-bold">상품 정보</div>
              <div className="w-32 justify-start text-primary-500 text-base font-bold">주문 금액</div>
              <div className="flex justify-start items-center gap-2">
                <div className="w-32 justify-start text-primary-500 text-base font-bold">구매 승인일</div>
              </div>
              <div className="w-24 justify-start text-primary-500 text-base font-bold">담당자</div>
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
                              즉시 구매
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
                          총 수량 {getProductTypeCount(item.productName)}개
                        </div>
                      </div>
                      <div className="w-32 justify-start text-primary-800 text-base font-normal">
                        {parseInt(item.amount.replace(/[^0-9]/g, "")).toLocaleString()}원
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
        <nav className="self-stretch h-10 flex justify-between items-center px-10" aria-label="페이지 이동">
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
