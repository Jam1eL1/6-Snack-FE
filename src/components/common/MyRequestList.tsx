"use client";

import React from "react";
import Badge from "@/components/ui/Badge";
import { formatCurrency } from "@/lib/utils/currency.util";
import ConfirmationModal from "@/components/common/ConfirmationModal";
import { useModal } from "@/providers/ModalProvider";
import Link from "next/link";

type TRequestListItemProps = {
  requestDate: string;
  productName: string;
  price: number;
  status: "Pending" | "Request Approved" | "Request Rejected" | "Request Canceled";
  orderId: string;
  onRequestCancel?: () => void;
};

export default function RequestListItem({
  requestDate,
  productName,
  price,
  status,
  orderId,
  onRequestCancel,
}: TRequestListItemProps) {
  const { openModal, closeModal } = useModal();

  const getBadgeType = (): "pending" | "approved" | "rejected" => {
    switch (status) {
      case "Pending":
        return "pending";
      case "Request Approved":
        return "approved";
      case "Request Rejected":
        return "rejected";
      default:
        return "pending";
    }
  };

  const showCancelButton = status === "Pending" && onRequestCancel;

  const handleCancelClick = () => {
    openModal(
      <ConfirmationModal
        isOpen={true}
        onCancel={closeModal}
        onDelete={() => {
          closeModal();
          onRequestCancel?.();
        }}
        productName={productName}
        modalTitle="Do you want to cancel the request?"
        modalDescription="Once canceled, this purchase request cannot be restored."
        confirmButtonText="Cancel Request"
        cancelButtonText="Keep Request"
      />,
    );
  };

  return (
    <div className="w-full border-b border-primary-100">
      {/* Mobile */}
      <div className="flex flex-col gap-5 py-7 sm:hidden">
        <div className="flex justify-between items-center w-full">
          <div className="text-sm font-bold text-primary-950">{requestDate}</div>
          <div className="flex shrink-0 justify-end">
            <Badge type={getBadgeType()} />
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <Link href={`/my/order-list/${orderId}`} className="text-blue-600">
            {productName}
          </Link>
          <div className="text-sm text-primary-950">{formatCurrency(price)}</div>
        </div>

        {showCancelButton && (
          <button
            onClick={handleCancelClick}
            className="w-full px-5 py-3 text-xs text-primary-900 bg-white outline outline-primary-300 hover:bg-primary-100 transition-colors duration-200 cursor-pointer"
          >
            Cancel Request
          </button>
        )}
      </div>

      {/* Tablet & Desktop */}
      <div className="hidden sm:grid grid-cols-[1fr_1.5fr_1fr_1fr_1fr] items-center w-full h-24 md:gap-10 lg:gap-20 border-b border-primary-100">
        <div className="min-w-[90px] text-sm md:text-base text-primary-950">{requestDate}</div>
        <Link href={`/my/order-list/${orderId}`} className="text-blue-600">
          {productName}
        </Link>
        <div className="min-w-[90px] text-sm md:text-base text-primary-950">{formatCurrency(price)}</div>
        <div className="flex justify-start">
          <Badge type={getBadgeType()} />
        </div>

        {showCancelButton ? (
          <div className="flex">
            <button
              onClick={handleCancelClick}
              className="px-4 py-2 md:px-5 md:py-3 bg-white outline outline-primary-300 text-primary-900 text-sm md:text-base hover:bg-primary-100 transition-colors duration-200 cursor-pointer"
            >
              Cancel Request
            </button>
          </div>
        ) : (
          <div />
        )}
      </div>
    </div>
  );
}
