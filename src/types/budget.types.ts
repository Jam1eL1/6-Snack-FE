export type TPatchBudgetsResponse = {
  monthlyBudget: number;
  id: number;
  companyId: number;
  currentMonthExpense: number;
  currentMonthBudget: number;
  year: string;
  month: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
};

export type TGetBudgetsResponse = TPatchBudgetsResponse & {
  currentYearTotalExpense: number;
  previousMonthBudget: number;
  previousMonthExpense: number;
  previousYearTotalExpense: number;
};
