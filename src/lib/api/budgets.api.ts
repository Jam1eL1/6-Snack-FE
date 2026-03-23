import { cookieFetch } from "./fetchClient.api";
import { getUser } from "./user.api";

type TBudgetResponse = {
  currentMonthBudget?: number;
  monthlyBudget?: number;
};

export const getBudgets = async (): Promise<TBudgetResponse> => {
  const currentUser = await getUser();
  const companyId = currentUser.company?.id;

  return cookieFetch(`/admin/${companyId}/budgets`, {
    method: "GET",
  });
};

export const patchBudgets = async (data: { currentMonthBudget: number; monthlyBudget: number }) => {
  const currentUser = await getUser();
  const companyId = currentUser.company?.id;
  return cookieFetch(`/super-admin/${companyId}/budgets`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
};
