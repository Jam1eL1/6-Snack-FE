import { createFavorite, deleteFavorite } from "@/lib/api/favorite.api";
import { queryKeys } from "@/lib/queryKeys";
import { useMutation, useQueryClient } from "@tanstack/react-query";

// 4, TContext -> this is what onMutate returns, onError receives
type TToggleFavoriteContext = {
  previousProductDetail: unknown;
};

type TUseToggleFavoriteOptions = {
  onOptimisticToggle?: () => void;
  onRollbackToggle?: () => void;
  onToggleFavoriteError?: (error: Error) => void;
};

export const useToggleFavorite = (
  productId: number,
  { onOptimisticToggle, onRollbackToggle, onToggleFavoriteError }: TUseToggleFavoriteOptions = {},
) => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, boolean, TToggleFavoriteContext>({
    mutationFn: (isFavoriteNow) =>
      isFavoriteNow ? deleteFavorite(productId.toString()) : createFavorite(productId.toString()).then(() => undefined),

    onMutate: async (isFavoriteNow) => {
      onOptimisticToggle?.(); // UI part in parent component
      // cancel in-flight refetch to prevent overwriting optimistic cache value
      await queryClient.cancelQueries({ queryKey: queryKeys.products.detail(productId) });
      // take a snapshot of prev cache before update
      const previousProductDetail = queryClient.getQueryData(queryKeys.products.detail(productId));
      // flip query data before actual API call in mutationFn
      queryClient.setQueryData<{ isFavorite: boolean }>(queryKeys.products.detail(productId), (old) => {
        // if current cached data is not present, return early (undefined)
        // to prevent creating a ghost data from the below return block
        if (!old) return old;
        return {
          ...old,
          isFavorite: !isFavoriteNow,
        };
      });
      return { previousProductDetail };
    },

    onError: (error, _variables, context) => {
      onRollbackToggle?.();
      if (context?.previousProductDetail) {
        queryClient.setQueryData(queryKeys.products.detail(productId), context.previousProductDetail);
      }
      onToggleFavoriteError?.(error);
    },

    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.products.detail(productId),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.favorites.all,
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.products.all,
      });
    },
  });
};
