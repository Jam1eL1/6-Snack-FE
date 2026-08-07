"use client";

import DogSpinner from "@/components/common/DogSpinner";
import ProductGrid from "@/components/common/ProductGrid";
import { useDeviceType } from "@/hooks/useDeviceType";
import { getFavorites } from "@/lib/api/favorite.api";
import { queryKeys } from "@/lib/queryKeys";
import { TGetFavoriteProductResponse } from "@/types/favorite.types";
import { InfiniteData, useInfiniteQuery } from "@tanstack/react-query";
import React from "react";
import { useInView } from "react-intersection-observer";

export default function MyFavoritesPage() {
  const { isMobile, isTablet } = useDeviceType();

  const limit = isMobile ? "4" : isTablet ? "9" : "6";

  const {
    data: favorites,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery<
    TGetFavoriteProductResponse,
    Error,
    InfiniteData<TGetFavoriteProductResponse>,
    ReturnType<typeof queryKeys.favorites.list>,
    string
  >({
    queryKey: queryKeys.favorites.list(limit),
    queryFn: ({ pageParam }) => getFavorites({ cursor: pageParam ?? "", limit }),
    initialPageParam: "",
    getNextPageParam: (lastPage) => {
      const nextCursor = lastPage.meta?.nextCursor;
      return nextCursor !== undefined ? String(nextCursor) : undefined;
    },
  });

  const { ref } = useInView({
    threshold: 0.5,
    onChange: (inView) => {
      if (inView && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    },
  });

  const products =
    favorites?.pages.flatMap((data) => data.favorites.map((favorite) => ({ ...favorite.product, isFavorite: true }))) ??
    [];

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[80vh] md:h-[60vh]">
        <DogSpinner />
      </div>
    );
  }

  if (!favorites || favorites.pages.length === 0) {
    return (
      <div>
        <p>You haven’t saved any products yet.</p>
        <p>Save products you’d like to find again.</p>
      </div>
    );
  }

  if (error) {
    return <p role="alert">Something went wrong: {error.message}</p>;
  }

  return (
    <section className="flex justify-center">
      <div className="flex flex-col gap-4 sm:gap-7.5 md:gap-10 pt-6 sm:pt-7.5 md:pt-15 pb-20">
        <h2 className="font-bold text-[18px]/[22px] tracking-tight text-primary-950">My Favorites</h2>
        <figure>
          <ProductGrid products={products} />
        </figure>
        {hasNextPage && (
          <div
            aria-live="polite"
            aria-label="Loading more products"
            ref={ref}
            className="flex justify-center items-center"
          >
            {isFetchingNextPage && (
              <div className="size-[20px] border-[3px] border-t-[3px] border-secondary-gray-200 border-t-primary-100 rounded-full animate-spin"></div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
