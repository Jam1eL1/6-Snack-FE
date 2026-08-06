"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { twMerge } from "tailwind-merge";

import ChevronUpIcon from "@/assets/icons/ic_chevron_up.svg";
import ChevronDownIcon from "@/assets/icons/ic_chevron_down.svg";

type TDropdownProps = {
  options?: string[];
  placeholder?: string;
  onChange: (value: string) => void;
  className?: string;
  disabled?: boolean;
  height?: string;
};

const defaultOptions = ["Newest", "Popular", "Price: Low", "Price: High"];

export default function Dropdown({
  options = [],
  placeholder = "Sort",
  onChange,
  className,
  disabled = false,
  height = "h-11",
}: TDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [sort, setSort] = useState<string>(placeholder);

  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleSelect = (option: string) => {
    onChange(option);
    setSort(option);
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const menuOptions = options.length === 0 ? defaultOptions : options;

  return (
    <div ref={dropdownRef} className={twMerge("relative inline-block min-w-[110px]", className)}>
      {/* Trigger */}
      <div
        className={`${height || "h-11"} w-full px-4 py-2.5 bg-white border border-primary-100 ${
          isOpen ? "border-b-0" : "border"
        } flex justify-between items-center gap-2 ${disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"}`}
        onClick={() => !disabled && setIsOpen((prev) => !prev)}
      >
        <div className="text-primary-950 text-base/[20px] font-normal whitespace-nowrap">{sort}</div>
        <div className="w-4 h-4 relative">
          <Image
            src={isOpen ? ChevronUpIcon : ChevronDownIcon}
            alt="Toggle sort menu"
            fill
            style={{ objectFit: "contain" }}
          />
        </div>
      </div>

      {/* Menu */}
      {isOpen && (
        <div className="absolute w-full z-20 bg-white border border-primary-100 border-t-0 rounded-b max-h-[300px] overflow-y-auto scrollbar">
          {menuOptions.map((option) => (
            <div
              key={option}
              onClick={() => handleSelect(option)}
              className="h-12 pl-4 pr-5 py-2 hover:bg-gray-50 cursor-pointer text-primary-950 text-base/[20px] font-normal flex items-center whitespace-nowrap"
            >
              {option}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
