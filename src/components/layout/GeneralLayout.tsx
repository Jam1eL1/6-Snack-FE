"use client";

import { TChildrenProps } from "@/types/children.types";
import { usePathname } from "next/navigation";
import React from "react";

export default function GeneralLayout({ children }: TChildrenProps) {
  const currentPath = usePathname();

  const isAuthPage = ["/signin", "/signup", "/profile"].some((path) => currentPath.startsWith(path));

  const isLandingPage = currentPath === "/";

  return (
    <div
      className={
        isLandingPage
          ? ""
          : isAuthPage
            ? "flex justify-center items-center px-[24px] pb-[24px] sm:px-[72px] sm:pb-[72px]"
            : "flex justify-center items-center px-[24px] pb-[24px]"
      }
    >
      <div className={isLandingPage ? "" : "flex flex-col w-full max-w-[1400px]"}>{children}</div>
    </div>
  );
}
