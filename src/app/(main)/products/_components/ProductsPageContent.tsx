"use client";

import CategoryNavigation from "@/components/common/ProductDetail/CategoryNavigation";
import SubCategoryItem from "@/components/common/SubCategoryItem";
import ProductGrid from "@/components/common/ProductGrid";
import { CATEGORIES } from "@/lib/constants/categories";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Button from "@/components/ui/Button";
import ArrowIconSvg from "@/components/svg/ArrowIconSvg";
import { useModal } from "@/providers/ModalProvider";
import ProductRegistrationForm from "@/components/common/ProductRegistrationForm";
import { useProducts } from "@/hooks/useProductsInfinite";
import PlusToggleIconSvg from "@/components/svg/PlusToggleIconSvg";
import Dropdown from "@/components/common/DropDown";
import { useCategoryStore } from "@/stores/categoryStore";
import { useDeviceType } from "@/hooks/useDeviceType";
import SubCategoryTabs from "./SubCategoryTabs";
import ProductGridSkeleton from "@/components/common/ProductGridSkeleton";

type TCategoryData = {
  parentCategory: Array<{ id: number; name: string }>;
  childrenCategory: Record<string, Array<{ id: number; name: string }>>;
};

type TSortOptions = "latest" | "popular" | "low" | "high";

export default function ProductsPageContent() {
  const [categories] = useState<TCategoryData>(CATEGORIES);
  const [selectedSort, setSelectedSort] = useState<TSortOptions>("latest");
  const { selectedCategory, clearSelectedCategory, findCategoryPath } = useCategoryStore();

  const sortOptions = [
    { label: "Newest", value: "latest" as const },
    { label: "Popular", value: "popular" as const },
    { label: "Price: Low", value: "low" as const },
    { label: "Price: High", value: "high" as const },
  ];

  const searchParams = useSearchParams();
  const { openModal, closeModal } = useModal();

  const { isMobile, isTablet, isDesktop } = useDeviceType();

  const getLimit = () => {
    if (isMobile) return 4;
    if (isTablet) return 9;
    if (isDesktop) return 6;
    return 6;
  };

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, isError, error, refetch } = useProducts({
    category: searchParams.get("category") ? parseInt(searchParams.get("category")!) : undefined,
    sort: selectedSort,
    limit: getLimit(),
  });

  const allProducts = data?.pages.flatMap((page) => page.items) ?? [];

  const handleLoadMore = () => {
    fetchNextPage();
  };

  const handleSortChange = (selectedValue: string) => {
    const sortValueMap: Record<string, TSortOptions> = {
      Newest: "latest",
      Popular: "popular",
      "Price: Low": "low",
      "Price: High": "high",
    };

    const sortValue = sortValueMap[selectedValue];
    if (sortValue) {
      setSelectedSort(sortValue);
      refetch();
    }
  };

  const handleProductRegistration = () => {
    openModal(<ProductRegistrationForm onClose={closeModal} />);
  };

  useEffect(() => {
    const categoryId = searchParams.get("category");
    if (categoryId) {
      findCategoryPath(parseInt(categoryId));
    } else {
      clearSelectedCategory();
    }
  }, [searchParams, findCategoryPath, clearSelectedCategory]);

  return (
    <main
      className="w-full flex items-start justify-center sm:gap-5 md:gap-10 pt-6 sm:pt-7.5 md:pt-15"
      role="main"
      aria-label="Product catalog"
    >
      <aside className="hidden sm:block" role="complementary" aria-label="Product categories">
        <SubCategoryItem categories={categories} />
      </aside>

      <div className="flex flex-col sm:h-16 w-full sm:border-b sm:border-primary-100">
        <SubCategoryTabs />

        <div className="flex flex-col sm:flex-row sm:justify-between">
          <nav role="navigation" aria-label="Category navigation">
            <CategoryNavigation parentCategory={selectedCategory?.parent} childCategory={selectedCategory?.child} />
          </nav>

          <div
            className="flex items-center w-full justify-between sm:justify-end sm:gap-[30px] pb-5 border-b border-primary-100 sm:border-0"
            role="toolbar"
            aria-label="Product sorting and registration tools"
          >
            <Dropdown
              options={sortOptions.map((option) => option.label)}
              onChange={handleSortChange}
              aria-label="Sort products"
            />
            <Button
              type="black"
              label={
                <div className="flex gap-[6px]">
                  <PlusToggleIconSvg className="w-4 h-4 text-white" aria-hidden="true" />
                  <p className="text-primary-50 text-sm/[17px] font-semibold">Add product</p>
                </div>
              }
              onClick={handleProductRegistration}
              className="h-[44px] py-[10px] rounded"
              aria-label="Add a new product"
            />
          </div>
        </div>

        <section className="container mx-auto pt-[20px] sm:pt-[30px]" aria-labelledby="products-section-title">
          <h2 id="products-section-title" className="sr-only">
            {selectedCategory?.child || selectedCategory?.parent || "All"} products
          </h2>

          {isLoading ? (
            <ProductGridSkeleton count={getLimit()} />
          ) : (
            <>
              <ProductGrid
                products={allProducts}
                currentCategoryId={selectedCategory?.id}
                aria-label={`${allProducts.length} products available`}
              />

              {hasNextPage && (
                <div className="flex justify-center mb-8">
                  <Button
                    type="white"
                    label={
                      <div className="flex items-center justify-center gap-2 whitespace-nowrap flex-shrink-0">
                        <p>Load more</p>
                        <ArrowIconSvg direction="down" className="w-5 h-5 text-black" aria-hidden="true" />
                      </div>
                    }
                    onClick={handleLoadMore}
                    className="w-full h-[44px] sm:h-[64px] px-6 py-4 text-sm/[17px] font-medium tracking-tight"
                    disabled={isFetchingNextPage}
                    aria-label={isFetchingNextPage ? "Loading more products" : "Load more products"}
                  />
                </div>
              )}
            </>
          )}

          {isError && (
            <div className="flex justify-center items-center py-16" role="alert" aria-live="assertive">
              <div className="text-error-500">Something went wrong: {error.message}</div>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
