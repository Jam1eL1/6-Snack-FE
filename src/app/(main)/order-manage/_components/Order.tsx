"use client";
import Dropdown from "@/components/common/DropDown";
import OrderManageModal from "@/components/common/OrderManageModal";
import Pagination from "@/components/common/Pagination";
import RequestList from "@/components/common/RequestList";
import DogSpinner from "@/components/common/DogSpinner";
import Toast from "@/components/common/Toast";
import { useOrderVisibleCount } from "@/hooks/useOrderVisibleCount";
import { getPendingOrderDetail } from "@/lib/api/orderManage.api";
import { useModal } from "@/providers/ModalProvider";
import { useMemo, useState, useRef, useEffect } from "react";
import Image from "next/image";
import { usePendingOrders } from "@/hooks/usePendingOrders";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { updateOrderStatus } from "@/lib/api/orderManage.api";
import icNoOrder from "@/assets/icons/ic_no_order.svg";
import { useAuth } from "@/providers/AuthProvider";
import { TToastVariant } from "@/types/toast.types";
import { useRouter } from "next/navigation";
import { useOrderStore } from "@/stores/orderStore";

export default function Order() {
  const [currentPaginationPage, setCurrentPaginationPage] = useState<number>(1);
  const { openModal } = useModal();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const router = useRouter();

  // Zustand order state
  const setOrder = useOrderStore((state) => state.setOrder);

  // Toast state
  const [toastVisible, setToastVisible] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string>("");
  const [toastVariant, setToastVariant] = useState<TToastVariant>("success");
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Toast helper
  const showToast = (message: string, variant: TToastVariant) => {
    // Clear the existing timer if there is one.
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    setToastMessage(message);
    setToastVariant(variant);
    setToastVisible(true);
    timerRef.current = setTimeout(() => setToastVisible(false), 3000);
  };

  const orderByMap = useMemo(
    (): Record<string, string> => ({
      최신순: "latest",
      "낮은 가격순": "priceLow",
      "높은 가격순": "priceHigh",
    }),
    [],
  );
  const [orderBy, setOrderBy] = useState<string>(orderByMap["최신순"]);

  const { visibleCount } = useOrderVisibleCount();

  const prevVisibleCountRef = useRef(visibleCount);

  // Order status update mutation
  const { mutate: updateOrderStatusMutation } = useMutation({
    mutationFn: updateOrderStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pendingOrders"] });
    },
  });

  // Invalidate related queries when the user context changes.
  useEffect(() => {
    if (user?.company?.id) {
      queryClient.invalidateQueries({ queryKey: ["pendingOrders"] });
      queryClient.invalidateQueries({ queryKey: ["budgets"] });
    }
  }, [user?.company?.id, queryClient]);

  // Clear the timer when the component unmounts.
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  // Fetch the order list
  const offset = (currentPaginationPage - 1) * visibleCount;
  const {
    data: orderData,
    isLoading,
    error,
  } = usePendingOrders({
    offset,
    limit: visibleCount,
    orderBy,
  });

  const orderRequests = orderData?.orders || [];
  const totalCount = orderData?.meta?.totalCount || 0;
  const totalPages = Math.ceil(totalCount / visibleCount);

  // Recalculate the current page when visibleCount changes.
  useEffect(() => {
    if (prevVisibleCountRef.current !== visibleCount) {
      const currentOffset = (currentPaginationPage - 1) * prevVisibleCountRef.current;
      const newPage = Math.floor(currentOffset / visibleCount) + 1;

      const adjustedPage = Math.max(1, newPage);

      setCurrentPaginationPage(adjustedPage);
      prevVisibleCountRef.current = visibleCount;
    }
  }, [visibleCount, currentPaginationPage]);

  // Keyboard accessibility handler
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
    }
  };

  if (error) {
    return (
      <section className="pt-[30px] w-full relative" role="region" aria-label="주문 관리">
        <div className="text-center py-12 text-red-600" role="alert" aria-live="polite">
          주문 데이터를 불러오는데 실패했습니다.
        </div>
      </section>
    );
  }

  return (
    <section className="pt-[30px] w-full relative" role="region" aria-label="주문 관리">
      <header className="w-full flex justify-between items-center gap-3 pb-3">
        <h1 className="text-black text-base font-bold">구매 요청 관리</h1>
        <div role="group" aria-label="정렬 옵션">
          <Dropdown
            onChange={(selected) => setOrderBy(orderByMap[selected] || orderByMap["최신순"])}
            options={["Newest", "Lowest Price", "Highest Price"]}
            aria-label="주문 목록 정렬"
          />
        </div>
      </header>

      <div className="flex flex-col" role="main" aria-live="polite" aria-busy={isLoading}>
        {isLoading ? (
          <div className="flex justify-center items-center py-12" role="status" aria-label="로딩 중">
            <DogSpinner />
            <span className="sr-only">주문 목록을 불러오는 중입니다.</span>
          </div>
        ) : orderRequests.length > 0 ? (
          <>
            <RequestList
              orderRequests={orderRequests}
              onClickReject={async (orderSummary) => {
                const fullOrder = await getPendingOrderDetail(orderSummary.id);
                openModal(
                  <OrderManageModal
                    order={fullOrder}
                    type="reject"
                    onClick={() => {}}
                    onUpdateOrderStatus={updateOrderStatusMutation}
                    showToast={showToast}
                  />,
                );
              }}
              onClickApprove={async (orderSummary) => {
                const fullOrder = await getPendingOrderDetail(orderSummary.id);
                openModal(
                  <OrderManageModal
                    order={fullOrder}
                    type="approve"
                    onClick={() => {
                      setOrder(fullOrder);
                      router.push("/checkout");
                    }}
                    onUpdateOrderStatus={updateOrderStatusMutation}
                    showToast={showToast}
                  />,
                );
              }}
            />
            <nav className="mt-[20px] sm:mt-10" role="navigation" aria-label="페이지 네비게이션">
              <Pagination
                className="mt-[20px] sm:mt-10"
                currentPage={currentPaginationPage}
                totalPages={totalPages}
                onPageChange={setCurrentPaginationPage}
              />
            </nav>
          </>
        ) : (
          <section className="flex flex-1 justify-center min-h-screen" role="status" aria-label="빈 상태">
            <div className="sm:w-80 inline-flex flex-col justify-start items-center gap-7 py-12 mt-[142px] sm:mt-[222px] md:mt-[191px]">
              <div className="w-24 h-24 relative" role="img" aria-label="주문 내역 없음 아이콘">
                <Image src={icNoOrder} alt="주문 내역 없음" fill className="object-contain" />
              </div>
              <div className="self-stretch flex flex-col justify-start items-center gap-12">
                <div className="w-72 flex flex-col justify-start items-center gap-2.5">
                  <h2 className="self-stretch text-center text-neutral-800 text-2xl font-extrabold">
                    요청 내역이 없어요
                  </h2>
                  <p className="self-stretch text-center text-neutral-700 text-base leading-relaxed">
                    상품 리스트를 둘러보고
                    <br />
                    상품을 담아보세요
                  </p>
                </div>
                <button
                  className="self-stretch h-16 px-4 py-3 bg-neutral-800 rounded-sm inline-flex justify-center items-center cursor-pointer"
                  onClick={() => router.push("/products")}
                  onKeyDown={handleKeyDown}
                  aria-label="상품 리스트 페이지로 이동"
                >
                  <span className="text-white text-base font-bold">상품 리스트로 이동</span>
                </button>
              </div>
            </div>
          </section>
        )}
      </div>

      {/* Toast */}
      {toastVisible && (
        <Toast
          text={toastMessage}
          variant={toastVariant}
          isVisible={toastVisible}
          aria-live="polite"
          aria-atomic="true"
        />
      )}
    </section>
  );
}
