"use client";

import React, { useCallback, useMemo } from "react";
import { useRouter, useParams } from "next/navigation";
import Head from "next/head";
import Image from "next/image";
import Button from "@/components/ui/Button";
import clsx from "clsx";
import ArrowIconSvg from "@/components/svg/ArrowIconSvg";
import { useMyOrderDetail } from "@/hooks/useOrderDetail";
import { useAuth } from "@/providers/AuthProvider";
import { formatPrice } from "@/lib/utils/formatPrice.util";
import DogSpinner from "@/components/common/DogSpinner";

// Memoized product item component
const ProductItem = React.memo(({ receipt }: { receipt: { price: number; quantity: number; imageUrl: string; productName: string } }) => {
  const totalPrice = useMemo(() => receipt.price * receipt.quantity, [receipt.price, receipt.quantity]);
  
  return (
    <div
      className="self-stretch border-b border-primary-200 inline-flex justify-between items-center pb-[8px] sm:py-5 sm:pr-5"
    >
      <div className="flex gap-5 flex-1 sm:flex sm:justify-start sm:items-center sm:gap-5">
        <div className="relative w-[72px] sm:w-[140px] h-[72px] sm:h-[140px] bg-primary-50 rounded-xs sm:bg-white flex justify-center items-center flex-shrink-0">
          <div className="relative w-[75%] h-[75%]">
            <Image
              src={receipt.imageUrl}
              alt={`${receipt.productName} product image`}
              fill
              className="object-contain"
            />
          </div>
        </div>
        <div className="flex-1 inline-flex flex-col items-start gap-2 sm:justify-start sm:inline-flex sm:flex-col sm:justify-start sm:items-start sm:gap-7">
          <div className="flex flex-col justify-center items-start gap-1 sm:justify-start sm:gap-2.5">
            <div className="text-center justify-center text-primary-950 text-sm sm:text-base font-medium">
              {receipt.productName}
            </div>
            <div className="justify-start text-primary-950 text-sm sm:text-base font-bold">
              ${formatPrice(receipt.price)}
            </div>
          </div>
          <div className="flex justify-between items-center w-full sm:justify-start sm:flex sm:justify-start">
            <div className="justify-center text-primary-500 text-[13px] sm:text-base font-bold">
              Quantity {receipt.quantity}
            </div>
            <div className="text-center justify-center text-primary-700 text-base font-bold sm:hidden">
              ${formatPrice(totalPrice)}
            </div>
          </div>
        </div>
      </div>
      <div className="hidden sm:block text-center justify-center text-primary-700 text-[20px] font-extrabold">
        ${formatPrice(totalPrice)}
      </div>
    </div>
  );
});

ProductItem.displayName = 'ProductItem';

// Loading state
const LoadingComponent = () => (
  <div className="flex justify-center items-center h-[80vh] md:h-[60vh]">
    <DogSpinner />
  </div>
);

// Error state
const ErrorComponent = ({ error }: { error: Error | null }) => (
  <div className="min-h-screen bg-white flex items-center justify-center">
    <div className="text-base sm:text-lg md:text-xl text-red-600">
      {error?.message || "Order details could not be found."}
    </div>
  </div>
);

