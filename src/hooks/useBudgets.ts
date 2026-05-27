import { useQuery } from "@tanstack/react-query";
import { getBudgets } from "@/lib/api/budgets.api";
import { queryKeys } from "@/lib/queryKeys";
import { useAuth } from "@/providers/AuthProvider";

export const useBudgets = () => {
  const { user } = useAuth();
  const companyId = user?.company?.id;

  return useQuery({
    queryKey: queryKeys.budgets.company(companyId),
    queryFn: () => getBudgets(),
  });
};
