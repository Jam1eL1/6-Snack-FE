"use client";

import React, { Suspense } from "react";
import ProductsPageContent from "./_components/ProductsPageContent";

export default function ProductsPage() {
  return (
    <>
      <Suspense fallback={<div className="flex justify-center items-center py-16">Loading products...</div>}>
        <ProductsPageContent />
      </Suspense>
    </>
  );
}
