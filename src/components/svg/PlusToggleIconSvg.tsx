import React from "react";

type TPlusToggleIconSvgProps = {
  isOpen?: boolean;
  className?: string;
  onClick?: () => void;
};

export default function PlusToggleIconSvg({ isOpen = false, className = "", onClick }: TPlusToggleIconSvgProps) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`cursor-pointer text-primary-950 ${className}`}
      onClick={onClick}
    >
      {isOpen ? (
        // Open state: show only the horizontal line.
        <rect width="18" height="1.5" transform="translate(3 11.25)" fill="currentColor" />
      ) : (
        // Closed state: show the plus icon.
        <>
          <path d="M11.25 21V3H12.75V21H11.25Z" fill="currentColor" />
          <path d="M3 11.25H21V12.75H3V11.25Z" fill="currentColor" />
        </>
      )}
    </svg>
  );
}
