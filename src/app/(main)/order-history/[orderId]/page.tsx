"use client";

import { useState, useEffect, useCallback, useMemo, Suspense, lazy } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import Head from "next/head";
import { getStatusText, formatDate } from "@/components/common/OrderDetail";
import DogSpinner from "@/components/common/DogSpinner";
import { TAdminOrderDetail } from "@/types/order.types";
import { getOrderDetail } from "@/lib/api/orderManage.api";

// Lazy-load the detail sections for finer-grained code splitting.
const OrderItemsSection = lazy(() => import("@/components/common/OrderDetail/OrderItemsSection"));
const RequestInfoSection = lazy(() => import("@/components/common/OrderDetail/RequestInfoSection"));
const ApprovalInfoSection = lazy(() => import("@/components/common/OrderDetail/ApprovalInfoSection"));

// Type definitions
type TOrderStatus = "pending" | "approved" | null;

type TOrderHistoryDetailPageProps = Record<string, never>;

// Simple loading component
const LoadingComponent = () => (
  <div className="flex justify-center items-center h-[80vh] md:h-[60vh]">
    <DogSpinner />
  </div>
);

// Optimized error component
const ErrorComponent = ({ error }: { error: string | null }) => (
  <div className="min-h-screen bg-white flex items-center justify-center">
    <div className="text-lg text-red-600">{error || "Order details could not be found."}</div>
  </div>
);

export default function OrderHistoryDetailPage({}: TOrderHistoryDetailPageProps) {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const orderId: string = params.orderId as string;
  const status: TOrderStatus = searchParams.get("status") as TOrderStatus;

  const [orderData, setOrderData] = useState<TAdminOrderDetail | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Memoized navigation handlers
  const handleGoHome = useCallback(() => {
    router.push("/products");
  }, [router]);

  const handleGoToOrderHistory = useCallback(() => {
    router.push("/order-history");
  }, [router]);

  // Memoized fetchOrderDetail to keep main-thread work lighter.
  const fetchOrderDetail = useCallback(async (): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);

      // Keep the async work separate to avoid blocking the main thread.
      const data: TAdminOrderDetail = await getOrderDetail(orderId, status || undefined);

      // Defer state updates with requestAnimationFrame for smoother rendering.
      requestAnimationFrame(() => {
        setOrderData(data);
        setIsLoading(false);
      });
    } catch {
      requestAnimationFrame(() => {
        setError("Failed to load the order details.");
        setIsLoading(false);
      });
    }
  }, [orderId, status]);

  useEffect(() => {
    if (orderId) {
      // Slightly defer the initial load to help FCP.
      const timer = setTimeout(() => {
        fetchOrderDetail();
      }, 0);

      return () => clearTimeout(timer);
    }
  }, [orderId, fetchOrderDetail]);

  // Memoized page title
  const pageTitle = useMemo(() => {
    if (orderData) {
      return `Order Details - ${orderData.products?.length || 0} products`;
    }
    return "Order Details";
  }, [orderData]);

  // Memoized main content to reduce layout shift.
  const mainContent = useMemo(() => {
    if (!orderData) return null;

    return (
      <div className="min-h-screen bg-white">
        <div className="w-full max-w-7xl mx-auto pt-[30px] flex flex-col justify-start items-start gap-[23px]">
          <div className="self-stretch justify-center text-primary-950 text-lg font-bold ">Order Details</div>

          <Suspense
            fallback={
              <div className="w-full h-32 bg-primary-100 animate-pulse rounded" style={{ minHeight: "128px" }}></div>
            }
          >
            <OrderItemsSection
              products={orderData.products}
              title="Order Items"
              productsPriceTotal={orderData.productsPriceTotal}
              shippingFee={orderData.deliveryFee}
            />
          </Suspense>

          <Suspense
            fallback={
              <div className="w-full h-32 bg-primary-100 animate-pulse rounded" style={{ minHeight: "128px" }}></div>
            }
          >
            <RequestInfoSection
              requester={orderData.requester}
              createdAt={orderData.createdAt}
              requestMessage={orderData.requestMessage}
              formatDate={formatDate}
            />
          </Suspense>
          <Suspense
            fallback={
              <div className="w-full h-32 bg-primary-100 animate-pulse rounded" style={{ minHeight: "128px" }}></div>
            }
          >
            <ApprovalInfoSection
              approver={orderData.approver}
              updatedAt={orderData.updatedAt}
              status={orderData.status}
              adminMessage={orderData.adminMessage}
              formatDate={formatDate}
              getStatusText={getStatusText}
            />
          </Suspense>
          {/* Bottom action buttons */}
          <div className="self-stretch h-16 inline-flex justify-start md:justify-center items-center gap-5 mt-8">
            <button
              className="flex-1 md:flex-none md:w-[260px] h-16 px-4 py-3 bg-white rounded-[2px] outline-1 outline-offset-[-1px] outline-zinc-400 flex justify-center items-center text-lg font-semibold cursor-pointer hover:bg-primary-50 transition-colors duration-200"
              onClick={handleGoHome}
              type="button"
            >
              Home
            </button>
            <button
              className="flex-1 md:flex-none md:w-[264px] h-16 px-4 py-3 bg-primary-800 rounded-[2px] flex justify-center items-center text-base font-bold cursor-pointer hover:bg-primary-700 transition-colors duration-200 text-white"
              onClick={handleGoToOrderHistory}
              type="button"
            >
              Back to Order History
            </button>
          </div>
        </div>
      </div>
    );
  }, [orderData, handleGoHome, handleGoToOrderHistory]);

  if (isLoading) {
    return (
      <>
        <Head>
          <title>Order Details - Loading</title>
          <meta name="description" content="Loading order details." />
          <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
          <link rel="dns-prefetch" href="//fonts.googleapis.com" />
          <link rel="dns-prefetch" href="//fonts.gstatic.com" />
          {/* Inline critical CSS. */}
          <style
            dangerouslySetInnerHTML={{
              __html: `
              @font-face {
                font-family: 'SUIT';
                src: url('/fonts/suit.woff2') format('woff2');
                font-display: swap;
              }
              .min-h-screen { min-height: 100vh; }
              .bg-white { background-color: #ffffff; }
              .animate-pulse { animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
              @keyframes pulse {
                0%, 100% { opacity: 1; }
                50% { opacity: .5; }
              }
            `,
            }}
          />
        </Head>
        <LoadingComponent />
      </>
    );
  }

  if (error || !orderData) {
    return (
      <>
        <Head>
          <title>Order Details - Error</title>
          <meta name="description" content="Failed to load the order details." />
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
        <meta name="description" content={`Order details for ${orderData.products?.length || 0} products.`} />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="dns-prefetch" href="//fonts.gstatic.com" />
        <link rel="preload" href="/fonts/suit.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        {/* Inline critical CSS. */}
        <style
          dangerouslySetInnerHTML={{
            __html: `
            @font-face {
              font-family: 'SUIT';
              src: url('/fonts/suit.woff2') format('woff2');
              font-display: swap;
            }
            .min-h-screen { min-height: 100vh; }
            .bg-white { background-color: #ffffff; }
            .animate-pulse { animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
            @keyframes pulse {
              0%, 100% { opacity: 1; }
              50% { opacity: .5; }
            }
          `,
          }}
        />
      </Head>
      {mainContent}
    </>
  );
}
