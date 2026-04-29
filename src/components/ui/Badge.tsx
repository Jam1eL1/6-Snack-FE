import React from "react";
import clsx from "clsx";
import Image, { StaticImageData } from "next/image";
import XIconSvg from "@/components/svg/XIconSvg";
import TimeIconSvg from "@/components/svg/TimeIconSvg";
import { TBadgeProps, TBadgeType } from "@/types/badge.types";
import CheckIconSvg from "@/components/svg/CheckIconSvg";

const badgeStyleMap: Record<
  TBadgeType,
  {
    bg: string;
    text: string;
    textColor: string;
    iconSrc?: StaticImageData;
  }
> = {
  request: {
    bg: "bg-blue-50",
    text: "Instant Request",
    textColor: "text-blue-500",
  },
  pending: {
    bg: "bg-primary-200",
    text: "Pending",
    textColor: "text-primary-700",
  },
  approved: {
    bg: "bg-sky-100",
    text: "Approved",
    textColor: "text-sky-500",
  },
  rejected: {
    bg: "bg-red-100",
    text: "Rejected",
    textColor: "text-red",
  },
  admin: {
    bg: "bg-primary-700",
    text: "Admin",
    textColor: "text-white",
  },
  user: {
    bg: "bg-primary-50",
    text: "User",
    textColor: "text-primary-400",
  },
};

export default function Badge({ type }: TBadgeProps) {
  const { bg, text, textColor, iconSrc } = badgeStyleMap[type];
  const SmallBadge = type === "admin" || type === "user";

  return (
    <div
      className={clsx(
        "rounded-full inline-flex justify-center items-center gap-1",
        "whitespace-nowrap w-fit",
        bg,
        SmallBadge
          ? "w-[52px] h-5 px-2.5 py-1 text-xs sm:w-16 sm:h-7 sm:px-2 sm:py-1.5 sm:text-sm"
          : "h-7 px-2.5 py-1.5",
      )}
    >
      {type === "rejected" ? (
        <div className="w-3.5 h-3.5">
          <XIconSvg stroke="white" className="w-full h-full" bgColor="red" />
        </div>
      ) : type === "approved" ? (
        <div className="w-3.5 h-3.5">
          <CheckIconSvg stroke="white" bgColor="#0EA5E9" className="w-full h-full" />
        </div>
      ) : type === "pending" ? (
        <div className="w-3.5 h-3.5">
          <TimeIconSvg className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-primary-700" />
        </div>
      ) : iconSrc ? (
        <div className="w-3.5 h-3.5 relative">
          <Image src={iconSrc} alt={`${text} icon`} fill style={{ objectFit: "contain" }} />
        </div>
      ) : null}

      <span className={clsx("font-bold font-suit", SmallBadge ? "text-xs sm:text-sm" : "text-sm", textColor)}>
        {text}
      </span>
    </div>
  );
}
