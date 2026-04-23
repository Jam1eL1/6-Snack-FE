export type TOrderItem = {
  id: string;
  userId: string;
  productsPriceTotal: number;
  deliveryFee: number;
  createdAt: string;
  status: "PENDING" | "APPROVED" | "REJECTED" | "CANCELED";
  receipts: {
    productName: string;
    imageUrl: string;
    quantity: number;
  }[];
};
