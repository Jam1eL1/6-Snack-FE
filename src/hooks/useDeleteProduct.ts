import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteProduct, deleteProductAsAdmin } from "@/lib/api/deleteProduct.api";
import { useAuth } from "@/providers/AuthProvider";

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: (productId: number) => {
      if (!user) throw new Error("로그인이 필요합니다.");

      const isAdmin = user.role === "ADMIN" || user.role === "SUPER_ADMIN";
      return isAdmin ? deleteProductAsAdmin(productId) : deleteProduct(productId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["favorites"] });
      queryClient.invalidateQueries({ queryKey: ["cartItems"] });
    },
  });
};
