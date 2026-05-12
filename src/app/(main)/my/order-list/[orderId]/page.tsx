"use client";

import { useState, useEffect, useRef, Suspense, lazy } from "react";
import { useParams, useRouter } from "next/navigation";
import Head from "next/head";
import Toast from "@/components/common/Toast";
import { getStatusText, formatDate } from "@/components/common/OrderDetail";
import DogSpinner from "@/components/common/DogSpinner";
import { SessionExpiredError } from "@/lib/api/auth.errors";
import { useReorderToCart } from "@/hooks/useReorderToCart";
import { useMyOrderDetail } from "@/hooks/useOrderDetail";

// Lazy-load the detail sections for finer-grained code splitting.
const OrderItemsSection = lazy(() => import("@/components/common/OrderDetail/OrderItemsSection"));
const RequestInfoSection = lazy(() => import("@/components/common/OrderDetail/RequestInfoSection"));
const ApprovalInfoSection = lazy(() => import("@/components/common/OrderDetail/ApprovalInfoSection"));

const LoadingComponent = () => (
  <div className="flex justify-center items-center h-[80vh] md:h-[60vh]">
    <DogSpinner />
  </div>
);

const ErrorComponent = ({ error }: { error: string | null }) => (
  <div className="min-h-screen bg-white flex items-center justify-center">
    <div className="text-lg text-red-600">{error || "Order history not found."}</div>
  </div>
);

const ActionButtons = ({
  onBackToList,
  onReorderToCart,
  isReorderingToCart,
}: {
  onBackToList: () => void;
  onReorderToCart: () => void;
  isReorderingToCart: boolean;
}) => (
  <div className="self-stretch flex justify-center items-center gap-4 pt-6 sm:pt-8">
    <button
      className="w-[155.5px] sm:w-[338px] md:w-[296px] h-16 px-4 py-3 bg-white rounded-[2px] outline outline-1 outline-offset-[-1px] outline-zinc-400 inline-flex justify-center items-center cursor-pointer hover:bg-primary-50 transition-colors duration-200"
      onClick={onBackToList}
      type="button"
    >
      <div className="text-center justify-center text-primary-800 text-base font-bold">View List</div>
    </button>
    <button
      className="w-[155.5px] sm:w-[338px] md:w-[300px] h-16 px-4 py-3 bg-primary-800 rounded-[2px] inline-flex justify-center items-center cursor-pointer hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
      onClick={onReorderToCart}
      disabled={isReorderingToCart}
      type="button"
    >
      <div className="text-center justify-center text-white text-base font-bold">
        {isReorderingToCart ? "Processing..." : "Add to Cart Again"}
      </div>
    </button>
  </div>
);

