import { getMyOrders } from "@/lib/api/orderHistory.api";
import { useQuery } from "@tanstack/react-query";

export const MY_ORDERS_QUERY_KEY = ["my-orders"] as const;

export const useMyOrders = () => {
  return useQuery({
    queryKey: MY_ORDERS_QUERY_KEY,
    queryFn: async () => {
      const data = await getMyOrders();
      return data.filter((item) => item.status !== "CANCELED");
    },
  });
};
