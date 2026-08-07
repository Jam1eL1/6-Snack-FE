import React from "react";
import Order from "./_components/Order";

export default function OrderPage() {
  return (
    <main
      className="w-full flex flex-col gap-4 sm:gap-7.5 md:gap-10 pt-6 sm:pt-7.5 md:pt-15 pb-20"
      aria-label="Purchase request management page"
    >
      <Order />
    </main>
  );
}
