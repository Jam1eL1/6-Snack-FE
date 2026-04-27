"use client";

import React, { Suspense } from "react";
import ProductsPageContent from "./_components/ProductsPageContent";

export default function ProductsPage() {
  return (
    <>
      <Suspense fallback={<div className="flex justify-center items-center py-16">로딩 중...</div>}>
        <ProductsPageContent />
      </Suspense>
    </>
  );
}
