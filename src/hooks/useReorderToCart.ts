import { addToCart } from "@/lib/api/cart.api";
import { TMyOrderDetail } from "@/lib/api/orderHistory.api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useReorderToCart = ({
  onReorderToCartSuccess,
  onReorderToCartError,
}: {
  onReorderToCartSuccess?: () => void;
  onReorderToCartError?: (error: Error) => void;
} = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (orderData: TMyOrderDetail) => {
      for (const item of orderData.receipts) {
        await addToCart(item.productId, item.quantity);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cartItems"] });
      onReorderToCartSuccess?.();
    },
    onError: (error) => {
      onReorderToCartError?.(error);
    },
  });
};
