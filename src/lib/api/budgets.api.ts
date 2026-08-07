import { TGetBudgetsResponse, TPatchBudgetsResponse } from "@/types/budget.types";
import { cookieFetch } from "./fetchClient.api";

export const getBudgets = async (companyId: number): Promise<TGetBudgetsResponse> => {
  return cookieFetch<TGetBudgetsResponse>(`/admin/${companyId}/budgets`, {
    method: "GET",
  });
};

export const patchBudgets = async (
  companyId: number,
  data: {
    currentMonthBudget: number;
    monthlyBudget: number;
  },
): Promise<TPatchBudgetsResponse> => {
  return cookieFetch<TPatchBudgetsResponse>(`/super-admin/${companyId}/budgets`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
};
