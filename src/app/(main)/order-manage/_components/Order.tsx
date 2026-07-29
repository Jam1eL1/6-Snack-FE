"use client";
import Dropdown from "@/components/common/DropDown";
import OrderManageModal from "@/components/common/OrderManageModal";
import Pagination from "@/components/common/Pagination";
import RequestList from "@/components/common/RequestList";
import DogSpinner from "@/components/common/DogSpinner";
import { useOrderVisibleCount } from "@/hooks/useOrderVisibleCount";
import { getPendingOrderDetail } from "@/lib/api/orderManage.api";
import { useModal } from "@/providers/ModalProvider";
import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { usePendingOrders } from "@/hooks/usePendingOrders";
import { useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/queryKeys";
import icNoOrder from "@/assets/icons/ic_no_order.svg";
import { useAuth } from "@/providers/AuthProvider";
import { useRouter } from "next/navigation";
import { TOrderSort } from "@/types/order.types";
import { useOrderStatusUpdate } from "@/hooks/useOrderStatusUpdate";

const ORDER_BY_MAP: Record<string, TOrderSort> = {
  Newest: "latest",
  "Lowest Price": "priceLow",
  "Highest Price": "priceHigh",
};

export default function Order() {
  const [currentPaginationPage, setCurrentPaginationPage] = useState<number>(1);
  const { openModal } = useModal();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const router = useRouter();

  const [orderBy, setOrderBy] = useState<TOrderSort>(ORDER_BY_MAP.Newest);

  const { visibleCount } = useOrderVisibleCount();

  const prevVisibleCountRef = useRef(visibleCount);

  // Order status update mutation
  const { mutate: updateOrderStatusMutation } = useOrderStatusUpdate();

  // Invalidate related queries when the user context changes.
  useEffect(() => {
    if (user?.company?.id) {
      queryClient.invalidateQueries({ queryKey: queryKeys.pendingOrders.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.budgets.all });
    }
  }, [user?.company?.id, queryClient]);

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
      <section className="relative w-full" role="region" aria-label="Order management">
        <div className="text-center py-12 text-red-600" role="alert" aria-live="polite">
          Failed to load order data.
        </div>
      </section>
    );
  }

  return (
    <section className="relative w-full" role="region" aria-label="Order management">
      <header className="flex w-full items-center justify-between gap-3 pt-[10px] pb-[20px] md:pt-0 md:pb-[40px]">
        <h1 className="text-[18px]/[22px] font-bold text-primary-950">Manage Requests</h1>
        <div role="group" aria-label="Sort options">
          <Dropdown
            onChange={(selected) => setOrderBy(ORDER_BY_MAP[selected] ?? ORDER_BY_MAP.Newest)}
            options={["Newest", "Lowest Price", "Highest Price"]}
            aria-label="Sort order list"
          />
        </div>
      </header>

      <div className="flex flex-col" role="main" aria-live="polite" aria-busy={isLoading}>
        {isLoading ? (
          <div className="flex justify-center items-center py-12" role="status" aria-label="Loading">
            <DogSpinner />
            <span className="sr-only">Loading order list.</span>
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
                    onUpdateOrderStatus={updateOrderStatusMutation}
                  />,
                );
              }}
              onClickApprove={async (orderSummary) => {
                const fullOrder = await getPendingOrderDetail(orderSummary.id);
                openModal(
                  <OrderManageModal
                    order={fullOrder}
                    type="approve"
                    onUpdateOrderStatus={updateOrderStatusMutation}
                  />,
                );
              }}
            />
            <nav className="mt-[20px] sm:mt-10" role="navigation" aria-label="Page navigation">
              <Pagination
                className="mt-[20px] sm:mt-10"
                currentPage={currentPaginationPage}
                totalPages={totalPages}
                onPageChange={setCurrentPaginationPage}
              />
            </nav>
          </>
        ) : (
          <section className="flex flex-1 justify-center min-h-screen" role="status" aria-label="Empty state">
            <div className="sm:w-80 inline-flex flex-col justify-start items-center gap-7 py-12 mt-[142px] sm:mt-[222px] md:mt-[191px]">
              <div className="w-24 h-24 relative" role="img" aria-label="No orders icon">
                <Image src={icNoOrder} alt="No orders" fill className="object-contain" />
              </div>
              <div className="self-stretch flex flex-col justify-start items-center gap-12">
                <div className="w-72 flex flex-col justify-start items-center gap-2.5">
                  <h2 className="self-stretch text-center text-neutral-800 text-2xl font-extrabold">No requests yet</h2>
                  <p className="self-stretch text-center text-neutral-700 text-base leading-relaxed">
                    Browse the product list
                    <br />
                    and add items to your cart.
                  </p>
                </div>
                <button
                  className="self-stretch h-16 px-4 py-3 bg-neutral-800 rounded-sm inline-flex justify-center items-center cursor-pointer"
                  onClick={() => router.push("/products")}
                  onKeyDown={handleKeyDown}
                  aria-label="Go to product list"
                >
                  <span className="text-white text-base font-bold">Go to Products</span>
                </button>
              </div>
            </div>
          </section>
        )}
      </div>
    </section>
  );
}
