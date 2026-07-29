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
    <div className="w-full  inline-flex justify-start items-start">
      {/* Member management tab */}
      <div
        className={`flex-1 px-4 py-3 flex justify-center items-center gap-2 cursor-pointer ${
          isUserTabActive ? "border-b-2 border-primary-950" : "border-b border-primary-200"
        }`}
        onClick={onUserTabClick}
      >
        <UserIconSvg isActive={isUserTabActive} className="sm:w-6 sm:h-6" />
        <div
          className={`justify-center text-sm/[17px] sm:text-base/[20px] tracking-tight ${
            isUserTabActive ? "text-primary-950 font-bold" : "text-primary-500"
          }`}
        >
          Member Management
        </div>
      </div>

      {/* Budget management tab */}
      <div
        className={`flex-1 px-4 py-3 flex justify-center items-center gap-2 cursor-pointer ${
          !isUserTabActive ? "border-b-2 border-primary-950" : "border-b border-primary-200"
        }`}
        onClick={onBudgetTabClick}
      >
        <BudgetIconSvg isActive={!isUserTabActive} className="sm:w-6 sm:h-6" />
        <div
          className={`justify-center text-sm/[17px] sm:text-base/[20px] tracking-tight ${
            !isUserTabActive ? "text-primary-950 font-bold" : "text-primary-500"
          }`}
        >
          Budget Management
        </div>
      </div>
    </div>
  );
}