export default function OrderConfirmedPage() {
  const router = useRouter();
  const params = useParams();
  const { user } = useAuth();
  
  // Read the Order ID from the URL
  const orderId = params.orderId as string;

  // Fetch the Order detail through React Query
  const { data: orderData, isLoading, error } = useMyOrderDetail(orderId);

  // Memoized event handlers
  const handleViewOrderHistory = useCallback(() => {
    if (user?.role === "USER") {
      router.push("/my/order-list");
    } else {
      router.push("/order-history");
    }
  }, [router, user?.role]);

  const handleBackToCart = useCallback(() => {
    router.push("/cart");
  }, [router]);

  // Memoized totals
  const shippingFee = useMemo(() => orderData ? orderData.deliveryFee : 0, [orderData]);
  const totalAmount = useMemo(() => 
    orderData ? orderData.productsPriceTotal + shippingFee : 0, 
    [orderData, shippingFee]
  );

  // Memoized page title
  const pageTitle = useMemo(() => {
    if (orderData) {
      return `Order Confirmed - ${orderData.receipts?.length || 0} Items`;
    }
    return "Order Confirmed";
  }, [orderData]);

  // Memoized button text
  const buttonText = useMemo(() => {
    return "View Order History";
  }, [user?.role]);

  // Memoized progress steps
  const progressSteps = useMemo(() => {
    if (user?.role === "USER") {
      return (
        <>
          <div className="justify-center text-zinc-400 text-base sm:text-lg md:text-lg font-bold">
            1. Shopping Cart
          </div>
          <div className="hidden sm:block">
            <ArrowIconSvg direction="right" className="w-6 h-6 text-zinc-400 cursor-default" />
          </div>
          <div className="justify-center text-zinc-400 text-base sm:text-lg md:text-lg font-bold">
            2. Order
          </div>
          <div className="hidden sm:block">
            <ArrowIconSvg direction="right" className="w-6 h-6 text-zinc-400 cursor-default" />
          </div>
          <div className="justify-center text-primary-950 text-base sm:text-lg md:text-lg font-bold">
            3. Order Confirmed
          </div>
        </>
      );
    } else {
      return (
        <>
          <div className="justify-center text-zinc-400 text-base sm:text-lg md:text-lg font-bold">
            1. Shopping Cart
          </div>
          <div className="hidden sm:block">
            <ArrowIconSvg direction="right" className="w-6 h-6 text-zinc-400 cursor-default" />
          </div>
          <div className="justify-center text-primary-800 text-base sm:text-lg md:text-lg font-bold">
            2. Order Confirmed
          </div>
        </>
      );
    }
  }, [user?.role]);

  // Memoized confirmation message
  const completionMessage = useMemo(() => {
    return user?.role === "USER" ? "Your purchase request has been submitted." : "Your order has been placed.";
  }, [user?.role]);

  // Memoized page content
  const mainContent = useMemo(() => {
    if (!orderData) return null;
    
    return (
      <div
        className={clsx(
          "min-h-screen",
          "bg-white",
          "text-primary-950",
          "flex",
          "flex-col",
        )}
      >
        <main
          className={clsx(
            "flex-1",
            "p-4",
            "sm:p-6",
            "md:p-8",
            "max-w-7xl",
            "mx-auto",
            "w-full",
            "flex",
            "flex-col",
            "items-center",
            "gap-10",
            "sm:gap-12",
            "md:gap-16",
            "pt-10",
            "sm:pt-12",
            "md:pt-16",
            "pb-24",
            "sm:pb-28",
            "md:pb-32",
          )}
        >
          {/* Progress steps */}
          <div className="flex flex-col sm:flex-row md:gap-5 justify-center items-center gap-2.5 sm:gap-4">
            {progressSteps}
          </div>

          {/* Confirmation message */}
          <div className="self-stretch text-center justify-center text-primary-800 text-2xl sm:text-3xl md:text-3xl font-bold">
            {completionMessage}
          </div>

          {/* Order items */}
          <div className="self-stretch flex flex-col justify-start items-start gap-10">
            <div className="self-stretch flex flex-col justify-start items-start gap-[15px]">
              <div className="inline-flex justify-start items-start gap-1.5">
                <div className="justify-center text-primary-950 text-base font-bold">Requested Items</div>
                <div className="justify-center text-primary-950 text-base font-normal">
                  {orderData.receipts.length} items total
                </div>
              </div>

              <div className="self-stretch bg-white rounded-sm sm:shadow-[0px_2px_8px_0px_rgba(0,0,0,0.1)] md:shadow-[0px_2px_8px_0px_rgba(0,0,0,0.1)] flex flex-col justify-start items-start gap-5 sm:px-5 sm:pt-5 sm:pb-[30px] md:px-[60px] md:py-[40px]">
                {/* Product list */}
                <div className="self-stretch flex flex-col justify-start items-start gap-[16px] sm:gap-0">
                  {orderData.receipts.map((receipt) => (
                    <ProductItem key={receipt.id} receipt={receipt} />
                  ))}
                </div>

                {/* Order totals */}
                <div className="self-stretch flex flex-col gap-3 sm:gap-[7px] sm:px-5">
                  <div className="flex justify-between items-center">
                    <div className="text-center justify-center text-primary-700 text-sm sm:text-base font-bold">
                      Items
                    </div>
                    <div className="text-center justify-center text-primary-700 text-sm sm:text-base font-bold">
                      ${formatPrice(orderData.productsPriceTotal)}
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="text-center justify-center text-primary-700 text-sm sm:text-base font-bold">
                      Shipping Fee
                    </div>
                    <div className="text-center justify-center text-primary-700 text-sm sm:text-base font-bold">
                      ${formatPrice(shippingFee)}
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="text-center justify-center text-primary-950 text-lg sm:text-lg font-bold">
                      Order Total
                    </div>
                    <div className="text-center justify-center text-primary-950 text-lg sm:text-2xl font-bold sm:font-extrabold">
                      ${formatPrice(totalAmount)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Request message */}
          <div className="self-stretch flex flex-col justify-start items-start gap-5">
            <div className="self-stretch justify-center text-primary-800 text-base font-bold">
              Request Message
            </div>
            <div className="self-stretch h-40 p-6 bg-white rounded-sm outline-1 outline-offset-[-1px] outline-primary-300 inline-flex justify-start items-start gap-2 overflow-hidden">
              <div className="justify-center text-primary-400 text-base font-normal leading-relaxed">
                {orderData.requestMessage || "No request message was provided."}
              </div>
            </div>
          </div>

          {/* Page actions */}
          <div className="self-stretch h-16 inline-flex justify-start md:justify-center items-center gap-5">
            <div
              className="flex-1 md:flex-none md:w-[260px] h-16 px-4 py-3 bg-white rounded-[2px] outline-1 outline-offset-[-1px] outline-zinc-400 flex justify-center items-center text-base font-semibold cursor-pointer border border-zinc-400"
              onClick={handleBackToCart}
            >
              <span className="block sm:hidden text-center">Cart</span>
              <span className="hidden sm:block">Back to Cart</span>
            </div>
            <Button
              type="black"
              label={buttonText}
              className="flex-1 md:flex-none md:w-[264px] h-16 px-4 py-3 bg-primary-800 rounded-[2px] flex justify-center items-center text-base font-bold"
              onClick={handleViewOrderHistory}
            />
          </div>
        </main>
      </div>
    );
  }, [orderData, progressSteps, completionMessage, shippingFee, totalAmount, handleBackToCart, handleViewOrderHistory, buttonText]);

  if (isLoading) {
    return (
      <>
        <Head>
          <title>Order Confirmed - Loading</title>
          <meta name="description" content="Loading Order information." />
          <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
          <link rel="dns-prefetch" href="//fonts.googleapis.com" />
          <link rel="dns-prefetch" href="//fonts.gstatic.com" />
        </Head>
        <LoadingComponent />
      </>
    );
  }

  if (error || !orderData) {
    return (
      <>
        <Head>
          <title>Order Confirmed - Error</title>
          <meta name="description" content="Unable to load Order information." />
          <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        </Head>
        <ErrorComponent error={error} />
      </>
    );
  }

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta
          name="description"
          content={`Your Order has been confirmed with ${orderData.receipts?.length || 0} items.`}
        />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="dns-prefetch" href="//fonts.gstatic.com" />
        <link rel="preload" href="/fonts/suit.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
      </Head>
      {mainContent}
    </>
  );
}
