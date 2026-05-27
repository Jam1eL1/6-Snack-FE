import { useQuery } from "@tanstack/react-query";
import { getOrderDetail, TAdminOrderDetail } from "@/lib/api/orderDetail.api";
import { getMyOrderDetail, TMyOrderDetail } from "@/lib/api/orderHistory.api";
import { queryKeys } from "@/lib/queryKeys";

// Custom hook for fetching order details (admin)
export const useOrderDetail = (orderId: string, status: "pending" | "approved" = "pending") => {
  return useQuery<TAdminOrderDetail>({
    queryKey: queryKeys.adminOrders.detail(orderId, status),
    queryFn: () => getOrderDetail(orderId, status),
    enabled: !!orderId, // Only run the query when orderId is available
    staleTime: 5 * 60 * 1000, // Keep the data fresh for 5 minutes
    gcTime: 10 * 60 * 1000, // Keep the cache for 10 minutes
  });
};

// Custom hook for fetching my order details (user)
export const useMyOrderDetail = (orderId: string) => {
  return useQuery<TMyOrderDetail>({
    queryKey: queryKeys.myOrders.detail(orderId),
    queryFn: () => getMyOrderDetail(orderId),
    enabled: !!orderId, // Only run the query when orderId is available
    staleTime: 5 * 60 * 1000, // Keep the data fresh for 5 minutes
    gcTime: 10 * 60 * 1000, // Keep the cache for 10 minutes
  });
};