export default function MyOrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const orderId: string = params.orderId as string;

  const [toast, setToast] = useState<{
    isVisible: boolean;
    text: string;
    variant: "success" | "error";
  }>({
    isVisible: false,
    text: "",
    variant: "error",
  });

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const { data: orderData, isLoading, isError } = useMyOrderDetail(orderId);
  // Clear the timer on unmount.
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  const handleBackToList = () => {
    router.push("/my/order-list");
  };

  const showToast = (text: string, variant: "success" | "error" = "error") => {
    setToast({
      isVisible: true,
      text,
      variant,
    });

    // Clear the existing timer if one is already running.
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    // Hide the toast automatically after 3 seconds.
    timerRef.current = setTimeout(() => {
      setToast((prev) => ({ ...prev, isVisible: false }));
    }, 3000);
  };

  const reorderToCartMutation = useReorderToCart({
    onReorderToCartSuccess: () => {
      showToast("Items added to cart.", "success");
    },
    onReorderToCartError: (error) => {
      if (error instanceof SessionExpiredError) return;

      showToast("Failed to add items to cart.", "error");
    },
  });

  const handleReorderToCart = () => {
    if (!orderData || !orderData.receipts) return;

    reorderToCartMutation.mutate(orderData);
  };

  const pageTitle = orderData
    ? `Purchase Request History - ${orderData.receipts?.length || 0} items`
    : "Purchase Request History";

  // Lightweight critical CSS
  const criticalCSS = `
    .min-h-screen { min-height: 100vh; }
    .bg-white { background-color: #ffffff; }
    .text-primary-950 { color: #0f172a; }
    .text-lg { font-size: 1.125rem; line-height: 1.75rem; }
    .font-bold { font-weight: 700; }
    .w-full { width: 100%; }
    .max-w-7xl { max-width: 80rem; }
    .mx-auto { margin-left: auto; margin-right: auto; }
    .pt-\[30px\] { padding-top: 1.875rem; }
    .flex { display: flex; }
    .flex-col { flex-direction: column; }
    .justify-start { justify-content: flex-start; }
    .items-start { align-items: flex-start; }
    .gap-\[23px\] { gap: 1.4375rem; }
    .bg-primary-100 { background-color: #f1f5f9; }
    .rounded { border-radius: 0.25rem; }
    .h-32 { height: 8rem; }
    .min-h-\[128px\] { min-height: 8rem; }
  `;

  if (isLoading) {
    return (
      <>
        <Head>
          <title>Purchase Request History - Loading</title>
          <meta name="description" content="Loading purchase request history." />
          <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />

          {/* Preconnect hints to help LCP. */}
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
          <link rel="dns-prefetch" href="//fonts.googleapis.com" />
          <link rel="dns-prefetch" href="//fonts.gstatic.com" />

          {/* Preconnect to the external API per Lighthouse guidance. */}
          <link rel="preconnect" href="http://localhost:8080" />

          {/* Inline optimized critical CSS. */}
          <style dangerouslySetInnerHTML={{ __html: criticalCSS }} />
        </Head>
        <LoadingComponent />
      </>
    );
  }

  if (isError || !orderData) {
    return (
      <>
        <Head>
          <title>Purchase Request History - Error</title>
          <meta name="description" content="Failed to load purchase request history." />
          <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        </Head>
        <ErrorComponent error="Failed to load order history." />
      </>
    );
  }

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta
          name="description"
          content={`Purchase request history detail page. Includes ${orderData.receipts?.length || 0} items.`}
        />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />

        {/* Preconnect hints to help LCP. */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="dns-prefetch" href="//fonts.gstatic.com" />

        {/* Preconnect to the external API per Lighthouse guidance. */}
        <link rel="preconnect" href="http://localhost:8080" />

        {/* Preload the font to help LCP. */}
        <link rel="preload" href="/fonts/suit.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />

        {/* Inline optimized critical CSS. */}
        <style dangerouslySetInnerHTML={{ __html: criticalCSS }} />
      </Head>
      <div className="min-h-screen bg-white">
        <Toast text={toast.text} variant={toast.variant} isVisible={toast.isVisible} />
        <div className="w-full max-w-7xl mx-auto pt-[30px] flex flex-col justify-start items-start gap-[23px]">
          <div className="self-stretch justify-center text-primary-950 text-lg font-bold">Purchase Request History</div>

          <Suspense
            fallback={<div className="w-full h-32 bg-primary-100 rounded" style={{ minHeight: "128px" }}></div>}
          >
            <OrderItemsSection
              receipts={orderData.receipts}
              title="Requested Items"
              productsPriceTotal={orderData.productsPriceTotal}
              shippingFee={orderData.deliveryFee}
            />
          </Suspense>

          <Suspense
            fallback={<div className="w-full h-32 bg-primary-100 rounded" style={{ minHeight: "128px" }}></div>}
          >
            <RequestInfoSection
              userName={orderData.user?.name}
              createdAt={orderData.createdAt}
              requestMessage={orderData.requestMessage}
              formatDate={formatDate}
            />
          </Suspense>

          <Suspense
            fallback={<div className="w-full h-32 bg-primary-100 rounded" style={{ minHeight: "128px" }}></div>}
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

          <ActionButtons
            onBackToList={handleBackToList}
            onReorderToCart={handleReorderToCart}
            isReorderingToCart={reorderToCartMutation.isPending}
          />
        </div>
      </div>
    </>
  );
}
