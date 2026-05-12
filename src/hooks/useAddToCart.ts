import { addToCart } from "@/lib/api/cart.api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

type TAddToCartVariables = {
  productId: number;
  quantity: number;
};
type TUseAddToCartOptions = {
  onAddToCartSuccess?: () => void;
  onAddToCartError?: (error: Error) => void;
};

export const useAddToCart = ({ onAddToCartSuccess, onAddToCartError }: TUseAddToCartOptions = {}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ productId, quantity }: TAddToCartVariables) => addToCart(productId, quantity),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cartItems"] });
      onAddToCartSuccess?.();
    },
    onError: (error) => {
      onAddToCartError?.(error);
    },
  });
};
