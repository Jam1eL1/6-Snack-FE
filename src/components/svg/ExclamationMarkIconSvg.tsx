import React from "react";

type TExclamationMarkIconSvgProps = {
  className?: string;
  bgColor?: string;
  stroke?: string;
};
export default function ExclamationMarkIconSvg({
  className = "",
  bgColor = "currentColor",
  stroke = "white",
}: TExclamationMarkIconSvgProps) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Outer circle */}
      <circle cx="12" cy="12" r="12" fill={bgColor} />

      {/* Exclamation mark */}
      <path
        d="M10.8916 15.7305V17.9473H13.1094V15.7305H10.8916ZM10.9092 14.2598H13.0977L13.2832 6.25977H10.7168L10.9092 14.2598Z"
        fill={stroke || "white"}
      />
    </svg>
  );
}
