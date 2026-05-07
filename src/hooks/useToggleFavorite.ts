import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createFavorite, deleteFavorite } from "@/lib/api/favorite.api";

export const useToggleFavorite = (
  productId: number,
  {
    onMutate,
    onError,
  }: {
    onMutate?: () => void;
    onError?: () => void;
  } = {},
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (isFavoriteNow: boolean) =>
      isFavoriteNow ? deleteFavorite(productId.toString()) : createFavorite(productId.toString()),
    onMutate: async (isFavoriteNow) => {
      onMutate?.();

      await queryClient.cancelQueries({ queryKey: ["productDetail", productId] });

      const prev = queryClient.getQueryData(["productDetail", productId]);
      queryClient.setQueryData<{ isFavorite: boolean }>(["productDetail", productId], (old) => {
        if (!old) return old;
        return { ...old, isFavorite: !isFavoriteNow };
      });

      return { prev };
    },
    onError: (_err, _variables, context) => {
      onError?.();
      if (context?.prev) {
        queryClient.setQueryData(["productDetail", productId], context.prev);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["productDetail", productId] });
      queryClient.invalidateQueries({ queryKey: ["favorites"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
};
