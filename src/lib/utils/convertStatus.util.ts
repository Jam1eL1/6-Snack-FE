export const convertStatus = (
  raw: string,
): "Pending" | "Request Approved" | "Request Rejected" | "Request Canceled" => {
  switch (raw) {
    case "PENDING":
      return "Pending";
    case "APPROVED":
    case "INSTANT_APPROVED":
      return "Request Approved";
    case "REJECTED":
      return "Request Rejected";
    case "CANCELED":
      return "Request Canceled";
    default:
      return "Pending";
  }
};
