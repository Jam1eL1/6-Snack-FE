export type TOrderItem = {
  id: string;
  userId: string;
  productsPriceTotal: number;
  deliveryFee: number;
  createdAt: string;
  status: "PENDING" | "APPROVED" | "REJECTED" | "CANCELED" | "INSTANT_APPROVED";
  receipts: {
    productName: string;
    imageUrl: string;
    quantity: number;
  }[];
};
