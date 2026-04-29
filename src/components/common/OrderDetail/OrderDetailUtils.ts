// Order status label mapping.
export const getStatusText = (status: string): string => {
  const statusMap: Record<string, string> = {
    PENDING: "Pending",
    APPROVED: "Approved",
    INSTANT_APPROVED: "Instant Approved",
    REJECTED: "Rejected",
    CANCELED: "Canceled",
  };
  return statusMap[status] || status;
};

// Wrap the shared formatter so this detail view can accept nullable dates.
import { formatDate as originalFormatDate } from "@/lib/utils/formatDate.util";

export const formatDate = (dateString: string | undefined | null): string => {
  if (!dateString) return "-";
  try {
    return originalFormatDate(dateString);
  } catch (error) {
    console.error("Date formatting error:", error);
    return "-";
  }
}; 
