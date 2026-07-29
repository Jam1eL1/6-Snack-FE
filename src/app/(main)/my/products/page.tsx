"use client";

import React, { useEffect, useState } from "react";
import Desktop from "@/components/common/Desktop";
import Dropdown from "@/components/common/DropDown";
import Pagination from "@/components/common/Pagination";
import ProductList from "@/components/common/ProductList";
import { useDeviceType } from "@/hooks/useDeviceType";
import { getMyProducts } from "@/lib/api/product.api";
import { TMyProductsParams, TMyProductsResponse } from "@/types/product.types";
import { useQuery } from "@tanstack/react-query";
import NoContent from "@/components/common/NoContent";
import { useRouter } from "next/navigation";
import DogSpinner from "@/components/common/DogSpinner";
import { queryKeys } from "@/lib/queryKeys";

export default function MyProductsPage() {
  const [params, setParams] = useState<TMyProductsParams>({
    page: "1",
    limit: "4",
    orderBy: "latest",
  });
  const { isMobile, isTablet, isDesktop } = useDeviceType();
  const router = useRouter();

  const {
    data: products,
    isPending,
    error,
  } = useQuery<TMyProductsResponse, Error, TMyProductsResponse>({
    queryKey: queryKeys.myProducts.list(params),
    queryFn: () => getMyProducts(params),
  });

  useEffect(() => {
    if (isMobile || isTablet) setParams((prev) => ({ ...prev, limit: "4" }));

    if (isDesktop) setParams((prev) => ({ ...prev, limit: "6" }));
  }, [isMobile, isTablet, isDesktop]);

  const handlePageChange = (page: number) => {
    setParams((prev) => ({ ...prev, page: String(page) }));
  };

  const handleSort = (option: string) => {
    const orderByMap: Record<string, "latest" | "priceLow" | "priceHigh"> = {
      Newest: "latest",
      "Lowest Price": "priceLow",
      "Highest Price": "priceHigh",
    };

    setParams((prev) => ({ ...prev, orderBy: orderByMap[option] }));
  };

  if (error) {
    return <p role="alert">Something went wrong: {error.message}</p>;
  }

  return (
    <div className="md:px-[24px]">
      <div className="flex justify-between items-center pt-[10px] pb-[20px] md:mt-[80px] md:pt-0 md:pb-[40px]">
        <h2 className="font-bold text-[18px]/[22px] tracking-tight text-primary-950">My Products</h2>
        <Dropdown onChange={handleSort} options={["Newest", "Lowest Price", "Highest Price"]} />
      </div>
      <div className="mx-[-24px] outline-1 outline-[#e6e6e6] md:hidden"></div>
      {isPending ? (
        <div className="flex justify-center items-center h-[80vh] md:h-[60vh]">
          <DogSpinner />
        </div>
      ) : !products?.items?.length ? (
        <NoContent
          title="You haven’t added any products yet"
          subText1="Have a product you’d like to request?"
          subText2="Add it to the product catalog."
          buttonText="Browse products"
          onClick={() => router.push("/products")}
        />
      ) : (
        <>
          <Desktop>
            <aside className="flex justify-center w-full">
              <div className="flex justify-start items-center w-full h-[60px] px-[40px] py-[20px] gap-[80px] border-y-[1px] border-[#e6e6e6]">
                <p className="ml-[60px] w-[260px] font-bold text-[16px]/[20px] tracking-tight text-primary-500">
                  Product
                </p>
                <p className="w-[180px] font-bold text-[16px]/[20px] tracking-tight text-primary-500">Date added</p>
                <p className="w-[180px] font-bold text-[16px]/[20px] tracking-tight text-primary-500">Category</p>
                <p className="w-[160px] font-bold text-[16px]/[20px] tracking-tight text-primary-500">Price</p>
                <p className="w-[112px] font-bold text-[16px]/[20px] tracking-tight text-primary-500">Product link</p>
              </div>
            </aside>
          </Desktop>
          <section className="flex flex-col gap-[10px] my-[20px] sm:mb-[30px] md:mt-0">
            <p className="font-bold text-[14px]/[17px] tracking-tight text-primary-950 sm:text-[16px]/[20px] md:hidden">
              {products.meta.totalCount} products added
            </p>
            <ProductList products={products} />
          </section>
          <Pagination
            currentPage={products.meta.currentPage}
            totalPages={products.meta.totalPages}
            onPageChange={handlePageChange}
          />
        </>
      )}
    </div>
  );
}
