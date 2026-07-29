import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteProduct, deleteProductAsAdmin } from "@/lib/api/product.api";
import { queryKeys } from "@/lib/queryKeys";
import { useAuth } from "@/providers/AuthProvider";

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: (productId: number) => {
      if (!user) throw new Error("You must be signed in.");

      const isAdmin = user.role === "ADMIN" || user.role === "SUPER_ADMIN";
      return isAdmin ? deleteProductAsAdmin(productId) : deleteProduct(productId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.products.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.favorites.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.cartItems.all });
    },
  });
};
