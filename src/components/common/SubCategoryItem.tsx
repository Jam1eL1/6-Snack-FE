"use client";

import React, { Fragment, MouseEvent, useState, useEffect } from "react";
import clsx from "clsx";
import { useRouter, useSearchParams } from "next/navigation";
import ArrowIconSvg from "../svg/ArrowIconSvg";

import { useCategoryStore } from "@/stores/categoryStore";
import ResetIconSvg from "../svg/ResetIconSvg";

type TSubCategoryItemProps = {
  categories: {
    parentCategory: { id: number; name: string }[];
    childrenCategory: {
      [key: string]: { id: number; name: string }[];
    };
  };
};

export default function SubCategoryItem({ categories }: TSubCategoryItemProps) {
  const [isActiveParentCategory, setIsActiveParentCategory] = useState<string>("");
  const [isActiveChildrenCategory, setIsActiveChildrenCategory] = useState<string>("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedCategory = useCategoryStore((state) => state.selectedCategory);
  const clearSelectedCategory = useCategoryStore((state) => state.clearSelectedCategory);

  const { parentCategory, childrenCategory } = categories;

  useEffect(() => {
    // Update the store when a category is selected.
    if (selectedCategory) {
      setIsActiveParentCategory(selectedCategory.parent);
      setIsActiveChildrenCategory(selectedCategory.child);
    } else {
      // Reset the store when no category is selected.
      setIsActiveParentCategory("");
      setIsActiveChildrenCategory("");
    }
  }, [selectedCategory]);

  const handleClick = (e: MouseEvent<HTMLButtonElement>, category: string, categoryId?: number) => {
    const id = e.currentTarget.id;

    if (id === "parent") {
      setIsActiveParentCategory((prev) => (prev === category ? "" : category));
      setIsActiveChildrenCategory("");
    }

    if (id === "children" && categoryId) {
      setIsActiveChildrenCategory(category);

      const params = new URLSearchParams(searchParams);
      params.set("category", categoryId.toString());
      router.push(`/products?${params.toString()}`);
    }
  };

  return (
    <>
      <div className="flex justify-between items-center w-[180px] h-[42px] py-[10px] px-[14px] mb-[10px]">
        <span className="font-bold text-[18px]/[22px] tracking-tight text-primary-950">Categories</span>
        <button
          onClick={() => {
            clearSelectedCategory();
            router.push("/products");
            setIsActiveParentCategory("");
            setIsActiveChildrenCategory("");
          }}
          className="group hover:bg-primary-50/50 transition-colors duration-200 p-1 rounded-full"
          aria-label="Reset category filter"
        >
          <ResetIconSvg className="w-5 h-5 text-primary-300 group-hover:text-secondary-500 transition-colors duration-200" />
        </button>
      </div>
      <div className="flex flex-col justify-start w-[180px] gap-[4px]">
        {parentCategory.map((parent) => (
          <Fragment key={`parent-${parent.id}`}>
            <button
              id="parent"
              onClick={(e) => handleClick(e, parent.name)}
              className={clsx(
                isActiveParentCategory === parent.name && "border-t-2 border-primary-950",
                "relative group/parent hover:bg-primary-50/50 transition-colors duration-200 flex justify-between items-center w-[180px] h-[50px] p-[14px] cursor-pointer",
              )}
            >
              <p
                className={clsx(
                  isActiveParentCategory === parent.name ? "font-bold" : "font-normal",
                  "group-hover/parent:font-bold transition-all text-[16px]/[20px] tracking-tight text-primary-950",
                )}
              >
                {parent.name}
              </p>
              <ArrowIconSvg
                direction="down"
                className={clsx(
                  isActiveParentCategory === parent.name && "rotate-180",
                  "object-cover transition-transform duration-250 w-[16px] h-[16px] text-primary-300",
                )}
              />
            </button>
            {isActiveParentCategory === parent.name &&
              childrenCategory[parent.name].map((children) => (
                <button
                  id="children"
                  key={`children-${children.id}`}
                  onClick={(e) => handleClick(e, children.name, children.id)}
                  className="group/children hover:bg-primary-50/60 transition-all duration-200 flex justify-between items-center w-[180px] h-[50px] py-[10px] px-[30px] cursor-pointer"
                >
                  <p
                    className={clsx(
                      isActiveChildrenCategory === children.name
                        ? "font-bold text-primary-950"
                        : "font-normal text-primary-500",
                      "group-hover/children:text-primary-950 transition-all text-[16px]/[20px] tracking-tight",
                    )}
                  >
                    {children.name}
                  </p>
                </button>
              ))}
          </Fragment>
        ))}
      </div>
    </>
  );
}
