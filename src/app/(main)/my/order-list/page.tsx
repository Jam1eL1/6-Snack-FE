"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

import Dropdown from "@/components/common/DropDown";
import Pagination from "@/components/common/Pagination";
import MyRequestList from "@/components/common/MyRequestList";
import { fetchMyOrders } from "@/lib/api/myOrderList.api";
import { TOrderItem } from "@/types/myOrderList.types";
import { formatDate } from "@/lib/utils/formatDate.util";
import { convertStatus } from "@/lib/utils/convertStatus.util";
import { useCancelOrder } from "@/hooks/useCancelOrder";
import Toast from "@/components/common/Toast";
import DogSpinner from "@/components/common/DogSpinner";
import icNoOrder from "@/assets/icons/ic_no_order.svg";

const PAGE_SIZE = 5;

export default function MyOrderListPage() {
  const [requests, setRequests] = useState<TOrderItem[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOption, setSortOption] = useState("Newest");
  const [toastVisible, setToastVisible] = useState(false);

  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const router = useRouter();

  const cancelOrder = useCancelOrder((orderId: number) => {
    setRequests((prev) => prev.filter((item) => item.id !== orderId));
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 3000);
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const data = await fetchMyOrders();
        const filtered = data.filter((item) => item.status !== "CANCELED");
        setRequests(filtered);
      } catch (error) {
        console.error(error);
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  const handleCancel = (orderId: number) => {
    cancelOrder.mutate(orderId);
  };

  const sorted = (() => {
    const copy = [...requests];
    switch (sortOption) {
      case "낮은 가격순":
        return copy.sort((a, b) => a.productsPriceTotal - b.productsPriceTotal);
      case "높은 가격순":
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

  const paginated = sorted.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  useEffect(() => {
    if (!isLoading && !isError && requests.length > 0 && paginated.length === 0 && currentPage > 1) {
      setCurrentPage((p) => p - 1);
    }
  }, [requests.length, paginated.length, isLoading, isError, currentPage]);

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
                Request the products you want.
              </p>
            </div>
            <button
              className="self-stretch h-16 px-4 py-3 bg-neutral-800 rounded-sm inline-flex justify-center items-center cursor-pointer"
              onClick={() => router.push("/products")}
              aria-label="Go to product list page"
            >
              <span className="text-white text-base font-bold">Go to Product List</span>
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <main className="flex flex-col items-center md:px-0 pt-10 pb-40 min-h-[calc(100vh-112px)]">
      <div className="w-full max-w-[1400px] py-4 flex justify-between items-center">
        <h1 className="text-lg font-bold text-primary-950">Purchase Request History</h1>
        <Dropdown onChange={setSortOption} options={["Newest", "Lowest Price", "Highest Price"]} />
      </div>

      <div className="w-full max-w-[1400px] flex-1">
        <div className="hidden sm:grid grid-cols-[1fr_1.5fr_1fr_1fr_1fr] w-full py-5 border-b border-t border-primary-100 justify-start items-center md:gap-10 lg:gap-20 text-primary-500 text-sm md:text-base">
          <div className="min-w-[90px]">Request Date</div>
          <div className="min-w-[140px]">Product Info</div>
          <div className="min-w-[90px]">Order Amount</div>
          <div className="min-w-[90px]">Status</div>
          <div className="min-w-[78px]">Remarks</div>
        </div>

        <div style={{ minHeight: `${6 * 88}px` }} className="flex flex-col">
          {paginated.map((item) => (
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

      {toastVisible && <Toast text="Your request has been canceled." variant="success" isVisible={toastVisible} />}
    </main>
  );
}
