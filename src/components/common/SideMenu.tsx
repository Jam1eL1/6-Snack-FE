"use client";

import { TSideMenuProps, TSideMenuItem } from "../../types/sideMenu.types";
import XIconSvg from "../svg/XIconSvg";
import { createPortal } from "react-dom";

export default function SideMenu({ items, isOpen, currentPath, onItemClick, onClose, className = "" }: TSideMenuProps) {
  if (!isOpen) return null;
  const isCurrentPage = (item: TSideMenuItem) => {
    if (!currentPath || !item.href) return false;
    if (item.href === "/manage/users") {
      return currentPath.startsWith("/manage");
    }
    return currentPath === item.href;
  };

  const sideMenuContent = (
    <div className="fixed inset-0 z-300">
      <div className="absolute inset-0 bg-black/20" onClick={onClose} />

      <div
        className={`absolute right-0 top-0 w-[255px] h-full bg-white/90 backdrop-blur-lg flex flex-col items-end gap-5 px-6 pt-[16px] ${className}`}
      >
        <XIconSvg className="w-6 h-6" onClick={onClose} />

        <div className="self-stretch flex flex-col justify-start items-center gap-[13px]">
          {items.map((item) => {
            const isActive = isCurrentPage(item);
            return (
              <div
                key={item.id}
                data-property-1={isActive ? "active" : "normal"}
                className={`w-44 h-12 p-2 inline-flex justify-center items-center gap-2 cursor-pointer transition-colors group ${item.className || ""}`}
                onClick={() => onItemClick?.(item)}
              >
                <div
                  className={`justify-start text-base transition-all duration-200 ${
                    isActive ? "text-primary-900 font-extrabold" : "text-primary-700 font-normal group-hover:font-bold"
                  }`}
                >
                  {item.label}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  if (typeof window !== "undefined") {
    return createPortal(sideMenuContent, document.body);
  }

  return sideMenuContent;
}
