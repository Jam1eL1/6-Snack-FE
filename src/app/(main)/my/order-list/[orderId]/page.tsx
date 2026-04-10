"use client";

import { useState, useEffect, useRef, useCallback, useMemo, Suspense, lazy, memo } from "react";
import { useParams, useRouter } from "next/navigation";
import Head from "next/head";
import { getMyOrderDetail, TMyOrderDetail } from "@/lib/api/orderHistory.api";
import { cookieFetch } from "@/lib/api/fetchClient.api";
import Toast from "@/components/common/Toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getStatusText, formatDate } from "@/components/common/OrderDetail";
import DogSpinner from "@/components/common/DogSpinner";

// Lazy loading으로 컴포넌트 분리 - 더 세밀한 코드 분할
const OrderItemsSection = lazy(() => import("@/components/common/OrderDetail/OrderItemsSection"));
const RequestInfoSection = lazy(() => import("@/components/common/OrderDetail/RequestInfoSection"));
const ApprovalInfoSection = lazy(() => import("@/components/common/OrderDetail/ApprovalInfoSection"));

// 타입 정의
type TMyOrderDetailPageProps = Record<string, never>;

// 간단한 로딩 컴포넌트
const LoadingComponent = () => (
  <div className="flex justify-center items-center h-[80vh] md:h-[60vh]">
    <DogSpinner />
  </div>
);

// 최적화된 에러 컴포넌트
const ErrorComponent = memo(({ error }: { error: string | null }) => (
  <div className="min-h-screen bg-white flex items-center justify-center">
    <div className="text-lg text-red-600">{error || "주문 내역을 찾을 수 없습니다."}</div>
  </div>
));

ErrorComponent.displayName = "ErrorComponent";

// 최적화된 액션 버튼 컴포넌트
const ActionButtons = memo(
  ({
    onBackToList,
    onAddToCart,
    isAddingToCart,
  }: {
    onBackToList: () => void;
    onAddToCart: () => void;
    isAddingToCart: boolean;
  }) => (
    <div className="self-stretch flex justify-center items-center gap-4 pt-6 sm:pt-8">
      <button
        className="w-[155.5px] sm:w-[338px] md:w-[296px] h-16 px-4 py-3 bg-white rounded-[2px] outline outline-1 outline-offset-[-1px] outline-zinc-400 inline-flex justify-center items-center cursor-pointer hover:bg-primary-50 transition-colors duration-200"
        onClick={onBackToList}
        type="button"
      >
        <div className="text-center justify-center text-primary-800 text-base font-bold">목록 보기</div>
      </button>
      <button
        className="w-[155.5px] sm:w-[338px] md:w-[300px] h-16 px-4 py-3 bg-primary-800 rounded-[2px] inline-flex justify-center items-center cursor-pointer hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
        onClick={onAddToCart}
        disabled={isAddingToCart}
        type="button"
      >
        <div className="text-center justify-center text-white text-base font-bold">
          {isAddingToCart ? "처리 중..." : "장바구니 다시 담기"}
        </div>
      </button>
    </div>
  ),
);

ActionButtons.displayName = "ActionButtons";

