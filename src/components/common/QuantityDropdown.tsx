"use client";

import React, { useState, useRef, useEffect } from "react";
import ArrowIconSvg from "@/components/svg/ArrowIconSvg";
import debounce from "lodash.debounce";

type TQuantityDropdownProps = {
  value: number;
  onClick?: (value: number) => void;
  type?: "default" | "product";
};

export default function QuantityDropdown({ value, onClick: updateQuantity, type }: TQuantityDropdownProps) {
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [quantity, setQuantity] = useState<number>(value);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLDivElement>(null); // Dropdown toggle reference
  const optionRefs = useRef<(HTMLDivElement | null)[]>([]);

  const quantityOptions = Array.from({ length: 100 }, (_, i) => i + 1);

  const handleDropdownToggle = () => {
    setIsDropdownVisible((prev) => !prev);
  };

  const changeQuantity = useRef(debounce((quantity: number) => updateQuantity?.(quantity), 500)).current;

  // Enter a quantity directly
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    const num = Number(val);

    // Keep the field empty when the value is empty or not a number
    if (val === "" || isNaN(num)) {
      setQuantity(NaN); // Represents an empty input state
      return;
    }

    if (num >= 1 && num <= 100) {
      setQuantity(num);
      changeQuantity(num); // Debounce quantity changes
    }
  };

  // Select a quantity from the dropdown
  const handleSelect = (val: number) => {
    setQuantity(val);

    if (val !== value) {
      updateQuantity?.(val); // Send a request only when the value changes
    }

    setIsDropdownVisible(false);
  };

  // Scroll to the selected option when the quantity changes while the dropdown is open
  useEffect(() => {
    if (isDropdownVisible && quantity >= 1 && quantity <= 100) {
      const el = optionRefs.current[quantity - 1];
      const dropdown = dropdownRef.current;
      if (el && dropdown) {
        dropdown.scrollTop = el.offsetTop;
      }
    }
  }, [quantity, isDropdownVisible]);

  // Detect clicks outside the dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;

      // Close when the click is outside the dropdown, input, and toggle
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(target) &&
        inputRef.current &&
        !inputRef.current.contains(target) &&
        toggleRef.current &&
        !toggleRef.current.contains(target)
      ) {
        setIsDropdownVisible(false);

        // Reset to the current value when the quantity is invalid
        if (quantity < 1 || quantity > 100 || isNaN(quantity)) {
          setQuantity(value);
        } else if (quantity !== value) {
          updateQuantity?.(quantity); // Call only when the value changes
        }
      }
    }

    document.addEventListener("click", handleClickOutside, true); // Listen during the capture phase
    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  }, [quantity, value, updateQuantity]);

  return (
    <div className="relative w-[72px]">
      <div
        className={`
      flex justify-end items-center h-[40px] gap-[4px]
      ${type === "product" ? "border border-primary-200 rounded-none pl-[8px] pr-[8px]" : "pl-[20px] sm:pl-[16px]"}
    `}
      >
        <input
          ref={inputRef}
          type="text"
          value={isNaN(quantity) ? "" : quantity}
          onChange={handleChange}
          onFocus={() => {
            inputRef.current?.select(); // Select all input text
          }}
          onBlur={() => {
            if (isNaN(quantity)) {
              setQuantity(value);
            }
          }}
          className={`
            w-full font-bold text-[14px]/[17px] text-right tracking-tight text-primary-950 outline-none select-all sm:text-[16px]/[20px]
            ${type === "product" ? "border-none rounded-none" : ""}
          `}
        />
        <div ref={toggleRef} onClick={handleDropdownToggle} className="cursor-pointer">
          <ArrowIconSvg direction="down" className="w-[20px] h-[20px] text-primary-950 sm:w-[24px] sm:h-[24px]" />
        </div>
      </div>

      {isDropdownVisible && (
        <div
          ref={dropdownRef}
          className={`
        absolute h-[80px] top-[40px] left-0 w-full z-10
        bg-white overflow-auto overflow-x-hidden shadow-[0_0_10px_0_rgba(0,0,0,0.1)] scrollbar-hide cursor-pointer
        ${type === "product" ? "border-l border-r border-b border-primary-200 rounded-none" : ""}
      `}
        >
          {quantityOptions.map((qty, idx) => (
            <div
              key={qty}
              ref={(el) => {
                optionRefs.current[idx] = el;
              }}
              onMouseDown={(e) => {
                e.preventDefault(); // Prevent the input from losing focus
                handleSelect(qty);
              }}
              className={`flex justify-end items-center h-[40px] pr-[24px] pl-[25px] font-bold text-[14px]/[17px] tracking-tight text-primary-950 cursor-pointer sm:text-[16px]/[20px] sm:pr-[28px] sm:pl-[18px] 
                ${qty === quantity ? "bg-gray-200/80" : "hover:bg-gray-100"}`}
            >
              {qty}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
