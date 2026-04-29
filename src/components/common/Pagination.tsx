"use client";

import { useState, useEffect } from "react";
import { TPaginationProps } from "../../types/pagination.types";
import ArrowIconSvg from "../svg/ArrowIconSvg";

/**
 * Pagination component.
 *
 * @description
 * - Uses compact sizing below 744px and larger sizing at 744px and above.
 * - Disables Prev on the first page.
 * - Disables Next on the last page.
 * - Falls back to onPageChange when onPrevPage or onNextPage is not provided.
 *
 * @example
 * ```tsx
 * import Pagination from "@/components/common/Pagination";
 *
 * const MyPage = () => {
 *   const [currentPage, setCurrentPage] = useState(1);
 *   const totalPages = 10;
 *
 *   const handlePageChange = (page: number) => {
 *     setCurrentPage(page);
 *     // Load page data.
 *   };
 *
 *   return (
 *     <Pagination
 *       currentPage={currentPage}
 *       totalPages={totalPages}
 *       onPageChange={handlePageChange}
 *     />
 *   );
 * };
 * ```
 */
export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  onPrevPage,
  onNextPage,
  className = "",
}: TPaginationProps) {
  const [isTablet, setIsTablet] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsTablet(window.innerWidth >= 744);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  const isFirstPage = currentPage === 1;
  const isLastPage = currentPage === totalPages;

  const handlePrevPage = () => {
    if (!isFirstPage) {
      if (onPrevPage) {
        onPrevPage();
      } else {
        onPageChange(currentPage - 1);
      }
    }
  };

  const handleNextPage = () => {
    if (!isLastPage) {
      if (onNextPage) {
        onNextPage();
      } else {
        onPageChange(currentPage + 1);
      }
    }
  };

  return (
    <div className={`w-full h-10 relative ${className}`}>
      <div className="w-full h-10 inline-flex justify-between items-center py-[11.5px]">
        {/* Page count */}
        <div
          className={`text-center justify-start text-primary-950 font-normal  ${isTablet ? "text-xl" : "text-lg"}`}
        >
          {currentPage} of {totalPages}
        </div>

        {/* Navigation */}
        <div className="flex justify-start items-center gap-10">
          {/* Previous page */}
          <div
            className={`flex justify-start items-center gap-1.5 ${
              isFirstPage ? "cursor-default opacity-50" : "cursor-pointer hover:opacity-80"
            }`}
            onClick={handlePrevPage}
          >
            <ArrowIconSvg
              direction="left"
              disabled={isFirstPage}
              className={isFirstPage ? "text-primary-500" : "text-primary-950"}
            />
            <div
              className={`text-center justify-start ${isFirstPage ? "text-primary-500" : "text-primary-950"} font-normal  ${isTablet ? "text-lg" : "text-base"}`}
            >
              Prev
            </div>
          </div>

          {/* Next page */}
          <div
            className={`flex justify-start items-center gap-[5px] ${
              isLastPage ? "cursor-default opacity-50" : "cursor-pointer hover:opacity-80"
            }`}
            onClick={handleNextPage}
          >
            <div
              className={`text-center justify-start text-primary-950 font-normal  ${isTablet ? "text-lg" : "text-base"}`}
            >
              Next
            </div>
            <ArrowIconSvg
              direction="right"
              disabled={isLastPage}
              className={isLastPage ? "text-primary-500" : "text-primary-950"}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
