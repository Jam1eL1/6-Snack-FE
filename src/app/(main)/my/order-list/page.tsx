"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

import Dropdown from "@/components/common/DropDown";
import Pagination from "@/components/common/Pagination";
import MyRequestList from "@/components/common/MyRequestList";
import { TOrderItem } from "@/types/myOrderList.types";
import { formatDate } from "@/lib/utils/formatDate.util";
import { convertStatus } from "@/lib/utils/convertStatus.util";
import { useCancelOrder } from "@/hooks/useCancelOrder";
import Toast from "@/components/common/Toast";
import DogSpinner from "@/components/common/DogSpinner";
import icNoOrder from "@/assets/icons/ic_no_order.svg";
import { SessionExpiredError } from "@/lib/api/auth.errors";
import { useMyOrders } from "@/hooks/useMyOrders";

const PAGE_SIZE = 5;

export default function MyOrderListPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOption, setSortOption] = useState("Newest");
  const [toast, setToast] = useState({
    isVisible: false,
    text: "",
    variant: "success" as "success" | "error",
  });
  const showToast = (text: string, variant: "success" | "error" = "success") => {
    setToast({ isVisible: true, text, variant });
    setTimeout(() => setToast((prev) => ({ ...prev, isVisible: false })), 3000);
  };

  const router = useRouter();

  const cancelOrderMutation = useCancelOrder({
    onCancelSuccess: () => {
      showToast("Your request has been canceled.", "success");
    },
    onCancelError: (error) => {
      if (error instanceof SessionExpiredError) return;

      showToast("Failed to cancel request.", "error");
    },
  });

  const { data: requests = [], isLoading, isError } = useMyOrders();
  const handleCancel = (orderId: string) => {
    cancelOrderMutation.mutate(orderId);
  };

  const sortedRequests = (() => {
    const copy = [...requests];
    switch (sortOption) {
      case "Lowest Price":
        return copy.sort((a, b) => a.productsPriceTotal - b.productsPriceTotal);
      case "Highest Price":
        return copy.sort((a, b) => b.productsPriceTotal - a.productsPriceTotal);
      default:
        return copy.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }
  })();

  const getProductName = (receipts: TOrderItem["receipts"]) => {
    if (!receipts.length) return "No products";
    if (receipts.length === 1) return receipts[0].productName;
    return `${receipts[0].productName} and ${receipts.length - 1} more`;
  };

  const paginatedRequests = sortedRequests.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  useEffect(() => {
    if (!isLoading && !isError && requests.length > 0 && paginatedRequests.length === 0 && currentPage > 1) {
      setCurrentPage((p) => p - 1);
    }
  }, [requests.length, paginatedRequests.length, isLoading, isError, currentPage]);

  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center h-screen">
        <DogSpinner />
      </div>
    );
  }

  if (isError || requests.length === 0) {
    return (
      <section className="flex flex-1 justify-center min-h-screen" role="status" aria-label="Empty state">
        <div className="sm:w-80 inline-flex flex-col justify-start items-center gap-7 py-12 mt-[142px] sm:mt-[222px] md:mt-[191px]">
          <div className="w-24 h-24 relative" role="img" aria-label="No order history icon">
            <Image src={icNoOrder} alt="No order history" fill className="object-contain" />
          </div>
          <div className="self-stretch flex flex-col justify-start items-center gap-12">
            <div className="w-72 flex flex-col justify-start items-center gap-2.5">
              <h2 className="self-stretch text-center text-neutral-800 text-2xl font-extrabold">
                No purchase requests yet
              </h2>
              <p className="self-stretch text-center text-neutral-700 text-base leading-relaxed">
                Submit a request for the products you want.
              </p>
            </div>
            <button
              className="self-stretch h-16 px-4 py-3 bg-neutral-800 rounded-sm inline-flex justify-center items-center cursor-pointer"
              onClick={() => router.push("/products")}
              aria-label="Go to product list page"
            >
              <span className="text-white text-base font-bold">Browse Products</span>
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <main className="flex flex-col items-center md:px-0 pt-10 pb-40 min-h-[calc(100vh-112px)]">
      <div className="w-full max-w-[1400px] py-4 flex justify-between items-center">
        <h1 className="text-[18px]/[22px] font-bold text-primary-950">My Requests</h1>
        <Dropdown onChange={setSortOption} options={["Newest", "Lowest Price", "Highest Price"]} />
      </div>

      <div className="w-full max-w-[1400px] flex-1">
        <div className="hidden sm:grid grid-cols-[1fr_1.5fr_1fr_1fr_1fr] w-full py-5 border-b border-t border-primary-100 justify-start items-center md:gap-10 lg:gap-20 text-primary-500 text-sm md:text-base">
          <div className="min-w-[90px]">Date Requested</div>
          <div className="min-w-[140px]">Product</div>
          <div className="min-w-[90px]">Order Amount</div>
          <div className="min-w-[90px]">Status</div>
          <div className="min-w-[78px]">Action</div>
        </div>

        <div style={{ minHeight: `${6 * 88}px` }} className="flex flex-col">
          {paginatedRequests.map((item) => (
            <MyRequestList
              key={item.id}
              requestDate={formatDate(item.createdAt)}
              productName={getProductName(item.receipts)}
              price={(item.productsPriceTotal ?? 0) + (item.deliveryFee ?? 0)}
              status={convertStatus(item.status)}
              orderId={item.id}
              onRequestCancel={() => handleCancel(item.id)}
            />
          ))}
        </div>

        <Pagination
          currentPage={currentPage}
          totalPages={Math.ceil(requests.length / PAGE_SIZE)}
          onPageChange={setCurrentPage}
        />
      </div>

      {toast.isVisible && <Toast text={toast.text} variant={toast.variant} isVisible={toast.isVisible} />}
    </main>
  );
}
