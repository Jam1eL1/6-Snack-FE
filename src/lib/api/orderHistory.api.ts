import { cookieFetch } from "./fetchClient.api";

/**
 * @xdnjs7
 * 1. The order detail lookup appears to overlap with the implementation in orderDetail.api.ts, so merge after alignment.
 */

// Purchase history type definitions (matched to the actual backend response)
export type TProduct = {
  id: number;
  productId: number;
  orderId: string;
  productName: string;
  price: number;
  imageUrl: string;
  quantity: number;
  createdAt: string;
};

// Type for fetching my order request details (actual API response shape)
export type TReceipt = {
  id: number;
  productId: number;
  orderId: number;
  productName: string;
  price: number;
  imageUrl: string;
  quantity: number;
  createdAt: string;
};

export type TOrderedItem = {
  id: number;
  orderId: number;
  receiptId: number;
  productId: number;
  receipt: TReceipt;
};

export type TOrderUser = {
  id: string;
  email: string;
  name: string;
  password: string;
  companyId: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  hashedRefreshToken: string;
  role: string;
};

export type TMyOrderDetail = {
  id: number;
  companyId: number;
  userId: string;
  approver: string | null;
  adminMessage: string | null;
  requestMessage: string | null;
  // totalPrice: number; // deprecated, replaced by productsPriceTotal
  productsPriceTotal: number;
  deliveryFee: number;
  createdAt: string;
  updatedAt: string;
  status: "PENDING" | "APPROVED" | "REJECTED" | "CANCELED";
  user: TOrderUser;
  receipts: TReceipt[];
};

export type TMyOrderDetailResponse = {
  message: string;
  data: TMyOrderDetail;
};

export type TBudget = {
  currentMonthBudget: number | null;
  currentMonthExpense: number | null;
};

export type TOrderHistory = {
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
  products: TProduct[];
  budget: TBudget;
};

export type TOrderHistoryResponse = {
  message: string;
  data: TOrderHistory;
};

// Fetch order details for admin
export const getOrderDetail = async (
  orderId: string,
  status?: "pending" | "approved" | "rejected" | "canceled",
): Promise<TOrderHistory> => {
  try {
    const queryParams = new URLSearchParams();
    if (status) queryParams.append("status", status);

    const queryString = queryParams.toString();
    const url = queryString ? `/admin/orders/${orderId}?${queryString}` : `/admin/orders/${orderId}`;

    const response = await cookieFetch<TOrderHistory>(url);
    return response;
  } catch (error) {
    throw error;
  }
};

// Fetch my order request details
export const getMyOrderDetail = async (orderId: string): Promise<TMyOrderDetail> => {
  try {
    const response = await cookieFetch<TMyOrderDetailResponse>(`/orders/${orderId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Cancel Order Request
export const cancelOrder = async (orderId: string): Promise<void> => {
  try {
    await cookieFetch<void>(`/orders/${orderId}`, {
      method: "PATCH",
      body: JSON.stringify({
        status: "CANCELED",
      }),
    });
  } catch (error) {
    throw error;
  }
};
