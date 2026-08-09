import { useCategoryStore } from "@/stores/categoryStore";
import clsx from "clsx";
import { useRouter } from "next/navigation";
import React from "react";

export default function SubCategoryTabs() {
  // Read the child categories from the category store.
  const { childrenCategories, selectedChild } = useCategoryStore();
  const router = useRouter();

  // Dim the tabs when the selected parent category has no child categories.
  return (
    <div className="w-[calc(100%+3rem)] border-b border-primary-100 flex justify-start items-center gap-2 sm:hidden category-tabs-scroll -mx-6 px-6">
      {childrenCategories.map((child) => (
        <button
          key={child.id}
          className="h-12 px-2 py-3.5 flex justify-center items-center gap-2.5 category-tab-btn group transition-colors duration-200"
          onClick={() => router.push(`/products?category=${child.id}`)}
        >
          <div
            className={clsx(
              selectedChild?.id === child.id
                ? "text-primary-950 font-bold"
                : "font-normal text-primary-400  hover:text-secondary-500",
              "justify-center text-sm/[17px] tracking-tight cursor-pointer",
            )}
          >
            {child.name}
          </div>
        </button>
      ))}
    </div>
  );
}
