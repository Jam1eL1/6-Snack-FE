import { useState, useEffect, useCallback } from "react";
import { useBudgets } from "@/hooks/useBudgets";
import { useAdminOrders } from "@/hooks/useAdminOrders";
import { formatDate } from "@/lib/utils/formatDate.util";
import { formatCurrency } from "@/lib/utils/currency.util";

export type TPurchaseItem = {
  id: string;
  requestDate: string;
  requester: string;
  status?: "PENDING" | "APPROVED" | "REJECTED" | "CANCELED" | "INSTANT_APPROVED";
  item: string;
  amount: string;
  approvalDate: string;
  manager: string;
  adminMessage?: string;
  totalQuantity?: number;
  productName?: string;
};

export const useOrderHistory = (sortByDefault: string = "latest", itemsPerPage: number = 4) => {
  const [sortBy, setSortBy] = useState<string>(sortByDefault);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Fetch budget data.
  const { data: budgetData, isLoading: budgetLoading, isError: budgetIsError, error: budgetErrorObj } = useBudgets();
  const budgetError = budgetIsError ? (budgetErrorObj as Error)?.message || "예산 데이터를 불러오지 못했습니다." : null;

  // Fetch approved purchase history and cache the full dataset client-side.
  const {
    data: approvedData,
    isLoading: approvedLoading,
    isError: approvedIsError,
    error: approvedErrorObj,
  } = useAdminOrders({ status: "approved" }); // offset, limit, and orderBy are handled outside this hook.

  const purchaseListLoading = approvedLoading;
  const purchaseListError = approvedIsError ? (approvedErrorObj as Error)?.message : null;

  type TOrderStatus = "PENDING" | "APPROVED" | "REJECTED" | "CANCELED" | "INSTANT_APPROVED";

  type TOrderItem = {
    id: number | string;
    requestDate?: string;
    createdAt?: string;
    requesterName?: string;
    requester?: string;
    status?: TOrderStatus;
    productName?: string;
    itemSummary?: string;
    item?: string;
    deliveryFee?: number;
    productsPriceTotal?: number;
    amount?: number;
    approvalDate?: string;
    updatedAt?: string;
    approver?: string;
    managerName?: string;
    manager?: string;
    adminMessage?: string;
    products?: Array<{ quantity: number }>;
  };

  const parse = (item: TOrderItem): TPurchaseItem => ({
    id: String(item.id),
    requestDate: item.requestDate ? formatDate(item.requestDate) : item.createdAt ? formatDate(item.createdAt) : "-",
    requester: item.requesterName || item.requester || "-",
    status: item.status,
    item: item.productName || item.itemSummary || item.item || "-",
    amount:
      typeof item.productsPriceTotal === "number" && typeof item.deliveryFee === "number"
        ? formatCurrency(item.productsPriceTotal + item.deliveryFee)
        : "-",
    approvalDate: item.approvalDate ? formatDate(item.approvalDate) : item.updatedAt ? formatDate(item.updatedAt) : "-",
    manager: item.approver || item.managerName || item.manager || "-",
    adminMessage: item.adminMessage,
    totalQuantity: item.products?.reduce((sum, product) => sum + product.quantity, 0) || 0,
    productName: item.productName,
  });

  // Parse all items into the UI-facing shape.
  const allPurchaseItems: TPurchaseItem[] = ((approvedData as { orders?: TOrderItem[] })?.orders || []).map(
    (item: TOrderItem) => parse(item),
  );

  // Handle sorting on the client.
  const sortedItems = useCallback(() => {
    const items = [...allPurchaseItems];

    switch (sortBy) {
      case "latest":
        return items.sort((a, b) => {
          const dateA = new Date(a.approvalDate).getTime();
          const dateB = new Date(b.approvalDate).getTime();
          return dateB - dateA; // Latest first, based on approval date.
        });
      case "priceLow":
        return items.sort((a, b) => {
          const priceA = parseFloat(a.amount.replace(/[^0-9]/g, "")) || 0;
          const priceB = parseFloat(b.amount.replace(/[^0-9]/g, "")) || 0;
          return priceA - priceB; // Lowest price first.
        });
      case "priceHigh":
        return items.sort((a, b) => {
          const priceA = parseFloat(a.amount.replace(/[^0-9]/g, "")) || 0;
          const priceB = parseFloat(b.amount.replace(/[^0-9]/g, "")) || 0;
          return priceB - priceA; // Highest price first.
        });
      default:
        return items;
    }
  }, [allPurchaseItems, sortBy]);

  const sortedPurchaseItems = sortedItems();

  // Handle pagination on the client.
  const totalCount = sortedPurchaseItems.length;
  const totalPages = Math.ceil(totalCount / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems: TPurchaseItem[] = sortedPurchaseItems.slice(startIndex, startIndex + itemsPerPage);

  // Reset to page 1 whenever the sort order changes.
  useEffect(() => {
    setCurrentPage(1);
  }, [sortBy]);

  const handlePageChange = useCallback(
    (page: number) => {
      if (page > 0 && page <= totalPages) {
        setCurrentPage(page);
      }
    },
    [totalPages],
  );

  // Close the dropdown when clicking outside of it.
  useEffect(() => {
    if (!dropdownOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest(".custom-sort-dropdown")) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownOpen]);

  // Currency formatting helper
  const formatNumber = (num: number | undefined) => (typeof num === "number" ? formatCurrency(num) : "-");

  return {
    // Budget state
    budgetData,
    budgetLoading,
    budgetError,
    // Purchase history state
    purchaseListLoading,
    purchaseListError,
    currentItems,
    totalPages,
    currentPage,
    handlePageChange,
    // Sorting state
    sortBy,
    setSortBy,
    dropdownOpen,
    setDropdownOpen,
    // Helpers
    formatNumber,
  };
};
