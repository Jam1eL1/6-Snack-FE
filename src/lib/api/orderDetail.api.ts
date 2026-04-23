import { cookieFetch } from "./fetchClient.api";

export type TAdminOrderDetail = {
  id: string;
  companyId: number;
  userId: string;
  approver: string | null;
  adminMessage: string | null;
  requestMessage: string | null;
  deliveryFee: number;
  productsPriceTotal: number;
  createdAt: string;
  updatedAt: string;
  status: string;
  requester: string;
  products: {
    id: number;
    productId: number;
    orderId: string;
    productName: string;
    price: number;
    imageUrl: string;
    quantity: number;
    createdAt: string;
  }[];
  budget: {
    currentMonthBudget: number | null;
    currentMonthExpense: number | null;
  };
};

// get order detail for admin
export const getOrderDetail = (
  orderId: string,
  status: "pending" | "approved" = "pending",
): Promise<TAdminOrderDetail> => {
  return cookieFetch<TAdminOrderDetail>(`/admin/orders/${orderId}?status=${status}`);
};
