"use client";

import Image from "next/image";
import { TToastVariant } from "@/types/toast.types";

import exclamationIc from "@/assets/icons/ic_exclamation_mark_red.svg";
import checkIc from "@/assets/icons/ic_check_white.svg";
import { twMerge } from "tailwind-merge";
import { useEffect, useState } from "react";
import { formatCurrency } from "@/lib/utils/currency.util";

type TToastProps = {
  text: string | React.ReactNode;
  budget?: number;
  variant?: TToastVariant;
  isVisible?: boolean;
  className?: string;
};

const Toast = ({ text, budget, variant = "error", isVisible, className = "" }: TToastProps) => {
  const [isMounted, setIsMounted] = useState<boolean>(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const iconSrc = variant === "success" ? checkIc : exclamationIc;
  const iconAlt = variant === "success" ? "Success icon" : "Warning icon";

  if (!isMounted) return null;

  return (
    <div
      role="alert"
      className={twMerge(
        "fixed flex justify-between items-center max-w-[1200px] h-[64px] top-[76px] inset-x-6 mx-auto transition-all duration-500 px-4 py-4 text-[14px]/[22px] text-white tracking-tight bg-black/80 rounded shadow-[0px_10px_8px_0px_rgba(0,0,0,0.1)] backdrop-blur-[30px] font-bold sm:h-[80px] sm:top-[120px] sm:px-[40px] sm:text-[20px]/[25px] md:max-w-[1152px] md:px-[50px]",
        isVisible
          ? "z-105 opacity-100 translate-y-0 sm:translate-y-0 md:translate-y-0"
          : "z-1 opacity-0 translate-y-1/4 sm:translate-y-1/4 md:translate-y-1/4",
        className,
      )}
    >
      {/* Icon and message */}
      <div className="flex items-center gap-2 flex-1 min-w-0">
        <div className="w-5 h-5 sm:w-6 sm:h-6 relative shrink-0">
          <Image src={iconSrc} alt={iconAlt} fill style={{ objectFit: "contain" }} />
        </div>
        <div className="flex flex-wrap">{text}</div>
      </div>

      {/* Remaining budget */}
      {typeof budget === "number" && (
        <div className="flex items-center gap-3 sm:gap-6">
          <div className="flex items-center gap-1.5 sm:gap-3">
            <span>Remaining Budget</span>
            <span>{formatCurrency(budget)}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Toast;
