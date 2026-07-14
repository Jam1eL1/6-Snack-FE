export type TOrderSort = "latest" | "priceLow" | "priceHigh";

export type TOrdersMeta = {
  totalCount: number;
  itemsPerPage: number;
  currentPage: number;
  totalPages: number;
};

export type TAdminOrdersData = {
  orders: TOrderSummary[];
  meta: TOrdersMeta;
};

export type TOrderBase = {
  id: string;
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
};

export type TOrderSummary = TOrderBase & {
  productName: string;
};

export type TAdminOrderDetailResponse = {
  message: string;
  data: TAdminOrderDetail;
};

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
export type TOrderRequestBody = {
  requestMessage?: string;
  cartItemIds: number[];
};

export type TOrderNowBody = {
  cartItemIds: number[];
};

export type TOrderNowResponse = {
  message: string;
  data: TUpdateOrderStatusData;
};

export type TAdminOrdersResponse = {
  message: string;
  data: TAdminOrdersData;
};

export type TUpdateOrderStatusRequest = {
  orderId: string;
  status: "APPROVED" | "REJECTED";
  adminMessage?: string;
};

export type TUpdateOrderStatusData = {
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
  status: "PENDING" | "APPROVED" | "REJECTED" | "CANCELED" | "INSTANT_APPROVED";
};

export type TUpdateOrderStatusResponse = {
  message: string;
  data: TUpdateOrderStatusData;
};

export type TCreateOrderData = TAdminOrderDetail;

export type TCreateOrderResponse = {
  message: string;
  data: TCreateOrderData;
};

export type TCheckoutOrder = Pick<TCreateOrderData, "id" | "productsPriceTotal" | "deliveryFee" | "products">;
