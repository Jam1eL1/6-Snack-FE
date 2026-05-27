import { getMyOrders } from "@/lib/api/orderHistory.api";
import { queryKeys } from "@/lib/queryKeys";
import { useQuery } from "@tanstack/react-query";

export const useMyOrders = () => {
  return useQuery({
    queryKey: queryKeys.myOrders.all,
    queryFn: async () => {
      const data = await getMyOrders();
      return data.filter((item) => item.status !== "CANCELED");
    },
  });
};
