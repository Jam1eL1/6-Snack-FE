import React from "react";
import UserIconSvg from "../svg/UserIconSvg";
import BudgetIconSvg from "../svg/BudgetIconSvg";

type TTabMenuProps = {
  isUserTabActive?: boolean;
  onUserTabClick?: () => void;
  onBudgetTabClick?: () => void;
};

export default function TabMenu({ isUserTabActive = false, onUserTabClick, onBudgetTabClick }: TTabMenuProps) {
  return (
    <div className="w-full  inline-flex min-w-0 justify-start items-start">
      {/* Member management tab */}
      <div
        className={`flex min-w-0 flex-1 cursor-pointer items-center justify-center gap-1 px-1 py-3 sm:gap-2 sm:px-4 ${
          isUserTabActive ? "border-b-2 border-primary-950" : "border-b border-primary-200"
        }`}
        onClick={onUserTabClick}
      >
        <UserIconSvg isActive={isUserTabActive} className="h-5 w-5 shrink-0 sm:h-6 sm:w-6" />
        <div
          className={`min-w-0 text-center text-[13px]/[16px] tracking-tight sm:text-base/[20px] ${
            isUserTabActive ? "text-primary-950 font-bold" : "text-primary-500"
          }`}
        >
          Members
        </div>
      </div>

      {/* Budget management tab */}
      <div
        className={`flex min-w-0 flex-1 cursor-pointer items-center justify-center gap-1 px-1 py-3 sm:gap-2 sm:px-4 ${
          !isUserTabActive ? "border-b-2 border-primary-950" : "border-b border-primary-200"
        }`}
        onClick={onBudgetTabClick}
      >
        <BudgetIconSvg isActive={!isUserTabActive} className="h-5 w-5 shrink-0 sm:h-6 sm:w-6" />
        <div
          className={`min-w-0 text-center text-[13px]/[16px] tracking-tight sm:text-base/[20px] ${
            !isUserTabActive ? "text-primary-950 font-bold" : "text-primary-500"
          }`}
        >
          Budgets
        </div>
      </div>
    </div>
  );
}
