import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import ic_menu from "@/assets/icons/ic_menu.svg";

type TMenuDropdownProps = {
  menuType: "product" | "member";
  onEdit?: () => void;
  onDelete?: () => void;
  className?: string;
};

export default function MenuDropdown({ menuType, onEdit, onDelete, className = "" }: TMenuDropdownProps) {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleEdit = () => {
    onEdit?.();
    setShowDropdown(false);
  };

  const handleDelete = () => {
    onDelete?.();
    setShowDropdown(false);
  };

  const editLabel = menuType === "product" ? "Edit Product" : "Edit Permissions";
  const deleteLabel = menuType === "product" ? "Delete Product" : "Remove Account";

  // Close the dropdown when clicking outside.
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };

    if (showDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showDropdown]);

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <div className="w-6 h-6 relative cursor-pointer" onClick={() => setShowDropdown(!showDropdown)}>
        <Image src={ic_menu} alt="More options" fill className="object-contain" />
      </div>

      {showDropdown && (
        <div className="absolute top-0  right-6 bg-white border border-primary-200 shadow-lg z-10 w-[95px]">
          <div className="py-1">
            {menuType !== "product" && (
              <div
                className="h-12 px-4 py-2 flex justify-start items-center gap-1 hover:bg-primary-50 cursor-pointer"
                onClick={handleEdit}
              >
                <div className="text-neutral-800 text-base font-suit whitespace-nowrap">{editLabel}</div>
              </div>
            )}
            <div
              className="h-12 px-4 py-2 flex justify-start items-center gap-1 hover:bg-primary-50 cursor-pointer"
              onClick={handleDelete}
            >
              <div className="text-neutral-800 text-base font-suit whitespace-nowrap">{deleteLabel}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
