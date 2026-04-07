import { cookieFetch } from "./fetchClient.api";

/**
 * @xdnjs7
 * 1. orderDetail.api.ts에서 주문 조회가 지수님이 만드신 코드와 중복으로 보여서 합의 후 통합 진행하기
 */

// Purchase History Type Definitions (실제 백엔드 응답에 맞춤)
export type TProduct = {
  id: number;
  productName: string;
  price: number;
  imageUrl?: string;
  quantity: number;
};

// 내 구매 요청 상세 조회용 타입 (실제 API 응답 구조)
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
  // totalPrice: number; // deprecated, productsPriceTotal로 대체
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
  id: number;
  userId: string;
  status: "PENDING" | "APPROVED" | "REJECTED" | "CANCELED";
  totalPrice: number;
  adminMessage?: string;
  requestMessage?: string;
  createdAt: string;
  updatedAt: string;
  approver?: string;
  requester?: string;
  products: TProduct[];
  budget: TBudget;
};

export type TOrderHistoryResponse = {
  message: string;
  data: TOrderHistory;
};

// 관리자 - 주문 상세 조회
export const getOrderDetail = async (
  orderId: string,
  status?: "pending" | "approved" | "rejected" | "canceled",
): Promise<TOrderHistory> => {
  try {
    const queryParams = new URLSearchParams();
    if (status) queryParams.append("status", status);

    const queryString = queryParams.toString();
    const url = queryString ? `/admin/orders/${orderId}?${queryString}` : `/admin/orders/${orderId}`;

    // 백엔드에서 직접 TOrderHistory 객체를 반환하므로 data 필드 접근 제거
    const response = await cookieFetch<TOrderHistory>(url);
    return response;
  } catch (error) {
    throw error;
  }
};

// 내 구매 요청 상세 조회
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
