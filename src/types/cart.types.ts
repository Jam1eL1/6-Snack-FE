export type TGetCartItemsParams = {
  cartItemId?: string;
  isChecked?: string;
};

export type TAddToCartResponse = {
  id: number;
  userId: string;
  productId: number;
  quantity: number;
  isChecked: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
};

export type TGetCartItemsResponse = {
  cart: {
    id: number;
    userId: string;
    productId: number;
    quantity: number;
    isChecked: boolean;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
    product: {
      id: number;
      categoryId: number;
      creatorId: string;
      name: string;
      price: number;
      imageUrl: string;
      linkUrl: string;
      cumulativeSales: number;
      createdAt: string;
      updatedAt: string;
      deletedAt: string | null;
    };
  }[];
  budget?: {
    currentMonthBudget: number;
    currentMonthExpense: number;
  };
};
