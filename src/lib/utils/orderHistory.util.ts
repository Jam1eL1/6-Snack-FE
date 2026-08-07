import type { TOrderSummary } from "@/types/order.types";
import { formatCurrency } from "@/lib/utils/currency.util";
import { formatDate } from "@/lib/utils/formatDate.util";

export type TOrderHistoryRow = {
  id: string;
  requestDate: string;
  requester: string;
  productName: string;
  orderTotal: string;
  approvalDate: string;
  approver: string;
};

export const toOrderHistoryRow = (order: TOrderSummary): TOrderHistoryRow => {
  const orderTotalInCents = order.productsPriceTotal + order.deliveryFee;

  return {
    id: order.id,
    requestDate: formatDate(order.createdAt),
    requester: order.requester,
    productName: order.productName,
    orderTotal: formatCurrency(orderTotalInCents),
    approvalDate: formatDate(order.updatedAt),
    approver: order.approver ?? "-",
  };
};
