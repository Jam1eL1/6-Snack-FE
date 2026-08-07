"use client";

import Desktop from "@/components/common/Desktop";
import Menu from "@/components/common/Menu";
import TabMenu from "@/components/common/TabMenu";
import { usePathname, useRouter } from "next/navigation";
import React from "react";

export default function ManagePageLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  const handleMenuClick = (path: string) => {
    router.push(path);
  };

  return (
    <div>
      <div className="w-full block md:hidden">
        <div className="flex items-center justify-center">
          <TabMenu
            isUserTabActive={pathname === "/manage/users"}
            onUserTabClick={() => handleMenuClick("/manage/users")}
            onBudgetTabClick={() => handleMenuClick("/manage/budgets")}
          />
        </div>
      </div>
      <div className="flex gap-16 pt-6 sm:pt-7.5 md:pt-15 pb-20">
        <Desktop>
          <div className="flex flex-col gap-1">
            <Menu
              icon="user"
              text="Member Management"
              isActive={pathname === "/manage/users"}
              onClick={() => handleMenuClick("/manage/users")}
            />
            <Menu
              icon="budget"
              text="Budget Management"
              isActive={pathname === "/manage/budgets"}
              onClick={() => handleMenuClick("/manage/budgets")}
            />
          </div>
        </Desktop>
        {children}
      </div>
    </div>
  );
}
