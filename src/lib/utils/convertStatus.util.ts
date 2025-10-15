export const convertStatus = (
  raw: string,
): "Pending" | "Request Complete" | "Request Rejected" | "Request Cancelled" => {
  switch (raw) {
    case "PENDING":
      return "Pending";
    case "APPROVED":
    case "INSTANT_APPROVED":
      return "Request Complete";
    case "REJECTED":
      return "Request Rejected";
    case "CANCELED":
      return "Request Cancelled";
    default:
      return "Pending";
  }
};
