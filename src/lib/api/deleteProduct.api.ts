import { cookieFetch } from "./fetchClient.api";

// 일반 유저 삭제
export const deleteProduct = async (productId: number): Promise<void> => {
  return cookieFetch(`/products/${productId}`, {
    method: "DELETE",
  });
};

// 관리자 삭제
export const deleteProductAsAdmin = async (productId: number): Promise<void> => {
  return cookieFetch(`/admin/products/${productId}`, {
    method: "DELETE",
  });
};
