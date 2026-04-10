import { cookieFetch } from "./fetchClient.api";

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