export default function MyOrderDetailPage({}: TMyOrderDetailPageProps) {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const orderId: string = params.orderId as string;

  const [orderData, setOrderData] = useState<TMyOrderDetail | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
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

  // 메모이제이션된 fetchOrderDetail 함수 - 더 효율적인 비동기 처리
  const fetchOrderDetail = useCallback(async (): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);

      // 비동기 작업을 별도로 처리하여 메인 스레드 블로킹 방지
      const data: TMyOrderDetail = await getMyOrderDetail(orderId);

      // 상태 업데이트를 즉시 실행하여 LCP 개선
      setOrderData(data);
      setIsLoading(false);
    } catch {
      setError("주문 내역을 불러오는데 실패했습니다.");
      setIsLoading(false);
    }
  }, [orderId]);

  useEffect(() => {
    if (orderId) {
      // 즉시 실행하여 FCP 개선
      fetchOrderDetail();
    }
  }, [orderId, fetchOrderDetail]);

  // 타이머 언마운트 시 클린업
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  // 목록으로 돌아가기 - 메모이제이션
  const handleBackToList = useCallback(() => {
    router.push("/my/order-list");
  }, [router]);

  // Toast 표시 함수 - 메모이제이션
  const showToast = useCallback((text: string, variant: "success" | "error" = "error") => {
    setToast({
      isVisible: true,
      text,
      variant,
    });

    // 기존 타이머가 있다면 정리
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    // 3초 후 자동으로 숨기기
    timerRef.current = setTimeout(() => {
      setToast((prev) => ({ ...prev, isVisible: false }));
    }, 3000);
  }, []);

  // 장바구니에 상품 추가하는 API 함수 - 메모이제이션
  const addToCart = useCallback(async (productId: number, quantity: number): Promise<void> => {
    try {
      await cookieFetch("/cart", {
        method: "POST",
        body: JSON.stringify({
          productId,
          quantity,
        }),
      });
    } catch (error) {
      throw error;
    }
  }, []);

  // 장바구니 추가 mutation
  const { mutate: addToCartMutation, isPending: isAddingToCart } = useMutation({
    mutationFn: async () => {
      if (!orderData || !orderData.receipts) return;

      // 주문 내역의 각 상품을 개별적으로 장바구니에 추가
      for (const item of orderData.receipts) {
        await addToCart(item.productId, item.quantity);
      }
    },
    onSuccess: () => {
      // cartItems queryKey로 캐시 무효화
      queryClient.invalidateQueries({ queryKey: ["cartItems"] });
      showToast("장바구니에 상품이 추가되었습니다.", "success");
    },
    onError: () => {
      showToast("장바구니에 상품을 추가하는데 실패했습니다.", "error");
    },
  });

  // 장바구니에 다시 담기 - 메모이제이션
  const handleAddToCart = useCallback(() => {
    if (!orderData || !orderData.receipts) return;
    addToCartMutation();
  }, [orderData, addToCartMutation]);

  // 페이지 제목 메모이제이션
  const pageTitle = useMemo(() => {
    if (orderData) {
      return `구매 요청 내역 - ${orderData.receipts?.length || 0}개 상품`;
    }
    return "구매 요청 내역";
  }, [orderData]);

  // 메인 컨텐츠 메모이제이션
  const mainContent = useMemo(() => {
    if (!orderData) return null;

    return (
      <div className="min-h-screen bg-white">
        <Toast text={toast.text} variant={toast.variant} isVisible={toast.isVisible} />
        <div className="w-full max-w-7xl mx-auto pt-[30px] flex flex-col justify-start items-start gap-[23px]">
          <div className="self-stretch justify-center text-primary-950 text-lg font-bold">구매 요청 내역</div>

          <Suspense
            fallback={<div className="w-full h-32 bg-primary-100 rounded" style={{ minHeight: "128px" }}></div>}
          >
            <OrderItemsSection
              receipts={orderData.receipts}
              title="요청 품목"
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

          {/* Bottom Action Buttons */}
          <ActionButtons
            onBackToList={handleBackToList}
            onAddToCart={handleAddToCart}
            isAddingToCart={isAddingToCart}
          />
        </div>
      </div>
    );
  }, [orderData, toast, handleBackToList, handleAddToCart, isAddingToCart]);

  // Critical CSS 최적화 - 더 가벼운 스타일
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

  // 메인 페이지 렌더링 최적화
  if (isLoading) {
    return (
      <>
        <Head>
          <title>구매 요청 내역 - 로딩 중</title>
          <meta name="description" content="구매 요청 내역을 불러오는 중입니다." />
          <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />

          {/* Preconnect 최적화 - LCP 개선 */}
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
          <link rel="dns-prefetch" href="//fonts.googleapis.com" />
          <link rel="dns-prefetch" href="//fonts.gstatic.com" />

          {/* 외부 API preconnect - 라이트하우스 권장사항 */}
          <link rel="preconnect" href="http://localhost:8080" />

          {/* Critical CSS 인라인화 - 최적화된 버전 */}
          <style dangerouslySetInnerHTML={{ __html: criticalCSS }} />
        </Head>
        <LoadingComponent />
      </>
    );
  }

  if (error || !orderData) {
    return (
      <>
        <Head>
          <title>구매 요청 내역 - 오류</title>
          <meta name="description" content="구매 요청 내역을 불러오는데 실패했습니다." />
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
          content={`구매 요청 내역 상세 페이지입니다. ${orderData.receipts?.length || 0}개의 상품이 포함되어 있습니다.`}
        />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />

        {/* Preconnect 최적화 - LCP 개선 */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="dns-prefetch" href="//fonts.gstatic.com" />

        {/* 외부 API preconnect - 라이트하우스 권장사항 */}
        <link rel="preconnect" href="http://localhost:8080" />

        {/* 폰트 preload - LCP 개선 */}
        <link rel="preload" href="/fonts/suit.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />

        {/* Critical CSS 인라인화 - 최적화된 버전 */}
        <style dangerouslySetInnerHTML={{ __html: criticalCSS }} />
      </Head>
      {mainContent}
    </>
  );
}
