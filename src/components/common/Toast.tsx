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
  const [isAnimatedIn, setIsAnimatedIn] = useState<boolean>(false);

  useEffect(() => {
    setIsMounted(true);

    const animationFrame = requestAnimationFrame(() => {
      setIsAnimatedIn(true);
    });

    return () => cancelAnimationFrame(animationFrame);
  }, []);

  const iconSrc = variant === "success" ? checkIc : exclamationIc;
  const iconAlt = variant === "success" ? "Success icon" : "Warning icon";

  if (!isMounted) return null;

  return (
    <div
      role="alert"
      className={twMerge(
        "pointer-events-none fixed left-1/2 flex h-16 w-[calc(100%-48px)] max-w-[640px] -translate-x-1/2 items-center justify-between rounded bg-black/80 px-4 py-4 text-[14px]/[22px] font-bold tracking-tight text-white shadow-[0px_10px_8px_0px_rgba(0,0,0,0.1)] backdrop-blur-[30px] transition-[opacity,transform] duration-300 ease-out bottom-6 sm:bottom-8 sm:h-20 sm:px-10 sm:text-[20px]/[25px] md:px-12",
        isVisible && isAnimatedIn ? "z-105 translate-y-0 opacity-100" : "z-1 translate-y-3 opacity-0",
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
