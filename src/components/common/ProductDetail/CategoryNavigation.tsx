import React from "react";
import ArrowIconSvg from "@/components/svg/ArrowIconSvg";
import { twMerge } from "tailwind-merge";
import clsx from "clsx";

type TCategoryNavigationProps = {
  parentCategory?: string;
  childCategory?: string;
  className?: string;
};

export default function CategoryNavigation({ parentCategory, childCategory, className }: TCategoryNavigationProps) {
  return (
    <div
      className={twMerge(
        clsx(
          "py-3.5 sm:pt-0 sm:pb-5 flex justify-start items-center gap-1 sm:gap-1.5 sm:h-16 sm:w-full sm:border-b sm:border-primary-100",
        ),
        className,
      )}
    >
      <p
        className={`font-normal text-sm/[17px] sm:text-base/[20px] tracking-tight whitespace-nowrap ${
          parentCategory ? "text-primary-200" : "text-primary-950"
        }`}
      >
        {parentCategory || "All"}
      </p>
      <div>
        <ArrowIconSvg direction="right" className="w-3 h-3 sm:w-4 sm:h-4 text-primary-100 cursor-default" />
      </div>
      <p className="font-normal text-sm/[17px] sm:text-base/[20px] text-primary-950 tracking-tight whitespace-nowrap">
        {childCategory || ""}
      </p>
    </div>
  );
}
