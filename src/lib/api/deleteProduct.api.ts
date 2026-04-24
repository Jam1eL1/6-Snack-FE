import { cookieFetch } from "./fetchClient.api";

// Delete product as a regular user
export const deleteProduct = async (productId: number): Promise<void> => {
  return cookieFetch<void>(`/products/${productId}`, {
    method: "DELETE",
  });
};

// Delete product as an admin
export const deleteProductAsAdmin = async (productId: number): Promise<void> => {
  return cookieFetch<void>(`/admin/products/${productId}`, {
    method: "DELETE",
  });
};
