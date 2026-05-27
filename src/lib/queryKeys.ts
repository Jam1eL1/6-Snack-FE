export const queryKeys = {
  cartItems: {
    all: ["cartItems"] as const,
    order: (cartItemId?: string) => ["cartItems", "order", cartItemId ?? "isChecked"] as const,
  },
  products: {
    all: ["products"] as const,
    list: (params?: unknown) => ["products", params] as const,
    infinite: (category: number | undefined, sort: string | undefined, limit: number) =>
      ["products", category, sort, limit] as const,
    detail: (productId: number) => ["product", productId] as const,
  },
  myProducts: {
    list: (params: unknown) => ["my", "products", params] as const,
  },
  favorites: {
    all: ["favorites"] as const,
    list: (limit: string | number) => ["favorites", limit] as const,
  },
  myOrders: {
    all: ["myOrders"] as const,
    detail: (orderId: string) => ["myOrderDetail", orderId] as const,
  },
  adminOrders: {
    all: ["adminOrders"] as const,
    list: (status: "pending" | "approved") => ["adminOrders", status] as const,
    detailPrefix: ["orderDetail"] as const,
    detail: (orderId: string, status: "pending" | "approved") => ["orderDetail", orderId, status] as const,
  },
  pendingOrders: {
    all: ["pendingOrders"] as const,
    list: (params: { offset: number; limit: number; orderBy: string }) => ["pendingOrders", params] as const,
  },
  budgets: {
    all: ["budgets"] as const,
    company: (companyId?: number) => ["budgets", companyId] as const,
  },
  companyUsers: {
    all: ["companyUsers"] as const,
    list: (name: string) => ["companyUsers", name] as const,
  },
  user: {
    all: ["user"] as const,
  },
  paymentOrder: {
    detail: (orderId: string) => ["order", orderId] as const,
  },
};
