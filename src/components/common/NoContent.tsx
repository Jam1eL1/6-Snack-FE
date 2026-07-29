import React from "react";
import Image from "next/image";
import ic_no_order from "@/assets/icons/ic_no_order.svg";
import { twMerge } from "tailwind-merge";

type TNoContentProps = {
  title: string;
  subText1?: string;
  subText2?: string;
  buttonText: string;
  className?: string;
  onClick: () => void;
};

export default function NoContent({
  title,
  subText1 = "",
  subText2 = "",
  buttonText,
  className,
  onClick,
}: TNoContentProps) {
  return (
    <section className="flex flex-1 justify-center" role="status" aria-label="Empty state">
      <div
        className={twMerge(
          "sm:w-80 inline-flex flex-col justify-start items-center gap-7 pt-12 mt-[58px] sm:mt-[222px] md:mt-[191px]",
          className,
        )}
      >
        <div className="w-24 h-24 relative" role="img" aria-label="No content available">
          <Image src={ic_no_order} alt="" fill className="object-contain" />
        </div>
        <div className="self-stretch flex flex-col justify-start items-center gap-12">
          <div className="w-72 flex flex-col justify-start items-center gap-2.5">
            <h2 className="self-stretch text-center text-neutral-800 text-2xl font-extrabold">{title}</h2>
            <p className="self-stretch text-center text-neutral-700 text-base leading-relaxed">
              {subText1}
              <br />
              {subText2}
            </p>
          </div>
          <button
            className="self-stretch h-16 px-4 py-3 bg-neutral-800 rounded-sm inline-flex justify-center items-center cursor-pointer"
            onClick={onClick}
            aria-label={buttonText}
          >
            <span className="text-white text-base font-bold">{buttonText}</span>
          </button>
        </div>
      </div>
    </section>
  );
}
