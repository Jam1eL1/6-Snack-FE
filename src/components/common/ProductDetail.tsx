"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useProductDetail } from "@/hooks/useProductDetail";
import CategoryNavigation from "./ProductDetail/CategoryNavigation";
import ProductImage from "./ProductDetail/ProductImage";
import ProductBasicInfo from "./ProductDetail/ProductBasicInfo";
import ProductActions from "./ProductDetail/ProductActions";
import CartAndLikeButtons from "./ProductDetail/CartAndLikeButtons";
import ProductInfoSections from "./ProductDetail/ProductInfoSections";
import { useAuth } from "@/providers/AuthProvider";
import { useCategoryStore } from "@/stores/categoryStore";
import Toast from "@/components/common/Toast";
import { useToggleFavorite } from "@/hooks/useToggleFavorite";
import DogSpinner from "@/components/common/DogSpinner";
import icNoOrder from "@/assets/icons/ic_no_order.svg";
import Image from "next/image";
import { SessionExpiredError } from "@/lib/api/auth.errors";
import { useAddToCart } from "@/hooks/useAddToCart";

type TProductDetailProps = {
  productId: number;
};

export default function ProductDetail({ productId }: TProductDetailProps) {
  const [selectedQuantity, setSelectedQuantity] = useState(0);
  const { data: product, isLoading, isError } = useProductDetail(productId);
  const { user } = useAuth();
  const router = useRouter();
  const { setSelectedCategory } = useCategoryStore();

  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastVariant, setToastVariant] = useState<"success" | "error">("success");
  const [isFavorite, setIsFavorite] = useState(false);

  const toggleFavoriteMutation = useToggleFavorite(productId, {
    onOptimisticToggle: () => {
      setIsFavorite((prev) => !prev);
    },
    onRollbackToggle: () => {
      setIsFavorite((prev) => !prev);
    },
    onToggleFavoriteError: (error) => {
      if (error instanceof SessionExpiredError) return;

      showToast("Failed to update favorite.", "error");
    },
  });

  const handleToggleFavorite = (isFavoriteNow: boolean) => {
    toggleFavoriteMutation.mutate(isFavoriteNow);
  };

  const addToCartMutation = useAddToCart({
    onAddToCartSuccess: () => {
      showToast("Added to cart", "success");
    },
    onAddToCartError: (error) => {
      if (error instanceof SessionExpiredError) return;
      showToast("Failed to add item to cart", "error");
    },
  });

  const showToast = (message: string, variant: "success" | "error" = "success") => {
    setToastMessage(message);
    setToastVariant(variant);
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 2000);
  };

  useEffect(() => {
    if (product?.category?.id) {
      setSelectedCategory({
        id: product.category.id,
        parent: product.category.parent?.name || "",
        child: product.category.name,
      });
    }
  }, [product?.category, setSelectedCategory]);

  useEffect(() => {
    if (product) {
      setIsFavorite(product.isFavorite);
    }
  }, [product]);

  if (isLoading) {
    return (
      <div className="flex flex-col justify-center h-screen">
        <DogSpinner />
      </div>
    );
  }
  if (isError || !product)
    return (
      <section className="flex flex-1 justify-center min-h-screen" role="status" aria-label="Empty state">
        <div className="sm:w-80 inline-flex flex-col justify-start items-center gap-7 py-12 mt-[142px] sm:mt-[222px] md:mt-[191px]">
          <div className="w-24 h-24 relative" role="img" aria-label="No product found icon">
            <Image src={icNoOrder} alt="No product found" fill className="object-contain" />
          </div>
          <div className="self-stretch flex flex-col justify-start items-center gap-12">
            <div className="w-72 flex flex-col justify-start items-center gap-2.5">
              <h2 className="self-stretch text-center text-neutral-800 text-2xl font-extrabold">No product found</h2>
              <p className="self-stretch text-center text-neutral-700 text-base leading-relaxed">
                Add the product you want
                <br />
                from the product list.
              </p>
            </div>
            <button
              className="self-stretch h-16 px-4 py-3 bg-neutral-800 rounded-sm inline-flex justify-center items-center cursor-pointer"
              onClick={() => router.push("/products")}
              aria-label="Go to product list"
            >
              <span className="text-white text-base font-bold">Go to Product List</span>
            </button>
          </div>
        </div>
      </section>
    );

  const handleAddToCart = () => {
    if (selectedQuantity < 1) {
      alert("Please choose at least one item.");
      return;
    }
    addToCartMutation.mutate({
      productId: product.id,
      quantity: selectedQuantity,
    });
  };

  const canEdit = user?.id === product.creatorId || user?.role === "ADMIN" || user?.role === "SUPER_ADMIN";

  return (
    <div className="w-full flex flex-col justify-center items-center sm:max-w-[1180px]">
      <div className="w-full flex flex-col justify-center items-start gap-7.5">
        <CategoryNavigation
          parentCategory={product.category.parent?.name ?? "Other"}
          childCategory={product.category.name}
        />
        <div className="w-full flex flex-col md:flex-row md:gap-10 ">
          <ProductImage imageUrl={product.imageUrl} />
          <div className="flex flex-col justify-center md:justify-start items-center w-full gap-8 md:gap-7.5 pt-7.5 md:pt-8">
            <div className="self-stretch inline-flex justify-between items-start">
              <ProductBasicInfo product={product} />
              <ProductActions
                selectedQuantity={selectedQuantity}
                onQuantityChange={setSelectedQuantity}
                canEdit={canEdit}
                productId={product.id}
                productName={product.name}
                showToast={showToast}
              />
            </div>
            <div className="flex flex-col justify-center items-center w-full">
              <CartAndLikeButtons
                onAddToCart={handleAddToCart}
                isFavorite={isFavorite}
                onToggleFavorite={handleToggleFavorite}
                productId={product.id}
              />
              <ProductInfoSections />
            </div>
          </div>
        </div>
      </div>
      {toastVisible && <Toast text={toastMessage} variant={toastVariant} isVisible={toastVisible} />}
    </div>
  );
}
