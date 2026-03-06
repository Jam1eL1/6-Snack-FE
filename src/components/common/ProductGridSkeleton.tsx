"use client";
import React, { useState, useEffect } from "react";
import { Skeleton } from "@/components/ui/Skeleton";

type ProductGridSkeletonProps = {
  count?: number;
};

export default function ProductGridSkeleton({ count = 6 }: ProductGridSkeletonProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);
  if (!isClient) {
    return (
      <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 sm:gap-x-3.5 sm:gap-y-7.5 md:grid-cols-3 md:gap-x-10 md:gap-y-15 justify-items-center pb-[30px] sm:pb-[40px]" />
    );
  }
  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 sm:gap-x-3.5 sm:gap-y-7.5 md:grid-cols-3 md:gap-x-10 md:gap-y-15 justify-items-center pb-[30px] sm:pb-[40px]">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="flex flex-col justify-start items-center gap-[14px] md:gap-[20px] w-full">
          {/* 상품 이미지 영역 - ProductGrid와 동일한 구조 */}
          <div className="relative w-full flex justify-center items-center aspect-square min-w-[154.5px] min-h-[154.5px] max-h-[366.67px] max-w-[366.67px] round-xs bg-primary-50 overflow-hidden">
            {/* 상품 이미지 skeleton */}
            <div className="relative w-[70%] h-[70%] md:w-[75%] md:h-[75%] min-w-[53.8px] min-h-[93.39px]">
              <Skeleton className="w-full h-full rounded" />
            </div>
            {/* 하트 아이콘 skeleton */}
            <div className="absolute right-[11.5px] bottom-[11.5px] w-[20px] h-[20px] sm:w-[25px] sm:h-[25px] md:right-[20.3px] md:bottom-[20.3px] md:w-[30px] md:h-[30px]">
              <Skeleton className="w-full h-full rounded" />
            </div>
          </div>

          {/* 상품 정보 영역 - ProductGrid와 동일한 구조 */}
          <div className="flex flex-col justify-start items-start gap-2 w-full">
            <div className="flex justify-center items-center md:gap-2">
              {/* 상품명 skeleton */}
              <Skeleton className="h-5 md:h-6 w-32 md:w-40 rounded" />
              {/* 구매횟수 skeleton (데스크탑에서만 표시) */}
              <Skeleton className="h-4 md:h-5 w-16 md:w-20 rounded hidden md:block" />
            </div>
            {/* 가격 skeleton */}
            <Skeleton className="h-5 md:h-6 w-24 md:w-28 rounded" />
            {/* 구매횟수 skeleton (모바일에서만 표시) */}
            <Skeleton className="h-4 md:h-5 w-20 md:w-24 rounded md:hidden" />
          </div>
        </div>
      ))}
    </div>
  );
}
